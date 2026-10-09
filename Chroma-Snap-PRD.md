# CHROMA SNAP
## Product Requirements Document (PRD)
### Build-ready specification for Antigravity AI
### Target: Expo SDK 57.0.9 / React Native 0.86.2 / Android APK / GitHub

---

# 1. PRODUCT SUMMARY

## Product Name
CHROMA SNAP

## Product Type
Ultra-simple, fast colour-and-calculation puzzle game.

## Core promise
See the colours. Think fast. Tap the exact answer.

CHROMA SNAP is designed to look extremely simple while creating a surprisingly demanding mental loop:

1. A target number appears.
2. A compact grid of coloured blocks appears.
3. Every colour secretly represents a fixed value.
4. The player taps a combination of blocks whose colour-values add exactly to the target.
5. A correct answer instantly clears, scores, increases the streak, and presents the next puzzle.
6. The game becomes gradually faster and more demanding without introducing complicated mechanics.

The game must be understandable within seconds and playable with one finger.

The experience should work for a very young child who simply enjoys tapping colours and visual feedback, while offering enough speed, memory and arithmetic pressure to challenge an older child, adult, or 100-year-old player.

IMPORTANT:
- Do not create a conventional match-3 game.
- Do not copy an existing colour puzzle game.
- Do not add unnecessary game modes.
- Do not add a complicated economy.
- Do not add fake/placeholder features.
- Do not add accounts, chat, multiplayer, shops, coins, gems, skins, battle passes, or ads in this MVP.
- The entire product is built around one excellent game loop.

---

# 2. PRODUCT VISION

Create a game that can be understood without reading instructions but becomes increasingly addictive because the player keeps thinking:

"I know I can beat that."

The visual language should be premium, iconic and extremely clean.

Design ambition:
- World-class identity.
- Bold geometric colour.
- Extremely strong typography.
- Minimal interface.
- Excellent spacing.
- Tactile interactions.
- Instant feedback.
- No visual clutter.
- No generic mobile-game appearance.
- No excessive gradients.
- No cartoon overload.
- No cheap neon effects.
- No stock illustrations.

The design direction should feel like a sophisticated international design studio created a small game with enormous confidence.

Do NOT imitate Paula Scher's exact work or copy any existing identity. Instead, use the high-level principles associated with exceptional graphic design:
- bold typography
- confident geometry
- strong composition
- simple shapes
- unexpected scale
- disciplined colour
- memorable visual identity
- information hierarchy
- visual rhythm

---

# 3. TARGET USERS

Primary:
- Children who can tap and recognise colours.
- Teenagers.
- Adults.
- Older adults.
- Casual puzzle players.
- People who want a 30-second mental challenge.

Accessibility goal:
The game must remain visually obvious and touch-friendly for users with slower reaction times or reduced dexterity.

The game must not depend on:
- reading long text
- complex navigation
- precise tiny taps
- advanced arithmetic
- fast swiping
- multiple fingers
- complicated gestures

---

# 4. THE CORE GAME: "EXACT SNAP"

## Basic concept

The board contains coloured square blocks.

Each colour has a permanent numerical value.

Example:

RED = 1
BLUE = 2
YELLOW = 3
GREEN = 4
PURPLE = 5

These values should NOT need to be displayed constantly during normal gameplay.

The player sees:

TARGET
= 8

Then sees a board such as:

RED   GREEN   BLUE
PURPLE RED    YELLOW
BLUE  GREEN   RED

The player must quickly select blocks whose hidden values total exactly 8.

Example:
GREEN (4) + PURPLE (5) = 9 -> wrong.
GREEN (4) + BLUE (2) + RED (1) + RED (1) = 8 -> correct.

When the correct combination is selected:
- selected blocks snap inward,
- board performs a short satisfying animation,
- score increases,
- streak increases,
- next target appears immediately.

The player should never wait through a long transition.

---

# 5. WHY THE GAME IS ENGAGING

The game combines:

## Visual recognition
The player recognises colours instantly.

## Memory
The player remembers the value assigned to each colour.

## Mental arithmetic
The player mentally combines values.

## Search
The player scans the board for a useful combination.

## Speed
The player tries to solve before the timer expires.

## Risk/reward
The player can answer quickly for a better streak or carefully avoid a mistake.

