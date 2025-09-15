import React, { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { Button } from '../ui/button'

// Premium Magnetic Button (React Bits Style)
export function MagneticButton({ children, className = '', _asChild = false, _href, _to, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const springX = useSpring(x, { stiffness: 300, damping: 30 })
  const springY = useSpring(y, { stiffness: 300, damping: 30 })

  const handleMouseMove = (e) => {
    if (!ref.current) return
    
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15
    
    x.set(deltaX)
    y.set(deltaY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const Component = motion.div

  return (
    <Component
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </Component>
  )
}

// Premium Glow Button
export function GlowButton({ children, className = '', glowColor = 'purple', ...props }) {
  const glowColors = {
    purple: 'shadow-purple-500/50 hover:shadow-purple-500/80',
    blue: 'shadow-blue-500/50 hover:shadow-blue-500/80',
    pink: 'shadow-pink-500/50 hover:shadow-pink-500/80',
    aurora: 'shadow-aurora-500/50 hover:shadow-aurora-500/80',
    coral: 'shadow-coral-500/50 hover:shadow-coral-500/80',
    gold: 'shadow-gold-500/50 hover:shadow-gold-500/80'
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Button 
        className={`
          ${className} 
          shadow-2xl ${glowColors[glowColor]} 
          transition-all duration-300 
          hover:shadow-3xl
          relative overflow-hidden
          before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent
          before:translate-x-[-100%] hover:before:translate-x-[100%] before:transition-transform before:duration-1000
        `} 
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  )
}

// Premium Ripple Button
export function RippleButton({ children, className = '', onClick, ...props }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const newRipple = {
      x,
      y,
      id: Date.now()
    }
    
    setRipples(prev => [...prev, newRipple])
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
    }, 600)
    
    if (onClick) onClick(e)
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden inline-block"
    >
      <Button 
        className={`${className} relative overflow-hidden`}
        onClick={handleClick}
        {...props}
      >
        {children}
        
        {/* Ripple effects */}
        {ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-white/30 rounded-full pointer-events-none"
            style={{
              left: ripple.x - 10,
              top: ripple.y - 10,
              width: 20,
              height: 20,
            }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </Button>
    </motion.div>
  )
}

// Premium Floating Card
export function FloatingCard({ children, className = '', delay = 0, ...props }) {
  return (
    <motion.div
      className={`${className} relative`}
      initial={{ opacity: 0, y: 50, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100,
        damping: 20
      }}
      whileHover={{ 
        y: -10, 
        rotateX: 5,
        rotateY: 5,
        transition: { duration: 0.3 }
      }}
      style={{ transformStyle: 'preserve-3d' }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Premium Text Shimmer Effect
export function ShimmerText({ children, className = '', duration = 2 }) {
  return (
    <motion.span
      className={`
        ${className} 
        relative inline-block
        bg-gradient-to-r from-white via-purple-200 to-white
        bg-clip-text text-transparent
        bg-[length:200%_100%]
      `}
      animate={{
        backgroundPosition: ['200% 50%', '-200% 50%']
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)'
      }}
    >
      {children}
    </motion.span>
  )
}

// Premium Pulse Indicator
export function PulseIndicator({ className = '', color = 'purple', size = 'md' }) {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  }
  
  const colors = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    aurora: 'bg-aurora-500',
    coral: 'bg-coral-500'
  }

  return (
    <div className={`${className} relative inline-flex`}>
      <motion.div
        className={`${sizes[size]} ${colors[color]} rounded-full`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className={`${sizes[size]} ${colors[color]} rounded-full absolute inset-0`}
        animate={{
          scale: [1, 2, 1],
          opacity: [0.7, 0, 0.7]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  )
}

// Premium Loading Spinner
export function PremiumSpinner({ size = 'md', color = 'purple' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  }
  
  const colors = {
    purple: 'border-purple-500',
    blue: 'border-blue-500',
    aurora: 'border-aurora-500',
    coral: 'border-coral-500'
  }

  return (
    <motion.div
      className={`
        ${sizes[size]} 
        border-2 border-transparent 
        ${colors[color]} 
        border-t-transparent 
        rounded-full
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    />
  )
}

// Premium Progress Bar
export function PremiumProgressBar({ 
  progress = 0, 
  className = '', 
  showPercentage = true,
  color = 'gradient',
  animated = true 
}) {
  const colors = {
    purple: 'bg-purple-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    aurora: 'bg-aurora-500',
    coral: 'bg-coral-500',
    gradient: 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500'
  }

  return (
    <div className={`${className} w-full`}>
      <div className="flex justify-between items-center mb-2">
        {showPercentage && (
          <span className="text-sm font-medium text-white/80">
            {Math.round(progress)}%
          </span>
        )}
      </div>
      
      <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
        <motion.div
          className={`h-full ${colors[color]} rounded-full ${animated ? 'relative overflow-hidden' : ''}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {animated && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default {
  MagneticButton,
  GlowButton,
  RippleButton,
  FloatingCard,
  ShimmerText,
  PulseIndicator,
  PremiumSpinner,
  PremiumProgressBar
}
