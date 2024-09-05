import { GoogleGenerativeAI } from "@google/generative-ai";
import LlamaAI from "llamaai";
import Anthropic from "@anthropic-ai/sdk";
import axios from "axios";

const queryOpenAi = async (prompt) => {
  const apiKey = process.env.OPENAI_API_KEY;
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    // console.log("message content", response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error querying OpenAI API: ", error);
    return null;
  }
};

const queryGemini = async (prompt) => {
  const apiKey = process.env.GEMINI_API_KEY;
  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const result = await model.generateContent(prompt);

    // Check for data property
    if (!result.response) {
      console.error("Missing data property in response");
      return null; // Or handle the error differently
    }

    // Check for candidates array (optional)
    const candidates = result.response.candidates || [result.response]; // Use default if missing

    // Check for content and parts (if applicable)
    const content = candidates[0]?.content;
    const parts = content?.parts;

    // Extract text if possible
    const text = parts?.[0]?.text;

    // console.log("text", text);

    return text || ""; // Return empty string if text is missing
  } catch (error) {
    console.error("Error querying Gemini API");
    throw error;
  }
};

const queryLLama = async (prompt) => {
  const apiKey = process.env.LLAMA_API_KEY;
  try {
    // cheap model: llama3.1-8b
    // expensive model: llama3.1-405b
    const llamaAPI = new LlamaAI(apiKey);
    const apiRequestJson = {
      model: "llama3.1-405b",
      messages: [{ role: "user", content: prompt }],
      stream: false,
      function_call: "get_current_weather",
    };
    const response = await llamaAPI.run(apiRequestJson);
    const message = response.choices[0].message.content;
    // console.log("message", message);
    return message;
  } catch (error) {
    console.error("Error querying Llama API: ", error);
  }
};

const queryClaude = async (prompt) => {
  const apiKey = process.env.CLAUDE_API_KEY;
  try {
    const client = new Anthropic({
      apiKey: apiKey,
    });
    const message = await client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1000,
      temperature: 0,
      system: "",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // console.log("message", message.content[0].text);
    return message.content[0].text;
  } catch (error) {
    console.error("Error querying Claude API: ", error);
  }
};

export { queryOpenAi, queryGemini, queryLLama, queryClaude };
