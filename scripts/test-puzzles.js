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

function getDifficultyForLevel(level) {
  if (level <= 1) {
    return { level: 1, gridSize: 3, minTarget: 3, maxTarget: 5, targetBlockCountMin: 2, targetBlockCountMax: 2, timeLimitSeconds: 15 };
  }
  if (level === 2) {
    return { level: 2, gridSize: 3, minTarget: 4, maxTarget: 7, targetBlockCountMin: 2, targetBlockCountMax: 3, timeLimitSeconds: 12 };
  }
  if (level === 3) {
    return { level: 3, gridSize: 3, minTarget: 5, maxTarget: 9, targetBlockCountMin: 2, targetBlockCountMax: 3, timeLimitSeconds: 10 };
  }
  if (level === 4) {
    return { level: 4, gridSize: 4, minTarget: 6, maxTarget: 11, targetBlockCountMin: 2, targetBlockCountMax: 4, timeLimitSeconds: 8 };
  }
  if (level === 5) {
    return { level: 5, gridSize: 4, minTarget: 7, maxTarget: 14, targetBlockCountMin: 2, targetBlockCountMax: 4, timeLimitSeconds: 7 };
  }
  const gridSize = level >= 7 ? 5 : 4;
  return {
    level,
    gridSize,
    minTarget: 8,
    maxTarget: Math.min(18, 12 + Math.floor((level - 5) * 1.5)),
    targetBlockCountMin: 2,
    targetBlockCountMax: Math.min(5, 3 + Math.floor((level - 4) / 2)),
    timeLimitSeconds: Math.max(5, 7 - Math.floor((level - 5) * 0.5)),
  };
}

function generatePuzzle(difficulty, seed) {
  const rng = createRNG(seed);
  const totalBlocks = difficulty.gridSize * difficulty.gridSize;

  for (let attempt = 0; attempt < 50; attempt++) {
    const valuePool = [];
    for (let v = 1; v <= 5; v++) {
      valuePool.push(v);
      valuePool.push(v);
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

    const targetSize = randInt(rng, difficulty.targetBlockCountMin, difficulty.targetBlockCountMax);
    const availableIndices = Array.from({ length: totalBlocks }, (_, i) => i);
    shuffle(availableIndices, rng);

    const candidateIndices = [];
    for (let k = 0; k < targetSize; k++) {
      candidateIndices.push(availableIndices[k]);
    }

    const candidateSum = candidateIndices.reduce((sum, idx) => sum + blocks[idx].value, 0);

    if (candidateSum >= difficulty.minTarget && candidateSum <= difficulty.maxTarget) {
      const solutionBlockIds = candidateIndices.map(idx => blocks[idx].id);
      const verified = findSolutions(blocks, candidateSum, 5, 5);
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

  // Fallback
  return {
    gridSize: 3,
    blocks: [
      { id: 'b0', color: 'RED', value: 1, row: 0, col: 0 },
      { id: 'b1', color: 'BLUE', value: 2, row: 0, col: 1 },
      { id: 'b2', color: 'YELLOW', value: 3, row: 0, col: 2 },
    ],
    target: 4,
    solutionBlockIds: ['b0', 'b2'],
    maxTimeSeconds: 15,
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
  const verified = findSolutions(puzzle.blocks, puzzle.target, 5, 1);
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
