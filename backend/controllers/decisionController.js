// backend/controllers/decisionController.js
const Groq = require("groq-sdk");
const prisma = require("../config/prismaClient");
const { updateLifecycleStates } = require("../services/lifecycleManager");
const { retrieveMemories } = require("../services/retrievalEngine");
const { scoreMemories } = require("../services/relevanceEngine");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * POST /api/decision — process an invoice and return an AI decision.
 */
const makeDecision = async (req, res) => {
  try {
    const { supplierId, invoiceAmount, invoiceDate, description } = req.body;

    if (!supplierId || !invoiceAmount || !invoiceDate || !description) {
      return res.status(400).json({
        error:
          "supplierId, invoiceAmount, invoiceDate, and description are required.",
      });
    }

    // 0. Verify supplier exists
    const supplier = await prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) {
      return res.status(404).json({
        error: "Supplier not found. Please refresh the page and try again.",
      });
    }

    // 1. Update lifecycle states
    await updateLifecycleStates(supplierId);

    // 2. Retrieve memories
    const rawMemories = await retrieveMemories(supplierId);

    // 3. Score and rank top 5
    const topMemories = scoreMemories(rawMemories);

    // 3.5. Detect Conflicts
    let conflictFlag = false;

    // Simple heuristic: If we have multiple memories of the same type but different polarity/age
    // (e.g. good delivery recently vs bad delivery historically)
    const typesSeen = new Set();
    const duplicateTypes = new Set();

    topMemories.forEach((m) => {
      if (typesSeen.has(m.type)) duplicateTypes.add(m.type);
      typesSeen.add(m.type);
    });

    if (duplicateTypes.size > 0 && topMemories.length > 1) {
      conflictFlag = true;
    }

    // 4. Build prompt
    let memoriesBlock = "No historical memories found for this supplier.";
    if (topMemories.length > 0) {
      memoriesBlock = topMemories
        .map(
          (m, i) =>
            `${i + 1}. [${m.type}] (relevance: ${m.relevanceScore}, state: ${m.lifecycleState}): ${m.content}`,
        )
        .join("\n");
    }

    const prompt = `You are a STRICT business decision AI. Your job is to PROTECT the company by rejecting high-risk invoices.
 
 Invoice Details:
 - Supplier ID: ${supplierId}
 - Amount: ${invoiceAmount}
 - Date: ${invoiceDate}
 - Description: ${description}
 
 Relevant Historical Memories (scored by recency and importance):
 ${memoriesBlock}
 
 DECISION CRITERIA:
 1. **REJECT**: Use this if there is a RECENT (last 30 days) critical failure, high defect rate (>20%), or if the current invoice description matches a known historical failure.
 2. **HOLD**: Use this ONLY if there is a conflict and the risk is moderate.
 3. **APPROVE**: Use this only if history is clean or evergreen performance has resolved old issues.
 
 CRITICAL RULES:
 - If a "CRITICAL FAILURE" or "45% contamination" is in the memories from the last 10 days, you MUST "REJECT".
 - High amount (${invoiceAmount}) + History of damage/defects = MANDATORY REJECT.
 
 Respond in this exact JSON format with no extra text:
 {
   "decision": "APPROVE" | "HOLD" | "REJECT",
   "explanation": "One short direct sentence. No diplomatic fluff."
 }`;

    // 5. Call Groq LLM
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 300,
    });

    const rawText = response.choices[0]?.message?.content || "";

    // Strip markdown code fences if present
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error("Failed to parse Groq response:", rawText);
      return res.status(500).json({
        error: "AI returned an unparseable response. Please try again.",
        rawResponse: rawText,
      });
    }

    // 6. Save invoice
    await prisma.invoice.create({
      data: {
        supplierId,
        amount: Number(invoiceAmount),
        date: new Date(invoiceDate),
        description: description || "",
        status: parsed.decision.toLowerCase(),
      },
    });

    // 7. Return result
    return res.json({
      decision: parsed.decision,
      explanation: parsed.explanation,
      memoriesUsed: topMemories.map((m) => ({
        id: m.id,
        type: m.type,
        content: m.content,
        relevanceScore: m.relevanceScore,
        lifecycleState: m.lifecycleState,
        isEvergreen: m.isEvergreen,
        createdAt: m.createdAt,
      })),
      conflictFlag: conflictFlag,
    });
  } catch (error) {
    console.error("Error processing decision:", error);
    res.status(500).json({ error: "Failed to process decision." });
  }
};

module.exports = { makeDecision };
