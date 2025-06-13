import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

function SnakeLine() {
  const tubeRef = useRef<THREE.Mesh | null>(null)
  const sphereRef = useRef<THREE.Mesh | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Calculate responsive values
  const tubeRadius = useMemo(() => {
    return dimensions.width < 768 ? 0.05 : 0.2
  }, [dimensions.width])

  // Define the curvy path with responsive points
  const curve = useMemo(() => {
    let scale, startX, endX;
    
    if (dimensions.width < 768) {
      // Mobile scaling (keep current behavior)
      const minWidth = 320
      const maxWidth = 768
      scale = Math.max(0.2, Math.min(1, (dimensions.width - minWidth) / (maxWidth - minWidth)))
      startX = -25 * scale
      endX = 20 * scale
    } else {
      // Desktop scaling (fixed values)
      scale = 1
      startX = -25
      endX = 20
    }
    
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(startX, 6 * scale, 0),
        new THREE.Vector3(-7.5 * scale, 6 * scale, 0),
        new THREE.Vector3(-4 * scale, 4.75 * scale, 0),
        new THREE.Vector3(-2.5 * scale, 3.5 * scale, 0),
        new THREE.Vector3(-2 * scale, 1.5 * scale, 0),
        new THREE.Vector3(-3.5 * scale, -1.5 * scale, 0),
        new THREE.Vector3(-6.5 * scale, -2 * scale, 0),
        new THREE.Vector3(-9 * scale, 0, 0),
        new THREE.Vector3(-9.45 * scale, 1.5 * scale, 0),
        new THREE.Vector3(-9.45 * scale, 2.1 * scale, 0),
        new THREE.Vector3(-9.2 * scale, 3 * scale, 0),
        new THREE.Vector3(-8 * scale, 4 * scale, 0),
        new THREE.Vector3(-6 * scale, 4.7 * scale, 0),
        new THREE.Vector3(-4 * scale, 4.7 * scale, 0),
        new THREE.Vector3(-2 * scale, 4 * scale, 0),
        new THREE.Vector3(-1 * scale, 3 * scale, 0),
        new THREE.Vector3(1.5 * scale, -5 * scale, 0),
        new THREE.Vector3(endX, -5.5 * scale, 0)
      ]
    )
  }, [dimensions.width])

  // Pre-compute all points on the curve
  const fullPoints = useMemo(() => curve.getPoints(200), [curve])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      setScrollProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame(() => {
    if (tubeRef.current && sphereRef.current) {
      const headIndex = Math.floor(scrollProgress * fullPoints.length)
      const tailLength = 1000

      const tailIndex = Math.max(0, headIndex - tailLength)
      const visiblePoints = fullPoints.slice(tailIndex, headIndex)

      // Create a new curve from the visible points
      const visibleCurve = new THREE.CatmullRomCurve3(visiblePoints)
      
      // Create a new tube geometry
      const tubeGeometry = new THREE.TubeGeometry(visibleCurve, 256, tubeRadius, 32, false)
      
      // Update the mesh
      tubeRef.current.geometry.dispose()
      tubeRef.current.geometry = tubeGeometry

      // Update sphere position to follow the head
      if (visiblePoints.length > 0) {
        const headPosition = visiblePoints[visiblePoints.length - 1]
        sphereRef.current.position.copy(headPosition)
      }
    }
  })

  // Initialize tube once (with empty points)
  const initialGeometry = useMemo(() => {
    const emptyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ])
    return new THREE.TubeGeometry(emptyCurve, 256, tubeRadius, 32, false)
  }, [])

  return (
    <>
      <mesh
        ref={tubeRef}
        geometry={initialGeometry}
        material={new THREE.MeshBasicMaterial({ color: '#00b7ca' })}
      />
      <mesh
        ref={sphereRef}
        position={[0, 0, 0]}
      >
        <sphereGeometry args={[tubeRadius, 32, 32]} />
        <meshBasicMaterial color="#00b7ca" />
      </mesh>
    </>
  )
}

function App() {
  return (
    <div style={{ height: '200vh', width: '100vw', background: 'white' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }}>
        <Canvas camera={{ position: [0, 0, 10] }}>
          <SnakeLine />
          <EffectComposer>
            <Bloom 
              intensity={3.0} 
              luminanceThreshold={0.1}
              luminanceSmoothing={0.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}

export default App
