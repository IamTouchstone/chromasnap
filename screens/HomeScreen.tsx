import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { THEME } from '../game/constants';
import { ChromaEmblem } from '../components/ChromaEmblem';
import { ChromaButton } from '../components/ChromaButton';
import { IconButton } from '../components/IconButton';
import { formatScore } from '../game/scoring';
import { StoredSettings } from '../game/types';

interface HomeScreenProps {
  settings: StoredSettings;
  onPlayPress: () => void;
  onDailyPress: () => void;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onHowToPlayPress: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  settings,
  onPlayPress,
  onDailyPress,
  onToggleSound,
  onToggleHaptics,
  onHowToPlayPress,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Branding */}
        <View style={styles.topSection}>
          <ChromaEmblem size={84} />
          <Text style={styles.brandTitle}>CHROMA SNAP</Text>
          <Text style={styles.brandSubtitle}>EXACT SNAP PUZZLE</Text>
        </View>

        {/* Center: Large PLAY button & Daily Challenge */}
        <View style={styles.centerSection}>
          <ChromaButton
            title="PLAY"
            size="large"
            onPress={onPlayPress}
            style={styles.playButton}
            textStyle={styles.playButtonText}
          />

          <View style={styles.bestContainer}>
            <Text style={styles.bestLabel}>BEST SCORE</Text>
            <Text style={styles.bestValue}>{formatScore(settings.bestScore)}</Text>
            {settings.bestStreak > 0 && (
              <Text style={styles.streakLabel}>BEST STREAK ×{settings.bestStreak}</Text>
            )}
          </View>

          {/* Daily Challenge button */}
          <ChromaButton
            title="DAILY CHALLENGE"
            variant="outline"
            size="small"
            onPress={onDailyPress}
            style={styles.dailyButton}
          />
        </View>

        {/* Bottom Utility Controls */}
        <View style={styles.bottomSection}>
          <View style={styles.controlsRow}>
            <IconButton
              iconType={settings.soundEnabled ? 'sound-on' : 'sound-off'}
              onPress={onToggleSound}
              accessibilityLabel={`Sound is ${settings.soundEnabled ? 'on' : 'off'}`}
              active={settings.soundEnabled}
            />
            <View style={{ width: 18 }} />
            <IconButton
              iconType={settings.hapticsEnabled ? 'haptics-on' : 'haptics-off'}
              onPress={onToggleHaptics}
              accessibilityLabel={`Haptics is ${settings.hapticsEnabled ? 'on' : 'off'}`}
              active={settings.hapticsEnabled}
            />
            <View style={{ width: 18 }} />
            <IconButton
              iconType="help"
              onPress={onHowToPlayPress}
              accessibilityLabel="How to play instructions"
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.background,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 4,
    color: THEME.textPrimary,
    marginTop: 18,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 3,
    color: THEME.textSecondary,
    marginTop: 6,
  },
  centerSection: {
    alignItems: 'center',
    width: '100%',
  },
  playButton: {
    width: 240,
    height: 68,
    borderRadius: 20,
  },
  playButtonText: {
    fontSize: 22,
    letterSpacing: 3,
  },
  bestContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  bestLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    color: THEME.textSecondary,
    textTransform: 'uppercase',
  },
  bestValue: {
    fontSize: 32,
    fontWeight: '900',
    color: THEME.textPrimary,
    marginTop: 2,
  },
  streakLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: THEME.warning,
    marginTop: 4,
  },
  dailyButton: {
    marginTop: 22,
    borderColor: THEME.surfaceBorder,
    paddingHorizontal: 20,
  },
  bottomSection: {
    alignItems: 'center',
    marginBottom: 12,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
