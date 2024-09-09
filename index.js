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
  const { prompt, model } = req.body;

  if (!prompt || !model)
    return res.status(400).json({ error: `Prompt and model is required` });

  const retries = 2;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      console.log(`${getTime()} - querying ${model}`);

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
      return;
    } catch (error) {
      console.log(`Error ${error}`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      continue;
    }
  }
  console.log(`Gave up trying to query ${model}`);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const getTime = () => {
  let currentTime = new Date();
  let hours = currentTime.getHours();
  let minutes = currentTime.getMinutes();
  let seconds = currentTime.getSeconds();

  let formattedTime = `${hours}:${minutes}:${seconds}`;

  return formattedTime;
};
