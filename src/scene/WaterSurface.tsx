import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, DoubleSide, Plane, Raycaster, ShaderMaterial, Vector2, Vector3 } from 'three'
import { dive } from '../lib/dive'
import { sharedUniforms } from './materials'
import { CAUSTIC_GLSL } from './shaders'

const RIPPLES = 6
const surface = new Plane(new Vector3(0, -1, 0), 0) // y = 0, facing down
const ray = new Raycaster()
const hit = new Vector3()
const ndc = new Vector2()

/**
 * The surface seen from below: a bright Snell's window above the camera, slow ripples, caustic
 * shimmer, and rings that spread from wherever the cursor touches the water.
 */
export function WaterSurface() {
  const mat = useRef<ShaderMaterial>(null)
  const next = useRef(0)
  const last = useRef(new Vector3(9999, 0, 9999))

  const uniforms = useMemo(
    () => ({
      uTime: sharedUniforms.uTime,
      uCam: { value: new Vector3() },
      // xy = position on the plane (x, z), z = birth time
      uRipples: { value: Array.from({ length: RIPPLES }, () => new Vector3(0, 0, -100)) },
    }),
    [],
  )

  useFrame(({ camera }) => {
    uniforms.uCam.value.copy(camera.position)
    // cursor ripples only matter while the surface is in view and motion is allowed
    if (dive.reducedMotion || camera.position.y < -30) return
    ndc.set(dive.pointer.x, dive.pointer.y)
    ray.setFromCamera(ndc, camera)
    if (!ray.ray.intersectPlane(surface, hit)) return
    if (hit.distanceTo(last.current) < 2.5) return
    last.current.copy(hit)
    const slot = uniforms.uRipples.value[next.current]
    slot.set(hit.x, hit.z, sharedUniforms.uTime.value)
    next.current = (next.current + 1) % RIPPLES
  })

  return (
    <mesh rotation-x={Math.PI / 2} position={[0, 0, -40]} renderOrder={-1}>
      <planeGeometry args={[420, 420, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        side={DoubleSide}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
        fog={false}
        vertexShader={/* glsl */ `
          varying vec3 vWorld;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorld = wp.xyz;
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          uniform vec3 uCam;
          uniform vec3 uRipples[${RIPPLES}];
          varying vec3 vWorld;
          ${CAUSTIC_GLSL}
          void main() {
            vec2 p = vWorld.xz;
            // slow interfering ripples
            float w = sin(p.x * 0.35 + uTime * 0.9) * sin(p.y * 0.28 - uTime * 0.7)
                    + 0.5 * sin((p.x + p.y) * 0.6 + uTime * 1.4);
            // cursor rings
            float ring = 0.0;
            for (int i = 0; i < ${RIPPLES}; i++) {
              float age = uTime - uRipples[i].z;
              if (age < 0.0 || age > 3.5) continue;
              float d = distance(p, uRipples[i].xy);
              float r = age * 6.0;
              ring += smoothstep(1.2, 0.0, abs(d - r)) * (1.0 - age / 3.5) * 0.9;
            }
            float shimmer = mrCaustic(p * 0.03, uTime * 0.3);
            // Snell's window: brightest straight above the viewer
            float d2 = distance(p, uCam.xz);
            float window = exp(-d2 * 0.018) * smoothstep(-45.0, -1.0, uCam.y);
            float dist = distance(vWorld, uCam);
            float fade = exp(-dist * 0.012);
            vec3 col = vec3(0.08, 0.26, 0.34) * (0.45 + 0.2 * w)
                     + vec3(0.45, 0.78, 0.86) * (window * 0.22 + shimmer * 0.2 + ring * 0.4);
            // stays well under the bloom threshold so the hero copy keeps its contrast
            gl_FragColor = vec4(min(col * fade, vec3(0.34)), 1.0);
          }
        `}
      />
    </mesh>
  )
}
