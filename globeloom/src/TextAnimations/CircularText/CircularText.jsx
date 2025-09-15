import React from 'react'
import { motion } from 'framer-motion'

const CircularText = ({ 
  children, 
  className = '', 
  radius = 100,
  fontSize = 16,
  direction = 'clockwise',
  startAngle = 0,
  delay = 0,
  duration = 2
}) => {
  const text = children || ''
  const chars = text.split('')
  const totalChars = chars.length
  const angleStep = (2 * Math.PI) / totalChars
  const isClockwise = direction === 'clockwise'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: 0.05,
        duration: duration * 0.3
      }
    }
  }

  const charVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.3,
      rotateY: 90
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotateY: 0,
      transition: {
        duration: duration * 0.8,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  }

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ 
        width: radius * 2, 
        height: radius * 2 
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {chars.map((char, index) => {
        const angle = startAngle + (isClockwise ? angleStep * index : -angleStep * index)
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        const rotation = ((angle * 180) / Math.PI) + (isClockwise ? 90 : -90)

        return (
          <motion.span
            key={index}
            variants={charVariants}
            className="absolute flex items-center justify-center"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
              fontSize: `${fontSize}px`,
              transformOrigin: 'center'
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        )
      })}
    </motion.div>
  )
}

export default CircularText