import { createAudioPlayer, AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';
import { getCachedSettings } from './storage';

const tapAsset = require('../assets/audio/tap.wav');
const buttonAsset = require('../assets/audio/button.wav');
const correctAsset = require('../assets/audio/correct.wav');
const streakAsset = require('../assets/audio/streak.wav');
const mistakeAsset = require('../assets/audio/mistake.wav');
const levelCompleteAsset = require('../assets/audio/level_complete.wav');

const playerCache: Record<string, AudioPlayer | null> = {};

function getOrCreatePlayer(name: string, asset: any): AudioPlayer | null {
  try {
    if (playerCache[name] !== undefined) return playerCache[name];
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
    if (player.playing) await player.seekTo(0).catch(() => {});
    player.play();
  } catch {}
}

// ===== QUEUED VOICE SYSTEM =====
let speechQueue: { text: string; opts: any }[] = [];
let isSpeaking = false;

function processQueue() {
  if (isSpeaking || speechQueue.length === 0) return;
  if (!getCachedSettings().soundEnabled) {
    speechQueue = [];
    return;
  }
  const next = speechQueue.shift()!;
  isSpeaking = true;
  Speech.speak(next.text, {
    ...next.opts,
    onDone: () => {
      isSpeaking = false;
      setTimeout(processQueue, 150); // small gap between phrases
    },
    onStopped: () => {
      isSpeaking = false;
      setTimeout(processQueue, 150);
    },
    onError: () => {
      isSpeaking = false;
      setTimeout(processQueue, 150);
    },
  } as any);
}

function queueSpeak(text: string, opts: any, interrupt = false) {
  if (!getCachedSettings().soundEnabled) return;
  if (interrupt) {
    Speech.stop();
    speechQueue = [];
    isSpeaking = false;
  }
  speechQueue.push({ text, opts });
  processQueue();
}

function clearQueueAndStop() {
  Speech.stop();
  speechQueue = [];
  isSpeaking = false;
}

const BASE_OPTS = { language: 'en-US', pitch: 1.05, rate: 1.0 };

export function announceTarget(target: number) {
  clearQueueAndStop();
  queueSpeak(`${target}`, { ...BASE_OPTS, pitch: 1.15, rate: 1.1 }, true);
}

export function announceBlockValue(value: number) {
  // Quick tap should interrupt previous tap voice but not queue
  clearQueueAndStop();
  queueSpeak(`${value}`, { ...BASE_OPTS, pitch: 1.05, rate: 1.25 }, true);
}

export function announceMatchAndNext(currentTarget: number, nextTarget: number) {
  clearQueueAndStop();
  // Space them: Good job -> pause -> next target
  queueSpeak(`Good job! ${currentTarget} matched!`, { ...BASE_OPTS, pitch: 1.1, rate: 0.95 }, true);
  queueSpeak(`Next target is ${nextTarget}`, { ...BASE_OPTS, pitch: 1.0, rate: 0.95 }, false);
}

export function announceWrongMismatch() {
  clearQueueAndStop();
  queueSpeak(`Wrong! Deselect and reselect the complementary number`, { ...BASE_OPTS, rate: 0.9 }, true);
}

export function announceTimeUp() {
  clearQueueAndStop();
  queueSpeak(`Time's up! Tap to try again`, { ...BASE_OPTS, pitch: 1.0, rate: 0.9 }, true);
}

export function announceLevelComplete(level: number, nextLevel: number) {
  clearQueueAndStop();
  queueSpeak(`Level ${level} complete!`, { language: 'en-US', pitch: 1.3, rate: 0.9 }, true);
  queueSpeak(`Amazing! Entering level ${nextLevel}`, { language: 'en-US', pitch: 1.2, rate: 0.95 }, false);
}

export async function initAudio(): Promise<void> {}
export async function playTapSound(): Promise<void> { return playSafe('tap', tapAsset); }
export async function playButtonSound(): Promise<void> { return playSafe('button', buttonAsset); }
export async function playCorrectSound(): Promise<void> { return playSafe('correct', correctAsset); }
export async function playStreakSound(): Promise<void> { return playSafe('streak', streakAsset); }
export async function playMistakeSound(): Promise<void> { return playSafe('mistake', mistakeAsset); }

export async function playLevelCompleteSound(): Promise<void> {
  await playSafe('level_complete', levelCompleteAsset);
}