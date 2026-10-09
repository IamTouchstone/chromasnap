# CHROMA SNAP

> **See the colours. Think fast. Tap the exact answer.**

CHROMA SNAP is an ultra-simple, fast colour-and-calculation puzzle game built with bold Swiss geometric minimalism and confident editorial typography.

---

## 🎮 Game Concept

1. A **target number** appears prominently at the top of the board.
2. A compact grid of coloured blocks appears below.
3. Every colour represents a fixed numerical value:
   - 🔴 **RED** = `1` (1 dot `•`)
   - 🔵 **BLUE** = `2` (2 dots `••`)
   - 🟡 **YELLOW** = `3` (3 dots `•••`)
   - 🟢 **GREEN** = `4` (4 dots `••••`)
   - 🟣 **PURPLE** = `5` (5 dots `•••••`)
4. The player taps a combination of blocks whose colour-values add up **exactly** to the target.
5. An exact match **instantly snaps**, scores, increments the streak, and presents the next puzzle with zero wait time.
6. The game organically adapts its difficulty (board size 3x3 → 4x4 → 5x5, target size, and response time) as the player masters the arithmetic loop.

---

## 🛠️ Tech Stack & Requirements

- **Framework**: React Native 0.86.2 with Expo SDK 57.0.9
- **Language**: TypeScript (`strict: true`)
- **State & Storage**: React Hooks & `@react-native-async-storage/async-storage` (with resilient in-memory fallback)
- **Audio**: `expo-av` with custom 16-bit 44.1kHz PCM sound effects (`tap.wav`, `correct.wav`, `streak.wav`, `mistake.wav`, `button.wav`)
- **Haptics**: `expo-haptics` with fail-safe error isolation
- **Orientation**: Portrait-locked (`portrait`)
- **Architecture**: Expo New Architecture ready (`newArchEnabled`)

---

## 🚀 How to Install & Run

### 1. Prerequisites
- Node.js `v20+` or `v24+`
- npm `v10+`
- Expo Go app on iOS or Android (compatible with SDK 57)

### 2. Install Dependencies
```bash
npm install
```

### 3. Verify Health & Compatibility
```bash
npx expo-doctor
```
*(All 21/21 checks pass)*

### 4. Run Critical Engine Tests (1,200 Puzzles)
```bash
npm run test:puzzles
```

### 5. Start the Development Server
```bash
npx expo start
```

---

## 📱 Testing with Expo Go

1. Install **Expo Go** (SDK 57) from the Google Play Store or Apple App Store.
2. Run `npx expo start` in the terminal.
3. Scan the generated QR code:
   - On Android: Scan directly inside the Expo Go app.
   - On iOS: Scan using the Camera app.

---

## 🤖 Building Android APK

CHROMA SNAP is configured with Android package `com.chromasnap.app` and adaptive icons.

To build a standalone Android APK using EAS Build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```
2. Log in to your Expo account:
   ```bash
   eas login
   ```
3. Configure and build:
   ```bash
   eas build -p android --profile preview
   ```
Or generate local Android project files:
   ```bash
   npx expo prebuild --platform android
   ```

---

## 📂 Project Structure

```
CHROMA/
├── assets/
│   ├── audio/           # 16-bit PCM WAV original sound effects
│   │   ├── tap.wav
│   │   ├── button.wav
│   │   ├── correct.wav
│   │   ├── streak.wav
│   │   └── mistake.wav
│   └── images/          # World-class geometric icons & splash assets
│       ├── icon.png
│       ├── adaptive-icon.png
│       ├── splash.png
│       └── favicon.png
├── components/          # Reusable UI components
│   ├── BlockView.tsx    # Single block with accessibility dots & spring physics
│   ├── BoardView.tsx    # Responsive grid layout (3x3, 4x4, 5x5)
│   ├── ChromaButton.tsx # High-contrast tactile action button
│   ├── ChromaEmblem.tsx # Signature geometric 5-colour logo mark
│   ├── HeaderBar.tsx    # Live score, streak counter, and ON FIRE indicator
│   ├── IconButton.tsx   # Audio, haptics, and navigation toggle icons
│   ├── TargetDisplay.tsx# Dominant target typography & live total display
│   └── TimerBar.tsx     # Clean horizontal progress countdown
├── game/                # Pure logic game engine
│   ├── constants.ts     # Colours, dot mappings, and palette definitions
│   ├── difficulty.ts    # Dynamic organic difficulty state machine
│   ├── generator.ts     # Guaranteed-solvable combination search engine & PRNG
│   ├── scoring.ts       # Deterministic scoring, speed bonuses & streaks
│   └── types.ts         # Complete TypeScript interfaces
├── screens/             # Dedicated screens
│   ├── GameScreen.tsx   # Core exact snap gameplay loop
│   ├── HomeScreen.tsx   # Minimalist title screen with best stats
│   ├── HowToPlayModal.tsx # Full accessibility legend & rules
│   ├── ResultsScreen.tsx# Post-session summary with stats breakdown
│   ├── SplashScreen.tsx # Under 1.5s geometric intro animation
│   └── TutorialScreen.tsx # Interactive onboarding (<20s)
├── scripts/
│   ├── generate-assets.js # PNG generator for icon and splash
│   ├── generate-audio.js  # PCM audio synthesis script
│   └── test-puzzles.js    # 1,200+ puzzle automated verification test
├── services/
│   ├── audio.ts         # Audio playback service with fail-safe error isolation
│   ├── haptics.ts       # Haptic feedback service
│   └── storage.ts       # Offline local storage persistence
├── app.json             # Expo application configuration
├── babel.config.js      # Babel preset configuration
├── package.json         # Pinned Expo SDK 57.0.9 & React Native 0.86.2
├── tsconfig.json        # TypeScript configuration
└── README.md
```

---

## ♿ Accessibility

- **Non-Colour Dependant**: Every colour is accompanied by a distinctive, subtle dot count pattern (`•` to `•••••`), ensuring complete learnability and colourblind accessibility.
- **Large Touch Targets**: All blocks exceed the minimum 44×44pt touch boundary.
- **Haptic & Sound Toggles**: Independent on/off toggles with persistent local storage.
- **Zero Flashing**: Avoids jarring flashing lights or rapid strobes.

---

## 🛡️ Error Handling & Offline First

- **Guaranteed Solvability**: Every puzzle generated is validated against a backtracking combination solver. If generation ever exhausts attempts, it safely falls back to a verified deterministic board.
- **Offline First**: Zero network requests, zero remote dependencies, zero account requirements.
- **Graceful Fallbacks**: Audio, haptics, and AsyncStorage failures are isolated in `try/catch` wrappers and will never crash or halt gameplay.

---

## ⚠️ Known Limitations

- Multi-finger simultaneous tapping is resolved sequentially to maintain atomic selection state integrity.
- In Expo Go development mode, native splash screen behavior may differ slightly from a standalone production APK build (as documented in Expo SDK 57 release notes).
