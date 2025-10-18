# MortarGolf Development Memory

**Project**: MortarGolf - Golf with Mortars Game Mode  
**Started**: October 17, 2025  
**Current Phase**: Phase 2 - Core Game Systems (In Progress)  
**Status**: Phase 2.1 Complete ✅ - Player Management System

---

## Current State

### What We're Working On
- **Development Tooling**: Added automated version bump script
  - ✅ Created Python version bump automation
  - ✅ Updated dev guidelines with git repo info
  - **Next**: Continue with Phase 2.2 - Team & Group Management

### Recently Completed (October 17, 2025 - Late Evening Session Continued)

**Development Tooling Improvements** ✅

1. ✅ **Automated Version Bump Script**:
   - Created `tools/bump_version.py` for automated version management
   - Automatically updates:
     - `package.json` version field
     - `src/constants.ts` VERSION constant
     - `README.md` version badge and footer
     - `llm/todo.md` version and date
     - `CHANGELOG.md` with new version template
   - Supports major/minor/patch semver bumping
   - Works with SDK's bundled Python or any Python 3.x

2. ✅ **Dev Guidelines Enhancement**:
   - Added git repository root clarification
   - Documented that git root is MortarGolf folder, not parent
   - Added version bump script usage instructions
   - Included SDK Python path examples
   - Documented post-bump workflow

**Version 0.0.3 - Player Management System** ✅

1. ✅ **GolfPlayer Class Refactor**:
   - Refactored `JsPlayer` → `GolfPlayer` implementing full interface
   - Added all golf-specific properties:
     - Role system (golfer/caddy/spectator)
     - Team ID tracking
     - Caddy/golfer bidirectional references
     - Current hole state (hole number, phase, shots, lie)
     - Scoring arrays (hole scores, cumulative stats)
     - Money tracking
     - Shot data (position, distance to pin, selected club)

2. ✅ **Player Management Methods**:
   - `setRole()`: Assign and switch player roles
   - `assignCaddy()` / `assignGolfer()`: Bidirectional pairing
   - `unpair()`: Break caddy-golfer relationships
   - `startHole()`: Initialize new hole state
   - `completeHole()`: Record score and update stats
   - `takeShot()`: Track shot count
   - `setLie()`: Update surface type and switch to putting
   - `getTotalScore()`: Get cumulative score
   - `getScoreRelativeToPar()`: Calculate score vs par
   - `getHoleScore()`: Retrieve specific hole data
   - `hasCaddy()`: Check pairing status
   - `isOnGreen()`: Check putting phase eligibility

3. ✅ **Static Helper Methods**:
   - `getAllGolfers()`: Filter all golfer instances
   - `getAllCaddies()`: Filter all caddy instances
   - `getAll()`: Get all GolfPlayer instances

4. ✅ **State Management Enhancement**:
   - Added golf-specific state variables:
     - `currentHoleNumber`, `roundStartTime`, `holeStartTime`
     - Player role arrays: `golfers[]`, `caddies[]`, `spectators[]`
   - Created `Foursome` interface with tracking
   - Added state setters for all new variables
   - Helper functions for player array management
   - Foursome management functions

5. ✅ **Version Bump**: 0.0.2 → 0.0.3
6. ✅ **Documentation Updates**: CHANGELOG.md, memory.md

### Previous Completed Sessions

**Version 0.0.2 - Type System & Constants** (Oct 17, Evening)
- Complete type definitions (15+ types and interfaces)
- Comprehensive constants (100+ configuration values)

**Version 0.0.1 - Project Foundation** (Oct 17, Afternoon)
- Project structure and build system
- Development documentation suite
- Helper library with 50+ functions

---

## Project Overview

### Vision
MortarGolf is a unique blend of golf and combat - players use mortars to shoot through 9 holes while driving golf carts and fending off opponents. Think "Happy Gilmore meets Battlefield" with AI caddies, between-hole shopping, and speed-based scoring.

