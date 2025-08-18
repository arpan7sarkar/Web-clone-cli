#!/usr/bin/env node
import { select, input, confirm } from "@inquirer/prompts";
import figlet from "figlet";
import gradient from "gradient-string";
import ora from "ora";
import chalk from "chalk";
import { askQuery } from "./ask.js";

export const spinner = ora({ color: "blue" });

async function run() {
  console.clear();

  // Animated and gradient title
  const title = figlet.textSync("Web Clone CLI", { horizontalLayout: "full" });
  console.log(gradient.pastel.multiline(title));
  console.log(gradient.passion("✨ Welcome to the Web Clone CLI ✨\n"));

  let keepRunning = true;

  while (keepRunning) {
    console.log(chalk.white("─────────────────────────────────────────────"));

    // Choose Language
    const language = await select({
      message: chalk.cyan.bold("🌐 Choose Language:"),
      choices: [
        { name: "English", value: "en" },
        { name: "Hindi", value: "hi" },
      ],
      default: "en",
    });

    // Ask user query
    const message = await input({
      message:
        language === "hi"
          ? chalk.yellowBright.bold("👉 Hanji🤓 Batayien aj apke liye kya madat kare🤔:")
          : chalk.yellowBright.bold("👉 Enter your Query:"),
    });

    console.log(
      language === "hi"
        ? chalk.cyanBright(`\n🌐 Kuch der sochne do: "${message}"...\n`)
        : chalk.cyanBright(`\n🌐 Analyzing: "${message}"...\n`)
    );

    try {
      const result = await askQuery(message, language);
      console.log(
        language === "hi"
          ? chalk.blueBright("😁 Kaam ho gaya! ")
          : chalk.blueBright("😁 Done! ")
      );
      if (result) console.log(result);
    } catch (err) {
      console.log(
        language === "hi"
          ? chalk.redBright(`❌ Kuch to garbar heh re bawa: ${err.message}`)
          : chalk.redBright(`❌ Error: ${err.message}`)
      );
    }

    console.log(chalk.whiteBright("─────────────────────────────────────────────"));

    // Ask if user wants to continue
    const again = await confirm({
      message: chalk.yellowBright("🔁 Do you want to ask another query?"),
      default: true,
    });

    keepRunning = again;
    console.clear();
  }

  console.log(gradient.fruit("\n👋 Bye! Thanks for using Web Clone CLI."));
}

run();