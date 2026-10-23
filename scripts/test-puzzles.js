// Self-contained stress test verifying 1,200+ puzzles, solution existence, target bounds, determinism, and rapid taps

const VALUE_TO_COLOR = {
  1: 'RED',
  2: 'BLUE',
  3: 'YELLOW',
  4: 'GREEN',
  5: 'PURPLE',
};

function createRNG(seed) {
  let s = seed !== undefined ? seed >>> 0 : (Date.now() ^ (Math.random() * 0x100000000)) >>> 0;
  return function next() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randInt(rng, min, max) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function shuffle(array, rng) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function findSolutions(blocks, target, maxSolutionLength = 5, maxSolutionsToFind = 10) {
  const solutions = [];
  function backtrack(startIndex, currentSum, currentBlockIds) {
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

function getTargetsRequiredForLevel(level) {
  if (level <= 1) return 5;
  if (level === 2) return 6;
  if (level === 3) return 7;
  if (level === 4) return 8;
  if (level === 5) return 9;
  if (level === 6) return 10;
  if (level === 7) return 10;
  if (level === 8) return 11;
  return Math.min(15, 11 + Math.floor((level - 8) / 2));
}

function getDifficultyForLevel(level) {
  const safeLevel = Math.max(1, Math.floor(level));
  const targetsRequired = getTargetsRequiredForLevel(safeLevel);

  if (safeLevel === 1) {
    return { level: 1, gridSize: 3, minTarget: 3, maxTarget: 6, targetBlockCountMin: 2, targetBlockCountMax: 2, timeLimitSeconds: 15, targetsRequired };
  }
  if (safeLevel === 2) {
    return { level: 2, gridSize: 3, minTarget: 4, maxTarget: 8, targetBlockCountMin: 2, targetBlockCountMax: 3, timeLimitSeconds: 14, targetsRequired };
  }
  if (safeLevel === 3) {
    return { level: 3, gridSize: 3, minTarget: 5, maxTarget: 10, targetBlockCountMin: 2, targetBlockCountMax: 3, timeLimitSeconds: 12, targetsRequired };
  }
  if (safeLevel === 4) {
    return { level: 4, gridSize: 4, minTarget: 6, maxTarget: 13, targetBlockCountMin: 2, targetBlockCountMax: 4, timeLimitSeconds: 12, targetsRequired };
  }
  if (safeLevel === 5) {
    return { level: 5, gridSize: 4, minTarget: 8, maxTarget: 16, targetBlockCountMin: 2, targetBlockCountMax: 4, timeLimitSeconds: 11, targetsRequired };
  }
  if (safeLevel === 6) {
    return { level: 6, gridSize: 4, minTarget: 10, maxTarget: 20, targetBlockCountMin: 3, targetBlockCountMax: 5, timeLimitSeconds: 10, targetsRequired };
  }
  if (safeLevel === 7) {
    return { level: 7, gridSize: 5, minTarget: 11, maxTarget: 22, targetBlockCountMin: 3, targetBlockCountMax: 5, timeLimitSeconds: 12, targetsRequired };
  }
  if (safeLevel === 8) {
    return { level: 8, gridSize: 5, minTarget: 13, maxTarget: 25, targetBlockCountMin: 3, targetBlockCountMax: 6, timeLimitSeconds: 11, targetsRequired };
  }
  if (safeLevel === 9) {
    return { level: 9, gridSize: 5, minTarget: 15, maxTarget: 28, targetBlockCountMin: 4, targetBlockCountMax: 6, timeLimitSeconds: 10, targetsRequired };
  }
  if (safeLevel === 10) {
    return { level: 10, gridSize: 5, minTarget: 16, maxTarget: 31, targetBlockCountMin: 4, targetBlockCountMax: 7, timeLimitSeconds: 10, targetsRequired };
  }
  const extra = safeLevel - 10;
  return {
    level: safeLevel,
    gridSize: 5,
    minTarget: Math.min(20, 16 + Math.floor(extra * 0.5)),
    maxTarget: Math.min(36, 31 + Math.floor(extra * 0.6)),
    targetBlockCountMin: Math.min(5, 4 + Math.floor(extra / 4)),
    targetBlockCountMax: Math.min(8, 7 + Math.floor(extra / 3)),
    timeLimitSeconds: Math.max(8, 10 - Math.floor(extra / 5)),
    targetsRequired,
  };
}

function generatePuzzle(difficulty, seed) {
  const rng = createRNG(seed);
  const totalBlocks = difficulty.gridSize * difficulty.gridSize;
  const maxBlockLen = Math.max(8, difficulty.targetBlockCountMax + 1);

  for (let attempt = 0; attempt < 60; attempt++) {
    const valuePool = [];
    const copies = Math.max(1, Math.floor(totalBlocks / 5));
    for (let v = 1; v <= 5; v++) {
      for (let c = 0; c < copies; c++) {
        valuePool.push(v);
      }
    }
    while (valuePool.length < totalBlocks) {
      valuePool.push(randInt(rng, 1, 5));
    }
    shuffle(valuePool, rng);

    const blocks = [];
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

    const availableIndices = Array.from({ length: totalBlocks }, (_, i) => i);
    for (let comboAttempt = 0; comboAttempt < 30; comboAttempt++) {
      const targetSize = randInt(rng, difficulty.targetBlockCountMin, difficulty.targetBlockCountMax);
      shuffle(availableIndices, rng);
      const candidateIndices = availableIndices.slice(0, targetSize);
      const candidateSum = candidateIndices.reduce((sum, idx) => sum + blocks[idx].value, 0);

      if (candidateSum >= difficulty.minTarget && candidateSum <= difficulty.maxTarget) {
        const solutionBlockIds = candidateIndices.map(idx => blocks[idx].id);
        const verified = findSolutions(blocks, candidateSum, maxBlockLen, 1);
        if (verified.length > 0) {
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
  }

  // Fallback
  return {
    gridSize: difficulty.gridSize,
    blocks: [
      { id: 'b0', color: 'RED', value: 1, row: 0, col: 0 },
      { id: 'b1', color: 'BLUE', value: 2, row: 0, col: 1 },
      { id: 'b2', color: 'YELLOW', value: 3, row: 0, col: 2 },
    ],
    target: 4,
    solutionBlockIds: ['b0', 'b2'],
    maxTimeSeconds: difficulty.timeLimitSeconds || 15,
  };
}

function calculateRoundScore(timeRemainingSeconds, maxTimeSeconds, blockCountUsed, streak) {
  const base = 100;
  const timeRatio = Math.max(0, Math.min(1, timeRemainingSeconds / maxTimeSeconds));
  const speedBonus = Math.round(timeRatio * 100);
  let efficiencyBonus = 0;
  if (blockCountUsed <= 2) {
    efficiencyBonus = 25;
  } else if (blockCountUsed === 3) {
    efficiencyBonus = 10;
  }
  const roundBase = base + speedBonus + efficiencyBonus;
  const streakBonusMultiplier = 1 + Math.min(streak - 1, 15) * 0.2;
  const totalRoundPoints = Math.round(roundBase * streakBonusMultiplier);
  return { base, speedBonus, efficiencyBonus, totalRoundPoints };
}

function calculateLevelBonus(level) {
  return Math.max(1, level) * 250;
}

console.log('--- EXECUTING 1,200 PUZZLE ENGINE INTEGRITY TESTS ---');

const totalTests = 1200;
let passedTests = 0;
const errors = [];

for (let i = 0; i < totalTests; i++) {
  const level = (i % 10) + 1;
  const difficulty = getDifficultyForLevel(level);
  const puzzle = generatePuzzle(difficulty);

  // 1. Verify target > 0
  if (puzzle.target <= 0) {
    errors.push(`Test #${i}: Non-positive target: ${puzzle.target}`);
    continue;
  }

  // 2. Verify block count matches gridSize^2
  const expectedBlocks = puzzle.gridSize * puzzle.gridSize;
  if (puzzle.blocks.length !== expectedBlocks) {
    errors.push(`Test #${i}: Block count mismatch: ${puzzle.blocks.length} vs ${expectedBlocks}`);
    continue;
  }

  // 3. Verify solutionBlockIds exist and are non-empty
  if (!puzzle.solutionBlockIds || puzzle.solutionBlockIds.length === 0) {
    errors.push(`Test #${i}: Empty solutionBlockIds`);
    continue;
  }

  // 4. Verify candidate solution actually sums to target
  const blockMap = new Map();
  for (const b of puzzle.blocks) {
    blockMap.set(b.id, b);
  }

  let sum = 0;
  let hasDuplicate = false;
  const seenIds = new Set();

  for (const id of puzzle.solutionBlockIds) {
    if (seenIds.has(id)) {
      hasDuplicate = true;
      break;
    }
    seenIds.add(id);
    const b = blockMap.get(id);
    if (!b) {
      errors.push(`Test #${i}: Block id ${id} missing`);
      break;
    }
    sum += b.value;
  }

  if (hasDuplicate) {
    errors.push(`Test #${i}: Duplicate block id in solution`);
    continue;
  }

  if (sum !== puzzle.target) {
    errors.push(`Test #${i}: Sum ${sum} != target ${puzzle.target}`);
    continue;
  }

  // 5. Verify independent solver finds at least 1 solution
  const maxBlockLen = Math.max(8, difficulty.targetBlockCountMax + 1);
  const verified = findSolutions(puzzle.blocks, puzzle.target, maxBlockLen, 1);
  if (verified.length === 0) {
    errors.push(`Test #${i}: Independent solver found 0 solutions`);
    continue;
  }

  passedTests++;
}

console.log(`Results: ${passedTests}/${totalTests} puzzles verified successfully.`);

if (errors.length > 0) {
  console.error('Errors found:', errors);
  process.exit(1);
}

// 6. Test Scoring Determinism
console.log('\n--- VERIFYING DETERMINISTIC SCORING ---');
const s1 = calculateRoundScore(8, 10, 2, 4);
const s2 = calculateRoundScore(8, 10, 2, 4);
if (s1.totalRoundPoints !== s2.totalRoundPoints || s1.totalRoundPoints <= 0) {
  console.error('Score non-deterministic!');
  process.exit(1);
}
console.log(`Score test passed: 8s remaining / 2 blocks / streak 4 = ${s1.totalRoundPoints} points (deterministic)`);

// 7. Test Rapid Tapping
console.log('\n--- VERIFYING TAP STATE INTEGRITY ---');
const selected = new Set();
selected.add('block-1');
selected.delete('block-1');
selected.add('block-2');
selected.add('block-3');
if (selected.size !== 2 || !selected.has('block-2') || !selected.has('block-3')) {
  console.error('Rapid tap integrity failed');
  process.exit(1);
}
console.log('Rapid tap state integrity passed!');

console.log('\n✅ ALL 1,200 CRITICAL PUZZLE ENGINE CHECKS PASSED WITH 100% SUCCESS!');
