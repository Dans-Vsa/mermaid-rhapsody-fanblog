// Procedural sea ambience with WebAudio: a low, slowly breathing rumble and, now and then, a soft
// distant piano-like note. No audio files, nothing loaded from anywhere. Starts only on a click.

let ctx: AudioContext | null = null
let master: GainNode | null = null
let noteTimer: number | undefined

const NOTES = [220, 261.63, 293.66, 329.63, 392, 440, 523.25] // A minor pentatonic-ish

function brownNoise(c: AudioContext) {
  const len = c.sampleRate * 4
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  let last = 0
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1
    last = (last + 0.02 * white) / 1.02
    d[i] = last * 3.2
  }
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true
  return src
}

function build(c: AudioContext) {
  master = c.createGain()
  master.gain.value = 0
  master.connect(c.destination)

  // rumble: brown noise through a low-pass whose cutoff breathes
  const noise = brownNoise(c)
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 380
  const lfo = c.createOscillator()
  const lfoGain = c.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 160
  lfo.connect(lfoGain).connect(lp.frequency)
  const rumble = c.createGain()
  rumble.gain.value = 0.5
  noise.connect(lp).connect(rumble).connect(master)
  noise.start()
  lfo.start()

  // a feedback delay gives the notes some water-like space
  const delay = c.createDelay(2)
  delay.delayTime.value = 0.42
  const fb = c.createGain()
  fb.gain.value = 0.38
  const wet = c.createBiquadFilter()
  wet.type = 'lowpass'
  wet.frequency.value = 1400
  delay.connect(fb).connect(wet).connect(delay)
  wet.connect(master)
  return delay
}

function playNote(c: AudioContext, out: AudioNode) {
  const f = NOTES[Math.floor(Math.random() * NOTES.length)]
  const t = c.currentTime
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = 'triangle'
  osc.frequency.value = f
  g.gain.setValueAtTime(0, t)
  g.gain.linearRampToValueAtTime(0.08, t + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2)
  osc.connect(g)
  g.connect(out)
  g.connect(master!)
  osc.start(t)
  osc.stop(t + 3.4)
}

export async function setAmbience(on: boolean) {
  if (on) {
    if (!ctx) {
      ctx = new AudioContext()
      const out = build(ctx)
      const loop = () => {
        if (ctx && ctx.state === 'running') playNote(ctx, out)
        noteTimer = window.setTimeout(loop, 5000 + Math.random() * 7000)
      }
      noteTimer = window.setTimeout(loop, 1800)
    }
    await ctx.resume()
    master!.gain.setTargetAtTime(0.22, ctx.currentTime, 0.8)
  } else if (ctx && master) {
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.3)
    const c = ctx
    window.setTimeout(() => {
      if (master && master.gain.value < 0.01) void c.suspend()
    }, 1500)
  }
}

export function disposeAmbience() {
  window.clearTimeout(noteTimer)
  void ctx?.close()
  ctx = null
  master = null
}
