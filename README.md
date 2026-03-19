# PromptRouter — AI Model Recommendation Engine

A web app that analyzes prompt complexity and recommends the most cost-effective LLM for the task.

## Architecture

```
Next.js Frontend <--REST--> FastAPI Backend
                              ├── Prompt Feature Extractor
                              ├── Task Classifier (ML)
                              ├── Complexity Scorer
                              ├── Model Recommender
                              └── Model Registry (pricing, capabilities)
```

## Quick Start

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` and the backend API on `http://localhost:8000`.

## Tech Stack

- **Backend**: Python 3.11+, FastAPI, spaCy, tiktoken, scikit-learn
- **Frontend**: Next.js 14+, React, TypeScript, Tailwind CSS
- **ML**: scikit-learn → XGBoost → optionally distilBERT

## Project Structure

```
prompt-router/
├── backend/
│   ├── app/
│   │   ├── api/        # API routes
│   │   ├── core/       # Config, constants
│   │   ├── ml/         # ML models, training scripts
│   │   ├── services/   # Business logic
│   │   └── models/     # Pydantic schemas
│   ├── data/           # Training data, model artifacts
│   ├── notebooks/      # Jupyter notebooks
│   ├── tests/
│   └── requirements.txt
├── frontend/           # Next.js + React
└── README.md
```
