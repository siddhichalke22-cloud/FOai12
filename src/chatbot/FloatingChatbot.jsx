import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPaperPlane, FaRobot, FaTrash } from 'react-icons/fa'
import toast from 'react-hot-toast'
import { generateDashboardAnswer } from '../services/aiService'
import { getCachedData, setCachedData } from '../utils/storage'

const CHAT_KEY = 'spacepulse-chat'

export const FloatingChatbot = ({ context }) => {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState(() => getCachedData(CHAT_KEY) || [])
  const ref = useRef(null)

  useEffect(() => {
    setCachedData(CHAT_KEY, messages.slice(-30))
  }, [messages])

  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  const onSend = async () => {
    if (!input.trim() || typing) return
    const userMsg = { role: 'user', content: input.trim(), ts: Date.now() }
    setMessages((prev) => [...prev, userMsg].slice(-30))
    setInput('')
    setTyping(true)
    try {
      const reply = await generateDashboardAnswer({ userMessage: userMsg.content, context })
      setMessages((prev) => [...prev, { role: 'bot', content: reply, ts: Date.now() }].slice(-30))
    } catch (err) {
      toast.error('AI request failed')
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          content: err.message || 'I can only answer based on current ISS and news dashboard data.',
          ts: Date.now(),
        },
      ])
    } finally {
      setTyping(false)
    }
  }

  const placeholder = useMemo(
    () => 'Ask about ISS speed, position, astronauts, or loaded news',
    [],
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed right-4 bottom-4 z-[1100] rounded-full bg-sky-500 p-4 text-white shadow-xl"
        aria-label="Open AI chatbot"
      >
        <FaRobot />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            className="glass-card fixed right-4 bottom-20 z-[1100] flex h-[450px] w-[min(94vw,380px)] flex-col p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-semibold">SpacePulse AI</h3>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="text-sm text-rose-500"
              >
                <FaTrash className="inline" /> Clear Chat
              </button>
            </div>
            <div ref={ref} className="mb-2 flex-1 space-y-2 overflow-auto pr-1">
              {messages.map((msg) => (
                <div
                  key={msg.ts}
                  className={`rounded-xl px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-sky-500/20' : 'bg-white/20 dark:bg-slate-800/60'}`}
                >
                  {msg.content}
                </div>
              ))}
              {typing && <p className="text-xs opacity-70">AI is typing...</p>}
            </div>
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSend()}
                placeholder={placeholder}
                className="flex-1 rounded-xl border border-slate-300 bg-white/60 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/50"
              />
              <button
                type="button"
                onClick={onSend}
                className="rounded-xl bg-sky-500 px-3 py-2 text-white"
              >
                <FaPaperPlane />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
