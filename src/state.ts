/**
 * Global State Variables
 * 
 * Game state that needs to be accessible across the entire mod.
 */

import { GameState } from './types';
import { GolfPlayer } from './player';

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

// Golf-specific state
export let currentHoleNumber: number = 1;
export let roundStartTime: number = 0;
export let holeStartTime: number = 0;

// Player tracking arrays
export let golfers: mod.Player[] = [];
export let caddies: mod.Player[] = [];
export let spectators: mod.Player[] = [];

// Foursome tracking (groups of up to 4 players)
export interface Foursome {
    id: number;
    golfers: mod.Player[];
    caddies: mod.Player[];
    currentHole: number;
    holeStartTime: number;
}

export let foursomes: Foursome[] = [];

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

// Golf-specific state setters

export function setCurrentHoleNumber(hole: number) {
    currentHoleNumber = hole;
}

export function incrementCurrentHoleNumber() {
    currentHoleNumber++;
}

export function setRoundStartTime(time: number) {
    roundStartTime = time;
}

export function setHoleStartTime(time: number) {
    holeStartTime = time;
}

export function addGolfer(player: mod.Player) {
    if (!golfers.includes(player)) {
        golfers.push(player);
    }
}

export function removeGolfer(player: mod.Player) {
    const index = golfers.indexOf(player);
    if (index > -1) {
        golfers.splice(index, 1);
    }
}

export function addCaddy(player: mod.Player) {
    if (!caddies.includes(player)) {
        caddies.push(player);
    }
}

export function removeCaddy(player: mod.Player) {
    const index = caddies.indexOf(player);
    if (index > -1) {
        caddies.splice(index, 1);
    }
}

export function addSpectator(player: mod.Player) {
    if (!spectators.includes(player)) {
        spectators.push(player);
    }
}

export function removeSpectator(player: mod.Player) {
    const index = spectators.indexOf(player);
    if (index > -1) {
        spectators.splice(index, 1);
    }
}

export function createFoursome(id: number): Foursome {
    const foursome: Foursome = {
        id: id,
        golfers: [],
        caddies: [],
        currentHole: 1,
        holeStartTime: 0
    };
    foursomes.push(foursome);
    return foursome;
}

export function removeFoursome(id: number) {
    const index = foursomes.findIndex(f => f.id === id);
    if (index > -1) {
        foursomes.splice(index, 1);
    }
}

export function clearAllFoursomes() {
    foursomes = [];
}

export function clearPlayerArrays() {
    golfers = [];
    caddies = [];
    spectators = [];
}
