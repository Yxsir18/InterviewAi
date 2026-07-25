const groqService = require('./groqService');

const COMPANY_STYLES = {
  Google: {
    hr: 'Focus on behavioral questions using STAR method, problem-solving, and cultural fit with Google\'s values',
    technical: 'Deep technical questions, system design, algorithms, and practical problem-solving',
    coding: 'Algorithmic problems, data structures, optimization, and clean code',
    managerial: 'Leadership, team management, project handling, and strategic thinking'
  },
  Amazon: {
    hr: 'Leadership principles-based questions, customer obsession, and behavioral fit',
    technical: 'System design, scalability, AWS services, and practical solutions',
    coding: 'Data structures, algorithms, and efficiency-focused problems',
    managerial: 'Leadership principles, team development, and operational excellence'
  },
  Microsoft: {
    hr: 'Growth mindset, collaboration, and cultural alignment with Microsoft values',
    technical: 'System design, Azure services, and practical technical solutions',
    coding: 'Data structures, algorithms, and clean, maintainable code',
    managerial: 'People management, strategic thinking, and product development'
  },
  Meta: {
    hr: 'Move fast, build things, and cultural fit with Meta\'s values',
    technical: 'System design, scalability, and distributed systems',
    coding: 'Algorithmic problems, optimization, and efficient code',
    managerial: 'Impact-driven leadership, team building, and product strategy'
  },
  Netflix: {
    hr: 'Freedom and responsibility, context not control, and cultural fit',
    technical: 'System design, scalability, and cloud-native solutions',
    coding: 'Practical problems, clean code, and maintainability',
    managerial: 'High-performance teams, strategic thinking, and decision-making'
  },
  Apple: {
    hr: 'Attention to detail, passion for products, and cultural fit',
    technical: 'System design, iOS/Apple ecosystem, and practical solutions',
    coding: 'Clean, efficient code with attention to detail',
    managerial: 'Product excellence, team leadership, and strategic vision'
  },
  TCS: {
    hr: 'Traditional HR questions, cultural fit, and professional behavior',
    technical: 'Practical technical skills, enterprise solutions, and industry knowledge',
    coding: 'Basic to intermediate programming problems and clean code',
    managerial: 'Team management, client handling, and project delivery'
  },
  Infosys: {
    hr: 'Professional behavior, cultural fit, and communication skills',
    technical: 'Enterprise solutions, practical skills, and industry standards',
    coding: 'Basic programming problems and code quality',
    managerial: 'Team leadership, client management, and project execution'
  },
  Wipro: {
    hr: 'Professional conduct, cultural fit, and communication',
    technical: 'Practical skills, enterprise solutions, and technology stack',
    coding: 'Basic to intermediate programming and code standards',
    managerial: 'Team management, project delivery, and client relations'
  },
  Accenture: {
    hr: 'Professional behavior, cultural fit, and communication skills',
    technical: 'Enterprise solutions, consulting approach, and technology expertise',
    coding: 'Practical programming and code quality',
    managerial: 'Client management, team leadership, and consulting skills'
  }
};

const COMMON_QUESTIONS_TO_AVOID = [
  'Describe a situation where you had to collaborate with a cross-functional team',
  'Tell me about a project you worked on that you\'re particularly proud of',
  'How do you handle constructive criticism',
  'Why do you want to work at',
  'Where do you see yourself in the next 5 years',
  'How do you handle conflicts or disagreements',
  'Can you describe a situation where you had to work under pressure',
  'How do you stay updated with the latest trends',
];

/**
 * Generate company-specific interview questions
 */
async function generateCompanyQuestions(company, round, jobRole, difficulty, language, numQuestions = 5) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const companyStyle = COMPANY_STYLES[company]?.[round.toLowerCase()] || COMPANY_STYLES[company]?.technical;
  const languageMap = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript', 
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'go': 'Go',
    'rust': 'Rust',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby'
  };
  const mappedLanguage = languageMap[language] || language;
  
  // Add random element to ensure variety
  const randomSeed = Math.random().toString(36).substring(7);
  const timestamp = Date.now();
  
  const systemPrompt = `You are an expert interviewer for ${company}. Generate interview questions that match ${company}'s interview style and culture. Focus on ${companyStyle}. Always generate unique, varied questions - never repeat the same questions.`;

  const userPrompt = `Generate ${numQuestions} ${round} round interview questions for a ${jobRole} position at ${company} with ${difficulty} difficulty.
${round === 'Coding' ? `The questions should be related to ${mappedLanguage} programming language.` : ''}
${round === 'Technical' ? `Include questions about ${mappedLanguage} when relevant.` : ''}

CRITICAL REQUIREMENTS:
1. Create unique, original questions. Do not use common or generic interview questions.
2. Make each question specific and different from typical interview questions.
3. AVOID these common question patterns: ${COMMON_QUESTIONS_TO_AVOID.join(', ')}
4. Generate fresh, creative questions that are rarely asked in interviews.
5. Use the following unique identifier for this request: ${randomSeed}-${timestamp}
6. Think outside the box - create questions that test real skills and experiences in novel ways.

Provide the questions in JSON format with:
{
  "questions": [
    {
      "question": "detailed question",
      "type": "behavioral|technical|coding|system_design",
      "expectedAnswer": "key points expected in answer",
      "timeLimit": time in minutes
    }
  ]
}`;

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 1.0,
      max_tokens: 2048,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    
    let parsedResponse;
    if (typeof response === 'string') {
      parsedResponse = JSON.parse(response);
    } else {
      parsedResponse = response;
    }
    
    return parsedResponse;
  } catch (error) {
    console.error('Error generating company questions:', error);
    throw error;
  }
}

/**
 * Evaluate answer for company-specific interview
 */
async function evaluateAnswer(company, round, question, answer) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const companyStyle = COMPANY_STYLES[company]?.[round.toLowerCase()] || COMPANY_STYLES[company]?.technical;

  const systemPrompt = `You are an expert interviewer for ${company}. Evaluate candidate answers based on ${company}'s interview standards and culture. Focus on ${companyStyle}.`;

  const userPrompt = `Evaluate the following answer for a ${round} round interview at ${company}.

Question: ${question}
Answer: ${answer}

Provide evaluation in JSON format with:
{
  "score": 0-100,
  "feedback": "detailed feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

  try {
    const Groq = require('groq-sdk');
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
}

module.exports = {
  generateCompanyQuestions,
  evaluateAnswer,
  COMPANY_STYLES,
};
