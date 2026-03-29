import React, { useState, useRef } from 'react';
import { Upload, AlertCircle, CheckCircle, Loader, Leaf, Sparkles } from 'lucide-react';

export default function ResumeAnalyzer() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [usesMockData, setUsesMockData] = useState(false);
  const fileInputRef = useRef(null);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.docx'))) {
      setResumeFile(file);
      setError('');
    } else {
      setError('Please upload a PDF or DOCX file');
    }
  };

  // Mock data fallback
  const getMockAnalysis = () => ({
    matchScore: 72,
    skillsMatch: 78,
    experienceMatch: 68,
    keywordMatch: 70,
    strengths: [
      'Strong foundation in required technologies',
      'Relevant project experience demonstrated',
      'Clear communication in resume'
    ],
    missingSkills: [
      'Advanced system design patterns',
      'Enterprise architecture experience'
    ],
    rejectionReasons: [
      'Experience level slightly below requirements'
    ],
    improvements: [
      'Document architectural decisions from past projects',
      'Add metrics and quantifiable impact to achievements',
      'Highlight leadership or mentorship activities',
      'Consider pursuing relevant certifications'
    ],
    keyFindings: 'You are a competitive candidate with solid fundamentals. Focus on demonstrating higher-level architectural thinking and quantifiable business impact.'
  });

  // Handle analysis submission
  const handleAnalyze = async () => {
    if (!resumeFile || !jobDescription.trim()) {
      setError('Please upload resume and enter job description');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('jobDescription', jobDescription);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      try {
        const response = await fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          body: formData,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error('API Error');
        }

        const data = await response.json();
        setAnalysis(data);
        setUsesMockData(false);
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.log('Using demo data - Backend not available');
        setAnalysis(getMockAnalysis());
        setUsesMockData(true);
      }
    } catch (err) {
      console.error('Error:', err);
      setAnalysis(getMockAnalysis());
      setUsesMockData(true);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setResumeFile(null);
    setJobDescription('');
    setAnalysis(null);
    setError('');
    setUsesMockData(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5f0 0%, #e8dcc8 100%)' }}>
      {/* Earthy texture background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(139, 90, 43, .05) 35px, rgba(139, 90, 43, .05) 70px)'
      }}></div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b" style={{ borderColor: '#d4a574', backgroundColor: 'rgba(255, 248, 240, 0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="max-w-7xl mx-auto px-6 py-10">
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#8b5a2b' }}>
                <Leaf className="w-7 h-7" style={{ color: '#f5deb3' }} />
              </div>
              <h1 className="text-5xl font-bold" style={{ color: '#5c3d2e' }}>
                Resume Analyst
              </h1>
            </div>
            <p className="text-lg ml-16" style={{ color: '#8b6f47' }}>
              Premium AI-powered career insights to elevate your professional presence
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-6xl mx-auto px-6 py-14">
          {!analysis ? (
            // Input Section
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resume Upload */}
                <div className="group">
                  <label className="block text-lg font-semibold mb-4" style={{ color: '#5c3d2e' }}>
                    Upload Your Resume
                  </label>
                  <div
                    className="relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300"
                    style={{ borderColor: '#d4a574', backgroundColor: 'rgba(245, 222, 179, 0.15)' }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files[0];
                      if (file) handleFileUpload({ target: { files: [file] } });
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Upload className="w-10 h-10 mx-auto mb-4 transition-colors" style={{ color: '#8b5a2b' }} />
                    {resumeFile ? (
                      <div>
                        <p className="font-semibold text-lg" style={{ color: '#6b8e23' }}>✓ {resumeFile.name}</p>
                        <p className="text-sm mt-1" style={{ color: '#a0826d' }}>Ready for analysis</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold text-lg" style={{ color: '#5c3d2e' }}>Drop your resume here</p>
                        <p className="text-sm mt-2" style={{ color: '#8b6f47' }}>PDF or DOCX • Max 10MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-lg font-semibold mb-4" style={{ color: '#5c3d2e' }}>
                    Job Description
                  </label>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the complete job description here..."
                    className="w-full h-40 px-5 py-4 rounded-2xl border-2 placeholder-gray-400 resize-none focus:outline-none transition-all duration-300"
                    style={{
                      borderColor: '#d4a574',
                      backgroundColor: 'rgba(255, 248, 240, 0.9)',
                      color: '#5c3d2e',
                      focusBorderColor: '#8b5a2b'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#8b5a2b'}
                    onBlur={(e) => e.target.style.borderColor = '#d4a574'}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-start gap-3 p-4 rounded-xl border-l-4" style={{ backgroundColor: '#ffe4e1', borderColor: '#cd5c5c', color: '#8b0000' }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleAnalyze}
                  disabled={loading || !resumeFile || !jobDescription.trim()}
                  className="flex-1 px-8 py-4 font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                  style={{
                    backgroundColor: loading ? '#a0826d' : '#8b5a2b',
                    color: '#fffaf0'
                  }}
                >
                  {loading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Analyze Resume
                    </>
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { step: '1', title: 'Upload', desc: 'Share your resume in PDF or DOCX format' },
                  { step: '2', title: 'Paste', desc: 'Add the job description you\'re targeting' },
                  { step: '3', title: 'Analyze', desc: 'Get intelligent feedback in seconds' },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="p-6 rounded-xl border transition-all duration-300 hover:shadow-lg"
                    style={{
                      backgroundColor: 'rgba(255, 248, 240, 0.6)',
                      borderColor: '#d4a574',
                      color: '#5c3d2e'
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: '#8b5a2b' }}
                      >
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                    </div>
                    <p className="text-sm" style={{ color: '#8b6f47' }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // Results Section
            <div className="space-y-8">
              {/* Reset Button */}
              <button
                onClick={handleReset}
                className="px-5 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: 'rgba(212, 165, 116, 0.2)',
                  color: '#8b5a2b'
                }}
              >
                ← Analyze Another Resume
              </button>

              {/* Mock Data Warning */}
              {usesMockData && (
                <div className="flex items-start gap-3 p-4 rounded-xl border-l-4" style={{ backgroundColor: '#fff8e7', borderColor: '#d4a574', color: '#8b6f47' }}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">Demo data is being used. For live analysis, please start the backend server.</p>
                </div>
              )}

              {/* Match Score Card */}
              <div className="rounded-2xl p-8 shadow-lg" style={{ backgroundColor: 'rgba(255, 248, 240, 0.95)', border: '1px solid #d4a574' }}>
                <h2 className="text-3xl font-bold mb-8" style={{ color: '#5c3d2e' }}>Analysis Results</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Overall Score */}
                  <div className="flex flex-col items-center justify-center p-8 rounded-2xl" style={{ backgroundColor: 'rgba(139, 90, 43, 0.1)', border: '2px solid #d4a574' }}>
                    <p className="text-sm font-semibold mb-2" style={{ color: '#8b6f47' }}>OVERALL MATCH</p>
                    <div className="text-6xl font-bold mb-4" style={{ color: '#8b5a2b' }}>
                      {analysis.matchScore}%
                    </div>
                    <div className="w-32 h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e8dcc8' }}>
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${analysis.matchScore}%`,
                          background: 'linear-gradient(to right, #8b5a2b, #a0826d)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-5">
                    {[
                      { label: 'Skills Match', value: analysis.skillsMatch || 0 },
                      { label: 'Experience Match', value: analysis.experienceMatch || 0 },
                      { label: 'Keywords Match', value: analysis.keywordMatch || 0 },
                    ].map((stat) => (
                      <div key={stat.label}>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-semibold" style={{ color: '#5c3d2e' }}>{stat.label}</span>
                          <span className="text-sm font-bold" style={{ color: '#8b6f47' }}>{stat.value}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#e8dcc8' }}>
                          <div
                            className="h-full transition-all duration-700"
                            style={{
                              width: `${stat.value}%`,
                              background: 'linear-gradient(to right, #8b5a2b, #a0826d)'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strengths */}
              {analysis.strengths && analysis.strengths.length > 0 && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'rgba(107, 142, 35, 0.1)', border: '2px solid #6b8e23' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6" style={{ color: '#6b8e23' }} />
                    <h3 className="text-xl font-bold" style={{ color: '#5c7a1a' }}>Your Strengths</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.strengths.map((strength, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: 'rgba(107, 142, 35, 0.2)',
                          color: '#5c7a1a',
                          border: '1px solid #6b8e23'
                        }}
                      >
                        ✓ {strength}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Skills */}
              {analysis.missingSkills && analysis.missingSkills.length > 0 && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'rgba(184, 134, 11, 0.1)', border: '2px solid #b8860b' }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#8b6f1a' }}>Skills to Develop</h3>
                  <div className="flex flex-wrap gap-2">
                    {analysis.missingSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2 rounded-full text-sm font-medium"
                        style={{
                          backgroundColor: 'rgba(184, 134, 11, 0.2)',
                          color: '#8b6f1a',
                          border: '1px solid #b8860b'
                        }}
                      >
                        ◆ {skill}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejection Reasons */}
              {analysis.rejectionReasons && analysis.rejectionReasons.length > 0 && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'rgba(139, 0, 0, 0.05)', border: '2px solid #8b3a3a' }}>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-6 h-6" style={{ color: '#8b3a3a' }} />
                    <h3 className="text-xl font-bold" style={{ color: '#8b3a3a' }}>Critical Gaps</h3>
                  </div>
                  <div className="space-y-2">
                    {analysis.rejectionReasons.map((reason, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: 'rgba(139, 0, 0, 0.05)',
                          color: '#5c3d2e',
                          border: '1px solid #8b3a3a'
                        }}
                      >
                        • {reason}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements && analysis.improvements.length > 0 && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'rgba(70, 130, 180, 0.05)', border: '2px solid #4682b4' }}>
                  <h3 className="text-xl font-bold mb-4" style={{ color: '#36648b' }}>Improvement Plan</h3>
                  <div className="space-y-3">
                    {analysis.improvements.map((improvement, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: 'rgba(70, 130, 180, 0.05)' }}>
                        <input
                          type="checkbox"
                          className="w-5 h-5 mt-0.5 rounded"
                          style={{
                            accentColor: '#4682b4',
                            cursor: 'pointer'
                          }}
                        />
                        <span className="text-sm" style={{ color: '#5c3d2e' }}>{improvement}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Findings */}
              {analysis.keyFindings && (
                <div className="rounded-2xl p-6 shadow-lg" style={{ backgroundColor: 'rgba(139, 90, 43, 0.05)', border: '2px solid #d4a574' }}>
                  <h3 className="text-xl font-bold mb-3" style={{ color: '#5c3d2e' }}>Strategic Insights</h3>
                  <p className="text-sm leading-relaxed" style={{ color: '#8b6f47' }}>
                    {analysis.keyFindings}
                  </p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