## Progressive mastery
The same simple rule becomes harder because:
- targets increase,
- board size changes,
- colours become less conveniently positioned,
- solution combinations become less obvious,
- time pressure gradually increases.

There should be no need to keep adding features to create depth.

---

# 6. COLOUR-VALUE SYSTEM

Use exactly five primary gameplay colours.

Recommended values:

RED = 1
BLUE = 2
YELLOW = 3
GREEN = 4
PURPLE = 5

Use colour values consistently throughout the game.

Do not randomly change the meaning of a colour.

The player should gradually internalise:

1 = RED
2 = BLUE
3 = YELLOW
4 = GREEN
5 = PURPLE

However, colour must NOT be the only accessibility signal.

Each block should also contain a very subtle value indicator that does not visually dominate the block:
- 1 small dot for value 1
- 2 small dots for value 2
- 3 small dots for value 3
- 4 small dots for value 4
- 5 small dots for value 5

This allows colour-blind players to distinguish values and also makes the game learnable.

Do not display large numbers inside normal blocks.

---

# 7. BOARD

Default starting board:
3 x 3

Intermediate board:
4 x 4

Advanced board:
5 x 5

The player does NOT manually select difficulty.

Difficulty is automatically controlled by the game.

The first rounds should be extremely forgiving.

As the player demonstrates competence:
- board can increase from 3x3 to 4x4,
- targets can increase,
- solution combinations can become longer,
- response time can gradually shorten.

Do not make the board feel unfair.

Every generated puzzle MUST have at least one valid solution.

The game engine must verify the solution before displaying the puzzle.

---

# 8. TARGET SYSTEM

At the top of the gameplay screen:

TARGET
8

The target must be visually dominant.

Use extremely large typography.

Target values should start low.

Example progression:

Level 1:
Targets 3-5

Level 2:
Targets 4-7

Level 3:
Targets 5-9

Level 4:
Targets 6-12

Later:
Targets dynamically generated from available board values.

Do not allow impossible targets.

Do not allow a target that requires an unreasonable number of blocks.

Preferred solution length:
2-4 blocks.

Occasionally:
5 blocks at higher difficulty.

---

# 9. ROUND FLOW

Every round:

1. Show target.
2. Board appears immediately.
3. Player taps blocks.
4. Selected blocks receive strong visual selection feedback.
5. Current total is shown subtly below the target.
6. If current total equals target:
   - trigger success immediately.
7. If current total exceeds target:
   - selected blocks shake very briefly,
   - total flashes,
   - player can deselect and continue.
8. If timer reaches zero:
   - round ends,
   - show correct solution briefly,
   - player taps once to continue.
9. New board loads instantly.

No loading screen between rounds.

---

# 10. SELECTION BEHAVIOUR

When a player taps a block:

Selected:
- block scales up approximately 1.04x
- a crisp outline appears
- tiny confirmation animation
- selected state remains obvious

Tapped again:
- block deselects.

The current selected total appears as:

TOTAL 7

When the selected total equals the target:

TOTAL 8 ✓

Immediately complete the round.

Do NOT require the player to press a separate "SUBMIT" button.

This is essential to making the game fast and satisfying.

---

# 11. TIMER

The timer should not look like a conventional complicated countdown.

Use a simple visual ring or horizontal progress line around/under the target.

Early game:
generous timing.

As skill increases:
slightly shorter timing.

Example:
Beginner: 15 seconds
Early intermediate: 10 seconds
Intermediate: 8 seconds
Advanced: 6 seconds
Expert: 5 seconds

Do not suddenly create impossible reaction requirements.

The timer should create pressure, not frustration.

---

# 12. SCORING

Keep scoring extremely simple.

Base score:
+100 for a correct solution.

Speed bonus:
+0 to +100 based on remaining time.

Efficiency bonus:
+25 for solving with fewer blocks.

Streak:
Consecutive correct answers increase the streak.

Example:

SCORE
2,450

STREAK
×7

Do not introduce coins, gems, XP, currencies or upgrade systems.

---

# 13. COMBO / STREAK

The streak is one of the main psychological rewards.

Examples:

1 correct = ×1
2 correct = ×2
3 correct = ×3
...
10+ = "ON FIRE"

Streak should visually intensify without becoming noisy.

