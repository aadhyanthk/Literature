# Literature Web App - Implementation Plan

## Goal Description
Build a retro-themed, real-time multiplayer web application for the card game Literature. The game will feature private multiplayer rooms, single-player matches against algorithmic AI bots, Clash Royale-style emoji reactions, and an in-game "Notebook" assistant available only in bot matches.

## Proposed Tech Stack
- **Frontend Framework**: Vite + React. Excellent for single-page applications with fast hot-reloading.
- **Styling**: Vanilla CSS. Provides maximum flexibility to achieve the specific, highly polished retro aesthetic (green felt, pixel fonts, custom micro-animations) without the constraints of utility classes.
- **Backend/Multiplayer**: Node.js + Express with **Socket.io**. Socket.io is the industry standard for low-latency, event-based real-time bidirectional communication needed for game rooms.
- **State Management**: React Context / Hooks for UI state, with the central authoritative Game State residing on the Node.js server to prevent cheating.

## User Review Required
> [!IMPORTANT]
> **Monorepo Structure**: I propose setting up a single repository with two folders: `/client` (Vite React app) and `/server` (Node.js Socket.io server). Does this structure work for you?
> 
> **File Naming**: You asked to "write gemini.md". I have created this standard `implementation_plan.md` artifact. If you specifically need a file named `gemini.md` in your project folder instead, let me know!

## Architecture

### Server-Side (Node.js + Socket.io)
- **Room Manager**: Handles creating rooms, joining via short codes/links, and managing connections.
- **Game Engine**: Authoritative logic for card distribution, validating legal asks, checking declarations, and advancing turns.
- **Bot Logic Module**: Houses the algorithmic AI (Easy/Medium/Hard heuristics) that acts as virtual Socket clients or direct engine callbacks when it's a bot's turn.

### Client-Side (Vite + React)
- **Lobby UI**: Screen to create or join rooms.
- **Game Table UI**: The main retro-themed table displaying the user's hand, opponent avatars, and the reaction system.
- **Action Modals**: UI for Asking for cards and Declaring sets.
- **The Notebook**: A toggleable side-panel (enabled only in bot matches) displaying known card logs.

## Execution Phases
1. **Phase 1: Foundation & Project Setup**
   - Initialize `/client` and `/server`.
   - Setup Socket.io connection and basic room joining mechanics.
2. **Phase 2: Core Game Engine**
   - Implement deck generation, shuffling, and dealing.
   - Build server-side logic for taking turns, asking for cards, and resolving declarations.
3. **Phase 3: Frontend Gameplay UI**
   - Build the retro felt table, card rendering, hand sorting.
   - Hook up frontend actions (Ask, Declare) to the Socket server.
4. **Phase 4: Bots & Single Player**
   - Develop the algorithmic AI.
   - Implement the "Notebook" UI logic for bot matches.
5. **Phase 5: Polish & Aesthetics**
   - Add emoji reactions.
   - Add micro-animations, retro fonts, and final styling touches.

## Verification Plan
### Automated Tests
- Server-side unit tests for validating legal "Asks" and "Declares".
### Manual Verification
- Manually test room creation and joining across two browser windows.
- Play a full single-player game against bots to ensure state doesn't desync.
