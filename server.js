/**
 * Resume Analyzer Backend
 * Node.js + Express + Google Gemini API
 * 
 * This backend:
 * 1. Receives multipart form data (resume file + job description)
 * 2. Extracts text from PDF/DOCX files
 * 3. Sends resume + job description to Gemini API
 * 4. Returns structured analysis as JSON
 * 
 * Using Google's Gemini API (Free tier: 60 requests/minute)
 * Get API key: https://ai.google.dev/
 */

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Enable CORS for frontend requests
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
}));

app.use(express.json());

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedMimes.includes(file.mimetype) || file.originalname.endsWith('.docx')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed'));
    }
  },
});

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ============================================================================
// FILE PARSING UTILITIES
// ============================================================================

/**
 * Extract text from PDF file buffer
 */
async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF file');
  }
}

/**
 * Extract text from DOCX file buffer
 */
async function extractTextFromDOCX(buffer) {
  try {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  } catch (error) {
    console.error('DOCX parsing error:', error);
    throw new Error('Failed to parse DOCX file');
  }
}

/**
 * Extract text from resume file (supports PDF and DOCX)
 */
async function extractResumeText(file) {
  if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
    return extractTextFromPDF(file.buffer);
  } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.originalname.endsWith('.docx')) {
    return extractTextFromDOCX(file.buffer);
  } else {
    throw new Error('Unsupported file format');
  }
}

// ============================================================================
// GEMINI API INTEGRATION - MASTER PROMPT
// ============================================================================

/**
 * Build the system prompt for resume analysis
 * This is the master prompt that guides Gemini's analysis
 */
function buildSystemPrompt() {
  return `You are an expert ATS (Applicant Tracking System) and resume analyst specializing in helping students and job seekers optimize their applications.

Your task is to analyze a resume against a job description and provide structured, actionable feedback.

ANALYSIS FRAMEWORK:
1. Calculate match percentages for:
   - Skills Match: How many required/preferred skills are present (0-100)
   - Experience Match: How well experience aligns with role requirements (0-100)
   - Keywords Match: ATS keyword alignment (0-100)
   - Overall Match Score: Weighted average (0-100)

2. Identify:
   - STRENGTHS: What the resume does well relative to the job
   - MISSING SKILLS: Required or highly desired skills not mentioned
   - REJECTION REASONS: Critical gaps that might result in rejection
   - IMPROVEMENTS: Specific, actionable changes to make

3. Provide KEY FINDINGS: A brief strategic summary

RESPONSE FORMAT:
Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "matchScore": <0-100>,
  "skillsMatch": <0-100>,
  "experienceMatch": <0-100>,
  "keywordMatch": <0-100>,
  "strengths": [
    "<strength1>",
    "<strength2>",
    "<strength3>"
  ],
  "missingSkills": [
    "<skill1>",
    "<skill2>",
    "<skill3>"
  ],
  "rejectionReasons": [
    "<reason1>",
    "<reason2>"
  ],
  "improvements": [
    "<improvement1>",
    "<improvement2>",
    "<improvement3>",
    "<improvement4>",
    "<improvement5>"
  ],
  "keyFindings": "<2-3 paragraph strategic summary of the fit and top priorities>"
}

GUIDELINES:
- Be constructive but honest
- Focus on quantifiable metrics where possible
- Prioritize technical/hard skills over soft skills
- Consider career progression and growth potential
- Flag dealbreakers explicitly
- Make improvements specific and implementable`;
}

/**
 * Build the user prompt with resume and job description
 */
function buildUserPrompt(resumeText, jobDescription) {
  return `RESUME:
---
${resumeText}
---

JOB DESCRIPTION:
---
${jobDescription}
---

Please analyze this resume against the job description and return structured JSON feedback.`;
}

/**
 * Call Gemini API for resume analysis
 */