A high streak should feel prestigious.

If the player fails:
- streak resets to zero.
- Do not punish with lost points.
- Immediately allow another attempt.

---

# 14. DIFFICULTY ADAPTATION

The game should automatically adapt.

Track:
- average solve time
- recent accuracy
- current streak
- number of selected blocks
- number of failed rounds

If player is consistently fast:
increase difficulty.

If player is repeatedly failing:
reduce difficulty.

Never show a menu saying:
"Easy / Medium / Hard."

The player should simply play.

The game should feel like it knows when to challenge them.

---

# 15. AGE-FRIENDLY DESIGN

The game should be playable by a child who cannot perform the intended arithmetic yet.

Therefore:

The earliest rounds must visually teach the relationship between colour and value.

Example:
RED = •
BLUE = ••
YELLOW = •••
GREEN = ••••
PURPLE = •••••

During the first learning rounds:
- targets are very small,
- solutions are obvious,
- timer is generous,
- feedback is celebratory.

After the player demonstrates repeated success, the game gradually reduces the visibility of the value hints.

For very young users, tapping a block should still produce:
- sound,
- animation,
- colour reaction,
- satisfying tactile feedback.

The game must be fun even before the player fully understands the mathematics.

---

# 16. ONBOARDING

No long tutorial.

The first launch should feel like the game itself is teaching the player.

SCREEN 1:
Logo only.

SCREEN 2:
One simple statement:

"MAKE THE NUMBER."

SCREEN 3:
Show three coloured blocks.

RED = 1
BLUE = 2
YELLOW = 3

Target:
4

Show:
RED + YELLOW = 4

Then:

"YOUR TURN"

Immediately enter gameplay.

The tutorial should take less than 20 seconds.

A player should be able to skip it.

---

# 17. SPLASH SCREEN

Create an exceptional branded splash screen.

Background:
near-black / deep charcoal.

Centre:
CHROMA SNAP wordmark.

Above or beside wordmark:
a simple geometric four-block/square symbol.

Animation:
- four blocks appear one by one,
- align,
- compress into the logo,
- wordmark fades in,
- transition directly into the game.

Keep animation under 1.5 seconds.

No loading percentage.

No "Powered by..." text.

No developer branding.

No unnecessary legal text.

IMPORTANT:
Expo Go's development splash experience does not fully reproduce the final standalone splash-screen behaviour; therefore the actual release splash configuration must still be implemented correctly even though testing in Expo Go may show limitations. Expo documents this behaviour explicitly. citeturn0search4

---

# 18. HOME SCREEN

Extremely minimal.

Top:
CHROMA SNAP logo.

Centre:
large PLAY button.

Below:
BEST
12,450

Bottom:
small icons/buttons for:
- Sound
- Haptics
- How to Play

Nothing else.

No account button.

No profile.

No shop.

No social feed.

No news.

No banner ads.

No unnecessary navigation bar.

The player should reach gameplay with one tap.

---

# 19. GAMEPLAY SCREEN

Hierarchy:

TOP:
Score + streak

CENTRE TOP:
TARGET
large number

CENTRE:
3x3 / 4x4 / 5x5 colour block grid

BELOW GRID:
selected total

BOTTOM:
timer

The board must occupy the majority of the screen.

All important controls must be reachable with one hand.

---

# 20. ROUND SUCCESS ANIMATION

When correct:

1. Selected blocks briefly brighten.
2. Selected blocks snap toward the centre.
3. Target number performs a small scale animation.
4. A crisp "✓" appears for approximately 250ms.
5. Score increments.
6. Streak increments.
7. Next board appears.

Total animation time:
under 500ms.

The player must feel:

"I got it."

Then immediately:

"What's next?"

---

# 21. ROUND FAILURE

When time expires:

- board freezes.
- Correct blocks are highlighted for 1 second.
- Target changes to a soft failure state.
- Streak resets.
- Show:

"TRY AGAIN"

Then:

"PLAY"

Do not create a complicated game-over screen.

The player should be back in action almost immediately.

---

# 22. SESSION END

There is no traditional game-over campaign.

A session ends when the player chooses to stop.

When the player exits a run, show:

SCORE
12,450

BEST
18,720

STREAK
14

Then a large:

PLAY AGAIN

and a smaller:

