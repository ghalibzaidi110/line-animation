import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function SnakeLine() {
  const lineRef = useRef<THREE.Line | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

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
    if (lineRef.current) {
      const headIndex = Math.floor(scrollProgress * fullPoints.length)
      const tailLength = 1000

      const tailIndex = Math.max(0, headIndex - tailLength)
      const visiblePoints = fullPoints.slice(tailIndex, headIndex)

      const geometry = new THREE.BufferGeometry().setFromPoints(visiblePoints)
      lineRef.current.geometry.dispose()
      lineRef.current.geometry = geometry
    }
  })

  // Initialize line once (with empty points)
  const initialGeometry = useMemo(() => {
    const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 0)]
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <primitive
      object={new THREE.Line(initialGeometry, new THREE.LineBasicMaterial({ color: 'black' }))}
      ref={lineRef}
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
