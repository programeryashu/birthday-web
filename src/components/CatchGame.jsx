import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../useStore'

export default function CatchGame({ onUnlock }) {
  const { config } = useStore()
  const [score, setScore] = useState(0)
  const [items, setItems] = useState([])
  const gameRef = useRef(null)
  const [basketX, setBasketX] = useState(50) // percentage
  const [isUnlocked, setIsUnlocked] = useState(false)

  // Spawn items
  useEffect(() => {
    if (isUnlocked) return
    
    const interval = setInterval(() => {
      const id = Math.random().toString(36).substr(2, 9)
      const x = Math.random() * 90 + 5 // 5% to 95%
      setItems(prev => [...prev, { id, x, y: -10, type: Math.random() > 0.2 ? '🎁' : '💣' }])
    }, 800)

    return () => clearInterval(interval)
  }, [isUnlocked])

  // Move items
  useEffect(() => {
    if (isUnlocked) return

    const interval = setInterval(() => {
      setItems(prev => {
        const next = prev.map(item => ({ ...item, y: item.y + 2 }))
        
        // Check collisions
        return next.filter(item => {
          if (item.y > 80 && item.y < 95) {
            const dist = Math.abs(item.x - basketX)
            if (dist < 15) {
              if (item.type === '🎁') {
                setScore(s => {
                  const newScore = s + 1
                  if (newScore >= 20 && !isUnlocked) {
                    setIsUnlocked(true)
                    onUnlock()
                  }
                  return newScore
                })
              } else {
                // Bomb!
                setScore(s => Math.max(0, s - 5))
              }
              return false
            }
          }
          return item.y < 100
        })
      })
    }, 50)

    return () => clearInterval(interval)
  }, [basketX, isUnlocked, onUnlock])

  const handleMouseMove = (e) => {
    if (!gameRef.current) return
    const rect = gameRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    setBasketX(Math.max(5, Math.min(95, x)))
  }

  const handleTouchMove = (e) => {
    if (!gameRef.current) return
    const rect = gameRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = ((touch.clientX - rect.left) / rect.width) * 100
    setBasketX(Math.max(5, Math.min(95, x)))
  }

  return (
    <div 
      ref={gameRef}
      className="relative w-full h-[300px] bg-black/20 rounded-2xl overflow-hidden cursor-none touch-none border border-white/10"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      <div className="absolute top-4 left-4 z-10 font-bold text-xl text-white">
        Score: <span className="text-rose-400">{score}</span> / 20
      </div>

      <AnimatePresence>
        {items.map(item => (
          <div 
            key={item.id}
            className="absolute text-2xl"
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
          >
            {item.type}
          </div>
        ))}
      </AnimatePresence>

      {/* Basket */}
      <motion.div 
        className="absolute bottom-4 text-4xl"
        animate={{ x: `${basketX}%` }}
        style={{ left: 0, marginLeft: '-1.25rem' }} // Half of 4xl (2.5rem approx) for centering
      >
        🛒
      </motion.div>

      {isUnlocked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-rose-600/90 flex items-center justify-center p-6 text-center"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">✨ SUCCESS! ✨</h3>
            <p className="text-white/90 italic">{config.secretMessage}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}
