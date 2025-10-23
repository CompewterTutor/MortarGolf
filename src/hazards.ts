/**
 * Hazard System
 * 
 * Manages all hazard types including destructible obstacles, environmental
 * hazards, wind system, and penalty logic. This module handles the dynamic
 * nature of hazards that can change between matches or rounds.
 */

import { HazardData, HoleData } from './types';
import { COURSE_HOLES } from './constants';
import { getCurrentHoleNumber } from './state';
import { getCourseHole } from './course';

///////////////////////////////////////////////////////////////////////////////
// HAZARD TYPE DEFINITIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Types of hazards that can affect gameplay
 */
export enum HazardType {
    DESTRUCTIBLE = 'destructible',    // Can be destroyed with explosives
    WATER = 'water',                  // Water hazard - 1 stroke penalty
    SAND = 'sand',                    // Sand trap - shot difficulty increased
    ROUGH = 'rough',                  // Rough grass - distance reduced
    OUT_OF_BOUNDS = 'oob',            // Out of bounds - 1 stroke penalty
    SMOKE = 'smoke',                  // Smoke screen - visibility reduced
    FIRE = 'fire',                    // Fire area - damage over time
    ELECTRIC = 'electric'             // Electric field - equipment interference
}

/**
 * Destructible obstacle types with specific properties
 */
export enum DestructibleType {
    CRATE = 'crate',                  // Wooden crate - easy to destroy
    BARREL = 'barrel',                // Explosive barrel - chain reaction
    BARRIER = 'barrier',              // Concrete barrier - hard to destroy
    FENCE = 'fence',                  // Chain link fence - medium
    VEHICLE = 'vehicle',              // Wrecked vehicle - very hard
    BUILDING = 'building',            // Small building - extremely hard
    TREE = 'tree',                    // Tree - can be chopped down
    ROCK = 'rock'                     // Rock formation - nearly indestructible
}

/**
 * Wind conditions that affect shot trajectory
 */
export interface WindData {
    direction: number;                // Wind direction in degrees (0-360)
    intensity: number;                // Wind intensity (0.0 - 1.0)
    gustChance: number;               // Chance of gusts (0.0 - 1.0)
    variation: number;                // How much wind varies (0.0 - 1.0)
}

/**
 * Dynamic hazard configuration
 */
export interface DynamicHazardConfig {
    enabled: boolean;                 // Whether this hazard is active
    randomization: boolean;           // Whether to randomize placement
    intensity: number;                // Hazard intensity multiplier (0.5 - 2.0)
    frequency: number;                // How often this appears (0.0 - 1.0)
}

///////////////////////////////////////////////////////////////////////////////
// HAZARD CONFIGURATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Default configuration for each hazard type
 */
export const HAZARD_CONFIGS: Map<HazardType, DynamicHazardConfig> = new Map([
    [HazardType.DESTRUCTIBLE, {
        enabled: true,
        randomization: true,
        intensity: 1.0,
        frequency: 0.7
    }],
    [HazardType.WATER, {
        enabled: true,
        randomization: false,  // Water hazards are fixed
        intensity: 1.0,
        frequency: 1.0
    }],
    [HazardType.SAND, {
        enabled: true,
        randomization: false,  // Sand traps are fixed
        intensity: 1.0,
        frequency: 1.0
    }],
    [HazardType.ROUGH, {
        enabled: true,
        randomization: false,  // Rough areas are fixed
        intensity: 1.0,
        frequency: 1.0
    }],
    [HazardType.OUT_OF_BOUNDS, {
        enabled: true,
        randomization: false,  // OB areas are fixed
        intensity: 1.0,
        frequency: 1.0
    }],
    [HazardType.SMOKE, {
        enabled: false,  // Disabled by default
        randomization: true,
        intensity: 0.8,
        frequency: 0.3
    }],
    [HazardType.FIRE, {
        enabled: false,  // Disabled by default
        randomization: true,
        intensity: 0.6,
        frequency: 0.2
    }],
    [HazardType.ELECTRIC, {
        enabled: false,  // Disabled by default
        randomization: true,
        intensity: 0.7,
        frequency: 0.15
    }]
]);

/**
 * Destructible obstacle properties
 */
