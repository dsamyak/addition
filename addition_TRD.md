# Technical Requirements Document (TRD)
## Addition Within 20 & 100 — Gamified Simulation Website
### Singapore Primary 1 Mathematics | Intellia SG

---

**Document Version:** 1.0  
**Date:** May 2026  
**Tech Stack:** React 18 + Vite + Tailwind CSS  
**Reference Repo:** github.com/dsamyak/readingnumbers  
**Deployment:** Vercel

---

## 1. Technology Stack

### 1.1 Core Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | React 18 (functional components + hooks) | Same as readingnumbers repo; fast, component-based |
| Build Tool | Vite 5 | Fast HMR, optimised builds, matches reference repo |
| Styling | Tailwind CSS 3 + custom CSS variables | Utility-first; matches readingnumbers approach |
| Animation | Framer Motion 11 | Smooth, physics-based animations for child UX |
| State | React Context + useReducer | No Redux overhead needed for this scope |
| Persistence | localStorage | Zero backend; PDPA compliant; matches reference site |
| Routing | React Router v6 | Single-page app with clean URL segments |
| Icons | Lucide React + custom SVGs | Lightweight; used in readingnumbers repo |
| Sound | Howler.js | Lightweight audio management with mobile support |
| Testing | Vitest + React Testing Library | Same ecosystem as Vite |
| Linting | ESLint + Prettier | Code quality |
| Deployment | Vercel (zero-config) | Matches readingnumbers deployment |

### 1.2 Package.json (Key Dependencies)

```json
{
  "dependencies": {
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-router-dom": "^6.23.0",
    "framer-motion": "^11.2.0",
    "howler": "^2.2.4",
    "lucide-react": "^0.383.0",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.0",
    "vite": "^5.2.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "vitest": "^1.6.0",
    "@testing-library/react": "^15.0.0",
    "eslint": "^9.0.0"
  }
}
```

---

## 2. Project Structure

