# Resume Analyzer - API Documentation

Complete API reference for the backend service.

---

## Base URL

```
http://localhost:5000
```

---

## Endpoints

### 1. POST /api/analyze

**Description**: Analyze a resume against a job description using Claude AI

**Method**: `POST`

**Headers**:
```
Content-Type: multipart/form-data
```

**Request Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `resume` | File | Yes | Resume file in PDF or DOCX format (max 10MB) |
| `jobDescription` | String | Yes | Job description text (min 50 characters) |

**cURL Example**:
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@/path/to/resume.pdf" \
  -F "jobDescription=Senior Software Engineer. Requirements: 5+ years experience, Python, JavaScript, AWS, Docker..."
```

**JavaScript/Fetch Example**:
```javascript
const formData = new FormData();
formData.append('resume', resumeFile);  // From file input
formData.append('jobDescription', jobDescriptionText);

const response = await fetch('http://localhost:5000/api/analyze', {
  method: 'POST',
  body: formData,
});

const analysis = await response.json();
console.log(analysis);
```

**Python Requests Example**:
```python
import requests

with open('resume.pdf', 'rb') as resume_file:
    files = {'resume': resume_file}
    data = {'jobDescription': 'Your job description here...'}
    
    response = requests.post(
        'http://localhost:5000/api/analyze',
        files=files,
        data=data
    )
    
    analysis = response.json()
    print(analysis)
