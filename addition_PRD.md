# Product Requirements Document (PRD)
## Addition Within 20 & 100 — Gamified Simulation Website
### Singapore Primary 1 Mathematics | Intellia SG

---

**Document Version:** 1.0  
**Date:** May 2026  
**Platform:** Web (React + Vite) — hosted under `intelliasg.com/courses/grade-1-math/lessons/addition-within-20-and-100/`  
**Reference Site:** readingnumbers.vercel.app  
**Curriculum Alignment:** Singapore MOE Primary Mathematics Syllabus (Primary 1A & 1B)

---

## 1. Product Overview

### 1.1 Purpose

This document defines the product requirements for an interactive, gamified, simulation-based learning website covering **Addition Within 20 and Addition Within 100** for Grade 1 students in Singapore. The website is a standalone lesson module that will be embedded/linked within Intellia SG's Grade 1 Math course (Lesson 2.1: Addition within 20 and 100).

The website follows the same structural DNA as the **readingnumbers.vercel.app** experience: a linear, guided journey that moves from **Learn → Simulate → Practice**, wrapped in a gamified, visually rich, child-friendly interface. Every screen is purposeful, every interaction earns a reward, and no child is left confused.

### 1.2 Target Audience

| Attribute | Details |
|---|---|
| Primary Users | Students aged 6–7 (Singapore Primary 1) |
| Secondary Users | Parents supervising at home, Teachers assigning as homework |
| Device | Desktop, tablet (mobile-responsive) |
| Language | English (Singapore MOE standard) |
| Prior Knowledge | Numbers to 100, Number Bonds, basic counting |

### 1.3 Curriculum Alignment

Based on **Targeting Mathematics Primary 1A & 1B** (the uploaded textbooks) and Singapore MOE syllabus:

| Chapter | Topic | Coverage |
|---|---|---|
| Ch. 3 (1A) | Addition Within 10 | Pre-requisite context |
| Ch. 8 (1A) | Addition Within 20 — Adding Two 1-digit Numbers | ✅ Covered |
| Ch. 8 (1A) | Addition Within 20 — Adding 1-digit and 2-digit Numbers | ✅ Covered |
| Ch. 8 (1A) | Word Problems (within 20) | ✅ Covered |
| Ch. 12 (1B) | Addition and Subtraction Within 40 | ✅ Partial (addition only) |
| Ch. 14 (1B) | Addition Without Regrouping (within 100) | ✅ Covered |
| Ch. 14 (1B) | Addition With Regrouping (within 100) | ✅ Covered |

---

## 2. Product Goals & Success Metrics

### 2.1 Goals

1. Students understand addition within 20 through concrete visual simulation before abstract practice.
2. Students progress naturally from addition within 20 to addition within 100.
3. Students complete at least 20 practice questions per session without frustration.
4. Gamification (stars, streaks, celebrations) maintains engagement throughout.
5. The website is self-contained — a student can learn independently without a teacher.

### 2.2 Success Metrics

| Metric | Target |
|---|---|
| Session completion rate | ≥ 70% of students complete full Learn + Practice flow |
| Average score on practice round | ≥ 75% correct on first attempt |
| Time on site per session | 12–20 minutes |
| Return visit rate | ≥ 50% revisit within 7 days |
| Teacher satisfaction | ≥ 4.2/5 on curriculum alignment survey |

---

## 3. User Journey & Flow

### 3.1 High-Level Flow

```
Landing / Hero Screen
        ↓
  Chapter Select
  ┌──────────────────────────────────────┐
  │  Part 1: Addition Within 20          │
  │  Part 2: Addition Within 100         │
  └──────────────────────────────────────┘
        ↓
  Learn Mode (per Part)
  ┌──────────────────────────────────────┐
  │  Concept Cards (animated)            │
  │  → Interactive Simulation            │
  │  → Guided Examples                   │
  └──────────────────────────────────────┘
        ↓
  Practice Mode (per Part)
  ┌──────────────────────────────────────┐
  │  50 randomised questions per Part    │
  │  MCQ + Fill-in + Drag-drop types     │
  │  Instant feedback + Hints            │
  │  Progress bar + Stars earned         │
  └──────────────────────────────────────┘
        ↓
  Results & Celebration Screen
  ┌──────────────────────────────────────┐
  │  Score, Stars, Badge earned          │
  │  Retry wrong questions               │
  │  "Go to Part 2" or "Back to Course"  │
  └──────────────────────────────────────┘
```

