const groqService = require('./groqService');

const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'actually', 'basically', 'literally',
  'sort of', 'kind of', 'I mean', 'well', 'so', 'but', 'and', 'or'
];

/**
 * Analyze communication metrics from transcribed text
 */
function analyzeCommunicationMetrics(transcription, audioDuration) {
  if (!transcription || !audioDuration) {
    return {
      confidence: 50,
      fluency: 50,
      grammar: 50,
      fillers: 0,
      speakingSpeed: 120,
      wordCount: 0,
    };
  }

  const words = transcription.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;
  const speakingSpeed = Math.round((wordCount / audioDuration) * 60); // words per minute

  // Count filler words
  let fillerCount = 0;
  const lowerTranscription = transcription.toLowerCase();
  FILLER_WORDS.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerTranscription.match(regex);
    if (matches) {
      fillerCount += matches.length;
    }
  });

  // Calculate confidence based on filler words and speaking speed
  const fillerRatio = fillerCount / Math.max(wordCount, 1);
  const confidenceScore = Math.max(0, Math.min(100, 100 - (fillerRatio * 200)));

  // Calculate fluency based on speaking speed and pauses (estimated by sentence length)
  const sentences = transcription.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  const fluencyScore = Math.max(0, Math.min(100, 
    100 - Math.abs(120 - speakingSpeed) * 0.5 - (avgSentenceLength > 30 ? 20 : 0)
  ));

  // Grammar score (basic estimation based on sentence structure)
  const hasCompleteSentences = sentences.length > 0 && 
    sentences.every(s => s.trim().length > 5);
  const grammarScore = hasCompleteSentences ? 80 : 60;

  return {
    confidence: Math.round(confidenceScore),
    fluency: Math.round(fluencyScore),
    grammar: Math.round(grammarScore),
    fillers: fillerCount,
    speakingSpeed,
    wordCount,
  };
}

/**
 * Generate voice interview questions
 */
async function generateVoiceQuestions(jobRole, difficulty, numQuestions = 5) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You are an expert interviewer conducting voice-based interviews. Generate interview questions that are suitable for verbal responses and focus on communication skills, problem-solving, and professional experience.`;

  const userPrompt = `Generate ${numQuestions} interview questions for a ${jobRole} position with ${difficulty} difficulty.

These questions should be:
- Suitable for verbal responses
- Focus on communication and soft skills
- Allow candidates to demonstrate their speaking abilities
- Include behavioral and situational questions

Provide the questions in JSON format with:
{
  "questions": [
    {
      "question": "detailed question",
      "type": "behavioral|situational|communication|professional",
      "expectedAnswer": "key points expected in answer"
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
      temperature: 0.7,
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
    console.error('Error generating voice questions:', error);
    throw error;
  }
}

/**
 * Evaluate answer with communication analysis
 */
async function evaluateAnswerWithCommunication(question, answer, communicationMetrics) {
  if (!groqService.isAvailable()) {
    throw new Error('AI service not available');
  }

  const systemPrompt = `You are an expert interviewer evaluating verbal responses. Assess the content quality and provide constructive feedback.`;

  const userPrompt = `Evaluate the following verbal response to an interview question.

Question: ${question}
Answer: ${answer}

Communication Metrics:
- Confidence Score: ${communicationMetrics.confidence}/100
- Fluency Score: ${communicationMetrics.fluency}/100
- Grammar Score: ${communicationMetrics.grammar}/100
- Filler Words: ${communicationMetrics.fillers}
- Speaking Speed: ${communicationMetrics.speakingSpeed} words per minute
- Word Count: ${communicationMetrics.wordCount}

Provide evaluation in JSON format with:
{
  "score": 0-100 (content quality),
  "feedback": "detailed feedback on the answer content",
  "communicationScore": 0-100 (overall communication quality based on metrics),
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "communicationFeedback": ["specific feedback on speaking patterns"]
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
  analyzeCommunicationMetrics,
  generateVoiceQuestions,
  evaluateAnswerWithCommunication,
  FILLER_WORDS,
};
