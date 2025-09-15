// Premium Animated Background Component inspired by React Bits
import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export const PremiumBackground = ({ children, variant = "mesh" }) => {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const { left, top, width, height } = container.getBoundingClientRect()
      const x = (clientX - left) / width
      const y = (clientY - top) / height

      container.style.setProperty('--mouse-x', x)
      container.style.setProperty('--mouse-y', y)
    }

    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const backgroundVariants = {
    mesh: "bg-gradient-to-br from-midnight-950 via-midnight-900 to-midnight-800",
    aurora: "bg-gradient-to-br from-midnight-950 via-aurora-950 to-midnight-900",
    premium: "bg-professional-mesh",
    glass: "bg-gradient-to-br from-midnight-950/95 via-midnight-900/90 to-midnight-800/95"
  }

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen relative overflow-hidden ${backgroundVariants[variant]}`}
      style={{
        '--mouse-x': 0.5,
        '--mouse-y': 0.5,
      }}
    >
      {/* Animated Mesh Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div 
          className="absolute inset-0 bg-gradient-radial from-aurora-500/20 via-transparent to-transparent"
          style={{
            background: `radial-gradient(600px circle at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), 
              rgba(14, 165, 233, 0.15), 
              rgba(14, 165, 233, 0.05) 40%, 
              transparent 70%)`
          }}
        />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-radial from-aurora-400/10 to-transparent"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20 + i * 5,
              repeat: Infinity,
              ease: "linear",
              delay: i * 2,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />
      </div>

      {/* Spotlight Effect */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle 400px at calc(var(--mouse-x) * 100%) calc(var(--mouse-y) * 100%), 
            rgba(14, 165, 233, 0.1), 
            transparent 80%)`
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default PremiumBackground
