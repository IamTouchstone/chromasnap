import { Block, ChromaColor, ColorValue, DifficultyState, GridSize, Puzzle } from './types';
import { VALUE_TO_COLOR } from './constants';

// Fast seeded pseudo-random number generator (Mulberry32)
export function createRNG(seed?: number) {
  let s = seed !== undefined ? seed >>> 0 : (Date.now() ^ (Math.random() * 0x100000000)) >>> 0;
  return function next(): number {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate an integer between min and max inclusive using rng
function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

// Shuffle array in-place
function shuffle<T>(array: T[], rng: () => number): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Finds all combination solutions on a given board that equal the target.
 * Bounded search for performance.
 */
export function findSolutions(
  blocks: Block[],
  target: number,
  maxSolutionLength = 5,
  maxSolutionsToFind = 10
): string[][] {
  const solutions: string[][] = [];

  function backtrack(
    startIndex: number,
    currentSum: number,
    currentBlockIds: string[]
  ) {
    if (currentSum === target) {
      solutions.push([...currentBlockIds]);
      return;
    }
    if (
      currentSum > target ||
      currentBlockIds.length >= maxSolutionLength ||
      solutions.length >= maxSolutionsToFind
    ) {
      return;
    }

    for (let i = startIndex; i < blocks.length; i++) {
      const b = blocks[i];
      if (currentSum + b.value <= target) {
        currentBlockIds.push(b.id);
        backtrack(i + 1, currentSum + b.value, currentBlockIds);
        currentBlockIds.pop();
      }
    }
  }

  backtrack(0, 0, []);
  return solutions;
}

/**
 * Fallback puzzle guaranteed to be valid in case of any generation anomaly.
 */
export function getFallbackPuzzle(): Puzzle {
  const colors: ChromaColor[] = [
    'RED', 'BLUE', 'YELLOW',
    'GREEN', 'PURPLE', 'RED',
    'BLUE', 'GREEN', 'PURPLE'
  ];
  const blocks: Block[] = colors.map((c, i) => {
    let val: ColorValue = 1;
    if (c === 'BLUE') val = 2;
    if (c === 'YELLOW') val = 3;
    if (c === 'GREEN') val = 4;
    if (c === 'PURPLE') val = 5;

    return {
      id: `block-fallback-${i}`,
      color: c,
      value: val,
      row: Math.floor(i / 3),
      col: i % 3,
    };
  });

  // Target 4: Red(1) at 0 + Yellow(3) at 2
  return {
    gridSize: 3,
    blocks,
    target: 4,
    solutionBlockIds: [blocks[0].id, blocks[2].id],
    maxTimeSeconds: 15,
  };
}

/**
 * Generates a validated puzzle based on difficulty settings and optional seed.
 */
export function generatePuzzle(difficulty: DifficultyState, seed?: number): Puzzle {
  const rng = createRNG(seed);
  const totalBlocks = difficulty.gridSize * difficulty.gridSize;

  for (let attempt = 0; attempt < 50; attempt++) {
    // Balanced distribution of values (1 to 5)
    // Guarantee that at least two of each value 1..5 are in the bag for good combinations
    const valuePool: ColorValue[] = [];
    for (let v = 1; v <= 5; v++) {
      valuePool.push(v as ColorValue);
      valuePool.push(v as ColorValue);
    }
    while (valuePool.length < totalBlocks) {
      valuePool.push(randInt(rng, 1, 5) as ColorValue);
    }
    shuffle(valuePool, rng);

    // Build block objects
    const blocks: Block[] = [];
    for (let r = 0; r < difficulty.gridSize; r++) {
      for (let c = 0; c < difficulty.gridSize; c++) {
        const idx = r * difficulty.gridSize + c;
        const val = valuePool[idx];
        const color = VALUE_TO_COLOR[val];
        blocks.push({
          id: `b-${r}-${c}-${attempt}`,
          color,
          value: val,
          row: r,
          col: c,
        });
      }
    }

    // Pick a candidate solution subset of blocks
    const targetSize = randInt(
      rng,
      difficulty.targetBlockCountMin,
      difficulty.targetBlockCountMax
    );
    const candidateIndices: number[] = [];
    const availableIndices = Array.from({ length: totalBlocks }, (_, i) => i);
    shuffle(availableIndices, rng);

    for (let k = 0; k < targetSize; k++) {
      candidateIndices.push(availableIndices[k]);
    }

    const candidateSum = candidateIndices.reduce(
      (sum, idx) => sum + blocks[idx].value,
      0
    );

    // Check if candidateSum meets target constraints
    if (
      candidateSum >= difficulty.minTarget &&
      candidateSum <= difficulty.maxTarget
    ) {
      const solutionBlockIds = candidateIndices.map((idx) => blocks[idx].id);

      // Verify with backtracking solver
      const verifiedSolutions = findSolutions(blocks, candidateSum, 5, 5);
      if (verifiedSolutions.length > 0) {
        return {
          gridSize: difficulty.gridSize,
          blocks,
          target: candidateSum,
          solutionBlockIds,
          maxTimeSeconds: difficulty.timeLimitSeconds,
        };
      }
    }
  }

  // Safe fallback if loop exhausts
  return getFallbackPuzzle();
}

/**
 * Returns deterministic date integer seed for Daily Challenge (e.g. 20261009)
 */
export function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}