```
addition-within-20-100/
├── public/
│   ├── images/
│   │   ├── characters/          # Cartoon mascot PNGs
│   │   ├── badges/              # Gold/Silver/Bronze badge SVGs
│   │   └── backgrounds/         # Hero and section backgrounds
│   ├── sounds/
│   │   ├── correct.mp3
│   │   ├── wrong.mp3
│   │   ├── star.mp3
│   │   ├── streak.mp3
│   │   ├── celebration.mp3
│   │   └── hop.mp3              # Number line frog hop
│   └── favicon.ico
├── src/
│   ├── main.jsx                 # Entry point
│   ├── App.jsx                  # Router + ThemeProvider
│   ├── index.css                # Global styles + CSS variables
│   │
│   ├── context/
│   │   ├── GameContext.jsx      # Stars, streak, progress state
│   │   └── SoundContext.jsx     # Global sound on/off toggle
│   │
│   ├── pages/
│   │   ├── Landing.jsx          # Hero screen + Part selection
│   │   ├── LearnWithin20.jsx    # Learn mode: Addition within 20
│   │   ├── PracticeWithin20.jsx # Practice mode: Addition within 20
│   │   ├── LearnWithin100.jsx   # Learn mode: Addition within 100
│   │   ├── PracticeWithin100.jsx# Practice mode: Addition within 100
│   │   └── Results.jsx          # Score, badge, celebration
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx       # Logo, title, star counter, sound toggle
│   │   │   ├── Footer.jsx       # Back/Next navigation
│   │   │   └── ProgressBar.jsx  # Top progress indicator
│   │   │
│   │   ├── learn/
│   │   │   ├── ConceptCard.jsx  # Animated lesson card wrapper
│   │   │   ├── CardDeck.jsx     # Card-by-card reveal with nav
│   │   │   └── WorkedExample.jsx# Step-by-step example display
│   │   │
│   │   ├── simulations/
│   │   │   ├── NumberLine.jsx        # Frog hop number line (0–20)
│   │   │   ├── NumberLine100.jsx     # Number line (0–100)
│   │   │   ├── TenFrame.jsx          # Dot drag-and-drop ten frames
│   │   │   ├── PlaceValueMat.jsx     # Tens/Ones draggable blocks
│   │   │   ├── ColumnAddition.jsx    # Vertical addition builder
│   │   │   └── ReGroupAnimation.jsx  # 10 ones → 1 ten animation
│   │   │
│   │   ├── practice/
│   │   │   ├── QuestionCard.jsx      # Question wrapper + feedback
│   │   │   ├── MCQQuestion.jsx       # Multiple choice type
│   │   │   ├── FillBlank.jsx         # Digit pad fill-in
│   │   │   ├── DragAnswer.jsx        # Drag tile to blank
│   │   │   ├── WordProblem.jsx       # Story + illustration + MCQ
│   │   │   ├── NumberLineClick.jsx   # Click position on number line
│   │   │   ├── ColumnFill.jsx        # Fill ones/tens/carry boxes
│   │   │   ├── HintModal.jsx         # Hint reveal overlay
│   │   │   └── FeedbackOverlay.jsx   # Correct/Wrong animation
│   │   │
│   │   └── gamification/
│   │       ├── StarBurst.jsx         # Star earn animation
│   │       ├── StreakBanner.jsx      # On Fire! streak display
│   │       ├── BadgeCard.jsx         # Final badge + share button
│   │       ├── MasteryBar.jsx        # Per-subtopic mastery fill
│   │       └── Confetti.jsx          # Canvas confetti on completion
│   │
│   ├── hooks/
│   │   ├── useGameState.js      # Access game context
│   │   ├── useSound.js          # Play sounds by key
│   │   ├── useLocalStorage.js   # Typed localStorage hook
│   │   └── useDragDrop.js       # DnD kit wrapper for simulations
│   │
│   ├── utils/
│   │   ├── questionGenerator.js # All question generation logic
│   │   ├── wordProblems.js      # Word problem templates + renderer
│   │   ├── scoring.js           # Star calculation, badge threshold
│   │   ├── seededRandom.js      # Deterministic RNG (Mulberry32)
│   │   └── constants.js         # Game config, colour tokens
│   │
│   └── assets/
│       └── styles/
│           ├── animations.css   # Keyframe library
│           └── components.css   # Component-level overrides
│
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 3. Routing Architecture

```jsx
// App.jsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Landing />} />
    
    {/* Part 1: Addition Within 20 */}
    <Route path="/within-20/learn" element={<LearnWithin20 />} />
    <Route path="/within-20/practice" element={<PracticeWithin20 />} />
    
    {/* Part 2: Addition Within 100 */}
    <Route path="/within-100/learn" element={<LearnWithin100 />} />
    <Route path="/within-100/practice" element={<PracticeWithin100 />} />
    
    {/* Results */}
    <Route path="/results/:part" element={<Results />} />
  </Routes>
</BrowserRouter>
```

---

## 4. State Management

### 4.1 GameContext Schema

```javascript
// context/GameContext.jsx
const initialState = {
  // Session state
  currentPart: null,              // 'within20' | 'within100'
  currentMode: null,              // 'learn' | 'practice'
  
  // Learn progress
  learnCardIndex: {
    within20: 0,
    within100: 0
  },
  
  // Practice state
  practice: {
    within20: {
      questions: [],              // Generated question objects (50)
      currentIndex: 0,
      answers: [],                // { questionId, correct, hintsUsed, starsEarned }
      streak: 0,
      maxStreak: 0,
      totalStars: 0,
      maxPossibleStars: 150,      // 50 questions × 3 stars
      completed: false,
    },
    within100: { /* same shape */ }
  },
  
  // Gamification
  badges: {
    within20: null,               // 'gold' | 'silver' | 'bronze' | 'keep_trying'
    within100: null,
  },
  
  // Mastery per sub-concept
  mastery: {
    within20: {
      single_plus_single: 0,      // 0–10
      single_plus_double: 0,
      missing_addend: 0,
      word_problems: 0,
    },
    within100: {
      without_regrouping_2d_1d: 0,
      without_regrouping_2d_2d: 0,
      with_regrouping: 0,
      missing_addend: 0,
      word_problems: 0,
    }
  },
  
  // Global preferences
  soundEnabled: true,
};

