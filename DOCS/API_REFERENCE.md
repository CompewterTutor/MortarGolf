# MortarGolf API Reference

**Version**: 0.0.8  
**Generated**: October 23, 2025  
**Purpose**: Complete reference for all functions, types, constants, and interfaces in the MortarGolf project

---

## Table of Contents

1. [Types & Interfaces](#types--interfaces)
2. [Constants](#constants)
3. [State Management](#state-management)
4. [Player Management](#player-management)
5. [Course System](#course-system)
6. [Course Objects](#course-objects)
7. [Hazard System](#hazard-system)
8. [Game Flow](#game-flow)
9. [State Machine](#state-machine)
10. [Matchmaking](#matchmaking)
11. [Foursome Management](#foursome-management)
12. [UI System](#ui-system)
13. [Messages](#messages)
14. [Helper Functions](#helper-functions)
15. [Event Handlers](#event-handlers)
16. [Update Loops](#update-loops)

---

## Types & Interfaces

### Core Game Types

```typescript
// Game States
export enum GameState {
    Lobby = "Lobby",
    TeeTime = "TeeTime", 
    Countdown = "Countdown",
    Playing = "Playing",
    Shopping = "Shopping",
    RoundEnd = "RoundEnd",
    GameOver = "GameOver"
}

// Player Roles
export enum PlayerRole {
    Golfer = "Golfer",
    Caddy = "Caddy",
    Spectator = "Spectator"
}

// Hole Phases
export enum HolePhase {
    Teeoff = "Teeoff",
    Fairway = "Fairway", 
    Putting = "Putting",
    Completed = "Completed"
}

// Lie Types
export enum LieType {
    Tee = "Tee",
    Fairway = "Fairway",
    Rough = "Rough",
    Sand = "Sand",
    Water = "Water",
    Green = "Green"
}

// Team Colors
export enum TeamColor {
    Red = "Red",
    Blue = "Blue", 
    Green = "Green",
    Yellow = "Yellow"
}

// Hazard Types
export enum HazardType {
    DESTRUCTIBLE = "DESTRUCTIBLE",
    WATER = "WATER",
    SAND = "SAND",
    ROUGH = "ROUGH",
    SMOKE = "SMOKE",
    FIRE = "FIRE",
    ELECTRIC = "ELECTRIC"
}

// Destructible Types
export enum DestructibleType {
    CRATE = "CRATE",
    BARREL = "BARREL",
    FENCE = "FENCE",
    BARRIER = "BARRIER",
    TANK = "TANK",
    BUILDING = "BUILDING"
}
```

### Core Interfaces

```typescript
// Player Data
export interface PlayerData {
    player: mod.Player;
    role: PlayerRole;
    team: TeamColor;
    foursomeId?: string;
    isReady: boolean;
    joinTime: number;
}

// Golf Player Extension
export interface GolfPlayerData {
    player: mod.Player;
    role: PlayerRole;
    team: TeamColor;
    foursomeId?: string;
    isReady: boolean;
    joinTime: number;
    currentHole: number;
    strokes: number;
    score: number;
    lie: LieType;
    distanceToPin: number;
    isAlive: boolean;
    lastShotTime?: number;
    equipment: PlayerEquipment;
}

// Hole Data
export interface HoleData {
    number: number;
    par: number;
    distance: number;
    teePosition: Vector3;
    greenPosition: Vector3;
    greenRadius: number;
    fairwayWidth: number;
    hazards: HazardData[];
    name: string;
}

// Hazard Data
export interface HazardData {
    type: HazardType;
    position: Vector3;
    radius: number;
    severity: number;
    destructibleType?: DestructibleType;
}

// Destructible Obstacle
export interface DestructibleObstacle {
    id: string;
    type: DestructibleType;
    position: Vector3;
    health: number;
    maxHealth: number;
    explosionRadius: number;
    respawnTime: number;
    lastDamageTime?: number;
    isDestroyed: boolean;
}

// Wind Data
export interface WindData {
    direction: number; // 0-360 degrees
    intensity: number; // 0-100
    variation: number; // 0-100
    lastUpdateTime: number;
}

// Player Equipment
export interface PlayerEquipment {
    mortar: string;
    clubs: string[];
    cart: string;
    caddyEquipment: string[];
}

// Course Object
export interface CourseObject {
    id: string;
    type: string;
    position: Vector3;
    rotation: Vector3;
    enabled: boolean;
    data?: any;
}

// Score Data
export interface ScoreData {
    playerId: string;
    playerName: string;
    hole: number;
    par: number;
    strokes: number;
    score: number; // relative to par
    timestamp: number;
}
```

---

## Constants

### Game Configuration

```typescript
export const VERSION = [0, 0, 8]; // [major, minor, patch]
export const MOD_NAME = "MortarGolf";
export const MAX_PLAYERS = 32;
export const TEAM_SIZE = 4;
export const TOTAL_HOLES = 9;

// Timing Constants
export const tickRate = 0.016; // ~60fps
export const slowTickRate = 1.0; // 1 second
export const LOBBY_COUNTDOWN_SECONDS = 10;
export const TEE_TIME_COUNTDOWN_SECONDS = 30;
export const COMBAT_COUNTDOWN_SECONDS = 5;
export const SHOP_DURATION_SECONDS = 30;
export const ROUND_END_DISPLAY_SECONDS = 10;
export const GAME_OVER_DELAY = 20;

// Course Configuration
export const HOLE_ID_RANGE = {
    START: 1000,
    END: 1999
};

export const COURSE_OBJECT_IDS = {
    TEE_TRIGGER_START: 1000,
    TEE_TRIGGER_END: 1009,
    GREEN_TRIGGER_START: 1010,
    GREEN_TRIGGER_END: 1019,
    FAIRWAY_TRIGGER_START: 1020,
    FAIRWAY_TRIGGER_END: 1029,
    ROUGH_TRIGGER_START: 1030,
    ROUGH_TRIGGER_END: 1039,
    OOB_TRIGGER_START: 1040,
    OOB_TRIGGER_END: 1049,
    HAZARD_TRIGGER_START: 1050,
    HAZARD_TRIGGER_END: 1059,
    PIN_MARKER_START: 1060,
    PIN_MARKER_END: 1069,
    DISTANCE_MARKER_START: 1070,
    DISTANCE_MARKER_END: 1079,
    VISUAL_ELEMENT_START: 1080,
    VISUAL_ELEMENT_END: 1099
};

// Destructible Properties
export const DESTRUCTIBLE_PROPERTIES = {
    [DestructibleType.CRATE]: {
        health: 50,
        explosionRadius: 5,
        respawnTime: 30,
        damage: 25
    },
    [DestructibleType.BARREL]: {
        health: 75,
        explosionRadius: 8,
        respawnTime: 45,
        damage: 50
    },
    [DestructibleType.FENCE]: {
        health: 100,
        explosionRadius: 3,
        respawnTime: 60,
        damage: 10
    },
    [DestructibleType.BARRIER]: {
        health: 150,
        explosionRadius: 6,
        respawnTime: 90,
        damage: 30
    },
    [DestructibleType.TANK]: {
        health: 300,
        explosionRadius: 15,
        respawnTime: 180,
        damage: 100
    },
    [DestructibleType.BUILDING]: {
        health: 500,
        explosionRadius: 20,
        respawnTime: 300,
        damage: 150
    }
};

// Hazard Penalties
export const HAZARD_PENALTIES = {
    [HazardType.WATER]: 1,
    [HazardType.SAND]: 0.5,
    [HazardType.ROUGH]: 0.3,
    [HazardType.SMOKE]: 0.2,
    [HazardType.FIRE]: 0.4,
    [HazardType.ELECTRIC]: 0.6
};

// Wind Configuration
export const WIND_CONFIG = {
    MIN_DIRECTION: 0,
    MAX_DIRECTION: 360,
    MIN_INTENSITY: 0,
    MAX_INTENSITY: 100,
    UPDATE_INTERVAL: 5000, // 5 seconds
    VARIATION_CHANCE: 0.3
};

// Team Colors
export const TEAM_COLORS = {
    [TeamColor.Red]: [1.0, 0.2, 0.2],
    [TeamColor.Blue]: [0.2, 0.4, 1.0],
    [TeamColor.Green]: [0.2, 0.8, 0.2],
    [TeamColor.Yellow]: [1.0, 0.9, 0.2]
};

// Course Data (9 holes)
export const COURSE_HOLES: HoleData[] = [
    {
        number: 1,
        par: 4,
        distance: 180,
        teePosition: { x: 0, y: 0, z: 0 },
        greenPosition: { x: 180, y: 0, z: 0 },
        greenRadius: 15,
        fairwayWidth: 40,
        hazards: [],
        name: "The Opening Drive"
    },
    // ... (8 more holes)
];
```

---

## State Management

### Global State Functions

```typescript
// Game State
export function getGameState(): GameState;
export function setGameState(state: GameState): void;
export function isGameOver(): boolean;
export function setGameOver(over: boolean): void;

// Hole Management
export function getCurrentHoleNumber(): number;
export function setCurrentHoleNumber(hole: number): void;
export function getCurrentHole(): HoleData | null;

// Player Management
export function getAllPlayers(): PlayerData[];
export function getPlayerById(playerId: string): PlayerData | null;
export function addPlayer(playerData: PlayerData): void;
export function removePlayer(playerId: string): void;
export function updatePlayer(playerId: string, updates: Partial<PlayerData>): void;

// Combat State
export function getCombatStarted(): boolean;
export function setCombatStarted(started: boolean): void;

// Timer Management
export function getStateTimer(): number;
export function setStateTimer(seconds: number): void;
export function decrementStateTimer(): void;
export function isStateTimerExpired(): boolean;
```

---

## Player Management

### GolfPlayer Class

```typescript
export class GolfPlayer {
    // Static Methods
    static create(player: mod.Player, role: PlayerRole): GolfPlayer;
    static get(player: mod.Player): GolfPlayer | null;
    static getAll(): GolfPlayer[];
    static getAllGolfers(): GolfPlayer[];
    static getAllCaddies(): GolfPlayer[];
    static remove(player: mod.Player): boolean;
    static clear(): void;

    // Constructor
    constructor(player: mod.Player, role: PlayerRole);

    // Properties
    player: mod.Player;
    role: PlayerRole;
    team: TeamColor;
    foursomeId?: string;
    isReady: boolean;
    joinTime: number;
    currentHole: number;
    strokes: number;
    score: number;
    lie: LieType;
    distanceToPin: number;
    isAlive: boolean;
    lastShotTime?: number;
    equipment: PlayerEquipment;

    // Methods
    setRole(role: PlayerRole): void;
    setTeam(team: TeamColor): void;
    setFoursome(foursomeId: string): void;
    setReady(ready: boolean): void;
    addStroke(): void;
    setScore(score: number): void;
    setLie(lie: LieType): void;
    setDistanceToPin(distance: number): void;
    setAlive(alive: boolean): void;
    updateLastShotTime(): void;
    isValid(): boolean;
    toJSON(): any;
}
```

---

## Course System

### Course Management Functions

```typescript
// Initialization
export function initializeCourse(): void;

// Hole Data Access
export function getCourseHole(holeNumber: number): HoleData | null;
export function getCurrentHole(): HoleData | null;
export function getAllHoles(): HoleData[];
export function getFirstHole(): HoleData;
export function getLastHole(): HoleData;

// Hole Navigation
export function getNextHoleNumber(currentHole: number): number;
export function getPreviousHoleNumber(currentHole: number): number;
export function validateHoleNumber(holeNumber: number): boolean;
export function isFirstHole(holeNumber: number): boolean;
export function isLastHole(holeNumber: number): boolean;
export function isCourseComplete(currentHole: number): boolean;

// Course Statistics
export function getTotalParForRange(startHole: number, endHole: number): number;
export function getTotalDistanceForRange(startHole: number, endHole: number): number;
export function getCourseDifficulty(): number;
export function getHolesByPar(par: number): HoleData[];

// Formatting Helpers
export function formatHoleName(hole: HoleData): string;
export function formatHoleInfo(hole: HoleData): string;
export function getCourseProgress(currentHole: number): number;
export function getHolesRemaining(currentHole: number): number;
```

---

## Course Objects

### Course Object Management

```typescript
// Area Trigger Management
export function getAreaTrigger(holeNumber: number, triggerType: string): mod.AreaTrigger | null;
export function setAreaTriggerEnabled(holeNumber: number, triggerType: string, enabled: boolean): void;

// Pin Marker Management
export function getPinMarker(holeNumber: number): mod.WorldObject | null;
export function setPinMarkerVisible(holeNumber: number, visible: boolean): void;

// Distance Marker Management
export function generateDistanceMarkers(holeNumber: number, holeData: HoleData): void;
export function clearDistanceMarkers(holeNumber: number): void;

// Hazard Object Management
export function spawnHazardObjects(holeNumber: number, hazards: HazardData[]): void;
export function clearHazardObjects(holeNumber: number): void;

// Visual Element Management
export function spawnVisualElements(holeNumber: number): void;
export function clearVisualElements(holeNumber: number): void;

// Course Initialization
export function initializeCourseObjects(holeNumber: number): void;
export function cleanupCourseObjects(holeNumber: number): void;
export function validateCourseObjects(): boolean;
```

---

## Hazard System

### Hazard Management Functions

```typescript
// System Lifecycle
export function initializeHazardSystem(holeNumber: number): void;
export function updateHazardSystem(holeNumber: number): void;
export function cleanupHazardSystem(): void;

// Wind System
export function initializeWind(): WindData;
export function updateWind(): void;
export function calculateWindEffect(position: Vector3): Vector3;

// Obstacle Randomization
export function randomizeHoleHazards(holeNumber: number): void;
export function generateRandomPosition(center: Vector3, radius: number): Vector3;

// Hazard Penalties
export function calculateHazardPenalty(hazardType: HazardType, severity: number): number;
export function getHazardDifficultyMultiplier(hazardType: HazardType): number;

// Destructible Management
export function spawnDestructibleObstacles(holeNumber: number): void;
export function damageDestructible(obstacleId: string, damage: number): boolean;
export function updateDestructibles(): void;
export function respawnDestructible(obstacleId: string): void;

// Hazard Queries
export function getHazardsInArea(position: Vector3, radius: number): HazardData[];
export function getDestructiblesInArea(position: Vector3, radius: number): DestructibleObstacle[];
export function isPositionInHazard(position: Vector3, hazardType: HazardType): boolean;
```

---

## Game Flow

### Game Flow Functions

```typescript
// Round Management
export function startRound(): void;
export function endRound(): void;
export function nextHole(): void;
export function restartHole(): void;

// Victory Conditions
export function CheckVictoryConditions(): void;
export function determineWinner(): GolfPlayer | null;
export function calculateFinalScores(): ScoreData[];

// Shop System
export function openShop(): void;
export function closeShop(): void;
export function isShopOpen(): boolean;

// Scoring
export function calculateStrokeScore(strokes: number, par: number): number;
export function formatScore(score: number): string;
export function getScoreName(score: number): string;
```

---

## State Machine

### State Machine Functions

```typescript
// State Transitions
export function transitionTo(newState: GameState): boolean;
export function startTeeTime(): void;
export function startCountdown(): void;
export function startPlaying(): void;
export function openShop(): void;
export function endHole(): void;
export function endRound(): void;
export function nextHole(): void;
export function returnToLobby(): void;

// State Queries
export function isInLobby(): boolean;
export function isPlaying(): boolean;
export function isShopOpen(): boolean;
export function isGamePaused(): boolean;

// Timer Management
export function setStateTimer(seconds: number): void;
export function decrementStateTimer(): void;
export function isStateTimerExpired(): void;
export function getStateTimer(): number;

// Pause/Resume
export function pauseGame(): void;
export function resumeGame(): void;
```

---

## Matchmaking

### MatchmakingQueue Class

```typescript
export class MatchmakingQueue {
    // Static Methods
    static getInstance(): MatchmakingQueue;

    // Queue Management
    addPlayer(player: mod.Player, preferredRole?: PlayerRole): void;
    removePlayer(player: mod.Player): boolean;
    clearQueue(): void;
    getQueueSize(): number;
    getPlayers(): mod.Player[];

    // Queue Processing
    processQueue(): void;
    tryFormCompleteGroups(): void;
    handleLongWaitPlayers(): void;
    autoAssignSoloPlayers(): void;
    formImmediateFoursome(players: mod.Player[]): Foursome | null;

    // Player Information
    getPlayerWaitTime(player: mod.Player): number;
    getPlayerPosition(player: mod.Player): number;
    getPlayerRolePreference(player: mod.Player): PlayerRole | null;

    // Statistics
    getAverageWaitTime(): number;
    getRoleCounts(): { golfers: number; caddies: number };
}
```

---

## Foursome Management

### Foursome Class

```typescript
export class Foursome {
    // Static Methods
    static createFoursome(): Foursome;
    static findAvailableFoursome(): Foursome | null;
    static getFoursomeByPlayer(player: mod.Player): Foursome | null;
    static getFoursomesByHole(holeNumber: number): Foursome[];
    static getActiveFoursomes(): Foursome[];
    static clearAll(): void;

    // Constructor
    constructor(id: string, color: TeamColor);

    // Properties
    id: string;
    color: TeamColor;
    players: GolfPlayer[];
    currentHole: number;
    startTime: number;

    // Player Management
    addGolfer(player: mod.Player): boolean;
    addCaddy(player: mod.Player): boolean;
    removePlayer(player: mod.Player): boolean;
    getTotalPlayers(): number;
    getGolfers(): GolfPlayer[];
    getCaddies(): GolfPlayer[];

    // Group State
    isFull(): boolean;
    hasRoom(): boolean;
    areAllPlayersComplete(): boolean;
    getAverageScore(): number;

    // Hole Progression
    startHole(holeNumber: number): void;
    completeHole(): void;
    hasCompletedAllHoles(): boolean;

    // Player Pairing
    pairPlayersWithCaddies(): void;
    assignTeam(): void;

    // Utility
    toJSON(): any;
}
```

---

## UI System

### UI Management Functions

```typescript
// UI Creation
export function createPlayerUI(player: mod.Player): void;
export function createScoreboard(player: mod.Player): void;
export function createShotMeter(player: mod.Player): void;
export function createTimerDisplay(player: mod.Player): void;

// UI Updates
export function updatePlayerUI(player: mod.Player): void;
export function updateScoreboard(): void;
export function updateShotMeter(player: mod.Player, power: number): void;
export function updateTimerDisplay(time: number): void;

// UI Cleanup
export function hideAllMessageUI(): void;
export function cleanupPlayerUI(player: mod.Player): void;
export function cleanupAllUI(): void;

// Message Display
export function showMessageToPlayer(player: mod.Player, message: string, duration?: number): void;
export function showMessageToAll(message: string, duration?: number): void;
export function showHighlightedMessage(message: string): void;
```

---

## Messages

### Message Functions

```typescript
// Message Updates
export function UpdateMessages(): void;
export function addMessage(message: string, duration?: number): void;
export function clearMessages(): void;

// Localization Helpers
export function getMessage(key: string, ...args: any[]): string;
export function formatMessage(template: string, ...args: any[]): string;

// Common Messages
export function showWelcomeMessage(player: mod.Player): void;
export function showHoleStartMessage(holeNumber: number): void;
export function showScoreUpdate(player: mod.Player, strokes: number, score: number): void;
export function showHazardWarning(player: mod.Player, hazardType: HazardType): void;
```

---

## Helper Functions

### Math Utilities

```typescript
export function Clamp(value: number, min: number, max: number): number;
export function Lerp(a: number, b: number, t: number): number;
export function GetAngleBetween(from: Vector3, to: Vector3): number;
export function NormalizeAngle(angle: number): number;
export function Distance(a: Vector3, b: Vector3): number;
export function RandomRange(min: number, max: number): number;
export function RandomPointInCircle(center: Vector3, radius: number): Vector3;
```

### Array Utilities

```typescript
export function Shuffle<T>(array: T[]): T[];
export function WeightedRandom<T>(items: T[], weights: number[]): T;
export function UniqueArray<T>(array: T[]): T[];
export function RemoveItem<T>(array: T[], item: T): boolean;
export function FindItem<T>(array: T[], predicate: (item: T) => boolean): T | null;
```

### Team Utilities

```typescript
export function GetPlayersOnTeam(team: TeamColor): mod.Player[];
export function CountAlivePlayersOnTeam(team: TeamColor): number;
export function AreTeammates(player1: mod.Player, player2: mod.Player): boolean;
export function GetTeamColor(team: TeamColor): [number, number, number];
export function GetTeamName(team: TeamColor): string;
```

### Player Utilities

```typescript
export function AreAllPlayersValid(players: mod.Player[]): boolean;
export function RemoveInvalidPlayers(players: mod.Player[]): mod.Player[];
export function GetPlayerName(player: mod.Player): string;
export function GetPlayerId(player: mod.Player): string;
export function IsPlayerAlive(player: mod.Player): boolean;
```

### Time Utilities

```typescript
export function FormatTime(seconds: number): string;
export function FormatHoleTime(seconds: number): string;
export function GetFoursomeHoleTime(foursomeId: string): number;
export function CountdownTimer(duration: number, onTick?: (remaining: number) => void, onComplete?: () => void): void;
export function WaitForCondition(condition: () => boolean, timeout?: number): Promise<boolean>;
export function DelayedExecute(delay: number, callback: () => void): void;
```

### Scoring Utilities

```typescript
export function FormatScore(score: number): string;
export function GetScoreName(score: number): string;
export function SortPlayersByScore(players: GolfPlayer[]): GolfPlayer[];
export function CalculateHandicap(scores: number[]): number;
```

### Formatting Utilities

```typescript
export function FormatNumber(num: number, decimals?: number): string;
export function RoundTo(num: number, decimals: number): number;
export function PadNumber(num: number, digits: number): string;
export function FormatCurrency(amount: number): string;
```

---

## Event Handlers

### Game Mode Events

```typescript
export function OnGameModeStarted(): void;
export function OnGameModeEnding(): void;
export function OngoingGlobal(): void;
```

### Player Events

```typescript
export async function OnPlayerJoinGame(player: mod.Player): Promise<void>;
export function OnPlayerLeaveGame(player: mod.Player): void;
export function OnPlayerDeployed(eventPlayer: mod.Player): void;
export function OnPlayerUndeploy(eventPlayer: mod.Player): void;
export function OnPlayerDeath(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void;
export function OnPlayerRevived(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void;
```

### Team Events

```typescript
export function OnPlayerTeamChange(
    player: mod.Player,
    oldTeam: mod.TeamId,
    newTeam: mod.TeamId,
    isImmediate: boolean
): void;
```

### Vehicle Events

```typescript
export function OnVehicleDestroyed(
    eventVehicle: mod.Vehicle,
    eventInstigator: mod.Player
): void;
```

### Area Trigger Events

```typescript
export function OnPlayerEnterAreaTrigger(
    player: mod.Player,
    areaTrigger: mod.AreaTrigger
): void;
export function OnPlayerExitAreaTrigger(
    player: mod.Player,
    areaTrigger: mod.AreaTrigger
): void;
```

---

## Update Loops

### Main Update Functions

```typescript
export async function TickUpdate(): Promise<void>;
export async function ThrottledUpdate(): Promise<void>;
```

### State-Specific Updates

```typescript
// Lobby Updates
function updateLobbyTick(): void;
function updateLobbyThrottled(): void;

// Tee Time Updates
function updateTeeTimeTick(): void;
function updateTeeTimeThrottled(): void;

// Countdown Updates
function updateCountdownTick(): void;
function updateCountdownThrottled(): void;

// Playing Updates
function updatePlayingTick(): void;
function updatePlayingThrottled(): void;

// Shopping Updates
function updateShoppingTick(): void;
function updateShoppingThrottled(): void;

// Round End Updates
function updateRoundEndTick(): void;
function updateRoundEndThrottled(): void;

// Game Over Updates
function updateGameOverTick(): void;
function updateGameOverThrottled(): void;
```

### Helper Functions

```typescript
function checkAllPlayersComplete(): void;
function updatePlayerUI(golfPlayer: GolfPlayer): void;
```

---

## Build System

### Build Configuration

```json
{
    "name": "MortarGolf",
    "version": "0.0.8",
    "description": "Golf with Mortars - BF6 Portal Game Mode",
    "files": [
        "src/types.ts",
        "src/constants.ts",
        "src/state.ts",
        "src/statemachine.ts",
        "src/course.ts",
        "src/courseobjects.ts",
        "src/hazards.ts",
        "src/helpers.ts",
        "src/ui.ts",
        "src/player.ts",
        "src/foursome.ts",
        "src/matchmaking.ts",
        "src/messages.ts",
        "src/gameflow.ts",
        "src/updates.ts",
        "src/events.ts"
    ],
    "output": "MortarGolf.ts",
    "namespace": "MortarGolf"
}
```

### Build Commands

```bash
# Build the mod
node tools/build-mod.js build.config.json

# Watch for changes
node tools/watch-mod.js build.config.json

# Build all mods
node tools/build-all-mods.js

# Clean builds
node tools/clean-builds.js

# Bump version
python tools/bump_version.py patch|minor|major
```

---

## Development Guidelines

### File Organization

```
src/
├── types.ts           # Type definitions and interfaces
├── constants.ts       # Configuration constants
├── state.ts          # Global state management
├── statemachine.ts   # Game state machine
├── course.ts         # Course data and management
├── courseobjects.ts  # Course object system
├── hazards.ts        # Hazard system
├── helpers.ts        # Utility functions
├── ui.ts             # UI management
├── player.ts         # Player management
├── foursome.ts       # Foursome management
├── matchmaking.ts    # Matchmaking system
├── messages.ts       # Message system
├── gameflow.ts       # Game flow logic
├── updates.ts        # Update loops
└── events.ts         # Event handlers
```

### Coding Standards

1. **TypeScript**: Use strict typing for all functions and variables
2. **Naming**: Use PascalCase for classes, camelCase for functions and variables
3. **Documentation**: Add JSDoc comments for all public functions
4. **Error Handling**: Always validate inputs and handle edge cases
5. **Performance**: Use object pooling for frequently created/destroyed objects
6. **Localization**: All user-facing text must use `mod.Message()` with strings file

### Best Practices

1. **State Management**: Use state machine for all game state transitions
2. **Player Data**: Use GolfPlayer class for all player-related operations
3. **Memory Management**: Clean up objects and event listeners properly
4. **Update Loops**: Keep fast updates (60fps) minimal, put heavy logic in throttled updates
5. **Testing**: Test with different player counts and scenarios
6. **Version Control**: Commit frequently with descriptive messages

---

**Generated**: October 23, 2025  
**Version**: 0.0.8  
**Total Functions**: 200+  
**Total Types**: 30+  
**Total Constants**: 100+  

This reference document will be updated as the project evolves. For the most current information, always check the source files directly.