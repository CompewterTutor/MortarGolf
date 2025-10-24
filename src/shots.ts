/**
 * Shot System
 * 
 * Manages all shot mechanics including setup, aiming, power meter,
 * launch angle adjustment, spin control, and shot execution.
 * This module handles the 3-click shot meter system and provides
 * the interface for players to take shots.
 */

import { ShotData, ClubType, GolfPlayer, HolePhase, GameState, Player, Widget } from './types';
import { 
    DRIVER_DISTANCE, 
    IRON_DISTANCE, 
    WEDGE_DISTANCE, 
    PUTTER_DISTANCE,
    SHOT_TIMER_SECONDS,
    SHOT_METER_SPEED,
    SPIN_MAX_EFFECT,
    MIN_LAUNCH_ANGLE,
    MAX_LAUNCH_ANGLE
} from './constants';
import { getCurrentHoleNumber, gameState } from './state';
import { getCourseHole } from './course';
import { MakeMessage } from './helpers';
import { GolfPlayer as GolfPlayerClass } from './player';

///////////////////////////////////////////////////////////////////////////////
// SHOT STATE ENUMS
///////////////////////////////////////////////////////////////////////////////

/**
 * Phases of the shot setup process
 */
export enum ShotPhase {
    NONE = 'none',           // Not in shot setup
    AIMING = 'aiming',       // Selecting direction and club
    BACKSWING = 'backswing', // First click - start backswing
    POWER = 'power',         // Second click - determine power
    HOOK_SLICE = 'hookslice', // Third click - determine hook/slice
    EXECUTING = 'executing', // Shot is in flight
    COMPLETE = 'complete'    // Shot has landed
}

/**
 * Shot meter states for the 3-click system
 */
export enum ShotMeterState {
    STOPPED = 'stopped',     // Meter not moving
    FORWARD = 'forward',     // Meter moving forward (increasing)
    BACKWARD = 'backward'    // Meter moving backward (decreasing)
}

///////////////////////////////////////////////////////////////////////////////
// SHOT SETUP PLAYER STATE
///////////////////////////////////////////////////////////////////////////////

/**
 * Extended shot state for each player
 */
export interface PlayerShotState {
    player: Player;
    currentPhase: ShotPhase;
    meterState: ShotMeterState;
    meterPosition: number;        // 0.0 - 1.0 position in meter
    meterSpeed: number;           // Speed of meter movement
    meterDirection: number;       // 1 for forward, -1 for backward
    
    // Shot inputs
    selectedClub: ClubType;
    aimDirection: number;         // 0-360 degrees
    launchAngle: number;          // 0-90 degrees
    spin: number;                 // -1.0 to 1.0
    backspin: number;             // 0.0 - 1.0
    
    // Timing
    shotStartTime: number;        // When shot setup began
    lastMeterUpdate: number;      // Last time meter moved
    timeRemaining: number;        // Time left to take shot
    
    // UI elements
    shotWidgets: Widget[];    // Shot UI widgets for cleanup
    
    // Results
    shotData: ShotData | null;    // Final shot data when executed
    isShotValid: boolean;         // Whether shot meets requirements
}

///////////////////////////////////////////////////////////////////////////////
// PLAYER SHOT STATE MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Map of player shot states by player object ID
 */
const playerShotStates = new Map<number, PlayerShotState>();

/**
 * Get or create shot state for a player
 */
export function getPlayerShotState(player: Player): PlayerShotState {
    const playerId = mod.GetObjId(player);
    
    if (!playerShotStates.has(playerId)) {
        const shotState: PlayerShotState = {
            player,
            currentPhase: ShotPhase.NONE,
            meterState: ShotMeterState.STOPPED,
            meterPosition: 0.0,
            meterSpeed: 1.0,
            meterDirection: 1,
            
            selectedClub: ClubType.Driver,
            aimDirection: 0.0,
            launchAngle: 45.0,
            spin: 0.0,
            backspin: 0.5,
            
            shotStartTime: 0,
            lastMeterUpdate: 0,
            timeRemaining: SHOT_TIMER_SECONDS,
            
            shotWidgets: [],
            
            shotData: null,
            isShotValid: false
        };
        
        playerShotStates.set(playerId, shotState);
    }
    
    return playerShotStates.get(playerId)!;
}

