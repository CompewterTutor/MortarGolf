# Changelog

All notable changes to the MortarGolf project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2] - 2025-10-17

### Added
- **Complete Type System**: Defined all core types, interfaces, and enums for the golf game
  - `GameState` enum: Lobby, TeeTime, Countdown, Playing, Shopping, RoundEnd, GameOver
  - `HolePhase` enum: Teeoff, Fairway, Putting, Complete
  - `PlayerRole` enum: Golfer, Caddy, Spectator
  - `ShopCategory` enum: Weapons, Ammo, Armor, Gadgets, Buffs, Carts
  - `ClubType` enum: Driver, Iron, Wedge, Putter
  - `HoleData` interface: Complete hole configuration data
  - `HazardData` interface: Obstacle and hazard information
  - `ShotData` interface: Shot mechanics data (power, angle, spin, club)
  - `ScoreData` interface: Hole scoring information
  - `PlayerStats` interface: Cumulative player statistics
  - `GolfPlayer` interface: Extended player type with golf-specific properties

- **Comprehensive Constants**: Added extensive configuration constants
  - Golf scoring: Points for ace, eagle, birdie, par, bogey, etc.
  - Money system: Base rates, bonuses, and shop prices
  - Shot mechanics: Distance modifiers for clubs, lie effects, timeouts
  - Physics: Mortar velocity, gravity, wind, and spin effects
  - Shop system: Duration and pricing structure
  - Timing constants: Lobby, countdown, delays, and update rates
  - Object IDs: Tee boxes, greens, shops (placeholder for Godot setup)
  - UI colors: Team colors, element colors, success/warning/danger states

### Changed
- Updated version from 0.0.1 to 0.0.2
- Reorganized `types.ts` with clear section headers and documentation
- Reorganized `constants.ts` with comprehensive comments
- Renamed color constants for consistency (e.g., `BLACKCOLOR` → `COLOR_BLACK`)

### Technical
- Phase 1.2 of development complete (Core Type Definitions)
- Phase 1.3 of development complete (Constants & Configuration)
- Ready to begin Phase 2 (Core Game Systems)

## [0.0.1] - 2025-10-17

### Added
- Initial project structure and build system setup
- Development documentation:
  - `llm/brief.md`: Complete game design document
  - `llm/dev_guidelines.md`: Best practices and coding patterns
  - `llm/todo.md`: 22-phase granular task list (400+ items)
  - `llm/memory.md`: Development progress tracking
- Professional README.md with full game description
- Basic source file structure:
  - `src/types.ts`: Initial type definitions
  - `src/constants.ts`: Basic constants
  - `src/state.ts`: State management (placeholder)
  - `src/helpers.ts`: Utility function library (50+ functions)
  - `src/ui.ts`: UI components (placeholder)
  - `src/player.ts`: Player management (placeholder)
  - `src/messages.ts`: Message system (placeholder)
  - `src/gameflow.ts`: Game logic (placeholder)
  - `src/updates.ts`: Update loops (placeholder)
  - `src/events.ts`: Event handlers (placeholder)
- Build system configuration (`build.config.json`)
- Package.json with build scripts

### Technical
- Phase 1.1 complete (Project Structure)
- Foundation ready for feature implementation

---

**Version Format**: [major.minor.patch]
- **major**: Breaking changes or complete rewrites
- **minor**: New features, gameplay additions
- **patch**: Bug fixes, tweaks, small improvements