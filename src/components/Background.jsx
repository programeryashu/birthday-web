import { useEffect, useRef } from 'react'
import { useStore } from '../store'

const GRAD_THEMES = {
  '': ['#1a0a2e', '#3d0f5c', '#6a1a8a', '#3d0f5c'],
  pink: ['#1a0010', '#5c0f3d', '#8a1a6a', '#5c0f3d'],
  neon: ['#001a1a', '#003333', '#004444', '#002222'],
  premium: ['#1a1200', '#3d2c00', '#5c4400', '#3d2c00'],
  dark: ['#000', '#0a0010', '#050008', '#000'],
}

class Particle {
  constructor(W, H) { this.W = W; this.H = H; this.reset() }
  reset() {
    this.x = Math.random() * this.W
    this.y = Math.random() * this.H
    this.r = Math.random() * 2.5 + 0.5
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = -(Math.random() * 0.5 + 0.1)
    this.alpha = Math.random() * 0.8 + 0.2
    this.color = `hsl(${Math.random() * 60 + 300}, 80%, ${Math.random() * 30 + 60}%)`
    this.life = 0
    this.maxLife = 200 + Math.random() * 200
  }
  update() {
    this.x += this.vx; this.y += this.vy; this.life++
    if (this.life > this.maxLife || this.y < -10) this.reset()
  }
  draw(ctx) {
    ctx.save()
    ctx.globalAlpha = this.alpha * (1 - this.life / this.maxLife)
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export default function Background() {
  const canvasRef = useRef(null)
  const { config } = useStore()
  const themeRef = useRef(config.theme)

  useEffect(() => { themeRef.current = config.theme }, [config.theme])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let W = canvas.width = window.innerWidth
    let H = canvas.height = window.innerHeight
    const particles = Array.from({ length: 120 }, () => new Particle(W, H))
    let gradAngle = 0
    let animId

    const onResize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      particles.forEach(p => { p.W = W; p.H = H })
    }
    window.addEventListener('resize', onResize)

    const animate = () => {
      animId = requestAnimationFrame(animate)
      gradAngle += 0.002
      const gc = GRAD_THEMES[themeRef.current] || GRAD_THEMES['']
      const cx = W / 2 + Math.cos(gradAngle) * W * 0.15
      const cy = H / 2 + Math.sin(gradAngle) * H * 0.1
      const grad = ctx.createRadialGradient(cx, cy, 0, W / 2, H / 2, Math.max(W, H) * 0.8)
      grad.addColorStop(0, gc[2])
      grad.addColorStop(0.4, gc[1])
      grad.addColorStop(0.8, gc[0])
      grad.addColorStop(1, gc[3] || gc[0])
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, W, H)
      particles.forEach(p => { p.update(); p.draw(ctx) })
    }
    animate()

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', onResize) }
  }, [])

  return <canvas ref={canvasRef} id="bg-canvas" />
}
