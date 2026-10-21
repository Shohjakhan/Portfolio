/**
 * The gramophone's music: a small generative lo-fi loop made live with the Web Audio API — soft
 * chord pads, a mellow bass, sparse keys, a lazy beat and vinyl crackle, all through a warm
 * low-pass. No audio files are needed (and none are downloaded); it is quiet by design and only
 * ever starts from a click on the gramophone.
 */
type Listener = () => void;

const BPM = 72;
const STEP_S = 60 / BPM / 2; // an eighth note
const STEPS_PER_CHORD = 16;
/** Am7, Fmaj7, Cmaj7, G7 — MIDI notes. */
const CHORDS = [
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [48, 52, 55, 59],
  [55, 59, 62, 65],
];

const listeners = new Set<Listener>();
let playing = false;
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let timer: number | undefined;
let nextTime = 0;
let step = 0;
let stopTimer: number | undefined;

const hz = (note: number) => 440 * Math.pow(2, (note - 69) / 12);
const emit = () => listeners.forEach((listener) => listener());

// A reloaded copy of this module (hot reload while developing) must not leave the previous copy playing.
const shared = typeof window !== "undefined" ? (window as unknown as { __lofiContext?: AudioContext }) : null;
if (shared?.__lofiContext) void shared.__lofiContext.close().catch(() => undefined);

function makeContext(): AudioContext | null {
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  const created = Ctor ? new Ctor() : null;
  if (shared && created) shared.__lofiContext = created;
  return created;
}

function tone(freq: number, when: number, length: number, type: OscillatorType, peak: number, attack: number, release: number) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = (Math.random() - 0.5) * 12;
  gain.gain.setValueAtTime(0, when);
  gain.gain.linearRampToValueAtTime(peak, when + attack);
  gain.gain.setValueAtTime(peak, when + Math.max(attack, length - release));
  gain.gain.linearRampToValueAtTime(0, when + length);
  osc.connect(gain).connect(master);
  osc.start(when);
  osc.stop(when + length + 0.05);
}

function burst(when: number, length: number, peak: number, filterType: BiquadFilterType, freq: number) {
  if (!ctx || !master || !noise) return;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = noise;
  filter.type = filterType;
  filter.frequency.value = freq;
  gain.gain.setValueAtTime(peak, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + length);
  source.connect(filter).connect(gain).connect(master);
  source.start(when, Math.random() * 1.5);
  source.stop(when + length + 0.02);
}

function kick(when: number) {
  if (!ctx || !master) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(130, when);
  osc.frequency.exponentialRampToValueAtTime(42, when + 0.2);
  gain.gain.setValueAtTime(0.32, when);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.28);
  osc.connect(gain).connect(master);
  osc.start(when);
  osc.stop(when + 0.3);
}

function scheduleStep(when: number) {
  const chord = CHORDS[Math.floor(step / STEPS_PER_CHORD) % CHORDS.length];
  const inChord = step % STEPS_PER_CHORD;
  const swing = step % 2 === 1 ? 0.03 : 0;

  if (inChord === 0) {
    const length = STEP_S * STEPS_PER_CHORD;
    chord.forEach((note, i) => {
      tone(hz(note), when, length + 0.6, "sine", 0.05, 1.2, 1.6);
      tone(hz(note + 12), when + 0.05 * i, length + 0.4, "triangle", 0.018, 1.4, 1.6);
    });
  }
  if (inChord % 8 === 0) tone(hz(chord[0] - 24), when, STEP_S * 5, "sine", 0.2, 0.02, 0.5);
  if (inChord % 8 === 0) kick(when);
  if (inChord % 8 === 4) burst(when, 0.14, 0.09, "bandpass", 1800);
  if (step % 2 === 1) burst(when + swing, 0.035, 0.035, "highpass", 6500);
  if (Math.random() < 0.5) {
    const note = chord[Math.floor(Math.random() * chord.length)] + 12 * (Math.random() < 0.35 ? 2 : 1);
    tone(hz(note), when + swing, 0.9, "triangle", 0.06, 0.012, 0.8);
  }
  if (Math.random() < 0.3) burst(when + Math.random() * STEP_S, 0.006, 0.12, "highpass", 2500); // vinyl pop
  step += 1;
}

function tick() {
  if (!ctx) return;
  while (nextTime < ctx.currentTime + 0.4) {
    scheduleStep(nextTime);
    nextTime += STEP_S;
  }
}

function start() {
  const context = ctx ?? makeContext();
  if (!context) return;
  void context.resume();
  window.clearTimeout(stopTimer);
  ctx = context;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3200;
  filter.Q.value = 0.4;
  master = ctx.createGain();
  master.gain.setValueAtTime(0, ctx.currentTime);
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 2.5);
  master.connect(filter).connect(ctx.destination);

  noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const data = noise.getChannelData(0);
  for (let i = 0; i < data.length; i += 1) data[i] = Math.random() * 2 - 1;
  // the constant soft hiss of the record
  const hiss = ctx.createBufferSource();
  const hissFilter = ctx.createBiquadFilter();
  const hissGain = ctx.createGain();
  hiss.buffer = noise;
  hiss.loop = true;
  hissFilter.type = "highpass";
  hissFilter.frequency.value = 1200;
  hissGain.gain.value = 0.006;
  hiss.connect(hissFilter).connect(hissGain).connect(master);
  hiss.start();

  step = 0;
  nextTime = ctx.currentTime + 0.1;
  timer = window.setInterval(tick, 100);
  tick();
}

function stop() {
  if (!ctx || !master) return;
  const closing = ctx;
  master.gain.cancelScheduledValues(closing.currentTime);
  master.gain.setValueAtTime(master.gain.value, closing.currentTime);
  master.gain.linearRampToValueAtTime(0, closing.currentTime + 1.2);
  window.clearInterval(timer);
  stopTimer = window.setTimeout(() => {
    void closing.close();
    if (ctx === closing) {
      ctx = null;
      master = null;
    }
  }, 1400);
}

export const lofi = {
  /** Create/wake the audio context inside a click, so a later (non-click) start isn't muted by autoplay rules. */
  prime() {
    if (!ctx) ctx = makeContext();
    void ctx?.resume();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: () => playing,
  getServerSnapshot: () => false,
  toggle() {
    playing = !playing;
    if (playing) start();
    else stop();
    emit();
  },
};
