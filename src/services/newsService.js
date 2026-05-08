import axios from 'axios'

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything'

export const fetchSpaceNews = async () => {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY
  if (!apiKey) {
    throw new Error('Missing VITE_NEWS_API_KEY environment variable')
  }

  const { data } = await axios.get(NEWS_API_BASE_URL, {
    params: {
      q: 'space OR NASA OR ISS',
      language: 'en',
      pageSize: 10,
      sortBy: 'publishedAt',
      apiKey,
    },
    timeout: 12000,
  })

  if (!Array.isArray(data.articles)) {
    throw new Error('Invalid news response format')
  }

  return data.articles.slice(0, 10)
}
