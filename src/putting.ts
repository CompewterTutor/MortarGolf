/**
 * Putting System
 * 
 * Handles dart-based putting mechanics when players are on the green.
 * This system creates randomized targets, detects dart hits, and manages
 * the putting phase of golf gameplay.
 */

import { GolfPlayer, Player, Widget, Vector, HolePhase, GameState } from './types';
import { 
    PUTTER_DISTANCE, 
    PUTT_TIMEOUT,
    COURSE_HOLES 
} from './constants';
import { getCurrentHoleNumber, gameState } from './state';
import { getCourseHole } from './course';
import { MakeMessage } from './helpers';
import { GolfPlayer as GolfPlayerClass } from './player';

///////////////////////////////////////////////////////////////////////////////
// PUTTING STATE ENUMS
///////////////////////////////////////////////////////////////////////////////

/**
 * Putting phase states
 */
export enum PuttingPhase {
    NONE = 'none',           // Not putting
    AIMING = 'aiming',       // Aiming the dart
    CHARGING = 'charging',   // Charging throw power
    THROWING = 'throwing',   // Dart in flight
    RESULT = 'result'        // Showing result
}

/**
 * Target difficulty levels based on distance
 */
export enum TargetDifficulty {
    EASY = 'easy',       // Close putts (< 5m)
    MEDIUM = 'medium',   // Medium putts (5-10m)
    HARD = 'hard',       // Long putts (10-15m)
    EXPERT = 'expert'    // Very long putts (15-20m)
}

///////////////////////////////////////////////////////////////////////////////
// PUTTING TARGET DATA
///////////////////////////////////////////////////////////////////////////////

/**
 * Putting target configuration
 */
export interface PuttingTarget {
    id: number;
    position: Vector;
    radius: number;
    difficulty: TargetDifficulty;
    pointValue: number;
    timeBonus: number;
    visualObject?: any;        // SDK object for visualization
    hitDetected: boolean;
}

/**
 * Player putting state
 */
export interface PlayerPuttingState {
    player: Player;
    currentPhase: PuttingPhase;
    target: PuttingTarget | null;
    throwPower: number;        // 0.0 - 1.0
    aimDirection: number;      // 0-360 degrees
    timeRemaining: number;
    puttAttempts: number;
    startTime: number;
    
    // UI elements
    puttingWidgets: Widget[];
    
    // Results
    lastResult: 'success' | 'miss' | null;
    distanceToHole: number;
}

///////////////////////////////////////////////////////////////////////////////
// PUTTING STATE MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Map of player putting states by player object ID
 */
const playerPuttingStates = new Map<number, PlayerPuttingState>();

/**
 * Get or create putting state for a player
 */
export function getPlayerPuttingState(player: Player): PlayerPuttingState {
    const playerId = mod.GetObjId(player);
    
    if (!playerPuttingStates.has(playerId)) {
        const puttingState: PlayerPuttingState = {
            player,
            currentPhase: PuttingPhase.NONE,
            target: null,
            throwPower: 0.0,
            aimDirection: 0.0,
            timeRemaining: PUTT_TIMEOUT,
            puttAttempts: 0,
            startTime: 0,
            puttingWidgets: [],
            lastResult: null,
            distanceToHole: 0
        };
        
        playerPuttingStates.set(playerId, puttingState);
    }
    
    return playerPuttingStates.get(playerId)!;
}

/**
 * Remove putting state for a player (cleanup on disconnect)
 */
export function removePlayerPuttingState(player: Player): void {
    const playerId = mod.GetObjId(player);
    
    // Clean up UI widgets
    const puttingState = playerPuttingStates.get(playerId);
    if (puttingState) {
        cleanupPuttingUI(puttingState);
        cleanupTarget(puttingState);
    }
    
    playerPuttingStates.delete(playerId);
}

///////////////////////////////////////////////////////////////////////////////
// PUTTING MODE INITIALIZATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize putting mode for a player
 */