/**
 * Remove shot state for a player (cleanup on disconnect)
 */
export function removePlayerShotState(player: Player): void {
    const playerId = mod.GetObjId(player);
    
    // Clean up UI widgets
    const shotState = playerShotStates.get(playerId);
    if (shotState) {
        cleanupShotUI(shotState);
    }
    
    playerShotStates.delete(playerId);
}

/**
 * Get all players currently in shot setup
 */
export function getPlayersInShotSetup(): PlayerShotState[] {
    return Array.from(playerShotStates.values()).filter(
        state => state.currentPhase !== ShotPhase.NONE && 
                state.currentPhase !== ShotPhase.COMPLETE
    );
}

///////////////////////////////////////////////////////////////////////////////
// SHOT SETUP FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize shot setup for a player
 */
export function initializeShotSetup(player: Player): boolean {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer) {
        console.log('[Shots] initializeShotSetup: Player not found');
        return false;
    }
    
    // Check if player is allowed to take a shot
    if (!canPlayerTakeShot(golfPlayer)) {
        console.log('[Shots] initializeShotSetup: Player cannot take shot');
        return false;
    }
    
    const shotState = getPlayerShotState(player);
    
    // Reset shot state
    shotState.currentPhase = ShotPhase.AIMING;
    shotState.meterState = ShotMeterState.STOPPED;
    shotState.meterPosition = 0.0;
    shotState.meterDirection = 1;
    shotState.shotStartTime = Date.now();
    shotState.lastMeterUpdate = Date.now();
    shotState.timeRemaining = SHOT_TIMER_SECONDS;
    shotState.shotData = null;
    shotState.isShotValid = false;
    
    // Set default club based on distance to pin
    shotState.selectedClub = recommendClub(golfPlayer.distanceToPin);
    
    // Set default aim direction towards pin
    shotState.aimDirection = calculateAimDirection(golfPlayer);
    
    // Create shot UI
    createShotUI(shotState);
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('shotSetupStarted'),
        player
    );
    
    console.log(`[Shots] Shot setup initialized for player ${mod.GetPlayerName(player)}`);
    return true;
}

/**
 * Check if player is allowed to take a shot
 */
function canPlayerTakeShot(golfPlayer: GolfPlayer): boolean {
    // Check game state
    if (gameState !== GameState.Playing) {
        return false;
    }
    
    // Check if it's player's turn (TODO: implement turn order)
    // For now, allow any player on current hole to shoot
    
    // Check if player is on correct hole
    if (golfPlayer.currentHole !== getCurrentHoleNumber()) {
        return false;
    }
    
    // Check if player has completed current hole
    if (golfPlayer.holePhase === HolePhase.Complete) {
        return false;
    }
    
    return true;
}

/**
 * Recommend club based on distance to pin
 */
function recommendClub(distance: number): ClubType {
    if (distance <= PUTTER_DISTANCE) {
        return ClubType.Putter;
    } else if (distance <= WEDGE_DISTANCE) {
        return ClubType.Wedge;
    } else if (distance <= IRON_DISTANCE) {
        return ClubType.Iron;
    } else {
        return ClubType.Driver;
    }
}

/**
 * Calculate initial aim direction towards pin
 */
function calculateAimDirection(golfPlayer: GolfPlayer): number {
    if (!golfPlayer.ballPosition) {
        return 0.0; // Default direction
    }
    
    const currentHole = getCourseHole(getCurrentHoleNumber());
    if (!currentHole) {
        return 0.0;
    }
    
    // Calculate direction from ball position to pin position
    const dx = currentHole.greenPosition.x - golfPlayer.ballPosition.x;
    const dy = currentHole.greenPosition.y - golfPlayer.ballPosition.y;
    
    // Convert to degrees (0-360)
    let direction = Math.atan2(dy, dx) * (180 / Math.PI);
    direction = (direction + 360) % 360; // Normalize to 0-360
    
    return direction;
}