export const DESTRUCTIBLE_PROPERTIES: Map<DestructibleType, {
    health: number;                   // Health points
    explosionRadius: number;          // Explosion damage radius
    explosionDamage: number;          // Explosion damage
    destroyScore: number;             // Points for destroying
    respawnTime: number;              // Respawn time in seconds
}> = new Map([
    [DestructibleType.CRATE, {
        health: 50,
        explosionRadius: 5,
        explosionDamage: 20,
        destroyScore: 10,
        respawnTime: 30
    }],
    [DestructibleType.BARREL, {
        health: 75,
        explosionRadius: 15,
        explosionDamage: 50,
        destroyScore: 25,
        respawnTime: 45
    }],
    [DestructibleType.BARRIER, {
        health: 200,
        explosionRadius: 3,
        explosionDamage: 10,
        destroyScore: 50,
        respawnTime: 60
    }],
    [DestructibleType.FENCE, {
        health: 100,
        explosionRadius: 2,
        explosionDamage: 5,
        destroyScore: 15,
        respawnTime: 40
    }],
    [DestructibleType.VEHICLE, {
        health: 300,
        explosionRadius: 20,
        explosionDamage: 75,
        destroyScore: 100,
        respawnTime: 90
    }],
    [DestructibleType.BUILDING, {
        health: 500,
        explosionRadius: 25,
        explosionDamage: 100,
        destroyScore: 150,
        respawnTime: 120
    }],
    [DestructibleType.TREE, {
        health: 150,
        explosionRadius: 8,
        explosionDamage: 30,
        destroyScore: 30,
        respawnTime: 75
    }],
    [DestructibleType.ROCK, {
        health: 1000,
        explosionRadius: 5,
        explosionDamage: 15,
        destroyScore: 200,
        respawnTime: 180
    }]
]);

///////////////////////////////////////////////////////////////////////////////
// WIND SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Current wind conditions
 */
let currentWind: WindData = {
    direction: 0,
    intensity: 0,
    gustChance: 0,
    variation: 0
};

/**
 * Wind update timer
 */
let windUpdateTimer: number = 0;
const WIND_UPDATE_INTERVAL: number = 30; // Update wind every 30 seconds

/**
 * Initialize wind system for a new hole
 */
export function initializeWind(): void {
    // Generate random wind conditions
    currentWind.direction = Math.random() * 360;
    currentWind.intensity = Math.random() * 0.8; // Max 0.8 intensity
    currentWind.gustChance = Math.random() * 0.3; // Max 30% gust chance
    currentWind.variation = Math.random() * 0.5; // Max 50% variation
    
    windUpdateTimer = WIND_UPDATE_INTERVAL;
    
    console.log(`[HazardSystem] Wind initialized: ${currentWind.intensity.toFixed(2)} intensity at ${currentWind.direction.toFixed(0)}°`);
}

/**
 * Update wind system (called from update loop)
 */
export function updateWind(deltaTime: number): void {
    windUpdateTimer -= deltaTime;
    
    if (windUpdateTimer <= 0) {
        // Gradually change wind conditions
        const directionChange = (Math.random() - 0.5) * 45; // ±22.5 degrees
        const intensityChange = (Math.random() - 0.5) * 0.2; // ±0.1 intensity
        
        currentWind.direction = (currentWind.direction + directionChange + 360) % 360;
        currentWind.intensity = Math.max(0, Math.min(1, currentWind.intensity + intensityChange));
        
        windUpdateTimer = WIND_UPDATE_INTERVAL;
        
        console.log(`[HazardSystem] Wind updated: ${currentWind.intensity.toFixed(2)} intensity at ${currentWind.direction.toFixed(0)}°`);
    }
}

/**
 * Get current wind conditions
 */
export function getCurrentWind(): WindData {
    return { ...currentWind }; // Return copy to prevent modification
}

/**
 * Check if wind gust is occurring
 */
export function isWindGusting(): boolean {
    return Math.random() < currentWind.gustChance;
}

/**
 * Calculate wind effect on shot trajectory
 */
