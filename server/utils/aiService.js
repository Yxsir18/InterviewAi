const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Model configuration - use environment variable with fallback
const AI_MODEL = process.env.GROQ_AI_MODEL || 'llama-3.1-8b-instant';

// Generate AI content using Groq
async function generateAIContent(prompt) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach. Provide professional, impactful, and ATS-friendly content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: AI_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
    });

    return chatCompletion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('AI generation error:', error);
    if (error.message?.includes('decommissioned') || error.message?.includes('no longer supported')) {
      console.error(`AI Model ${AI_MODEL} is deprecated. Please update GROQ_AI_MODEL environment variable.`);
    }
    throw new Error('Failed to generate AI content');
  }
}

module.exports = {
  generateAIContent,
};
