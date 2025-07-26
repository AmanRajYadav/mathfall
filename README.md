# 🚀 MathFall - Synthwave Arcade Math Game

A fast-paced, visually stunning math game where you destroy falling problems by typing the correct answers. Built with React, TypeScript, and modern web technologies.

## 🎮 Game Features

### Core Gameplay
- **Dynamic Math Problems**: Addition, subtraction, multiplication, division, exponents, roots, fractions, decimals, and complex equations
- **Progressive Difficulty**: Three difficulty levels (Easy, Medium, Hard) with adaptive wave progression
- **Laser Targeting System**: Animated laser beams track your target with particle effects
- **Question Personalities**: Problems have personalities with unique emojis and behaviors:
  - 😊 **Friendly**: Easy, welcoming problems
  - 🤔 **Neutral**: Standard math challenges  
  - 😠 **Aggressive**: Tough problems with special effects (Hard mode)
  - 👑 **Boss**: Ultimate challenges with animated backgrounds (Hard mode)

### Power-Up System
Collect 6 different power-ups that spawn after solving problems:
- ⏰ **Time Warp**: Slows down falling problems
- 💥 **Nuclear Strike**: Instantly destroys all problems on screen
- 🛡️ **Force Shield**: Protects from missed problems
- ⚡ **Rapid Fire**: Allows instant problem solving
- 💎 **Score Multiplier**: Doubles your score
- ❄️ **Freeze Ray**: Freezes all problems in place

### Visual & Audio
- **Synthwave Aesthetic**: Neon colors, gradients, and retro-futuristic design
- **Dynamic Music**: Wave-based soundtrack with synthesized fallbacks
- **Multiple Rocket Types**: 5 different rockets with unique properties
- **Enhanced Particle Effects**: Personality-based explosions and visual feedback
- **Responsive Design**: Optimized for desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/amanrajyadav/mathfall.git
cd mathfall
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:8080`

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build
- `npm run deploy` - Build and prepare for deployment

## 🎯 How to Play

1. **Select Difficulty**: Choose Easy, Medium, or Hard mode
2. **Type Answers**: Use keyboard to input solutions to falling math problems
3. **Collect Power-ups**: Move your rocket with arrow keys to collect power-ups
4. **Survive Waves**: Complete waves by solving all problems before they reach the bottom
5. **Beat Your High Score**: Track your progress and improve your math skills!

### Controls
- **0-9**: Type math answers
- **Backspace**: Delete last digit
- **Arrow Keys/WASD**: Move rocket to collect power-ups
- **Space**: Start game / Restart
- **ESC**: Return to menu

## 📊 Game Statistics

Track your progress with comprehensive statistics:
- High Score and Best Streak
- Accuracy Percentage
- Total Questions Answered
- Time Played
- Current Streak Counter

## 🎨 Customization

### Rocket Selection
Choose from 5 different rockets in the settings:
- **Classic**: Balanced stats
- **Stealth**: Angular design with stealth capabilities
- **Tank**: Heavy armor with robust design
- **Speed**: Sleek and fast
- **Plasma**: Energy-based with special effects

### Audio Settings
- Adjustable music volume
- Music on/off toggle
- Dynamic wave-based soundtrack
- Synthesized fallback music system

## 🛠️ Technical Features

### Built With
- **React 18** with TypeScript for type-safe development
- **Tailwind CSS** for responsive styling and animations
- **Canvas API** for smooth 60fps game rendering
- **Web Audio API** for dynamic music and sound effects
- **Vite** for fast development and optimized builds

### Architecture
- **Component-based Design**: Modular React components for maintainability
- **Custom Hooks**: Reusable logic for mobile detection and game state
- **Type Safety**: Full TypeScript implementation with strict types
- **Performance Optimized**: Efficient collision detection and state management

## 📱 Deployment

The project includes GitHub Actions workflow for automatic deployment to GitHub Pages on every push to main branch.

### Manual Deployment
```bash
npm run build
# The dist folder is ready for deployment
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Future Plans & Roadmap

*Inspired by AAA games like Call of Duty, Fortnite, Apex Legends, and modern arcade experiences*