// Actions
const ACTIONS = {
  SET_PART: 'SET_PART',
  ADVANCE_CARD: 'ADVANCE_CARD',
  INIT_QUESTIONS: 'INIT_QUESTIONS',
  ANSWER_QUESTION: 'ANSWER_QUESTION',
  USE_HINT: 'USE_HINT',
  COMPLETE_PRACTICE: 'COMPLETE_PRACTICE',
  TOGGLE_SOUND: 'TOGGLE_SOUND',
  RESET_PART: 'RESET_PART',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
};
```

### 4.2 localStorage Persistence

```javascript
// hooks/useLocalStorage.js
const STORAGE_KEY = 'intellia_addition_v1';

// Save on every state change via useEffect in GameContext
useEffect(() => {
  const toSave = {
    badges: state.badges,
    mastery: state.mastery,
    practice: {
      within20: { totalStars: ..., completed: ..., maxStreak: ... },
      within100: { totalStars: ..., completed: ..., maxStreak: ... }
    }
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}, [state]);
```

---

## 5. Question Generation Engine

### 5.1 Core Generator (`utils/questionGenerator.js`)

```javascript
import { seededRandom } from './seededRandom';

// Seeded RNG — new seed each session, consistent within session
const seed = Date.now();
const rand = seededRandom(seed);

/**
 * Generate all 50 questions for a given part
 * @param {'within20' | 'within100'} part
 * @returns Question[]
 */
export function generateQuestions(part) {
  const generators = part === 'within20'
    ? generateWithin20Questions
    : generateWithin100Questions;
  
  return shuffle(generators(), rand);
}

// WITHIN 20 QUESTIONS
function generateWithin20Questions() {
  const questions = [];
  
  // 15x single + single (sum ≤ 20)
  for (let i = 0; i < 15; i++) {
    const a = randInt(1, 9, rand);
    const b = randInt(1, Math.min(9, 20 - a), rand);
    questions.push(makeMCQ({ a, b, type: 'single_plus_single' }));
  }
  
  // 15x single + double (sum ≤ 20)
  for (let i = 0; i < 15; i++) {
    const a = randInt(1, 9, rand);
    const b = randInt(10, 20 - a, rand);
    const questionType = rand() > 0.5 ? 'mcq' : 'fill';
    questions.push(
      questionType === 'mcq'
        ? makeMCQ({ a, b, type: 'single_plus_double' })
        : makeFillBlank({ a, b, type: 'single_plus_double' })
    );
  }
  
  // 10x missing addend
  for (let i = 0; i < 10; i++) {
    const sum = randInt(5, 20, rand);
    const known = randInt(1, sum - 1, rand);
    const missing = sum - known;
    questions.push(makeMissingAddend({ known, missing, sum }));
  }
  
  // 10x word problems
  for (let i = 0; i < 10; i++) {
    questions.push(makeWordProblem('within20', rand));
  }
  
  return questions;
}

// WITHIN 100 QUESTIONS
function generateWithin100Questions() {
  const questions = [];
  
  // 10x without regrouping (2-digit + 1-digit)
  for (let i = 0; i < 10; i++) {
    let a, b;
    do {
      a = randInt(10, 89, rand);
      b = randInt(1, 9, rand);
    } while ((a % 10) + b >= 10); // ensure no carry
    questions.push(makeMCQ({ a, b, type: 'without_regrouping_2d_1d' }));
  }
  
  // 15x without regrouping (2-digit + 2-digit)
  for (let i = 0; i < 15; i++) {
    let a, b;
    do {
      a = randInt(10, 79, rand);
      b = randInt(10, 99 - a, rand);
    } while ((a % 10) + (b % 10) >= 10 || Math.floor(a/10) + Math.floor(b/10) >= 10);
    const qType = rand() > 0.5 ? 'mcq' : 'column_fill';
    questions.push(qType === 'mcq'
      ? makeMCQ({ a, b, type: 'without_regrouping_2d_2d' })
      : makeColumnFill({ a, b, type: 'without_regrouping_2d_2d' })
    );
  }
  
  // 15x with regrouping
  for (let i = 0; i < 15; i++) {
    let a, b;
    do {
      a = randInt(10, 89, rand);
      b = randInt(10, 99 - a, rand);
    } while ((a % 10) + (b % 10) < 10); // force carry
    const qType = rand() > 0.5 ? 'mcq' : 'column_fill';
    questions.push(qType === 'mcq'
      ? makeMCQ({ a, b, type: 'with_regrouping' })
      : makeColumnFill({ a, b, type: 'with_regrouping' })
    );
  }
  
  // 5x missing addend (within 100)
  for (let i = 0; i < 5; i++) {
    const sum = randInt(20, 99, rand);
    const known = randInt(10, sum - 10, rand);
    questions.push(makeMissingAddend({ known, missing: sum - known, sum }));
  }
  
  // 5x word problems
  for (let i = 0; i < 5; i++) {
    questions.push(makeWordProblem('within100', rand));
  }
  
  return questions;
}
```

### 5.2 Question Object Schema

```typescript
interface Question {
  id: string;                    // UUID
  part: 'within20' | 'within100';
  subtype: string;               // e.g., 'single_plus_single'
  displayType: QuestionDisplay;  // 'mcq' | 'fill' | 'drag' | 'word' | 'number_line_click' | 'column_fill'
  a: number;                     // First addend
  b: number;                     // Second addend (or known in missing addend)
  answer: number;                // Correct answer
  choices?: number[];            // MCQ: [correct, distractor1, distractor2, distractor3]
  
  // For word problems
  storyTemplate?: string;        // Template key from wordProblems.js
  storyVars?: Record<string, string | number>;
  illustration?: string;         // Image path
  
  // For column fill
  onesA?: number;               // a % 10
  onesB?: number;               // b % 10
  tensA?: number;               // Math.floor(a / 10)
  tensB?: number;               // Math.floor(b / 10)
  hasCarry?: boolean;
  carryValue?: number;
  
  // Metadata
  difficulty: 'easy' | 'medium' | 'hard';
  hint1Type: 'card_reference' | 'number_line' | 'ten_frame' | 'place_value';
}
```

### 5.3 MCQ Distractor Generation

```javascript
function generateDisstractors(correct, part) {
  const distractors = new Set();
  const errors = [
    correct + 1,           // Off by 1
    correct - 1,           // Off by 1
    correct + 10,          // Forgot carry → added 10 too many
    correct - 10,          // Forgot carry → 10 short
    Math.floor(correct / 2), // Halved by mistake
    correct + 9,           // Common mental math slip
  ];
  for (const e of errors) {
    if (e > 0 && e !== correct && e <= (part === 'within20' ? 20 : 100)) {
      distractors.add(e);
    }
    if (distractors.size >= 3) break;
  }
  // Fill remaining with random plausible values
  while (distractors.size < 3) {
    const r = correct + randInt(-5, 5, rand);
    if (r > 0 && r !== correct) distractors.add(r);
  }
  return shuffle([correct, ...distractors], rand);
}
```

### 5.4 Word Problem Templates (`utils/wordProblems.js`)

```javascript
const WITHIN20_TEMPLATES = [
  {
    key: 'stickers',
    text: '{name1} has {a} stickers. {name2} gives {pronoun} {b} more. How many stickers does {name1} have altogether?',
    illustration: 'stickers',
    vars: { names: ['Maya', 'Ethan', 'Priya', 'Marcus', 'Aisha', 'Wei Ting'] }
  },
  {
    key: 'fish',
    text: 'There are {a} goldfish and {b} guppies in a tank. How many fish are there in all?',
    illustration: 'fishtank',
    vars: {}
  },
  {
    key: 'playground',
    text: '{a} children are on the slide. {b} more children join them. How many children are on the playground?',
    illustration: 'playground',
    vars: {}
  },
  {
    key: 'canteen',
    text: 'A canteen sold {a} plates of rice in the morning and {b} plates in the afternoon. How many plates were sold altogether?',
    illustration: 'canteen',
    vars: {}
  },
  {
    key: 'birds',
    text: '{a} birds are sitting on a tree. {b} more birds fly over and join them. How many birds are on the tree now?',
    illustration: 'birds',
    vars: {}
  }
];

const WITHIN100_TEMPLATES = [
  {
    key: 'mrt',
    text: '{a} passengers boarded the MRT at Jurong East. At the next stop, {b} more passengers boarded. How many passengers are on the train altogether?',
    illustration: 'mrt',
    vars: {}
  },
  {
    key: 'library',
    text: 'A school library has {a} storybooks and {b} science books. How many books are there in total?',
    illustration: 'library',
    vars: {}
  },
  {
    key: 'bakery',
    text: 'A bakery made {a} chocolate muffins and {b} vanilla muffins. How many muffins did the bakery make altogether?',
    illustration: 'bakery',
    vars: {}
  },
  {
    key: 'stamps',
    text: '{name1} has {a} stamps. {name2} has {b} stamps. How many stamps do they have altogether?',
    illustration: 'stamps',
    vars: { names: ['James', 'Paul', 'Lily', 'Ahmad', 'Siti'] }
  },
  {
    key: 'zoo',
    text: 'A zoo has {a} penguins and {b} flamingos. How many birds are there in all?',
    illustration: 'zoo',
    vars: {}
  }
];
```

---

## 6. Component Specifications

### 6.1 NumberLine Component

```jsx
// components/simulations/NumberLine.jsx
// Props:
//   max: number (20 or 100)
//   startAt: number (initial frog position)
//   hopsRequired: number
//   onComplete: (landedOn: number) => void
//   interactive: boolean (practice vs learn mode)

// Internal state:
//   currentPos: number
//   hopsLeft: number
//   animating: boolean

// Renders:
//   SVG number line with tick marks and labels every 5 units
//   Animated frog sprite (CSS transform translateX)
//   "Hop!" button (disabled when animating or hopsLeft === 0)
//   Counter display: "Hops left: {hopsLeft}"
//   Answer reveal when hopsLeft === 0
```

### 6.2 TenFrame Component

```jsx
// components/simulations/TenFrame.jsx
// Shows 1 or 2 ten-frames (20 cells total)
// Props:
//   addendA: number
//   addendB: number
//   mode: 'demonstrate' | 'interactive'
//
// In demonstrate mode: dots fill automatically with animation (200ms delay per dot)
// In interactive mode: empty cells are drop zones; dots are draggable
//
// Dot colours:
//   addendA dots → coral (#FF6B6B)
//   addendB dots → sky blue (#4ECDC4)
//   Empty cells → dashed border, light gray
```

### 6.3 PlaceValueMat Component

```jsx
// components/simulations/PlaceValueMat.jsx
// Props:
//   numberA: number (2-digit)
//   numberB: number (2-digit)
//   mode: 'demonstrate' | 'interactive'
//
// Visual layout:
// ┌──────────────────────────────────────┐
// │         PLACE VALUE MAT              │
// │  ┌──────────┐     ┌──────────┐      │
// │  │  TENS    │     │   ONES   │      │
// │  │          │     │          │      │
// │  │ [blocks] │     │ [blocks] │      │
// │  └──────────┘     └──────────┘      │
// └──────────────────────────────────────┘
//
// Tens column: shows orange rod icons (1 rod = 10)
// Ones column: shows yellow cube icons (1 cube = 1)
// When ones exceed 9: glowing "REGROUP!" button appears
// Regroup animation: 10 cubes slide together → 1 rod appears in tens column
```

### 6.4 ColumnAddition Component

```jsx
// components/simulations/ColumnAddition.jsx
// Props:
//   a: number, b: number
//   mode: 'demonstrate' | 'fill' (practice)
//
// In demonstrate: auto-plays step-by-step with "Next Step" button
// In fill mode: student fills empty boxes
//
//  Layout:
//       Tens | Ones
//         4  |  7     ← numberA
//    +    3  |  6     ← numberB
//   ─────────────
//    [1] [8] | [3]    ← carry | tens answer | ones answer
//
// Validation: check onesAnswer, tensAnswer, carryBox (if applicable)
// Highlight carry box orange when regrouping is needed
```

### 6.5 QuestionCard Component

```jsx
// components/practice/QuestionCard.jsx
// Master wrapper for all question types
// Props:
//   question: Question
//   questionNumber: number
//   total: number
//   onAnswer: (correct: boolean, hintsUsed: number) => void

// Internal state:
//   phase: 'answering' | 'feedback' | 'hint_shown'
//   hintsUsed: 0 | 1 | 2
//   selectedAnswer: any
//   showHint: boolean

// Renders:
//   <ProgressBar current={questionNumber} total={total} />
//   <StreakBanner streak={streak} />               // if streak > 2
//   Question-specific component (MCQ, FillBlank, etc.)
//   <HintButton hintsLeft={2 - hintsUsed} onUseHint={...} />
//   <FeedbackOverlay correct={...} starsEarned={...} />    // after answer
```

### 6.6 FeedbackOverlay Component

```jsx
// Appears 300ms after answer is submitted
// Correct: green background, ✅, star burst animation, "Great job!"
// Wrong: red flash (100ms), then orange background, worked solution shown
// Duration: stays until student clicks "Next Question"
// Sound: plays correct.mp3 or wrong.mp3 via useSound hook
```

---

## 7. Animation Specifications

### 7.1 Framer Motion Variants

```javascript
// src/assets/styles/animations.js (motion variants)

export const cardEnter = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -40, scale: 0.95, transition: { duration: 0.25 } }
};