### 3.2 Detailed Screen Descriptions

#### Screen 1 — Hero / Landing
- Full-width animated banner with cartoon number characters (similar to readingnumbers.vercel.app hero style)
- Title: **"Let's Add!"** with sparkle animation
- Subtitle: *"Singapore Primary 1 Maths — Addition"*
- Two large CTA cards: "Addition Within 20" and "Addition Within 100"
- Decorative: animated number bubbles floating in background
- Progress indicator if student has visited before (stars from previous session)

#### Screen 2 — Part 1: Learn Mode (Addition Within 20)

**Section 2a — Concept Introduction (Cards)**

The Learn section uses a card-by-card reveal approach (same pacing as readingnumbers.vercel.app concept slides):

| Card # | Content |
|---|---|
| Card 1 | "What is Addition?" — Animated apples appearing on a tree (3 + 4 = 7), with the word "altogether" highlighted |
| Card 2 | Number Line simulation — student drags a frog along a number line from 0–20 |
| Card 3 | Ten-Frame simulation — fill the ten-frame with dots to add two numbers |
| Card 4 | Number Bond animation — part-whole model showing 8 = 5 + 3 |
| Card 5 | "Adding 1-digit + 1-digit" — worked examples with counters |
| Card 6 | "Adding 1-digit + 2-digit" — worked examples with place value blocks |
| Card 7 | Word Problem example: "Tom has 9 sweets. Mary gives him 6 more. How many altogether?" with story illustration |

**Section 2b — Interactive Simulation: Number Line**
- Animated frog on a number line 0–20
- Teacher prompt: "7 + 5 = ?"
- Student clicks the frog's starting position (7), then clicks "hop" 5 times
- Frog hops with sound effect and lands on 12
- Answer reveals with celebration

**Section 2c — Interactive Simulation: Ten-Frame**
- Two ten-frames shown side by side
- Student drags coloured dots into the frames to represent two addends
- Dots automatically fill first frame then overflow to second
- System shows: "8 + 7 = ? Fill the frames to find out!"
- Answer auto-computes when frames are filled

**Section 2d — Place Value Blocks Simulation**
- For adding 1-digit + 2-digit (e.g., 14 + 5)
- Tens rods and ones units shown as draggable blocks
- Student drags ones blocks into the "ones" column
- Counter tallies automatically

#### Screen 3 — Part 1: Practice Mode (Addition Within 20)

- **50 randomised questions** (but displayed 10 at a time — 5 sets)
- **Question types** (randomly assigned):
  1. **Number Sentence MCQ**: "8 + 7 = ?" → 4 choices
  2. **Fill-in-the-Blank**: "6 + ___ = 13" → keyboard input with digit buttons
  3. **Drag-and-Drop**: drag the correct answer tile to the blank
  4. **Word Problem MCQ**: Short story, 4 answer choices
  5. **Number Line Click**: "Start at 9, add 4 — where do you land?" → click on number line
- **Gamification per question**:
  - Correct on first try → 3 stars
  - Correct after hint → 2 stars
  - Correct after 2nd attempt → 1 star
  - Wrong → 0 stars, see worked solution
- **Streak counter**: "🔥 3 in a row!" with flame animation
- **Progress bar** at top: 10 segments fill as questions complete
- **Hint button**: reveals a visual tip (e.g., shows ten-frame partial fill)

#### Screen 4 — Part 2: Learn Mode (Addition Within 100)

**Section 4a — Concept Cards**

| Card # | Content |
|---|---|
| Card 1 | "Adding bigger numbers!" — Recap tens and ones using place value blocks |
| Card 2 | Addition Without Regrouping — e.g., 23 + 15: Tens + Tens, Ones + Ones |
| Card 3 | Simulation: Column addition with animated carry blocks |
| Card 4 | Addition With Regrouping — e.g., 37 + 25: ones overflow into tens |
| Card 5 | Regrouping animation: 10 ones cubes bundle into 1 tens rod with satisfying animation |
| Card 6 | Worked example: 46 + 38 step by step |
| Card 7 | Word Problem: "A bakery made 54 muffins in the morning and 28 in the afternoon. How many altogether?" |
| Card 8 | Mental Math Strategy: "Add tens first, then ones" — e.g., 32 + 45 = (30+40) + (2+5) = 70 + 7 = 77 |