async function analyzeResumeWithGemini(resumeText, jobDescription) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(resumeText, jobDescription);
    
    // For Gemini, we'll use the chat interface
    const chat = model.startChat({
      history: [],
    });
    
    const message = await chat.sendMessage(`${systemPrompt}\n\n${userPrompt}`);
    const responseText = message.response.text();
    
    // Extract JSON from response (Gemini might add text around it)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }
    
    const analysis = JSON.parse(jsonMatch[0]);
    return analysis;
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to analyze resume with Gemini: ' + error.message);
  }
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString(), api: 'Gemini' });
});

/**
 * Main analysis endpoint
 * POST /api/analyze
 * 
 * Accepts:
 * - resume: File (PDF or DOCX)
 * - jobDescription: Text field
 * 
 * Returns: JSON analysis object
 */
app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    // Validate inputs
    if (!req.file) {
      return res.status(400).json({ error: 'No resume file provided' });
    }

    if (!req.body.jobDescription || req.body.jobDescription.trim().length === 0) {
      return res.status(400).json({ error: 'No job description provided' });
    }

    console.log(`\n[${new Date().toISOString()}] Analyzing resume...`);
    console.log(`File: ${req.file.originalname} (${req.file.size} bytes)`);
    console.log(`Job Description length: ${req.body.jobDescription.length} characters`);

    // Extract text from resume
    const resumeText = await extractResumeText(req.file);
    console.log(`Extracted ${resumeText.length} characters from resume`);

    // Analyze with Gemini
    console.log('Sending to Gemini API...');
    const analysis = await analyzeResumeWithGemini(resumeText, req.body.jobDescription);
    console.log('Analysis complete');

    // Return structured analysis
    res.json(analysis);
  } catch (error) {
    console.error('Error in /api/analyze:', error.message);
    res.status(500).json({ 
      error: error.message || 'Analysis failed',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

/**
 * Mock analysis endpoint (for testing without API key)
 * GET /api/mock-analysis
 */
app.get('/api/mock-analysis', (req, res) => {
  const mockAnalysis = {
    "matchScore": 72,
    "skillsMatch": 78,
    "experienceMatch": 68,
    "keywordMatch": 70,
    "strengths": [
      "Strong Python and JavaScript foundation",
      "Experience with React and modern web frameworks",
      "Cloud deployment experience with Google Cloud and AWS"
    ],
    "missingSkills": [
      "GraphQL",
      "Docker/Kubernetes containerization",
      "TypeScript proficiency"
    ],
    "rejectionReasons": [
      "No demonstrated leadership experience for senior role",
      "Missing required Google Cloud certification"
    ],
    "improvements": [
      "Add specific TypeScript projects to demonstrate type-safe development",
      "Document containerization experience with Docker and Kubernetes",
      "Highlight GraphQL API work or add a GraphQL project",
      "Get Google Cloud certification (Associate Cloud Engineer or Professional)",
      "Add metrics and impact numbers to previous achievements"
    ],
    "keyFindings": "Your resume shows solid technical fundamentals with good React and backend experience. However, for this senior role, you need to demonstrate leadership, architectural thinking, and certifications. The gap between your experience level and the seniority requirement is the main concern. Focus on re-framing your past work to emphasize decision-making, mentorship, and system design thinking. Adding a couple of industry-recognized certifications would significantly strengthen your candidacy."
  };
  res.json(mockAnalysis);
});

// ============================================================================
// ERROR HANDLING & SERVER START
// ============================================================================

/**
 * Global error handler
 */
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: err.message || 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Resume Analyzer Backend (Gemini API)`);
  console.log(`${'='.repeat(60)}`);
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API Endpoint: http://localhost:${PORT}/api/analyze`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
  console.log(`Mock Data: http://localhost:${PORT}/api/mock-analysis`);
  console.log(`API: Google Gemini 1.5 Flash (Free tier)`);
  console.log(`${'='.repeat(60)}\n`);
  
  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  WARNING: GEMINI_API_KEY not set in .env');
    console.warn('Get your free API key from: https://ai.google.dev/');
    console.warn('The server will fail when trying to analyze resumes.\n');
  }
});
