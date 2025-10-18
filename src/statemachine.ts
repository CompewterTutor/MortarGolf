/**
 * State Machine
 * 
 * Manages game state transitions and validation for MortarGolf.
 * Ensures proper flow: Lobby -> TeeTime -> Countdown -> Playing -> Shopping -> RoundEnd -> GameOver
 */

import { GameState } from './types';
import * as state from './state';
import { 
    LOBBY_COUNTDOWN_SECONDS, 
    TEE_TIME_COUNTDOWN_SECONDS,
    COMBAT_COUNTDOWN_SECONDS,
    SHOP_DURATION,
    ROUND_END_DISPLAY_SECONDS,
    totalHoles
} from './constants';

/**
 * Valid state transitions map
 * Each state can only transition to specific next states
 */
const VALID_TRANSITIONS: Map<GameState, GameState[]> = new Map([
    [GameState.Lobby, [GameState.TeeTime]],
    [GameState.TeeTime, [GameState.Countdown]],
    [GameState.Countdown, [GameState.Playing]],
    [GameState.Playing, [GameState.Shopping, GameState.RoundEnd]],
    [GameState.Shopping, [GameState.TeeTime]],
    [GameState.RoundEnd, [GameState.GameOver, GameState.TeeTime]],
    [GameState.GameOver, [GameState.Lobby]]
]);

/**
 * State entry callbacks - called when entering a state
 */
const STATE_ENTRY_CALLBACKS: Map<GameState, () => void> = new Map();

/**
 * State exit callbacks - called when leaving a state
 */
const STATE_EXIT_CALLBACKS: Map<GameState, () => void> = new Map();

/**
 * Current state timers
 */
let currentStateTimer: number = 0;
let stateStartTime: number = 0;

/**
 * Check if a state transition is valid
 */
export function isValidTransition(from: GameState, to: GameState): boolean {
    const validNext = VALID_TRANSITIONS.get(from);
    if (!validNext) return false;
    return validNext.includes(to);
}

/**
 * Transition to a new game state with validation
 * @param newState The state to transition to
 * @param force Skip validation (use with caution)
 * @returns true if transition was successful
 */
export function transitionTo(newState: GameState, force: boolean = false): boolean {
    const currentState = state.gameState;
    
    // Check if transition is valid
    if (!force && !isValidTransition(currentState, newState)) {
        console.error(`[StateMachine] Invalid transition from ${GameState[currentState]} to ${GameState[newState]}`);
        return false;
    }
    
    console.log(`[StateMachine] Transitioning from ${GameState[currentState]} to ${GameState[newState]}`);
    
    // Call exit callback for current state
    const exitCallback = STATE_EXIT_CALLBACKS.get(currentState);
    if (exitCallback) {
        exitCallback();
    }
    
    // Update state
    state.setGameState(newState);
    stateStartTime = Date.now();
    currentStateTimer = 0;
    
    // Call entry callback for new state
    const entryCallback = STATE_ENTRY_CALLBACKS.get(newState);
    if (entryCallback) {
        entryCallback();
    }
    
    return true;
}

/**
 * Register a callback to be called when entering a specific state
 */
export function onStateEnter(gameState: GameState, callback: () => void): void {
    STATE_ENTRY_CALLBACKS.set(gameState, callback);
}

/**
 * Register a callback to be called when exiting a specific state
 */
export function onStateExit(gameState: GameState, callback: () => void): void {
    STATE_EXIT_CALLBACKS.set(gameState, callback);
}

/**
 * Get time elapsed in current state (seconds)
 */
export function getStateElapsedTime(): number {
    return Math.floor((Date.now() - stateStartTime) / 1000);
}

/**
 * Get current state timer value
 */
export function getStateTimer(): number {
    return currentStateTimer;
}

/**
 * Set state timer (for countdowns)
 */
export function setStateTimer(seconds: number): void {
    currentStateTimer = seconds;
}

/**
 * Decrement state timer
 */
export function decrementStateTimer(): void {
    if (currentStateTimer > 0) {
        currentStateTimer--;
    }
}

/**
 * Check if state timer has expired
 */
export function isStateTimerExpired(): boolean {
    return currentStateTimer <= 0;
}

///////////////////////////////////////////////////////////////////////////////
// STATE TRANSITION FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Start tee time phase - move players to tee box
 */
export function startTeeTime(): boolean {
    if (!transitionTo(GameState.TeeTime)) return false;
    
    setStateTimer(TEE_TIME_COUNTDOWN_SECONDS);
    
    // Announce tee time starting
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("holeStarting", state.currentHoleNumber, 4) // TODO: Get actual par
    );
    
    return true;
}

/**
 * Start countdown phase before playing
 */
export function startCountdown(): boolean {
    if (!transitionTo(GameState.Countdown)) return false;
    
    setStateTimer(COMBAT_COUNTDOWN_SECONDS);
    
    return true;
}

/**
 * Start playing phase - enable combat and shots
 */
export function startPlaying(): boolean {
    if (!transitionTo(GameState.Playing)) return false;
    
    state.setHoleStartTime(Date.now());
    state.setCombatStarted(true);
    
    // Clear any countdown flags
    state.setCombatCountdownStarted(false);
    
    // Enable all game mechanics
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("yourTurn")
    );
    
    return true;
}

/**
 * Open shop phase between holes
 */
export function openShop(): boolean {
    if (!transitionTo(GameState.Shopping)) return false;
    
    setStateTimer(SHOP_DURATION);
    
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("shopOpen")
    );
    
    return true;
}

/**
 * End current hole and show scores
 */
