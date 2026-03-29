# Resume Analyzer - AI-Powered Job Application Feedback Tool

A full-stack web application that helps students and job seekers optimize their resumes by providing AI-powered analysis against job descriptions. Upload your resume, paste a job description, and get actionable feedback in seconds.

![Tech Stack](https://img.shields.io/badge/React-18-61DAFB?logo=react) ![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38B2AC?logo=tailwindcss) ![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs) ![Claude API](https://img.shields.io/badge/Claude-API-000000)

---

## 🎯 Features

- ✅ **Resume Upload**: Support for PDF and DOCX formats
- ✅ **Job Description Matching**: Paste any job description for analysis
- ✅ **AI Analysis**: Powered by Claude API for intelligent feedback
- ✅ **Match Scores**: Overall, skills, experience, and keyword match percentages
- ✅ **Actionable Feedback**:
  - Your strengths relative to the role
  - Missing skills to acquire
  - Critical gaps that might cause rejection
  - Specific improvement suggestions with checklist
- ✅ **Modern UI**: Dark mode, gradient design, smooth animations
- ✅ **Hackathon-Ready**: One-click analysis, no complex setup

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Port 3000)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │ File Upload  │  │ Job Desc     │  │ Results Display  │ │
│  │   Component  │  │  TextArea    │  │   Dashboard      │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP POST (multipart/form-data)
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              Node.js/Express Backend (Port 5000)            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           /api/analyze endpoint                      │  │
│  │  1. Receive resume file + job description            │  │
│  │  2. Extract text from PDF/DOCX                       │  │
│  │  3. Call Claude API with analysis prompt             │  │
│  │  4. Parse JSON response                              │  │
│  │  5. Return structured analysis                       │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP Response (JSON)
                           ▼
                    Claude API
              (Anthropic - AI Analysis)
