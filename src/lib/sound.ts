let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function createNoise(audio: AudioContext, duration: number): AudioBufferSourceNode {
  const len = audio.sampleRate * duration
  const buf = audio.createBuffer(1, len, audio.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  const src = audio.createBufferSource()
  src.buffer = buf
  return src
}

export function playKeypress(volume: number) {
  if (volume <= 0) return
  const audio = getCtx()
  const now = audio.currentTime
  const v = volume / 100

  const noise = createNoise(audio, 0.04)
  const noiseFilter = audio.createBiquadFilter()
  noiseFilter.type = 'bandpass'
  noiseFilter.frequency.value = 3000 + Math.random() * 2000
  noiseFilter.Q.value = 1.5
  const noiseGain = audio.createGain()
  noiseGain.gain.setValueAtTime(v * 0.7, now)
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)
  noise.connect(noiseFilter)
  noiseFilter.connect(noiseGain)
  noiseGain.connect(audio.destination)
  noise.start(now)
  noise.stop(now + 0.04)

  const osc = audio.createOscillator()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(1200 + Math.random() * 600, now)
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.02)
  const oscGain = audio.createGain()
  oscGain.gain.setValueAtTime(v * 0.5, now)
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
  osc.connect(oscGain)
  oscGain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + 0.03)

  const thud = audio.createOscillator()
  thud.type = 'sine'
  thud.frequency.setValueAtTime(200 + Math.random() * 80, now)
  thud.frequency.exponentialRampToValueAtTime(80, now + 0.03)
  const thudGain = audio.createGain()
  thudGain.gain.setValueAtTime(v * 0.3, now)
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
  thud.connect(thudGain)
  thudGain.connect(audio.destination)
  thud.start(now)
  thud.stop(now + 0.035)
}

export function playError(volume: number) {
  if (volume <= 0) return
  const audio = getCtx()
  const now = audio.currentTime
  const v = volume / 100

  const osc = audio.createOscillator()
  osc.type = 'square'
  osc.frequency.setValueAtTime(220, now)
  osc.frequency.exponentialRampToValueAtTime(110, now + 0.15)
  const gain = audio.createGain()
  gain.gain.setValueAtTime(v * 0.4, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15)
  osc.connect(gain)
  gain.connect(audio.destination)
  osc.start(now)
  osc.stop(now + 0.16)

  const osc2 = audio.createOscillator()
  osc2.type = 'sawtooth'
  osc2.frequency.setValueAtTime(165, now)
  osc2.frequency.exponentialRampToValueAtTime(80, now + 0.12)
  const gain2 = audio.createGain()
  gain2.gain.setValueAtTime(v * 0.25, now)
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
  osc2.connect(gain2)
  gain2.connect(audio.destination)
  osc2.start(now)
  osc2.stop(now + 0.13)
}
