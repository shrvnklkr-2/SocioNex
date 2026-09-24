# SocioNex

React + Tailwind frontend with a FastAPI mock backend for hackathon demos. There is no real AI, vector search, or external model API. Classification, matching, and confidence scores are random or static.

## Frontend

```bash
npm install
npm run dev
```

## Mock backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --port 8001
```

API docs: http://127.0.0.1:8000/docs

Vite proxies `/api` to the FastAPI server on port **8001**. Seed logins use password `demo123`, for example `asha.kumari@example.com` (citizen) and `hello@gramvikas.example` (community). Keep the backend running while you use the React app.