///////////////////////////////////////////////////////////////////////////////
// 3-CLICK SHOT METER SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Handle first click - start backswing
 */
export function handleFirstClick(player: Player): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.AIMING) {
        return false;
    }
    
    // Start the backswing meter
    shotState.currentPhase = ShotPhase.BACKSWING;
    shotState.meterState = ShotMeterState.FORWARD;
    shotState.meterPosition = 0.0;
    shotState.meterDirection = 1;
    shotState.lastMeterUpdate = Date.now();
    
    // Update UI to show meter
    updateShotMeterUI(shotState);
    
    console.log(`[Shots] First click - backswing started for ${mod.GetPlayerName(player)}`);
    return true;
}

/**
 * Handle second click - determine power
 */
export function handleSecondClick(player: Player): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.BACKSWING) {
        return false;
    }
    
    // Capture power at current meter position
    const power = shotState.meterPosition;
    
    // Start hook/slice meter
    shotState.currentPhase = ShotPhase.HOOK_SLICE;
    shotState.meterState = ShotMeterState.FORWARD;
    shotState.meterPosition = 0.0;
    shotState.meterDirection = 1;
    shotState.lastMeterUpdate = Date.now();
    
    // Store power for final shot
    shotState.shotData = {
        power: clamp(power, 0.0, 1.0),
        direction: shotState.aimDirection,
        launchAngle: shotState.launchAngle,
        spin: 0.0, // Will be determined by third click
        backspin: shotState.backspin,
        club: shotState.selectedClub
    };
    
    // Update UI
    updateShotMeterUI(shotState);
    
    console.log(`[Shots] Second click - power set to ${(power * 100).toFixed(1)}% for ${mod.GetPlayerName(player)}`);
    return true;
}

/**
 * Handle third click - determine hook/slice and execute shot
 */
export function handleThirdClick(player: Player): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.HOOK_SLICE) {
        return false;
    }
    
    // Capture hook/slice at current meter position
    const hookSliceValue = (shotState.meterPosition - 0.5) * 2; // Convert 0-1 to -1 to 1
    
    // Update final shot data
    if (shotState.shotData) {
        shotState.shotData.spin = clamp(hookSliceValue, -1.0, 1.0);
        shotState.isShotValid = true;
    }
    
    // Execute the shot
    executeShot(shotState);
    
    console.log(`[Shots] Third click - hook/slice set to ${(hookSliceValue * 100).toFixed(1)}% for ${mod.GetPlayerName(player)}`);
    return true;
}

/**
 * Update shot meter position based on time
 */
export function updateShotMeter(shotState: PlayerShotState, deltaTime: number): void {
    if (shotState.meterState === ShotMeterState.STOPPED) {
        return;
    }
    
    // Update meter position
    shotState.meterPosition += shotState.meterDirection * shotState.meterSpeed * deltaTime;
    
    // Handle direction changes at boundaries
    if (shotState.meterPosition >= 1.0) {
        shotState.meterPosition = 1.0;
        shotState.meterDirection = -1;
    } else if (shotState.meterPosition <= 0.0) {
        shotState.meterPosition = 0.0;
        shotState.meterDirection = 1;
    }
    
    // Update UI
    updateShotMeterUI(shotState);
}

///////////////////////////////////////////////////////////////////////////////
// SHOT EXECUTION
///////////////////////////////////////////////////////////////////////////////

/**
 * Execute the shot with calculated parameters
 */
function executeShot(shotState: PlayerShotState): void {
    if (!shotState.shotData || !shotState.isShotValid) {
        console.log('[Shots] executeShot: Invalid shot data');
        return;
    }
    
    shotState.currentPhase = ShotPhase.EXECUTING;
    shotState.meterState = ShotMeterState.STOPPED;
    
    // Calculate shot trajectory and spawn mortar
    const trajectory = calculateShotTrajectory(shotState.shotData, shotState.player);
    
    // Spawn mortar projectile
    spawnMortarProjectile(shotState.player, trajectory);
    
    // Update player state
    const golfPlayer = GolfPlayerClass.get(shotState.player);
    if (golfPlayer) {
        golfPlayer.shotCount++;
        golfPlayer.lastShotPosition = golfPlayer.ballPosition;
    }
    
    // Clean up shot UI
    cleanupShotUI(shotState);
    
    // Notify players
    mod.DisplayHighlightedWorldLogMessage(
        MakeMessage('shotTaken', mod.GetPlayerName(shotState.player)),
        mod.GetTeam(shotState.player)
    );
    
    console.log(`[Shots] Shot executed by ${mod.GetPlayerName(shotState.player)} - Power: ${(shotState.shotData.power * 100).toFixed(1)}%, Spin: ${(shotState.shotData.spin * 100).toFixed(1)}%`);
}