export function initializePuttingMode(player: Player): boolean {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer) {
        console.log('[Putting] initializePuttingMode: Player not found');
        return false;
    }
    
    // Check if player is allowed to putt
    if (!canPlayerPutt(golfPlayer)) {
        console.log('[Putting] initializePuttingMode: Player cannot putt');
        return false;
    }
    
    const puttingState = getPlayerPuttingState(player);
    
    // Reset putting state
    puttingState.currentPhase = PuttingPhase.AIMING;
    puttingState.throwPower = 0.0;
    puttingState.timeRemaining = PUTT_TIMEOUT;
    puttingState.puttAttempts++;
    puttingState.startTime = Date.now();
    puttingState.lastResult = null;
    
    // Calculate distance to hole
    puttingState.distanceToHole = calculateDistanceToHole(golfPlayer);
    
    // Generate putting target
    puttingState.target = generatePuttingTarget(golfPlayer, puttingState.distanceToHole);
    
    // Create putting UI
    createPuttingUI(puttingState);
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('puttingModeStarted', puttingState.distanceToHole.toFixed(1)),
        player
    );
    
    console.log(`[Putting] Putting mode initialized for ${mod.GetPlayerName(player)} at ${puttingState.distanceToHole.toFixed(1)}m`);
    return true;
}

/**
 * Check if player is allowed to putt
 */
function canPlayerPutt(golfPlayer: GolfPlayer): boolean {
    // Check game state
    if (gameState !== GameState.Playing) {
        return false;
    }
    
    // Check if player is on green
    if (golfPlayer.holePhase !== HolePhase.Putting) {
        return false;
    }
    
    // Check if player is on current hole
    if (golfPlayer.currentHole !== getCurrentHoleNumber()) {
        return false;
    }
    
    // Check distance (must be within putting range)
    const distance = calculateDistanceToHole(golfPlayer);
    if (distance > PUTTER_DISTANCE) {
        return false;
    }
    
    return true;
}

/**
 * Calculate distance from player ball to hole
 */
