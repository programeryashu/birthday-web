import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../useStore'

export default function MemoriesScreen({ onComplete }) {
  const { config } = useStore()
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const photos = config.photos && config.photos.length > 0 
    ? config.photos 
    : []

  const sparkles = useState(() => [...Array(12)].map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: 2 + Math.random() * 2,
    delay: Math.random() * 2,
    x: Math.random() * 40 - 20
  })))[0]

  if (photos.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-[100]">
        <div className="text-center space-y-6 px-6">
          <h2 className="text-white/40 font-light text-2xl tracking-widest uppercase">No memories added yet...</h2>
          <button 
            onClick={onComplete}
            className="px-8 py-3 bg-[var(--color-rose)] text-white rounded-full font-medium shadow-lg hover:scale-105 transition-transform"
          >
            Skip to next surprise ✨
          </button>
        </div>
      </div>
    )
  }

  const next = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1)
    } else {
      onComplete()
    }
  }

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0518]/80 backdrop-blur-xl p-4 sm:p-8"
    >
      {/* Decorative Title */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 text-center"
      >
        <h2 className="font-[family-name:var(--font-script)] text-4xl sm:text-5xl text-[var(--color-rose)] drop-shadow-lg">
          Captured Moments
        </h2>
        <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mt-2">Memory {currentIndex + 1} of {photos.length}</p>
      </motion.div>

      {/* Main Showcase */}
      <div className="relative w-full max-w-4xl aspect-[4/5] sm:aspect-video flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, x: -50, scale: 0.9, rotate: -2 }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}
            className="w-full h-full relative"
          >
            {/* Frame */}
            <div className="absolute inset-0 bg-white p-3 sm:p-4 shadow-2xl rounded-lg rotate-1 transform-gpu">
              <div className="w-full h-full overflow-hidden rounded bg-zinc-100 relative group">
                <img 
                  src={photos[currentIndex].url} 
                  alt="Memory"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&q=80'
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Caption */}
                {photos[currentIndex].caption && (
                  <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-[family-name:var(--font-script)] text-2xl sm:text-3xl text-white drop-shadow-md">
                      {photos[currentIndex].caption}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Polaroid-style footer */}
              <div className="pt-4 sm:pt-6 pb-2 text-center">
                <span className="font-[family-name:var(--font-script)] text-xl sm:text-2xl text-zinc-400">
                  {photos[currentIndex].caption || "A beautiful memory..."}
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute -bottom-20 sm:bottom-auto sm:-left-24 sm:top-1/2 sm:-translate-y-1/2">
          <button 
            onClick={prev}
            disabled={currentIndex === 0}
            className={`w-12 h-12 rounded-full flex items-center justify-center border border-white/20 text-white transition-all ${currentIndex === 0 ? 'opacity-20' : 'hover:bg-white/10 hover:border-white/40'}`}
          >
            ←
          </button>
        </div>
        <div className="absolute -bottom-20 right-0 sm:bottom-auto sm:-right-24 sm:top-1/2 sm:-translate-y-1/2">
          <button 
            onClick={next}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-rose)] text-white shadow-xl hover:scale-110 active:scale-95 transition-all font-bold"
          >
            {currentIndex === photos.length - 1 ? '✓' : '→'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-12 w-full max-w-xs h-1 bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-[var(--color-rose)]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
        />
      </div>

      {/* Floating Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((s, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            animate={{
              y: [-10, -100],
              x: [0, s.x],
              opacity: [0, 0.5, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: s.duration,
              repeat: Infinity,
              delay: s.delay
            }}
            style={{
              left: s.left,
              top: s.top
            }}
          />
        ))}
      </div>
    </motion.div>
  )
}
