import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, RoundedBox, Stars } from '@react-three/drei'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTheme } from '../hooks/useTheme'

function Shape({ position, color, kind, speed = 1 }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.x += delta * 0.2 * speed
    ref.current.rotation.y += delta * 0.3 * speed
  })
  return (
    <Float speed={speed * 2} rotationIntensity={0.6} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        {kind === 'knot' && <torusKnotGeometry args={[0.7, 0.22, 128, 16]} />}
        {kind === 'ico' && <icosahedronGeometry args={[0.9, 1]} />}
        {kind === 'octa' && <octahedronGeometry args={[0.8]} />}
        <MeshDistortMaterial color={color} distort={0.35} speed={2} roughness={0.2} metalness={0.6} />
      </mesh>
    </Float>
  )
}

function PointerRig() {
  useFrame(({ camera, pointer }) => {
    camera.position.x += (pointer.x * 1.2 - camera.position.x) * 0.05
    camera.position.y += (pointer.y * 0.8 - camera.position.y) * 0.05
    camera.lookAt(0, 0, 0)
  })
  return null
}

export function FloatingMeshBackground({ className = '' }) {
  const { theme } = useTheme()
  const { primary, accent } = theme.colors
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 7], fov: 50 }} dpr={[1, 1.5]} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.4} />
        <pointLight position={[-5, -3, 2]} intensity={1.2} color={accent} />
        <Stars radius={30} depth={30} count={900} factor={3} fade speed={1} />
        <Shape position={[-3.2, 1.2, -1]} color={primary} kind="knot" speed={0.8} />
        <Shape position={[3.4, -0.8, -1.5]} color={accent} kind="ico" speed={1.1} />
        <Shape position={[0.6, 2.2, -3]} color={primary} kind="octa" speed={0.6} />
        <Shape position={[-1.2, -2.2, -2]} color={accent} kind="octa" speed={0.9} />
        <PointerRig />
      </Canvas>
    </div>
  )
}

function TiltBox({ position, color }) {
  const ref = useRef(null)
  const [hover, setHover] = useState(false)
  useFrame(({ pointer }, delta) => {
    const mesh = ref.current
    if (!mesh) return
    const k = Math.min(1, delta * 6)
    const strength = hover ? 1 : 0.4
    mesh.rotation.y += (pointer.x * 0.7 * strength - mesh.rotation.y) * k
    mesh.rotation.x += (-pointer.y * 0.6 * strength - mesh.rotation.x) * k
    const target = hover ? 1.12 : 1
    mesh.scale.setScalar(mesh.scale.x + (target - mesh.scale.x) * Math.min(1, delta * 8))
  })
  return (
    <RoundedBox
      ref={ref}
      args={[1.5, 2.1, 0.18]}
      radius={0.12}
      smoothness={4}
      position={position}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <meshStandardMaterial color={color} metalness={0.5} roughness={0.25} />
    </RoundedBox>
  )
}

export default function ThreeDCards({ className = 'h-80 w-full' }) {
  const { theme } = useTheme()
  const { primary, accent } = theme.colors
  return (
    <div className={className}>
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[4, 4, 5]} intensity={1.6} />
        <pointLight position={[-4, -2, 3]} intensity={1.2} color={accent} />
        <TiltBox position={[-2.1, 0, 0]} color={primary} />
        <TiltBox position={[0, 0, 0]} color={accent} />
        <TiltBox position={[2.1, 0, 0]} color={primary} />
      </Canvas>
    </div>
  )
}

export function TiltCard({ children, className = '', intensity = 14 }) {
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const springX = useSpring(rx, { stiffness: 200, damping: 18 })
  const springY = useSpring(ry, { stiffness: 200, damping: 18 })
  const glareX = useTransform(springY, [-intensity, intensity], ['20%', '80%'])
  const glareY = useTransform(springX, [-intensity, intensity], ['80%', '20%'])

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    ry.set(px * intensity * 2)
    rx.set(-py * intensity * 2)
  }
  const onLeave = () => {
    rx.set(0)
    ry.set(0)
  }

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: springX, rotateY: springY, transformStyle: 'preserve-3d' }}
        className="relative h-full w-full rounded-2xl"
      >
        {children}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-40 mix-blend-overlay"
          style={{ background: 'radial-gradient(circle at var(--gx) var(--gy), rgba(255,255,255,0.7), transparent 55%)', '--gx': glareX, '--gy': glareY }}
        />
      </motion.div>
    </div>
  )
}
