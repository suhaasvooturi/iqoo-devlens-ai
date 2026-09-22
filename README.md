# DevPilot — AI Developer Toolkit ⚡
### Modern AI-Powered Engineering Suite & Phone-First Dev Sentinel
> **Unified Developer Toolkit for High-Velocity Engineering & iQOO Hackathon 2026**  
> *"Build tools that help developers create, test, deploy, or collaborate faster using AI"*

---

![DevPilot Banner](https://img.shields.io/badge/DevPilot-AI_Developer_Toolkit-00E5FF?style=for-the-badge&logo=codeforces&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite 8](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Linear/Raycast Design](https://img.shields.io/badge/Design-Linear%20%2F%20Raycast%20Minimalist-10141D?style=for-the-badge)

---

## 🚀 Overview

**DevPilot** is an all-in-one developer productivity suite designed to eliminate context-switching and supercharge software development workflows. Instead of juggling dozens of fragmented single-purpose tools, DevPilot unifies 9 essential developer utilities into a sleek, keyboard-driven interface (Linear/Vercel/Raycast aesthetic) with instant pre-loaded examples and persistent history.

DevPilot also features **DevLens Sentinel** — an on-device phone cockpit with camera OCR error scanning, audio voice briefings, and real-time dual-screen sync with your laptop workstation.

---

## 🛠️ The 9 Developer Tools

| Tool | Icon | Description | Key Capabilities |
| :--- | :---: | :--- | :--- |
| **Developer Dashboard** | 💻 | Unified command center | Real-time statistics, quick launch tiles, persistent analysis history stream, local cache management. |
| **AI Debugger** | 🐛 | Root cause analysis & hotfix diff | Dual-pane Code + Error trace input, identifies culprit lines, generates git diff and copy-ready fixed code. |
| **Code Explainer** | 🔍 | Multi-level logic deconstruction | Executive summary, interactive line-by-line code walk, and ELI5 (Explain Like I'm 5) analogies. |
| **Code Optimizer** | ⚡ | Performance & algorithmic tuning | Detects quadratic/exponential bottlenecks, calculates speedup % and memory savings, outputs O(1) Set/Map refactors. |
| **Test Generator** | 🧪 | Multi-framework unit test suite | Generates test cases for **Vitest/Jest, Pytest, JUnit 5, Go testing, Cargo test** with happy paths and edge cases. |
| **Security Scanner** | 🔐 | OWASP & vulnerability detection | Scans for SQLi, XSS, command injection, insecure eval, maps CWE codes, severity badges, and remediation diffs. |
| **Complexity Analyzer** | 📊 | Big-O asymptotic evaluation | Calculates Big-O Time & Space complexity, visual scalability rating, and pinpointed hotspot line markers. |
| **Documentation Generator** | 📝 | Multi-format doc synthesis | Generates JSDoc/TSDoc specifications, Python PEP-257 docstrings, and clean Markdown API reference tables. |
| **Code Converter** | 🔄 | Idiomatic multi-language translator | Transpiles across Python, TypeScript, Java, C++, Go, and Rust with type translation and idiomatic notes. |

---

## 📱 Bonus: DevLens Phone Sentinel Mode

For developers on call or during hackathon "phone-only" phases, DevPilot includes the **DevLens Phone Sentinel**:
1. **Camera OCR Scanner**: Scan your laptop screen or terminal logs using your phone camera and laser HUD.
2. **🔊 Audio Voice Briefing**: Reads diagnostic findings out loud using the Web Speech Synthesis API.
3. **Pair Pilot Chat**: Interactive companion for asking follow-up questions (*"Why did this fail?"*, *"Will this break backward compatibility?"*).
4. **Visual UX Simulation**: Before/after rendering of what users saw vs. the resolved state.
5. **1-Tap Git Hotfix**: Automated test runner sandbox with 1-click git patch application and celebration confetti.
6. **iQOO Office Kit Synergy**: Zero-latency peer-to-peer sync between phone and laptop via `BroadcastChannel`.

---

## ⌨️ Keyboard-First Navigation

DevPilot is built for keyboard lovers with dedicated number key navigation:
- `1` → Developer Dashboard
- `2` → AI Debugger
- `3` → Code Explainer
- `4` → Code Optimizer
- `5` → Test Generator
- `6` → Security Scanner
- `7` → Complexity Analyzer
- `8` → Documentation Generator
- `9` → Code Converter
- `0` → DevLens Sentinel (Phone Cockpit)

---

## 💻 Tech Stack & Architecture

- **Frontend**: React 19, TypeScript (strict mode, `verbatimModuleSyntax`)
- **Build Tool**: Vite 8 with HMR
- **Styling**: Tailored Modern CSS Design System (Linear / Raycast / Vercel dark mode palette, smooth micro-interactions, responsive grid)
- **Typography**: Google Fonts (*Space Grotesk*, *JetBrains Mono*, *Inter*)
- **Icons**: Lucide React
- **Local Persistence**: `localStorage` store for statistics, run logs, and snippet history
- **Audio & Speech**: Web Audio API (synthesized alert chimes) + Web Speech Synthesis API
- **Cross-Device Bridge**: `BroadcastChannel` UltraLink for peer-to-peer sync

---

## 🛠️ Getting Started Locally

### Prerequisites
- Node.js 18+ (tested on Node v20/v24)
- npm or pnpm

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/suhaasvooturi/iqoo-devlens-ai.git
cd iqoo-devlens-ai

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

### Accessing DevPilot
- Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.
- To test mobile or on a physical smartphone, connect to the network address displayed in the terminal (e.g. `http://192.168.1.56:5173/`) or use the QR code in the top bar.

---

## 📁 Project Structure

```
iqoo-devlens-ai/
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   │   └── Sidebar.tsx             # Linear-style left sidebar with keyboard shortcuts
│   │   ├── tools/
│   │   │   ├── DashboardTool.tsx       # Metrics cards, launch tiles & history feed
│   │   │   ├── DebuggerTool.tsx        # Code + Error trace dual input & git diff
│   │   │   ├── ExplainerTool.tsx       # Summary, line-by-line & ELI5 breakdown
│   │   │   ├── OptimizerTool.tsx       # Speedup metrics, memory savings & refactored code
│   │   │   ├── TestGenTool.tsx         # Multi-framework unit test suite builder
│   │   │   ├── SecurityScannerTool.tsx # OWASP vulnerability scanner & CWE patches
│   │   │   ├── ComplexityTool.tsx      # Big-O asymptotic analysis & visual scales
│   │   │   ├── DocGenTool.tsx          # JSDoc, Python docstrings & Markdown generator
│   │   │   └── ConverterTool.tsx       # Cross-language code translator
│   │   ├── PhoneCockpit/               # DevLens Sentinel phone cockpit (5 tabs)
│   │   ├── Workstation/                # Laptop IDE & terminal view
│   │   ├── Header.tsx                  # Top status bar & mode switchers
│   │   └── QRModal.tsx                 # Mobile connect QR modal
│   ├── services/
│   │   ├── devPilotEngine.ts           # AST analysis engines & curated samples for all 9 tools
│   │   ├── historyStorage.ts           # LocalStorage persistence for stats & history
│   │   ├── aiDiagnosticEngine.ts       # Sentinel heuristic engine
│   │   └── bridgeService.ts            # P2P cross-device sync
│   ├── styles/
│   │   ├── theme.css                   # Dark mode color tokens & typography
│   │   └── components.css              # Polished card, badge & button primitives
│   ├── types/
│   │   └── index.ts                    # TypeScript domain interfaces
│   ├── App.tsx                         # Master application state & navigation router
│   └── main.tsx                        # React application entry point
├── package.json
├── tsconfig.json
└── README.md
```

---

## 📄 License
MIT License © 2026 Suhaas Vooturi. Built with passion for high-performance developer tools.
