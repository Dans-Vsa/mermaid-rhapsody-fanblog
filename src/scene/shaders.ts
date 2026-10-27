// Shared GLSL snippets.

/**
 * Animated caustic light pattern (based on the well known "water turbulence" iteration by joltz0r,
 * Shadertoy MdlXz8). Returns 0..1, sharp bright filaments.
 */
export const CAUSTIC_GLSL = /* glsl */ `
float mrCaustic(vec2 p, float t) {
  const float TAU = 6.28318530718;
  vec2 q = mod(p * TAU, TAU) - 250.0;
  vec2 i = q;
  float c = 1.0;
  const float inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / inten), q.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0;
  c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.0);
}
`

/** 0 at the seabed, 1 near the surface: how much sunlight is left at a world height. */
export const LIGHT_AT_DEPTH_GLSL = /* glsl */ `
float mrLightAtDepth(float y) {
  return 0.15 + 0.85 * smoothstep(-110.0, -4.0, y);
}
`