export function calculateWindEffect(shotDistance: number, shotDirection: number): mod.Vector {
    const windRadians = (currentWind.direction * Math.PI) / 180;
    const shotRadians = (shotDirection * Math.PI) / 180;
    
    // Calculate relative wind angle
    const relativeAngle = windRadians - shotRadians;
    
    // Wind effect increases with distance and intensity
    const windForce = currentWind.intensity * (shotDistance / 200) * 10; // Max 10m deviation
    
    // Add gust effect if active
    const gustMultiplier = isWindGusting() ? 1.5 : 1.0;
    
    // Calculate lateral and longitudinal wind effects
    const lateralEffect = Math.sin(relativeAngle) * windForce * gustMultiplier;
    const longitudinalEffect = Math.cos(relativeAngle) * windForce * gustMultiplier * 0.3; // Less effect forward/back
    
    return mod.CreateVector(lateralEffect, 0, longitudinalEffect);
}

///////////////////////////////////////////////////////////////////////////////
// OBSTACLE RANDOMIZATION SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Randomization seed for consistent hazard placement
 */
let randomizationSeed: number = 0;

/**
 * Set randomization seed (for consistent testing)
 */
export function setRandomizationSeed(seed: number): void {
    randomizationSeed = seed;
    Math.random = (() => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    });
}

/**
 * Generate random position within bounds
 */
export function generateRandomPosition(
    center: mod.Vector,
    maxRadius: number,
    minRadius: number = 0
): mod.Vector {
    const angle = Math.random() * Math.PI * 2;
    const radius = minRadius + Math.random() * (maxRadius - minRadius);
    
    return mod.CreateVector(
        center.x + Math.cos(angle) * radius,
        center.y,
        center.z + Math.sin(angle) * radius
    );
}

/**
 * Randomize hazards for a hole
 */
export function randomizeHoleHazards(holeNumber: number): HazardData[] {
    const hole = getCourseHole(holeNumber);
    if (!hole) return [];
    
    const randomizedHazards: HazardData[] = [];
    
    // Set seed based on hole number for consistency
    setRandomizationSeed(holeNumber * 1000 + Date.now() % 1000);
    
    // Process each existing hazard
    for (const hazard of hole.hazards) {
        const config = HAZARD_CONFIGS.get(hazard.type as HazardType);
        
        if (!config || !config.enabled) continue;
        
        // Check if this hazard should appear based on frequency
        if (Math.random() > config.frequency) continue;
        
        let finalHazard = { ...hazard };
        
        // Apply randomization if enabled
        if (config.randomization) {
            // Randomize position around original location
            const randomOffset = generateRandomPosition(mod.CreateVector(0, 0, 0), 30, 5);
            finalHazard.position = mod.CreateVector(
                hazard.position.x + randomOffset.x,
                hazard.position.y,
                hazard.position.z + randomOffset.z
            );
            
            // Randomize radius with intensity modifier
            const radiusVariation = (Math.random() - 0.5) * 10 * config.intensity;
            finalHazard.radius = Math.max(5, hazard.radius + radiusVariation);
        }
        
        // Apply intensity modifier to penalties
        if (finalHazard.penalty) {
            finalHazard.penalty = Math.ceil(finalHazard.penalty * config.intensity);
        }
        
        randomizedHazards.push(finalHazard);
    }
    
    // Add random destructible obstacles
    const destructibleConfig = HAZARD_CONFIGS.get(HazardType.DESTRUCTIBLE);
    if (destructibleConfig && destructibleConfig.enabled && destructibleConfig.randomization) {
        const numDestructibles = Math.floor(Math.random() * 3) + 1; // 1-3 obstacles
        
        for (let i = 0; i < numDestructibles; i++) {
            // Place along fairway
            const fairwayPosition = generateRandomPosition(
                mod.CreateVector(
                    (hole.teePosition.x + hole.greenPosition.x) / 2,
                    hole.teePosition.y,
                    (hole.teePosition.z + hole.greenPosition.z) / 2
                ),
                hole.fairwayWidth / 2,
                10
            );
            
            const destructibleTypes = Object.values(DestructibleType);
            const randomType = destructibleTypes[Math.floor(Math.random() * destructibleTypes.length)];
            
            randomizedHazards.push({
                type: `${HazardType.DESTRUCTIBLE}_${randomType}`,
                position: fairwayPosition,
                radius: 8,
                penalty: 0 // Destructibles don't have stroke penalties
            });
        }
    }
    
    console.log(`[HazardSystem] Randomized ${randomizedHazards.length} hazards for hole ${holeNumber}`);
    
    return randomizedHazards;
}

