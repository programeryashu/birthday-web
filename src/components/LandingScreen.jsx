import { motion } from 'framer-motion'
import { useStore } from '../store'

export default function LandingScreen({ onComplete }) {
  const { config } = useStore()

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 3.5, duration: 1.5, ease: 'easeInOut' }}
      onAnimationComplete={() => onComplete()}
    >
      <div className="text-center relative z-[2]">
        <motion.h1
          className="font-[family-name:var(--font-display)] font-black text-white leading-tight"
          style={{
            fontSize: 'clamp(3rem, 10vw, 7rem)',
            animation: 'glow-pulse 2s ease-in-out infinite alternate',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          Happy Birthday
        </motion.h1>

        <motion.span
          className="block mt-2"
          style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, type: 'spring', bounce: 0.5 }}
        >
          🎉✨🎂
        </motion.span>

        <motion.p
          className="font-[family-name:var(--font-script)] text-white/80 mt-3"
          style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          To {config.name}
        </motion.p>
      </div>
    </motion.div>
  )
}
