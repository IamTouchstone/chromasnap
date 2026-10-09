import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLOR_DEFINITIONS } from '../game/constants';

interface ChromaEmblemProps {
  size?: number;
}

export const ChromaEmblem: React.FC<ChromaEmblemProps> = ({ size = 72 }) => {
  const blockSize = Math.round(size * 0.44);
  const gap = Math.round(size * 0.12);
  const radius = Math.round(blockSize * 0.28);
  const centerSize = Math.round(size * 0.2);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Top Row: RED & BLUE */}
      <View style={[styles.row, { marginBottom: gap }]}>
        <View
          style={[
            styles.block,
            {
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              backgroundColor: COLOR_DEFINITIONS.RED.hex,
              marginRight: gap,
            },
          ]}
        />
        <View
          style={[
            styles.block,
            {
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              backgroundColor: COLOR_DEFINITIONS.BLUE.hex,
            },
          ]}
        />
      </View>

      {/* Bottom Row: GREEN & PURPLE */}
      <View style={styles.row}>
        <View
          style={[
            styles.block,
            {
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              backgroundColor: COLOR_DEFINITIONS.GREEN.hex,
              marginRight: gap,
            },
          ]}
        />
        <View
          style={[
            styles.block,
            {
              width: blockSize,
              height: blockSize,
              borderRadius: radius,
              backgroundColor: COLOR_DEFINITIONS.PURPLE.hex,
            },
          ]}
        />
      </View>

      {/* Center Yellow Accent */}
      <View
        style={[
          styles.centerBlock,
          {
            width: centerSize,
            height: centerSize,
            borderRadius: centerSize / 2,
            backgroundColor: COLOR_DEFINITIONS.YELLOW.hex,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  block: {},
  centerBlock: {
    position: 'absolute',
    borderWidth: 2.5,
    borderColor: '#101010',
  },
});
