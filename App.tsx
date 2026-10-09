import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { THEME } from './game/constants';
import { ScreenName, StoredSettings } from './game/types';
import {
  loadStoredSettings,
  saveStoredSettings,
  recordGameEnd,
  getCachedSettings,
} from './services/storage';
import { initAudio } from './services/audio';
import { SplashScreen } from './screens/SplashScreen';
import { HomeScreen } from './screens/HomeScreen';
import { TutorialScreen } from './screens/TutorialScreen';
import { GameScreen } from './screens/GameScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { HowToPlayModal } from './screens/HowToPlayModal';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('SPLASH');
  const [settings, setSettings] = useState<StoredSettings>(getCachedSettings());
  const [showHowToPlay, setShowHowToPlay] = useState<boolean>(false);
  const [isDailyRun, setIsDailyRun] = useState<boolean>(false);

  // Results state
  const [lastScore, setLastScore] = useState<number>(0);
  const [lastStreak, setLastStreak] = useState<number>(0);
  const [lastSolves, setLastSolves] = useState<number>(0);

  // Initialize storage and audio on boot
  useEffect(() => {
    async function boot() {
      const loaded = await loadStoredSettings();
      setSettings(loaded);
      initAudio().catch(() => {});
    }
    boot();
  }, []);

  // Splash completed handler
  const handleSplashFinish = () => {
    if (!settings.tutorialComplete) {
      setCurrentScreen('TUTORIAL');
    } else {
      setCurrentScreen('HOME');
    }
  };

  // Tutorial completed / skipped handler
  const handleTutorialComplete = async () => {
    const updated = await saveStoredSettings({ tutorialComplete: true });
    setSettings(updated);
    setCurrentScreen('GAME');
  };

  const handleTutorialSkip = async () => {
    const updated = await saveStoredSettings({ tutorialComplete: true });
    setSettings(updated);
    setCurrentScreen('GAME');
  };

  // Toggle Sound
  const handleToggleSound = async () => {
    const updated = await saveStoredSettings({ soundEnabled: !settings.soundEnabled });
    setSettings(updated);
  };

  // Toggle Haptics
  const handleToggleHaptics = async () => {
    const updated = await saveStoredSettings({ hapticsEnabled: !settings.hapticsEnabled });
    setSettings(updated);
  };

  // Start standard game
  const handleStartPlay = () => {
    setIsDailyRun(false);
    setCurrentScreen('GAME');
  };

  // Start daily challenge
  const handleStartDaily = () => {
    setIsDailyRun(true);
    setCurrentScreen('GAME');
  };

  // Session finished from GameScreen
  const handleSessionEnd = async (finalScore: number, finalStreak: number, solves: number) => {
    const updated = await recordGameEnd(finalScore, finalStreak);
    setSettings(updated);
    setLastScore(finalScore);
    setLastStreak(finalStreak);
    setLastSolves(solves);
    setCurrentScreen('RESULTS');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {currentScreen === 'SPLASH' && (
        <SplashScreen onFinish={handleSplashFinish} />
      )}

      {currentScreen === 'HOME' && (
        <HomeScreen
          settings={settings}
          onPlayPress={handleStartPlay}
          onDailyPress={handleStartDaily}
          onToggleSound={handleToggleSound}
          onToggleHaptics={handleToggleHaptics}
          onHowToPlayPress={() => setShowHowToPlay(true)}
        />
      )}

      {currentScreen === 'TUTORIAL' && (
        <TutorialScreen
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}

      {currentScreen === 'GAME' && (
        <GameScreen
          isDailyChallenge={isDailyRun}
          onSessionEnd={handleSessionEnd}
        />
      )}

      {currentScreen === 'RESULTS' && (
        <ResultsScreen
          score={lastScore}
          streak={lastStreak}
          solves={lastSolves}
          settings={settings}
          onPlayAgain={handleStartPlay}
          onHomePress={() => setCurrentScreen('HOME')}
        />
      )}

      {/* How To Play Modal */}
      <HowToPlayModal
        visible={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: THEME.background,
  },
});