/**
 * Calculate shot trajectory based on shot data
 */
function calculateShotTrajectory(shotData: ShotData, player: Player): any {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer || !golfPlayer.ballPosition) {
        return null;
    }
    
    // Get club distance multiplier
    const clubDistance = getClubMaxDistance(shotData.club);
    
    // Calculate base distance
    let distance = clubDistance * shotData.power;
    
    // Apply lie effects (rough, sand, etc.)
    distance *= getLieMultiplier(golfPlayer.currentLie);
    
    // Calculate launch velocity
    const launchAngleRad = shotData.launchAngle * (Math.PI / 180);
    const horizontalVelocity = distance * Math.cos(launchAngleRad);
    const verticalVelocity = distance * Math.sin(launchAngleRad);
    
    // Calculate direction vector
    const directionRad = shotData.direction * (Math.PI / 180);
    const vx = horizontalVelocity * Math.cos(directionRad);
    const vy = horizontalVelocity * Math.sin(directionRad);
    const vz = verticalVelocity;
    
    // Apply spin effects (hook/slice)
    const spinEffect = shotData.spin * 0.1; // Reduce spin effect
    const finalVx = vx + spinEffect * horizontalVelocity;
    const finalVy = vy + spinEffect * horizontalVelocity * 0.5;
    
    return {
        startPosition: golfPlayer.ballPosition,
        velocity: { x: finalVx, y: finalVy, z: vz },
        club: shotData.club,
        expectedDistance: distance,
        spin: shotData.spin,
        backspin: shotData.backspin
    };
}

/**
 * Get maximum distance for club type
 */
function getClubMaxDistance(club: ClubType): number {
    switch (club) {
        case ClubType.Driver: return DRIVER_DISTANCE;
        case ClubType.Iron: return IRON_DISTANCE;
        case ClubType.Wedge: return WEDGE_DISTANCE;
        case ClubType.Putter: return PUTTER_DISTANCE;
        default: return IRON_DISTANCE;
    }
}

/**
 * Get distance multiplier based on lie type
 */
function getLieMultiplier(lie: string): number {
    // These would be defined in constants.ts
    const lieMultipliers: { [key: string]: number } = {
        'tee': 1.1,
        'fairway': 1.0,
        'rough': 0.7,
        'sand': 0.5,
        'green': 0.3 // Putter distance
    };
    
    return lieMultipliers[lie] || 1.0;
}

/**
 * Spawn mortar projectile with calculated trajectory
 */
function spawnMortarProjectile(player: Player, trajectory: any): void {
    if (!trajectory) {
        return;
    }
    
    // TODO: Implement actual mortar spawning using SDK
    // This would involve:
    // 1. Creating mortar entity at player position
    // 2. Setting initial velocity based on trajectory
    // 3. Setting up collision detection for landing
    // 4. Handling impact effects and ball position update
    
    console.log(`[Shots] Spawning mortar with velocity:`, trajectory.velocity);
    
    // Placeholder for SDK mortar spawn
    // mod.SpawnMortar(player, trajectory.startPosition, trajectory.velocity);
}

///////////////////////////////////////////////////////////////////////////////
// SHOT UI FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Create shot setup UI for player
 */
function createShotUI(shotState: PlayerShotState): void {
    // TODO: Implement shot UI creation using ParseUI
    // This would include:
    // - Aiming reticle/direction indicator
    // - Power meter bar
    // - Launch angle slider
    // - Spin control wheel
    // - Club selection menu
    // - Wind indicator
    // - Distance display
    
    console.log(`[Shots] Creating shot UI for ${mod.GetPlayerName(shotState.player)}`);
}

