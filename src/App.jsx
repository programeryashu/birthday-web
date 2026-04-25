import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { StoreProvider } from './store'
import { useStore } from './useStore'
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
import PrankScreen from './components/PrankScreen'
import MemoriesScreen from './components/MemoriesScreen'
import TimelineScreen from './components/TimelineScreen'

const SCREENS = [
  'landing',
  'prank',
  'curiosity',
  'letter',
  'timeline',
  'memories',
  'cake',
  'balloons',
  'meter',
  'final'
]

function BirthdayApp() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const { config, isLoading } = useStore()

  useEffect(() => {
    // Apply theme on mount/config change
    document.body.className = config.theme ? `theme-${config.theme}` : ''
    // Handle scrolling for content-heavy screens
    const currentName = SCREENS[currentScreen]
    if (currentName === 'letter' || currentName === 'timeline') {
      document.body.classList.add('allow-scroll')
    } else {
      document.body.classList.remove('allow-scroll')
      window.scrollTo(0, 0)
    }
  }, [config.theme, currentScreen])

  const next = () => {
    let nextIdx = currentScreen + 1
    // Skip prank if disabled
    if (SCREENS[nextIdx] === 'prank' && !config.showPrank) {
      nextIdx++
    }
    setCurrentScreen(Math.min(nextIdx, SCREENS.length - 1))
  }
  const restart = () => {
    setCurrentScreen(0)
    window.scrollTo(0, 0)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#0a0518] flex items-center justify-center z-[500]">
        <div className="text-rose-500 animate-pulse text-xl font-light tracking-widest">
          PREPARING SURPRISE...
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <Background />
      <MusicPlayer currentScreen={currentScreen} />
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
          <PrankScreen key="prank" onComplete={next} />
        )}
        {currentScreen === 2 && (
          <CuriosityScreen key="curiosity" onComplete={next} />
        )}
        {currentScreen === 3 && (
          <LetterScreen key="letter" onComplete={next} />
        )}
        {currentScreen === 4 && (
          <TimelineScreen key="timeline" onComplete={next} />
        )}
        {currentScreen === 5 && (
          <MemoriesScreen key="memories" onComplete={next} />
        )}
        {currentScreen === 6 && (
          <CakeScreen key="cake" onComplete={next} />
        )}
        {currentScreen === 7 && (
          <BalloonScreen key="balloons" onComplete={next} />
        )}
        {currentScreen === 8 && (
          <MeterScreen key="meter" onComplete={next} />
        )}
        {currentScreen === 9 && (
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
