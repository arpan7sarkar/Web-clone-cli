# 🌐 Web Clone CLI ⚡

> 🚀 **Lightning-fast website cloning tool** that discovers, downloads, and recreates static websites with just one command!

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js)
![Platform](https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square)
![License](https://img.shields.io/badge/License-ISC-yellow?style=flat-square)

An intelligent Node.js CLI that clones static websites by discovering internal links, downloading all assets (HTML/CSS/JS/images), and creating a perfect local replica. Features multilingual support (🇬🇧 English / 🇮🇳 Hindi) with an intuitive, colorful interface!

---

<img width="1866" height="1088" alt="Screenshot 2025-08-18 143454" src="https://github.com/user-attachments/assets/2793b4ea-d506-46b2-90f0-4f9848f899a2" />

## ✨ Key Features

🔍 **Smart Discovery** - Automatically finds and maps internal links  
📁 **Organized Structure** - Saves assets in clean `css/`, `js/`, `images/` folders  
🔗 **Link Rewriting** - Converts all references to work locally  
🌍 **Multilingual** - Interactive prompts in English and Hindi  
🎨 **Beautiful TUI** - Colorful, user-friendly terminal interface  
⚡ **Cross-Platform** - Works seamlessly on Windows, macOS, and Linux  
🤖 **AI-Powered** - Uses LLM agent for intelligent workflow orchestration

---

## 🛠️ Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| 📦 **Node.js** | 18+ | Required for modern ESM packages |
| 🌐 **Internet** | Active | Fetching target websites |
| 🔑 **API Key** | Optional | For AI-powered reasoning agent |

---

## 🚀 Quick Installation

### 🎯 Use via npx (Recommended)
```bash
npx web-clone-cli-by-arpan
```

### 🌍 Install globally
```bash
npm i web-clone-cli-by-arpan

```

> 💡 **Tip**: If command not found after global install, ensure your npm global bin is in PATH!

---

## 🔧 Configuration

Create a `.env` file for AI-powered features (use `example.env` as template):

```env
GEMINI_API_KEY=your_api_key_here
BASE_URL=https://your-openai-compatible-endpoint/v1
MODEL=gemini-2.5-flash
```

| Variable | Description | Default |
|----------|-------------|---------|
| 🔑 `GEMINI_API_KEY` | Your API provider key | Required |
| 🌐 `BASE_URL` | OpenAI-compatible endpoint | Required |
| 🤖 `MODEL` | Model name | `gemini-2.5-flash` |

---

## 🎮 Getting Started

### 1️⃣ Setup Environment
```bash
cp example.env .env
# Edit .env with your API credentials
```

### 2️⃣ Launch CLI
```bash
npm i web-clone-cli-by-arpan
```

### 3️⃣ Clone a Website
- 🇬🇧 **English**: `Clone https://example.com/`
- 🇮🇳 **Hindi**: `Website ko clone kare https://example.com/`

### 📂 Output Structure
```
example-clone/
├── 📄 index.html
├── 📄 about.html
├── 📁 css/
│   ├── index-style0.css
│   └── index-inline-style0.css
├── 📁 js/
│   └── index-script0.js
└── 📁 images/
    └── index-image0.png
```

---

## 💡 Usage Examples

### 🌟 Basic Cloning
```bash
# English
Query: Clone https://awesome-portfolio.com/

# Hindi  
Query: Website ko clone kare https://awesome-portfolio.com/
```

### 🎯 Advanced Features
- 🔍 **Auto-discovery** of internal pages
- 🔗 **Smart link rewriting** for local navigation
- 🚫 **External link filtering** (ignores `mailto:`, `tel:`, external domains)
- 📱 **Responsive preservation** of original styling

---

## ⚠️ Important Notes

### 🚨 Legal Considerations
- ✅ **Respect** website Terms of Service and robots.txt
- ✅ **Only clone** sites you own or have permission to copy
- ✅ **Use responsibly** - you're solely responsible for usage

### 🔧 Technical Limitations
- 🎯 **Best for static sites** - Dynamic content may not clone fully
- ⚡ **Client-side rendering** limitations
- 🔐 **Authentication-protected** content not supported

---

## 🐛 Troubleshooting

### 🔑 API Configuration Issues
```bash
Error: Missing API config
```
**Solution**: Ensure `.env` exists with proper `GEMINI_API_KEY` and `BASE_URL`

### 📦 Node ESM/Import Errors
```bash
Error: ERR_REQUIRE_ESM
```
**Solution**: Upgrade to Node.js 18+ for modern ESM support

### 🌐 Network Issues
```bash
Error: ENOTFOUND
```
**Solution**: Check internet connection and target URL accessibility

---

## 👨‍💻 Development

### 🛠️ Setup Development Environment
```bash
git clone https://github.com/arpan7sarkar/Web-clone-cli.git
cd Web-clone-cli
npm install
```

### 🏃‍♂️ Development Commands
```bash
npm run dev    # 🔥 Hot-reload development (nodemon)
npm start      # 🚀 Start CLI normally
npm test       # 🧪 Run tests
npm run build  # 📦 Build for production
```

---

## 🤝 Contributing

We welcome contributions! 🎉

1. 🍴 Fork the repository
2. 🌿 Create your feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m 'Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎯 Open a Pull Request

---

## 📜 License

**ISC License** 📄

Copyright (c) 2025 **Arpan Sarkar**

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

---

<div align="center">

### 🌟 Star this project if you found it helpful!

**Made with ❤️ by [Arpan Sarkar](https://github.com/arpan7sarkar)**

[🐛 Report Bug](https://github.com/arpan7sarkar/Web-clone-cli/issues) • [✨ Request Feature](https://github.com/arpan7sarkar/Web-clone-cli/issues) • [📖 Documentation](https://github.com/arpan7sarkar/Web-clone-cli/wiki)

</div>
