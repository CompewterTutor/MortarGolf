# BF6 Portal - Development Guidelines for MortarGolf

## Development Workflow

### Git Repository Setup

**IMPORTANT**: The git repository root is the **MortarGolf folder itself**, not the parent PortalSDKBF6 directory.

When running git commands, always ensure you're in the MortarGolf directory:
```bash
cd /d/PortalSDKBF6/mods/MortarGolf
git status
git add -A
git commit -m "your message"
```

The repository structure:
```
MortarGolf/              # <- GIT ROOT
├── .git/                # Git repository data
├── src/                 # Source code
├── llm/                 # Documentation
├── tools/               # Build and utility scripts
├── package.json
└── README.md
```

### Version Bumping

**Use the automated version bump script instead of manual updates.**

The `tools/bump_version.py` script automatically updates version numbers across all project files:

```bash
# From the MortarGolf directory
python tools/bump_version.py patch   # 0.0.3 -> 0.0.4
python tools/bump_version.py minor   # 0.0.3 -> 0.1.0
python tools/bump_version.py major   # 0.0.3 -> 1.0.0
```

The script updates:
- `package.json` - Version field
- `src/constants.ts` - VERSION constant
- `README.md` - Version badge and footer
- `llm/todo.md` - Version and last updated date
- `CHANGELOG.md` - Adds new version section template

After running the script:
1. Fill in the CHANGELOG.md section with your changes
2. Update llm/memory.md with development progress
3. Review all changes
4. Commit with appropriate message

**Using the SDK's Python**:
The script can be run with the SDK's bundled Python interpreter:
```bash
# Windows
../../python/python.exe tools/bump_version.py patch

# The script is also compatible with any Python 3.x installation
python tools/bump_version.py patch
```

### Core Development Process
This project follows a structured development workflow using several tracking files:

1. **todo.md** - Granular task list organized in clear phases with small, concise subtasks
2. **memory.md** - Project progress tracking, decisions made, and current development state
3. **CHANGELOG.md** - Version history and changes made to the project
4. **dev_guidelines.md** (this file) - Best practices and guidelines for development

### Working with the Todo List
- Break down complex features into small, actionable tasks (1-4 hours each)
- Mark tasks as complete when finished, adding notes about implementation details
- Update memory.md with any important decisions or discoveries during development
- Keep the todo list current - add new tasks as they're discovered

### Project Memory Management
The memory.md file serves as a development journal:
- Track current phase and what you're working on
- Document design decisions and why they were made
- Note any blockers, issues, or questions that arise
- Record lessons learned and things to remember for future tasks
- Keep a running summary of completed work

### Changelog Maintenance
Update CHANGELOG.md whenever you:
- Complete a feature or major task
- Fix a bug
- Make breaking changes
- Release a new version
- Make significant refactoring changes

## Best Practices from Official Mods

### Code Organization
Based on Vertigo, BombSquad, AcePursuit, and Exfil patterns:

#### 1. **File Structure** (when using build system)
```
src/
├── types.ts          # Type definitions and enums
├── constants.ts      # Configuration values and IDs
├── state.ts          # Global state management
├── helpers.ts        # Utility functions
├── ui.ts             # UI classes and widgets
├── player.ts         # Player management
├── messages.ts       # Message system
├── gameflow.ts       # Game flow logic
├── updates.ts        # Update loops
└── events.ts         # Event handlers (entry point)
```

#### 2. **State Management**
- Use enums for game states (Lobby, Countdown, InProgress, Ended)
- Keep global state in state.ts with setter functions
- Initialize all state at game start
- Clean up state on game end

#### 3. **Player Management**
- Extend a JsPlayer class with custom properties
- Track all player instances in a static array
- Clean up player data on leave
- Use player.GetObjId() for comparisons, not direct references

#### 4. **Team Handling**
- Always use `mod.GetObjId(team)` for team comparisons
- Store team IDs as numbers, not Team objects
- Create helper functions like `GetPlayersOnTeam(team: mod.Team)`
- Handle team switches appropriately

### Event Handler Patterns

#### OnGameModeStarted
```typescript
export async function OnGameModeStarted(): Promise<void> {
    console.log("Game Mode Started");
    
    // 1. Initialize state
    gameState = GameState.Lobby;
    
    // 2. Set game configuration
    mod.SetMinimumPlayerCount(minimumPlayers);
    mod.SetCombatStartDelay(combatDelay);
    
    // 3. Initialize game objects (HQs, spawners, etc.)
    InitializeGameObjects();
    
    // 4. Start update loops
    TickUpdate();
    ThrottledUpdate();
    
    // 5. Wait for minimum players
    await WaitForPlayers();
    
    // 6. Start countdown or game
    StartGame();
}
```

