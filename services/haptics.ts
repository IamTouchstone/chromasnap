import * as Haptics from 'expo-haptics';
import { getCachedSettings } from './storage';

export async function triggerHapticTap(): Promise<void> {
  if (!getCachedSettings().hapticsEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Fail gracefully on devices without haptics
  }
}

export async function triggerHapticButton(): Promise<void> {
  if (!getCachedSettings().hapticsEnabled) return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Fail gracefully
  }
}

export async function triggerHapticSuccess(): Promise<void> {
  if (!getCachedSettings().hapticsEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Fail gracefully
  }
}

export async function triggerHapticWarning(): Promise<void> {
  if (!getCachedSettings().hapticsEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Fail gracefully
  }
}

export async function triggerHapticLevelComplete(): Promise<void> {
  if (!getCachedSettings().hapticsEnabled) return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
    }, 120);
  } catch {
    // Fail gracefully
  }
}
