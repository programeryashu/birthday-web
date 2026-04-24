import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { spawnConfetti } from './Effects'

const BALLOONS = [
  { emoji: '🎈', left: '15%', top: '15%', spd: '1.5s', del: '0s' },
  { emoji: '🎀', left: '55%', top: '45%', spd: '1.9s', del: '0.2s' },
  { emoji: '🎊', left: '78%', top: '10%', spd: '2.1s', del: '0.4s' },
  { emoji: '🎁', left: '30%', top: '55%', spd: '2.3s', del: '0.6s' },
  { emoji: '🎉', left: '65%', top: '70%', spd: '2.5s', del: '0.8s' },
]

export default function BalloonScreen({ onComplete }) {
  const [popped, setPopped] = useState(new Set())
  const remaining = BALLOONS.length - popped.size

  const pop = useCallback((idx) => {
    setPopped(prev => {
      const next = new Set(prev)
      next.add(idx)
      return next
    })
    spawnConfetti(12)
  }, [])

  useEffect(() => {
    if (remaining === 0) {
      const t = setTimeout(onComplete, 800)
      return () => clearTimeout(t)
    }
  }, [remaining, onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass rounded-[28px] p-8 text-center max-w-[480px] w-full shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-[family-name:var(--font-script)] text-white text-2xl mb-1">Pop the Balloons! 🎈</h2>
        <p className="text-white/50 text-sm mb-5">All of them to continue...</p>

        <div className="relative h-[200px] max-w-[360px] mx-auto">
          <AnimatePresence>
            {BALLOONS.map((b, i) => !popped.has(i) && (
              <motion.span
                key={i}
                className="absolute cursor-pointer text-4xl balloon-bob select-none"
                style={{ left: b.left, top: b.top, '--spd': b.spd, '--del': b.del }}
                onClick={() => pop(i)}
                whileHover={{ scale: 1.15 }}
                exit={{ scale: 1.5, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {b.emoji}
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <p className="text-white/60 text-sm mt-3">
          {remaining > 0 ? `${remaining} balloon${remaining > 1 ? 's' : ''} left` : '🎉 All popped!'}
        </p>
      </motion.div>
    </motion.div>
  )
}