#### OnPlayerJoinGame
```typescript
export function OnPlayerJoinGame(player: mod.Player): void {
    // 1. Create player instance
    let jsPlayer = new JsPlayer(player);
    
    // 2. Assign to team (if needed)
    AssignPlayerToTeam(player);
    
    // 3. Initialize player UI
    jsPlayer.CreateUI();
    
    // 4. Send welcome message
    SendWelcomeMessage(player);
    
    // 5. Check if ready to start
    if (gameState === GameState.Lobby) {
        CheckStartConditions();
    }
}
```

#### OnPlayerLeaveGame
```typescript
export function OnPlayerLeaveGame(player: mod.Player): void {
    // 1. Get player instance
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // 2. Clean up UI
    jsPlayer.DestroyUI();
    
    // 3. Remove from player list
    JsPlayer.remove(player);
    
    // 4. Handle game state
    if (gameState === GameState.InProgress) {
        CheckMinimumPlayers();
    }
}
```

#### OnPlayerDied
```typescript
export function OnPlayerDied(
    eventPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventDamageType: mod.DamageType,
    eventAttacker: mod.Player | null
): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    // Track death
    jsPlayer.deaths++;
    
    // Handle attacker kill credit
    if (eventAttacker && eventAttacker !== eventPlayer) {
        let attacker = JsPlayer.get(eventAttacker);
        if (attacker) {
            attacker.kills++;
            UpdateScore(attacker, KILL_POINTS);
        }
    }
    
    // Check win conditions
    CheckVictoryConditions();
}
```

### Update Loop Patterns

#### Fast Updates (60fps)
```typescript
export async function TickUpdate(): Promise<void> {
    while (true) {
        if (gameState === GameState.InProgress) {
            // Fast updates only - movement, position checks, etc.
            CheckPlayerPositions();
            UpdateProgressBars();
        }
        
        await mod.NextTick();
    }
}
```

#### Slow Updates (1s)
```typescript
export async function ThrottledUpdate(): Promise<void> {
    while (true) {
        if (gameState === GameState.InProgress) {
            // Slower checks - timers, victory conditions, etc.
            UpdateTimers();
            CheckVictoryConditions();
            UpdateScoreboard();
        }
        
        await mod.Wait(1);
    }
}
```

### UI Best Practices

#### Creating UI
```typescript
// Use ParseUI for declarative UI creation
let widget = modlib.ParseUI({
    type: 'Container',
    name: 'MainContainer',
    position: [0, 0, 0],
    size: [200, 100, 0],
    anchor: mod.UIAnchor.TopCenter,
    bgColor: [0.2, 0.2, 0.2],
    bgAlpha: 0.9,
    children: [
        {
            type: 'Text',
            name: 'TitleText',
            textLabel: 'Game Title',
            textSize: 30,
            textColor: [1, 1, 1]
        }
    ]
});
```

#### Updating UI
```typescript
// Update text dynamically
mod.SetUIWidgetText(widget, mod.Message("New Text"));

// Show/hide widgets
mod.SetUIWidgetVisibility(widget, true);

// Update colors
mod.SetUIWidgetBackgroundColor(widget, mod.CreateVector(1, 0, 0), 1);
```

#### Cleaning Up UI
```typescript
// Always clean up on player leave
export function OnPlayerLeaveGame(player: mod.Player): void {
    let jsPlayer = JsPlayer.get(player);
    if (jsPlayer && jsPlayer.widgets) {
        jsPlayer.widgets.forEach(widget => {
            mod.DeleteUIWidget(widget);
        });
    }
    JsPlayer.remove(player);
}
```

### Message System

#### Localization Strings File

**IMPORTANT**: All user-facing text strings must be defined in `MortarGolf.strings.json` for localization support.

The strings file should be placed at the root of the mod folder alongside the compiled TypeScript file.

**File Structure** (`MortarGolf.strings.json`):
```json
{
    "_default_language_": "_en_",
    "welcomeMessage": "Welcome to MortarGolf!",
    "holeStarting": "Hole {} - Par {}",
    "greatShot": "Great Shot!",
    "playerScored": "{} scored a {}!",
    "moneyEarned": "You earned ${}",
    "shopOpen": "Shop opening in {} seconds",
    "ace": "ACE!",
    "eagle": "Eagle!",
    "birdie": "Birdie!",
    "par": "Par",
    "bogey": "Bogey",
    "outOfBounds": "Out of Bounds! +1 Stroke Penalty"
}
```

