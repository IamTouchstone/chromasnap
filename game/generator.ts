import { Block, ChromaColor, ColorValue, DifficultyState, GridSize, Puzzle } from './types';
import { VALUE_TO_COLOR } from './constants';

// === NEW: RUN-SCOPED MEMORY ===
const usedTargetsThisRun = new Set<number>();

export function clearUsedTargets() {
  usedTargetsThisRun.clear();
}
export function getUsedTargets() {
  return [...usedTargetsThisRun];
}
// === END NEW ===

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

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffle<T>(array: T[], rng: () => number): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function findSolutions(
  blocks: Block[],
  target: number,
  maxSolutionLength = 8,
  maxSolutionsToFind = 10
): string[][] {
  const solutions: string[][] = [];
  function backtrack(startIndex: number, currentSum: number, currentBlockIds: string[]) {
    if (currentSum === target) {
      solutions.push([...currentBlockIds]);
      return;
    }
    if (currentSum > target || currentBlockIds.length >= maxSolutionLength || solutions.length >= maxSolutionsToFind) return;
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

export function getFallbackPuzzle(difficulty?: DifficultyState): Puzzle {
  const gridSize: GridSize = difficulty?.gridSize || 3;
  const targetBlocks = difficulty?.targetBlockCountMin || 2;
  const blocks: Block[] = [];
  const solutionBlockIds: string[] = [];
  let target = 0;
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      const idx = r * gridSize + c;
      const val: ColorValue = (((idx * 2 + 1) % 5) + 1) as ColorValue;
      const id = `b-fallback-${r}-${c}`;
      blocks.push({ id, color: VALUE_TO_COLOR[val], value: val, row: r, col: c });
      if (solutionBlockIds.length < targetBlocks) {
        solutionBlockIds.push(id);
        target += val;
      }
    }
  }
  return { gridSize, blocks, target, solutionBlockIds, maxTimeSeconds: difficulty?.timeLimitSeconds || 15 };
}

// Your original logic extracted
function generateOnePuzzle(difficulty: DifficultyState, seed?: number): Puzzle {
  const rng = createRNG(seed);
  const totalBlocks = difficulty.gridSize * difficulty.gridSize;
  const maxBlockLen = Math.max(8, difficulty.targetBlockCountMax + 1);

  for (let attempt = 0; attempt < 60; attempt++) {
    const valuePool: ColorValue[] = [];
    const copiesPerVal = Math.max(1, Math.floor(totalBlocks / 5));
    for (let v = 1; v <= 5; v++) {
      for (let c = 0; c < copiesPerVal; c++) valuePool.push(v as ColorValue);
    }
    while (valuePool.length < totalBlocks) valuePool.push(randInt(rng, 1, 5) as ColorValue);
    shuffle(valuePool, rng);

    const blocks: Block[] = [];
    for (let r = 0; r < difficulty.gridSize; r++) {
      for (let c = 0; c < difficulty.gridSize; c++) {
        const idx = r * difficulty.gridSize + c;
        const val = valuePool[idx];
        blocks.push({ id: `b-${r}-${c}-${attempt}`, color: VALUE_TO_COLOR[val], value: val, row: r, col: c });
      }
    }

    const availableIndices = Array.from({ length: totalBlocks }, (_, i) => i);
    for (let comboAttempt = 0; comboAttempt < 30; comboAttempt++) {
      const targetSize = randInt(rng, difficulty.targetBlockCountMin, difficulty.targetBlockCountMax);
      shuffle(availableIndices, rng);
      const candidateIndices = availableIndices.slice(0, targetSize);
      const candidateSum = candidateIndices.reduce((sum, idx) => sum + blocks[idx].value, 0);

      if (candidateSum >= difficulty.minTarget && candidateSum <= difficulty.maxTarget) {
        const solutionBlockIds = candidateIndices.map((idx) => blocks[idx].id);
        const verifiedSolutions = findSolutions(blocks, candidateSum, maxBlockLen, 1);
        if (verifiedSolutions.length > 0) {
          return { gridSize: difficulty.gridSize, blocks, target: candidateSum, solutionBlockIds, maxTimeSeconds: difficulty.timeLimitSeconds };
        }
      }
    }
  }
  return getFallbackPuzzle(difficulty);
}

// === NEW MAIN FUNCTION — USE THIS EVERYWHERE ===
export function generatePuzzle(difficulty: DifficultyState, seed?: number): Puzzle {
  // Try up to 80 times to find an UNUSED target
  for (let i = 0; i < 80; i++) {
    const puzzle = generateOnePuzzle(difficulty, seed ? seed + i : undefined);
    if (!usedTargetsThisRun.has(puzzle.target)) {
      usedTargetsThisRun.add(puzzle.target);
      return puzzle;
    }
  }

  // Exhaustion: expand max beyond current level to find higher unused number
  const expandedDifficulty: DifficultyState = {
    ...difficulty,
    maxTarget: difficulty.maxTarget + 50,
    minTarget: difficulty.maxTarget + 1,
  };
  for (let high = 0; high < 50; high++) {
    const puzzle = generateOnePuzzle(expandedDifficulty, seed ? seed + 100 + high : undefined);
    if (!usedTargetsThisRun.has(puzzle.target)) {
      usedTargetsThisRun.add(puzzle.target);
      return puzzle;
    }
  }

  // Last resort — still return but add (should never happen)
  const fallback = generateOnePuzzle(difficulty, seed);
  usedTargetsThisRun.add(fallback.target);
  return fallback;
}

export function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}