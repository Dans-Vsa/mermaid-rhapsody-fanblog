import { Color, DataTexture, MeshToonMaterial, NearestFilter, RedFormat, type WebGLProgramParametersWithUniforms } from 'three'

// One look for every asset: flat-ish toon steps from the vertex colours + a cyan rim light, so the
// models read as painted shapes against the fog (DESIGN.md: stylized, not realistic).

/** Shared clock for every deforming shader. Advanced once per frame in Experience. */
export const sharedUniforms = { uTime: { value: 0 } }

let gradient: DataTexture | null = null
function toonGradient() {
  if (!gradient) {
    // three bands: shadow, mid, lit
    gradient = new DataTexture(new Uint8Array([90, 170, 255]), 3, 1, RedFormat)
    gradient.minFilter = NearestFilter
    gradient.magFilter = NearestFilter
    gradient.generateMipmaps = false
    gradient.needsUpdate = true
  }
  return gradient
}

export type Deform = 'none' | 'whale' | 'mermaid' | 'seaweed'

// Local-space vertex deformations (glTF is Y up; the whale's head is +X, the mermaid faces +X).
const DEFORM: Record<Exclude<Deform, 'none'>, string> = {
  // flukes beat up and down, growing toward the tail
  whale: /* glsl */ `
    float w = smoothstep(2.0, -9.5, transformed.x);
    transformed.y += sin(uTime * 1.1 - transformed.x * 0.32) * 0.9 * w * w;
  `,
  // tail undulates front to back below the waist
  mermaid: /* glsl */ `
    float m = smoothstep(0.0, -2.3, transformed.y);
    transformed.x += sin(uTime * 2.0 + transformed.y * 2.4) * 0.16 * m;
  `,
  // blades sway, more at the tip; instance position offsets the phase
  seaweed: /* glsl */ `
    float h = clamp(transformed.y / 4.0, 0.0, 1.0);
    float ph = 0.0;
    #ifdef USE_INSTANCING
      ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].z * 0.21;
    #endif
    transformed.x += sin(uTime * 0.9 + ph + transformed.y * 0.8) * 0.35 * h * h;
    transformed.z += cos(uTime * 0.7 + ph * 1.3 + transformed.y * 0.6) * 0.2 * h * h;
  `,
}

export function makeToonMaterial({
  deform = 'none',
  rim = '#9FEFFF',
  rimStrength = 0.55,
}: { deform?: Deform; rim?: string; rimStrength?: number } = {}) {
  const mat = new MeshToonMaterial({ vertexColors: true, gradientMap: toonGradient() })
  const uRim = { value: new Color(rim) }
  const uRimStrength = { value: rimStrength }

  mat.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uTime = sharedUniforms.uTime
    shader.uniforms.uRim = uRim
    shader.uniforms.uRimStrength = uRimStrength
    if (deform !== 'none') {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>\n${DEFORM[deform]}`)
    }
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform vec3 uRim;\nuniform float uRimStrength;')
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float rimF = 1.0 - saturate(dot(normalize(normal), normalize(vViewPosition)));
        totalEmissiveRadiance += uRim * pow(rimF, 3.0) * uRimStrength;`,
      )
  }
  // distinct cache key per variant so three does not share programs across deform types
  mat.customProgramCacheKey = () => `mr-toon-${deform}`
  return mat
}
