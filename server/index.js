import "dotenv/config";
import cors from "cors";
import express from "express";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 8787;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;
const model = process.env.OPENAI_MODEL || "gpt-5.2";

app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    openaiConfigured: Boolean(openai),
    model
  });
});

app.post("/api/ai/chat", async (request, response) => {
  try {
    if (!openai) {
      return response.status(503).json({ error: "OPENAI_API_KEY is not configured." });
    }

    const { messages = [], snapshot } = request.body || {};
    const prompt = [
      {
        role: "system",
        content:
          "You are a precise JEE study coach. Answer doubts clearly, use the provided study snapshot to personalize advice, and keep responses concise but actionable."
      },
      {
        role: "user",
        content: `Study snapshot:\n${JSON.stringify(snapshot, null, 2)}\n\nConversation:\n${messages
          .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
          .join("\n")}`
      }
    ];

    const aiResponse = await openai.responses.create({
      model,
      input: prompt
    });

    response.json({
      reply: aiResponse.output_text || "No response text was returned."
    });
  } catch (error) {
    response.status(500).json({
      error: error.message || "Unknown AI chat error."
    });
  }
});

app.post("/api/ai/analyze", async (request, response) => {
  try {
    if (!openai) {
      return response.status(503).json({ error: "OPENAI_API_KEY is not configured." });
    }

    const { snapshot, trigger } = request.body || {};

    const aiResponse = await openai.responses.create({
      model,
      input: [
        {
          role: "system",
          content:
            "You are an expert JEE study analyst. Return JSON with keys summary, priorities, notes, mistakes. priorities and mistakes must be arrays of objects. Keep priorities focused on high-impact ignored chapters."
        },
        {
          role: "user",
          content: `Trigger: ${trigger}\nStudy snapshot:\n${JSON.stringify(snapshot, null, 2)}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "study_coach_report",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              priorities: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    reason: { type: "string" }
                  },
                  required: ["title", "reason"]
                }
              },
              notes: {
                type: "array",
                items: { type: "string" }
              },
              mistakes: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    title: { type: "string" },
                    note: { type: "string" },
                    accuracy: { type: "number" },
                    date: { type: "string" }
                  },
                  required: ["title", "note", "accuracy", "date"]
                }
              }
            },
            required: ["summary", "priorities", "notes", "mistakes"]
          }
        }
      }
    });

    response.json({
      report: {
        generatedAt: new Date().toISOString(),
        ...JSON.parse(aiResponse.output_text)
      }
    });
  } catch (error) {
    response.status(500).json({
      error: error.message || "Unknown AI analysis error."
    });
  }
});

app.listen(port, () => {
  console.log(`WBJEE AI server running on http://localhost:${port}`);
});