### Key Differentiators
1. **Mortar-based Golf** - 3-click shot meter system for precise control
2. **Combat During Play** - Opponents can disrupt your shots
3. **Speed Matters** - Faster completion earns more money
4. **Shop System** - Buy upgrades between holes
5. **Caddy System** - AI or player caddies provide support
6. **Career Tracking** - Passcode system for persistent stats

### Technical Approach
- Multi-file TypeScript development using custom build system
- Modular architecture with clear separation of concerns
- Comprehensive helper library for common operations
- Following patterns from official BF6 Portal mods

---

## Important Decisions

### Architecture Decisions

#### Build System Choice
**Decision**: Use multi-file development with custom build system  
**Reason**: Better code organization, easier maintenance, cleaner git diffs  
**Trade-off**: Requires build step, but worth it for clarity  
**Date**: October 17, 2025

#### File Organization
**Decision**: Organize by functionality (types, state, helpers, ui, etc.)  
**Structure**:
```
src/
├── types.ts       # Type definitions
├── constants.ts   # Configuration
├── state.ts       # Global state
├── helpers.ts     # Utilities
├── ui.ts          # UI components
├── player.ts      # Player management
├── messages.ts    # Messages
├── gameflow.ts    # Game logic
├── updates.ts     # Update loops
└── events.ts      # Event handlers
```
**Reason**: Matches official mod patterns, scales well  
**Date**: October 17, 2025

### Gameplay Decisions

#### Shot Mechanic: Mortar vs Other Options
**Decision**: Use mortars as the "golf ball"  
**Alternatives Considered**: Grenades, actual golf balls, tank shells  
**Reason**: Mortars provide the arc trajectory needed for golf-like gameplay  
**Trade-offs**: May need custom physics tuning for realistic distances  
**Date**: October 17, 2025

#### Putting System: Dart-Based
**Decision**: Use dart + randomized target system for putting  
**Alternatives Considered**: Traditional meter, skill-based aim  
**Reason**: Adds variety, prevents putting from being too easy/formulaic  
**How**: Target spawns at distance based on previous putt accuracy  
**Date**: October 17, 2025

#### Combat Integration
**Decision**: Allow combat during opponent shots, caddy provides defense  
**Reason**: Adds tension and strategy without making combat the primary focus  
**Balance**: Caddies can revive, death = +1 stroke penalty  
**Date**: October 17, 2025

#### Score Persistence: Passcode System
**Decision**: Generate passcodes for external website tracking  
**Reason**: SDK doesn't support networking, this is a creative workaround  
**Future**: Could use QR codes for easier mobile entry  
**Date**: October 17, 2025

#### Development Tooling: Automated Version Bumping
**Decision**: Created Python script for automated version management  
**Reason**: Manual version updates across 5+ files is error-prone and tedious  
**Benefits**: Single command updates all version references consistently  
**Implementation**: `tools/bump_version.py` with semver support (major/minor/patch)  
**Files Updated**: package.json, constants.ts, README.md, todo.md, CHANGELOG.md  
**Date**: October 17, 2025

#### Git Repository Root
**Decision**: MortarGolf folder is the git repository root  
**Reason**: Allows independent version control for the mod  
**Impact**: All git commands must be run from MortarGolf directory  
**Documentation**: Added to dev_guidelines.md with examples  
**Date**: October 17, 2025

#### Localization Strings File
**Decision**: All user-facing text must be in `MortarGolf.strings.json` - **CRITICAL REQUIREMENT**  
**Reason**: Follow SDK best practices for localization support  
**Rule**: **NEVER** hardcode display strings in TypeScript - always use the strings file with `mod.Message()`  
**Format**: JSON file with string keys and placeholder support (e.g., `{}` for dynamic values)  
**Location**: Root of mod folder alongside compiled TypeScript  
**Examples**: See BombSquad.strings.json, Vertigo.strings.json for reference patterns  
**Documentation**: Added comprehensive section to dev_guidelines.md with prominent reminder  
**Date**: October 17, 2025