**Section 4b — Interactive Simulation: Place Value Mat**
- A virtual place value mat with "Tens" and "Ones" columns
- Student is given two 2-digit numbers (e.g., 47 + 36)
- Student drags blocks into the mat
- When ones column exceeds 9, a "Regroup!" button glows — student clicks it to bundle 10 ones into 1 ten
- Tens column updates accordingly

**Section 4c — Interactive Simulation: Column Addition Builder**
- A vertical column addition layout
- Student fills in each row (ones first, then tens)
- Carry-over highlighted in orange when regrouping occurs
- Step-by-step reveal with "Next Step" button

#### Screen 5 — Part 2: Practice Mode (Addition Within 100)

- **50 randomised questions** (displayed 10 at a time)
- Question types:
  1. **Standard MCQ**: "34 + 47 = ?" → 4 choices
  2. **Column Addition Fill**: Show vertical layout, student fills answer boxes for ones/tens/carry
  3. **Place Value Drag**: Drag the correct number of tens rods and ones cubes
  4. **Missing Addend**: "57 + ___ = 89"
  5. **Word Problem**: 2-step story with illustration
- Same gamification system (stars, streaks, hints)

#### Screen 6 — Results & Celebration
- Confetti animation, cartoon character celebrating
- Shows: Total Stars / Max Stars, Questions Correct, Time Taken
- Badge awarded based on score:
  - 90–100%: 🏆 Gold "Addition Champion"
  - 75–89%: 🥈 Silver "Super Adder"
  - 60–74%: 🥉 Bronze "Great Effort!"
  - <60%: 💪 "Keep Practising!"
- Buttons: "Review Mistakes", "Try Again", "Back to Course"
- "Share your badge!" (PNG download of badge card)

---

## 4. Gamification System

### 4.1 Star Economy

| Action | Stars Earned |
|---|---|
| Correct answer, 1st try | ⭐⭐⭐ |
| Correct answer after hint | ⭐⭐ |
| Correct after 2nd attempt | ⭐ |
| Wrong answer (see solution) | 0 |

### 4.2 Streak System

- 3 consecutive correct → "🔥 On Fire!" banner
- 5 consecutive correct → Special sound effect + star burst animation
- Streak resets on any wrong answer

### 4.3 Progress Persistence

- Stars and progress saved in `localStorage` per Part
- Returning students see their previous badge and score
- "Beat your score!" challenge shown on return

### 4.4 Mastery Indicator

- Per sub-concept (e.g., "Adding with regrouping"), a small mastery bar fills as student gets questions right
- Full mastery (10/10 correct) unlocks a special "Expert" icon for that sub-concept

---

## 5. Question Bank Specification

### 5.1 Addition Within 20 — 50 Questions

| Sub-topic | # Questions | Example |
|---|---|---|
| 1-digit + 1-digit | 15 | 7 + 8 = ? |
| 1-digit + 2-digit | 15 | 6 + 13 = ? |
| Missing addend (within 20) | 10 | 9 + ___ = 17 |
| Word problems (within 20) | 10 | "Anna has 8 stickers. Ben gives her 7. How many?" |

### 5.2 Addition Within 100 — 50 Questions

| Sub-topic | # Questions | Example |
|---|---|---|
| Without regrouping (2-digit + 1-digit) | 10 | 32 + 5 = ? |
| Without regrouping (2-digit + 2-digit) | 15 | 43 + 25 = ? |
| With regrouping (ones overflow) | 15 | 47 + 36 = ? |
| Missing addend (within 100) | 5 | 45 + ___ = 72 |
| Word problems (within 100) | 5 | "A zoo has 54 penguins and 38 flamingos. How many birds?" |

### 5.3 Randomisation Rules

- All questions are generated algorithmically (not static) using a seeded random number generator
- Every session, the full pool of 100 questions is regenerated with new numbers within the correct range
- No question repeats within a session
- Word problem templates rotate (5 different story contexts per sub-topic)
- Answer choices for MCQ: 1 correct + 3 plausible distractors (common errors like forgetting carry-over)

---

## 6. Visual & UX Design Requirements

### 6.1 Design Language

The UI must strictly resonate with the **readingnumbers.vercel.app** structure:

