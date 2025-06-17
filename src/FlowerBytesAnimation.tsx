import React, { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer, Bloom } from '@react-three/postprocessing'

function TextLine() {
  const tubeRefs = useRef<(THREE.Mesh | null)[]>([])
  const sphereRefs = useRef<(THREE.Mesh | null)[]>([])
  const [scrollProgress, setScrollProgress] = useState(0)
  const [targetProgress, setTargetProgress] = useState(0)
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Calculate responsive values
  const tubeRadius = useMemo(() => {
    return dimensions.width < 768 ? 0.20 : 0.4 // Increased from 0.15/0.3 to 0.25/0.5 for thicker lines
  }, [dimensions.width])

  // Define separate curves for each letter
  const letterCurves = useMemo(() => {
    let scale = dimensions.width < 768 ? 0.8 : 2.5 // Much larger scale
    
    const letterSpacing = 1 * scale // Increased spacing
    const lineHeight = 6 * scale // Increased line height
    const startX = 0 * scale // Adjusted start position
    const startY = 0 * scale
    
    const letters: THREE.CatmullRomCurve3[] = []
    
    // "b" - first letter
    let x = startX
    let y = startY
    const Points: THREE.Vector3[] = []
    // circle before b
    Points.push(new THREE.Vector3((x - 20) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 7) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.5) * scale, (y + 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 6) * scale, (y + 2.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.5) * scale, (y + 3.75) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.9) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 7.8) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 9.1) * scale, (y + 2.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 9.5) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 8.8) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 7.4) * scale, (y - 0.9) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.4) * scale, (y - 0.6) * scale, 0))
    // b line
    Points.push(new THREE.Vector3((x - 6) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 4.5) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 4) * scale, (y + 5) * scale, 0))
    // b upper part
    Points.push(new THREE.Vector3((x - 3.1) * scale, (y + 5.3) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3) * scale, (y + 5.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 4.9) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.4) * scale, (y + 4.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 4.1) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3) * scale, (y + 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y + 3.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 5.1) * scale, (y + 2.6) * scale, 0))
    // b lower part
    Points.push(new THREE.Vector3((x - 4) * scale, (y + 2.7) * scale, 0))
    // Points.push(new THREE.Vector3((x - 3.8) * scale, (y + 2.72) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.7) * scale, (y + 2.65) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y + 1.2) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2.6) * scale, (y + 1.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.55) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 3) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 4) * scale, (y - 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 5.5) * scale, (y - 1.5) * scale, 0))
    // b lower round
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y - 1) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.8) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 6.6) * scale, (y + 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 5) * scale, (y + 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 4.2) * scale, (y + 0.3) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.4) * scale, (y - 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.5) * scale, (y - 1) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2) * scale, (y - 0.1) * scale, 0))
    
    // y upper part
    Points.push(new THREE.Vector3((x - 1.8) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.4) * scale, (y + 1.2) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.7) * scale, (y - 0) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.6) * scale, (y - 0.9) * scale, 0))
    // Points.push(new THREE.Vector3((x - 1.5) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.1) * scale, (y - 0.9) * scale, 0))
    // Points.push(new THREE.Vector3((x - 0.9) * scale, (y + 0.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 0.2) * scale, (y + 1.2) * scale, 0))
    
    //y lower part
    Points.push(new THREE.Vector3((x - 1) * scale, (y - 1.1) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.5) * scale, (y - 3) * scale, 0))
    Points.push(new THREE.Vector3((x - 1.9) * scale, (y - 4) * scale, 0))
    // Points.push(new THREE.Vector3((x - 2) * scale, (y - 4) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y - 5) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y - 4.8) * scale, 0))
    Points.push(new THREE.Vector3((x - 3.5) * scale, (y - 3.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 2.8) * scale, (y - 2.5) * scale, 0))
    Points.push(new THREE.Vector3((x - 1) * scale, (y - 1.5) * scale, 0))

    // t line
    Points.push(new THREE.Vector3((x + 0.1) * scale, (y - 0.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.6) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 1) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2) * scale, (y + 4.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 1.2) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.9) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 0.75) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 1) * scale, (y - 0.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 1.5) * scale, (y - 0.8) * scale, 0))

    // e line part
    Points.push(new THREE.Vector3((x + 1.9) * scale, (y - 0.5) * scale, 0))
    Points.push(new THREE.Vector3((x + 3) * scale, (y + 0.7) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.4) * scale, (y + 1.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.5) * scale, (y + 2) * scale, 0))
    // Points.push(new THREE.Vector3((x + 3.45) * scale, (y + 2.35) * scale, 0))
    // e curve part
    Points.push(new THREE.Vector3((x + 3.4) * scale, (y + 2.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.9) * scale, (y + 2) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.4) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.3) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 2.5) * scale, (y - 0.7) * scale, 0))
    Points.push(new THREE.Vector3((x + 3.1) * scale, (y - 0.6) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.3) * scale, (y + 1) * scale, 0))

    // s part
    Points.push(new THREE.Vector3((x + 4.9) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.4) * scale, (y + 2.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 2.45) * scale, 0))
    Points.push(new THREE.Vector3((x + 6) * scale, (y + 2.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.8) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 6) * scale, (y + 2.1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 2.45) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.4) * scale, (y + 2.4) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.1) * scale, (y + 1.8) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.5) * scale, (y + 1.5) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.85) * scale, (y + 1) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.9) * scale, (y + 0.3) * scale, 0))
    Points.push(new THREE.Vector3((x + 5.2) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.8) * scale, (y - 0.2) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.4) * scale, (y + 0) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.43) * scale, (y + 0.6) * scale, 0))
    Points.push(new THREE.Vector3((x + 4.75) * scale, (y + 1) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(Points))
    
    const dPoints: THREE.Vector3[] = []
    dPoints.push(new THREE.Vector3((x + 6.9) * scale, (y + 0) * scale, 0))
    dPoints.push(new THREE.Vector3((x + 7) * scale, (y + 0.1) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(dPoints))
    
    const tPoints: THREE.Vector3[] = []
    tPoints.push(new THREE.Vector3((x + 0.5) * scale, (y + 3.5) * scale, 0))
    tPoints.push(new THREE.Vector3((x + 25.5) * scale, (y + 3.5) * scale, 0))
    
    letters.push(new THREE.CatmullRomCurve3(tPoints))
    
    return letters
  }, [dimensions.width])

  // Pre-compute all points for each letter
  const allLetterPoints = useMemo(() => {
    return letterCurves.map(curve => curve.getPoints(600)) // Increased from 200 to 300 points for even smoother curves
  }, [letterCurves])

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
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      
      const buffer = 5
      const adjustedScroll = Math.max(0, currentScroll - buffer)
      const progress = Math.min(Math.max(adjustedScroll / scrollHeight, 0), 1)
      
      if (currentScroll <= buffer) {
        setTargetProgress(0)
      } else {
        setTargetProgress(progress)
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useFrame((state, delta) => {
    const smoothingFactor = 0.5 // Reduced from 0.1 to 0.08 for even smoother transitions
    setScrollProgress(prev => prev + (targetProgress - prev) * smoothingFactor)

    const totalLetters = letterCurves.length
    const lettersToShow = Math.floor(scrollProgress * totalLetters * 1.1) // 1.2 Show letters progressively

    letterCurves.forEach((curve, letterIndex) => {
      const tubeRef = tubeRefs.current[letterIndex]
      const sphereRef = sphereRefs.current[letterIndex]
      
      if (tubeRef && sphereRef) {
        if (letterIndex <= lettersToShow) {
          // Calculate progress within this letter
          const letterProgress = Math.max(0, Math.min(1, 
            (scrollProgress * totalLetters * 1.2) - letterIndex
          ))
          
          const letterPoints = allLetterPoints[letterIndex]
          const visiblePointCount = Math.floor(letterProgress * letterPoints.length)
          const visiblePoints = letterPoints.slice(0, Math.max(2, visiblePointCount))

          if (visiblePoints.length >= 2) {
            const visibleCurve = new THREE.CatmullRomCurve3(visiblePoints)
            const tubeGeometry = new THREE.TubeGeometry(visibleCurve, Math.max(2, visiblePoints.length), tubeRadius, 64, false) // Increased segments from 32 to 64
            
            tubeRef.geometry.dispose()
            tubeRef.geometry = tubeGeometry
            tubeRef.visible = true

            const headPosition = visiblePoints[visiblePoints.length - 1]
            sphereRef.position.copy(headPosition)
            sphereRef.visible = letterProgress > 0.1
          }
        } else {
          tubeRef.visible = false
          sphereRef.visible = false
        }
      }
    })
  })

  // Initialize empty geometries for each letter
  const initialGeometry = useMemo(() => {
    const emptyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0)
    ])
    return new THREE.TubeGeometry(emptyCurve, 2, tubeRadius, 64, false) // Increased segments from 32 to 64
  }, [tubeRadius])

  return (
    <>
      {letterCurves.map((_, index) => (
        <React.Fragment key={`letter-${index}`}>
          <mesh
            ref={(ref) => { tubeRefs.current[index] = ref }}
            geometry={initialGeometry.clone()}
            material={new THREE.MeshBasicMaterial({ color: '#00b7ca' })}
            visible={false}
          />
          <mesh
            ref={(ref) => { sphereRefs.current[index] = ref }}
            position={[0, 0, 0]}
            visible={false}
          >
            <sphereGeometry args={[tubeRadius * 1.5, 16, 16]} />
            <meshBasicMaterial color="#00b7ca" />
          </mesh>
        </React.Fragment>
      ))}
    </>
  )
}

function FlowerBytesAnimation() {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100%', 
      height: '100vh', 
      zIndex: -1,
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 25] }}>
        <TextLine />
        <EffectComposer>
          <Bloom 
            intensity={2.5} 
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
      
      {/* Scrollable content to demonstrate the animation */}
      <div style={{
        position: 'absolute',
        top: '100vh',
        left: 0,
        right: 0,
        height: '300vh',
        background: 'transparent',
        pointerEvents: 'none'
      }}>
        <div style={{
          padding: '2rem',
          color: '#00b7ca',
          fontSize: '1.2rem',
          textAlign: 'center',
          pointerEvents: 'all'
        }}>
          <h2 style={{ marginBottom: '2rem' }}>Scroll to see each letter animate separately</h2>
          <p style={{ marginBottom: '2rem' }}>
            Each letter in "bytes platform" will draw itself individually as you scroll.
          </p>
          <div style={{ height: '50rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Keep scrolling to see each letter...</p>
          </div>
          <div style={{ height: '50rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Letters appear one by one</p>
          </div>
          <div style={{ height: '50rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>Almost there...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowerBytesAnimation