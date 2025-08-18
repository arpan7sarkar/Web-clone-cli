# Web Clone CLI

An interactive Node.js CLI to clone static websites. It discovers internal links, downloads HTML/CSS/JS/images, rewrites asset references to local files, and saves everything to a folder like `<domain>-clone`.

The CLI supports English and Hindi, and guides you step-by-step with a friendly, colorful TUI.

---

## Features

- Multi-page discovery using internal links on the root page
- Rewrites `<link>`, `<script>` and `<img>` to local assets
- Saves assets into `css/`, `js/`, and `images/` subfolders
- Interactive prompts with language selection (English/Hindi)
- Works on Windows, macOS, and Linux (commands executed in Node)

---

## Prerequisites

- Node.js 18+ (required by modern ESM packages like `chalk` and `@inquirer/*`)
- Internet connectivity to fetch the target website

Optional (for the reasoning agent that orchestrates the tools):
- An OpenAI-compatible API endpoint (Gemini-compatible) and key

---

## Installation

You can use it via npx (no install) or install globally.

### Use via npx

```
npx chai-code-cli
```

### Install globally

```
npm i -g chai-code-cli
chai-code-cli
```

If your shell cannot find the command after a global install, ensure your global npm bin directory is on PATH.

---

## Environment Variables

Some flows in the CLI use an LLM agent to plan steps and call tools. For that, set the following in a `.env` at the project root (or set them in your environment). Use `example.env` as a template.

```
GEMINI_API_KEY=your_api_key_here
BASE_URL=https://your-openai-compatible-endpoint/v1
MODEL=gemini-2.5-flash
```

- `GEMINI_API_KEY`: API key for your provider
- `BASE_URL`: OpenAI-compatible base URL of your provider
- `MODEL`: Model name; defaults to `gemini-2.5-flash` if omitted

If you only plan to use the simple scraping capability driven by prompts, you should still define these keys because the CLI validates them on start.

---

## Quick Start

1) Create a `.env` file from `example.env` and fill values.

2) Run the CLI:

```
npx chai-code-cli
# or
chai-code-cli
```

3) In the TUI:

- Select your language
- Enter your query, for example: “Clone https://example.com/”

The CLI will plan steps and use its built-in `scraper` to:

- Fetch the root page
- Discover internal links on the same domain
- Download each page and assets
- Rewrite references to local `css/`, `js/`, and `images/`
- Save to `<domain>-clone/` (e.g., `example-clone/`)

---

## Usage Examples

- Clone a site (English):

```
Query: Clone https://example.com/
```

- Clone a site (Hindi):

```
Query: Website ko clone kare https://example.com/
```

Output structure (example):

```
example-clone/
  index.html
  about.html
  css/
    index-style0.css
    index-inline-style0.css
  js/
    index-script0.js
  images/
    index-image0.png
```

Notes:

- Internal links are discovered from the root page and validated before scraping
- External links (`http`, `mailto:`, `tel:`) are ignored
- Links to `/` are rewritten to `/<folder>/index.html` and opened in a new tab when clicked

---

## Limitations and Legal Notice

- Designed for static sites; dynamic content behind client-side rendering, auth, or APIs may not clone fully
- Respect website Terms of Service and robots.txt. Only clone sites you own or are authorized to copy
- Use responsibly; you are solely responsible for how you use this tool

---

## Troubleshooting

- Missing API config error
  - Ensure `.env` exists with `GEMINI_API_KEY` and `BASE_URL`
  - Copy from `example.env`

- Node ESM/Import errors
  - Use Node 18+
  - This project is ESM-first; ensure your Node version supports modern ESM syntax

---

## Development

- Clone this repository
- Run `npm install` to install dependencies
- Run `npm run dev` for hot-reload development (nodemon)
- Run `npm start` to start the CLI normally

---

## License

ISC License

Copyright (c) 2025 Arpan Sarkar

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
