import OpenAI from "openai";
import dotenv from 'dotenv'
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";
import { executeCommand,inquiry, scraper } from "./tools.js";

dotenv.config({ path: './.env' })
if (!process.env.GEMINI_API_KEY || !process.env.BASE_URL) {
  throw new Error(
    "Missing API configuration. Please set GEMINI_API_KEY and BASE_URL in a .env file at the project root."
  );
}

const client = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: process.env.BASE_URL,
});

const ResponseEvent = z.object({
  step: z.enum(["START", "THINK", "OUTPUT", "OBSERVE", "TOOL"]),
  tool_name: z.string().nullable(),
  content: z.string(),
  input: z.string().nullable(),
});


//Tools
const TOOL_MAP = {
  executeCommand: executeCommand,
  scraper: scraper,
  inquiry: inquiry,
};

const System = `
You are a powerful and intelligent developer assistant created by Arpan Sarkar, known as Web Clone CLI. You specialize in cloning websites, and executing terminal commands. For any user query, you must first think carefully and break the problem down into smaller, manageable sub-problems. Always reason thoroughly before providing any response. Keep thinking and analyzing the problem before giving the actual output.Before outputing the final result to user you must check once if everything is correct.
You also have list of available tools that you can call based on user query.
    
For every tool call that you make, wait for the OBSERVATION from the tool which is the
response from the tool that you called.

Available Tools For Use :
  - inquiry(query:string): Ask from user 
  - executeCommand(command: string): Takes a linux / unix command for creating the project folder and files
  - scraper(url: string): Takes a URL as input, scrapes the site, and saves files in a folder named after the domain

 Strictly Follow Rules:
    - Strictly follow the output JSON format that i can use directly in js
    - Always follow the output in sequence that is START, THINK, OBSERVE and OUTPUT.
    - Always perform only one step at a time and wait for other step.
    - Alway make sure to do multiple steps of thinking before giving out output.
    - For every tool call always wait for the OBSERVE which contains the output from tool
    - For executing commands, always use the executeCommand tool and command must be support on Windows.
    - You are always on Node Environment
    - If you need any question run inquiry(query:string) tool for that after that you will show output

  Output JSON Format:
    { "step": "START | THINK | OUTPUT | OBSERVE | TOOL" , "content": "string", "tool_name": "string", "input": "STRING" }

   Example for Language en:
    User: "Clone the websi url"
    ASSISTANT: { "step": "START", "content": "Oke You have provided me this url https://www.example.com/" }
    ASSISTANT: { "step": "THINK", "content": "I see that there is a tool available scraper which help to create scrap the website" }
    ASSISTANT: { "step": "THINK", "content": "Ok I will run scraper tool to get your content" }
    ASSISTANT: { "step": "THINK", "content": "I think it will take some time to get your content" }
    ASSISTANT: { "step": "THINK", "content": "I have to make some inquiry please answer them" }
    ASSISTANT: { "step": "TOOL", "input": "https://www.example.com/", "tool_name": "scraper" }
    DEVELOPER: { "step": "OBSERVE", "content": "Ok your work is almost done your file is here example-clone" }
    ASSISTANT: { "step": "THINK", "content": "Thanks for wating " }
    ASSISTANT: { "step": "OUTPUT", "content": "Website cloned successfully" }

    Example for Language hi:
    User: "Website ko clone kare"
    ASSISTANT: { "step": "START", "content": "Hanji to apka url kuch aisa heh🤔 https://www.example.com/" }
    ASSISTANT: { "step": "THINK", "content": "Accha ji to isko clone karna heh mujhe 🤔, Clone karne ke liye to website ko scrap karna padega🤓" }
    ASSISTANT: { "step": "THINK", "content": "Mujhe ak tool dikh raha heh scrapper karke usko use karenge scraping ke liye😁" }
    ASSISTANT: { "step": "THINK", "content": "Chalo abh scrapper tool ko run karte " }
    ASSISTANT: { "step": "TOOL", "input": "https://www.example.com/", "tool_name": "scraper" }
    DEVELOPER: { "step": "OBSERVE", "content": "Sirji apka kam to hoh gaya and save hoga example-clone folder meh 🎉" }
    ASSISTANT: { "step": "THINK", "content": "Chalo is session ke liye itna hi🤓" }
    ASSISTANT: { "step": "OUTPUT", "content": "Chalo abka website ready abh jake thoda chai pike aaoo🍵☕" }

`

export const askQuery = async (message, language) => {

  const messages = [
    { role: "system", content: System },
    {
      role: "user",
      content: `Language: ${language}\nUser Query: ${message}`,
    },
  ];

  while (true) {
    // Call model with basic retry on transient server errors
    const model = process.env.MODEL || 'gemini-2.5-flash';
    let response;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        // First try with response_format (Zod)
        try {
          response = await client.chat.completions.create({
            model,
            messages,
            response_format: zodResponseFormat(ResponseEvent, "response"),
          });
        } catch (innerErr) {
          const innerStatus = innerErr?.status ?? innerErr?.response?.status;
          // Some OpenAI-compatible endpoints may not support response_format; fallback without it
          if (innerStatus >= 400) {
            response = await client.chat.completions.create({ model, messages });
          } else {
            throw innerErr;
          }
        }
        break; // success
      } catch (err) {
        const status = err?.status ?? err?.response?.status;
        const isServerError = status >= 500 || status === undefined; // some SDK errors don't expose status
        if (attempt < 3 && isServerError) {
          const waitMs = attempt * 500;
          await new Promise(r => setTimeout(r, waitMs));
          continue;
        }
        throw err;
      }
    }
    // Robustly extract content as string
    const msg = response?.choices?.[0]?.message ?? {};
    let rawContent = msg.content;
    if (Array.isArray(rawContent)) {
      rawContent = rawContent.map(p => (typeof p === 'string' ? p : p?.text ?? '')).join('').trim();
    }
    if (typeof rawContent !== 'string') rawContent = String(rawContent ?? '');

    let parsedContent;
    try {
      parsedContent = JSON.parse(rawContent);
    } catch (e) {
      console.log("⚠️ Model returned non-JSON or invalid JSON:", rawContent);
      // Ask model to strictly respond with valid JSON next turn
      messages.push({
        role: 'developer',
        content: 'Please respond again strictly as valid JSON matching the schema with keys: step, content, tool_name, input. Do not include any extra text.'
      });
      continue;
    }
    console.log(parsedContent);

    messages.push({
      role: 'assistant',
      content: JSON.stringify(parsedContent),
    });

    if (parsedContent.step === 'START') {
      console.log(`🔥`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === 'THINK') {
      console.log(`\n🧠`, parsedContent.content);
      continue;
    }

    if (parsedContent.step === 'TOOL') {
      const toolToCall = parsedContent.tool_name;
      if (!TOOL_MAP[toolToCall]) {
        messages.push({
          role: 'developer',
          content: `There is no such tool as ${toolToCall}`,
        });
        continue;
      }
      const responseFromTool = await TOOL_MAP[toolToCall](parsedContent.input);

      console.log(
        `🛠️: ${toolToCall}(${parsedContent.input}) = `,
        responseFromTool
      );
      messages.push({
        role: 'developer',
        content: JSON.stringify({ step: 'OBSERVE', content: responseFromTool }),
      });
      continue;
    }

    if (parsedContent.step === 'OUTPUT') {
      return parsedContent.content;
    }
  };

}