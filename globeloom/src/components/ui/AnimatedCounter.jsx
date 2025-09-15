import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

// React Bits inspired Animated Counter Component
export const AnimatedCounter = ({ 
  end, 
  duration = 2, 
  delay = 0,
  suffix = '',
  prefix = '',
  className = '',
  decimals = 0
}) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return

    let startTime
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp + delay * 1000
      }

      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      const currentCount = Math.floor(easeOutQuart * end)
      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(end)
      }
    }

    const timeoutId = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate)
    }, delay * 1000)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
      clearTimeout(timeoutId)
    }
  }, [end, duration, delay, isInView])

  const formatNumber = (num) => {
    if (decimals > 0) {
      return num.toFixed(decimals)
    }
    return num.toLocaleString()
  }

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      className={`inline-block ${className}`}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  )
}

// Premium Stats Card Component
export const StatsCard = ({ 
  icon: Icon, 
  value, 
  suffix = '', 
  label, 
  color = 'purple',
  delay = 0 
}) => {
  const colorClasses = {
    purple: 'from-purple-400 to-purple-600',
    gold: 'from-amber-400 to-orange-500',
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-emerald-600',
    pink: 'from-pink-400 to-rose-500'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className="group relative"
    >
      <div className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        {/* Glow effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${colorClasses[color]} opacity-0 group-hover:opacity-10 rounded-2xl blur-xl transition-opacity duration-300 -z-10`} />
        
        {/* Icon */}
        {Icon && (
          <div className={`inline-flex items-center justify-center w-12 h-12 mb-4 bg-gradient-to-r ${colorClasses[color]} rounded-xl`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        )}
        
        {/* Value */}
        <div className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${colorClasses[color]} bg-clip-text text-transparent`}>
          <AnimatedCounter 
            end={value} 
            suffix={suffix}
            duration={2}
            delay={delay + 0.2}
          />
        </div>
        
        {/* Label */}
        <div className="text-white/70 text-sm md:text-base font-medium">
          {label}
        </div>
      </div>
    </motion.div>
  )
}

export default AnimatedCounter
