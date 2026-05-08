import axios from 'axios'

const NEWS_API_BASE_URL = 'https://newsapi.org/v2/everything'
const EVENTREGISTRY_BASE_URL = 'https://eventregistry.org/api/v1/event/getBreakingEvents'

const mapEventRegistryToNewsShape = (events = []) =>
  events.slice(0, 10).map((event) => {
    const article = event?.articles?.results?.[0] || {}
    return {
      source: { name: article?.source?.title || 'EventRegistry' },
      author: article?.authors?.[0]?.name || null,
      title: article?.title || event?.title?.eng || 'Space update',
      description: article?.body?.slice(0, 180) || event?.summary?.eng || 'No description available.',
      url: article?.url || 'https://eventregistry.org/',
      urlToImage: article?.image || null,
      publishedAt: article?.dateTimePub || new Date().toISOString(),
    }
  })

export const fetchSpaceNews = async () => {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY
  const eventRegistryApiKey = import.meta.env.VITE_EVENTREGISTRY_API_KEY

  if (eventRegistryApiKey) {
    const { data } = await axios.get(EVENTREGISTRY_BASE_URL, {
      params: {
        breakingEventsMinBreakingScore: 0.2,
        apiKey: eventRegistryApiKey,
      },
      timeout: 12000,
    })
    const events = data?.breakingEvents?.results || []
    if (events.length > 0) {
      return mapEventRegistryToNewsShape(events)
    }
  }

  if (!apiKey) throw new Error('Missing VITE_NEWS_API_KEY or VITE_EVENTREGISTRY_API_KEY')

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