---

## Technical Notes

### Development Tools

#### Version Bump Script
Location: `tools/bump_version.py`

Automates version updates across project:
- Updates package.json version field
- Updates constants.ts VERSION constant array
- Updates README.md badges and footer
- Updates todo.md version and date
- Creates CHANGELOG.md template for new version

Usage:
```bash
python tools/bump_version.py patch  # 0.0.3 -> 0.0.4
python tools/bump_version.py minor  # 0.0.3 -> 0.1.0
python tools/bump_version.py major  # 0.0.3 -> 1.0.0
```

Can be run with SDK's bundled Python:
```bash
../../python/python.exe tools/bump_version.py patch
```

### SDK Limitations Discovered
1. **No Networking**: Can't persist data across matches directly
   - **Workaround**: Passcode system for external website
2. **Single File Requirement**: Portal requires one .ts file
   - **Workaround**: Build system combines multiple files
3. **Limited Animations**: Can't create custom player animations
   - **Workaround**: Use existing soldier animations creatively

### Helper Functions Added
Added 50+ helper functions to `src/helpers.ts`:
- **Team Management**: GetPlayersOnTeam, CountAlivePlayersOnTeam, AreTeammates
- **Scoring**: FormatScore, GetScoreName, SortPlayersByScore
- **Math**: Clamp, Lerp, GetAngleBetween, NormalizeAngle
- **Colors**: Predefined color constants, hex to RGB conversion
- **Arrays**: Shuffle, WeightedRandom, UniqueArray
- **Timers**: CountdownTimer, WaitForCondition, DelayedExecute
- **Formatting**: FormatTime, FormatNumber, RoundTo

### Code Patterns to Follow
Based on official mods (Vertigo, BombSquad, etc.):
1. Always use `mod.GetObjId()` for team comparisons
2. Check `IsPlayerValid()` before accessing players
3. Clean up UI elements in `OnPlayerLeaveGame`
4. Use separate fast (NextTick) and slow (Wait) update loops
5. Cache frequently used objects

---

## Blockers & Questions

### Current Blockers
None at this time.

### Open Questions
1. **Q**: How to best implement the AI caddy pathfinding?
   - **Status**: Need to research BF6 AI capabilities
   - **Priority**: Medium (v0.5 feature)

2. **Q**: What's the best way to detect "on green" vs "on fairway"?
   - **Options**: Area triggers, position checking, collision detection
   - **Status**: Leaning toward area triggers for simplicity
   - **Priority**: High (v0.1 feature)

3. **Q**: How to implement wind effects on mortar trajectory?
   - **Status**: May need to study projectile physics in SDK
   - **Priority**: Medium (v0.5 feature)

---

## Lessons Learned

### From Setup Phase
1. **Documentation First Pays Off**: Creating comprehensive docs before coding helps clarify the vision
2. **Build System is Essential**: Multi-file development is much cleaner than single file
3. **Helper Functions Save Time**: Creating a utility library up front prevents code duplication
4. **Todo Granularity**: Breaking tasks into small pieces makes progress trackable

### Best Practices Established
1. Always read the brief before starting a new phase
2. Follow the dev guidelines for consistent code style
3. Update memory.md with any important decisions
4. Keep CHANGELOG.md current
5. Test with multiple player counts early and often
6. **🔴 CRITICAL: All user-facing text goes in MortarGolf.strings.json** - Never hardcode strings in TypeScript, always use `mod.Message()`
7. Use the version bump script for all version updates
8. Reference existing 1st party mod strings files (BombSquad, Vertigo) for format examples

---

## Resources & References

### Documentation
- Project Brief: `llm/brief.md`
- Dev Guidelines: `llm/dev_guidelines.md`
- Todo List: `llm/todo.md`
- SDK Docs: `DOCS/BF6_SDK.md`
- Build System: `DOCS/BUILD_SYSTEM.md`

