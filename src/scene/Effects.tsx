import { Uniform, Vector2, type WebGLRenderer, type WebGLRenderTarget } from 'three'
import { Effect } from 'postprocessing'
import { Bloom, DepthOfField, EffectComposer, wrapEffect } from '@react-three/postprocessing'
import { dive } from '../lib/dive'

// Screen-space water refraction: a gentle global wobble plus rings that spread from the cursor,
// strongest right after the pointer moves. Pure UV offset (mainUv), so it is cheap.
const rippleFrag = /* glsl */ `
uniform float uTime;
uniform vec2 uPointer;
uniform float uStrength;
uniform float uAspect;

void mainUv(inout vec2 uv) {
  vec2 d = uv - uPointer;
  d.x *= uAspect;
  float r = length(d);
  float ring = sin(r * 60.0 - uTime * 7.0) * exp(-r * 9.0) * uStrength;
  uv += normalize(d + 1e-5) * ring * 0.006;
  uv += vec2(sin(uv.y * 14.0 + uTime * 0.8), cos(uv.x * 12.0 + uTime * 0.6)) * 0.0009;
}
`

class RippleEffectImpl extends Effect {
  private last = new Vector2()
  private strength = 0

  constructor() {
    super('RippleEffect', rippleFrag, {
      uniforms: new Map<string, Uniform>([
        ['uTime', new Uniform(0)],
        ['uPointer', new Uniform(new Vector2(0.5, 0.5))],
        ['uStrength', new Uniform(0)],
        ['uAspect', new Uniform(1)],
      ]),
    })
  }

  update(_renderer: WebGLRenderer, input: WebGLRenderTarget, dt: number) {
    const px = dive.pointer.x * 0.5 + 0.5
    const py = dive.pointer.y * 0.5 + 0.5
    const moved = Math.hypot(px - this.last.x, py - this.last.y)
    this.last.set(px, py)
    // strength follows pointer speed, then decays
    this.strength = Math.min(1, this.strength * Math.exp(-dt * 2.2) + moved * 6)
    this.uniforms.get('uTime')!.value += dt
    ;(this.uniforms.get('uPointer')!.value as Vector2).set(px, py)
    this.uniforms.get('uStrength')!.value = this.strength
    this.uniforms.get('uAspect')!.value = input.width / Math.max(1, input.height)
  }
}

const Ripple = wrapEffect(RippleEffectImpl)

/** Only mounted on the high quality tier (see Experience). */
export function Effects() {
  return (
    <EffectComposer multisampling={0}>
      <Ripple />
      <DepthOfField worldFocusDistance={20} worldFocusRange={30} bokehScale={1.6} resolutionScale={0.5} />
      <Bloom mipmapBlur luminanceThreshold={0.78} luminanceSmoothing={0.2} intensity={0.4} radius={0.65} />
    </EffectComposer>
  )
}
