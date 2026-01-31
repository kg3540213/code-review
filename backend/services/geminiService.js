import axios from 'axios';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'gemini-2.5-flash';

const CODE_REVIEW_PROMPT = `You are an expert senior software engineer and professional code reviewer.
Analyze the given code and provide:
1. Summary of the code
2. Code quality review
3. Bugs or logical issues
4. Performance improvements
5. Security concerns
6. Suggested refactored code

Follow modern best practices.
Be clear, structured, and concise.
Do not change functionality unless necessary.`;

/**
 * Call Gemini API via axios and return AI review text
 * @param {string} code - Source code to review
 * @param {string} language - Programming language
 * @returns {Promise<string>} AI response text
 */
export const getCodeReview = async (code, language) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set');

  const fullPrompt = `${CODE_REVIEW_PROMPT}\n\nLanguage: ${language}\n\nCode:\n\`\`\`${language}\n${code}\n\`\`\``;

  const { data } = await axios.post(
    `${GEMINI_BASE}/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 8192,
      },
    },
    {
      headers: { 'Content-Type': 'application/json' },
      timeout: 60000,
    }
  );

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error(data?.error?.message || 'No response from Gemini AI');
  }

  return text;
};