///////////////////////////////////////////////////////////////////////////////
// HAZARD PENALTY SYSTEM
///////////////////////////////////////////////////////////////////////////////

/**
 * Calculate penalty for hitting a hazard
 */
export function calculateHazardPenalty(hazard: HazardData): number {
    const basePenalty = hazard.penalty || 0;
    
    switch (hazard.type) {
        case HazardType.WATER:
        case HazardType.OUT_OF_BOUNDS:
            return 1; // 1 stroke penalty
            
        case HazardType.SAND:
            return 0; // No stroke penalty, but affects shot difficulty
            
        case HazardType.ROUGH:
            return 0; // No stroke penalty, but reduces distance
            
        case HazardType.DESTRUCTIBLE:
            return 0; // No stroke penalty, can be destroyed
            
        default:
            return basePenalty;
    }
}

/**
 * Get shot difficulty multiplier for hazard
 */
export function getHazardDifficultyMultiplier(hazard: HazardData): number {
    switch (hazard.type) {
        case HazardType.SAND:
            return 0.6; // 40% distance reduction
            
        case HazardType.ROUGH:
            return 0.7; // 30% distance reduction
            
        case HazardType.SMOKE:
            return 0.8; // 20% accuracy reduction
            
        case HazardType.FIRE:
            return 0.9; // 10% accuracy reduction, damage over time
            
        case HazardType.ELECTRIC:
            return 0.85; // 15% equipment interference
            
        default:
            return 1.0; // No effect
    }
}

/**
 * Check if position is within hazard
 */
export function isPositionInHazard(position: mod.Vector, hazard: HazardData): boolean {
    const distance = Math.sqrt(
        Math.pow(position.x - hazard.position.x, 2) +
        Math.pow(position.y - hazard.position.y, 2) +
        Math.pow(position.z - hazard.position.z, 2)
    );
    
    return distance <= hazard.radius;
}

/**
 * Find all hazards affecting a position
 */
export function getHazardsAtPosition(position: mod.Vector, hazards: HazardData[]): HazardData[] {
    return hazards.filter(hazard => isPositionInHazard(position, hazard));
}

/**
 * Get total penalty for hazards at position
 */
export function getTotalPenaltyAtPosition(position: mod.Vector, hazards: HazardData[]): number {
    const affectingHazards = getHazardsAtPosition(position, hazards);
    return affectingHazards.reduce((total, hazard) => total + calculateHazardPenalty(hazard), 0);
}

/**
 * Get total difficulty multiplier for hazards at position
 */
export function getTotalDifficultyMultiplierAtPosition(position: mod.Vector, hazards: HazardData[]): number {
    const affectingHazards = getHazardsAtPosition(position, hazards);
    return affectingHazards.reduce((total, hazard) => total * getHazardDifficultyMultiplier(hazard), 1.0);
}

///////////////////////////////////////////////////////////////////////////////
// DESTRUCTIBLE OBSTACLE MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Active destructible obstacles with their current state
 */
interface ActiveDestructible {
    id: string;
    type: DestructibleType;
    position: mod.Vector;
    health: number;
    maxHealth: number;
    respawnTime: number;
    isDestroyed: boolean;
    destroyTime: number;
}

const activeDestructibles: Map<string, ActiveDestructible> = new Map();

/**
 * Spawn destructible obstacles for current hole
 */
export function spawnDestructibleObstacles(hazards: HazardData[]): void {
    // Clear existing destructibles
    activeDestructibles.clear();
    
    // Spawn new destructibles
    hazards.forEach((hazard, index) => {
        if (hazard.type.startsWith(HazardType.DESTRUCTIBLE + '_')) {
            const typeStr = hazard.type.replace(HazardType.DESTRUCTIBLE + '_', '') as DestructibleType;
            const properties = DESTRUCTIBLE_PROPERTIES.get(typeStr);
            
            if (properties) {
                const id = `destructible_${index}`;
                const destructible: ActiveDestructible = {
                    id,
                    type: typeStr,
                    position: hazard.position,
                    health: properties.health,
                    maxHealth: properties.health,
                    respawnTime: properties.respawnTime,
                    isDestroyed: false,
                    destroyTime: 0
                };
                
                activeDestructibles.set(id, destructible);
                
                // Create actual game object (placeholder for SDK integration)
                // TODO: Create actual destructible object in game world
                console.log(`[HazardSystem] Spawned ${typeStr} at position (${hazard.position.x.toFixed(1)}, ${hazard.position.z.toFixed(1)})`);
            }
        }
    });
}

