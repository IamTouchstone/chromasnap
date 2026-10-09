import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import { getCachedSettings } from './storage';

const tapAsset = require('../assets/audio/tap.wav');
const buttonAsset = require('../assets/audio/button.wav');
const correctAsset = require('../assets/audio/correct.wav');
const streakAsset = require('../assets/audio/streak.wav');
const mistakeAsset = require('../assets/audio/mistake.wav');

const playerCache: Record<string, AudioPlayer | null> = {};

function getOrCreatePlayer(name: string, asset: any): AudioPlayer | null {
  try {
    if (playerCache[name] !== undefined) {
      return playerCache[name];
    }
    const player = createAudioPlayer(asset);
    playerCache[name] = player;
    return player;
  } catch {
    playerCache[name] = null;
    return null;
  }
}

async function playSafe(name: string, asset: any): Promise<void> {
  if (!getCachedSettings().soundEnabled) return;
  try {
    const player = getOrCreatePlayer(name, asset);
    if (!player) return;

    if (player.playing) {
      await player.seekTo(0).catch(() => {});
    }
    player.play();
  } catch {
    // Fail gracefully without interrupting gameplay
  }
}

export async function initAudio(): Promise<void> {
  // Pure no-op for backward compatibility: sounds are loaded lazily on demand
}

export async function playTapSound(): Promise<void> {
  return playSafe('tap', tapAsset);
}

export async function playButtonSound(): Promise<void> {
  return playSafe('button', buttonAsset);
}

export async function playCorrectSound(): Promise<void> {
  return playSafe('correct', correctAsset);
}

export async function playStreakSound(): Promise<void> {
  return playSafe('streak', streakAsset);
}

export async function playMistakeSound(): Promise<void> {
  return playSafe('mistake', mistakeAsset);
}
