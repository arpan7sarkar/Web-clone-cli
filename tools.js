import path from "path";
import fs from "fs/promises";
import { exec } from "child_process";
import { scrapeWebsite } from "./scrapper.js";
import axios from "axios";
import { getAllLinks } from "./getLinks.js";
import chalk from "chalk";
import { input as promptInput } from "@inquirer/prompts";


//for executing the command
export async function executeCommand(cmd = '') {
  return new Promise((res, rej) => {
    exec(cmd, (error, data) => {
      if (error) {
        return res(`Error running command ${error}`);
      } else {
        res(data);
      }
    });
  });
}

//for scraping the site also save
export async function scraper(url) {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.replace("www.", "");
    const folderName = `${hostname.split(".")[0]}-clone`;
    const allLinks = await getAllLinks(url);

    if (allLinks.length >= 1) {
      for (const link of allLinks) {
        console.log(`🌐 Found link: ${link}`);
        const slug = link.replace(/.*\/([^\/]+)\/?$/, "$1") || "index";
        console.log(`⚙️ Scraping that page ${link}`);

        const { html, cssFiles, jsFiles, imageFiles = [] } = await scrapeWebsite(link, slug, folderName);

        await fs.mkdir(folderName, { recursive: true });
        const fileName = slug.startsWith('www') ? 'index' : slug;
        // Save HTML
        await fs.writeFile(
          path.join(folderName, fileName + ".html"),
          html
        );

        // Save CSS
        await fs.mkdir(path.join(folderName, "css"), { recursive: true });
        for (let i = 0; i < cssFiles.length; i++) {
          await fs.writeFile(
            path.join(folderName, cssFiles[i].filename),
            cssFiles[i].content
          );
        }

        // Save JS
        await fs.mkdir(path.join(folderName, "js"), { recursive: true });
        for (let i = 0; i < jsFiles.length; i++) {
          await fs.writeFile(
            path.join(folderName, jsFiles[i].filename),
            jsFiles[i].content
          );
        }

        // Save images
        await fs.mkdir(path.join(folderName, "images"), { recursive: true });
        for (let i = 0; i < imageFiles.length; i++) {
          const filePath = path.join(folderName, imageFiles[i].filename);
          await fs.writeFile(filePath, imageFiles[i].content);
        }
      }
    }

    return `✅ Successfully scraped and saved website to folder '${folderName}'`;
  } catch (error) {
    return `❌ Error during scraping or file writing: ${error.message}`;
  }
}
//for user inquiry
export const inquiry = async (query) => {
  const message = await promptInput({
    message: chalk.greenBright(query),
  });
  return message;
}
