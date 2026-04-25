import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import { supabase } from './lib/supabase'

const DEFAULTS = {
  name: 'Someone Special',
  quote: 'Some people become special without even trying ✨',
  quoteSub: 'Wanna see a little creativity of mine?',
  letter: `I know it's not that much I can do😔, it's a simple way to celebrate your birthday (sorry about that💔). I know I'm a bad friend, so sorry if I ever said or did something that made you sad and you kept hiding it😓. I'm not gonna lie, you are my best online friend... I'm really glad for the time when we met each other🥹🤍. So yesss it's YOUR BIRTHDAY anyway✨. I really wish I was with you in reality celebrating with you and making the BEST (WORST 😂) cake ever 😭🫡💗🎂🎉`,
  from: '— Your Friend 🤍',
  finalMsg: `You deserve all the happiness in the world today and every day. No matter how far, you'll always have a friend cheering for you. Happy birthday, truly 🎂🤍`,
  theme: '',
  adminPw: '',
}

function loadLocalState() {
  try {
    const s = localStorage.getItem('bd-config')
    if (s) return { ...DEFAULTS, ...JSON.parse(s) }
  } catch (e) { /* ignore */ }
  return { ...DEFAULTS }
}

function saveLocalState(state) {
  try { localStorage.setItem('bd-config', JSON.stringify(state)) } catch (e) { /* ignore */ }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [config, setConfig] = useState(loadLocalState)
  const [isLoading, setIsLoading] = useState(true)
  const isInitialized = useRef(false)

  // 1. Fetch from Supabase on mount
  useEffect(() => {
    async function fetchRemote() {
      try {
        const { data, error } = await supabase
          .from('birthday_config')
          .select('config')
          .eq('id', 'main')
          .single()

        if (data && data.config) {
          setConfig(data.config)
          saveLocalState(data.config)
        } else if (error && error.code !== 'PGRST116') {
          console.error('Supabase fetch error:', error)
        }
      } catch (err) {
        console.error('Failed to connect to Supabase:', err)
      } finally {
        setIsLoading(false)
        isInitialized.current = true
      }
    }

    fetchRemote()
  }, [])

  // 2. Save to Supabase and LocalStorage when config changes
  useEffect(() => {
    if (!isInitialized.current) return

    saveLocalState(config)

    const timer = setTimeout(async () => {
      try {
        await supabase
          .from('birthday_config')
          .upsert({ id: 'main', config: config, updated_at: new Date().toISOString() })
      } catch (err) {
        console.error('Failed to save to Supabase:', err)
      }
    }, 1000) // Debounce 1s

    return () => clearTimeout(timer)
  }, [config])

  const update = useCallback((partial) => {
    setConfig(prev => ({ ...prev, ...partial }))
  }, [])

  const reset = useCallback(() => {
    localStorage.removeItem('bd-config')
    setConfig({ ...DEFAULTS })
  }, [])

  const exportJSON = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'birthday-config.json'
    a.click()
  }, [config])

  const importJSON = useCallback(() => {
    const inp = document.createElement('input')
    inp.type = 'file'
    inp.accept = '.json'
    inp.onchange = (e) => {
      const f = e.target.files[0]
      if (!f) return
      const r = new FileReader()
      r.onload = (ev) => {
        try {
          const d = JSON.parse(ev.target.result)
          setConfig(prev => ({ ...prev, ...d }))
        } catch (ex) { alert('Invalid JSON file') }
      }
      r.readAsText(f)
    }
    inp.click()
  }, [])

  return (
    <StoreContext.Provider value={{ config, update, reset, exportJSON, importJSON, DEFAULTS, isLoading }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}
