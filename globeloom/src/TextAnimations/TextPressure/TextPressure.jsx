import React, { useRef, useEffect, useState, useCallback } from 'react'

const TextPressure = ({ 
  children, 
  className = '',
  maxPressure = 10,
  normalSize = 1,
  pressureMultiplier = 0.1
}) => {
  const canvasRef = useRef(null)
  const [size, setSize] = useState(normalSize)
  const text = children || 'Press Me!'

  const updateSize = useCallback((pressure) => {
    const newSize = normalSize + (pressure * pressureMultiplier)
    setSize(Math.min(newSize, normalSize + maxPressure * pressureMultiplier))
  }, [normalSize, pressureMultiplier, maxPressure])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handlePointerDown = (e) => {
      const pressure = e.pressure || 0.5
      updateSize(pressure * maxPressure)
    }

    const handlePointerMove = (e) => {
      if (e.buttons > 0) {
        const pressure = e.pressure || 0.5
        updateSize(pressure * maxPressure)
      }
    }

    const handlePointerUp = () => {
      setSize(normalSize)
    }

    canvas.addEventListener('pointerdown', handlePointerDown)
    canvas.addEventListener('pointermove', handlePointerMove)
    canvas.addEventListener('pointerup', handlePointerUp)
    canvas.addEventListener('pointerleave', handlePointerUp)

    return () => {
      canvas.removeEventListener('pointerdown', handlePointerDown)
      canvas.removeEventListener('pointermove', handlePointerMove)
      canvas.removeEventListener('pointerup', handlePointerUp)
      canvas.removeEventListener('pointerleave', handlePointerUp)
    }
  }, [updateSize, maxPressure, normalSize])

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer touch-none"
        style={{ 
          touchAction: 'none',
          WebkitTouchCallout: 'none',
          WebkitUserSelect: 'none',
          userSelect: 'none'
        }}
      />
      <div
        className="relative z-10 transition-transform duration-100 ease-out select-none pointer-events-none"
        style={{
          transform: `scale(${size})`,
          transformOrigin: 'center'
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default TextPressure