import React from 'react'
import { motion } from 'framer-motion'

const BlurText = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 1,
  stagger = 0.02,
  blurAmount = 10
}) => {
  const text = children || ''
  const words = text.split(' ')

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay,
        staggerChildren: stagger,
        duration: duration * 0.3
      }
    }
  }

  const wordVariants = {
    hidden: { 
      opacity: 0, 
      filter: `blur(${blurAmount}px)`,
      y: 20
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        duration,
        ease: [0.23, 1, 0.32, 1]
      }
    }
  }

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          className="inline-block mr-2"
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  )
}

export default BlurText