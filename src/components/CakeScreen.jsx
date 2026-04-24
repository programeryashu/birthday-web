import { useState } from 'react'
import { motion } from 'framer-motion'
import { spawnConfetti } from './Effects'

export default function CakeScreen({ onComplete }) {
  const [taps, setTaps] = useState(0)
  const [blown, setBlown] = useState(false)
  const [msg, setMsg] = useState('')
  const [smokeY, setSmokeY] = useState(0)

  const handleTap = () => {
    if (blown) return
    const n = taps + 1
    setTaps(n)
    if (n === 1) setMsg('Make a wish first! 🌟')
    else if (n === 2) setMsg('Almost... blow harder! 💨')
    else if (n >= 3) {
      setBlown(true)
      setMsg('🎉 Wish granted! Happy Birthday! 🎂')
      spawnConfetti(40)
      // Animate smoke
      let sy = 0
      const iv = setInterval(() => {
        sy -= 1.5
        setSmokeY(sy)
        if (sy < -30) clearInterval(iv)
      }, 50)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass rounded-[28px] p-8 text-center max-w-[400px] w-full shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-[family-name:var(--font-script)] text-white text-2xl mb-2">Make a Wish! 🎂</h2>
        <p className="text-white/50 text-sm mb-5">Tap the cake to blow the candles...</p>

        <svg
          width="180" height="200" viewBox="0 0 180 200"
          className="mx-auto cursor-pointer transition-transform hover:scale-105"
          onClick={handleTap}
        >
          <ellipse cx="90" cy="185" rx="80" ry="12" fill="#e8c9a0" opacity=".5" />
          <rect x="20" y="130" width="140" height="50" rx="10" fill="#f4a0b5" />
          <rect x="30" y="95" width="120" height="40" rx="8" fill="#ffb3cc" />
          <rect x="45" y="68" width="90" height="32" rx="7" fill="#ff80ab" />
          <path d="M20 135 Q35 122 50 135 Q65 122 80 135 Q95 122 110 135 Q125 122 140 135 Q155 122 160 135" fill="none" stroke="#fff" strokeWidth="4" opacity=".6" />
          <circle cx="50" cy="150" r="5" fill="#fff" opacity=".6" />
          <circle cx="90" cy="155" r="5" fill="#ffd700" opacity=".8" />
          <circle cx="130" cy="150" r="5" fill="#fff" opacity=".6" />
          {/* Candles */}
          <rect x="65" y="44" width="8" height="26" rx="3" fill="#ffd700" />
          <rect x="86" y="38" width="8" height="32" rx="3" fill="#ff9ecc" />
          <rect x="107" y="44" width="8" height="26" rx="3" fill="#c9b8ff" />
          {/* Flames */}
          {!blown && (
            <g>
              <ellipse cx="69" cy="42" rx="5" ry="7" fill="#ffdd00" opacity=".9" className="flame" />
              <ellipse cx="90" cy="36" rx="5" ry="7" fill="#ff9900" opacity=".9" className="flame" />
              <ellipse cx="111" cy="42" rx="5" ry="7" fill="#ff6600" opacity=".9" className="flame" />
            </g>
          )}
          {/* Smoke */}
          {blown && (
            <g transform={`translate(0, ${smokeY})`} opacity={smokeY < -25 ? 0 : 0.5}>
              <circle cx="69" cy="38" r="3" fill="rgba(255,255,255,.5)" />
              <circle cx="90" cy="32" r="3" fill="rgba(255,255,255,.5)" />
              <circle cx="111" cy="38" r="3" fill="rgba(255,255,255,.5)" />
            </g>
          )}
          <text x="10" y="100" fontSize="14" opacity=".5">✨</text>
          <text x="155" y="110" fontSize="12" opacity=".5">⭐</text>
        </svg>

        <p className="font-[family-name:var(--font-display)] text-[var(--color-gold)] mt-4 min-h-[1.5rem] text-lg">
          {msg}
        </p>

        {blown && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-5 bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-light)] text-white py-3 px-7 rounded-full font-medium cursor-pointer shadow-lg hover:scale-105 transition-transform"
            onClick={onComplete}
          >
            Continue 🎈
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  )
}
