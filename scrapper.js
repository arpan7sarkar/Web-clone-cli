import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import path from "path";

export async function scrapeWebsite(url, slug = "index", folderName) { 
  // 🚀🚀🚀 Let's blast off and scrape the website! 🚀🚀🚀
  const response = await fetch(url);
  const html = await response.text();

  const dom = new JSDOM(html);
  const document = dom.window.document;

  let cssFiles = [],jsFiles = [],imageFiles = [];

  const links = [...document.querySelectorAll('link[rel="stylesheet"]')];
  let cssIndex = 0;
  for (const link of links) {
    const href = link.href;
    if (!href) continue;
    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;

    try {
      const res = await fetch(fullUrl);
      const cssContent = await res.text();
      const localFile = `css/${slug}-style${cssIndex}.css`; 
      cssFiles.push({ filename: localFile, content: cssContent });

      link.href = localFile;
      cssIndex++;
    } catch (err) {
      console.error("❌ Error fetching CSS:", fullUrl, err.message); // 😱 Failed to fetch CSS!
    }
  }

  const inlineStyles = [...document.querySelectorAll("style")];
  for (let i = 0; i < inlineStyles.length; i++) {
    const styleTag = inlineStyles[i];
    const localFile = `css/${slug}-inline-style${i}.css`; 
    cssFiles.push({ filename: localFile, content: styleTag.textContent });

    const linkEl = document.createElement("link");
    linkEl.rel = "stylesheet";
    linkEl.href = localFile;
    styleTag.replaceWith(linkEl);
  }

  const scripts = [...document.querySelectorAll("script[src]")];
  let jsIndex = 0;
  for (const script of scripts) {
    const src = script.src;
    if (!src) continue;
    const fullUrl = src.startsWith("http") ? src : new URL(src, url).href;

    try {
      const res = await fetch(fullUrl);
      const jsContent = await res.text();
      const localFile = `js/${slug}-script${jsIndex}.js`; 
      jsFiles.push({ filename: localFile, content: jsContent });

      script.src = localFile;
      jsIndex++;
    } catch (err) {
      console.error("❌ Error fetching JS:", fullUrl, err.message); // 😱 Failed to fetch JS!
    }
  }

  const images = [...document.querySelectorAll("img")];
  let imgIndex = 0;
  for (const img of images) {
    const srcAttr = img.getAttribute("src");
    if (!srcAttr) continue;

    const fullUrl = srcAttr.startsWith("http")
      ? srcAttr
      : new URL(srcAttr, url).href;

    try {
      const res = await fetch(fullUrl);
      const buffer = await res.arrayBuffer();

      let ext = path.extname(new URL(fullUrl).pathname);
      if (!ext) ext = ".png"; 
      const filenameOnly = `${slug}-image${imgIndex}${ext}`; 
      const localFile = `images/${filenameOnly}`;
      imageFiles.push({ filename: localFile, content: Buffer.from(buffer) });

      // update src
      img.setAttribute("src", localFile);
      img.removeAttribute("srcset");
      img.removeAttribute("data-nimg");

      imgIndex++;
    } catch (err) {
      console.error("❌ Error fetching Image:", fullUrl, err.message); // 😱 Failed to fetch Image!
    }
  }


  const pageLinks = [...document.querySelectorAll("a")];
  for (const link of pageLinks) {
    let srcAttr = link.getAttribute("href");
    if (!srcAttr) continue;

    // skip external links
    if (srcAttr.startsWith("http") || srcAttr.startsWith("mailto:") || srcAttr.startsWith("tel:")) continue;

    if (srcAttr === "/") {
      link.setAttribute("href", `/${folderName}/index.html`);
      link.setAttribute("target", "_blank");
    } else {

      srcAttr = srcAttr.replace(/^\//, "");

      if (!srcAttr.endsWith(".html")) {
        srcAttr = `${srcAttr}.html`;
      }
      link.setAttribute("href", `/${folderName}/${srcAttr}`);
      link.setAttribute("target", "_blank");
    }
  }


  const updatedHtml = dom.serialize();
  return { html: updatedHtml, cssFiles, jsFiles, imageFiles };
}