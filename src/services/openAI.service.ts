import fetch from "node-fetch";
import { getConfig } from "../utils/config";

export const sendToOpenAI = async (prompt: string) => {
  const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getConfig("OPENAI_API_KEY")}`,
      },
      body: prompt,
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error from OpenAI: ${response.status} ${errorData}`);
    }
    const data = await response.json();
    console.log(data.choices[0].message);
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Failed to send data to OpenAI:", error);
    throw new Error("Failed to communicate with OpenAI API");
  }
};
