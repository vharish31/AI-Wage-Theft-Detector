# 🛡️ AI Wage Theft Detector

**Tagline:** *Every Hour Counted. Every Rupee Protected.*

Millions of gig workers, construction workers, delivery partners, and informal laborers are underpaid because they have no simple, reliable way to verify whether they received statutory minimum wages.

**AI Wage Theft Detector** is an advanced full-stack platform designed to empower informal workforce members. It allows workers to log work details using natural voice commands, automatically extracts structured work data using Google Gemini AI, audits received pay against official state minimum wage benchmarks, predicts wage theft risk using Machine Learning models trained on **1.718 Million real payroll records**, intelligently estimates shift hours from informal phrasing ("half day", "night shift"), supports **multi-job workdays**, and generates downloadable formal legal complaint letters with PDF reports.

---

## 🌟 Key Features

* 🎙️ **Voice Work Logger**: Speak shift details (e.g. *"Today I worked 8 hours as a construction worker in Chennai"*) using Web Speech API with real-time transcript visualization.
* 🤖 **AI Extraction Engine**: Powered by Google Gemini API (`gemini-1.5-flash`) to parse job roles, hours worked, and locations into structured JSON.
* 🧠 **1.718M Record ML Model Suite**:
  - Trained across **100% of 1,718,293 real payroll records** (7 datasets).
  - **99.98% Accuracy** Binary Wage Theft Classifier.
  - **$R^2 = 0.9973$** Underpayment Risk Score Regressor.
  - **99.98% Accuracy** Theft Type Multi-class Classifier.
* ⏱️ **Smart Hours Estimation**:
  - Natural language shift parser ("half day" $\rightarrow$ 4h, "morning to evening" $\rightarrow$ 8h, "night shift" $\rightarrow$ 10h, "overtime" $\rightarrow$ 10h).
  - Statutory duration validation (`<1h` invalid warning, `>16h` shift warning, `>24h` daily cap).
  - Confidence scoring banner with manual 0.5-hour stepper controls and quick selection cards.
* 💼 **Multi-Job Workday Support**:
  - Log multiple jobs performed in a single day (e.g., Morning: Construction Worker 5h, Afternoon: Painter 3h, Evening: Delivery Partner 2h).
  - Automatic multi-shift speech transcript detection and dynamic `+ Add Another Job` cards.
  - Independent statutory wage audit per job with daily combined summary card.
  - Unified legal complaint letter summarizing all wage theft discrepancies across multiple employers.
* 📊 **Statutory Wage Theft Engine**: Audits received pay against state gazette minimum wage rates (`wage_rates.json`), calculating expected wages, underpayment shortfall, and severity risk scores (Low, Medium, High, Critical).
* 📜 **Conditional Legal Complaint Generator**:
  - Skips complaint generation when received pay $\ge$ statutory expected wage (displays "No Legal Action Needed" card).
  - Generates formal legal complaint letters addressed to the Regional Labor Commissioner under the Minimum Wages Act, 1948 upon explicit button trigger.
* 📄 **PDF Audit Report Export**: Server-side ReportLab PDF generation for offline filing and submission to legal aid authorities.
* 🔄 **Offline Fallback Engine**: Works seamlessly offline with client-side and server-side fallback heuristic engines when Gemini API key or network connection is unavailable.

---

## 🏗️ Project Architecture

