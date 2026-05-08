import axios from 'axios'

const HF_URL =
  'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2'

const isQuestionAllowed = (message) => {
  const keywords = [
    'iss',
    'astronaut',
    'space station',
    'latitude',
    'longitude',
    'speed',
    'track',
    'news',
    'article',
    'source',
    'dashboard',
  ]
  const normalized = message.toLowerCase()
  return keywords.some((keyword) => normalized.includes(keyword))
}

export const generateDashboardAnswer = async ({ userMessage, context }) => {
  if (!isQuestionAllowed(userMessage)) {
    return 'I can only answer questions related to ISS tracking and dashboard news data.'
  }

  const token = import.meta.env.VITE_AI_TOKEN
  if (!token) {
    throw new Error('Missing VITE_AI_TOKEN environment variable')
  }

  const prompt = `
[SYSTEM]
You are SpacePulse AI assistant. Follow these rules strictly:
- Use ONLY the structured dashboard context.
- If context does not contain the answer, reply: "I can only answer based on current ISS and news dashboard data."
- Refuse unrelated/general-world questions.
- Keep response concise and factual.

[DASHBOARD_CONTEXT]
${context}

[USER_QUESTION]
${userMessage}
  `.trim()

  const { data } = await axios.post(
    HF_URL,
    {
      inputs: prompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.2,
        return_full_text: false,
      },
    },
    {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 30000,
    },
  )

  const content = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text
  return content?.trim() || 'I can only answer based on current ISS and news dashboard data.'
}
