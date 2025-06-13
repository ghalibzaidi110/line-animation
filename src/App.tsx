import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedLine() {
  const lineRef = useRef<THREE.Mesh>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (lineRef.current) {
      // Calculate the x position based on scroll progress
      const x = -10 + scrollProgress * 20 // Move from -10 to 10
      lineRef.current.position.x = x

      // Create a circle in the middle
      if (x > -5 && x < 5) {
        const radius = Math.abs(Math.sin(x * Math.PI / 5)) * 2
        lineRef.current.scale.y = radius
      } else {
        lineRef.current.scale.y = 0.1
      }
    }
  })

  return (
    <mesh ref={lineRef}>
      <planeGeometry args={[0.3, 1]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  )
}

function App() {
  return (
    <div style={{ 
      height: '200vh',
      width: '100vw',
      position: 'relative',
      background: 'white'
    }}>
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100vh',
        background: 'white'
      }}>
        <Canvas camera={{ position: [0, 0, 5] }}>
          <AnimatedLine />
        </Canvas>
      </div>
    </div>
  )
}

export default App 