HOME

Keep it extremely clean.

---

# 23. DAILY RETENTION WITHOUT COMPLEX FEATURES

For MVP, do NOT build accounts or online infrastructure.

Use local device storage.

Persist:
- best score
- highest streak
- games played
- total correct
- personal best solve time

Optional lightweight daily challenge:

Once per calendar day, the first game can use a predetermined daily seed.

The daily challenge is still the same game.

Do not add:
- leaderboards
- login
- cloud sync
- friends
- social profiles

These are explicitly out of MVP.

---

# 24. AUDIO

Audio must be subtle and premium.

Use short original/simple sound effects:

Block tap:
soft click

Correct:
bright two-tone confirmation

Streak:
slightly stronger confirmation

Failure:
soft low click

Button:
short tactile click

Do not use:
- loud arcade sounds
- casino sounds
- annoying loops
- copyrighted music

Provide Sound On/Off.

---

# 25. HAPTICS

Use light haptic feedback.

Tap:
light impact.

Correct:
medium success feedback.

Mistake:
light warning feedback.

Haptics can be turned off.

Use Expo-compatible packages only.

---

# 26. VISUAL DESIGN SYSTEM

## Overall style

Premium Swiss/editorial-inspired geometry mixed with contemporary game design.

The interface should feel like:
- a modern design museum poster,
- a premium sports brand,
- a world-class puzzle game.

Not:
- children's educational software,
- generic casino game,
- cheap arcade game,
- cluttered mobile game.

## Typography

Use one excellent geometric sans-serif family available through a compatible package or system-safe font.

Typography must be:
- bold,
- highly legible,
- oversized for important numbers,
- restrained elsewhere.

Do not use decorative fonts.

## Shapes

Use:
- squares,
- rounded squares,
- circles only when needed,
- strong grid alignment.

Avoid excessive rounded cards.

## Background

Use a very dark neutral background.

Gameplay colour blocks should provide almost all of the colour.

---

# 27. COLOUR PALETTE

Background:
#101010

Primary text:
#FFFFFF

Secondary text:
#A7A7A7

RED:
#FF3B30

BLUE:
#2F80FF

YELLOW:
#FFD60A

GREEN:
#34C759

PURPLE:
#AF52DE

Success:
#FFFFFF or a restrained bright accent.

Do not add additional gameplay colours.

Do not use gradients on the main blocks.

---

# 28. ACCESSIBILITY

Minimum touch target:
44 x 44 points.

Prefer larger touch targets.

Do not depend solely on colour.

Every gameplay colour must have:
- unique value,
- subtle dot-count pattern,
- distinct shape treatment if necessary.

Text must have strong contrast.

Support:
- reduced motion preference where practical,
- sound off,
- haptics off.

Avoid flashing effects.

No rapid strobe effects.

---

# 29. GAME ENGINE REQUIREMENTS

The game engine must generate valid puzzles.

For every board:

1. Generate a board.
2. Select a valid combination of blocks.
3. Calculate its total.
4. Set that total as the target.
5. Verify the solution.
6. Optionally verify that at least one alternate solution exists at selected difficulty levels.
7. Present the puzzle.

Never present an impossible puzzle.

Avoid repeatedly generating the same board.

Avoid obvious repeated patterns.

Use a deterministic seed for the daily challenge.

---

# 30. PUZZLE GENERATION

Implement a reliable combination-search algorithm.

Pseudo-logic:

generateBoard()
generate candidate block values
select target from valid combination
verify target
return board + target + solution

For 3x3 boards:
Use a small bounded search.

For 4x4 and 5x5:
Use efficient combination generation.

Do not use an unnecessarily complex algorithm.

The game is local and does not require a server.

---

# 31. GAME STATE

Core state:

score
bestScore
streak
bestStreak
target
board
selectedBlocks
selectedTotal
timeRemaining
difficulty
roundNumber
soundEnabled
hapticsEnabled
tutorialComplete

Persist only necessary local values.

Do not create unnecessary global state.

---

# 32. DATA STORAGE

Use a lightweight Expo-compatible local persistence solution.

Store:

{
  "bestScore": 0,
  "bestStreak": 0,
  "gamesPlayed": 0,
  "correctAnswers": 0,
  "bestSolveTime": null,
  "soundEnabled": true,
  "hapticsEnabled": true,
  "tutorialComplete": false,
  "dailySeedDate": null
}

