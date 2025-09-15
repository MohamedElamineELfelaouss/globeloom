import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function EliteParticles({ count = 8000 }) {
  const mesh = useRef()
  
  // Generate premium particle positions with layered distribution
  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      
      // Create layered particle distribution for depth
      const layer = Math.floor(Math.random() * 4)
      let radius
      
      switch(layer) {
        case 0: radius = 2 + Math.random() * 2; break  // Inner aurora layer
        case 1: radius = 4 + Math.random() * 3; break  // Platinum layer
        case 2: radius = 7 + Math.random() * 4; break  // Gold layer
        default: radius = 11 + Math.random() * 6; break // Outer space layer
      }
      
      temp[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      temp[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      temp[i * 3 + 2] = radius * Math.cos(phi)
    }
    return temp
  }, [count])

  // Elite particle animation with sophisticated motion
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (mesh.current) {
      // Multi-layered rotation for depth effect
      mesh.current.rotation.x = time * 0.08
      mesh.current.rotation.y = time * 0.12
      mesh.current.rotation.z = Math.sin(time * 0.05) * 0.1
    }
  })

  return (
    <Points ref={mesh} positions={particles} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#0ea5e9" // Aurora blue for premium feel
        size={0.008}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.8}
      />
    </Points>
  )
}

function PremiumTravelRoutes() {
  const routesRef = useRef()
  
  // Create elite travel route network with sophisticated paths
  const routes = useMemo(() => {
    const curves = []
    const numRoutes = 35 // Increased for richer network
    
    for (let i = 0; i < numRoutes; i++) {
      // Create more sophisticated route patterns
      const startRadius = 2 + Math.random() * 3
      const endRadius = 2 + Math.random() * 3
      const startAngle = Math.random() * Math.PI * 2
      const endAngle = Math.random() * Math.PI * 2
      
      const start = new THREE.Vector3(
        startRadius * Math.cos(startAngle),
        (Math.random() - 0.5) * 6,
        startRadius * Math.sin(startAngle)
      )
      const end = new THREE.Vector3(
        endRadius * Math.cos(endAngle),
        (Math.random() - 0.5) * 6,
        endRadius * Math.sin(endAngle)
      )
      
      // Create more elegant curve control points
      const middle1 = new THREE.Vector3().lerpVectors(start, end, 0.33)
      const middle2 = new THREE.Vector3().lerpVectors(start, end, 0.66)
      
      // Add elevation variation for more dynamic paths
      middle1.y += (Math.random() - 0.5) * 4
      middle2.y += (Math.random() - 0.5) * 4
      middle1.multiplyScalar(1.5 + Math.random() * 0.5)
      middle2.multiplyScalar(1.5 + Math.random() * 0.5)
      
      // Create smooth cubic bezier curves for premium feel
      curves.push(new THREE.CubicBezierCurve3(start, middle1, middle2, end))
    }
    return curves
  }, [])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (routesRef.current) {
      // Sophisticated multi-axis rotation
      routesRef.current.rotation.y = time * 0.08
      routesRef.current.rotation.x = Math.sin(time * 0.03) * 0.1
    }
  })

  return (
    <group ref={routesRef}>
      {routes.map((curve, index) => {
        const points = curve.getPoints(80) // Higher resolution for smoother lines
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        
        // Color variation for premium effect
        const colorOptions = ['#0ea5e9', '#f59e0b', '#e5e7eb'] // Aurora, Gold, Platinum
        const color = colorOptions[index % colorOptions.length]
        
        return (
          <line key={index} geometry={geometry}>
            <lineBasicMaterial
              color={color}
              transparent
              opacity={0.4 + Math.sin(index * 0.1) * 0.2} // Dynamic opacity
              linewidth={1.5}
            />
          </line>
        )
      })}
    </group>
  )
}

function ParticleSystem() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 65 }}
        style={{ background: 'transparent' }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        {/* Enhanced lighting for premium feel */}
        <ambientLight intensity={0.3} color="#0ea5e9" />
        <pointLight position={[15, 15, 15]} intensity={0.8} color="#f59e0b" />
        <pointLight position={[-10, -10, 10]} intensity={0.6} color="#e5e7eb" />
        <spotLight 
          position={[0, 20, 0]} 
          intensity={0.5} 
          angle={0.3} 
          penumbra={0.5}
          color="#0ea5e9"
        />
        
        {/* Premium particle system */}
        <EliteParticles count={6000} />
        <PremiumTravelRoutes />
        
        {/* Additional ambient particles for depth */}
        <fog attach="fog" args={['#020617', 10, 50]} />
      </Canvas>
    </div>
  )
}

export default ParticleSystem
