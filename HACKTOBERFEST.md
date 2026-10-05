*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

I built **Sanctuary** — a living AI roommate pet and supportive companion named **Mochi**, powered by **Google's open-weight Gemma 2B LLM** and **ElevenLabs AI voice synthesis**.

Instead of a chatbot waiting for prompts in a text box, Mochi is an autonomous, embodied creature designed to share your digital workspace:
- 🐾 **Continuous Autonomous Life Simulation:** Mochi has an ongoing internal state model (energy, happiness, curiosity, restfulness). It roams around your screen, loafs, stretches, and naps with gentle floating particles without needing continuous AI prompts.
- 👁️ **Passive Workspace Senses:** Mochi tracks cursor position and movement, reacting to proximity and respecting your flow by staying quiet when you're actively typing.
- 🧠 **Gemma-Powered CBT-Inspired Reflection:** When you need a listening ear, Mochi uses Google's open-weight Gemma 2B model to deconstruct everyday cognitive distortions (such as catastrophizing or all-or-nothing thinking) into balanced, compassionate perspectives and practical grounding steps.
- 🗣️ **Warm, Lifelike Voice:** Mochi speaks softly through ElevenLabs Flash v2.5, with an on-device Web Speech API fallback for users who prefer an entirely offline setup.
- 🪟 **Floating Companion Mode:** Mochi can roam across your browser viewport or pop out into a browser-managed, always-on-top window via the **Document Picture-in-Picture API**.
- 🫁 **Somatic Calming Tools:** Guided 4-7-8 breathing exercises paired with synthesized purring and ambient rain sounds to help ease moments of acute stress.

*(Note: Sanctuary is an emotional support and mindful grounding companion, not a clinical treatment or replacement for professional therapy.)*

---

## The Story: Why an Autonomous Creature Instead of a Chatbot?

I built Sanctuary for my friend **Alex**, a software engineer who frequently battles late-night burnout, insomnia, and spiraling self-criticism during crunch periods.

When someone is overwhelmed at 2:00 AM, traditional AI chatbots fail them in two big ways:
1. **The Burden of the Prompt:** Blank chat boxes require cognitive effort. When you're in the middle of a panic spiral or decision fatigue, having to articulate your thoughts into a coherent paragraph feels like work.
2. **Transactional Coldness:** A chatbot only exists when you talk to it. It has no presence, no personality between messages, and no ambient life.

I wanted Alex to feel like there was a gentle roommate quietly keeping them company at their desk. An autonomous pet that simply sits nearby, stretches, takes a nap, and breathes with you provides comforting co-presence without demanding anything in return. When Alex does want to talk, Mochi listens with the warmth of a friend and the structured clarity of CBT-inspired reflection.

---

## Demo

- 🚀 **Live Web App:** [https://sanctuary-0ib8.onrender.com/](https://sanctuary-0ib8.onrender.com/)

*(Tip: In Chromium browsers like Chrome and Edge, click **Pop-out PiP** in the top navigation bar to open Mochi in an always-on-top Document Picture-in-Picture window while you work across browser tabs!)*

---

## Code

{% github PawanTheGod/sanctuary %}

- 📂 **GitHub Repository:** [https://github.com/PawanTheGod/sanctuary](https://github.com/PawanTheGod/sanctuary)
- **Tech Stack:** Vanilla JavaScript (ES Modules), HTML5, CSS3, Web Audio API, WebGPU / WebLLM (`@mlc-ai/web-llm`), Ollama API, ElevenLabs API, Document Picture-in-Picture API.

---

## How I Built It

Sanctuary is designed around a decoupled, modular architecture:

```
┌─────────────────────────────────────────────────────────┐
│                 WORKSPACE SENSORY INPUT                 │
│      Cursor movement, dwell time, typing activity       │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               MOCHI AUTONOMOUS LIFE LOOP                │
│    20Hz state machine: energy, happiness, roaming,      │
│            loafing, stretching, and sleeping            │
└───────────────────────────┬─────────────────────────────┘
                            │ (When user confides a thought)
                            ▼
┌─────────────────────────────────────────────────────────┐
│          GOOGLE GEMMA 2B COGNITIVE REASONING            │
│  - WebLLM (In-browser WebGPU) or Ollama (Local Server)  │
│  - Validates emotions, identifies thinking traps,       │
│    and generates balanced CBT-inspired reframing        │
└───────────────────────────┬─────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    VOICE SYNTHESIS                      │
│   ElevenLabs Flash v2.5 (Cloud) or Web Speech (Local)   │
└─────────────────────────────────────────────────────────┘
```

1. **Autonomous Life Loop (`mochi-engine.js`):** A lightweight 20Hz update loop updates Mochi's emotional states and drives natural physical behaviors (wandering, loafing, breathing) without making continuous LLM queries.
2. **Context Aggregator (`context-provider.js`):** Observes user interactions (mouse proximity, typing cadence) to adjust Mochi's alertness and suppress notifications during focused work.
3. **Google Gemma 2B Inference (`app.js`):**
   - **Primary (WebGPU / WebLLM):** Runs `gemma-2-2b-it-q4f16_1-MLC` client-side directly in the browser.
   - **Local Alternative (Ollama):** Connects to `gemma2:2b` running locally on `http://localhost:11434`.
4. **Voice & Privacy Flexibility:**
   - Users can choose between **ElevenLabs Cloud TTS** for expressive, high-fidelity voices or **Browser Web Speech API** for complete local privacy where no text leaves the machine.
5. **Screen Companion Surfaces:**
   - **In-Page Floating Layer:** Renders Mochi dynamically across viewport boundaries.
   - **Document Picture-in-Picture:** Uses Chrome/Edge's native `documentPictureInPicture` API to create an always-on-top window.

---

## Why Open Innovation Matters

Building Sanctuary around open-weight models like **Google Gemma** demonstrates why open AI ecosystems are essential:

1. **True On-Device Privacy for Sensitive Thoughts:** When discussing late-night anxieties and personal struggles, users deserve the choice to keep their raw thoughts on their own hardware. With Gemma running locally via WebGPU or Ollama, personal reflections stay on the user's machine.
2. **Resilience & Zero Infrastructure Costs:** Closed APIs incur recurring per-token fees and break during network outages. Gemma enables Sanctuary to run autonomously on personal hardware without relying on paid backend servers.
3. **User Agency:** Open models give developers and users complete transparency over prompts, safety guardrails, and model execution.

---

## My Agent Session

This project was developed with the assistance of an AI coding agent, collaboratively scaffolding the state machine architecture, implementing WebGPU WebLLM pipelines, testing Document PiP surfaces, and conducting code audits to ensure zero hardcoded secrets.

---

## Prize Categories

- **Best Use of Gemma:** Google's open-weight Gemma model powers the on-device CBT-inspired cognitive restructuring engine and supportive conversational companion.
- **Best Use of ElevenLabs:** Expressive, soothing voice synthesis via ElevenLabs Flash v2.5 brings Mochi's personality to life with warm, natural speech.
