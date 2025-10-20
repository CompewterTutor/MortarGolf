# Changelog

All notable changes to the MortarGolf project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.6] - 2025-10-20

### Added
- **9-Hole Course Configuration** (`constants.ts`): Complete Firestorm golf course layout
  - `COURSE_HOLES` array with all 9 holes fully defined
  - Hole 1: Par 4, 180m - "The Opening Drive" (gentle start, wide fairway)
  - Hole 2: Par 4, 200m - "Dogleg Danger" (slight dogleg right with obstacles)
  - Hole 3: Par 3, 120m - "Island Green" (short precision shot over hazards)
  - Hole 4: Par 4, 210m - "High Ground" (open but elevated green)
  - Hole 5: Par 5, 280m - "The Gauntlet" (long hole with multiple hazards)
  - Hole 6: Par 3, 95m - "Bunker Hell" (very short but heavily guarded)
  - Hole 7: Par 4, 190m - "Tight Squeeze" (narrow fairway requires accuracy)
  - Hole 8: Par 3, 140m - "The Drop" (mid-range par 3, elevated tee)
  - Hole 9: Par 5, 300m - "Championship Finish" (dramatic finishing hole)
  - Total Par: 36, Total Distance: 1815m
  - Each hole includes: tee position, green position, par, distance, fairway width, green radius, hazards
  - Hazard types: rough, sand, destructible obstacles
  - Course statistics constants: total par, total distance, par breakdown

- **Course Management Module** (`course.ts`): Comprehensive course handling system
  - `initializeCourse()`: Validates and initializes course data on game start
  - `getCourseHole(holeNumber)`: Retrieve specific hole data by number (1-9)
  - `getCurrentHole()`: Get current hole data based on game state
  - `getAllHoles()`, `getFirstHole()`, `getLastHole()`: Course data accessors
  - `getNextHoleNumber()`, `getPreviousHoleNumber()`: Hole navigation helpers
  - `validateHoleNumber()`: Validate hole number is in range
  - `isFirstHole()`, `isLastHole()`, `isCourseComplete()`: Hole status checks
  - `getTotalParForRange()`, `getTotalDistanceForRange()`: Range statistics
  - `getCourseDifficulty()`: Calculate average par across all holes
  - `getHolesByPar()`: Find holes by par value (3, 4, or 5)
  - `formatHoleName()`, `formatHoleInfo()`: Formatted hole descriptions
  - `getCourseProgress()`, `getHolesRemaining()`: Progress tracking utilities
  - Full validation of hole data structure on initialization

### Changed
- **State Management** (`state.ts`): Added `getCurrentHoleNumber()` getter function
  - Allows course module to access current hole number
  - Maintains encapsulation of state variables

- **Build Configuration**: Added `course.ts` to build pipeline
  - Course module now included in compilation
  - Build output increased to 4106 lines (from 3590)

### Technical
- Phase 3.1 complete (Hole Configuration) ✅
- Complete 9-hole course designed for Firestorm map
- Course coordinates are placeholders to be updated with actual Godot trigger positions
- All holes validated with realistic par, distance, and hazard configurations
- Foundation ready for Phase 3.2 (Course Objects - area triggers, markers)
- Next: Create actual area triggers in Godot and update coordinates

### Architecture Notes
- Course data is immutable (const array) for performance
- Validation runs at initialization to catch configuration errors early
- Hole numbers are 1-based for player-facing display (converted internally)
- Course module provides comprehensive helper functions for all hole-related queries
- Designed for future expansion: easy to add more courses/holes

## [0.0.5] - 2025-10-17

### Added
- **State Machine System** (`statemachine.ts`): Complete game state management
  - Valid state transition system with guards
  - GameState machine: Lobby → TeeTime → Countdown → Playing → Shopping → RoundEnd → GameOver
  - State entry/exit callbacks for custom behavior per state
  - State transition functions: `startTeeTime()`, `startCountdown()`, `startPlaying()`, `openShop()`, `endHole()`, `endRound()`, `nextHole()`, `returnToLobby()`
  - State query functions: `isInLobby()`, `isPlaying()`, `isShopOpen()`, etc.
  - State timer system with countdown support
  - Pause/resume functionality for game states
  - Automatic state initialization on game start

- **State-Specific Update Loops** (`updates.ts`): Different logic per game state
  - Fast tick updates (60fps) for each state with switch-case logic
  - Slow throttled updates (1s) for each state with timer management
  - Lobby updates: Matchmaking queue processing, player count checks
  - TeeTime updates: Tee box readiness checks, countdown display
  - Countdown updates: Countdown messages, auto-transition to playing
  - Playing updates: Shot tracking, hole completion detection, victory conditions
  - Shopping updates: Shop timer display, auto-close and transition to next hole
  - RoundEnd updates: Score display, automatic progression
  - GameOver updates: Final scores and stats display
  - Helper functions: `checkAllPlayersComplete()`, `updatePlayerUI()`

- **Timer System**: Countdown timers for all game phases
  - Lobby countdown (10s configurable)
  - Tee time countdown (30s to reach tee box)
  - Combat countdown (5s before play starts)
  - Shop duration (30s shopping window)
  - Round end display (10s score viewing)
  - State timer management with automatic decrements

- **Event Handler Integration** (`events.ts`): State machine integration
  - Initialize state machine in `OnGameModeStarted()`
  - Automatic matchmaking queue additions on player join
  - State-aware player spawning based on role
  - Death penalties during playing state (+1 stroke for golfers)
  - State-based UI display (lobby, game, shop)
  - Player role tracking on team switches

- **Constants**: Added timing constants for state transitions
  - `LOBBY_COUNTDOWN_SECONDS`: 10
  - `TEE_TIME_COUNTDOWN_SECONDS`: 30
  - `COMBAT_COUNTDOWN_SECONDS`: 5
  - `ROUND_END_DISPLAY_SECONDS`: 10

### Changed
- **Update Loops**: Completely refactored with state-specific behavior
  - Replaced simple continuous loops with state machine-driven updates
  - Added pause detection to skip updates when game is paused
  - Separated fast (60fps) and slow (1s) logic per state
  - Improved player validation in update loops (use `GolfPlayer` instances)

- **Game Flow**: Removed legacy combat countdown, now managed by state machine
  - Game automatically progresses through states based on conditions
  - Timer-based automatic transitions (shop closes, holes advance, etc.)
  - Player actions trigger state changes (all holed out → end hole)

### Fixed
- **Player Instance Access**: Corrected all player property access patterns
  - Use `GolfPlayer.getAllGolfers()` instead of raw `playerInstances`
  - Fixed player validity checks to use `mod.IsPlayerValid(golfPlayer.player)`
  - Consistent use of GolfPlayer class throughout codebase

### Technical
- Phase 2.3 complete (State Management System) ✅
- State machine handles all game flow transitions
- Update loops are now state-driven with proper separation of concerns
- Build system updated to include `statemachine.ts` (3590 total lines compiled)
- All state transitions validated and protected
- Pause/resume system ready for admin controls
- Foundation ready for UI phase-specific implementations
- Next: Phase 2.4 would be additional polish, but moving to Phase 3 (Golf Course System)

### Architecture Notes
- State machine uses Map-based transition validation
- Callbacks allow custom logic on state enter/exit
- Timer system integrated into state machine (not separate)
- State persistence handled through state variables
- All state queries are centralized for easy debugging

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