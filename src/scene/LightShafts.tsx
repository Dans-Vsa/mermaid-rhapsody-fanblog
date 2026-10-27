import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, Group, Vector3 } from 'three'
import { mulberry32 } from '../lib/random'
import { sharedUniforms } from './materials'

/**
 * God rays: tall additive ribbons hanging from the surface, slowly breathing. They turn to face the
 * camera around Y and fade out as the dive goes deeper, so they cost almost nothing below the city.
 */
export function LightShafts({ count = 12 }: { count?: number }) {
  const group = useRef<Group>(null)
  const shafts = useMemo(() => {
    const rnd = mulberry32(9)
    return Array.from({ length: count }, (_, i) => ({
      pos: new Vector3((rnd() - 0.5) * 70, -32, -10 - rnd() * 60),
      width: 3 + rnd() * 7,
      tilt: (rnd() - 0.5) * 0.35,
      seed: i * 1.7,
    }))
  }, [count])

  const uniforms = useMemo(() => ({ uTime: sharedUniforms.uTime, uCamY: { value: 0 } }), [])

  useFrame(({ camera }) => {
    uniforms.uCamY.value = camera.position.y
    const g = group.current
    if (!g) return
    g.visible = camera.position.y > -75
    for (const child of g.children) {
      // billboard around the vertical axis
      child.rotation.y = Math.atan2(camera.position.x - child.position.x, camera.position.z - child.position.z)
    }
  })

  return (
    <group ref={group}>
      {shafts.map((s, i) => (
        <mesh key={i} position={s.pos} rotation-z={s.tilt} renderOrder={1}>
          <planeGeometry args={[s.width, 64, 1, 1]} />
          <shaderMaterial
            uniforms={{ ...uniforms, uSeed: { value: s.seed } }}
            transparent
            depthWrite={false}
            blending={AdditiveBlending}
            side={DoubleSide}
            fog={false}
            vertexShader={/* glsl */ `
              varying vec2 vUv;
              void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
            `}
            fragmentShader={/* glsl */ `
              uniform float uTime;
              uniform float uCamY;
              uniform float uSeed;
              varying vec2 vUv;
              void main() {
                float edge = smoothstep(0.0, 0.5, vUv.x) * smoothstep(1.0, 0.5, vUv.x);
                float fall = pow(vUv.y, 1.6);                 // strongest near the surface
                float breathe = 0.6 + 0.4 * sin(uTime * 0.35 + uSeed);
                float streak = 0.75 + 0.25 * sin(vUv.x * 18.0 + uSeed + uTime * 0.2);
                float depth = smoothstep(-75.0, -8.0, uCamY);  // vanish deeper down
                float a = edge * edge * fall * breathe * streak * depth * 0.16;
                gl_FragColor = vec4(vec3(0.62, 0.94, 1.0) * a, 1.0);
              }
            `}
          />
        </mesh>
      ))}
    </group>
  )
}
