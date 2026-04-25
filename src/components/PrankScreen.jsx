import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { useStore } from '../store'

const SYSTEM_LOGS = [
  "INITIALIZING BOOT SEQUENCE...",
  "LOADING KERNEL MODULES...",
  "ESTABLISHING SECURE PROTOCOL...",
  "BYPASSING FIREWALL [80, 443]...",
  "INJECTING PACKETS...",
  "REMOTE ACCESS GRANTED.",
]

const ACTIONS = [
  { text: "Accessing camera...", result: "DENIED", color: "text-red-500" },
  { text: "Reading chats...", result: "SUCCESS", color: "text-green-500" },
  { text: "Scanning gallery...", result: "78 FILES FOUND", color: "text-green-500" },
  { text: "Locating secrets...", result: "FOUND TOO MANY 😈", color: "text-amber-500" },
]

export default function PrankScreen({ onComplete }) {
  const { config } = useStore()
  const [phase, setPhase] = useState('boot') // boot, control, shake, load, reveal
  const [logs, setLogs] = useState([])
  const [actionIndex, setActionIndex] = useState(-1)
  const [progress, setProgress] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [ipAddress, setIpAddress] = useState('192.168.1.1')
  const [time, setTime] = useState(new Date().toLocaleTimeString())
  const controls = useAnimation()
  const terminalRef = useRef(null)

  // System Clock & Random IP
  useEffect(() => {
    const t = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000)
    setIpAddress(`${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`)
    return () => clearInterval(t)
  }, [])

  const playBeep = (freq = 440, duration = 0.1) => {
    if (isMuted) return
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
      const osc = audioCtx.createOscillator()
      const gain = audioCtx.createGain()
      osc.connect(gain)
      gain.connect(audioCtx.destination)
      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime)
      osc.start()
      osc.stop(audioCtx.currentTime + duration)
    } catch (e) {}
  }

  // Main Sequence
  useEffect(() => {
    const sequence = async () => {
      // Phase 1: Boot/Logs
      for (let i = 0; i < SYSTEM_LOGS.length; i++) {
        await new Promise(r => setTimeout(r, 400 + Math.random() * 600))
        setLogs(prev => [...prev, SYSTEM_LOGS[i]])
        playBeep(220, 0.05)
      }
      
      await new Promise(r => setTimeout(r, 800))
      setPhase('control')

      // Phase 2: Actions
      for (let i = 0; i < ACTIONS.length; i++) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 500))
        setActionIndex(i)
        playBeep(actionIndex % 2 === 0 ? 880 : 440, 0.1)
      }

      await new Promise(r => setTimeout(r, 1200))
      setPhase('shake')

      // Phase 3: Shake & Warning
      if (window.navigator.vibrate) {
        window.navigator.vibrate([200, 100, 200, 100, 400])
      }
      
      playBeep(110, 1.5)

      await controls.start({
        x: [0, -15, 15, -15, 15, 0],
        y: [0, 10, -10, 10, -10, 0],
        transition: { duration: 0.1, repeat: 15 }
      })

      setPhase('load')

      // Phase 4: Loading 99%
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 15
        if (p >= 99) {
          p = 99
          clearInterval(interval)
          setTimeout(() => {
            setPhase('reveal')
          }, 2500)
        } else {
          playBeep(440 + p * 10, 0.02)
        }
        setProgress(Math.floor(p))
      }, 300)
    }

    sequence()
  }, [])

  useEffect(() => {
    if (phase === 'reveal') {
      setTimeout(onComplete, 4000)
    }
  }, [phase, onComplete])

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-[2000] font-mono overflow-hidden text-green-500 selection:bg-green-500/30 selection:text-white"
      animate={controls}
    >
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none z-[2001] opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      <div className="absolute inset-0 pointer-events-none z-[2002] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      <div className="absolute inset-0 pointer-events-none z-[2003] scanline" />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 bg-zinc-900 flex items-center justify-between px-4 text-[10px] tracking-widest border-b border-white/5 z-[2005]">
        <div className="flex items-center gap-4">
          <span className="text-zinc-500 font-bold">SYSTEM ACCESS PANEL v4.2</span>
          <span className="text-emerald-500 animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> LIVE
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
          </button>
          <div className="hidden sm:flex items-center gap-4">
            <span>IP: {ipAddress}</span>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">SIGNAL</span>
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-[40%] bg-green-500" />
                <div className="w-1 h-[65%] bg-green-500" />
                <div className="w-1 h-[85%] bg-green-500" />
                <div className="w-1 h-[100%] bg-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-zinc-500">BATT</span>
              <div className="w-6 h-3 border border-zinc-600 rounded-sm p-0.5 relative">
                <div className="h-full bg-amber-500 w-[15%]" />
                <div className="absolute -right-1 top-1 w-1 h-1 bg-zinc-600" />
              </div>
              <span>15%</span>
            </div>
          </div>
          <span className="text-zinc-400 font-bold">{time}</span>
        </div>
      </div>

      {/* Main Terminal View */}
      <div className="h-full flex flex-col p-8 pt-16">
        
        {/* Left Side: Logs */}
        <div className="flex-1 overflow-hidden opacity-80" ref={terminalRef}>
          {logs.map((log, i) => (
            <div key={i} className="mb-1 text-[10px] sm:text-xs">
              <span className="opacity-40 mr-2">[{new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
              <span className="text-white/80">{log}</span>
            </div>
          ))}
          {phase === 'boot' && <span className="w-2 h-4 bg-green-500 inline-block animate-pulse ml-1 align-middle" />}
        </div>

        {/* Center Overlay: Warnings & Actions */}
        <AnimatePresence>
          {(phase === 'control' || phase === 'shake' || phase === 'load') && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="absolute inset-0 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm z-[2010]"
            >
              <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                  <motion.h2 
                    animate={phase === 'shake' ? { color: ['#fff', '#f00', '#fff'] } : {}}
                    transition={{ repeat: Infinity, duration: 0.2 }}
                    className="text-white text-xl sm:text-2xl font-bold tracking-tighter"
                  >
                    REMOTE DEVICE SYNC ESTABLISHED
                  </motion.h2>
                  <p className="text-zinc-500 text-sm mt-2">TEMPORARY CONTROL GRANTED</p>
                </div>

                <div className="space-y-4 bg-zinc-900/80 border border-white/10 p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
                  {ACTIONS.map((action, i) => (
                    <div key={i} className={`flex justify-between text-sm relative z-10 ${i <= actionIndex ? 'opacity-100' : 'opacity-0'}`}>
                      <span className="text-zinc-400">{action.text}</span>
                      <span className={`font-bold ${action.color}`}>{action.result}</span>
                    </div>
                  ))}
                </div>

                {phase === 'load' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>UPLOADING EMBARRASSING DATA...</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full bg-red-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Reveal */}
        <AnimatePresence>
          {phase === 'reveal' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black flex flex-col items-center justify-center z-[2020] text-center"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <div className="text-white/40 text-[10px] mb-8">DELETING PRANK EVIDENCE... [OK]</div>
                
                <h1 className="text-white text-4xl sm:text-6xl font-black tracking-tight leading-none">
                  Relax 😎<br />
                  <span className="text-rose-500">You just got pranked.</span>
                </h1>

                <div className="text-white/80 text-xl sm:text-2xl font-light">
                  HAPPY BIRTHDAY <span className="font-bold text-amber-400">{config.name}</span> 🎉
                </div>
              </motion.div>

              {/* Fake Meters in Background */}
              <div className="absolute bottom-12 left-8 right-8 flex flex-col sm:flex-row justify-between opacity-10 text-[8px] uppercase tracking-widest gap-4">
                <div className="space-y-1">
                  <div>CPU LOAD: 98%</div>
                  <div className="w-full sm:w-32 h-1 bg-white/20"><div className="w-[98%] h-full bg-white" /></div>
                </div>
                <div className="space-y-1">
                  <div>RAM USAGE: 4.2GB / 8GB</div>
                  <div className="w-full sm:w-32 h-1 bg-white/20"><div className="w-[52%] h-full bg-white" /></div>
                </div>
                <div className="space-y-1">
                  <div>TEMP: 72°C</div>
                  <div className="w-full sm:w-32 h-1 bg-white/20"><div className="w-[72%] h-full bg-white" /></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shake Border Overlay */}
        <AnimatePresence>
          {phase === 'shake' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.2 }}
              className="fixed inset-0 border-[12px] border-red-600/50 z-[2015] pointer-events-none shadow-[inset_0_0_100px_rgba(220,38,38,0.5)]"
            />
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .scanline {
          width: 100%;
          height: 100px;
          z-index: 2003;
          background: linear-gradient(0deg, rgba(0, 0, 0, 0) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(0, 0, 0, 0) 100%);
          opacity: 0.1;
          position: absolute;
          bottom: 100%;
          animation: scanline 10s linear infinite;
        }

        @keyframes scanline {
          0% { bottom: 100%; }
          100% { bottom: -100px; }
        }
      `}</style>
    </motion.div>
  )
}

