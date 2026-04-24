import { createContext, useContext, useState, useCallback, useEffect } from 'react'

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

function loadState() {
  try {
    const s = localStorage.getItem('bd-config')
    if (s) return { ...DEFAULTS, ...JSON.parse(s) }
  } catch (e) { /* ignore */ }
  return { ...DEFAULTS }
}

function saveState(state) {
  try { localStorage.setItem('bd-config', JSON.stringify(state)) } catch (e) { /* ignore */ }
}

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [config, setConfig] = useState(loadState)

  useEffect(() => { saveState(config) }, [config])

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
    <StoreContext.Provider value={{ config, update, reset, exportJSON, importJSON, DEFAULTS }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be inside StoreProvider')
  return ctx
}
