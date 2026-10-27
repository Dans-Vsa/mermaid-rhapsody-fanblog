import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Color, FogExp2 } from 'three'
import { dive } from '../lib/dive'
import { KEYFRAMES } from './keyframes'

const c = new Color()

/** Fog colour and density follow the depth; the clear colour matches so the horizon dissolves. */
export function Atmosphere() {
  const scene = useThree((s) => s.scene)
  const fog = useMemo(() => new FogExp2(KEYFRAMES[0].water.getHex(), KEYFRAMES[0].fog), [])
  const background = useMemo(() => new Color(KEYFRAMES[0].water), [])
  useEffect(() => {
    scene.fog = fog
    scene.background = background
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene, fog, background])

  useFrame(() => {
    const s = dive.section
    const i = Math.min(KEYFRAMES.length - 2, Math.floor(s))
    const f = s - i
    c.copy(KEYFRAMES[i].water).lerp(KEYFRAMES[i + 1].water, f)
    fog.color.copy(c)
    background.copy(c)
    fog.density = KEYFRAMES[i].fog + (KEYFRAMES[i + 1].fog - KEYFRAMES[i].fog) * f
  })

  return (
    <>
      <hemisphereLight args={['#9FEFFF', '#041C32', 1.1]} />
      <directionalLight position={[6, 30, 8]} intensity={1.6} color="#CFF7FF" />
    </>
  )
}
