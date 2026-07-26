# 🛡️ AI Wage Theft Detector

**Tagline:** *Every Hour Counted. Every Rupee Protected.*

Millions of gig workers, construction workers, delivery partners, and informal laborers are underpaid because they have no simple, reliable way to verify whether they received statutory minimum wages.

**AI Wage Theft Detector** is an advanced full-stack platform designed to empower informal workforce members. It allows workers to log work details using natural voice commands, automatically extracts structured work data using Google Gemini AI, audits received pay against official state minimum wage benchmarks, predicts wage theft risk using Machine Learning models trained on **1.718 Million real payroll records**, intelligently estimates shift hours from informal phrasing ("half day", "night shift"), supports **multi-job workdays**, provides user-scoped audit history logs, and generates **professional 3-page downloadable legal PDF audit reports**.

---

## 🌟 Key Features

* 🎙️ **Voice Work Logger**: Speak shift details (e.g. *"Today I worked 8 hours as a construction worker in Chennai"*) using Web Speech API with real-time transcript visualization.
* 🤖 **AI Extraction Engine**: Powered by Google Gemini API (`gemini-1.5-flash`) to parse job roles, hours worked, and locations into structured JSON.
* 🚀 **Primary Wage Verification Gateway**:
  - 3 distinct verification workflows: **Upload Payslip (AI OCR)**, **Start Voice Verification**, and **Manual Verification**.
  - Interactive selection highlight states (Amber highlight when selected, neutral slate when idle).
  - Instant, non-blocking 0ms route transitions.
  - Clear navigation back buttons (`← Back to Dashboard`, `← Change Verification Method`, `← Back to Verification Gateway`).
* 📄 **Professional 3-Page PDF Audit Report Generator**:
  - Direct client-side PDF document download powered by `jsPDF` (v4) and `jspdf-autotable` (v5).
  - **Page 1**: Worker & Audit details, Statutory Verdict Banner (Underpaid / Compliant), 4 financial metric summary cards, Risk Score Gauge, Compensation Breakdown table.
  - **Page 2**: Statutory Legal Analysis & Violations schedule (Minimum Wages Act 1948, Code on Wages 2019, Code on Social Security 2020), Evidence Log, Recommended Legal Action steps.
  - **Page 3**: Official Declaration & Signature Block (Worker Signature, Witness Signature, Date), Regional Labor Commissioner Grievance Helplines & Legal Aid Resources.
* 📜 **User-Scoped Verification History (`/history`)**:
  - Account-isolated verification history log system (`historyStorage`).
  - Users (**Harish**, **Shwetha**) view only their own verification records while Admin retains system-wide access.
  - Real-time search by job role, city, or verification method.
  - Modern icon-free custom select dropdown filters for methods and audit statuses.
  - Modern icon-free **From Date & To Date Range Calendar Picker** with interactive day selection and range highlighting.
  - Direct "View Report", "Download PDF Report", and single/clear record management.
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
  - Independent statutory wage audit per job with daily combined summary.
* 📊 **Statutory Wage Theft Engine**: Audits received pay against state gazette minimum wage rates (`wage_rates.json`), calculating expected wages, underpayment shortfall, and severity risk scores (Low, Medium, High, Critical).
* 👥 **User Account Management (Admin Panel)**:
  - Admin Panel with user management table, user status toggles (`ACTIVE` / `SUSPENDED`), and direct user account deletion.
* ✨ **Light Glow Hover Aesthetics & Ultra-Fast UX**:
  - High-end dark glassmorphism design system.
  - Glowing light borders (`section-glow`, `glass-card:hover`) on hover across all containers.
  - Active button micro-animations (`active:scale-[0.98]`) for 60 FPS responsive interactions.

---

## 🏗️ Project Architecture

```plaintext
AI-Wage-Theft-Detector/
├── frontend/
│   ├── public/
│   │   └── favicon.png (Official Emblem Logo)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VerificationCard.jsx
│   │   │   ├── VerificationRouter.jsx
│   │   │   ├── ModernDropdown.jsx
│   │   │   ├── ModernCalendarFilter.jsx
│   │   │   ├── VoiceRecorder.jsx
│   │   │   ├── WageCard.jsx
│   │   │   ├── PayslipUploader.jsx
│   │   │   ├── MultiJobForm.jsx
│   │   │   └── Footer.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── VerificationMethod.jsx
│   │   │   ├── Verification.jsx
│   │   │   ├── VoiceLog.jsx
│   │   │   ├── History.jsx
│   │   │   ├── Report.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── utils/
│   │   │   ├── generatePDFReport.js
│   │   │   └── historyStorage.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── authApi.js
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
│   │   │   └── pdf_service.py
│   │   └── ml/
│   │       ├── train_model.py
│   │       └── model_evaluator.py
│   ├── data/
│   │   ├── wage_rates.json
│   │   ├── datasets/ (7 CSV files, 1.718M total records)
│   │   └── models/ (wage_theft_pipeline.joblib)
│   ├── requirements.txt
│   └── .env
└── README.md
```

---

## ⚡ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Vanilla CSS + Tailwind CSS (Dark Glassmorphism Design System)
- **PDF Engine**: `jsPDF` (v4) & `jspdf-autotable` (v5)
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI (Python)
- **ML Engine**: Scikit-Learn, Joblib, Pandas, NumPy
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

---

## 📄 License & Social Impact
Created for social impact, worker advocacy, legal empowerment, and hackathon presentation.