```

**Response** (200 OK):
```json
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": [
    "Strong Python foundation",
    "React expertise",
    "AWS experience"
  ],
  "missingSkills": [
    "GraphQL",
    "Docker"
  ],
  "rejectionReasons": [
    "No leadership experience for senior role"
  ],
  "improvements": [
    "Add TypeScript projects",
    "Get AWS certification",
    "Document leadership activities"
  ],
  "keyFindings": "Your resume shows solid technical fundamentals..."
}
```

**Response Fields Explained**:

| Field | Type | Range | Description |
|-------|------|-------|-------------|
| `matchScore` | Integer | 0-100 | Overall match percentage |
| `skillsMatch` | Integer | 0-100 | Technical skills alignment |
| `experienceMatch` | Integer | 0-100 | Experience level alignment |
| `keywordMatch` | Integer | 0-100 | ATS keyword coverage |
| `strengths` | Array | | Top 3-5 resume strengths |
| `missingSkills` | Array | | Skills mentioned in job but not resume |
| `rejectionReasons` | Array | | Critical gaps that might cause rejection |
| `improvements` | Array | | Specific, actionable recommendations |
| `keyFindings` | String | | Strategic summary (2-3 paragraphs) |

**Error Response** (400 Bad Request):
```json
{
  "error": "No resume file provided"
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "No job description provided"
}
```

**Error Response** (500 Server Error):
```json
{
  "error": "Failed to parse PDF file"
}
```

**Error Response** (401 Unauthorized):
```json
{
  "error": "Failed to analyze resume with AI",
  "details": "Invalid API key"
}
```

**Status Codes**:
- `200 OK` - Analysis completed successfully
- `400 Bad Request` - Missing or invalid parameters
- `413 Payload Too Large` - File exceeds 10MB limit
- `415 Unsupported Media Type` - File format not PDF or DOCX
- `500 Internal Server Error` - Server error during processing
- `503 Service Unavailable` - Claude API is down

---

### 2. GET /api/health

**Description**: Health check endpoint to verify server is running

**Method**: `GET`

**Response** (200 OK):
```json
{
  "status": "Server is running",
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

**cURL Example**:
```bash
curl http://localhost:5000/api/health
```

---

### 3. GET /api/mock-analysis

**Description**: Returns mock analysis data for testing (no API key required)

**Method**: `GET`

**Response** (200 OK):
```json
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": [
    "Strong Python and JavaScript foundation",
    "Experience with React and modern web frameworks",
    "Cloud deployment experience with AWS"
  ],
  "missingSkills": [
    "GraphQL",
    "Docker/Kubernetes containerization",
    "TypeScript proficiency"
  ],
  "rejectionReasons": [
    "No demonstrated leadership experience for senior role",
    "Missing required AWS certification"
  ],
  "improvements": [
    "Add specific TypeScript projects to demonstrate type-safe development",
    "Document containerization experience with Docker and Kubernetes",
    "Highlight GraphQL API work or add a GraphQL project",
    "Get AWS Solutions Architect certification",
    "Add metrics and impact numbers to previous achievements"
  ],
  "keyFindings": "Your resume shows solid technical fundamentals..."
}
```

**Use Case**: Test frontend without API key or when Claude API is down

**cURL Example**:
```bash
curl http://localhost:5000/api/mock-analysis
```

---

## Analysis Algorithm Details

### Match Score Calculation

```
Overall Match Score = (Skills Match × 0.4) + (Experience Match × 0.4) + (Keywords Match × 0.2)

Example:
- Skills Match: 78
- Experience Match: 68  
- Keywords Match: 70

Overall = (78 × 0.4) + (68 × 0.4) + (70 × 0.2)
Overall = 31.2 + 27.2 + 14
Overall = 72.4 → 72%
```

### Skills Match
- Analyzes all technical and soft skills mentioned in both resume and job description
- Weights required skills heavier than nice-to-have skills
- Percentage = (skills found / total required skills) × 100

### Experience Match
- Compares years of experience, job titles, and role responsibility levels
- Evaluates career progression and growth trajectory
- Percentage = how well experience aligns with expectations

### Keywords Match
- Checks for industry keywords and ATS-important terms
- Identifies missing certifications and technologies
- Percentage = (keywords found / important keywords) × 100

---

## Testing Guide

### Test Suite

#### Test 1: Basic Functionality
```bash
# Verify endpoint exists
curl -I http://localhost:5000/api/analyze

# Expected: 405 Method Not Allowed (GET not allowed, only POST)
```

#### Test 2: Health Check
```bash
curl http://localhost:5000/api/health

# Expected: 200 OK with status message
```

#### Test 3: Mock Analysis
```bash
curl http://localhost:5000/api/mock-analysis

# Expected: 200 OK with sample analysis
```

#### Test 4: Missing Resume File
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "jobDescription=Senior Software Engineer"

# Expected: 400 Bad Request - "No resume file provided"
```

#### Test 5: Missing Job Description
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@resume.pdf"

# Expected: 400 Bad Request - "No job description provided"
```

#### Test 6: Invalid File Type
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@image.jpg" \
  -F "jobDescription=Job description"

# Expected: 415 Unsupported Media Type
```

#### Test 7: Full Analysis (Success)
```bash
curl -X POST http://localhost:5000/api/analyze \
  -F "resume=@resume.pdf" \
  -F "jobDescription=$(cat job_description.txt)"

# Expected: 200 OK with full analysis JSON
```

---

## Response Examples

### High Match (>80%)

Scenario: Experienced candidate with all required skills

```json
{
  "matchScore": 88,
  "skillsMatch": 92,
  "experienceMatch": 87,
  "keywordMatch": 85,
  "strengths": [
    "Excellent technical skill alignment",
    "Experience exceeds requirements",
    "All required certifications present",
    "Strong relevant project portfolio"
  ],
  "missingSkills": [],
  "rejectionReasons": [],
  "improvements": [
    "Highlight specific architectural decisions in past projects",
    "Add more quantifiable metrics to achievements",
    "Include technical blog posts or open source contributions"
  ],
  "keyFindings": "This is an excellent match. You have all required skills and exceed experience expectations. Focus on presenting your work clearly and emphasizing impact."
}
```

### Medium Match (60-80%)

Scenario: Good candidate with some gaps

```json
{
  "matchScore": 72,
  "skillsMatch": 78,
  "experienceMatch": 68,
  "keywordMatch": 70,
  "strengths": [
    "Strong core technical skills",
    "Relevant project experience",
    "Good communication skills demonstrated"
  ],
  "missingSkills": [
    "GraphQL",
    "Kubernetes"
  ],
  "rejectionReasons": [
    "Experience level 1-2 years below requirements"
  ],
  "improvements": [
    "Add GraphQL project to portfolio",
    "Document Kubernetes experience or take online course",
    "Emphasize leadership and mentoring activities"
  ],
  "keyFindings": "You're a competitive candidate but need to address specific gaps. GraphQL and Kubernetes knowledge would significantly improve your candidacy."
}
```

### Low Match (<60%)

Scenario: Junior candidate for senior role

```json
{
  "matchScore": 42,
  "skillsMatch": 45,
  "experienceMatch": 38,
  "keywordMatch": 50,
  "strengths": [
    "Solid fundamentals in core languages",
    "Shows willingness to learn"
  ],
  "missingSkills": [
    "System design",
    "Microservices",
    "Advanced AWS",
    "Database optimization",
    "Leadership experience"
  ],
  "rejectionReasons": [
    "Experience level too junior for senior position (need 3-4 more years)",
    "No demonstrated architectural thinking",
    "Missing multiple critical technologies"
  ],
  "improvements": [
    "Consider applying to mid-level engineer roles instead",
    "Build a multi-service project to understand microservices",
    "Study system design on educative.io or other platforms",
    "Get AWS Solutions Architect certification",
    "Contribute to open source to build portfolio"
  ],
  "keyFindings": "This role is currently a poor fit for your experience level. Focus on mid-level positions first, then target this role in 2-3 years with a more advanced skillset."
}
```

---

## Performance Notes

### Typical Response Times
- **File parsing**: 1-2 seconds
- **Claude API call**: 3-8 seconds
- **Total**: 4-10 seconds

### Bottlenecks
1. **Claude API latency** - Most time spent here (5-8 seconds)
2. **File parsing** - Negligible (1-2 seconds)
3. **Network latency** - Depends on internet speed

### Optimization Tips
- For production, consider caching for identical job descriptions
- Batch process multiple resumes for same job
- Implement request queuing for high traffic
- Add CDN for static assets

---

## Limits & Rate Limiting

### Current Limits (Dev Environment)
- File size: 10MB max
- Resume text length: No limit (tested up to 50KB)
- Job description length: No limit
- Concurrent requests: 1 (no queueing)

### Production Recommendations
- Implement rate limiting: 10 requests per IP per minute
- Add request validation and sanitization
- Implement job queue for large files
- Add timeout: 30 seconds max per request
- Cache identical analyses

---

## Authentication & Security

### Current Security
- **No authentication required** (local dev mode)
- CORS enabled for localhost:3000 only
- File upload type validation
- File size validation

### Production Recommendations
- Add JWT authentication
- Implement API key system
- Use HTTPS only
- Add request signing
- Rate limiting per user/IP
- Audit logging

---

## Webhook Support (Future)

Reserved for future expansion:
```
POST /api/analyze/async
- Returns job_id immediately
- Webhook callback when analysis complete
- Long-polling support
```

---

## Changelog

### Version 1.0.0 (Current)
- ✅ Resume upload (PDF/DOCX)
- ✅ Job description analysis
- ✅ AI-powered feedback using Claude
- ✅ Structured JSON responses
- ✅ Mock endpoint for testing

### Version 1.1.0 (Planned)
- 🔄 Async analysis with webhooks
- 🔄 Batch processing
- 🔄 Analysis history storage
- 🔄 User authentication
- 🔄 Export to PDF report

---

## Troubleshooting API

### Debugging API Calls

**Enable verbose logging**:
```bash
# Backend terminal with debug mode
DEBUG=* npm start
```

**Test with different tools**:
```bash
# Postman
# 1. Create new POST request
# 2. URL: http://localhost:5000/api/analyze
# 3. Body → form-data
# 4. Add resume file and jobDescription text

# Insomnia
# Similar to Postman

# VS Code REST Client
POST http://localhost:5000/api/analyze
```

### Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "No resume file provided" | Missing file in form data | Ensure `resume` field is included |
| "No job description provided" | Missing text field | Ensure `jobDescription` field is not empty |
| "Failed to parse PDF file" | Corrupted or invalid PDF | Try different PDF or DOCX file |
| "401 Unauthorized" | Invalid API key | Check `.env` file, get new key from console |
| "Connection refused" | Backend not running | Start backend with `npm start` |
| "CORS error" | Frontend not on localhost:3000 | Check CORS config in server.js |

---

## Support & Resources

- **Full Docs**: See README.md
- **Setup Guide**: See SETUP.md
- **API Examples**: See EXAMPLE_RESPONSE.json
- **Anthropic Docs**: https://docs.anthropic.com/

---

**Happy analyzing! 🚀**
