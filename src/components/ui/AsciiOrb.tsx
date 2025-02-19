'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const ASCII_CHARS = '.:-=+*#%@'
const DENSITY = 0.5

const AsciiOrb = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const outputRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !outputRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const createAsciiArt = () => {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      let asciiArt = ''

      for (let y = 0; y < canvas.height; y += 2) {
        for (let x = 0; x < canvas.width; x += 1) {
          const index = (y * canvas.width + x) * 4
          const brightness = (pixels[index] + pixels[index + 1] + pixels[index + 2]) / 3
          const charIndex = Math.floor((brightness / 255) * (ASCII_CHARS.length - 1))
          asciiArt += ASCII_CHARS[charIndex]
        }
        asciiArt += '\\n'
      }

      outputRef.current!.textContent = asciiArt
    }

    // Draw and animate the orb
    const drawOrb = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) * 0.2

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.fillStyle = '#ffffff'
      ctx.fill()

      createAsciiArt()
    }

    // Animation
    gsap.to({}, {
      duration: 2,
      repeat: -1,
      onUpdate: drawOrb,
      ease: "power1.inOut"
    })

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      drawOrb()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="w-full h-full relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 opacity-0 pointer-events-none"
      />
      <pre
        ref={outputRef}
        className="absolute top-0 left-0 w-full h-full text-[4px] leading-[4px] text-white font-mono whitespace-pre opacity-50"
        style={{ fontFamily: 'monospace' }}
      />
    </div>
  )
}

export default AsciiOrb 