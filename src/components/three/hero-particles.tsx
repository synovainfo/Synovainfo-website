'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ── Initialization helper (runs once, outside render so React Compiler is happy) ──
const INIT = (() => {
  const count = 80
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 4 + Math.random() * 8

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = r * Math.cos(phi)
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const vel = new Float32Array(80 * 3)
  for (let i = 0; i < 80; i++) {
    vel[i * 3] = (Math.random() - 0.5) * 0.003
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.003
  }

  return { geometry: geo, velocities: vel }
})()

/**
 * Particle field — 80 subtle blue/white particles drifting slowly.
 * Extremely lightweight, no textures, no post-processing.
 */
function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null!)
  const mouseX = useRef(0)
  const mouseY = useRef(0)

  // Geometry and velocities are immutable refs (no re-render)
  const geometry = INIT.geometry
  const velocities = INIT.velocities

  // Track mouse for subtle parallax — mutating BufferAttribute is the standard Three.js
  // animation loop pattern. The eslint suppressions tell the React Compiler this is intentional.
  // eslint-disable-next-line react-hooks/immutability
  useFrame((state) => {
    const pos = geometry.attributes.position.array as Float32Array

    const mx = (state.pointer.x - mouseX.current) * 0.001
    const my = (state.pointer.y - mouseY.current) * 0.001
    mouseX.current = state.pointer.x
    mouseY.current = state.pointer.y

    for (let i = 0; i < pos.length; i += 3) {
      pos[i] += velocities[i] + mx
      pos[i + 1] += velocities[i + 1] + my
      pos[i + 2] += velocities[i + 2]

      if (Math.abs(pos[i]) > 12) velocities[i] *= -1
      if (Math.abs(pos[i + 1]) > 12) velocities[i + 1] *= -1
      if (Math.abs(pos[i + 2]) > 12) velocities[i + 2] *= -1
    }

    geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#2563EB"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * Hero background particles — rendered via @react-three/fiber Canvas.
 * Imported via next/dynamic with ssr:false in the hero section.
 */
export default function HeroParticles() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'low-power',
        }}
        style={{ background: 'transparent' }}
      >
        <ParticleField />
      </Canvas>
    </div>
  )
}
