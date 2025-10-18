# Changelog

All notable changes to the MortarGolf project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.4] - 2025-10-17

### Added
- **Foursome Class**: Complete group management system for up to 4 players
  - Add/remove players (2 golfers + 2 caddies max)
  - Team color assignment (Red, Blue, Green, Yellow)
  - Hole progression tracking and completion detection
  - Automatic caddy-golfer pairing within groups
  - Group disbanding and cleanup
  - Static helper methods for finding and managing foursomes
  - Support for up to 4 simultaneous foursomes (32 players)

- **MatchmakingQueue Class**: Intelligent player queue and group formation
  - Queue management with player preferences (Golfer/Caddy role)
  - Wait time tracking and prioritization
  - Automatic foursome formation (balanced 2+2 groups)
  - Auto-assignment of long-wait players
  - Solo player placement in existing foursomes
  - Queue statistics (size, roles, average wait time)
  - Immediate foursome formation on demand

- **Team Color System**:
  - TeamColor enum (Red, Blue, Green, Yellow)
  - Automatic team assignment via SDK
  - Team color arrays for UI display
  - Team name helpers ("Red Team", etc.)

- **Localization Strings**: Added comprehensive message strings
  - Matchmaking messages (queue, group formation)
  - Hole progression messages (starting, complete, next hole)
  - Shot result messages (ace, birdie, par, etc.)
  - Shop system messages
  - Combat messages (downed, revived)
  - Round completion messages

- **Helper Functions**: Added group management utilities
  - `GetFoursomeHoleTime()`: Calculate elapsed time
  - `FormatHoleTime()`: Format time as MM:SS
  - `AreAllPlayersValid()`: Validate player arrays
  - `RemoveInvalidPlayers()`: Clean invalid players
  - `IsValidHole()`, `GetNextHole()`, `IsFinalHole()`: Hole navigation
  - Group scoring helpers (best score, average score)

### Changed
- Updated `helpers.ts` to use `GolfPlayer` instead of `JsPlayer`
- Build configuration now includes `foursome.ts` and `matchmaking.ts`
- All player instances now properly typed with GolfPlayer class

### Technical
- Phase 2.2 complete (Team & Group Management)
- Multi-foursome tracking system ready
- Player role assignment fully functional
- Foundation ready for hole progression implementation
- Next: Phase 2.3 (State Management System)

## [0.0.3] - 2025-10-17

### Added
- **GolfPlayer Class**: Refactored JsPlayer to fully implement GolfPlayer interface
  - All golf-specific properties: role, teamId, caddy/golfer references
  - Current hole state: currentHole, holePhase, shotCount, currentLie
  - Scoring system: holeScores array, cumulative PlayerStats, money tracking
  - Shot tracking: lastShotPosition, ballPosition, distanceToPin
  - Selected club tracking
  
- **Player Management Methods**:
  - `setRole()`: Assign player role (Golfer, Caddy, Spectator)
  - `assignCaddy()` / `assignGolfer()`: Bidirectional pairing system
  - `unpair()`: Remove caddy/golfer pairings
  - `startHole()`: Initialize hole state
  - `completeHole()`: Record score and update stats
  - `takeShot()`: Increment shot count
  - `setLie()`: Update lie type and switch to putting phase
  - `getTotalScore()`: Get cumulative strokes
  - `getScoreRelativeToPar()`: Calculate score vs par
  - `getHoleScore()`: Retrieve specific hole score
  - `hasCaddy()`: Check caddy assignment
  - `isOnGreen()`: Check if on green

- **Static Player Methods**:
  - `getAllGolfers()`: Get all golfer GolfPlayer instances
  - `getAllCaddies()`: Get all caddy GolfPlayer instances
  - `getAll()`: Get all GolfPlayer instances

- **State Management Enhancements**:
  - Added golf-specific state variables: currentHoleNumber, roundStartTime, holeStartTime
  - Player role tracking arrays: golfers, caddies, spectators
  - Foursome system with interface and tracking array
  - State setter functions for all new variables
  - Helper functions: addGolfer, removeGolfer, addCaddy, removeCaddy, etc.
  - Foursome management: createFoursome, removeFoursome, clearAllFoursomes

- **Constants**:
  - Added `minimumInitialPlayerCount` for UI compatibility

### Changed
- Renamed `JsPlayer` class to `GolfPlayer` throughout codebase
- Updated player constructor to initialize hole scores array
- Enhanced `destroyUI()` to clean up all tracked widgets
- Improved `removeInvalidJSPlayers()` with typed forEach parameters

### Technical
- Phase 2.1 complete (Player Management System)
- All player management tasks completed
- Ready for Phase 2.2 (Team & Group Management)

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