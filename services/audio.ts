import { Audio } from 'expo-av';
import { getCachedSettings } from './storage';

const tapAsset = require('../assets/audio/tap.wav');
const buttonAsset = require('../assets/audio/button.wav');
const correctAsset = require('../assets/audio/correct.wav');
const streakAsset = require('../assets/audio/streak.wav');
const mistakeAsset = require('../assets/audio/mistake.wav');

let tapSound: Audio.Sound | null = null;
let buttonSound: Audio.Sound | null = null;
let correctSound: Audio.Sound | null = null;
let streakSound: Audio.Sound | null = null;
let mistakeSound: Audio.Sound | null = null;

let isAudioInitialized = false;

export async function initAudio(): Promise<void> {
  if (isAudioInitialized) return;
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const [t, b, c, s, m] = await Promise.all([
      Audio.Sound.createAsync(tapAsset, { shouldPlay: false, volume: 0.6 }),
      Audio.Sound.createAsync(buttonAsset, { shouldPlay: false, volume: 0.6 }),
      Audio.Sound.createAsync(correctAsset, { shouldPlay: false, volume: 0.8 }),
      Audio.Sound.createAsync(streakAsset, { shouldPlay: false, volume: 0.85 }),
      Audio.Sound.createAsync(mistakeAsset, { shouldPlay: false, volume: 0.55 }),
    ]);

    tapSound = t.sound;
    buttonSound = b.sound;
    correctSound = c.sound;
    streakSound = s.sound;
    mistakeSound = m.sound;

    isAudioInitialized = true;
  } catch {
    // Audio initialization failed; game will continue in silent mode
  }
}

async function playSafe(sound: Audio.Sound | null, asset: any, volume = 0.7): Promise<void> {
  if (!getCachedSettings().soundEnabled) return;
  try {
    if (sound) {
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } else {
      // Lazy load if not preloaded
      const created = await Audio.Sound.createAsync(asset, { shouldPlay: true, volume });
      created.sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          created.sound.unloadAsync().catch(() => {});
        }
      });
    }
  } catch {
    // Fail silently without interrupting gameplay
  }
}

export async function playTapSound(): Promise<void> {
  return playSafe(tapSound, tapAsset, 0.6);
}

export async function playButtonSound(): Promise<void> {
  return playSafe(buttonSound, buttonAsset, 0.6);
}

export async function playCorrectSound(): Promise<void> {
  return playSafe(correctSound, correctAsset, 0.8);
}

export async function playStreakSound(): Promise<void> {
  return playSafe(streakSound, streakAsset, 0.85);
}

export async function playMistakeSound(): Promise<void> {
  return playSafe(mistakeSound, mistakeAsset, 0.55);
}
