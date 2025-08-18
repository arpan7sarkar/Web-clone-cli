import fetch from "node-fetch";
import { JSDOM } from "jsdom";

export const getAllLinks = async (url) => {
  const response = await fetch(url);
  const html = await response.text();
  const allLinks = [];
  const confirmLinks = [];
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const pageLinks = [...document.querySelectorAll("a")];

  if(pageLinks.length === 0){
    confirmLinks.push(url);
    return confirmLinks;
  }
  for (const link of pageLinks) {
    let srcAttr = link.getAttribute("href");
    if (!srcAttr) continue;

    // Skip external links
    if (srcAttr.startsWith("http")) continue;

    // 🔗 Remove leading slash
    srcAttr = srcAttr.replace(/^\//, "");

    allLinks.push(srcAttr);
  }

  // 🔗 Deduplicate links
  const uniqueLinks = [...new Set(allLinks)];

  for (const link of uniqueLinks) {
    const finalUrl = `${url}${link}`;
    console.log(`🔗 Checking link: ${finalUrl}`);

    try {
      const res = await fetch(finalUrl);
      if (res.ok) {
        confirmLinks.push(finalUrl);
      } else {
        console.log(`❌ Invalid link: ${finalUrl} (status: ${res.status})`);
      }
    } catch (err) {
      console.error(`⚠️ Error fetching ${finalUrl}:`, err.message);
    }
  }

  return confirmLinks;
};