function calculateDistanceToHole(golfPlayer: GolfPlayer): number {
    if (!golfPlayer.ballPosition) {
        return 999; // Invalid position
    }
    
    const currentHole = getCourseHole(getCurrentHoleNumber());
    if (!currentHole) {
        return 999;
    }
    
    const dx = currentHole.greenPosition.x - golfPlayer.ballPosition.x;
    const dy = currentHole.greenPosition.y - golfPlayer.ballPosition.y;
    const dz = currentHole.greenPosition.z - golfPlayer.ballPosition.z;
    
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

///////////////////////////////////////////////////////////////////////////////
// TARGET GENERATION SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Generate putting target based on distance and difficulty
 */
function generatePuttingTarget(golfPlayer: GolfPlayer, distance: number): PuttingTarget {
    const difficulty = determineTargetDifficulty(distance);
    const targetConfig = getTargetConfiguration(difficulty);
    
    // Calculate target position (with some randomness)
    const targetPosition = calculateTargetPosition(golfPlayer, distance, difficulty);
    
    const target: PuttingTarget = {
        id: Date.now() + Math.random(), // Unique ID
        position: targetPosition,
        radius: targetConfig.radius,
        difficulty,
        pointValue: targetConfig.pointValue,
        timeBonus: targetConfig.timeBonus,
        hitDetected: false
    };
    
    // Create visual target
    createTargetVisual(target);
    
    return target;
}

/**
 * Determine target difficulty based on distance
 */
function determineTargetDifficulty(distance: number): TargetDifficulty {
    if (distance <= 5) {
        return TargetDifficulty.EASY;
    } else if (distance <= 10) {
        return TargetDifficulty.MEDIUM;
    } else if (distance <= 15) {
        return TargetDifficulty.HARD;
    } else {
        return TargetDifficulty.EXPERT;
    }
}

/**
 * Get target configuration based on difficulty
 */
function getTargetConfiguration(difficulty: TargetDifficulty): {
    radius: number;
    pointValue: number;
    timeBonus: number;
} {
    switch (difficulty) {
        case TargetDifficulty.EASY:
            return {
                radius: 2.0,      // Large target
                pointValue: 100,
                timeBonus: 10
            };
        case TargetDifficulty.MEDIUM:
            return {
                radius: 1.5,      // Medium target
                pointValue: 200,
                timeBonus: 15
            };
        case TargetDifficulty.HARD:
            return {
                radius: 1.0,      // Small target
                pointValue: 300,
                timeBonus: 20
            };
        case TargetDifficulty.EXPERT:
            return {
                radius: 0.7,      // Very small target
                pointValue: 500,
                timeBonus: 30
            };
        default:
            return {
                radius: 1.5,
                pointValue: 200,
                timeBonus: 15
            };
    }
}

/**
 * Calculate target position with randomness
 */
function calculateTargetPosition(golfPlayer: GolfPlayer, distance: number, difficulty: TargetDifficulty): Vector {
    if (!golfPlayer.ballPosition) {
        return mod.CreateVector(0, 0, 0);
    }
    
    const currentHole = getCourseHole(getCurrentHoleNumber());
    if (!currentHole) {
        return mod.CreateVector(0, 0, 0);
    }
    
    // Base direction towards hole
    const dx = currentHole.greenPosition.x - golfPlayer.ballPosition.x;
    const dy = currentHole.greenPosition.y - golfPlayer.ballPosition.y;
    const baseDirection = Math.atan2(dy, dx);
    
    // Add randomness based on difficulty (harder = more deviation)
    const maxDeviation = getMaxDeviation(difficulty);
    const deviation = (Math.random() - 0.5) * 2 * maxDeviation;
    const finalDirection = baseDirection + deviation;
    
    // Calculate target distance (shorter than actual hole distance for challenge)
    const targetDistance = Math.min(distance * 0.8, distance - 1);
    
    // Calculate final position
    const targetX = golfPlayer.ballPosition.x + Math.cos(finalDirection) * targetDistance;
    const targetY = golfPlayer.ballPosition.y + Math.sin(finalDirection) * targetDistance;
    const targetZ = currentHole.greenPosition.z; // Same height as hole
    
    return mod.CreateVector(targetX, targetY, targetZ);
}

/**
 * Get maximum deviation angle based on difficulty
 */
function getMaxDeviation(difficulty: TargetDifficulty): number {
    switch (difficulty) {
        case TargetDifficulty.EASY:
            return Math.PI / 12; // 15 degrees
        case TargetDifficulty.MEDIUM:
            return Math.PI / 8;  // 22.5 degrees
        case TargetDifficulty.HARD:
            return Math.PI / 6;  // 30 degrees
        case TargetDifficulty.EXPERT:
            return Math.PI / 4;  // 45 degrees
        default:
            return Math.PI / 8;
    }
}

/**
 * Create visual target object
 */
function createTargetVisual(target: PuttingTarget): void {
    // Create a visual marker for the target
    // Using a simple sphere or cylinder as placeholder
    const targetScale = mod.CreateVector(target.radius * 2, target.radius * 2, 0.5);
    
    target.visualObject = mod.SpawnObject(
        mod.RuntimeSpawn_Common.Cylinder_01_A, // Placeholder cylinder
        target.position,
        mod.CreateVector(0, 0, 0), // No rotation
        targetScale
    );
    
    console.log(`[Putting] Target created at position:`, target.position);
}

/**
 * Clean up target visual
 */
function cleanupTarget(puttingState: PlayerPuttingState): void {
    if (puttingState.target && puttingState.target.visualObject) {
        // TODO: Destroy visual object if SDK supports it
        // For now, let it expire naturally
        puttingState.target.visualObject = undefined;
    }
}

///////////////////////////////////////////////////////////////////////////////
// DART THROWING MECHANICS
///////////////////////////////////////////////////////////////////////////////

/**
 * Start dart throw charging
 */
export function startDartThrow(player: Player): boolean {
    const puttingState = getPlayerPuttingState(player);
    
    if (puttingState.currentPhase !== PuttingPhase.AIMING) {
        return false;
    }
    
    puttingState.currentPhase = PuttingPhase.CHARGING;
    puttingState.throwPower = 0.0;
    
    // Start power charging
    chargeThrowPower(puttingState);
    
    console.log(`[Putting] Dart throw started for ${mod.GetPlayerName(player)}`);
    return true;
}

/**
 * Charge throw power over time
 */
function chargeThrowPower(puttingState: PlayerPuttingState): void {
    const chargeInterval = 50; // 20 FPS updates
    const maxPower = 1.0;
    const chargeSpeed = 0.5; // Power per second
    
    const chargeLoop = () => {
        if (puttingState.currentPhase !== PuttingPhase.CHARGING) {
            return;
        }
        
        // Increase power
        puttingState.throwPower = Math.min(
            puttingState.throwPower + (chargeSpeed * chargeInterval / 1000),
            maxPower
        );
        
        // Update UI
        updatePuttingUI(puttingState);
        
        // Continue charging
        if (puttingState.throwPower < maxPower) {
            setTimeout(chargeLoop, chargeInterval);
        }
    };
    
    setTimeout(chargeLoop, chargeInterval);
}

/**
 * Release dart throw
 */
export function releaseDartThrow(player: Player): boolean {
    const puttingState = getPlayerPuttingState(player);
    
    if (puttingState.currentPhase !== PuttingPhase.CHARGING) {
        return false;
    }
    
    puttingState.currentPhase = PuttingPhase.THROWING;
    
    // Calculate throw trajectory
    const trajectory = calculateDartTrajectory(puttingState);
    
    // Spawn dart projectile
    spawnDartProjectile(puttingState, trajectory);
    
    console.log(`[Putting] Dart released by ${mod.GetPlayerName(player)} with power ${(puttingState.throwPower * 100).toFixed(1)}%`);
    return true;
}

/**
 * Calculate dart trajectory
 */
function calculateDartTrajectory(puttingState: PlayerPuttingState): any {
    if (!puttingState.target) {
        return null;
    }
    
    const golfPlayer = GolfPlayerClass.get(puttingState.player);
    if (!golfPlayer || !golfPlayer.ballPosition) {
        return null;
    }
    
    // Calculate direction to target
    const dx = puttingState.target.position.x - golfPlayer.ballPosition.x;
    const dy = puttingState.target.position.y - golfPlayer.ballPosition.y;
    const dz = puttingState.target.position.z - golfPlayer.ballPosition.z;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    const direction = Math.atan2(dy, dx);
    
    // Calculate velocity based on power and distance
    const baseVelocity = 20; // Base dart speed
    const powerMultiplier = 0.5 + (puttingState.throwPower * 0.5); // 50% to 100% power
    const velocity = baseVelocity * powerMultiplier * (distance / 10); // Scale by distance
    
    // Add some arc to the throw
    const vx = Math.cos(direction) * velocity;
    const vy = Math.sin(direction) * velocity;
    const vz = velocity * 0.3; // Upward component for arc
    
    return {
        startPosition: golfPlayer.ballPosition,
        velocity: { x: vx, y: vy, z: vz },
        target: puttingState.target,
        power: puttingState.throwPower
    };
}

///////////////////////////////////////////////////////////////////////////////
// DART PROJECTILE SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Active dart projectiles tracking
 */
interface ActiveDart {
    id: number;
    player: Player;
    startPosition: any;
    velocity: any;
    target: PuttingTarget;
    power: number;
    startTime: number;
    visualObject?: any;
}

const activeDarts = new Map<number, ActiveDart>();
let nextDartId = 1;

/**
 * Spawn dart projectile
 */
function spawnDartProjectile(puttingState: PlayerPuttingState, trajectory: any): void {
    if (!trajectory || !puttingState.target) {
        console.log('[Putting] spawnDartProjectile: Invalid trajectory or target');
        return;
    }
    
    console.log(`[Putting] Spawning dart for ${mod.GetPlayerName(puttingState.player)}`);
    
    // Create dart visual
    const dartPosition = trajectory.startPosition;
    const dartScale = mod.CreateVector(0.2, 0.2, 0.2); // Small dart
    
    const dartObject = mod.SpawnObject(
        mod.RuntimeSpawn_Common.Crate_01_A, // Placeholder object
        dartPosition,
        mod.CreateVector(0, 0, 0),
        dartScale
    );
    
    // Create active dart tracking
    const dartId = nextDartId++;
    const activeDart: ActiveDart = {
        id: dartId,
        player: puttingState.player,
        startPosition: trajectory.startPosition,
        velocity: trajectory.velocity,
        target: trajectory.target,
        power: trajectory.power,
        startTime: Date.now(),
        visualObject: dartObject
    };
    
    activeDarts.set(dartId, activeDart);
    
    // Start dart update loop
    updateDartProjectile(activeDart);
}

/**
 * Update dart projectile and detect hits
 */
function updateDartProjectile(activeDart: ActiveDart): void {
    const updateInterval = 50; // 20 FPS updates
    const gravity = -9.81;
    const maxFlightTime = 2000; // 2 seconds max flight time
    
    const updateLoop = () => {
        const currentTime = Date.now();
        const deltaTime = (currentTime - activeDart.startTime) / 1000;
        
        // Check timeout
        if (deltaTime > maxFlightTime / 1000) {
            handleDartMiss(activeDart);
            return;
        }
        
        // Calculate current position
        const time = deltaTime;
        let currentX = activeDart.startPosition.x + activeDart.velocity.x * time;
        let currentY = activeDart.startPosition.y + activeDart.velocity.y * time;
        let currentZ = activeDart.startPosition.z + 
                      (activeDart.velocity.z * time) + 
                      (0.5 * gravity * time * time);
        
        // Check for ground impact
        if (currentZ <= activeDart.target.position.z) {
            // Check if hit target
            const hitDistance = Math.sqrt(
                Math.pow(currentX - activeDart.target.position.x, 2) +
                Math.pow(currentY - activeDart.target.position.y, 2)
            );
            
            if (hitDistance <= activeDart.target.radius) {
                handleDartHit(activeDart, hitDistance);
            } else {
                handleDartMiss(activeDart);
            }
            return;
        }
        
        // Continue updating
        setTimeout(updateLoop, updateInterval);
    };
    
    setTimeout(updateLoop, updateInterval);
}

/**
 * Handle successful dart hit
 */
function handleDartHit(activeDart: ActiveDart, hitDistance: number): void {
    const puttingState = getPlayerPuttingState(activeDart.player);
    puttingState.currentPhase = PuttingPhase.RESULT;
    puttingState.lastResult = 'success';
    puttingState.target!.hitDetected = true;
    
    // Calculate accuracy bonus
    const accuracy = 1.0 - (hitDistance / puttingState.target!.radius);
    const pointBonus = Math.floor(puttingState.target!.pointValue * accuracy);
    
    // Show success message
    mod.DisplayNotificationMessage(
        MakeMessage('puttSuccess', pointBonus.toString()),
        activeDart.player
    );
    
    // Create success effect
    createSuccessEffect(puttingState.target!.position);
    
    // Handle hole completion
    handleHoleCompletion(activeDart.player, pointBonus);
    
    // Clean up
    activeDarts.delete(activeDart.id);
    cleanupPuttingUI(puttingState);
    
    console.log(`[Putting] Dart hit! Accuracy: ${(accuracy * 100).toFixed(1)}%, Points: ${pointBonus}`);
}

/**
 * Handle dart miss
 */
function handleDartMiss(activeDart: ActiveDart): void {
    const puttingState = getPlayerPuttingState(activeDart.player);
    puttingState.currentPhase = PuttingPhase.RESULT;
    puttingState.lastResult = 'miss';
    
    // Show miss message
    mod.DisplayNotificationMessage(
        MakeMessage('puttMiss'),
        activeDart.player
    );
    
    // Set up next putt or handle hole failure
    setupNextPutt(activeDart.player);
    
    // Clean up
    activeDarts.delete(activeDart.id);
    cleanupPuttingUI(puttingState);
    
    console.log(`[Putting] Dart missed by ${mod.GetPlayerName(activeDart.player)}`);
}

/**
 * Create success visual effect
 */
function createSuccessEffect(position: Vector): void {
    // Spawn success effect (using explosion as placeholder)
    mod.SpawnObject(
        mod.RuntimeSpawn_Common.FX_ArtilleryStrike_Explosion_GS,
        position,
        mod.CreateVector(0, 0, 0),
        mod.CreateVector(0.5, 0.5, 0.5)
    );
}

///////////////////////////////////////////////////////////////////////////////
// HOLE COMPLETION & NEXT PUTT
///////////////////////////////////////////////////////////////////////////////

/**
 * Handle successful hole completion
 */
function handleHoleCompletion(player: Player, pointBonus: number): void {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer) {
        return;
    }
    
    // Mark hole as complete
    golfPlayer.holePhase = HolePhase.Complete;
    
    // Update score
    golfPlayer.score += pointBonus;
    
    // Show completion message
    mod.DisplayHighlightedWorldLogMessage(
        MakeMessage('holeCompleted', mod.GetPlayerName(player), golfPlayer.shotCount.toString()),
        mod.GetTeam(player)
    );
    
    console.log(`[Putting] Hole completed by ${mod.GetPlayerName(player)} with ${golfPlayer.shotCount} strokes`);
}