/**
 * Update shot meter UI
 */
function updateShotMeterUI(shotState: PlayerShotState): void {
    // TODO: Update meter position in UI
    // Update meter bar fill, color changes based on position, etc.
}

/**
 * Clean up shot UI elements
 */
function cleanupShotUI(shotState: PlayerShotState): void {
    // TODO: Clean up all shot UI widgets
    shotState.shotWidgets.forEach(widget => {
        mod.DeleteUIWidget(widget);
    });
    shotState.shotWidgets = [];
}

///////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Clamp value between min and max
 */
function clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Cancel shot setup for player
 */
export function cancelShotSetup(player: Player): void {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase === ShotPhase.NONE) {
        return;
    }
    
    // Reset state
    shotState.currentPhase = ShotPhase.NONE;
    shotState.meterState = ShotMeterState.STOPPED;
    
    // Clean up UI
    cleanupShotUI(shotState);
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('shotCancelled'),
        player
    );
    
    console.log(`[Shots] Shot setup cancelled for ${mod.GetPlayerName(player)}`);
}

/**
 * Update shot timer for all players in shot setup
 */
export function updateShotTimers(deltaTime: number): void {
    playerShotStates.forEach(shotState => {
        if (shotState.currentPhase === ShotPhase.NONE || 
            shotState.currentPhase === ShotPhase.COMPLETE) {
            return;
        }
        
        // Update time remaining
        shotState.timeRemaining -= deltaTime;
        
        // Check timeout
        if (shotState.timeRemaining <= 0) {
            // Auto-cancel shot due to timeout
            cancelShotSetup(shotState.player);
            mod.DisplayNotificationMessage(
                MakeMessage('shotTimeout'),
                shotState.player
            );
        }
        
        // Update meter if in active phase
        if (shotState.meterState !== ShotMeterState.STOPPED) {
            updateShotMeter(shotState, deltaTime);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////
// CLUB SELECTION
///////////////////////////////////////////////////////////////////////////////

/**
 * Change selected club for player
 */
export function changeClub(player: Player, club: ClubType): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.AIMING) {
        return false;
    }
    
    shotState.selectedClub = club;
    
    // Update UI to show new club
    updateClubUI(shotState);
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('clubSelected', getClubName(club)),
        player
    );
    
    return true;
}

/**
 * Get display name for club
 */
function getClubName(club: ClubType): string {
    const clubNames = {
        [ClubType.Driver]: 'Driver',
        [ClubType.Iron]: 'Iron',
        [ClubType.Wedge]: 'Wedge',
        [ClubType.Putter]: 'Putter'
    };
    
    return clubNames[club] || 'Unknown';
}

/**
 * Update club display in UI
 */
function updateClubUI(shotState: PlayerShotState): void {
    // TODO: Update club selection UI
}

///////////////////////////////////////////////////////////////////////////////
// AIMING ADJUSTMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Adjust aim direction
 */
export function adjustAimDirection(player: Player, deltaAngle: number): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.AIMING) {
        return false;
    }
    
    shotState.aimDirection = (shotState.aimDirection + deltaAngle + 360) % 360;
    
    // Update aiming UI
    updateAimingUI(shotState);
    
    return true;
}

/**
 * Adjust launch angle
 */
export function adjustLaunchAngle(player: Player, deltaAngle: number): boolean {
    const shotState = getPlayerShotState(player);
    
    if (shotState.currentPhase !== ShotPhase.AIMING) {
        return false;
    }
    
    shotState.launchAngle = clamp(
        shotState.launchAngle + deltaAngle,
        MIN_LAUNCH_ANGLE,
        MAX_LAUNCH_ANGLE
    );
    
    // Update UI
    updateAimingUI(shotState);
    
    return true;
}

/**
 * Update aiming UI elements
 */
function updateAimingUI(shotState: PlayerShotState): void {
    // TODO: Update aiming reticle, direction indicator, etc.
}

console.log('[Shots] Shot system initialized');