No remote database in MVP.

---

# 33. NAVIGATION

Keep navigation minimal.

Screens:

1. Splash
2. Home
3. Tutorial
4. Game
5. Results
6. How to Play

No nested navigation system is required.

Use Expo-compatible navigation only if actually necessary.

Avoid adding a large navigation dependency simply for a few screens.

---

# 34. BUTTON DESIGN

PLAY:
Large, bold, high contrast.

HOME:
Simple icon + label.

SOUND:
Icon only with accessible label.

HAPTICS:
Icon only with accessible label.

HOW TO PLAY:
Small but readable.

Buttons must have:
- pressed state,
- subtle scale response,
- clear accessibility labels.

No tiny text buttons.

---

# 35. ICONOGRAPHY

Use simple geometric icons.

If an icon library is used, it must be Expo SDK 57-compatible.

Do not download random icon packages.

Avoid icons that look inconsistent.

---

# 36. PERFORMANCE

Performance is critical.

Target:
60 FPS interaction.

The game should feel instant on mid-range Android phones.

Avoid:
- heavy image assets,
- video backgrounds,
- large animation libraries,
- unnecessary network requests,
- WebViews,
- complex 3D rendering.

Use lightweight React Native views and simple animations.

If Reanimated is used, use the version compatible with Expo SDK 57. Do not install arbitrary versions.

Expo SDK 57 uses React Native 0.86; dependencies must be aligned with the SDK. Expo recommends using `expo install` / `expo-doctor` to keep package versions compatible. citeturn0search0turn0search7

---

# 37. EXPO SDK REQUIREMENTS

HARD REQUIREMENT:

Use:

expo: 57.0.9

Target:
React Native 0.86.2

The project must be compatible with Expo Go for SDK 57.0.9.

Do not upgrade to Expo SDK 58.

Do not use SDK 56.

Do not use canary packages.

Do not mix Expo SDK versions.

Do not install native packages that require a custom development client unless absolutely necessary.

Prefer packages included or supported by Expo Go.

Expo SDK 57 is officially paired with React Native 0.86, and Expo's SDK 57 changelog identifies `expo@57.0.9` as the point release resolving a Hermes memory regression. citeturn0search0turn0search1

---

# 38. PACKAGE MANAGEMENT

Use npm.

Before finishing:

npm install

npx expo install --fix

npx expo-doctor

Resolve all compatibility warnings that affect SDK 57.

Do not blindly upgrade dependencies.

package.json must remain coherent around Expo 57.0.9.

---

# 39. GITHUB REQUIREMENTS

The project must be GitHub-ready.

Create:

README.md
.gitignore

Do not commit:
- node_modules
- .expo
- local secrets
- generated APKs unless explicitly requested
- temporary files
- machine-specific configuration

README must include:

Project name
Game concept
Tech stack
Expo SDK version
How to install
How to run
How to test with Expo Go
How to build Android
Project structure
Known limitations

---

# 40. PROJECT STRUCTURE

Use a clean structure similar to:

/
  app/
  assets/
    audio/
    images/
  components/
  game/
    generator/
    scoring/
    difficulty/
  hooks/
  storage/
  theme/
  utils/
  app.json
  package.json
  README.md
  .gitignore

Do not create dozens of unnecessary files.

Keep the code understandable.

---

# 41. TYPESCRIPT

Use TypeScript.

Define clear types for:

Block
Board
Puzzle
GameState
DifficultyState
StoredSettings

Avoid `any` unless absolutely necessary.

No obvious TypeScript errors.

---

# 42. APP CONFIGURATION

Configure:

name:
Chroma Snap

slug:
chroma-snap

version:
1.0.0

Android package:
choose a valid unique reverse-domain identifier and keep it consistent.

Set:

orientation:
portrait

User interface:
portrait-first

Use an appropriate app icon.

Use a proper splash configuration.

---

# 43. APP ICON

Create a world-class icon.

Concept:

A compact geometric arrangement of five colour blocks forming a distinctive snap/grid symbol.

No tiny text.

No words.

Must remain recognisable at small size.

Use the five gameplay colours.

The icon must feel like a premium game brand rather than a generic colour-square icon.

