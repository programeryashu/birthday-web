import { useEffect, useRef, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { triggerFireworks } from './Effects'

function FloatingHearts() {
  const emojis = ['💕', '🤍', '✨', '💗', '🫶', '💞', '🌸']
  const hearts = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: emojis[Math.floor(Math.random() * emojis.length)],
      left: `${Math.random() * 90}%`,
      dur: `${3 + Math.random() * 3}s`,
      del: `${Math.random() * 4}s`,
    })), [])

  return (
    <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
      {hearts.map(h => (
        <span
          key={h.id}
          className="heart-float"
          style={{ left: h.left, bottom: 0, '--dur': h.dur, '--del': h.del }}
        >
          {h.emoji}
        </span>
      ))}
    </div>
  )
}

export default function LetterScreen({ onComplete }) {
  const { config } = useStore()
  const [text, setText] = useState('')
  const [done, setDone] = useState(false)
  const [showMade, setShowMade] = useState(false)
  const indexRef = useRef(0)
  const timerRef = useRef(null)

  useEffect(() => {
    const letter = config.letter
    indexRef.current = 0
    setText('')
    setDone(false)
    setShowMade(false)

    function typeNext() {
      if (indexRef.current >= letter.length) {
        setDone(true)
        triggerFireworks()
        setTimeout(() => setShowMade(true), 800)
        setTimeout(() => onComplete(), 5000)
        return
      }
      indexRef.current++
      setText(letter.slice(0, indexRef.current))
      const ch = letter[indexRef.current - 1]
      timerRef.current = setTimeout(typeNext, ch === '\n' ? 300 : 28 + Math.random() * 18)
    }

    timerRef.current = setTimeout(typeNext, 500)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  }, [config.letter, onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-start justify-center overflow-y-auto py-8 px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass-strong rounded-[32px] p-8 sm:p-12 max-w-[680px] w-full shadow-2xl relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <FloatingHearts />

        <h2 className="font-[family-name:var(--font-script)] text-[var(--color-gold)] text-center text-2xl sm:text-3xl mb-6">
          A Little Note For You 💌
        </h2>

        <div
          className="font-[family-name:var(--font-display)] text-white/90 leading-[1.9] text-base sm:text-lg min-h-[4rem]"
        >
          {text}
          {!done && <span className="letter-cursor" />}
        </div>

        <div className="font-[family-name:var(--font-script)] text-[var(--color-rose)] text-right mt-6 text-lg sm:text-xl">
          {config.from}
        </div>

        <motion.div
          className="font-[family-name:var(--font-script)] text-[var(--color-gold)] text-center mt-6 text-xl sm:text-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: showMade ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          Made specially for you ❤️
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