export function endHole(): boolean {
    // Determine if this was the final hole
    const isFinalHole = state.currentHoleNumber >= totalHoles;
    
    if (isFinalHole) {
        return endRound();
    }
    
    if (!transitionTo(GameState.RoundEnd)) return false;
    
    setStateTimer(ROUND_END_DISPLAY_SECONDS);
    
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("holeComplete", state.currentHoleNumber)
    );
    
    return true;
}

/**
 * End the entire round and show final scores
 */
export function endRound(): boolean {
    if (!transitionTo(GameState.GameOver)) return false;
    
    state.setGameOver(true);
    
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("roundComplete")
    );
    
    // TODO: Calculate winner, show podium, generate passcode
    
    return true;
}

/**
 * Move to next hole (from RoundEnd or Shopping)
 */
export function nextHole(): boolean {
    state.incrementCurrentHoleNumber();
    
    if (state.currentHoleNumber > totalHoles) {
        return endRound();
    }
    
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("nextHole", state.currentHoleNumber)
    );
    
    return startTeeTime();
}

/**
 * Return to lobby (after game over)
 */
export function returnToLobby(): boolean {
    if (!transitionTo(GameState.Lobby, true)) return false; // Force transition
    
    // Reset all game state
    state.setGameOver(false);
    state.setCurrentHoleNumber(1);
    state.setCombatStarted(false);
    state.setCombatCountdownStarted(false);
    state.clearPlayerArrays();
    state.clearAllFoursomes();
    
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("welcomeMessage")
    );
    
    return true;
}

///////////////////////////////////////////////////////////////////////////////
// PAUSE/RESUME FUNCTIONALITY
///////////////////////////////////////////////////////////////////////////////

let isPaused: boolean = false;
let pausedState: GameState | null = null;
let pausedTimer: number = 0;

/**
 * Pause the current game state
 */
export function pauseGame(): void {
    if (isPaused) return;
    
    isPaused = true;
    pausedState = state.gameState;
    pausedTimer = currentStateTimer;
    
    console.log(`[StateMachine] Game paused in state ${GameState[pausedState]}`);
}

/**
 * Resume the game from pause
 */
export function resumeGame(): void {
    if (!isPaused || !pausedState) return;
    
    isPaused = false;
    currentStateTimer = pausedTimer;
    
    console.log(`[StateMachine] Game resumed in state ${GameState[pausedState]}`);
    
    pausedState = null;
    pausedTimer = 0;
}

/**
 * Check if game is currently paused
 */
export function isGamePaused(): boolean {
    return isPaused;
}

///////////////////////////////////////////////////////////////////////////////
// STATE QUERY FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Check if we're in lobby
 */
export function isInLobby(): boolean {
    return state.gameState === GameState.Lobby;
}

/**
 * Check if we're in tee time
 */
export function isInTeeTime(): boolean {
    return state.gameState === GameState.TeeTime;
}

/**
 * Check if we're in countdown
 */
export function isInCountdown(): boolean {
    return state.gameState === GameState.Countdown;
}

/**
 * Check if we're playing
 */
export function isPlaying(): boolean {
    return state.gameState === GameState.Playing;
}

/**
 * Check if shop is open
 */
export function isShopOpen(): boolean {
    return state.gameState === GameState.Shopping;
}

/**
 * Check if we're at round end
 */
export function isRoundEnd(): boolean {
    return state.gameState === GameState.RoundEnd;
}

/**
 * Check if game is over
 */
export function isGameOver(): boolean {
    return state.gameState === GameState.GameOver;
}

/**
 * Check if combat is active (Playing or Shopping states)
 */
export function isCombatActive(): boolean {
    return isPlaying() || isShopOpen();
}

/**
 * Check if shots can be taken
 */
export function canTakeShots(): boolean {
    return isPlaying();
}

/**
 * Get human-readable state name
 */
export function getStateName(): string {
    return GameState[state.gameState];
}

///////////////////////////////////////////////////////////////////////////////
// INITIALIZATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize the state machine
 * Call this in OnGameModeStarted
 */
export function initializeStateMachine(): void {
    console.log("[StateMachine] Initializing state machine...");
    
    // Set initial state
    state.setGameState(GameState.Lobby);
    stateStartTime = Date.now();
    currentStateTimer = LOBBY_COUNTDOWN_SECONDS;
    
    // Register default state callbacks
    registerDefaultCallbacks();
    
    console.log("[StateMachine] State machine initialized");
}

/**
 * Register default state entry/exit callbacks
 */
function registerDefaultCallbacks(): void {
    // Lobby entry
    onStateEnter(GameState.Lobby, () => {
        console.log("[StateMachine] Entered Lobby");
        setStateTimer(LOBBY_COUNTDOWN_SECONDS);
    });
    
    // TeeTime entry
    onStateEnter(GameState.TeeTime, () => {
        console.log("[StateMachine] Entered TeeTime");
    });
    
    // Countdown entry
    onStateEnter(GameState.Countdown, () => {
        console.log("[StateMachine] Entered Countdown");
        state.setCombatCountdownStarted(true);
    });
    
    // Playing entry
    onStateEnter(GameState.Playing, () => {
        console.log("[StateMachine] Entered Playing");
    });
    
    // Shopping entry
    onStateEnter(GameState.Shopping, () => {
        console.log("[StateMachine] Entered Shopping");
    });
    
    // RoundEnd entry
    onStateEnter(GameState.RoundEnd, () => {
        console.log("[StateMachine] Entered RoundEnd");
    });
    
    // GameOver entry
    onStateEnter(GameState.GameOver, () => {
        console.log("[StateMachine] Entered GameOver");
    });
}