export const starBurst = {
  hidden: { scale: 0, rotate: -30 },
  visible: { scale: [0, 1.3, 1], rotate: [−30, 10, 0], transition: { duration: 0.5, ease: 'backOut' } }
};

export const streakFlame = {
  animate: {
    scale: [1, 1.1, 1],
    rotate: [-3, 3, -3],
    transition: { repeat: Infinity, duration: 0.6 }
  }
};

export const confettiPiece = {
  initial: { y: -20, opacity: 1 },
  animate: {
    y: window.innerHeight + 20,
    opacity: [1, 1, 0],
    rotate: [0, 360],
    transition: { duration: 2 + Math.random(), ease: 'easeIn' }
  }
};

export const hopAnimation = {
  // Frog hop: arc trajectory
  x: targetX,
  y: [0, -40, 0],
  transition: { duration: 0.4, ease: 'easeInOut', times: [0, 0.5, 1] }
};
```

### 7.2 CSS Keyframes (`src/assets/styles/animations.css`)

```css
@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.4); }
  50% { box-shadow: 0 0 0 12px rgba(255, 107, 107, 0); }
}

@keyframes bounceIn {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.1); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes dotFill {
  from { transform: scale(0) rotate(-180deg); opacity: 0; }
  to { transform: scale(1) rotate(0deg); opacity: 1; }
}

