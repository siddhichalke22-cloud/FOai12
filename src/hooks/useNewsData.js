import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { fetchSpaceNews } from '../services/newsService'
import { getCachedData, isCacheFresh, setCachedData } from '../utils/storage'
import { useDebounce } from './useDebounce'

const CACHE_KEY = 'spacepulse-news-cache'
const CACHE_TTL = 15 * 60 * 1000

export const useNewsData = () => {
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('latest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const debouncedSearch = useDebounce(searchTerm)

  const loadNews = useCallback(async (force = false) => {
    setLoading(true)
    setError('')
    try {
      const cached = getCachedData(CACHE_KEY)
      if (!force && cached && isCacheFresh(cached.timestamp, CACHE_TTL)) {
        setNews(cached.data)
        setLoading(false)
        return
      }
      const articles = await fetchSpaceNews()
      setNews(articles)
      setCachedData(CACHE_KEY, { timestamp: Date.now(), data: articles })
      toast.success('News updated')
    } catch (err) {
      setError(err.message || 'Failed to load news')
      toast.error('Could not load news feed')
    } finally {
      setLoading(false)
    }
  }, [])

  const filteredNews = useMemo(() => {
    const term = debouncedSearch.trim().toLowerCase()
    const searched = news.filter((article) => {
      if (!term) return true
      return (
        article.title?.toLowerCase().includes(term) ||
        article.description?.toLowerCase().includes(term) ||
        article.source?.name?.toLowerCase().includes(term)
      )
    })

    if (sortBy === 'source') {
      return [...searched].sort((a, b) => (a.source?.name || '').localeCompare(b.source?.name || ''))
    }

    return [...searched].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
  }, [news, debouncedSearch, sortBy])

  const sourceDistribution = useMemo(() => {
    const counts = filteredNews.reduce((acc, article) => {
      const source = article.source?.name || 'Unknown'
      acc[source] = (acc[source] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [filteredNews])

  return {
    news: filteredNews,
    rawNews: news,
    sourceDistribution,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loading,
    error,
    loadNews,
  }
}