---

# 44. SPLASH / BRAND ASSETS

Create actual assets.

Do not use placeholders such as:
- logo-placeholder.png
- icon-placeholder.png
- sample.png

All referenced assets must exist.

If an asset cannot be generated programmatically, create a clean vector-style equivalent using available project-safe methods.

No broken image references.

---

# 45. ERROR HANDLING

The app must never crash because of an invalid puzzle.

If puzzle generation unexpectedly fails:
- regenerate safely,
- fall back to a known-valid deterministic puzzle.

If local storage fails:
- continue gameplay,
- use in-memory defaults.

If audio fails:
- gameplay must continue.

If haptics fail:
- gameplay must continue.

The core game must never depend on audio, haptics or storage.

---

# 46. OFFLINE-FIRST

The game must work completely offline.

No internet connection required for:
- launching,
- playing,
- scoring,
- saving best score,
- daily challenge generation.

Do not add analytics SDKs in MVP.

Do not add authentication.

---

# 47. NO PLACEHOLDERS

The final build must contain:

- final app name
- final visual identity
- final colour system
- final splash
- final icon
- final UI
- final game engine
- final sound/haptic behaviour
- final empty states
- final buttons
- final text

There must be no:

"Coming soon"
"Lorem ipsum"
"Placeholder"
"Feature coming soon"
"Sample text"
"TODO"

---

# 48. NO UNNECESSARY FEATURES

Explicitly exclude:

- user accounts
- login
- signup
- social media
- multiplayer
- chat
- online leaderboard
- friends
- messaging
- shop
- coins
- gems
- subscriptions
- ads
- battle pass
- character skins
- avatars
- inventory
- cloud database
- complicated achievements
- push notifications
- complicated settings

MVP success depends on making the core game exceptional.

---

# 49. MICRO-INTERACTIONS

Every action should feel intentional.

Button tap:
subtle scale down/up.

Block tap:
small scale response.

Correct:
snap + bright confirmation.

Streak:
small rhythmic emphasis.

Score increase:
number rolls or scales subtly.

New target:
quick entrance animation.

Do not animate everything.

Animation should communicate action, not decoration.

---

# 50. GAME FEEL

The most important quality is "snap".

Everything should feel:
- quick
- precise
- tactile
- responsive
- clean

The player should never wonder:
"Did my tap register?"

The game should answer immediately.

---

# 51. SOUND DESIGN

If audio assets are needed, use short local files.

Do not stream audio.

Do not use copyrighted sounds.

Keep file sizes small.

Provide:
tap.wav
correct.wav
streak.wav
mistake.wav
button.wav

If actual audio files are not generated during implementation, use a safe Expo-compatible system-generated feedback approach rather than leaving missing file references.

---

# 52. TESTING REQUIREMENTS

Before declaring complete, test:

Launch
Splash
Home
Play
Tutorial
First puzzle
Block selection
Block deselection
Correct answer
Wrong selection
Target exceeded
Timer expiration
Streak
Score
Best score
Results
Play Again
Home
Sound toggle
Haptics toggle
How to Play
App restart
Offline play
Storage persistence
Screen rotation behaviour
Small Android screen
Large Android screen
Back button
Fast repeated tapping

---

# 53. CRITICAL GAME TESTS

Test at least 1,000 generated puzzles programmatically.

Verify:
- every puzzle has a valid solution,
- target is reachable,
- no target is negative,
- no empty solution,
- no impossible puzzle,
- solution size stays within configured range,
- no duplicate block selection,
- scoring is deterministic.

Test rapid tapping.

Test simultaneous-looking taps.

Ensure selection state cannot become corrupted.

---

# 54. ACCESSIBILITY TESTS

Verify:
- large touch areas,
- readable target,
- high contrast,
- colour + dot differentiation,
- no essential information communicated only by colour,
- sound can be disabled,
- haptics can be disabled.

---

# 55. EXPO GO TESTING

The app must run using the SDK 57 version of Expo Go.

Developer workflow:

npm install

npx expo start

Open the project in Expo Go SDK 57.

If a version mismatch appears:
- verify Expo version,
- verify React Native version,
- run `npx expo install --fix`,
- run `npx expo-doctor`,
- remove incompatible packages,
- clear Metro cache.

