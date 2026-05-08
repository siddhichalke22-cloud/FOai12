import { useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaGlobe, FaSatellite, FaSyncAlt, FaUsers } from 'react-icons/fa'
import { ISSMap } from '../map/ISSMap'
import { ISSSpeedChart } from '../charts/ISSSpeedChart'
import { NewsDistributionChart } from '../charts/NewsDistributionChart'
import { useISSData } from '../hooks/useISSData'
import { useNewsData } from '../hooks/useNewsData'
import { ThemeToggle } from '../components/ThemeToggle'
import { FloatingChatbot } from '../chatbot/FloatingChatbot'

const StatCard = ({ icon, label, value }) => (
  <motion.div className="glass-card p-4" whileHover={{ y: -4 }}>
    <div className="mb-2 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-300">
      {icon}
      {label}
    </div>
    <p className="text-lg font-semibold">{value}</p>
  </motion.div>
)

const NewsSkeleton = () => (
  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="glass-card h-44 animate-pulse" />
    ))}
  </div>
)

export const DashboardPage = () => {
  const iss = useISSData()
  const news = useNewsData()
  const { loadNews } = news

  useEffect(() => {
    void loadNews()
  }, [loadNews])

  const dashboardContext = useMemo(() => {
    const latest = iss.latestPosition
    return JSON.stringify(
      {
        iss: {
          latitude: latest?.latitude,
          longitude: latest?.longitude,
          speedKmh: iss.latestSpeed,
          nearestPlace: iss.nearestPlace,
          trackedPositions: iss.positions.length,
          timestamp: latest?.timestamp,
        },
        astronauts: iss.astronauts,
        news: news.rawNews.map((n) => ({
          title: n.title,
          source: n.source?.name,
          author: n.author,
          publishedAt: n.publishedAt,
          description: n.description,
        })),
      },
      null,
      2,
    )
  }, [iss, news.rawNews])

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-violet-50 to-slate-100 px-4 py-6 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold">SpacePulse AI Dashboard</h1>
            <p className="text-sm text-slate-500 dark:text-slate-300">Live ISS, Space News, and Context-Limited AI</p>
          </div>
          <div className="flex gap-2">
            <ThemeToggle />
            <button onClick={() => iss.refreshISS()} className="glass-card px-4 py-2 text-sm" type="button">
              <FaSyncAlt className="mr-2 inline" /> Refresh ISS
            </button>
            <button onClick={() => news.loadNews(true)} className="glass-card px-4 py-2 text-sm" type="button">
              <FaSyncAlt className="mr-2 inline" /> Refresh News
            </button>
          </div>
        </header>

        {(iss.error || news.error) && (
          <div className="glass-card border border-rose-400/30 p-3 text-sm text-rose-500">
            {iss.error || news.error} <span className="opacity-80">Use refresh to retry.</span>
          </div>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<FaSatellite />} label="Latitude" value={iss.latestPosition?.latitude?.toFixed(3) ?? '--'} />
          <StatCard icon={<FaGlobe />} label="Longitude" value={iss.latestPosition?.longitude?.toFixed(3) ?? '--'} />
          <StatCard icon={<FaSyncAlt />} label="Speed (km/h)" value={iss.latestSpeed ? iss.latestSpeed.toFixed(2) : '--'} />
          <StatCard icon={<FaUsers />} label="Astronauts on ISS" value={iss.astronauts.people.length || '--'} />
        </section>

        <section className="grid gap-4 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <ISSMap positions={iss.positions} />
          </div>
          <div className="glass-card space-y-3 p-4">
            <h3 className="text-lg font-semibold">Live Details</h3>
            <p className="text-sm">Nearest region: {iss.nearestPlace}</p>
            <p className="text-sm">Tracked positions: {iss.positions.length}</p>
            <p className="text-sm">
              Last timestamp:{' '}
              {iss.latestPosition?.timestamp
                ? new Date(iss.latestPosition.timestamp * 1000).toLocaleString()
                : '--'}
            </p>
            <h4 className="pt-1 text-sm font-semibold">People currently in space</h4>
            <div className="grid gap-2">
              {iss.astronauts.people.map((p) => (
                <div key={p.name} className="rounded-xl bg-white/40 px-3 py-2 text-sm dark:bg-slate-800/60">
                  {p.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <ISSSpeedChart speedHistory={iss.speedHistory} />
          <NewsDistributionChart data={news.sourceDistribution} />
        </section>

        <section className="glass-card p-4">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <input
              value={news.searchTerm}
              onChange={(e) => news.setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full max-w-sm rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
            />
            <select
              value={news.sortBy}
              onChange={(e) => news.setSortBy(e.target.value)}
              className="rounded-xl border border-slate-300 bg-white/70 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/60"
            >
              <option value="latest">Latest date</option>
              <option value="source">Source</option>
            </select>
          </div>

          {news.loading ? (
            <NewsSkeleton />
          ) : news.news.length === 0 ? (
            <p className="text-sm text-slate-500 dark:text-slate-300">No articles found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {news.news.map((article, index) => (
                <article key={`${article.url}-${index}`} className="glass-card overflow-hidden p-0">
                  {article.urlToImage ? (
                    <img src={article.urlToImage} alt={article.title} className="h-40 w-full object-cover" />
                  ) : (
                    <div className="flex h-40 items-center justify-center bg-slate-300/20 text-sm">No image</div>
                  )}
                  <div className="p-4">
                    <p className="mb-1 text-xs text-slate-500 dark:text-slate-300">
                      {article.source?.name} | {new Date(article.publishedAt).toLocaleDateString()}
                    </p>
                    <h4 className="line-clamp-2 font-semibold">{article.title}</h4>
                    <p className="mt-2 line-clamp-3 text-sm text-slate-500 dark:text-slate-300">
                      {article.description}
                    </p>
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm text-sky-500 hover:underline"
                    >
                      Read More
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
      <FloatingChatbot context={dashboardContext} />
    </div>
  )
}
