import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider, useStore } from './store'
import Background from './components/Background'
import MusicPlayer from './components/MusicPlayer'
import AdminPanel from './components/AdminPanel'
import LandingScreen from './components/LandingScreen'
import CuriosityScreen from './components/CuriosityScreen'
import LetterScreen from './components/LetterScreen'
import CakeScreen from './components/CakeScreen'
import BalloonScreen from './components/BalloonScreen'
import MeterScreen from './components/MeterScreen'
import FinalScreen from './components/FinalScreen'

const SCREENS = [
  'landing',
  'curiosity',
  'letter',
  'cake',
  'balloons',
  'meter',
  'final'
]

function BirthdayApp() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const { config } = useStore()

  useEffect(() => {
    // Apply theme on mount/config change
    document.body.className = config.theme ? `theme-${config.theme}` : ''
    // Handle scrolling only on letter screen
    if (currentScreen === 2) {
      document.body.classList.add('allow-scroll')
    } else {
      document.body.classList.remove('allow-scroll')
      window.scrollTo(0, 0)
    }
  }, [config.theme, currentScreen])

  const next = () => setCurrentScreen(prev => Math.min(prev + 1, SCREENS.length - 1))
  const restart = () => {
    setCurrentScreen(0)
    window.scrollTo(0, 0)
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Background />
      <MusicPlayer />
      <AdminPanel />

      {/* Navigation Dots */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[150] flex flex-col gap-2">
        {SCREENS.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 border border-white/30 cursor-pointer ${
              i === currentScreen ? 'bg-white scale-125' : 'bg-white/30'
            }`}
            onClick={() => { if (i <= currentScreen) setCurrentScreen(i) }}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentScreen === 0 && (
          <LandingScreen key="landing" onComplete={next} />
        )}
        {currentScreen === 1 && (
          <CuriosityScreen key="curiosity" onComplete={next} />
        )}
        {currentScreen === 2 && (
          <LetterScreen key="letter" onComplete={next} />
        )}
        {currentScreen === 3 && (
          <CakeScreen key="cake" onComplete={next} />
        )}
        {currentScreen === 4 && (
          <BalloonScreen key="balloons" onComplete={next} />
        )}
        {currentScreen === 5 && (
          <MeterScreen key="meter" onComplete={next} />
        )}
        {currentScreen === 6 && (
          <FinalScreen key="final" onRestart={restart} />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <BirthdayApp />
    </StoreProvider>
  )
}