### 🎮 **Gameplay Evolution**
- **🏆 Battle Royale Math Mode**: 100 players compete in shrinking math zones (inspired by Fortnite/PUBG)
- **⚔️ PvP Math Duels**: Real-time 1v1 battles where solving problems faster gives advantages (Call of Duty-style)
- **🎯 Campaign Mode**: Story-driven levels with boss fights and cutscenes (God of War inspiration)
- **🔄 Endless Mode**: Infinite waves with leaderboards and seasonal challenges (Apex Legends ranked system)
- **🎪 Special Events**: Limited-time modes like "Double XP Weekend" or "Boss Rush" (Overwatch events)

### 🌐 **Multiplayer & Social Features**
- **👥 Squad Mode**: 4-player teams tackle waves together with roles (Tank, DPS, Support, Healer)
- **🏆 Clan System**: Create math clans, participate in clan wars and tournaments
- **📺 Spectator Mode**: Watch top players and learn from their strategies
- **💬 Voice Chat Integration**: Built-in communication for team coordination
- **🎬 Replay System**: Record and share epic math battles (Overwatch highlight system)

### 🎨 **Visual & Audio Enhancements**
- **🌍 Dynamic Environments**: Multiple themed worlds (Space Station, Underwater City, Cyberpunk Tokyo)
- **☁️ Weather Effects**: Rain, snow, and storms that affect gameplay
- **🎵 Adaptive Soundtrack**: Music that changes based on performance and tension (Red Dead Redemption 2 style)
- **✨ Advanced Particle Systems**: Hollywood-quality explosions and effects
- **🎭 Cosmetic Customization**: Rocket skins, trails, emotes, and victory dances

### 🧠 **Advanced Math & Learning**
- **📚 Curriculum Integration**: Align with educational standards (K-12 through College)
- **🎓 Skill Trees**: Unlock new math domains and abilities as you progress
- **📊 AI-Powered Tutoring**: Personalized problem generation based on weaknesses
- **🏅 Achievement System**: 500+ achievements for mastering different math concepts
- **📈 Performance Analytics**: Detailed stats and improvement suggestions

### 🎯 **Competitive & Progression**
- **🏆 Ranked Ladder**: Bronze to Grandmaster tiers with seasonal rewards
- **🎖️ Tournament Mode**: Weekly/monthly competitions with prize pools
- **⭐ Prestige System**: Reset progress for exclusive rewards (Call of Duty prestige)
- **🎁 Battle Pass**: Seasonal content with unlockable rewards and cosmetics
- **🏪 In-Game Store**: Earn currency through gameplay to buy cosmetics

### 🤖 **AI & Technology**
- **🧠 Machine Learning**: AI that adapts difficulty in real-time
- **🎙️ Voice Recognition**: Speak answers instead of typing (Star Trek computer)
- **👁️ Eye Tracking**: Look at problems to target them (future VR integration)
- **🥽 VR/AR Support**: Immersive 3D math battles in virtual reality
- **📱 Cross-Platform**: Seamless play across PC, mobile, console, and VR

### 🌟 **Content & Modes**
- **🏰 Fortress Defense**: Protect your base by solving problems to build defenses
- **🏃 Speed Run Challenges**: Time trial modes with global leaderboards
- **🎭 Creative Mode**: Build custom levels and share with the community
- **📚 Workshop Integration**: Community-created content and mods
- **🎪 Mini-Games**: Math-based puzzles, logic games, and brain teasers

### 🔧 **Quality of Life**
- **💾 Cloud Save**: Progress syncs across all devices
- **📱 Mobile App**: Native iOS/Android versions with touch controls
- **🎮 Controller Support**: Xbox/PlayStation controller compatibility
- **♿ Accessibility**: Colorblind support, keyboard navigation, screen reader compatibility
- **🌍 Localization**: Support for 20+ languages and regional math systems

### 🎊 **Community & Esports**
- **🏆 MathFall Championship**: Annual world tournament with live streaming
- **📺 Twitch Integration**: Stream overlay with viewer problem suggestions
- **🎯 Coach Mode**: Mentors can guide and teach players in real-time
- **📖 Math Wiki**: Community-driven knowledge base and strategy guides
- **🎨 Content Creator Tools**: Built-in recording, editing, and sharing features

---

## 🌟 Credits

- **Powered by**: Fluence
- **Created by**: Aman Raj Yadav
- **Design**: Synthwave/Retrowave aesthetic with modern web technologies

---

**Play MathFall**: [Live Demo](https://amanrajyadav.github.io/mathfall/)

Made with ❤️ for math enthusiasts everywhere!
