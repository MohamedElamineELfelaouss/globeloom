import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import { motion } from 'framer-motion'
import * as random from 'maath/random/dist/maath-random.esm'

// Optimized Floating Particles Background - Reduced particle count for better performance
function FloatingParticles(props) {
  const ref = useRef()
  const { size } = useThree()
  
  const [sphere] = useMemo(() => [random.inSphere(new Float32Array(1500), { radius: 1.2 })], [])
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20  // Slower rotation for better performance
      ref.current.rotation.y -= delta / 25
    }
  })
  
  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={true} {...props}>
        <PointMaterial
          transparent
          color="#8B5CF6"
          size={size.width / 1500}  // Smaller particles
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  )
}

// Premium Travel Route Lines Background
export function TravelRoutesBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <Canvas
        className="absolute inset-0"
        camera={{ position: [0, 0, 1] }}
        style={{ background: 'transparent' }}
      >
        <FloatingParticles />
      </Canvas>
    </div>
  )
}

// Premium Gradient Blob Background
export function GradientBlobBackground({ variant = 'purple' }) {
  const gradients = {
    purple: 'from-purple-600/20 via-pink-500/10 to-blue-500/20',
    travel: 'from-aurora-500/20 via-coral-500/10 to-gold-500/20',
    ocean: 'from-ocean-600/20 via-tropical-500/10 to-aurora-500/20',
    sunset: 'from-sunset-600/20 via-coral-500/10 to-gold-500/20'
  }

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient blobs */}
      <motion.div
        className={`absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br ${gradients[variant]} rounded-full blur-3xl`}
        animate={{
          scale: [1, 1.2, 1],
          x: [-20, 20, -20],
          y: [-10, 10, -10],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className={`absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br ${gradients[variant]} rounded-full blur-3xl`}
        animate={{
          scale: [1.2, 1, 1.2],
          x: [20, -20, 20],
          y: [10, -10, 10],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      
      <motion.div
        className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-br ${gradients[variant]} rounded-full blur-3xl opacity-30`}
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// Premium Grid Pattern Background
export function GridPatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-grid-white/[0.05] bg-[length:60px_60px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950" />
      </div>
    </div>
  )
}

// Premium Animated Mesh Background
export function AnimatedMeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="meshGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#EC4899" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="meshGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        
        <motion.path
          d="M0,100 Q200,50 400,100 T800,100 L800,0 L0,0 Z"
          fill="url(#meshGrad1)"
          animate={{
            d: [
              "M0,100 Q200,50 400,100 T800,100 L800,0 L0,0 Z",
              "M0,120 Q200,80 400,120 T800,120 L800,0 L0,0 Z",
              "M0,100 Q200,50 400,100 T800,100 L800,0 L0,0 Z"
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.path
          d="M1200,700 Q1000,750 800,700 T400,700 L400,800 L1200,800 Z"
          fill="url(#meshGrad2)"
          animate={{
            d: [
              "M1200,700 Q1000,750 800,700 T400,700 L400,800 L1200,800 Z",
              "M1200,680 Q1000,720 800,680 T400,680 L400,800 L1200,800 Z",
              "M1200,700 Q1000,750 800,700 T400,700 L400,800 L1200,800 Z"
            ]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </svg>
    </div>
  )
}

// Optimized Premium Floating Elements Background - Reduced animations
export function FloatingElementsBackground() {
  const elements = [
    { icon: '✈️', delay: 0, duration: 12 },  // Slower animations
    { icon: '🗺️', delay: 2, duration: 15 },
    { icon: '🎒', delay: 4, duration: 14 },
    { icon: '🏝️', delay: 6, duration: 16 },
  ]  // Reduced number of elements

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute text-2xl opacity-5"  // Reduced opacity
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-10, 10, -10],  // Reduced movement range
            x: [-5, 5, -5],
            rotate: [-2, 2, -2],  // Reduced rotation
            scale: [1, 1.05, 1],  // Reduced scale change
          }}
          transition={{
            duration: element.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: element.delay,
            repeatType: "reverse"  // More efficient repeat
          }}
        >
          {element.icon}
        </motion.div>
      ))}
    </div>
  )
}

// Combined Premium Background Component
export function PremiumBackground({ variant = 'travel', showParticles = true, showGrid = true, showFloatingElements = true }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <GradientBlobBackground variant={variant} />
      
      {/* Grid pattern */}
      {showGrid && <GridPatternBackground />}
      
      {/* Animated mesh */}
      <AnimatedMeshBackground />
      
      {/* 3D Particles */}
      {showParticles && <TravelRoutesBackground />}
      
      {/* Floating elements */}
      {showFloatingElements && <FloatingElementsBackground />}
      
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
    </div>
  )
}

export default PremiumBackground
