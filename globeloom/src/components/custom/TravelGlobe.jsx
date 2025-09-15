import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.1
      meshRef.current.rotation.y = time * 0.2
    }
  })

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={2}>
      <MeshDistortMaterial
        color="#0f1419"
        attach="material"
        distort={0.3}
        speed={2}
        roughness={0}
        metalness={0.8}
      />
    </Sphere>
  )
}

function FloatingDestination({ position, delay = 0 }) {
  const meshRef = useRef()
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime() + delay
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(time) * 0.2
      meshRef.current.rotation.y = time * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="#ff6b6b"
        emissive="#ff6b6b"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function TravelGlobe() {
  const destinations = [
    [2.5, 0.5, 0],
    [-2.2, 1, 0.5],
    [0, 2.3, -1],
    [1.5, -1.8, 1],
    [-1, -2, -0.5],
    [2, 1.5, -1.2],
  ]

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
        
        <Globe />
        
        {destinations.map((pos, index) => (
          <FloatingDestination
            key={index}
            position={pos}
            delay={index * 0.5}
          />
        ))}
      </Canvas>
    </div>
  )
}

export default TravelGlobe
