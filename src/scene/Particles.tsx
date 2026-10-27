import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Vector3 } from 'three'
import { mulberry32 } from '../lib/random'
import { sharedUniforms } from './materials'

const BOX = 50

/**
 * Marine snow / plankton: a box of points that wraps around the camera in the shader, so a few
 * thousand particles fill the whole dive with no CPU work per frame.
 */
export function MarineSnow({ count = 1800 }: { count?: number }) {
  const geometry = useMemo(() => {
    const rnd = mulberry32(42)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = rnd() * BOX
      pos[i * 3 + 1] = rnd() * BOX
      pos[i * 3 + 2] = rnd() * BOX
      seed[i] = rnd()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    return g
  }, [count])

  const uniforms = useMemo(() => ({ uTime: sharedUniforms.uTime, uCam: { value: new Vector3() } }), [])
  useFrame(({ camera }) => uniforms.uCam.value.copy(camera.position))

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uCam;
          attribute float aSeed;
          varying float vAlpha;
          const float BOX = ${BOX.toFixed(1)};
          void main() {
            vec3 drift = vec3(sin(uTime * 0.1 + aSeed * 6.0) * 0.6, -uTime * (0.25 + aSeed * 0.35), cos(uTime * 0.08 + aSeed * 4.0) * 0.6);
            // wrap into a box centred on the camera
            vec3 p = mod(position + drift - uCam + BOX * 0.5, BOX) - BOX * 0.5 + uCam;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            float d = -mv.z;
            gl_PointSize = (1.0 + aSeed * 2.2) * (60.0 / max(d, 1.0));
            // fade at the box edge and very close to the lens
            vAlpha = smoothstep(BOX * 0.5, BOX * 0.25, d) * smoothstep(0.5, 3.0, d) * (0.35 + aSeed * 0.5);
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          void main() {
            float r = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, r) * vAlpha;
            gl_FragColor = vec4(vec3(0.85, 0.92, 0.9) * a, 1.0);
          }
        `}
      />
    </points>
  )
}

/** Bubbles rising from the whale and the city toward the surface; ring sprites with a wobble. */
export function Bubbles({ count = 140 }: { count?: number }) {
  const geometry = useMemo(() => {
    const rnd = mulberry32(77)
    const pos = new Float32Array(count * 3)
    const seed = new Float32Array(count)
    const sources: [number, number, number][] = [
      [3, -6, 4],
      [9, -22, -12],
      [-4, -46, -2],
      [0, -80, -44],
    ]
    for (let i = 0; i < count; i++) {
      const s = sources[i % sources.length]
      pos[i * 3] = s[0] + (rnd() - 0.5) * 6
      pos[i * 3 + 1] = s[1]
      pos[i * 3 + 2] = s[2] + (rnd() - 0.5) * 6
      seed[i] = rnd()
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new BufferAttribute(pos, 3))
    g.setAttribute('aSeed', new BufferAttribute(seed, 1))
    return g
  }, [count])

  const uniforms = useMemo(() => ({ uTime: sharedUniforms.uTime }), [])

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime;
          attribute float aSeed;
          varying float vAlpha;
          void main() {
            float rise = 18.0;
            float t = fract(uTime * (0.04 + aSeed * 0.05) + aSeed);
            vec3 p = position;
            p.y += t * rise;
            p.x += sin(uTime * 2.0 + aSeed * 30.0) * 0.25 * t;
            p.z += cos(uTime * 1.7 + aSeed * 20.0) * 0.25 * t;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = min((1.0 + aSeed * 2.5 + t * 1.5) * (60.0 / max(-mv.z, 1.0)), 14.0);
            vAlpha = smoothstep(0.0, 0.1, t) * smoothstep(1.0, 0.8, t) * step(p.y, -0.5);
          }
        `}
        fragmentShader={/* glsl */ `
          varying float vAlpha;
          void main() {
            float r = length(gl_PointCoord - 0.5);
            float ring = smoothstep(0.5, 0.42, r) * smoothstep(0.25, 0.4, r);
            float glint = smoothstep(0.12, 0.0, length(gl_PointCoord - vec2(0.35, 0.32)));
            float a = (ring * 0.45 + glint * 0.6) * vAlpha;
            gl_FragColor = vec4(vec3(0.75, 0.97, 1.0) * a, 1.0);
          }
        `}
      />
    </points>
  )
}
