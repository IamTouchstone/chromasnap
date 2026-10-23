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
import { clearUsedTargets } from './game/generator'; // <-- FIX
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

  const [lastScore, setLastScore] = useState<number>(0);
  const [lastStreak, setLastStreak] = useState<number>(0);
  const [lastSolves, setLastSolves] = useState<number>(0);
  const [lastLevel, setLastLevel] = useState<number>(1);

  useEffect(() => {
    async function boot() {
      const loaded = await loadStoredSettings();
      setSettings(loaded);
    }
    boot();
  }, []);

  const handleSplashFinish = () => {
    if (!settings.tutorialComplete) {
      setCurrentScreen('TUTORIAL');
    } else {
      setCurrentScreen('HOME');
    }
  };

  const handleTutorialComplete = async () => {
    const updated = await saveStoredSettings({ tutorialComplete: true });
    setSettings(updated);
    clearUsedTargets(); // <-- FIX: fresh run after tutorial
    setCurrentScreen('GAME');
  };

  const handleTutorialSkip = async () => {
    const updated = await saveStoredSettings({ tutorialComplete: true });
    setSettings(updated);
    clearUsedTargets(); // <-- FIX
    setCurrentScreen('GAME');
  };

  const handleToggleSound = async () => {
    const updated = await saveStoredSettings({ soundEnabled: !settings.soundEnabled });
    setSettings(updated);
  };

  const handleToggleHaptics = async () => {
    const updated = await saveStoredSettings({ hapticsEnabled: !settings.hapticsEnabled });
    setSettings(updated);
  };

  // Start standard game — THIS IS YOUR RETRY
  const handleStartPlay = () => {
    clearUsedTargets(); // <-- FIX: this is the ONLY place that clears = no repeats till retry
    setIsDailyRun(false);
    setCurrentScreen('GAME');
  };

  // Start daily challenge — new run
  const handleStartDaily = () => {
    clearUsedTargets(); // <-- FIX
    setIsDailyRun(true);
    setCurrentScreen('GAME');
  };

  const handleSessionEnd = async (
    finalScore: number,
    finalStreak: number,
    solves: number,
    finalLevel: number = 1
  ) => {
    const updated = await recordGameEnd(finalScore, finalStreak, finalLevel);
    setSettings(updated);
    setLastScore(finalScore);
    setLastStreak(finalStreak);
    setLastSolves(solves);
    setLastLevel(finalLevel);
    setCurrentScreen('RESULTS');
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      {currentScreen === 'SPLASH' && <SplashScreen onFinish={handleSplashFinish} />}
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
        <TutorialScreen onComplete={handleTutorialComplete} onSkip={handleTutorialSkip} />
      )}
      {currentScreen === 'GAME' && <GameScreen isDailyChallenge={isDailyRun} onSessionEnd={handleSessionEnd} />}
      {currentScreen === 'RESULTS' && (
        <ResultsScreen
          score={lastScore}
          streak={lastStreak}
          solves={lastSolves}
          level={lastLevel}
          settings={settings}
          onPlayAgain={handleStartPlay}
          onHomePress={() => setCurrentScreen('HOME')}
        />
      )}
      <HowToPlayModal visible={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: THEME.background },
});