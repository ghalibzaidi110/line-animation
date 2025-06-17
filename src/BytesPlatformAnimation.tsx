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
    return dimensions.width < 768 ? 0.08 : 0.15
  }, [dimensions.width])

  // Define separate curves for each letter
  const letterCurves = useMemo(() => {
    let scale = dimensions.width < 768 ? 0.8 : 2.5 // Much larger scale
    
    const letterSpacing = 1 * scale // Increased spacing
    const lineHeight = 6 * scale // Increased line height
    const startX = -7 * scale // Adjusted start position
    const startY = 0 * scale
    
    const letters: THREE.CatmullRomCurve3[] = []
    
    // "b" - first letter
    let x = startX
    let y = startY
    const bPoints: THREE.Vector3[] = []
    // Vertical line of b
    bPoints.push(new THREE.Vector3(x, y + 3, 0))
    bPoints.push(new THREE.Vector3(x, y + 2, 0))
    bPoints.push(new THREE.Vector3(x, y + 1, 0))
    bPoints.push(new THREE.Vector3(x, y, 0))
    bPoints.push(new THREE.Vector3(x, y - 1, 0))
    bPoints.push(new THREE.Vector3(x, y - 2, 0))
    bPoints.push(new THREE.Vector3(x, y - 3, 0))
    // Top curve of b
    bPoints.push(new THREE.Vector3(x + 0.2, y - 3, 0))
    bPoints.push(new THREE.Vector3(x + 1.2, y - 2.5, 0))
    bPoints.push(new THREE.Vector3(x + 1.2, y - 0.5, 0))
    bPoints.push(new THREE.Vector3(x + 0.2, y - 0, 0))
    // Bottom curve of b
    bPoints.push(new THREE.Vector3(x + 0.2, y + 0, 0))
    bPoints.push(new THREE.Vector3(x + 1.2, y + 0.5, 0))
    bPoints.push(new THREE.Vector3(x + 1.2, y + 2.5, 0))
    bPoints.push(new THREE.Vector3(x + 0.2, y + 3, 0))
    letters.push(new THREE.CatmullRomCurve3(bPoints))
    
    // "y" - second letter
    x += letterSpacing
    const yPoints: THREE.Vector3[] = []
    yPoints.push(new THREE.Vector3(x, y + 0, 0))
    yPoints.push(new THREE.Vector3(x + 0.2, y -3, 0))
    yPoints.push(new THREE.Vector3(x + 1.2, y - 3, 0))
    yPoints.push(new THREE.Vector3(x + 1.4, y + 0, 0))
    yPoints.push(new THREE.Vector3(x + 1.2, y - 6, 0))
    yPoints.push(new THREE.Vector3(x + 0.2, y - 6, 0))
    yPoints.push(new THREE.Vector3(x + 0, y - 4, 0))
    // // Move to start other side without connecting
    letters.push(new THREE.CatmullRomCurve3(yPoints))
    
    // "t" - third letter
    x += letterSpacing
    const t1Points: THREE.Vector3[] = []
    const t2Points: THREE.Vector3[] = []

    // Vertical line of t
    t1Points.push(new THREE.Vector3(x +0.6, y + 3, 0))
    t1Points.push(new THREE.Vector3(x +0.6, y + 2, 0))
    t1Points.push(new THREE.Vector3(x +0.6, y + 1, 0))
    t1Points.push(new THREE.Vector3(x +0.6, y - 1, 0))
    t1Points.push(new THREE.Vector3(x +0.6, y - 2, 0))
    t1Points.push(new THREE.Vector3(x +0.7, y - 3, 0))
    t1Points.push(new THREE.Vector3(x +1.2, y - 3, 0))
    t2Points.push(new THREE.Vector3(x +0.6, y, 0))
    t2Points.push(new THREE.Vector3(x +0, y, 0))
    t2Points.push(new THREE.Vector3(x +1.2, y, 0))
    t2Points.push(new THREE.Vector3(x +0.6, y, 0))
    
    
    // Break and start horizontal line
    letters.push(new THREE.CatmullRomCurve3(t2Points))
    letters.push(new THREE.CatmullRomCurve3(t1Points))
    
    // "e" - fourth letter
    x += letterSpacing
    const ePoints: THREE.Vector3[] = []
    ePoints.push(new THREE.Vector3(x + 0.1, y - 2, 0))
    ePoints.push(new THREE.Vector3(x + 1.2, y - 0.2, 0))
    ePoints.push(new THREE.Vector3(x + 0.1, y + 0, 0))
    ePoints.push(new THREE.Vector3(x + 0, y - 2, 0))
    ePoints.push(new THREE.Vector3(x + 0.1, y - 3, 0))
    ePoints.push(new THREE.Vector3(x + 1.2, y - 3, 0))
    ePoints.push(new THREE.Vector3(x + 1.2, y - 2, 0))
  
    letters.push(new THREE.CatmullRomCurve3(ePoints))
    
    // "s" - fifth letter
    x += letterSpacing
    const sPoints: THREE.Vector3[] = []
    sPoints.push(new THREE.Vector3(x + 1.2, y - 1.2, 0))
    sPoints.push(new THREE.Vector3(x + 1.2, y - 0.2, 0))
    sPoints.push(new THREE.Vector3(x + 0.1, y - 0.2, 0))
    sPoints.push(new THREE.Vector3(x + 0.1, y - 1.2, 0))
    sPoints.push(new THREE.Vector3(x + 0.6, y - 1.5, 0))
    sPoints.push(new THREE.Vector3(x + 1.2, y - 1.7, 0))
    sPoints.push(new THREE.Vector3(x + 1.2, y - 3, 0))
    sPoints.push(new THREE.Vector3(x + 0.2, y - 3, 0))
    sPoints.push(new THREE.Vector3(x + 0.1, y - 2, 0))
    // sPoints.push(new THREE.Vector3(x + 0.6, y - 0.2, 0))
    // sPoints.push(new THREE.Vector3(x + 0.2, y - 0.2, 0))
    // sPoints.push(new THREE.Vector3(x, y - 0.5, 0))
    // sPoints.push(new THREE.Vector3(x + 0.2, y - 1, 0))
    // sPoints.push(new THREE.Vector3(x + 0.6, y - 1, 0))
    // sPoints.push(new THREE.Vector3(x + 1, y - 0.5, 0))
    letters.push(new THREE.CatmullRomCurve3(sPoints))
    
    // Space before "platform"
    x += letterSpacing * 1.8
    
    // "p" - first letter of platform
    const pPoints: THREE.Vector3[] = []
    pPoints.push(new THREE.Vector3(x, y + 1, 0))
    pPoints.push(new THREE.Vector3(x, y, 0))
    pPoints.push(new THREE.Vector3(x, y - 1, 0))
    pPoints.push(new THREE.Vector3(x, y - 2, 0))
    pPoints.push(new THREE.Vector3(x, y - 3, 0))
    // Top part
    pPoints.push(new THREE.Vector3(x, y + 1, 0))
    pPoints.push(new THREE.Vector3(x + 0.4, y + 1, 0))
    pPoints.push(new THREE.Vector3(x + 0.8, y + 0.5, 0))
    pPoints.push(new THREE.Vector3(x + 0.8, y, 0))
    pPoints.push(new THREE.Vector3(x + 0.4, y, 0))
    pPoints.push(new THREE.Vector3(x, y, 0))
    letters.push(new THREE.CatmullRomCurve3(pPoints))
    
    // "l" - second letter
    x += letterSpacing
    const lPoints: THREE.Vector3[] = []
    lPoints.push(new THREE.Vector3(x, y + 3, 0))
    lPoints.push(new THREE.Vector3(x, y + 2, 0))
    lPoints.push(new THREE.Vector3(x, y + 1, 0))
    lPoints.push(new THREE.Vector3(x, y, 0))
    lPoints.push(new THREE.Vector3(x, y - 1, 0))
    lPoints.push(new THREE.Vector3(x, y - 2, 0))
    lPoints.push(new THREE.Vector3(x, y - 3, 0))
    letters.push(new THREE.CatmullRomCurve3(lPoints))
    
    // "a" - third letter
    x += letterSpacing
    const aPoints: THREE.Vector3[] = []
    aPoints.push(new THREE.Vector3(x, y - 1, 0))
    aPoints.push(new THREE.Vector3(x + 0.2, y - 0.5, 0))
    aPoints.push(new THREE.Vector3(x + 0.4, y, 0))
    aPoints.push(new THREE.Vector3(x + 0.6, y + 0.5, 0))
    aPoints.push(new THREE.Vector3(x + 0.8, y + 1, 0))
    aPoints.push(new THREE.Vector3(x + 1, y + 0.5, 0))
    aPoints.push(new THREE.Vector3(x + 1.2, y, 0))
    aPoints.push(new THREE.Vector3(x + 1.4, y - 0.5, 0))
    aPoints.push(new THREE.Vector3(x + 1.6, y - 1, 0))
    // Cross bar
    aPoints.push(new THREE.Vector3(x + 1.2, y, 0))
    aPoints.push(new THREE.Vector3(x + 0.8, y, 0))
    aPoints.push(new THREE.Vector3(x + 0.4, y, 0))
    letters.push(new THREE.CatmullRomCurve3(aPoints))
    
    // "t" - fourth letter
    x += letterSpacing
    const t3Points: THREE.Vector3[] = []
    t3Points.push(new THREE.Vector3(x + 0.5, y + 2, 0))
    t3Points.push(new THREE.Vector3(x + 0.5, y + 1, 0))
    t3Points.push(new THREE.Vector3(x + 0.5, y, 0))
    t3Points.push(new THREE.Vector3(x + 0.5, y - 1, 0))
    t3Points.push(new THREE.Vector3(x + 0.5, y - 2, 0))
    t3Points.push(new THREE.Vector3(x + 0.8, y - 2, 0))
    t3Points.push(new THREE.Vector3(x + 1, y - 1.8, 0))
    // Horizontal line
    t3Points.push(new THREE.Vector3(x + 0.5, y + 0.5, 0))
    t3Points.push(new THREE.Vector3(x, y + 0.5, 0))
    t3Points.push(new THREE.Vector3(x + 0.5, y + 0.5, 0))
    t3Points.push(new THREE.Vector3(x + 1, y + 0.5, 0))
    letters.push(new THREE.CatmullRomCurve3(t3Points))
    
    // "f" - fifth letter
    x += letterSpacing
    const fPoints: THREE.Vector3[] = []
    fPoints.push(new THREE.Vector3(x, y - 1, 0))
    fPoints.push(new THREE.Vector3(x, y, 0))
    fPoints.push(new THREE.Vector3(x, y + 1, 0))
    fPoints.push(new THREE.Vector3(x, y + 2, 0))
    fPoints.push(new THREE.Vector3(x, y + 3, 0))
    fPoints.push(new THREE.Vector3(x + 0.4, y + 3, 0))
    fPoints.push(new THREE.Vector3(x + 0.8, y + 3, 0))
    fPoints.push(new THREE.Vector3(x + 1, y + 3, 0))
    // Middle line
    fPoints.push(new THREE.Vector3(x, y + 1, 0))
    fPoints.push(new THREE.Vector3(x + 0.6, y + 1, 0))
    letters.push(new THREE.CatmullRomCurve3(fPoints))
    
    // "o" - sixth letter
    x += letterSpacing
    const oPoints: THREE.Vector3[] = []
    oPoints.push(new THREE.Vector3(x + 1, y, 0))
    oPoints.push(new THREE.Vector3(x + 0.8, y + 0.8, 0))
    oPoints.push(new THREE.Vector3(x + 0.4, y + 1, 0))
    oPoints.push(new THREE.Vector3(x, y + 0.8, 0))
    oPoints.push(new THREE.Vector3(x, y, 0))
    oPoints.push(new THREE.Vector3(x, y - 0.8, 0))
    oPoints.push(new THREE.Vector3(x + 0.4, y - 1, 0))
    oPoints.push(new THREE.Vector3(x + 0.8, y - 0.8, 0))
    oPoints.push(new THREE.Vector3(x + 1, y, 0))
    letters.push(new THREE.CatmullRomCurve3(oPoints))
    
    // "r" - seventh letter
    x += letterSpacing
    const rPoints: THREE.Vector3[] = []
    rPoints.push(new THREE.Vector3(x, y - 1, 0))
    rPoints.push(new THREE.Vector3(x, y, 0))
    rPoints.push(new THREE.Vector3(x, y + 1, 0))
    rPoints.push(new THREE.Vector3(x + 0.4, y + 1, 0))
    rPoints.push(new THREE.Vector3(x + 0.8, y + 0.5, 0))
    rPoints.push(new THREE.Vector3(x + 0.8, y, 0))
    rPoints.push(new THREE.Vector3(x + 0.4, y, 0))
    rPoints.push(new THREE.Vector3(x, y, 0))
    // Diagonal
    rPoints.push(new THREE.Vector3(x + 0.4, y, 0))
    rPoints.push(new THREE.Vector3(x + 0.8, y - 0.5, 0))
    rPoints.push(new THREE.Vector3(x + 1, y - 1, 0))
    letters.push(new THREE.CatmullRomCurve3(rPoints))
    
    // "m" - eighth letter
    x += letterSpacing
    const mPoints: THREE.Vector3[] = []
    mPoints.push(new THREE.Vector3(x, y - 1, 0))
    mPoints.push(new THREE.Vector3(x, y, 0))
    mPoints.push(new THREE.Vector3(x, y + 1, 0))
    mPoints.push(new THREE.Vector3(x + 0.4, y + 0.5, 0))
    mPoints.push(new THREE.Vector3(x + 0.8, y + 1, 0))
    mPoints.push(new THREE.Vector3(x + 1.2, y + 0.5, 0))
    mPoints.push(new THREE.Vector3(x + 1.6, y + 1, 0))
    mPoints.push(new THREE.Vector3(x + 1.6, y, 0))
    mPoints.push(new THREE.Vector3(x + 1.6, y - 1, 0))
    // Middle stem
    mPoints.push(new THREE.Vector3(x + 1.6, y, 0))
    mPoints.push(new THREE.Vector3(x + 1.2, y + 0.2, 0))
    mPoints.push(new THREE.Vector3(x + 0.8, y, 0))
    mPoints.push(new THREE.Vector3(x + 0.8, y - 1, 0))
    letters.push(new THREE.CatmullRomCurve3(mPoints))
    
    return letters
  }, [dimensions.width])

  // Pre-compute all points for each letter
  const allLetterPoints = useMemo(() => {
    return letterCurves.map(curve => curve.getPoints(50))
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
    const smoothingFactor = 0.3
    setScrollProgress(prev => prev + (targetProgress - prev) * smoothingFactor)

    const totalLetters = letterCurves.length
    const lettersToShow = Math.floor(scrollProgress * totalLetters * 1.2) // Show letters progressively

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
            const tubeGeometry = new THREE.TubeGeometry(visibleCurve, Math.max(2, visiblePoints.length), tubeRadius, 16, false)
            
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
    return new THREE.TubeGeometry(emptyCurve, 2, tubeRadius, 16, false)
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

function BytesPlatformAnimation() {
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

export default BytesPlatformAnimation