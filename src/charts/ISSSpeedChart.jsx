import { motion } from 'framer-motion'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export const ISSSpeedChart = ({ speedHistory }) => {
  const chartData = speedHistory.map((item) => ({
    ...item,
    label: new Date(item.timestamp * 1000).toLocaleTimeString(),
  }))

  return (
    <motion.div
      className="glass-card h-[320px] p-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="mb-4 text-lg font-semibold">ISS Speed Chart (km/h)</h3>
      <ResponsiveContainer width="100%" height="88%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
          <XAxis dataKey="label" minTickGap={30} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="speed" stroke="#38bdf8" strokeWidth={2.5} dot={false} isAnimationActive />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