| Element | Specification |
|---|---|
| Font | Nunito or Fredoka One (rounded, child-friendly) |
| Colour Palette | Bright primary palette — coral, sky blue, sunshine yellow, mint green |
| Background | Soft gradient sky (like readingnumbers hero) with decorative floating elements |
| Cards | Rounded corners (border-radius: 20px), drop shadow, white background |
| Buttons | Large, pill-shaped, tactile hover states with scale animation |
| Animations | Framer Motion or CSS keyframes — bouncing, sliding, fading |
| Characters | Cute cartoon animals/characters as mascots (consistent across screens) |
| Icons | Emojis + custom SVG icons (stars, badges, flames) |

### 6.2 Layout Structure (mirroring readingnumbers.vercel.app)

```
┌─────────────────────────────────────────────────────┐
│  HEADER: Logo | Lesson Title | Progress Stars | Menu  │
├─────────────────────────────────────────────────────┤
│                                                       │
│          MAIN CONTENT AREA                            │
│    (full-width card, centred, max-width 900px)       │
│                                                       │
│    [Concept card / Simulation / Question]             │
│                                                       │
├─────────────────────────────────────────────────────┤
│  FOOTER NAV: ← Back | Progress indicator | Next →    │
└─────────────────────────────────────────────────────┘
```

### 6.3 Simulation UI Requirements

- Drag-and-drop must have clear "pick up" and "drop zone" visual affordances
- All interactive elements: minimum touch target 44×44px
- Sound effects: toggle on/off button always visible
- No reading required to use simulations (icons + visual cues sufficient)

### 6.4 Accessibility

- WCAG 2.1 AA contrast ratios
- All interactive elements keyboard-navigable
- Screen reader labels on all buttons and inputs
- No auto-playing audio (student-triggered only)

---

## 7. Content & Pedagogy Requirements

### 7.1 Singapore Maths Approach (CPA — Concrete, Pictorial, Abstract)

The website must follow MOE's CPA framework:

| Stage | Implementation |
|---|---|
| **Concrete** | Drag-and-drop physical manipulatives (blocks, counters, dots) |
| **Pictorial** | Ten-frame diagrams, number line visuals, bar models for word problems |
| **Abstract** | Number sentences, column addition, fill-in-the-blank numerals |

Each concept is introduced Concrete → Pictorial → Abstract before any abstract practice questions are shown.

### 7.2 Language Requirements

- Instructions use simple, clear English suitable for age 6–7
- Key maths vocabulary highlighted in **bold colour**: *addend, sum, altogether, total, more than*
- Word problems use Singapore-familiar contexts: hawker centre, MRT, playground, school canteen

### 7.3 Hint System

- Level 1 Hint: Re-shows the relevant concept card thumbnail
- Level 2 Hint: Shows a step-by-step worked solution animation
- Hints cost 1 star each (student is warned before using)

---

## 8. Non-Functional Requirements

| Requirement | Specification |
|---|---|
| Performance | First Contentful Paint < 2s; Time to Interactive < 3s |
| Browser Support | Chrome 100+, Safari 15+, Firefox 100+, Edge 100+ |
| Responsive | Desktop (1280px+), Tablet (768–1279px), Mobile (360–767px) |
| Offline | Service worker caches core assets; works offline after first load |
| Hosting | Deployable on Vercel; environment-variable driven API keys if needed |
| Analytics | Google Analytics 4 event tracking (question_answered, lesson_completed, badge_earned) |
| Data Privacy | No PII collected; localStorage only; PDPA Singapore compliant |

---

## 9. Out of Scope

- User authentication / login (no accounts required)
- Teacher dashboard / class management
- Subtraction (separate lesson module)
- Printing / PDF worksheets
- Multi-language support (English only for v1)

---

## 10. Assumptions & Dependencies

- Students arrive at this lesson from the Intellia SG LMS (already know numbers to 100 and basic counting)
- The site is an **iframe-embeddable** React app OR a standalone URL under the Intellia domain
- Design tokens (colours, fonts) will be provided by Intellia SG's brand team, or defaults from this PRD apply
- Sound effects and character assets will be sourced from free-license libraries (e.g., OpenGameArt, Freesound)

---

## 11. Revision History

| Version | Date | Author | Notes |
|---|---|---|---|
| 1.0 | May 2026 | Product Team | Initial draft |
