import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { Block, GridSize } from '../game/types';
import { BlockView } from './BlockView';

interface BoardViewProps {
  gridSize: GridSize;
  blocks: Block[];
  selectedBlockIds: Set<string>;
  highlightedBlockIds?: Set<string>; // For failure reveal
  isSuccess: boolean;
  isShake: boolean;
  onBlockPress: (block: Block) => void;
  disabled?: boolean;
}

export const BoardView: React.FC<BoardViewProps> = ({
  gridSize,
  blocks,
  selectedBlockIds,
  highlightedBlockIds,
  isSuccess,
  isShake,
  onBlockPress,
  disabled = false,
}) => {
  const { width } = useWindowDimensions();

  // Determine board size based on device width with safety margins
  const maxBoardWidth = Math.min(width - 36, 420);
  const gap = gridSize === 3 ? 14 : gridSize === 4 ? 10 : 8;
  const blockSize = Math.floor((maxBoardWidth - gap * (gridSize - 1)) / gridSize);

  // Group blocks by row
  const rows: Block[][] = [];
  for (let r = 0; r < gridSize; r++) {
    const rowBlocks = blocks.filter((b) => b.row === r);
    // Sort by column
    rowBlocks.sort((a, b) => a.col - b.col);
    rows.push(rowBlocks);
  }

  return (
    <View style={[styles.container, { width: maxBoardWidth }]}>
      {rows.map((row, rIdx) => (
        <View
          key={`row-${rIdx}`}
          style={[
            styles.row,
            {
              marginBottom: rIdx < gridSize - 1 ? gap : 0,
            },
          ]}
        >
          {row.map((block) => {
            const isSelected = selectedBlockIds.has(block.id);
            const isHighlighted = highlightedBlockIds?.has(block.id) ?? false;
            return (
              <View key={block.id} style={{ marginHorizontal: gap / 2 }}>
                <BlockView
                  block={block}
                  size={blockSize}
                  isSelected={isSelected || isHighlighted}
                  isSuccess={isSuccess}
                  isShake={isShake}
                  onPress={onBlockPress}
                  disabled={disabled}
                />
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