/**
 * Set up next putt after a miss
 */
function setupNextPutt(player: Player): void {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer) {
        return;
    }
    
    // Check if player has exceeded maximum putts
    const maxPutts = 3; // Maximum 3 putts per green
    const puttingState = getPlayerPuttingState(player);
    
    if (puttingState.puttAttempts >= maxPutts) {
        // Auto-complete hole with penalty
        mod.DisplayNotificationMessage(
            MakeMessage('maxPuttsExceeded'),
            player
        );
        
        // Add penalty strokes
        golfPlayer.shotCount += 2;
        handleHoleCompletion(player, 0);
    } else {
        // Set up another putt attempt after delay
        setTimeout(() => {
            if (canPlayerPutt(golfPlayer)) {
                initializePuttingMode(player);
            }
        }, 2000); // 2 second delay
    }
}

///////////////////////////////////////////////////////////////////////////////
// PUTTING UI FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Create putting mode UI
 */
function createPuttingUI(puttingState: PlayerPuttingState): void {
    // TODO: Implement putting UI using ParseUI
    // This would include:
    // - Target visualization
    // - Power meter
    // - Distance indicator
    // - Putt attempt counter
    // - Time remaining
    
    console.log(`[Putting] Creating putting UI for ${mod.GetPlayerName(puttingState.player)}`);
}

