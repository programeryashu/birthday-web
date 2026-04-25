import { motion } from 'framer-motion'
import { useStore } from '../store'

export default function LandingScreen({ onComplete }) {
  const { config } = useStore()

  return (
    <div className="fixed inset-0 z-10 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative z-[2] max-w-2xl w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <motion.h1
            className="font-[family-name:var(--font-display)] font-black text-white leading-tight mb-4"
            style={{
              fontSize: 'clamp(3rem, 10vw, 7rem)',
              textShadow: '0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,105,180,0.3)',
            }}
          >
            Happy Birthday
          </motion.h1>
          
          <motion.h2
            className="text-white/90 font-light tracking-[0.2em] mb-8"
            style={{ fontSize: 'clamp(1.5rem, 4vw, 3rem)' }}
          >
            {config.name.toUpperCase()}
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-col items-center space-y-6"
        >
          <div className="flex gap-4 text-4xl mb-4">
            {['🎈', '✨', '🎂', '🎈', '🎉'].map((emoji, i) => (
              <motion.span
                key={i}
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  delay: i * 0.1,
                  duration: 2 + Math.random(),
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {emoji}
              </motion.span>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(255,255,255,0.4)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onComplete}
            className="group relative px-8 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full overflow-hidden transition-all"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center gap-3 text-white font-medium tracking-wide">
              Open Your Surprise 🎁
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating particles background hint */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '110%' 
            }}
            animate={{ 
              y: '-10%',
              opacity: [0, 0.3, 0]
            }}
            transition={{ 
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
    </div>
  )
}

