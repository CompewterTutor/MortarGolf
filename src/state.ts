/**
 * Global State Variables
 * 
 * Game state that needs to be accessible across the entire mod.
 */

import { GameState } from './types';

export let gameState: GameState = GameState.Lobby;
export let gameOver: boolean = false;

export let initialPlayerCount: number = 0;
export let combatCountdownStarted: boolean = false;
export let combatStartDelayRemaining: number = 30; // Will be set from constants
export let combatStarted: boolean = false;

export let messageTime: number = 0;

// Team scores (if needed)
export let team1Score: number = 0;
export let team2Score: number = 0;

/**
 * Update functions for state (to allow modification from other modules)
 */
export function setGameState(state: GameState) {
    gameState = state;
}

export function setGameOver(value: boolean) {
    gameOver = value;
}

export function incrementInitialPlayerCount() {
    initialPlayerCount++;
}

export function decrementInitialPlayerCount() {
    initialPlayerCount--;
}

export function setCombatCountdownStarted(value: boolean) {
    combatCountdownStarted = value;
}

export function setCombatStarted(value: boolean) {
    combatStarted = value;
}

export function decrementCombatStartDelayRemaining() {
    combatStartDelayRemaining--;
}

export function setMessageTime(value: number) {
    messageTime = value;
}

export function decrementMessageTime() {
    messageTime--;
}
