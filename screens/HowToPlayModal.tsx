import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { THEME, COLOR_VALUES_ARRAY } from '../game/constants';
import { BlockView } from '../components/BlockView';
import { ChromaButton } from '../components/ChromaButton';

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>HOW TO PLAY</Text>
            <TouchableOpacity
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close how to play"
              style={styles.closeBtn}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* The Rule */}
            <View style={styles.ruleCard}>
              <Text style={styles.ruleHeadline}>MAKE THE TARGET</Text>
              <Text style={styles.ruleBody}>
                Tap blocks whose hidden values add up exactly to the target number.
                No submit button needed — the exact match snaps instantly!
              </Text>
            </View>

            {/* Colour-Value Legend */}
            <Text style={styles.sectionTitle}>COLOUR-VALUE SYSTEM</Text>
            <View style={styles.legendContainer}>
              {COLOR_VALUES_ARRAY.map((item) => (
                <View key={item.color} style={styles.legendRow}>
                  <BlockView
                    block={{
                      id: `legend-${item.color}`,
                      color: item.color,
                      value: item.value,
                      row: 0,
                      col: 0,
                    }}
                    size={52}
                    isSelected={false}
                    isSuccess={false}
                    isShake={false}
                    onPress={() => {}}
                    disabled={true}
                  />
                  <View style={styles.legendInfo}>
                    <Text style={styles.legendName}>{item.name.toUpperCase()}</Text>
                    <Text style={styles.legendDots}>
                      Value {item.value} ({'•'.repeat(item.value)})
                    </Text>
                  </View>
                  <Text style={styles.legendValueNum}>={item.value}</Text>
                </View>
              ))}
            </View>

            {/* Tips Card */}
            <View style={styles.tipsCard}>
              <Text style={styles.tipsHeadline}>TIPS</Text>
              <Text style={styles.tipsText}>• Solve faster for bigger speed bonuses.</Text>
              <Text style={styles.tipsText}>• Consecutive solves grow your streak multiplier.</Text>
              <Text style={styles.tipsText}>• Reach 10+ streak to trigger ON FIRE mode!</Text>
              <Text style={styles.tipsText}>• Use dot counts if you have trouble distinguishing colours.</Text>
            </View>
          </ScrollView>

          {/* Close Action */}
          <View style={styles.footer}>
            <ChromaButton
              title="GOT IT"
              size="medium"
              variant="primary"
              onPress={onClose}
              style={styles.gotItBtn}
            />
          </View>
        </View>
      </SafeAreaView>
    </Modal>
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
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceBorder,
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
    color: THEME.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: THEME.surfaceHighlight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: THEME.textSecondary,
    fontSize: 16,
    fontWeight: '800',
  },
  scrollContent: {
    paddingVertical: 20,
  },
  ruleCard: {
    backgroundColor: THEME.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    marginBottom: 24,
  },
  ruleHeadline: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: THEME.textPrimary,
    marginBottom: 6,
  },
  ruleBody: {
    fontSize: 14,
    color: THEME.textSecondary,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    color: THEME.textSecondary,
    marginBottom: 12,
  },
  legendContainer: {
    backgroundColor: THEME.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    paddingVertical: 8,
    marginBottom: 24,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: THEME.surfaceHighlight,
  },
  legendInfo: {
    flex: 1,
    marginLeft: 16,
  },
  legendName: {
    fontSize: 14,
    fontWeight: '800',
    color: THEME.textPrimary,
    letterSpacing: 1,
  },
  legendDots: {
    fontSize: 12,
    color: THEME.textSecondary,
    marginTop: 2,
  },
  legendValueNum: {
    fontSize: 20,
    fontWeight: '900',
    color: THEME.textPrimary,
  },
  tipsCard: {
    backgroundColor: THEME.surface,
    padding: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.surfaceBorder,
    marginBottom: 10,
  },
  tipsHeadline: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: THEME.textPrimary,
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 20,
    marginBottom: 4,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  gotItBtn: {
    width: 200,
  },
});