/**
 * Damage a destructible obstacle
 */
export function damageDestructible(id: string, damage: number): boolean {
    const destructible = activeDestructibles.get(id);
    if (!destructible || destructible.isDestroyed) return false;
    
    destructible.health -= damage;
    
    if (destructible.health <= 0) {
        destroyDestructible(id);
        return true;
    }
    
    return false;
}

/**
 * Destroy a destructible obstacle
 */
export function destroyDestructible(id: string): void {
    const destructible = activeDestructibles.get(id);
    if (!destructible || destructible.isDestroyed) return;
    
    destructible.isDestroyed = true;
    destructible.destroyTime = Date.now();
    
    const properties = DESTRUCTIBLE_PROPERTIES.get(destructible.type);
    if (properties) {
        // Create explosion effect
        // TODO: Create actual explosion in game world
        console.log(`[HazardSystem] Destroyed ${destructible.type} with explosion radius ${properties.explosionRadius}m`);
        
        // Award points to nearby players
        // TODO: Award points to players who contributed to destruction
    }
}

/**
 * Update destructible obstacles (respawn timers)
 */
export function updateDestructibles(deltaTime: number): void {
    const currentTime = Date.now();
    
    activeDestructibles.forEach(destructible => {
        if (destructible.isDestroyed) {
            const timeSinceDestroy = (currentTime - destructible.destroyTime) / 1000;
            
            if (timeSinceDestroy >= destructible.respawnTime) {
                // Respawn destructible
                destructible.isDestroyed = false;
                destructible.health = destructible.maxHealth;
                destructible.destroyTime = 0;
                
                // TODO: Respawn object in game world
                console.log(`[HazardSystem] Respawned ${destructible.type}`);
            }
        }
    });
}

/**
 * Get all active destructibles
 */
export function getActiveDestructibles(): ActiveDestructible[] {
    return Array.from(activeDestructibles.values());
}

/**
 * Get destructibles near position
 */
export function getDestructiblesNearPosition(position: mod.Vector, radius: number): ActiveDestructible[] {
    return getActiveDestructibles().filter(destructible => {
        if (destructible.isDestroyed) return false;
        
        const distance = Math.sqrt(
            Math.pow(position.x - destructible.position.x, 2) +
            Math.pow(position.y - destructible.position.y, 2) +
            Math.pow(position.z - destructible.position.z, 2)
        );
        
        return distance <= radius;
    });
}

///////////////////////////////////////////////////////////////////////////////
// HAZARD SYSTEM INITIALIZATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize hazard system for a new hole
 */
export function initializeHazardSystem(holeNumber: number): void {
    console.log(`[HazardSystem] Initializing hazard system for hole ${holeNumber}`);
    
    // Initialize wind system
    initializeWind();
    
    // Get randomized hazards for this hole
    const randomizedHazards = randomizeHoleHazards(holeNumber);
    
    // Spawn destructible obstacles
    spawnDestructibleObstacles(randomizedHazards);
    
    console.log(`[HazardSystem] Hazard system initialized with ${randomizedHazards.length} hazards`);
}

/**
 * Update hazard system (called from main update loop)
 */
export function updateHazardSystem(deltaTime: number): void {
    // Update wind system
    updateWind(deltaTime);
    
    // Update destructible obstacles
    updateDestructibles(deltaTime);
}

/**
 * Clean up hazard system
 */
export function cleanupHazardSystem(): void {
    activeDestructibles.clear();
    currentWind = {
        direction: 0,
        intensity: 0,
        gustChance: 0,
        variation: 0
    };
    windUpdateTimer = 0;
    
    console.log('[HazardSystem] Hazard system cleaned up');
}