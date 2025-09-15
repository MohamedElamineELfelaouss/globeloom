import React, { useRef, useState } from 'react'
import { motion } from 'framer-motion'

// React Bits inspired Premium Card Component
export const PremiumCard = ({ 
  children, 
  className = '', 
  glowEffect = true,
  magneticEffect = true,
  tiltEffect = true,
  ...props 
}) => {
  const cardRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    
    if (magneticEffect) {
      const deltaX = (e.clientX - centerX) * 0.1
      const deltaY = (e.clientY - centerY) * 0.1
      setPosition({ x: deltaX, y: deltaY })
    }
    
    if (tiltEffect) {
      const tiltX = ((e.clientY - centerY) / rect.height) * 15
      const tiltY = ((e.clientX - centerX) / rect.width) * -15
      setTilt({ x: tiltX, y: tiltY })
    }
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setPosition({ x: 0, y: 0 })
    setTilt({ x: 0, y: 0 })
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        x: position.x,
        y: position.y,
        rotateX: tilt.x,
        rotateY: tilt.y,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30
      }}
      className={`
        relative group transform-gpu perspective-1000
        ${glowEffect ? 'hover:shadow-2xl hover:shadow-purple-500/20' : ''}
        transition-all duration-300
        ${className}
      `}
      style={{ 
        transformStyle: 'preserve-3d',
        perspective: '1000px'
      }}
      {...props}
    >
      {/* Glow effect */}
      {glowEffect && (
        <div 
          className={`
            absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 
            rounded-xl blur-xl transition-opacity duration-300 -z-10
            ${isHovered ? 'opacity-100' : 'opacity-0'}
          `}
        />
      )}
      
      {/* Card content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
      
      {/* Shine effect */}
      <div 
        className={`
          absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent
          transform rotate-12 translate-x-full transition-transform duration-700
          ${isHovered ? '-translate-x-full' : 'translate-x-full'}
        `}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
          width: '100%',
          height: '100%',
          transform: 'skewX(20deg)'
        }}
      />
    </motion.div>
  )
}

// Animated Travel Destination Card
export const DestinationCard = ({ destination, className = '' }) => {
  const { name, image, rating, price, description, location } = destination

  return (
    <PremiumCard 
      className={`bg-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/20 ${className}`}
    >
      <motion.div 
        className="p-6"
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Destination Image/Icon */}
        <div className="text-6xl mb-4 text-center">
          {image}
        </div>
        
        {/* Destination Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          <p className="text-purple-300 text-sm mb-3">{location}</p>
          <p className="text-slate-300 text-sm mb-4 leading-relaxed">{description}</p>
          
          {/* Rating & Price */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-amber-400">★</span>
              <span className="text-white font-medium">{rating}</span>
            </div>
            <div className="text-gradient-premium font-bold text-lg">
              ${price}
            </div>
          </div>
        </div>
      </motion.div>
    </PremiumCard>
  )
}

export default PremiumCard
