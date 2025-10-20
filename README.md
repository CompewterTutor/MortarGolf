# ⛳ MortarGolf - Battlefield 6 Portal Game Mode

[![Version](https://img.shields.io/badge/version-0.0.6-blue.svg)](https://github.com/compewtertutor/mortargolf)
[![Status](https://img.shields.io/badge/status-in%20development-yellow.svg)](https://github.com/compewtertutor/mortargolf)
[![BF6 Portal](https://img.shields.io/badge/BF6-Portal-orange.svg)](https://github.com/compewtertutor/mortargolf)

> **Golf. But with Mortars. And Combat. And Golf Carts.**

MortarGolf is a wacky take on traditional golf where you use mortars to shoot your way through 9 holes, drive golf carts across the battlefield, and fend off opponents trying to disrupt your perfect backswing. Speed matters, accuracy matters, and survival definitely matters.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Gameplay](#-gameplay)
- [Installation](#-installation)
- [How to Play](#-how-to-play)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🎮 Overview

### The Concept

Imagine golf, but instead of a golf ball, you're shooting mortars. Instead of a golf cart, you're driving a military vehicle. Instead of peaceful putting greens, you're dodging gunfire from other players. That's MortarGolf.

### Game Mode Details

- **Type**: Team-based competitive golf with combat
- **Players**: 1-32 players (Recommended: 4-16)
- **Teams**: Up to 4 teams of 1-2 players (golfer + caddy)
- **Duration**: 9 holes (18-hole expansion planned)
- **Maps**: Firestorm (more maps planned)

### What Makes It Unique

1. **Mortar-Based Golf**: Use mortars with adjustable power, angle, and spin to reach the green
2. **Combat Golf**: Shoot at opponents during their shots to disrupt them (but watch out for their caddy!)
3. **Speed Factor**: Time matters - fastest completion earns more money
4. **Shop System**: Buy weapons, armor, and upgrades between holes
5. **Caddy System**: AI or player-controlled caddies provide support, defense, and revives
6. **Career Tracking**: Generate a passcode at the end of each round to track your career on an external website

---

## ✨ Features

### Core Gameplay

- ⛳ **9-Hole Golf Course** - Designed on Battlefield's Firestorm map
- 🎯 **Mortar Shot Mechanics** - 3-click shot meter (backswing, power, follow-through)
- 🏌️ **Putting System** - Dart-based putting with randomized targets when you reach the green
- 🚙 **Golf Cart Combat** - Drive jeeps/humvees between shots while avoiding enemy fire
- 🤝 **Caddy System** - AI or player caddies defend you and revive you when downed
- ⏱️ **Time-Based Scoring** - Speed bonuses for completing holes quickly

### Scoring & Progression

- 📊 **Dual Scoring** - Traditional golf score + time-based performance
- 💰 **Money System** - Earn currency based on performance
- 🏆 **Leaderboards** - Live leaderboards during play
- 🎖️ **Achievements** - Track career accomplishments
- 🔑 **Career Passcodes** - Persist stats across matches via external website

### Shop & Equipment

- 🛒 **Between-Hole Shop** - Purchase upgrades, weapons, ammo, and armor
- 🎲 **Random Items** - Shop inventory rotates, offering different items each hole
- ⚔️ **Weapon Variety** - Customize your loadout for combat and defense
- 🚗 **Cart Upgrades** - Improve your vehicle's speed and durability
- 🎨 **Customization** - Unlock collectibles and cosmetics in the Pro Shop

### Social Features

- 🏌️ **Tee Times** - Schedule matches with other players
- 🎯 **Driving Range** - Practice your shot mechanics
- 👥 **Pro Shop** - Social hub, leaderboards, and collectible shop
- 👀 **Spectator Mode** - Watch other foursomes from the gallery
- 💬 **In-Game Chat** - Communicate with teammates and opponents

---

## 🎯 Gameplay

### The Flow

1. **Matchmaking** - Form a foursome (4 players with optional caddies)
2. **Tee Off** - All players address their "ball" (mortar) simultaneously
3. **The Drive** - Navigate to your next shot location while fending off opponents
4. **The Approach** - Take subsequent shots to reach the green
5. **The Putt** - Use the dart-based putting system to sink your shot
6. **Shopping** - Spend earned money on equipment for the next hole
7. **Next Hole** - Repeat until all 9 holes are complete
8. **Tournament End** - Final scores, podium, and career passcode generation

### Shot Mechanics

#### Setup
- Select your club (driver, iron, wedge, putter)
- Adjust aim direction
- Set launch angle
- Apply spin (hook/slice/backspin/topspin)

#### Execution
1. **Click 1**: Start backswing
2. **Click 2**: Determine shot power (meter-based)
3. **Click 3**: Determine accuracy (hook/slice based on timing)

#### Factors
- **Lie Type**: Fairway (normal), Rough (reduced power), Tee Box (enhanced)
- **Wind**: Directional wind affects trajectory
- **Obstacles**: Navigate around or through destructible obstacles
- **Combat**: Getting hit during your shot can ruin your aim

### Combat

- **During Driving**: Full combat enabled while navigating between shots
- **During Shots**: You're vulnerable, but your caddy provides cover
- **Death Penalty**: +1 stroke and respawn at last position
- **Caddy Revive**: Caddies can revive downed golfers
- **Caddy Death**: Temporary respawn delay

### Scoring

#### Golf Score (Primary)
- Strokes taken to complete the hole
- Compared to par (under par = birdie, eagle, etc.)
- Lower is better

#### Time Score (Secondary)
- Total time to complete the hole
- Faster times earn more money
- Used as tiebreaker

#### Combined Ranking
- Winner has the best golf score
- Ties broken by fastest time
- Money earned based on both factors

---

## 🚀 Installation

### For Players

1. **Launch Battlefield 6**
2. **Navigate to Portal Mode**
3. **Search for "MortarGolf"** in the server browser
4. **Join a Server** or create your own with the MortarGolf ruleset

### For Server Hosts

1. **Open BF6 Portal Editor**
2. **Import MortarGolf.ts** from this repository
3. **Configure Settings** (player count, round duration, etc.)
4. **Publish Server** and share with friends

---

## 📖 How to Play

### Getting Started

1. **Join a Server** - Find a MortarGolf server in the browser
2. **Select Role** - Choose to be a golfer or caddy
3. **Wait for Tee Time** - Matchmaking will form foursomes
4. **Accept Rules** - Read and accept the game rules
5. **Get to Your Cart** - Spawn and drive to the first tee

### Controls

| Action | Input |
|--------|-------|
| Aim Shot | Mouse/Right Stick |
| Adjust Power | Click/Trigger (timing based) |
| Adjust Angle | Mouse Wheel/D-Pad |
| Apply Spin | WASD/Left Stick |
| Select Club | Number Keys/Bumpers |
| Enter Cart | E/Interact |
| Exit Cart | E/Interact |
| Shoot Weapon | Left Click/Right Trigger |
| Revive Teammate | Hold E/Hold Interact |
| Open Shop | Auto-opens between holes |

### Tips & Strategies

- **Drive Smart**: Faster routes aren't always safer
- **Protect Your Shot**: Position your caddy strategically
- **Manage Money**: Save for important holes, splurge when needed
- **Read the Wind**: Check wind direction before every shot
- **Know Your Clubs**: Use the right tool for the distance
- **Speed vs. Safety**: Decide when to rush and when to take your time
- **Combat Timing**: Disrupt opponents during their backswing for maximum effect

---

## 🛠️ Development

### Project Structure

```
mods/MortarGolf/
├── src/                      # Source files (multi-file development)
│   ├── types.ts              # Type definitions
│   ├── constants.ts          # Configuration
│   ├── state.ts              # Global state
│   ├── helpers.ts            # Utility functions
│   ├── ui.ts                 # UI components
│   ├── player.ts             # Player management
│   ├── messages.ts           # Message system
│   ├── gameflow.ts           # Game flow logic
│   ├── updates.ts            # Update loops
│   └── events.ts             # Event handlers
├── DOCS/                     # Documentation
│   ├── BF6_SDK.md            # SDK documentation
│   ├── BUILD_SYSTEM.md       # Build system guide
│   ├── common_checklist.md   # Development checklist
│   └── dev_guidelines.md     # Coding guidelines
├── llm/                      # LLM development files
│   ├── brief.md              # Project brief
│   ├── todo.md               # Task list
│   ├── memory.md             # Dev progress tracking
│   └── prompts.md            # Useful prompts
├── build.config.json         # Build configuration
├── MortarGolf.ts             # Generated single-file output
├── CHANGELOG.md              # Version history
└── README.md                 # This file
```

### Building from Source

#### Prerequisites

```bash
npm install
```

#### Development Mode

```bash
# Watch for changes and auto-rebuild
npm run watch:mortar

# Or build once
npm run build:mortar
```

#### Output

The build system combines all `src/*.ts` files into a single `MortarGolf.ts` file ready for BF6 Portal.

### Development Workflow

1. **Read the Brief** (`llm/brief.md`) - Understand the game design
2. **Follow Guidelines** (`llm/dev_guidelines.md`) - Code standards and patterns
3. **Track Progress** (`llm/todo.md`) - Granular task list
4. **Document Decisions** (`llm/memory.md`) - Keep notes on progress
5. **Update Changelog** (`CHANGELOG.md`) - Log all changes
6. **Build & Test** - Use watch mode during development
7. **Commit** - Commit both source files and generated output

### Technology Stack

- **Language**: TypeScript
- **SDK**: Battlefield 6 Portal SDK
- **Build System**: Custom Node.js builder
- **Mod Library**: `modlib` (BF6 utility library)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/videos if applicable

### Suggesting Features

1. Open an issue with the `enhancement` label
2. Describe the feature and why it would be valuable
3. Include mockups or examples if possible

### Contributing Code

1. **Fork the Repository**
2. **Create a Branch** (`git checkout -b feature/AmazingFeature`)
3. **Follow Dev Guidelines** (see `llm/dev_guidelines.md`)
4. **Make Changes** in `src/` files, not the generated output
5. **Test Thoroughly**
6. **Build** (`npm run build:mortar`)
7. **Commit** (`git commit -m 'Add some AmazingFeature'`)
8. **Push** (`git push origin feature/AmazingFeature`)
9. **Open a Pull Request**

### Code Style

- Follow existing patterns in `dev_guidelines.md`
- Use TypeScript types appropriately
- Comment complex logic
- Keep functions small and focused
- Test with multiple player counts

---

## 📝 Roadmap

### v0.1 - MVP (Current)

- [x] Project setup and documentation
- [x] Core type definitions complete
- [x] Constants and configuration complete
- [ ] Basic single-hole gameplay
- [ ] Shot mechanics (mortar system)
- [ ] Simple scoring
- [ ] Basic UI

### v0.5 - Alpha
- [ ] Full 9-hole course
- [ ] Advanced shot mechanics (spin, lie effects)
- [ ] Shop system
- [ ] Combat mechanics
- [ ] AI caddy system
- [ ] Multiple foursome support

### v1.0 - Release
- [ ] Complete feature set
- [ ] Pro shop & career tracking
- [ ] Driving range
- [ ] Full polish (VFX, SFX, UI)
- [ ] Comprehensive testing
- [ ] 32-player support

### v2.0 - Expansion
- [ ] 18-hole courses
- [ ] Additional maps
- [ ] Tournament modes
- [ ] Skins game
- [ ] Procedural obstacles
- [ ] Enhanced social features

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

**Note**: This mod requires Battlefield 6 and is built using the official BF6 Portal SDK. All Battlefield assets and trademarks are property of EA/DICE.

---

## 📞 Contact & Support

### Developer

- **Name**: CompewterTutor
- **Email**: compewtertutor@gmail.com
- **GitHub**: [@compewtertutor](https://github.com/compewtertutor)

### Project Links

- **Repository**: [github.com/compewtertutor/mortargolf](https://github.com/compewtertutor/mortargolf)
- **Issues**: [github.com/compewtertutor/mortargolf/issues](https://github.com/compewtertutor/mortargolf/issues)
- **Discussions**: [github.com/compewtertutor/mortargolf/discussions](https://github.com/compewtertutor/mortargolf/discussions)

### Community

- Join the discussion in Issues
- Share your best rounds
- Submit course ideas
- Report bugs and suggest features

---

## 🙏 Acknowledgments

- **EA/DICE** - For Battlefield 6 and the Portal SDK
- **BF6 Portal Community** - For inspiration and feedback
- **Official Game Modes** - Vertigo, BombSquad, AcePursuit, Exfil for reference patterns

---

## 📸 Screenshots

*(Coming soon - screenshots and gameplay videos will be added as development progresses)*

---

## 🎮 Play MortarGolf Today!

Ready to tee off? Find a MortarGolf server in Battlefield 6 Portal and start your golf career!

**Par for the course has never been this explosive.** ⛳💥

---

*Last Updated: October 17, 2025*
*Version: 0.0.6*
