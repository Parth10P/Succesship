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

    // 1. Update lifecycle states
    await updateLifecycleStates(supplierId);

    // 2. Retrieve memories
    const rawMemories = await retrieveMemories(supplierId);

    // 3. Score and rank top 5
    const topMemories = scoreMemories(rawMemories);

    // 4. Build prompt
    let memoriesBlock = "No historical memories found for this supplier.";
    if (topMemories.length > 0) {
      memoriesBlock = topMemories
        .map(
          (m, i) =>
            `${i + 1}. [${m.type}] (relevance: ${m.relevanceScore}, state: ${m.lifecycleState}): ${m.content}`
        )
        .join("\n");
    }

    const prompt = `You are a business decision AI for invoice processing.

Invoice Details:
- Supplier ID: ${supplierId}
- Amount: ${invoiceAmount}
- Date: ${invoiceDate}
- Description: ${description}

Relevant Historical Memories (scored by recency and importance):
${memoriesBlock}

If there are no memories, base your decision only on the invoice details.

Based on the invoice and the supplier's history, make a decision.

Respond in this exact JSON format with no extra text:
{
  "decision": "APPROVE" | "HOLD" | "REJECT",
  "explanation": "2 to 3 sentence explanation referencing specific memories that influenced the decision."
}`;

    // 5. Call Groq LLM
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
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
        createdAt: m.createdAt,
      })),
    });
  } catch (error) {
    console.error("Error processing decision:", error);
    res.status(500).json({ error: "Failed to process decision." });
  }
};

module.exports = { makeDecision };