### Official Mod References
- `mods/Vertigo/Vertigo.ts` - Capture point mechanics
- `mods/BombSquad/BombSquad.ts` - Objective-based gameplay
- `mods/AcePursuit/AcePursuit.ts` - Vehicle mechanics
- `mods/Exfil/Exfil.ts` - Team coordination

### External Resources
- BF6 Portal SDK: TypeScript API for game mode creation
- modlib: Utility library from official SDK

---

## Development Timeline

### Phase 1: Foundation (Oct 17, 2025)
- [x] Project structure created
- [x] Documentation written
- [x] Build system configured
- [x] Helper library expanded
- [ ] Core types defined (Next)
- [ ] Constants configured (Next)

### Phase 2: Core Systems (Planned)
- [ ] Player management
- [ ] Team/group management
- [ ] State machine
- Timeline: Aiming for end of month

### Phase 3: Golf Course (Planned)
- [ ] 9-hole layout on Firestorm
- [ ] Area triggers for tees/greens
- [ ] Hazards and obstacles
- Timeline: TBD

---

## Ideas & Future Considerations

### Potential Features (Post v1.0)
1. **Procedural Courses**: Randomized obstacles each match
2. **Course Editor**: Let players design custom holes
3. **Tournaments**: Scheduled events with leaderboards
4. **Skins Game**: Alternative scoring mode
5. **18-Hole Expansion**: Double the content
6. **Additional Maps**: Battery, Limestone, Aftermath courses

### Technical Improvements
1. **Better Physics**: Fine-tune mortar trajectory for realism
2. **Advanced AI**: Smarter caddy behavior
3. **Replay System**: Record and review best shots
4. **Stats Tracking**: More detailed analytics

### Community Features
1. **Leaderboards**: Global and friend-based
2. **Achievements**: Unlock titles and badges
3. **Cosmetics**: Cart skins, caddy customization
4. **Social Hub**: Pro shop as gathering place

---

## Notes for Future Self

### When Starting Phase 2
1. Review the common_checklist.md for player management patterns
2. Look at how Vertigo handles player instances
3. Start with simple JsPlayer extension, add features incrementally
4. Don't forget to test with player disconnect scenarios

### When Implementing Shot Mechanics
1. Study projectile physics in the SDK carefully
2. Start with basic power/angle, add spin later
3. Test distances thoroughly - golf should feel right
4. Consider adding a practice mode/driving range early

### When Building UI
1. Use ParseUI for declarative creation
2. Test on different resolutions
3. Remember to clean up ALL UI on player leave
4. Keep UI minimal during shots (don't block view)

---

## Change Log Summary

### October 17, 2025
- ✨ Initial project setup
- 📝 Created comprehensive documentation suite
- 🏗️ Set up build system
- 🛠️ Expanded helper library to 50+ functions
- 📋 Generated 22-phase granular todo list
- 📖 Created professional README
- 📝 Initialized development memory system

---

## Current Metrics

### Project Stats
- **Total Files**: 15+ documentation and source files
- **Lines of Code**: ~500 (helpers + templates)
- **Todo Items**: 400+ tasks across 22 phases
- **Completion**: ~2% (foundation complete)

### Development Velocity
- **Setup Phase**: 1 day
- **Estimated v0.1**: 2-3 weeks
- **Estimated v1.0**: 2-3 months

---

## Random Thoughts & Ideas

- Consider adding "golf clap" emote for good shots
- What about a "gallery" spectator area with NPCs cheering?
- Could we add weather effects (rain makes fairway faster)?
- Cart girl random encounters could be fun
- Maybe add a "mulligan" item in the shop?
- Consider adding different "ball" types with unique physics
- What about a "practice swing" option before the real shot?

---

**Last Updated**: October 17, 2025, 10:30 PM  
**Next Review**: When starting Phase 2 implementation  
**Status**: Foundation Complete ✅
