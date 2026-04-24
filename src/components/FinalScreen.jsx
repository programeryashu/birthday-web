import { motion } from 'framer-motion'
import { useStore } from '../store'

export default function FinalScreen({ onRestart }) {
  const { config } = useStore()

  return (
    <motion.div
      className="fixed inset-0 z-10 flex items-center justify-center px-4"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="glass rounded-[28px] p-8 text-center max-w-[500px] w-full shadow-2xl relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="font-[family-name:var(--font-display)] text-[var(--color-gold)] text-2xl sm:text-3xl mb-4">
          🌟 One Last Thing...
        </h2>
        
        <p className="font-[family-name:var(--font-script)] text-white/90 text-xl sm:text-2xl leading-relaxed mb-6">
          {config.finalMsg}
        </p>

        <div className="text-4xl mb-8">🎉🥳🎊✨🎂💗</div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-br from-[var(--color-lavender)] to-[var(--color-sky)] text-[var(--color-deep)] py-3 px-8 rounded-full font-semibold cursor-pointer shadow-lg hover:scale-105 transition-transform"
        >
          Replay Experience 🔁
        </button>
      </motion.div>
    </motion.div>
  )
}
