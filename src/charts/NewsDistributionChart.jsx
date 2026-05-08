import { motion } from 'framer-motion'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

const COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444']

export const NewsDistributionChart = ({ data }) => (
  <motion.div
    className="glass-card h-[320px] p-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <h3 className="mb-4 text-lg font-semibold">News Source Distribution</h3>
    <ResponsiveContainer width="100%" height="88%">
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={95} label>
          {data.map((entry, index) => (
            <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </motion.div>
)
