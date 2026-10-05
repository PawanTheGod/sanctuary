# 🌱 Sanctuary — Living AI Roommate Pet & Supportive Companion

[![Hacktoberfest 2026](https://img.shields.io/badge/Hacktoberfest%202026-Build%20for%20a%20Friend-22c55e?style=flat-square)](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)
[![Powered by Gemma](https://img.shields.io/badge/Brain-Google%20Gemma%202B-4285F4?style=flat-square)](https://ai.google.dev/gemma)
[![Voice by ElevenLabs](https://img.shields.io/badge/Voice-ElevenLabs%20Flash%20v2.5-f97316?style=flat-square)](https://elevenlabs.io)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

> **Sanctuary** is a supportive companion and living roommate pet ("Mochi") built for a friend navigating burnout, late-night insomnia, and acute anxiety spirals.

*(Note: Sanctuary is an emotional support and mindful grounding companion, not a clinical treatment or replacement for professional therapy.)*

---

## ✨ What Is Sanctuary?

Sanctuary is built around **Mochi** — an autonomous creature that inhabits your digital workspace.

Unlike traditional chatbot assistants that wait passively for text prompts or send intrusive pop-up notifications, Mochi runs a **continuous 20Hz local life simulation**:
- 🐾 **Living Presence:** Wanders across your screen, stretches, loafs, sleeps with floating Zzz particles, and gets playful micro-zoomies.
- 👁️ **Cursor Awareness:** Dynamic eye pupil tracking and proximity dwell detection relative to your cursor.
- 🧠 **Open-Source Gemma Brain:** Leverages **Google's open-weight Gemma LLM** (running on-device via WebGPU / WebLLM or local Ollama) for CBT-inspired cognitive distortion reflection and compassionate reframing.
- 🎙️ **Lifelike Voice:** Speaks with warm, comforting voices powered by **ElevenLabs Flash v2.5** (with a local Web Speech API fallback for fully offline use).
- 🪟 **Floating Companion Surface:** Floats over the workspace or pops out into a browser-managed, always-on-top window via the **Document Picture-in-Picture API**.
- 🫁 **4-7-8 Parasympathetic Grounding:** Guided breathing synchronized with synthesized purring audio and ambient rain sounds.
- 📔 **Local Journal:** Client-side local storage with one-click Markdown journal export.

---

## 🌟 Why Google Gemma?

Mental health reflections are personal. Sharing vulnerable late-night anxieties with closed commercial APIs carries privacy trade-offs.

By building on **Google Gemma**:
1. **On-Device Inference:** Model weights execute directly inside your browser via WebGPU (`@mlc-ai/web-llm`) or via local Ollama. Text input to Gemma stays on your device.
2. **Open-Weight Autonomy:** Sanctuary does not rely on paid subscriptions, server queues, or proprietary API black boxes.
3. **Thoughtful Reasoning:** Gemma 2B provides balanced, empathetic validation while helping deconstruct thinking traps (Catastrophizing, All-or-Nothing Thinking, Mind Reading) into actionable next steps.

---

## 🔒 Privacy & Architecture: Local vs. Cloud

| Component | Provider / Engine | Where Data Is Processed | Network Traffic |
| :--- | :--- | :--- | :--- |
| **Cognitive Brain (Primary)** | WebLLM / WebGPU (`gemma-2-2b`) | In-Browser GPU | **0 Bytes** (100% on-device) |
| **Cognitive Brain (Local Alternative)** | Ollama (`gemma2:2b`) | Localhost (`11434`) | **0 Bytes** (100% localhost) |
| **Voice Synthesis (Expressive)** | ElevenLabs Flash v2.5 | ElevenLabs Cloud API | Text sent to ElevenLabs for TTS |
| **Voice Synthesis (Offline Fallback)** | Web Speech API | Local OS Speech Engine | **0 Bytes** (100% on-device) |
| **Journal Reflections** | Browser LocalStorage | Local Browser Vault | **0 Bytes** (Never uploaded) |

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+
- A modern WebGPU-compatible browser (Chrome 113+, Edge 113+, Firefox Nightly, or Safari 18+)

### 2. Installation & Running
```bash
# Clone repository
git clone https://github.com/PawanTheGod/sanctuary.git
cd sanctuary

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Built-In Diagnostic Suite

You can verify inference, sensory context, and voice configuration at any time:
- Click the **Brain: Gemma** status badge in the header, or
- Run `window.runGemmaDiagnostics()` directly in the browser DevTools console.

---

## 📄 License

MIT License — Created for the Hacktoberfest Weekend Challenge: Build for a Friend.