**Best Practices**:
- Use descriptive, clear key names (camelCase or snake_case)
- Include `{}` placeholders for dynamic values (player names, numbers, etc.)
- Group related strings with common prefixes (e.g., `shop_`, `score_`, `ui_`)
- Always include `"_default_language_": "_en_"` at the top
- Add comments in separate documentation, not in JSON

**Usage in Code**:
```typescript
// Simple string
mod.DisplayHighlightedWorldLogMessage(
    mod.Message("welcomeMessage")
);

// String with one parameter
mod.DisplayNotificationMessage(
    mod.Message("moneyEarned", 250),
    player
);

// String with multiple parameters
mod.DisplayHighlightedWorldLogMessage(
    mod.Message("holeStarting", 1, 4)
);

// Player name in string
mod.DisplayNotificationMessage(
    mod.Message("playerScored", mod.GetPlayerName(player), "Birdie"),
    team
);
```

**Helper Function for Messages**:
```typescript
// Create a helper function in helpers.ts
export function MakeMessage(key: string, ...args: any[]): mod.Message {
    switch (args.length) {
        case 0: return mod.Message(key);
        case 1: return mod.Message(key, args[0]);
        case 2: return mod.Message(key, args[0], args[1]);
        case 3: return mod.Message(key, args[0], args[1], args[2]);
        default: return mod.Message(key);
    }
}
```

**File Deployment**:
- Place `MortarGolf.strings.json` in the mod folder root
- Upload alongside the compiled `.ts` file when deploying
- File is automatically loaded by the SDK

#### Using Messages

```typescript
// Create localized messages
function MakeMessage(key: string, ...args: any[]): mod.Message {
    switch (args.length) {
        case 0: return mod.Message(key);
        case 1: return mod.Message(key, args[0]);
        case 2: return mod.Message(key, args[0], args[1]);
        default: return mod.Message(key, args[0], args[1], args[2]);
    }
}

// Display to all players
mod.DisplayHighlightedWorldLogMessage(
    MakeMessage("roundStarted")
);

// Display to specific player
mod.DisplayNotificationMessage(
    MakeMessage("youScored"),
    player
);

// Display to team
let team = mod.GetTeam(player);
mod.DisplayNotificationMessage(
    MakeMessage("teamScored"),
    team
);
```

### Game Object Management

#### Finding Objects by ID
```typescript
// Store IDs as constants
const mainHQID = 1;
const capturePointID = 5;

// Get objects
let hq = mod.GetHQ(mainHQID);
let cp = mod.GetCapturePoint(capturePointID);

// Enable/disable
mod.EnableHQ(hq, true);
mod.EnableCapturePoint(cp, false);
```

#### Working with Spawners
```typescript
// Vehicle spawners
let spawner = mod.GetVehicleSpawner(spawnerID);
mod.SetVehicleSpawnerVehicle(spawner, mod.VehicleList.Quadbike);
mod.SetVehicleSpawnerEnabled(spawner, true);

// Weapon spawners
let weaponSpawner = mod.GetSpawner(spawnerID);
mod.SetSpawnerWeapon(weaponSpawner, mod.WeaponList.M4A1);
```

### Async/Await Patterns

#### Waiting for Conditions
```typescript
async function WaitForMinimumPlayers(): Promise<void> {
    while (JsPlayer.playerInstances.length < minimumPlayers) {
        await mod.Wait(1);
    }
}
```

#### Countdown Timers
```typescript
async function StartCountdown(duration: number): Promise<void> {
    for (let i = duration; i > 0; i--) {
        UpdateCountdownUI(i);
        mod.DisplayHighlightedWorldLogMessage(
            MakeMessage(`Starting in ${i}...`)
        );
        await mod.Wait(1);
    }
}
```

### Common Pitfalls to Avoid

#### ❌ DON'T: Compare teams directly
```typescript
if (mod.GetTeam(player1) === mod.GetTeam(player2)) // Wrong!
```

#### ✅ DO: Compare team IDs
```typescript
if (mod.GetObjId(mod.GetTeam(player1)) === mod.GetObjId(mod.GetTeam(player2)))
```

#### ❌ DON'T: Forget to check if player is valid
```typescript
let jsPlayer = JsPlayer.get(player);
jsPlayer.score++; // Might be undefined!
```

#### ✅ DO: Always validate
```typescript
let jsPlayer = JsPlayer.get(player);
if (!jsPlayer) return;
jsPlayer.score++;
```

