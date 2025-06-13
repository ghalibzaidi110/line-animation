import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SnakeLine() {
  const tubeRef = useRef<THREE.Mesh | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const tubeRadius = 0.2 // Adjust this value to change the thickness of the line

  // Define the curvy path
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(-10, 6, 0),
            new THREE.Vector3(-2.5, 6, 0),
            new THREE.Vector3(1, 4.75, 0),
            new THREE.Vector3(2.5, 3.5, 0),
            new THREE.Vector3(3, 1.5, 0),
            new THREE.Vector3(1.5,-1.5, 0),
            new THREE.Vector3(-1.5, -2, 0),
            new THREE.Vector3(-4, 0, 0),
            new THREE.Vector3(-4.45, 1.5, 0),
            new THREE.Vector3(-4.45, 2.1, 0),
            new THREE.Vector3(-4.2, 3, 0),
            new THREE.Vector3(-3, 4, 0),
            new THREE.Vector3(-1, 4.7, 0),
            new THREE.Vector3(1, 4.7, 0),
            new THREE.Vector3(3, 4, 0),
            new THREE.Vector3(4, 3, 0),
            new THREE.Vector3(6.5, -5, 0),
            new THREE.Vector3(10, -5.5, 0)
          ]
    )
  }, [])

  // Pre-compute all points on the curve
  const fullPoints = useMemo(() => curve.getPoints(200), [curve])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (tubeRef.current) {
      const headIndex = Math.floor(scrollProgress * fullPoints.length)
      const tailLength = 1000

      const tailIndex = Math.max(0, headIndex - tailLength)
      const visiblePoints = fullPoints.slice(tailIndex, headIndex)

      // Create a new curve from the visible points
      const visibleCurve = new THREE.CatmullRomCurve3(visiblePoints)
      
      // Create a new tube geometry
      const tubeGeometry = new THREE.TubeGeometry(visibleCurve, 64, tubeRadius, 8, false)
      
      // Update the mesh
      tubeRef.current.geometry.dispose()
      tubeRef.current.geometry = tubeGeometry
    }
  })

  // Initialize tube once (with empty points)
  const initialGeometry = useMemo(() => {
    const emptyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ])
    return new THREE.TubeGeometry(emptyCurve, 1, tubeRadius, 8, false)
  }, [])

  return (
    <mesh
      ref={tubeRef}
      geometry={initialGeometry}
      material={new THREE.MeshBasicMaterial({ color: 'black' })}
    />
  )
}

function App() {
  return (
    <div style={{ height: '200vh', width: '100vw', background: 'white' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }}>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <SnakeLine />
        </Canvas>
      </div>
    </div>
  )
}

export default App
