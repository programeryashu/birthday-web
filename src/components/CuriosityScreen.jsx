import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { spawnConfetti } from './Effects'

export default function CuriosityScreen({ onComplete }) {
  const { config } = useStore()
  const [noClicks, setNoClicks] = useState(0)
  const [yesScale, setYesScale] = useState(1)
  const [noStyle, setNoStyle] = useState({ scale: 1, opacity: 1, x: 0, y: 0 })
  const [hidden, setHidden] = useState(false)
  const noRef = useRef(null)

  const handleNo = () => {
    const n = noClicks + 1
    setNoClicks(n)
    setYesScale(Math.min(yesScale + 0.18, 3))
    setNoStyle({
      scale: Math.max(noStyle.scale - 0.14, 0.2),
      opacity: Math.max(noStyle.opacity - 0.18, 0.1),
      x: (Math.random() - 0.5) * 80,
      y: (Math.random() - 0.5) * 50,
    })
    if (n >= 5) setHidden(true)
  }

  const handleYes = () => {
    spawnConfetti(80)
    setTimeout(onComplete, 600)
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
        className="glass rounded-[28px] p-8 sm:p-12 max-w-[520px] w-full text-center shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <p className="font-[family-name:var(--font-display)] text-white text-lg sm:text-xl leading-relaxed mb-3">
          {config.quote}
        </p>
        <p className="font-[family-name:var(--font-script)] text-[var(--color-blush)] text-base sm:text-lg mb-8">
          {config.quoteSub}
        </p>

        <div className="flex gap-4 justify-center items-center flex-wrap">
          <motion.button
            onClick={handleYes}
            animate={{ scale: yesScale }}
            whileHover={{ scale: yesScale * 1.07 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="relative overflow-hidden bg-gradient-to-br from-[var(--color-rose)] to-[var(--color-rose-light)] text-white py-3 px-8 rounded-full font-medium text-lg cursor-pointer shadow-[0_4px_24px_rgba(255,107,157,0.4)]"
          >
            Yes! 🥹
            <span className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none" />
          </motion.button>

          <AnimatePresence>
            {!hidden && (
              <motion.button
                ref={noRef}
                onClick={handleNo}
                animate={{
                  scale: noStyle.scale,
                  opacity: noStyle.opacity,
                  x: noStyle.x,
                  y: noStyle.y,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="glass py-3 px-6 rounded-full text-white/80 text-base cursor-pointer"
              >
                No 😐
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}