```

---

## 📋 Project Structure

```
resume-analyzer/
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Tailwind + custom styles
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind configuration
│   ├── postcss.config.js        # PostCSS configuration
│   └── package.json             # Frontend dependencies
│
├── backend/
│   ├── server.js                # Express server + API routes
│   ├── .env.example             # Environment variables template
│   ├── .env                     # Your actual .env (not committed)
│   └── package.json             # Backend dependencies
│
└── docs/
    ├── SETUP.md                 # Detailed setup instructions
    ├── API.md                   # API documentation
    └── EXAMPLE_RESPONSE.json    # Example analysis response
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- npm or yarn
- Anthropic API Key ([Get one here](https://console.anthropic.com/))

### Step 1: Clone and Setup Backend

```bash
# Create project directory
mkdir resume-analyzer
cd resume-analyzer

# Setup backend
mkdir backend
cd backend

# Copy the provided package.json
# (Use the package-backend.json from the outputs)
cp package-backend.json package.json

# Install dependencies
npm install

# Create .env file with your Anthropic API key
echo "ANTHROPIC_API_KEY=sk-ant-your-key-here" > .env
echo "PORT=5000" >> .env
echo "NODE_ENV=development" >> .env

# Start backend server
npm start
# Backend should be running on http://localhost:5000
```

### Step 2: Setup Frontend

```bash
# In a new terminal, navigate to project root
cd resume-analyzer

# Setup frontend
mkdir frontend
cd frontend

# Copy files to frontend/src/
# - frontend.jsx → src/App.jsx
# - main.jsx
# - index.css
# Also copy package.json, vite.config.js, tailwind.config.js, etc.

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will open at http://localhost:3000
```

### Step 3: Test the Application

1. **Access the app**: Open http://localhost:3000 in your browser
2. **Upload a resume**: Click the upload area and select a PDF or DOCX file
3. **Paste a job description**: Copy any job description into the text area
4. **Click "Analyze Resume"**: Wait for AI analysis (typically 5-10 seconds)
5. **Review results**: See match scores, strengths, missing skills, and recommendations

---

## 📦 Installation Details

### Backend Dependencies Explained

```json
{
  "@anthropic-ai/sdk": "Official Anthropic SDK for Claude API",
  "express": "Web framework for routing and server",
  "multer": "Middleware for handling file uploads",
  "cors": "Cross-origin resource sharing for frontend access",
  "dotenv": "Load environment variables from .env",
  "pdf-parse": "Extract text from PDF files",
  "mammoth": "Extract text from DOCX files"
}
```

### Frontend Dependencies Explained

```json
{
  "react": "UI library",
  "react-dom": "React DOM rendering",
  "lucide-react": "Beautiful SVG icons",
  "vite": "Fast build tool and dev server",
  "tailwindcss": "CSS framework for styling",
  "postcss": "CSS processing",
  "autoprefixer": "Add vendor prefixes automatically"
}
```

---

## 🔌 API Reference

### POST /api/analyze

**Description**: Analyze a resume against a job description

**Request**:
```
Method: POST
URL: http://localhost:5000/api/analyze
Content-Type: multipart/form-data

Fields:
- resume (File): PDF or DOCX file
- jobDescription (String): Job description text
```

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobDescription=<job_description.txt"
```

**Response** (200 OK):
```json
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": ["Strong Python foundation", "React experience"],
  "missingSkills": ["GraphQL", "Docker"],
  "rejectionReasons": ["No leadership experience"],
  "improvements": ["Add TypeScript projects", "Get AWS certification"],
  "keyFindings": "Your resume shows solid technical fundamentals..."
}
```

### GET /api/health

**Description**: Health check endpoint

**Response**:
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### GET /api/mock-analysis

**Description**: Get sample analysis response (for testing without API key)

---

## 🧠 How the Analysis Works

### System Prompt (Master Prompt)

The backend uses a carefully crafted system prompt that instructs Claude to:

1. **Analyze Match Percentages**
   - **Skills Match**: Compares required/preferred skills in job description with skills mentioned in resume
   - **Experience Match**: Evaluates how well experience level aligns with role requirements
   - **Keywords Match**: Checks ATS (Applicant Tracking System) keyword alignment
   - **Overall Score**: Weighted average of the three metrics

2. **Identify Strengths**: What the resume does exceptionally well

3. **Find Gaps**: Missing skills, experience, certifications, etc.

4. **Flag Critical Issues**: Reasons that might lead to automatic rejection

5. **Provide Actionable Improvements**: Specific, implementable recommendations

### Data Flow

```
User Input
    ↓
Frontend (React)
    ├─ File upload handling
    ├─ Form validation
    └─ API request formatting
        ↓
Backend (Express)
    ├─ Receive multipart form data
    ├─ Extract text from resume (PDF/DOCX)
    ├─ Validate job description
    └─ Call Claude API
        ↓
Claude API
    ├─ Apply system prompt (master prompt)
    ├─ Inject resume text + job description
    ├─ Generate structured JSON response
        └─ Return to backend
        ↓
Backend
    ├─ Parse JSON response
    ├─ Validate structure
    └─ Send to frontend
        ↓
Frontend
    ├─ Display results
    ├─ Show progress bars
    ├─ Highlight gaps and recommendations
        ↓
User sees results
```

---

## 🎨 Customization

### Modify the Analysis Prompt

Edit the `buildSystemPrompt()` function in `server.js` to change:
- Analysis criteria
- Scoring methodology
- Feedback categories
- Response structure

### Change Color Scheme

Edit the Tailwind colors in `frontend.jsx`:
```jsx
// Change gradient colors
className="bg-gradient-to-r from-blue-500 to-purple-500"

// Change text colors
className="text-slate-300"
```

### Add More Match Metrics

1. Update the system prompt to calculate additional metrics
2. Add new fields to the JSON response structure
3. Add new components in the frontend results section

---

## 🚨 Troubleshooting

### "Cannot find module '@anthropic-ai/sdk'"
```bash
cd backend
npm install
```

### "Port 5000 already in use"
```bash
# Change PORT in .env or kill the process
lsof -i :5000
kill -9 <PID>
```

### "CORS error: Access to XMLHttpRequest blocked"
- Ensure backend is running on port 5000
- Check CORS configuration in `server.js`
- Frontend should be on port 3000

### "Invalid API Key"
- Get a free API key from [Anthropic Console](https://console.anthropic.com/)
- Add to `.env` file: `ANTHROPIC_API_KEY=sk-ant-xxx`
- Restart backend server

### "Failed to parse PDF/DOCX"
- Ensure file is not corrupted
- Try a different file format
- Check file size (max 10MB)

### "Analysis returns error"
- Check backend logs for detailed error message
- Verify job description is not empty
- Try the `/api/mock-analysis` endpoint to test frontend

---

## 📊 Example Analysis Response

```json
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": [
    "Strong Python and JavaScript foundation",
    "Demonstrated React expertise with multiple projects",
    "Cloud deployment experience with AWS services"
  ],
  "missingSkills": [
    "GraphQL API development",
    "Docker/Kubernetes containerization",
    "TypeScript proficiency"
  ],
  "rejectionReasons": [
    "No demonstrated leadership or mentorship experience for senior role",
    "Missing required AWS Solutions Architect certification"
  ],
  "improvements": [
    "Add specific TypeScript projects to demonstrate type-safe development practices",
    "Document hands-on containerization experience with Docker and orchestration with Kubernetes",
    "Highlight GraphQL API work or complete a personal GraphQL project",
    "Obtain AWS Solutions Architect - Associate certification",
    "Quantify impact: Add metrics, revenue increase, or performance improvements to achievements"
  ],
  "keyFindings": "Your resume demonstrates solid technical fundamentals with strong React and backend development experience. However, for this senior role, the primary gaps are lack of demonstrated leadership, architectural thinking, and relevant certifications. Your experience level is approximately 2-3 years below the seniority requirement. To significantly improve your candidacy, focus on: (1) re-framing past work to emphasize decision-making and system design, (2) pursuing at least one AWS certification, (3) documenting any mentorship or technical leadership activities. These three changes would likely improve your match score to 85%+."
}
```

---

## 🔒 Security Considerations

- **API Keys**: Store `ANTHROPIC_API_KEY` in `.env`, never commit to git
- **File Upload**: Backend validates file type and size (10MB limit)
- **CORS**: Configured to accept requests only from localhost
- **Data**: Resume text is not stored, only sent to Claude for analysis

### Add to `.gitignore`:
```
.env
node_modules/
dist/
*.log
.DS_Store
```

---

## 📈 Performance Tips

### Frontend
- Built with Vite for fast development and production builds
- Uses React for efficient re-rendering
- Lazy loads components (ready for implementation)

### Backend
- Uses streams for file processing (ready for implementation)
- Connection pooling for multiple requests
- Caches regex patterns for file validation

### Claude API
- Batch processing ready (for future)
- Token optimization through careful prompting
- Typical response time: 5-10 seconds

---

## 🎯 Hackathon Tips

1. **Demo Script**:
   - Pre-prepare 2-3 sample resumes and job descriptions
   - Run analysis in advance to show results quickly
   - Have mock data endpoint ready as backup

2. **UI/UX**:
   - Dark theme is modern and easy on eyes for demo
   - Animations create wow factor
   - Progress indicators show something is happening

3. **Talking Points**:
   - AI-powered vs. keyword matching (shows sophistication)
   - Supports both PDF and DOCX (wide compatibility)
   - Structured feedback (not just text dump)
   - Can analyze any job description (flexibility)

4. **Future Features**:
   - Compare multiple resumes for same job
   - Track improvements over time
   - Export PDF report
   - LinkedIn integration
   - Cover letter generation

---

## 📝 License

MIT License - Feel free to use this project for your hackathon!

---

## 🤝 Support

**Need help?**
- Check the troubleshooting section above
- Review the API documentation
- Check Claude API docs: https://docs.anthropic.com
- Anthropic support: support@anthropic.com

---

## 📚 Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com/)
- [Claude Models Documentation](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Good luck with your hackathon! 🚀**