/**
 * Update putting UI
 */
function updatePuttingUI(puttingState: PlayerPuttingState): void {
    // TODO: Update power meter, target highlights, etc.
}

/**
 * Clean up putting UI
 */
function cleanupPuttingUI(puttingState: PlayerPuttingState): void {
    // TODO: Clean up all putting UI widgets
    puttingState.puttingWidgets.forEach(widget => {
        mod.DeleteUIWidget(widget);
    });
    puttingState.puttingWidgets = [];
}

///////////////////////////////////////////////////////////////////////////////
// PUTTING TIMER MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Update putting timers for all players
 */
export function updatePuttingTimers(deltaTime: number): void {
    playerPuttingStates.forEach(puttingState => {
        if (puttingState.currentPhase === PuttingPhase.NONE || 
            puttingState.currentPhase === PuttingPhase.RESULT) {
            return;
        }
        
        // Update time remaining
        puttingState.timeRemaining -= deltaTime;
        
        // Check timeout
        if (puttingState.timeRemaining <= 0) {
            // Auto-fail putt due to timeout
            cancelPuttingMode(puttingState.player);
            mod.DisplayNotificationMessage(
                MakeMessage('puttTimeout'),
                puttingState.player
            );
        }
    });
}

/**
 * Cancel putting mode for player
 */
export function cancelPuttingMode(player: Player): void {
    const puttingState = getPlayerPuttingState(player);
    
    if (puttingState.currentPhase === PuttingPhase.NONE) {
        return;
    }
    
    // Reset state
    puttingState.currentPhase = PuttingPhase.NONE;
    
    // Clean up UI and target
    cleanupPuttingUI(puttingState);
    cleanupTarget(puttingState);
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('puttingCancelled'),
        player
    );
    
    console.log(`[Putting] Putting mode cancelled for ${mod.GetPlayerName(player)}`);
}

///////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Get all players currently in putting mode
 */
export function getPlayersInPuttingMode(): PlayerPuttingState[] {
    return Array.from(playerPuttingStates.values()).filter(
        state => state.currentPhase !== PuttingPhase.NONE
    );
}

/**
 * Check if player is in putting mode
 */
export function isPlayerPutting(player: Player): boolean {
    const puttingState = getPlayerPuttingState(player);
    return puttingState.currentPhase !== PuttingPhase.NONE;
}

console.log('[Putting] Putting system initialized');