#### ❌ DON'T: Forget to clean up UI
```typescript
// UI elements persist even after player leaves
```

#### ✅ DO: Clean up in OnPlayerLeaveGame
```typescript
export function OnPlayerLeaveGame(player: mod.Player): void {
    let jsPlayer = JsPlayer.get(player);
    if (jsPlayer) {
        // Clean up all widgets
        jsPlayer.DestroyUI();
    }
    JsPlayer.remove(player);
}
```

### Performance Considerations

#### Update Frequency
- Use `NextTick()` only for critical updates (60fps)
- Use `Wait(1)` for most game logic (1 second)
- Use longer waits for non-critical checks

#### Object Caching
```typescript
// Cache frequently used objects
const allTeams = [
    mod.GetTeamById(1),
    mod.GetTeamById(2),
    mod.GetTeamById(3),
    mod.GetTeamById(4)
];

// Don't repeatedly call GetTeam() in loops
```

#### Array Operations
```typescript
// Use modlib helpers for array conversions
import { ConvertArray, FilteredArray } from modlib;

let players = ConvertArray(mod.AllPlayers());
let alivePlayers = FilteredArray(
    mod.AllPlayers(),
    (p) => mod.GetSoldierState(p, mod.SoldierStateBool.IsAlive)
);
```

### Testing & Debugging

#### Debug Logging
```typescript
const DEBUG = true; // Set to false before release

function debugLog(message: string, ...args: any[]): void {
    if (DEBUG) {
        console.log(`[MortarGolf] ${message}`, ...args);
    }
}
```

#### Player Count Testing
```typescript
// Test with minimum and maximum players
const MIN_PLAYERS_DEBUG = 1; // For testing
const MIN_PLAYERS_RELEASE = 4; // For production

const minimumPlayers = DEBUG ? MIN_PLAYERS_DEBUG : MIN_PLAYERS_RELEASE;
```

### Version Control

#### Version Numbering
```typescript
const VERSION = [0, 1, 0]; // [major, minor, patch]

// Display on start
console.log(`MortarGolf v${VERSION.join('.')}`);
```

#### Pre-Release Checklist
- [ ] Set DEBUG flags to false
- [ ] Remove test/debug code
- [ ] Update VERSION constant
- [ ] Test with minimum and maximum players
- [ ] Update CHANGELOG.md
- [ ] Test on all supported maps
- [ ] Verify all UI cleans up properly
- [ ] Check console for errors

### Code Style

#### Naming Conventions
```typescript
// Constants: UPPER_SNAKE_CASE
const MAX_PLAYERS = 32;
const KILL_POINTS = 100;

// Variables: camelCase
let gameState = GameState.Lobby;
let playerCount = 0;

// Classes: PascalCase
class JsPlayer { }
class MessageUI { }

// Functions: camelCase
function updateScore() { }
function checkVictoryConditions() { }

// Event Handlers: OnEventName
export function OnPlayerJoinGame() { }
export function OnGameModeStarted() { }
```

#### Comments
```typescript
// Use comments to explain WHY, not WHAT
// Good: Explains reasoning
// We need to wait 1 frame to ensure the player is fully spawned
await mod.NextTick();

// Bad: States the obvious
// Set game state to lobby
gameState = GameState.Lobby;
```

### MortarGolf Specific Guidelines

#### Golf Mechanics
- Track stroke count per player per hole
- Implement shot power/direction mechanics
- Handle "putting" mode when near green
- Track par for each hole

#### Caddy System
- AI or player-controlled caddies
- Revive functionality
- Support/defense mechanics
- Caddy assignment at match start

#### Shop System
- Currency earned based on performance
- Items available between holes
- Random item rotation
- Price balancing

#### Scoring System
- Golf score (strokes)
- Time bonus
- Combat statistics
- Money earned

#### Course Design
- 9-hole initial implementation
- 18-hole stretch goal
- Randomized obstacles
- Multiple paths/strategies

## Resources

### SDK Documentation
- See `DOCS/BF6_SDK.md` for complete API reference
- See `llm/index.d.ts` for type definitions

### Templates & Examples
- `llm/skeleton.ts` - Basic mod structure
- `llm/template.ts` - Extended template
- Official mods in `mods/` folder

### Build System
- See `DOCS/BUILD_SYSTEM.md` for multi-file organization
- Use `npm run watch:mortar` during development
- Build output: `MortarGolf.ts`

---

**Remember**: The goal is readable, maintainable code that other developers can understand and extend. When in doubt, favor clarity over cleverness.
