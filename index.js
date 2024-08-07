import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { queryOpenAi, queryGemini, queryLLama, queryClaude } from "./models.js";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cors());

app.post("/query-llm", async (req, res) => {
  console.log("query");
  const { prompt, model } = req.body;

  if (!prompt || !model)
    return res.status(400).json({ error: `Prompt and model is required` });

  try {
    let response;
    switch (model) {
      case "gpt":
        response = await queryOpenAi(prompt);
        break;
      case "gemini":
        response = await queryGemini(prompt);
        break;
      case "llama":
        response = await queryLLama(prompt);
        break;
      case "claude":
        response = await queryClaude(prompt);
        break;
      default:
        throw new Error("unsupported model type");
    }
    res.json(response);
  } catch (error) {
    console.log(`Error ${error}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
