import { useRef, useCallback, useEffect, useState } from 'react'

const MELODY = [
  [261.63,.4],[261.63,.2],[293.66,.6],[261.63,.6],[349.23,.6],[329.63,1.2],
  [261.63,.4],[261.63,.2],[293.66,.6],[261.63,.6],[392,.6],[349.23,1.2],
  [261.63,.4],[261.63,.2],[523.25,.6],[440,.6],[349.23,.6],[329.63,.6],[293.66,1.2],
  [466.16,.4],[466.16,.2],[440,.6],[349.23,.6],[392,.6],[349.23,1.5],
]

export default function MusicPlayer({ currentScreen }) {
  const audioCtxRef = useRef(null)
  const gainRef = useRef(null)
  const timeoutRef = useRef(null)
  const playingRef = useRef(false)
  const [playing, setPlaying] = useState(false)

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return
    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)()
    gainRef.current = audioCtxRef.current.createGain()
    gainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
    gainRef.current.connect(audioCtxRef.current.destination)
  }, [])

  const playNoteRef = useRef()

  const playNote = useCallback((index = 0) => {
    if (!playingRef.current || !audioCtxRef.current) return
    const [freq, dur] = MELODY[index % MELODY.length]
    const ctx = audioCtxRef.current
    const osc = ctx.createOscillator()
    const g = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    g.gain.setValueAtTime(0.12, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur * 0.95)
    osc.connect(g)
    g.connect(gainRef.current)
    osc.start()
    osc.stop(ctx.currentTime + dur)
    timeoutRef.current = setTimeout(() => playNoteRef.current(index + 1), dur * 1000)
  }, [])

  useEffect(() => {
    playNoteRef.current = playNote
  }, [playNote])

  const start = useCallback(() => {
    initAudio()
    gainRef.current.gain.linearRampToValueAtTime(0.6, audioCtxRef.current.currentTime + 2)
    playingRef.current = true
    setPlaying(true)
    playNote()
  }, [initAudio, playNote])

  const stop = useCallback(() => {
    playingRef.current = false
    setPlaying(false)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current.currentTime + 0.5)
    }
  }, [])

  const toggle = useCallback(() => {
    if (playingRef.current) stop()
    else start()
  }, [start, stop])

  // Auto-start when currentScreen reaches curiosity screen (index 2)
  useEffect(() => {
    if (currentScreen >= 2 && !playingRef.current) {
      start()
    }
  }, [currentScreen, start])

  return (
    <button
      onClick={toggle}
      className="fixed bottom-5 right-5 z-[100] w-12 h-12 rounded-full glass flex items-center justify-center text-xl cursor-pointer transition-all duration-300 hover:scale-110 shadow-lg"
      title="Toggle Music"
    >
      {playing ? '🔊' : '🎵'}
    </button>
  )
}