@keyframes slideInUp {
  from { transform: translateY(60px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes regroup {
  0% { transform: translateX(0) scale(1); }
  50% { transform: translateX(-200%) scale(0.8); opacity: 0.6; }
  100% { transform: translateX(-300%) scale(1.2); opacity: 0; }
}
```

---

## 8. Scoring & Gamification Logic

### 8.1 Star Calculation (`utils/scoring.js`)

```javascript
/**
 * Calculate stars for a single answer
 * @param {boolean} correct
 * @param {number} hintsUsed - 0, 1, or 2
 * @returns {0 | 1 | 2 | 3}
 */
export function calculateStars(correct, hintsUsed) {
  if (!correct) return 0;
  if (hintsUsed === 0) return 3;
  if (hintsUsed === 1) return 2;
  return 1;
}

/**
 * Determine badge based on score percentage
 * @param {number} totalStars
 * @param {number} maxPossibleStars - 150 for 50 questions
 * @returns {'gold' | 'silver' | 'bronze' | 'keep_trying'}
 */
export function calculateBadge(totalStars, maxPossibleStars) {
  const pct = (totalStars / maxPossibleStars) * 100;
  if (pct >= 90) return 'gold';
  if (pct >= 75) return 'silver';
  if (pct >= 60) return 'bronze';
  return 'keep_trying';
}

/**
 * Update mastery score for a sub-concept (max 10)
 */
export function updateMastery(current, correct) {
  if (correct) return Math.min(current + 1, 10);
  return Math.max(current - 0.5, 0); // small penalty for wrong
}
```

### 8.2 Streak Logic

```javascript
// In GameContext reducer, ANSWER_QUESTION action:
case ACTIONS.ANSWER_QUESTION: {
  const { correct, starsEarned } = action.payload;
  const newStreak = correct ? state.practice[part].streak + 1 : 0;
  const maxStreak = Math.max(newStreak, state.practice[part].maxStreak);
  
  // Trigger special animation on milestone streaks
  if (newStreak === 3 || newStreak === 5 || newStreak === 10) {
    // dispatch side-effect: play streak.mp3, show StreakBanner
  }
  
  return { ...state, practice: { ...state.practice, [part]: {
    ...state.practice[part], streak: newStreak, maxStreak
  }}};
}
```

---

## 9. Sound System

### 9.1 Sound Map (`hooks/useSound.js`)

```javascript
import { Howl } from 'howler';

const sounds = {
  correct:      new Howl({ src: ['/sounds/correct.mp3'], volume: 0.7 }),
  wrong:        new Howl({ src: ['/sounds/wrong.mp3'], volume: 0.5 }),
  star:         new Howl({ src: ['/sounds/star.mp3'], volume: 0.6 }),
  streak:       new Howl({ src: ['/sounds/streak.mp3'], volume: 0.8 }),
  celebration:  new Howl({ src: ['/sounds/celebration.mp3'], volume: 0.7 }),
  hop:          new Howl({ src: ['/sounds/hop.mp3'], volume: 0.4 }),
  dot_place:    new Howl({ src: ['/sounds/pop.mp3'], volume: 0.3 }),
  regroup:      new Howl({ src: ['/sounds/whoosh.mp3'], volume: 0.5 }),
  card_flip:    new Howl({ src: ['/sounds/flip.mp3'], volume: 0.3 }),
  button_click: new Howl({ src: ['/sounds/click.mp3'], volume: 0.2 }),
};

export function useSound() {
  const { soundEnabled } = useGameState();
  return {
    play: (key) => { if (soundEnabled && sounds[key]) sounds[key].play(); }
  };
}
```

---

## 10. Drag and Drop Implementation

### 10.1 DnD Kit Setup

```jsx
// Using @dnd-kit/core for all drag-and-drop interactions

// TenFrame drop zones:
<DndContext onDragEnd={handleDotDrop} sensors={sensors}>
  {dots.map(dot => (
    <Draggable key={dot.id} id={dot.id}>
      <DotSprite colour={dot.colour} />
    </Draggable>
  ))}
  {cells.map(cell => (
    <Droppable key={cell.id} id={cell.id} disabled={cell.filled}>
      <TenFrameCell filled={cell.filled} />
    </Droppable>
  ))}
</DndContext>

// PlaceValueMat drop zones:
// Separate DndContext for Tens column and Ones column
// Blocks snap to grid within their column
// Column has max capacity (Tens: 9 rods, Ones: 9 cubes)
```

---

## 11. Responsive Design Breakpoints

```css
/* tailwind.config.js screens */
screens: {
  'sm': '640px',    /* large mobile / small tablet */
  'md': '768px',    /* tablet portrait */
  'lg': '1024px',   /* tablet landscape / small desktop */
  'xl': '1280px',   /* desktop */
}

/* Key responsive adaptations: */
/* - Number line: scrollable horizontally on mobile */
/* - Ten Frame: 2×5 grid per frame, touch-friendly 48px cells */
/* - Column Addition: font size increases on mobile for readability */
/* - MCQ buttons: full-width on mobile, 2×2 grid on tablet+ */
/* - Confetti: reduced particle count on mobile for performance */
```

---

## 12. Performance Requirements

| Requirement | Target | Implementation |
|---|---|---|
| First Contentful Paint | < 1.8s | Vite code splitting per page route |
| Largest Contentful Paint | < 2.5s | Image optimisation (WebP), lazy loading |
| Time to Interactive | < 3.0s | Defer non-critical JS (Howler loads after first interaction) |
| Bundle Size (initial) | < 150KB gzipped | Tree-shaking, dynamic imports for simulation components |
| Animation FPS | ≥ 60fps | CSS transforms only (no layout-triggering properties), will-change hints |
| Drag Performance | No jank | DnD Kit uses pointer events, not deprecated drag API |

### 12.1 Code Splitting Strategy

```javascript
// vite.config.js — manual chunking
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor-react': ['react', 'react-dom', 'react-router-dom'],
        'vendor-animation': ['framer-motion'],
        'vendor-dnd': ['@dnd-kit/core', '@dnd-kit/sortable'],
        'vendor-audio': ['howler'],
        'learn-20': ['./src/pages/LearnWithin20'],
        'practice-20': ['./src/pages/PracticeWithin20'],
        'learn-100': ['./src/pages/LearnWithin100'],
        'practice-100': ['./src/pages/PracticeWithin100'],
      }
    }
  }
}
```

---

## 13. Analytics Events

```javascript
// All events sent to Google Analytics 4 via gtag()

