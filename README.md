# HIRKANI - Pregnancy Food Safety Guide

Production-ready full-stack mobile web app to scan foods and classify pregnancy safety.

## Stack
- Frontend: Next.js 15, React 19, TailwindCSS, Framer Motion, PWA
- Backend: FastAPI, SQLAlchemy, JWT auth
- DB/Cache: PostgreSQL, Redis
- AI pipeline: ZXing (web barcode), Tesseract OCR, EfficientNet image recognition

## Features
- Auth + pregnancy profile onboarding
- Personalized deterministic safety rules engine
- Multi-stage detection pipeline:
  - Barcode -> OpenFoodFacts lookup
  - OCR label extraction
  - Vision recognition fallback (EfficientNet)
- Result badge states:
  - SAFE
  - CONSUME WITH CAUTION
  - AVOID DURING PREGNANCY
- Explanation generator from rule hits
- History + favorites + trimester tips
- Trusted references + medical disclaimer
- Encryption for sensitive profile fields
- Redis caching for fast repeated scan lookups

## Local Setup
### 1) Infra
Run Postgres + Redis:

```bash
docker compose up -d db redis
```

### 2) Backend
```bash
cd backend
cp .env.example .env
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3) Frontend
```bash
cd frontend
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000

## API Overview
- `POST /auth/signup`
- `POST /auth/login`
- `PUT /profile`
- `GET /profile`
- `POST /scan/analyze`
- `POST /scan/upload`
- `GET /scan/history`
- `GET /tips`
- `GET /favorites`
- `POST /favorites`
- `DELETE /favorites/{id}`

## Deployment
### Frontend (Vercel)
- Import `frontend/` project in Vercel
- Set `NEXT_PUBLIC_API_URL=https://<backend-domain>`

### Backend (Render/Railway)
- Deploy `backend/`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Set env vars from `.env.example`

### Database
- Use Supabase Postgres
- Set `DATABASE_URL` to Supabase connection string

## Compliance
This tool provides guidance and does not replace professional medical advice.
