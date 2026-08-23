# 🐟 Deep-Sea Drift

A fast-paced, bioluminescent 3-lane endless runner game built for mobile browsers using **React**, **Vite**, and **HTML5 Canvas 2D**. Glide through an ocean trench, dodge dangerous jellyfish and coral reefs, collect lustrous pearls, and outrun Bruce the chasing shark!

---

## 🎮 Features & Gameplay

- **3 Depth Currents (Lanes)**: Smoothly switch side-to-side to navigate obstacles.
- **Submerged Dive Mechanic**: Press `▼ DIVE` or swipe down to duck underneath floating jellyfish swarms.
- **Chasing Shark ("Bruce")**: Snapping jaws and animated tail following right behind you — stumble and he lunges closer!
- **Family-Friendly Cartoon Game Over**: Safe, funny screen where Bruce catches your fish in a bubble bowl.
- **Kid-Friendly Pace**: Smooth, gradual speed scaling designed for fun, achievable high scores (5,000m+ depth).
- **Mobile PWA & Touch Optimized**: On-screen glowing touch buttons + swipe gestures + Installable PWA support for iOS and Android home screens.

---

## ⚡ Power-Ups & Collectibles

| Icon | Power-Up | Effect |
| :---: | :--- | :--- |
| 🔮 | **Lustrous Pearls** | Collect for points (+50 points each). |
| ⚡ | **Speed-Up Boost** | 6.5s speed burst with intense wake bubbles & magnetic pearl attraction across lanes. |
| 🐡 | **Giant Titan Fish** | Become a giant predator for 6.5s! Earn 2× pearl points and **chomp through obstacles** for +80 bonus points. |
| 🛡️ | **Shield Armor** | Protective cyan bubble shield that absorbs 1 fatal hit. |

---

## 🕹️ Controls

| Action | Keyboard | Touch / Mobile |
| :--- | :--- | :--- |
| **Move Left** | `←` Left Arrow / `A` | `◀ LEFT` Button / Swipe Left |
| **Move Right** | `→` Right Arrow / `D` | `▶ RIGHT` Button / Swipe Right |
| **Dive (Duck)** | `↓` Down Arrow / `S` | `▼ DIVE` Button / Swipe Down |
| **Pause Game** | `P` / `Space` / `Esc` | ⏸️ Pause Button |

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: React 18 + Vite
- **Engine**: Custom 60 FPS HTML5 Canvas 2D rendering loop (Frame-rate independent delta time updates)
- **Audio**: Procedural Web Audio API synthesis (zero external `.mp3` dependencies)
- **Styling**: Mobile-first responsive CSS with safe-area notch support (`viewport-fit=cover`)
- **Deployment**: Vercel SPA deployment configuration (`vercel.json`)

---

## 🚀 Running Locally
# 1. Clone repository
git clone https://github.com/YOUR-USERNAME/deep-sea-drift.git

# 2. Navigate into directory
cd deep-sea-drift

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
