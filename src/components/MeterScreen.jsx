import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function MeterScreen({ onComplete }) {
  const [pct, setPct] = useState(0)
  const [barWidth, setBarWidth] = useState('0%')

  useEffect(() => {
    const t1 = setTimeout(() => setBarWidth('100%'), 400)
    let p = 0
    const t2 = setTimeout(() => {
      const iv = setInterval(() => {
        p = Math.min(p + 2, 1000)
        setPct(p)
        if (p >= 1000) clearInterval(iv)
      }, 40)
    }, 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass rounded-[28px] p-8 text-center max-w-[460px] w-full shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="font-[family-name:var(--font-display)] text-white text-xl sm:text-2xl mb-1">
          Friendship Level 🤝
        </h2>
        <p className="font-[family-name:var(--font-script)] text-[var(--color-blush)] mb-6">
          According to very scientific calculations...
        </p>

        {/* Meter bar */}
        <div className="bg-white/10 rounded-full h-7 overflow-hidden border border-white/20 mb-3">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--color-rose)] via-[var(--color-gold)] to-[var(--color-rose-light)] shadow-[0_0_20px_rgba(255,107,157,0.6)]"
            style={{ width: barWidth, transition: 'width 2.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
          />
        </div>

        <p className="font-[family-name:var(--font-display)] text-[var(--color-gold)] text-4xl sm:text-5xl font-black">
          {pct}%
        </p>
        <p className="font-[family-name:var(--font-script)] text-white/60 mb-6">
          Best Friends Forever ✨
        </p>

        <button
          onClick={onComplete}
          className="bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-light)] text-white py-3 px-7 rounded-full font-medium cursor-pointer shadow-lg hover:scale-105 transition-transform"
        >
          One more thing... 🎁
        </button>
      </motion.div>
    </motion.div>
  )
}
