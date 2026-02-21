const Groq = require("groq-sdk");
const { getMemoriesForSupplier } = require("../services/retrievalEngine");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// POST /api/decision
const processInvoice = async (req, res) => {
    try {
        const { supplierId, amount, description, date } = req.body;

        // Validate required fields
        if (!supplierId || !amount || !description || !date) {
            return res.status(400).json({
                error: "supplierId, amount, description, and date are required.",
            });
        }

        // 1. Get Context (Memories)
        const { memories, conflictFlag } = await getMemoriesForSupplier(supplierId);

        // Format memories for the prompt
        let formattedMemories = "No historical memories found for this supplier.";
        if (memories && memories.length > 0) {
            formattedMemories = memories
                .map(
                    (m, index) =>
                        `${index + 1}. [${m.type.toUpperCase()}, score: ${m.finalScore || m.importanceScore
                        }] ${m.content}`
                )
                .join("\n");
        }

        // 2. Build Prompt
        const prompt = `You are a business decision AI for invoice processing.

Invoice: ₹${amount} from Supplier ${supplierId} on ${date}
Description: ${description}

Relevant history:
${formattedMemories}

Based on this context, recommend ONE of: APPROVE, HOLD, or REJECT.
Then explain your reasoning in 2-3 sentences.

Format your response as:
DECISION: [APPROVE/HOLD/REJECT]
EXPLANATION: [your reasoning]`;

        // 3. Call Groq LLM API
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [{ role: "user", content: prompt }],
            max_tokens: 300,
            temperature: 0.1, // Low temperature for consistent formatting
        });

        const llmResponseText = response.choices[0]?.message?.content || "";

        // 4. Parse Response
        let decision = "HOLD"; // Default fallback
        let explanation = "Failed to parse a clear explanation from the AI.";

        // Basic regex/string extraction
        const decisionMatch = llmResponseText.match(/DECISION:\s*(APPROVE|HOLD|REJECT)/i);
        const explanationMatch = llmResponseText.match(/EXPLANATION:\s*(.*)/is);

        if (decisionMatch && decisionMatch[1]) {
            decision = decisionMatch[1].toUpperCase();
        }

        if (explanationMatch && explanationMatch[1]) {
            explanation = explanationMatch[1].trim();
        } else {
            // Fallback if formatting isn't perfect
            explanation = llmResponseText.replace(/DECISION:\s*(APPROVE|HOLD|REJECT)/i, "").trim();
        }

        // Include the original NLP string if both extractors failed entirely
        if (!decisionMatch && !explanationMatch) {
            explanation = llmResponseText;
        }

        // 5. Return Output
        return res.json({
            decision,
            explanation,
            memoriesUsed: memories.length,
            conflictFlag,
        });
    } catch (error) {
        console.error("Error processing decision:", error);
        res.status(500).json({ error: "Failed to process decision." });
    }
};

module.exports = {
    processInvoice,
};