// Page/screen views
gtag('event', 'page_view', { page_title: 'Addition Within 20 - Learn' });

// Learning events
gtag('event', 'card_viewed', { card_index: 3, part: 'within20' });
gtag('event', 'simulation_completed', { simulation: 'ten_frame', part: 'within20' });

// Practice events
gtag('event', 'question_answered', {
  part: 'within20',
  subtype: 'single_plus_single',
  correct: true,
  hints_used: 0,
  stars_earned: 3,
  question_number: 7,
});
gtag('event', 'hint_used', { part: 'within20', question_number: 12, hint_level: 1 });
gtag('event', 'streak_achieved', { streak: 5, part: 'within100' });

// Completion events
gtag('event', 'lesson_completed', {
  part: 'within20',
  total_stars: 128,
  max_stars: 150,
  badge: 'gold',
  time_seconds: 720,
});
gtag('event', 'badge_earned', { badge: 'gold', part: 'within20' });
gtag('event', 'badge_shared', { badge: 'silver' });
```

---

## 14. Accessibility Implementation

```jsx
// All interactive elements:
<button
  aria-label="Hop the frog forward one step"
  role="button"
  tabIndex={0}
  onKeyDown={(e) => e.key === 'Enter' && handleHop()}
>
  Hop! 🐸
