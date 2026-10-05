*This is a submission for the [Hacktoberfest Weekend Challenge: Build for a Friend](https://dev.to/challenges/hacktoberfest-weekend-2026-10-01)*

## What I Built

I built **Sanctuary** — a 100% private, on-device living AI roommate pet and CBT emotional confidant named **Mochi**, powered by **Google's open-weight Gemma 2B LLM** and **ElevenLabs AI voice infrastructure**.

I built Sanctuary for my close friend **Alex**, a software engineer who struggles with late-night burnout, insomnia, and acute 2:00 AM spiral anxiety. When anxiety hits late at night:
1. **Privacy Roadblock:** Alex refused to use cloud-hosted commercial AI for mental health out of valid fear that vulnerable breakdowns would be logged, sold, or used to train corporate models.
2. **Cognitive Fatigue:** When panicking, typing long prompts into an empty chatbot interface is overwhelming. Alex needed a companion that was **physically and passively present** — quietly sitting beside the workspace, noticing when work runs too long, and offering gentle grounding without being intrusive.

### Key Features:
- 🐾 **20Hz Autonomous Life Simulation:** Mochi has a living body with hunger, energy, happiness, and curiosity dynamics. It wanders, stretches, loafs, and naps with floating Zzz particles.
- 👁️ **Sensory Gaze & Cursor Awareness:** Sub-20ms trigonometric eye pupil tracking and proximity dwell detection relative to the user's cursor.
- 🧠 **Google Gemma Cognitive Core:** Escalates to Gemma on-device (via WebGPU or local Ollama) for Cognitive Behavioral Therapy (CBT) distortion deconstruction (catastrophizing, all-or-nothing thinking, mind reading) into compassionate, actionable reframing.
- 🗣️ **Lifelike Voice:** Speaks softly and reassuringly through ElevenLabs Flash v2.5 (`eleven_flash_v2_5`) with local Web Speech fallback.
- 🪟 **Floating Screen Companion & Document PiP:** Floats over the workspace or pops out into an always-on-top Document Picture-in-Picture window.
- 🫁 **Somatic Grounding:** Guided 4-7-8 parasympathetic breathing synced with procedural 25Hz cat purring audio and pink-noise rain.
- 🔒 **100% Private & Zero-Knowledge:** All neural inference and reflection logs stay strictly on the user's local machine.

---

## Demo

- 🚀 **Live Application:** [https://sanctuary-0ib8.onrender.com/](https://sanctuary-0ib8.onrender.com/)

*(Tip: In supported Chromium browsers, click the **Pop-out PiP** button in the header to detach Mochi into an always-on-top desktop companion window!)*

---

## Code

{% github PawanTheGod/sanctuary %}

- 📂 **GitHub Repository:** [https://github.com/PawanTheGod/sanctuary](https://github.com/PawanTheGod/sanctuary)
- **Tech Stack:** Vanilla JavaScript (ES Modules), HTML5, Glassmorphic CSS3, Web Audio API, WebGPU / WebLLM (`@mlc-ai/web-llm`), Ollama API, ElevenLabs API, Document Picture-in-Picture API.

---

## How I Built It

Sanctuary is built around a decoupled two-tier architecture:

1. **Continuous 20Hz Life Simulation (`mochi-engine.js`):**
   - Runs a local physics and state loop tracking `energy`, `happiness`, `curiosity`, `boredom`, `sleepiness`, and `socialNeed`.
   - Priority hierarchy arbitrates behaviors without invoking LLM tokens: User Touch $\rightarrow$ Active Dialogue $\rightarrow$ Attention Seeking $\rightarrow$ Playful Zoomies $\rightarrow$ Wandering $\rightarrow$ Idle Loafing $\rightarrow$ Sleep.
2. **Sensory Context Aggregator (`context-provider.js`):**
   - Monitors passive workspace signals (cursor velocity, dwell time, active typing vs. idle).
   - If the user is actively typing, Mochi **strictly suppresses interruptions**.
3. **Google Gemma Open-Weight Cognitive Core (`app.js`):**
   - When the user confides a worry or requests guidance, Mochi executes a physical pre-speech sequence (approaches, pauses, tilts head) and prompts **Google Gemma 2B** (`gemma-2-2b-it-q4f16_1-MLC` via WebLLM/WebGPU, or `gemma2:2b` via Ollama).
   - Gemma analyzes automatic negative thoughts, identifies underlying cognitive distortions, tests evidence vs. emotional fears, and generates a compassionate friend perspective, objective factual reframe, and somatic grounding micro-step.
4. **Emotive Voice Synthesis:**
   - Responses stream through ElevenLabs Flash v2.5 for lifelike audio, with zero-latency Web Speech synthesis as an offline fallback.

---

## Why Does Open Innovation Matter?

Open innovation and open-weight models like **Google Gemma** made Sanctuary possible in ways proprietary closed APIs never could:

1. **Uncompromised Mental Health Privacy:** Closed AI APIs require sending sensitive, vulnerable late-night anxieties to third-party servers. With Gemma running in-browser via WebGPU / WebLLM or locally via Ollama, **zero bytes of personal thoughts ever leave the user's computer**.
2. **Zero Operating Costs & High Availability:** Traditional mental health apps struggle with per-token API fees or server outages. Open weights allow Sanctuary to run indefinitely, for free, even completely offline during travel or internet outages.
3. **Predictable Local Latency:** Running on-device means no network throttling or queue times when a friend needs immediate emotional grounding.

---

## My Agent Session

This project was conceived, designed, and built in an intensive pair-programming session with an autonomous AI coding agent. The architecture, state machines, WebGPU WebLLM integration, and Document PiP companion surface were iteratively scaffolded, tested, and audited for zero secret leaks.

---

## Prize Categories

- **Best Use of Gemma:** Google's open-weight Gemma model powers the 100% on-device CBT cognitive restructuring pipeline and contextual friend reflections.
- **Best Use of ElevenLabs:** Emotive, lifelike voice synthesis powered by ElevenLabs Flash v2.5 provides soothing roommate check-ins and empathetic audio comfort.
