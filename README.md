# 🛡️ AI Wage Theft Detector

**Tagline:** *Every Hour Counted. Every Rupee Protected.*

Millions of gig workers, construction workers, delivery partners, and informal laborers are underpaid because they have no simple, reliable way to verify whether they received statutory minimum wages.

**AI Wage Theft Detector** is a full-stack platform designed to empower informal workforce members. It allows workers to record work details using natural voice commands, automatically extracts structured work data using Google Gemini AI, audits received pay against official minimum wage benchmarks, calculates underpayment risk scores, and generates downloadable formal legal complaint letters with PDF reports.

---

## 🌟 Key Features

* 🎙️ **Voice Work Logger**: Speak shift details (e.g. *"Today I worked 8 hours as a construction worker in Chennai"*) using Web Speech API with real-time transcript visualization.
* 🤖 **AI Extraction Engine**: Powered by Google Gemini API to automatically parse job roles, hours worked, and locations into structured JSON.
* 📊 **Wage Theft Detection Engine**: Audits received pay against statutory state wage rates (`wage_rates.json`), calculating expected wages, underpayment difference, and severity risk scores (Low, Medium, High, Critical).
* 📈 **Risk Meter Visualization**: Interactive visual progress gauge with color indicators (Low: 0–10%, Medium: 10–25%, High: 25–50%, Critical: >50%).
* 📜 **AI Complaint Letter Generator**: Generates formal, statutory complaint letters addressed to the Regional Labor Commissioner under the Minimum Wages Act, 1948.
* 📄 **PDF Audit Report Export**: Server-side ReportLab PDF generation for offline filing and submission to legal aid authorities.
* 🔄 **Offline Fallback Engine**: Works seamlessly offline with client-side and server-side fallback heuristic engines when Gemini API key or network connection is unavailable.

---

## 🏗️ Project Architecture

```plaintext
ai-wage-theft-detector/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── VoiceLog.jsx
│   │   │   ├── Verification.jsx
│   │   │   └── Report.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── WageCard.jsx
│   │   │   ├── RiskMeter.jsx
│   │   │   ├── StatsCard.jsx
│   │   │   └── Footer.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   │   ├── speech.py
│   │   │   ├── detect.py
│   │   │   └── complaint.py
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   ├── wage_service.py
│   │   │   ├── speech_service.py
│   │   │   └── pdf_service.py
│   │   ├── models/
│   │   │   ├── worker.py
│   │   │   └── report.py
│   │   └── utils/
│   │       └── helpers.py
│   ├── data/
│   │   └── wage_rates.json
│   ├── requirements.txt
│   └── .env
│
├── docs/
│   ├── architecture.png
│   ├── workflow.png
│   └── screenshots/
├── README.md
└── .gitignore
```

---

## ⚡ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS, Glassmorphism design system
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **PDF Engine**: ReportLab
- **Server**: Uvicorn

### AI & Data
- **AI Model**: Google Gemini API (`gemini-1.5-flash`)
- **Dataset**: `wage_rates.json` (Coverage across Indian states & cities)

---

## 🚀 Local Quickstart Guide

### 1. Prerequisites
- Python 3.9+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
# Copy or edit .env file
GEMINI_API_KEY=your_google_gemini_api_key_here

# Run FastAPI server
uvicorn app.main:app --reload --port 8000
```
Backend API will be live at `http://localhost:8000` (Swagger docs available at `http://localhost:8000/docs`).

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Run Vite dev server
npm run dev
```
Frontend Web App will be live at `http://localhost:5173`.

---

## 🔌 API Endpoint Documentation

### 1. `POST /speech/extract`
Extracts job type, hours worked, and location from transcript.
* **Request:**
  ```json
  {
    "transcript": "Today I worked 8 hours as a construction worker in Chennai"
  }
  ```
* **Response:**
  ```json
  {
    "job_type": "Construction Worker",
    "hours_worked": 8,
    "location": "Chennai",
    "confidence": 0.98
  }
  ```

### 2. `POST /detect`
Audits pay against minimum wage rates and calculates underpayment risk metrics.
* **Request:**
  ```json
  {
    "job_type": "Construction Worker",
    "location": "Chennai",
    "received_amount": 600,
    "hours_worked": 8
  }
  ```
* **Response:**
  ```json
  {
    "job_type": "Construction Worker",
    "location": "Chennai",
    "state": "Tamil Nadu",
    "expected_wage": 850.0,
    "received_amount": 600.0,
    "difference": 250.0,
    "risk_score": 29.4,
    "risk_level": "High",
    "is_underpaid": true,
    "hourly_rate_expected": 106.25,
    "hourly_rate_received": 75.0,
    "legal_ref": "Tamil Nadu Minimum Wages Act - Building and Construction"
  }
  ```

### 3. `POST /complaint`
Generates a statutory complaint letter using Gemini AI.
* **Request:**
  ```json
  {
    "job_type": "Construction Worker",
    "location": "Chennai",
    "expected": 850,
    "received": 600,
    "worker_name": "Ramesh Kumar"
  }
  ```
* **Response:**
  ```json
  {
    "complaint": "TO:\nThe Regional Labor Commissioner...",
    "summary": "Wage theft detected...",
    "legal_section": "Section 12 & 20, Minimum Wages Act, 1948"
  }
  ```

### 4. `POST /complaint/pdf`
Returns binary stream of PDF report attachment.

---

## 🌐 Deployment Instructions

### Deploy Frontend to Netlify
1. Connect GitHub repository to Netlify.
2. Set **Base directory**: `frontend`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `frontend/dist`
5. Add Environment Variable: `VITE_API_URL` -> your Render backend URL.

### Deploy Backend to Render
1. Create a new **Web Service** on Render pointing to your GitHub repository.
2. Set **Root Directory**: `backend`
3. Set **Environment**: `Python 3`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable: `GEMINI_API_KEY` -> your Gemini API key.

---

## 📄 License & Social Impact
Created for social impact, worker advocacy, and hackathon presentation.
