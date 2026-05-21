Perfect.
Your priorities are now very clear:

```text id="luhzlo"
1. Learning AI Engineering deeply
2. Strong portfolio architecture
3. Smart scalable design
4. Lower complexity through orchestration
5. Fast MVP execution
```

And your choices make sense for that goal.

You are basically building:

> an orchestration-first AI engineering product.

That’s a strong direction.

# FINAL PRODUCT VISION

## Product Identity

```text id="50h5r5"
AI-powered intelligent data cleaning platform
```

Core idea:

- Upload messy dataset
- AI analyzes it
- AI plans cleaning strategy
- Tools execute cleaning
- Reports + quality scoring generated
- User visually sees improvement

---

# FINAL LOCKED STACK

## Backend

- Python
- FastAPI

---

## AI Orchestration

- LangChain

---

## Dataset Analysis

- [Dataprep](https://docs.dataprep.ai/?utm_source=chatgpt.com)

---

## Cleaning

- [PyJanitor](https://pyjanitor-devs.github.io/pyjanitor/?utm_source=chatgpt.com)
- Pandas

---

## Reports

- [ydata-profiling](https://github.com/ydataai/ydata-profiling?utm_source=chatgpt.com)

---

## Frontend

- React
- Tailwind
- shadcn/ui

---

# CORE SYSTEM ARCHITECTURE

```text id="ux7uqg"
Frontend
   ↓
FastAPI API Layer
   ↓
Dataset Analysis Layer
(Dataprep)
   ↓
Planning Layer
(LLM via LangChain)
   ↓
Execution Layer
(PyJanitor + Pandas)
   ↓
Validation Layer
   ↓
Reporting Layer
(ydata-profiling)
   ↓
Frontend Visualization
```

---

# END-TO-END EXECUTION ROADMAP

# PHASE 0 — FOUNDATION & PROJECT SETUP

## Goal

Prepare architecture cleanly before coding.

---

# Learn First

## Must Learn

- FastAPI basics
- File upload handling
- Pandas dataframe workflow
- Basic LangChain concepts
- React file upload flow

---

# Deliverables

## Backend Structure

```text id="e8ul6k"
backend/
 ├── app/
 │   ├── api/
 │   ├── services/
 │   ├── tools/
 │   ├── agents/
 │   ├── models/
 │   ├── utils/
 │   └── main.py
```

---

## Frontend Structure

```text id="4vm0hq"
frontend/
 ├── components/
 ├── pages/
 ├── services/
 ├── hooks/
 ├── utils/
 └── app/
```

---

# Build Tasks

✔ Setup frontend/backend repos
✔ Setup FastAPI
✔ Setup React/Tailwind
✔ Configure CORS
✔ Create file upload endpoint
✔ Create dataset upload UI

---

# Learning Outcome

You understand:

- project structure
- API communication
- clean architecture separation

---

# PHASE 1 — CSV INGESTION & DATA ANALYSIS

## Goal

Upload dataset and analyze it automatically.

---

# Learn First

## Learn:

- Pandas dataframe inspection
- Dataprep basics
- Dataset statistics
- JSON serialization

---

# Build Tasks

## Upload CSV

```python id="m3xiy0"
pd.read_csv()
```

---

## Analyze Dataset

Use:

- Dataprep
- Pandas statistics

Extract:

- missing values
- duplicates
- datatypes
- outliers
- unique counts

---

# Backend Output

Example:

```json id="wzq11d"
{
  "rows": 1200,
  "columns": 12,
  "missing_values": {
    "age": 12
  },
  "duplicates": 4
}
```

---

# Frontend UX

Show:

- dataset preview
- issue cards
- quality score
- loading animations

---

# Learning Outcome

You understand:

- dataframe analysis pipelines
- structured analysis extraction

---

# PHASE 2 — AI PLANNING SYSTEM

## Goal

LLM decides cleaning strategy.

This is the CORE AI ENGINEERING phase.

---

# Learn First

## Learn:

- LangChain basics
- Prompt engineering
- Structured outputs
- JSON parsing
- Tool abstraction concepts

---

# Architecture

```text id="gh6y73"
Dataset Analysis
        ↓
Planner LLM
        ↓
Structured Cleaning Plan
```

---

# Build Tasks

## Create Planner Prompt

Input:

```text id="zwxv5n"
Dataset findings
+
Available tools
+
Cleaning constraints
```

---

## LLM Returns

```json id="q0mnw5"
{
  "steps": [
    {
      "tool": "pyjanitor",
      "action": "drop_duplicates"
    }
  ]
}
```

---

# VERY IMPORTANT

Use:

- Pydantic schemas
- strict JSON validation

This is real AI engineering practice.

---

# Frontend UX

Show:

- AI reasoning
- cleaning strategy cards
- confidence levels

---

# Learning Outcome

You understand:

- orchestration
- planning systems
- LLM reliability engineering

---

# PHASE 3 — EXECUTION ENGINE

## Goal

Execute cleaning plan safely.

---

# Learn First

## Learn:

- PyJanitor operations
- Pandas transformations
- Execution pipelines
- Validation checks

---

# Build Tasks

## Create Tool Router

Example:

```text id="57s7xa"
If tool == pyjanitor:
    execute janitor method

If tool == pandas:
    execute pandas method
```

---

# Build Cleaning Actions

Examples:

- remove duplicates
- fill missing values
- standardize columns
- convert datatypes

---

# Validation Layer

Check:

- dataframe integrity
- remaining NaNs
- datatype consistency

---

# Frontend UX

Show:

- live cleaning progress
- completed actions
- before vs after updates

---

# Learning Outcome

You understand:

- deterministic execution systems
- safe AI action pipelines

---

# PHASE 4 — REPORTING & QUALITY ENGINE

## Goal

Generate professional reports and scoring.

---

# Learn First

## Learn:

- ydata-profiling
- scoring systems
- visualization logic

---

# Build Tasks

## Generate Reports

Before cleaning:

```python id="ux8fx9"
ProfileReport(df)
```

After cleaning:

```python id="c20c9r"
ProfileReport(clean_df)
```

---

# Build Quality Score Engine

Metrics:

- missing %
- duplicates %
- invalid types
- outliers

---

# Frontend UX

Show:

- quality improvement
- charts
- downloadable reports

---

# Learning Outcome

You understand:

- measurable AI output evaluation
- reporting systems

---

# PHASE 5 — ADVANCED UX POLISH

## Goal

Make system FEEL intelligent.

---

# Learn First

## Learn:

- loading states
- optimistic UI
- animations
- progress systems

---

# Build Tasks

## Add:

- animated analysis
- AI progress updates
- interactive dataset preview
- highlighted cleaned cells

---

# Most Important UX Components

| Component                | Importance |
| ------------------------ | ---------- |
| Quality score            | VERY HIGH  |
| Before vs after          | VERY HIGH  |
| AI cleaning explanations | VERY HIGH  |
| Progress updates         | HIGH       |

---

# Learning Outcome

You understand:

- AI product UX
- perceived intelligence design

---

# PHASE 6 — DEPLOYMENT

## Goal

Deploy polished MVP.

---

# Learn First

## Learn:

- environment variables
- deployment basics
- API hosting
- frontend deployment

---

# Deployment Stack

## Backend

- [Render](https://render.com?utm_source=chatgpt.com)

## Frontend

- [Vercel](https://vercel.com/?utm_source=chatgpt.com)

---

# Build Tasks

✔ Deploy backend
✔ Deploy frontend
✔ Configure environment variables
✔ Connect frontend/backend
✔ Test file uploads

---

# FINAL MVP FEATURES

## FINAL PRODUCT

```text id="z9s7sr"
✔ Upload CSV
✔ Automatic analysis
✔ AI cleaning strategy
✔ Intelligent execution
✔ Dataset quality scoring
✔ Before/after comparison
✔ Download cleaned CSV
✔ Download reports
✔ AI explanations
✔ Interactive dashboard
```

---

# WHAT YOU WILL LEARN

This project teaches:

- AI orchestration
- LangChain
- structured LLM outputs
- system architecture
- backend engineering
- data pipelines
- AI UX design
- production workflows

This is genuinely strong AI engineering experience.
