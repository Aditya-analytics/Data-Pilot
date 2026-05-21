# DataPilot: Implementation Guide

This document outlines the technical implementation strategy for translating our static HTML/CSS prototypes (`landing4.html` and `app.html`) into a production-grade React application, coordinated with a FastAPI backend.

---

## 1. System Architecture

The project follows a clean, orchestration-first architecture. 

```text
Frontend (React + Tailwind + shadcn/ui)
   ↓
API Layer (FastAPI)
   ↓
Analysis Engine (Dataprep)
   ↓
Planning Engine (LangChain + LLM)
   ↓
Execution Engine (PyJanitor + Pandas)
   ↓
Validation & Reporting (ydata-profiling)
```

**Core Principle:** The backend handles *all* heavy lifting, intelligence, and deterministic execution. The frontend is a "dumb" but visually sophisticated client that exposes this intelligence via explicit, structured UI states.

---

## 2. Frontend Design System (Clean Brutalism)

The frontend uses a strict, minimalist "Brutalist" design language. Do not deviate from these tokens.

### Typography
*   **Display Font:** `Cabinet Grotesk` (Weights: 800, 900) - Used for major headings, numbers, and impact text.
*   **Body Font:** `JetBrains Mono` (Weights: 400, 700, 800) - Used for all body text, UI labels, and terminal outputs.
*   **Base Font Size:** `13px` (Scaled down for a dense, technical "dashboard" feel).

### Color Palette & Variables
*   `--black`: `#050505`
*   `--white`: `#FAFAFA`
*   `--grey`: `#E8E8E8`
*   `--grey-dark`: `#D0D0D0`

### Spacing & Borders
*   **Borders:** `3px solid var(--black)` everywhere.
*   **Border Radius:** `0px` globally. No rounded corners.
*   **Shadows:** Hard box shadows (`6px 6px 0px var(--black)` or `10px 10px 0px var(--black)` on hover).

### Micro-interactions
*   **Hover states:** Immediate hard transitions (background inversion, hard shadow shifts).
*   **Animations:** Keep them minimal. Use CSS keyframes for terminal cursors blinking and simple fade-ins/slide-ups (`transform: translateY`).

---

## 3. Frontend App Flow (The 5 Screens)

The React application will be structured around a multi-step pipeline router matching the `app.html` flow.

### Screen 1: Upload (`/upload`)
*   **Action:** Drag and drop dataset.
*   **API Interaction:** `POST /api/v1/dataset/upload` (Multipart form data).
*   **Backend Response:** Returns a `dataset_id`.
*   **Transition:** Automatically moves to Screen 2 upon successful upload.

### Screen 2: Analysis (`/analyze/:dataset_id`)
*   **Action:** Show animated progress while backend analyzes the data.
*   **API Interaction:** `GET /api/v1/dataset/:id/analysis` (Long polling or WebSockets).
*   **Expected JSON:**
    ```json
    {
      "status": "complete",
      "rows": 1200,
      "columns": 12,
      "issues": {
        "missing_values": 231,
        "duplicates": 847,
        "outliers": 23
      },
      "quality_score_before": 34,
      "preview_data": [...]
    }
    ```

### Screen 3: AI Plan Review (`/plan/:dataset_id`)
*   **Action:** Present the LLM's generated cleaning plan to the user for approval.
*   **API Interaction:** `GET /api/v1/dataset/:id/plan`
*   **UI Requirement:** User can toggle `[✓]` or `[✗]` for each step. Terminal UI shows fake/real reasoning logs.
*   **Submission:** `POST /api/v1/dataset/:id/execute` sending the array of approved step IDs.

### Screen 4: Execution Progress (`/execute/:dataset_id`)
*   **Action:** Live ticker showing PyJanitor/Pandas executing the approved steps.
*   **API Interaction:** Server-Sent Events (SSE) or WebSockets from `/api/v1/dataset/:id/execution-stream` to show real-time logs and step completion.

### Screen 5: Results & Report (`/results/:dataset_id`)
*   **Action:** Display the "After" metrics, a cell-level diff table, and provide download links.
*   **API Interactions:**
    *   `GET /api/v1/dataset/:id/report` (gets final metrics and diffs).
    *   `GET /api/v1/dataset/:id/download/csv`
    *   `GET /api/v1/dataset/:id/download/html` (ydata-profiling report).

---

## 4. React Setup Strategy (Phase 0)

To transition from HTML prototypes to React:

1.  **Scaffold:** Use Vite (`npm create vite@latest frontend -- --template react-ts`).
2.  **Tailwind CSS:** Install and configure Tailwind. Map the design tokens (`--black`, `--grey`, etc.) directly into `tailwind.config.js`.
3.  **UI Library:** Introduce `shadcn/ui`. **Crucial Override:** Disable all default rounded corners in `shadcn` components. Override borders to be `3px solid black`.
4.  **Routing:** Use `react-router-dom` to manage the `/upload` -> `/analyze` -> `/plan` -> `/execute` -> `/results` flow.
5.  **State Management:** Use standard React Context or Zustand to hold the `dataset_id` and the current `pipeline_state` globally so the shared Navbar and Step Bar can remain strictly in sync.

---

## 5. API Contract Philosophy

The frontend must **never** guess data. The backend must enforce deterministic output via Pydantic models. 
If the LLM fails to generate a valid plan, the backend must catch it and return a structured fallback error, which the frontend displays in the Terminal UI.