</button>

// Drag and drop: keyboard alternative
// Each draggable item also has arrow key support via DnD Kit's keyboard sensor:
const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);

// Screen reader live region for feedback:
<div role="status" aria-live="polite" aria-atomic="true">
  {feedbackMessage}  {/* e.g., "Correct! You earned 3 stars!" */}
</div>

// Focus management: after question answered, focus moves to "Next Question" button
// Colour never used as sole differentiator (icons + colour always paired)
```

---

## 15. Deployment & Environment

### 15.1 Vercel Config (`vercel.json`)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/sounds/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/images/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

### 15.2 Environment Variables

```bash
# .env.production
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX    # Google Analytics
VITE_SITE_BASE_URL=https://intelliasg.com/courses/grade-1-math/lessons/addition-within-20-and-100/
```

### 15.3 Iframe Embedding (for Intellia LMS)

```html
<!-- Embed in Intellia course page -->
<iframe
  src="https://addition-sg.vercel.app"
  width="100%"
  height="700px"
  style="border: none; border-radius: 16px;"
  allow="autoplay"
  title="Addition Within 20 and 100 - Interactive Lesson"
></iframe>
```

---

## 16. Testing Plan

| Test Type | Tool | Coverage |
|---|---|---|
| Unit tests | Vitest | questionGenerator, scoring, wordProblems, seededRandom |
| Component tests | React Testing Library | QuestionCard, MCQ, FillBlank, NumberLine |
| Integration tests | React Testing Library | Full practice flow (10 questions) |
| Accessibility | axe-core / jest-axe | All page components |
| Visual regression | Manual + screenshots | Key screens across 3 viewports |
| Performance | Lighthouse CI | FCP, LCP, TBT, CLS thresholds |
| Cross-browser | BrowserStack | Chrome, Safari, Firefox, Edge |

### 16.1 Critical Unit Tests

```javascript
// questionGenerator.test.js
describe('generateWithin20Questions', () => {
  it('generates exactly 50 questions', () => { ... });
  it('all answers are within 1–20', () => { ... });
  it('MCQ distractors do not include correct answer', () => { ... });
  it('missing addend: known + missing === sum', () => { ... });
  it('no duplicate question ids in one session', () => { ... });
});

// scoring.test.js
describe('calculateStars', () => {
  it('returns 3 for correct with 0 hints', () => { ... });
  it('returns 0 for wrong answer', () => { ... });
});

describe('calculateBadge', () => {
  it('returns gold for 90%+', () => { ... });
  it('returns keep_trying for below 60%', () => { ... });
});
```

---

## 17. Revision History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | May 2026 | Engineering Team | Initial technical specification |
