# 🌱 Sanctuary — Living AI Roommate Pet & CBT Confidant

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Build%20for%20a%20Friend-22c55e?style=flat-square)](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)
[![Powered by Gemma](https://img.shields.io/badge/Brain-Google%20Gemma%202B%20%2F%209B-4285F4?style=flat-square)](https://ai.google.dev/gemma)
[![Voice by ElevenLabs](https://img.shields.io/badge/Voice-ElevenLabs%20Flash%20v2.5-f97316?style=flat-square)](https://elevenlabs.io)
[![Privacy](https://img.shields.io/badge/Privacy-100%25%20On--Device%20Zero--Knowledge-10b981?style=flat-square)](#privacy-architecture)

> **Sanctuary** is a 100% private, on-device emotional companion and living roommate pet ("Mochi") built for a friend navigating burnout, late-night insomnia, and acute anxiety spirals.

---

## ✨ What Is Sanctuary?

Sanctuary is built around **Mochi** — an autonomous desktop-style pet that inhabits your workspace. 

Unlike traditional chatbot assistants that send intrusive push notifications or require energy to formulate prompts, Mochi runs a **continuous 20Hz local life simulation**:
- 🐾 **Living Presence:** Wanders across conceptual desk zones, stretches, loafs, sleeps with floating Zzz particles, and gets joyful micro-zoomies.
- 👁️ **Cursor Awareness:** Smooth sub-20ms eye pupil tracking and proximity dwell detection.
- 🧠 **Open-Source Gemma Brain:** Leverages **Google's open-weight Gemma LLM** (running on-device via WebGPU / WebLLM or local Ollama) for Cognitive Behavioral Therapy (CBT) distortion deconstruction and compassionate reframing.
- 🎙️ **Lifelike Soothing Voice:** Speaks with ultra-realistic, comforting voices powered by **ElevenLabs** (with Web Speech API fallback).
- 🫁 **4-7-8 Parasympathetic Grounding:** Guided breathing bubble synchronized with procedural 25Hz cat purring audio (vagus nerve stimulation) and pink-noise rain.
- 📔 **Encrypted Private Vault:** 100% local storage with one-click Markdown journal export.

---

## 🌟 Why Google Gemma?

Mental health reflections are the most sensitive data a human can create. Uploading 2:00 AM panic spirals to closed commercial cloud APIs carries severe privacy risks.

By building on **Google Gemma**:
1. **Zero-Knowledge Privacy:** Model weights execute directly inside the browser using WebGPU shader pipelines (`@mlc-ai/web-llm`) or via local Ollama. Zero tokens leave the laptop.
2. **Open-Weight Autonomy:** Sanctuary does not rely on paid subscriptions, rate limits, or proprietary API black boxes.
3. **Compassionate Reasoning:** Gemma 2B/9B excels at nuanced emotional validation, identifying cognitive distortions (Catastrophizing, All-or-Nothing Thinking, Mind Reading), and structuring actionable Socratic reframes.

---

## 🔒 Privacy Architecture: Local vs. Cloud

| Mode | Execution Engine | Network Data Sent | API Key Needed? |
| :--- | :--- | :--- | :---: |
| **Tier 1: WebGPU Gemma (Default)** | On-Device Browser GPU via WebLLM | **0 Bytes** (100% Local) | **No** |
| **Tier 2: Local Ollama Gemma** | Localhost CPU/GPU (`http://localhost:11434`) | **0 Bytes** (100% Localhost) | **No** |
| **Tier 3: Cloud Fallback** | Hugging Face Serverless / OpenRouter | User-Initiated API Request | Yes (User-Provided) |

*Zero telemetry. Zero tracking scripts. Zero third-party ad pixels.*

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- A modern WebGPU-compatible browser (Chrome 113+, Edge 113+, Firefox Nightly, or Safari 18+)

### 2. Installation & Running
```bash
# Clone repository
git clone https://github.com/[YOUR_USERNAME]/sanctuary-ai.git
cd sanctuary-ai

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## ⚙️ Gemma Inference Configuration

Open the **Settings Modal** (⚙️ top right) to configure your preferred brain engine:

### Option A: WebGPU In-Browser Gemma (Zero Setup)
1. In Settings, select **Real In-Browser WebGPU Gemma**.
2. Click **Initialize & Load Gemma 2B in WebGPU Cache**.
3. Model weights (`gemma-2-2b-it-q4f16_1-MLC`) download once into IndexedDB/CacheStorage and run natively on your GPU.

### Option B: Local Ollama
```bash
# Pull and run Gemma locally
ollama run gemma2:2b
```
In Sanctuary settings, select **Local Ollama** (`http://localhost:11434`).

### Option C: ElevenLabs Voice (Optional)
To enable lifelike spoken voice:
1. Enter your ElevenLabs API Key in Settings.
2. Select your preferred soothing voice persona (*Rachel*, *Sarah*, *Charlie*, *Daniel*).
*(If no key is entered, Sanctuary uses the built-in Device Native Web Speech synthesizer).*

---

## 🔬 Cognitive Diagnostics Test Suite

Sanctuary includes an automated verification suite to audit Gemma inference and privacy compliance:
1. Click the **Brain: Gemma** status badge in the header.
2. Click **Run Full Verification Suite**.
3. Tests execute in real time:
   - **Test A:** Provider & Device WebGPU Availability
   - **Test B:** Live Gemma Inference (`GEMMA_OK` token assert)
   - **Test C:** Mochi Emotional State Vector Integration
   - **Test D:** Memory & Secrets Leakage Audit

You can also run diagnostics from the browser console:
```javascript
window.runGemmaDiagnostics();
```

---

## 📂 Project Structure

```text
├── index.html            # Sanctuary single-page interface & accessible markup
├── app.js                # Cognitive orchestrator, Gemma inference & ElevenLabs voice
├── mochi-engine.js       # 20Hz continuous autonomous pet simulation state machine
├── context-provider.js   # Sensory aggregation & event bus pipeline (Browser/Desktop)
├── style.css             # Sage green glassmorphism design system & animations
├── package.json          # Vite & @mlc-ai/web-llm dependencies
├── ARCHITECTURE.md       # Deep technical architecture & Mermaid sequence diagrams
├── HACKTOBERFEST.md      # Hacktoberfest challenge submission evidence & writeup
└── .env.example          # Environment variable template
```

---

## 📄 License
MIT License. Built with love for anyone fighting quiet battles in private.
