# Resume Analyzer - Quick Start Guide

## ✅ Project Status
This is a full-stack Resume Analyzer application using:
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + Google Gemini API
- **Analysis**: AI-powered resume matching and feedback

## 🚀 Quick Setup (2 minutes)

### 1. **Install Dependencies**
```bash
npm run install-all
```

### 2. **Get Gemini API Key**
- Visit: https://ai.google.dev/
- Get your free API key (60 requests/min)
- Copy it to `.env` file in the backend directory

### 3. **Configure Environment**
Edit `backend/.env`:
```env
GEMINI_API_KEY=your-api-key-here
PORT=5000
NODE_ENV=development
```

### 4. **Run the Application**

**Option A: Run both frontend and backend together**
```bash
npm run dev
```

**Option B: Run separately**
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### 5. **Access the App**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/analyze
- Mock Data (no API key needed): http://localhost:5000/api/mock-analysis

## ✨ Features
- ✅ Upload resume (PDF or DOCX)
- ✅ Paste job description
- ✅ Get AI-powered analysis with:
  - Match scores (overall, skills, experience, keywords)
  - Your strengths
  - Missing skills
  - Critical gaps
  - Improvement recommendations
  
## 📁 Project Structure
```
Hirelens/
├── frontend/              # React frontend
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── backend/               # Express backend
│   ├── server.js
│   ├── .env
│   └── package.json
├── package.json           # Root scripts
└── .env.local            # Placeholder config
```

## 🔧 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Run frontend + backend concurrently |
| `npm run dev:frontend` | Run React frontend only |
| `npm run dev:backend` | Run Node.js backend only |
| `npm run build` | Build frontend for production |
| `npm run preview` | Preview production build |
| `npm run install-all` | Install all dependencies |

## 📝 API Reference

### Analyze Resume
```bash
POST http://localhost:5000/api/analyze

Body: multipart/form-data
- resume: File (PDF or DOCX)
- jobDescription: Text

Response:
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": [...],
  "missingSkills": [...],
  "rejectionReasons": [...],
  "improvements": [...],
  "keyFindings": "..."
}
```

### Health Check
```bash
GET http://localhost:5000/api/health
```

### Mock Analysis (No API Key)
```bash
GET http://localhost:5000/api/mock-analysis
```

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm run install-all` |
| Frontend won't connect to backend | Ensure backend runs on port 5000 |
| API key error | Add GEMINI_API_KEY to backend/.env |
| Port already in use | Change PORT in backend/.env |

## 🎓 Learning Resources
- [Google Gemini API](https://ai.google.dev/)
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

## 📄 License
MIT

---

**Need help?** Check the backend console for detailed error messages.
