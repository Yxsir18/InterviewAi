const Groq = require('groq-sdk');

// Initialize Groq client
let groq = null;
if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

/**
 * Generate initial interview question
 */
async function generateInitialQuestion(interviewType, difficulty, resumeContext = '') {
  if (!groq) {
    throw new Error('Groq AI not available');
  }

  const systemPrompt = `You are an expert technical interviewer for ${interviewType} interviews. 
Your role is to conduct a professional, conversational interview at ${difficulty} difficulty level.
Start with a warm introduction and ask the first relevant question.
Keep your response concise and professional.`;

  const userPrompt = `Start a ${interviewType} interview at ${difficulty} difficulty level.
${resumeContext ? `Candidate's background: ${resumeContext}` : ''}
Begin with a brief introduction and ask the first question.
Respond with just your introduction and question, no additional text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating initial question:', error.message);
    throw error;
  }
}

/**
 * Generate follow-up question based on candidate's answer
 */
async function generateFollowUpQuestion(
  interviewType,
  difficulty,
  conversationHistory,
  currentAnswer
) {
  if (!groq) {
    throw new Error('Groq AI not available');
  }

  const systemPrompt = `You are an expert technical interviewer for ${interviewType} interviews at ${difficulty} difficulty level.
Your role is to conduct a conversational interview, asking follow-up questions based on the candidate's responses.
Be professional, encouraging, and probe deeper into their knowledge.
Keep your questions focused and relevant.`;

  const conversationContext = conversationHistory
    .slice(-4) // Last 4 exchanges for context
    .map(msg => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
    .join('\n');

  const userPrompt = `Based on the following conversation and the candidate's latest answer, generate a natural follow-up question:

Conversation history:
${conversationContext}

Candidate's latest answer: "${currentAnswer}"

Generate a relevant follow-up question that:
1. Builds on their previous answer
2. Tests their knowledge deeper
3. Is appropriate for ${difficulty} difficulty
4. Is relevant to ${interviewType}

Respond with just your follow-up question, no additional text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating follow-up question:', error.message);
    throw error;
  }
}

/**
 * Evaluate candidate's answer
 */
async function evaluateAnswer(
  interviewType,
  difficulty,
  question,
  answer,
  conversationHistory
) {
  if (!groq) {
    throw new Error('Groq AI not available');
  }

  const systemPrompt = `You are an expert technical interviewer evaluating answers for ${interviewType} interviews.
Provide constructive, detailed evaluation focusing on technical accuracy, communication, and depth of knowledge.`;

  const userPrompt = `Evaluate the following answer:

Interview Type: ${interviewType}
Difficulty: ${difficulty}
Question: "${question}"
Candidate's Answer: "${answer}"

Provide evaluation in JSON format with:
{
  "score": 0-100,
  "technicalAccuracy": 0-10,
  "communication": 0-10,
  "depth": 0-10,
  "clarity": 0-10,
  "feedback": "detailed feedback on the answer",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "improvementSuggestions": ["suggestion1", "suggestion2"]
}`;

  try {
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
    console.error('Error evaluating answer:', error.message);
    throw error;
  }
}

/**
 * Generate final interview summary and suggestions
 */
async function generateInterviewSummary(conversationHistory, interviewType, difficulty) {
  if (!groq) {
    throw new Error('Groq AI not available');
  }

  const systemPrompt = `You are an expert career coach and technical interviewer providing interview feedback.`;

  const conversationSummary = conversationHistory
    .map(msg => `${msg.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${msg.content}`)
    .join('\n');

  const userPrompt = `Based on the following interview conversation, provide a comprehensive summary and feedback:

Interview Type: ${interviewType}
Difficulty: ${difficulty}

Conversation:
${conversationSummary}

Provide feedback in JSON format with:
{
  "overallPerformance": "summary of overall performance",
  "strengths": ["strength1", "strength2"],
  "areasForImprovement": ["area1", "area2"],
  "technicalScore": 0-100,
  "communicationScore": 0-100,
  "recommendations": ["recommendation1", "recommendation2"],
  "nextSteps": ["step1", "step2"]
}`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5,
      max_tokens: 1024,
      response_format: { type: 'json_object' }
    });

    const response = completion.choices[0].message.content;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating interview summary:', error.message);
    throw error;
  }
}

/**
 * Check if interview should continue or end
 */
async function shouldContinueInterview(conversationHistory, interviewLength) {
  const currentQuestionCount = conversationHistory.filter(
    msg => msg.role === 'assistant'
  ).length;

  return currentQuestionCount < interviewLength;
}

module.exports = {
  generateInitialQuestion,
  generateFollowUpQuestion,
  evaluateAnswer,
  generateInterviewSummary,
  shouldContinueInterview,
  isAvailable: () => !!groq,
};