```plaintext
AI-Wage-Theft-Detector/
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
│   │   │   ├── ConfidenceBanner.jsx
│   │   │   ├── HoursSuggestionCard.jsx
│   │   │   ├── HoursConfirmation.jsx
│   │   │   ├── HoursEstimator.jsx
│   │   │   ├── JobCard.jsx
│   │   │   ├── JobTabs.jsx
│   │   │   ├── JobSummary.jsx
│   │   │   ├── MultiJobForm.jsx
│   │   │   ├── CombinedReport.jsx
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
│   │   │   ├── complaint.py
│   │   │   ├── wage_theft.py
│   │   │   ├── validate.py
│   │   │   ├── ml_routes.py
│   │   │   ├── hours.py
│   │   │   └── multi_job.py
│   │   ├── services/
│   │   │   ├── gemini_service.py
│   │   │   ├── wage_service.py
│   │   │   ├── speech_service.py
│   │   │   └── pdf_service.py
│   │   ├── models/
│   │   │   ├── worker.py
│   │   │   ├── report.py
│   │   │   ├── wage_theft_model.py
│   │   │   └── job.py
│   │   ├── ml/
│   │   │   ├── dataset_loader.py
│   │   │   ├── train_model.py
│   │   │   └── model_evaluator.py
│   │   └── utils/
│   │       ├── hours_estimator.py
│   │       ├── hours_validator.py
│   │       ├── multi_job_manager.py
│   │       └── helpers.py
│   ├── data/
│   │   ├── wage_rates.json
│   │   ├── datasets/ (7 CSV files, 1.718M total records)
│   │   └── models/ (wage_theft_pipeline.joblib)
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
- **Styling**: Vanilla CSS + Tailwind CSS (Dark Glassmorphism Design System)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **ML Engine**: Scikit-Learn, Joblib, Pandas, NumPy
- **PDF Engine**: ReportLab
- **Server**: Uvicorn

### AI & Datasets
- **AI Model**: Google Gemini API (`gemini-1.5-flash`)
- **ML Training Dataset**: 1,718,293 real payroll records across 7 dataset files
- **Statutory Gazette Dataset**: `wage_rates.json` (Coverage across Indian states & major cities)

---

## 📊 Machine Learning Model Suite Details

| Model Name | Task Type | Performance Metric | Training Dataset Size |
| :--- | :--- | :--- | :--- |
| **Wage Theft Binary Classifier** | Classification | **99.98% Accuracy** | 1,718,293 records |
| **Risk Score Regressor** | Regression | **$R^2 = 0.9973$** | 1,718,293 records |
| **Theft Type Multi-class Classifier** | Multi-class | **99.98% Accuracy** | 1,718,293 records |

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

# Configure environment variables (.env)
GEMINI_API_KEY=your_google_gemini_api_key_here

# (Optional) Train ML Model Suite on 1.718M Records
python -m app.ml.train_model

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

## 🔌 Core API Endpoints

### 1. `POST /speech/extract`
Extracts job type, hours worked, and location from natural voice transcripts.

### 2. `POST /detect`
Audits pay against statutory minimum wage rates and calculates underpayment risk metrics.

### 3. `POST /hours/estimate`
Intelligently estimates work hours from informal phrasing ("half day", "morning to evening", "night shift").

### 4. `POST /multi-job/audit`
Audits multiple jobs performed in a single day independently and returns a combined daily summary.

### 5. `POST /multi-job/complaint`
Generates a combined legal complaint letter summarizing all wage theft discrepancies across multiple employers.

### 6. `POST /ml/predict-wage-theft`
Predicts wage theft using the trained ML model suite (1.718M records).

### 7. `POST /complaint/pdf`
Returns binary PDF audit report stream for offline printing and submission.

---

## 🌐 Deployment Instructions

### Deploy Frontend to Netlify
1. Connect GitHub repository to Netlify.
2. Set **Base directory**: `frontend`
3. Set **Build command**: `npm run build`
4. Set **Publish directory**: `frontend/dist`
5. Add Environment Variable: `VITE_API_URL` $\rightarrow$ your backend server URL.

### Deploy Backend to Render
1. Create a new **Web Service** on Render pointing to your GitHub repository.
2. Set **Root Directory**: `backend`
3. Set **Environment**: `Python 3`
4. Set **Build Command**: `pip install -r requirements.txt`
5. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variable: `GEMINI_API_KEY` $\rightarrow$ your Gemini API key.

---

## 📄 License & Social Impact
Created for social impact, worker advocacy, legal empowerment, and hackathon presentation.
