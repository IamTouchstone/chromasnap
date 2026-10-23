const fs = require('fs');
const path = require('path');

// Generate 16-bit Mono PCM WAV file
function createWavBuffer(sampleRate, samples) {
  const byteRate = sampleRate * 2; // 16-bit = 2 bytes per sample
  const blockAlign = 2;
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF identifier
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);

  // 'fmt ' chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size for PCM
  buffer.writeUInt16LE(1, 20);  // AudioFormat 1 = PCM
  buffer.writeUInt16LE(1, 22);  // NumChannels 1 = Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // BitsPerSample 16

  // 'data' chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Write samples
  for (let i = 0; i < samples.length; i++) {
    // Clamp to -1.0 to 1.0
    let s = Math.max(-1, Math.min(1, samples[i]));
    let intSample = s < 0 ? s * 32768 : s * 32767;
    buffer.writeInt16LE(Math.round(intSample), 44 + i * 2);
  }

  return buffer;
}

const sampleRate = 44100;

// 1. tap.wav: soft, tactile click (40ms)
function generateTap() {
  const duration = 0.04;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    const envelope = Math.pow(1 - progress, 2.5);
    const freq = 650 - 300 * progress;
    const tone = Math.sin(2 * Math.PI * freq * t);
    const noise = (Math.random() * 2 - 1) * 0.15;
    samples[i] = (tone * 0.85 + noise) * envelope * 0.6;
  }
  return createWavBuffer(sampleRate, samples);
}

// 2. button.wav: short tactile click (30ms)
function generateButton() {
  const duration = 0.03;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    const envelope = Math.pow(1 - progress, 3);
    const freq = 1200 - 600 * progress;
    const tone = Math.sin(2 * Math.PI * freq * t);
    samples[i] = tone * envelope * 0.5;
  }
  return createWavBuffer(sampleRate, samples);
}

// 3. correct.wav: bright two-tone confirmation (220ms: D5 587Hz -> A5 880Hz)
function generateCorrect() {
  const duration = 0.22;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  const split = Math.floor(sampleRate * 0.08); // switch after 80ms

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let freq = i < split ? 587.33 : 880.0;
    let localProg = i < split ? i / split : (i - split) / (numSamples - split);
    let envelope = i < split ? Math.pow(1 - localProg * 0.3, 1) : Math.pow(1 - localProg, 1.8);
    // Add subtle octave harmonic for brilliance
    let tone = Math.sin(2 * Math.PI * freq * t) * 0.7 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.3;
    samples[i] = tone * envelope * 0.65;
  }
  return createWavBuffer(sampleRate, samples);
}

// 4. streak.wav: triumphant ascending harmonic chord (300ms)
function generateStreak() {
  const duration = 0.32;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
  const seg = Math.floor(numSamples / notes.length);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIdx = Math.min(notes.length - 1, Math.floor(i / seg));
    const freq = notes[noteIdx];
    const totalProg = i / numSamples;
    const localProg = (i % seg) / seg;
    const envelope = (1 - totalProg * 0.4) * (1 - Math.pow(localProg, 3) * 0.3);
    const tone = Math.sin(2 * Math.PI * freq * t) * 0.65 + Math.sin(2 * Math.PI * (freq * 1.5) * t) * 0.25;
    samples[i] = tone * envelope * 0.7;
  }
  return createWavBuffer(sampleRate, samples);
}

// 5. mistake.wav: soft low click / muted thud (100ms)
function generateMistake() {
  const duration = 0.1;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const progress = i / numSamples;
    const envelope = Math.pow(1 - progress, 2);
    const freq = 200 - 90 * progress;
    const tone = Math.sin(2 * Math.PI * freq * t);
    samples[i] = tone * envelope * 0.45;
  }
  return createWavBuffer(sampleRate, samples);
}

// 6. level_complete.wav: celebratory ascending fanfare chord (550ms)
function generateLevelComplete() {
  const duration = 0.55;
  const numSamples = Math.floor(sampleRate * duration);
  const samples = new Float32Array(numSamples);
  const arpeggioNotes = [523.25, 659.25, 783.99, 1046.5];
  const arpeggioDuration = 0.28;
  const arpeggioSamples = Math.floor(sampleRate * arpeggioDuration);
  const noteSamples = Math.floor(arpeggioSamples / arpeggioNotes.length);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    if (i < arpeggioSamples) {
      const idx = Math.min(arpeggioNotes.length - 1, Math.floor(i / noteSamples));
      const freq = arpeggioNotes[idx];
      const noteProg = (i % noteSamples) / noteSamples;
      const env = (1 - noteProg * 0.4);
      sample += (Math.sin(2 * Math.PI * freq * t) * 0.6 + Math.sin(4 * Math.PI * freq * t) * 0.25) * env;
    } else {
      const sustainProg = (i - arpeggioSamples) / (numSamples - arpeggioSamples);
      const env = Math.pow(1 - sustainProg, 1.4);
      sample += Math.sin(2 * Math.PI * 523.25 * t) * 0.25 * env;
      sample += Math.sin(2 * Math.PI * 659.25 * t) * 0.25 * env;
      sample += Math.sin(2 * Math.PI * 783.99 * t) * 0.3 * env;
      sample += Math.sin(2 * Math.PI * 1046.50 * t) * 0.4 * env;
      sample += Math.sin(2 * Math.PI * 1318.51 * t) * 0.25 * env;
    }

    samples[i] = sample * 0.65;
  }
  return createWavBuffer(sampleRate, samples);
}

const outDir = path.join(__dirname, '..', 'assets', 'audio');
fs.writeFileSync(path.join(outDir, 'tap.wav'), generateTap());
fs.writeFileSync(path.join(outDir, 'button.wav'), generateButton());
fs.writeFileSync(path.join(outDir, 'correct.wav'), generateCorrect());
fs.writeFileSync(path.join(outDir, 'streak.wav'), generateStreak());
fs.writeFileSync(path.join(outDir, 'mistake.wav'), generateMistake());
fs.writeFileSync(path.join(outDir, 'level_complete.wav'), generateLevelComplete());

console.log('Successfully generated all 6 audio files in assets/audio!');