Do not solve version mismatch by randomly changing package versions.

Expo's documentation specifically recommends keeping React Native aligned with the Expo SDK and using `expo-doctor` / `expo install --fix` when upgrading or resolving mismatches. citeturn0search7

---

# 56. ANDROID APK

The project must be structured so an Android APK can be produced.

Use Expo-compatible Android configuration.

The app must launch correctly on Android.

Do not require:
- custom native modules,
- manual Android Studio modifications,
- undocumented native patches.

If an APK build configuration is added, keep it compatible with the SDK 57 project.

---

# 57. QUALITY BAR

Do not consider the task complete simply because the app runs.

It is complete only when:

1. It looks premium.
2. The core game is immediately understandable.
3. The first round is fun.
4. Correct answers feel satisfying.
5. The difficulty grows naturally.
6. Puzzle generation is reliable.
7. Touch response is instant.
8. No screen feels unfinished.
9. No placeholders exist.
10. Expo SDK 57.0.9 compatibility is maintained.
11. GitHub repository is clean.
12. Android testing works.
13. Offline gameplay works.

---

# 58. ACCEPTANCE CRITERIA

## Launch
PASS if app opens without errors.

## Branding
PASS if splash and home screen look like a finished commercial product.

## Gameplay
PASS if a new player can understand the basic interaction within one round.

## Puzzle engine
PASS if every displayed target has a valid solution.

## Responsiveness
PASS if taps visibly respond immediately.

## Difficulty
PASS if the first rounds are accessible and later rounds require progressively faster thinking.

## Accessibility
PASS if the game can be played without relying solely on colour perception.

## Offline
PASS if airplane mode does not prevent gameplay.

## Persistence
PASS if best score remains after app restart.

## Expo
PASS if project runs in Expo Go SDK 57 without native dependency errors.

## Repository
PASS if the repository contains no secrets, node_modules, broken references, or placeholder assets.

---

# 59. IMPLEMENTATION ORDER FOR ANTIGRAVITY

Build in this order:

PHASE 1
Project setup
- Expo SDK 57.0.9
- TypeScript
- portrait
- GitHub-ready structure

PHASE 2
Design system
- typography
- colours
- spacing
- buttons
- blocks
- logo
- icon

PHASE 3
Core game engine
- board generation
- target generation
- solution verification
- selection
- scoring
- timer

PHASE 4
Game feel
- animations
- sound
- haptics
- streak

PHASE 5
Screens
- splash
- home
- tutorial
- game
- results
- how to play

PHASE 6
Persistence
- best score
- streak
- settings
- tutorial state

PHASE 7
Testing
- puzzle stress testing
- UI testing
- Android testing
- Expo Go testing

PHASE 8
Final polish
- remove dead code
- remove placeholders
- remove unused dependencies
- fix all warnings
- verify GitHub cleanliness

---

# 60. ANTIGRAVITY MASTER BUILD INSTRUCTION

Build CHROMA SNAP exactly according to this PRD.

Do not reinterpret the core game mechanic.

Do not add extra features simply because they are common in mobile games.

The most important requirement is quality of execution.

The final result must feel like a small, premium, globally marketable puzzle game.

The game must be playable within seconds of launch.

The player must never be forced through a long tutorial.

The player must never need an account.

The player must never need internet access.

The player must never encounter placeholder content.

Keep the codebase compact and maintainable.

Use Expo SDK 57.0.9 exactly.

Keep all dependencies compatible with Expo SDK 57.0.9 and React Native 0.86.2.

Do not upgrade Expo.

Do not introduce custom native dependencies unless they are confirmed compatible with Expo Go SDK 57.

Use TypeScript.

Use local persistence only.

Build the complete functioning game, not a prototype.

After implementation, run the equivalent of:

npm install
npx expo install --fix
npx expo-doctor

Resolve relevant errors and compatibility warnings.

Then verify:

npx expo start

The final project must be ready to place in a GitHub repository and continue development from there.

---

# 61. FINAL DESIGN PRINCIPLE

LESS GAME, MORE GAMEPLAY.

There should be very little between the player and the puzzle.

The product should make the player think:

"I understand this."

Then:

"That was easy."

Then:

"Let me go faster."

Then:

"One more."

That loop is the product.

END OF PRD
