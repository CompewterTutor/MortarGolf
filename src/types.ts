/**
 * Type Definitions
 * 
 * All custom types, interfaces, and enums used throughout the mod.
 */

export type Widget = mod.UIWidget;
export type Dict = { [key: string]: any };

///////////////////////////////////////////////////////////////////////////////
// GAME STATE ENUMS
///////////////////////////////////////////////////////////////////////////////

/**
 * Main game state machine
 * - Lobby: Waiting for players, matchmaking
 * - TeeTime: Players scheduled to start, countdown to first hole
 * - Countdown: Pre-hole countdown (e.g., "Hole 1 starting in 3...")
 * - Playing: Active hole in progress
 * - Shopping: Between-hole shop phase
 * - RoundEnd: Hole completed, showing scores
 * - GameOver: All holes completed, final results
 */
export enum GameState {
    Lobby,
    TeeTime,
    Countdown,
    Playing,
    Shopping,
    RoundEnd,
    GameOver
}

/**
 * Phase within a single hole
 * - Teeoff: Player at tee box, preparing initial drive
 * - Fairway: Player navigating course, taking subsequent shots
 * - Putting: Player on green, using dart putting mechanic
 * - Complete: Player has holed out
 */
export enum HolePhase {
    Teeoff,
    Fairway,
    Putting,
    Complete
}

/**
 * Player role in the game
 * - Golfer: Main player attempting to complete holes
 * - Caddy: Support player defending and reviving golfer
 * - Spectator: Observer, not actively playing
 */
export enum PlayerRole {
    Golfer,
    Caddy,
    Spectator
}

/**
 * Shop item categories
 */
export enum ShopCategory {
    Weapons,
    Ammo,
    Armor,
    Gadgets,
    Buffs,
    Carts
}

/**
 * Club types for shot selection
 */
export enum ClubType {
    Driver,    // Long distance, low arc
    Iron,      // Medium distance, medium arc
    Wedge,     // Short distance, high arc
    Putter     // On green, dart mechanic
}

///////////////////////////////////////////////////////////////////////////////
// GOLF DATA TYPES
///////////////////////////////////////////////////////////////////////////////

/**
 * Data for a single hole on the course
 */
export interface HoleData {
    number: number;                    // Hole number (1-9 or 1-18)
    par: number;                       // Expected number of strokes
    distance: number;                  // Total distance from tee to pin (meters)
    teePosition: mod.Vector;           // Starting position
    greenPosition: mod.Vector;         // Pin/flag position
    greenRadius: number;               // Radius of putting green
    fairwayWidth: number;              // Width of fairway
    hazards: HazardData[];            // Obstacles on this hole
    name?: string;                     // Optional hole name
}

/**
 * Hazard/obstacle data
 */
export interface HazardData {
    type: string;                      // 'destructible', 'water', 'sand', 'rough', 'oob'
    position: mod.Vector;              // Location
    radius: number;                    // Area of effect
    penalty?: number;                  // Stroke penalty (if applicable)
}

/**
 * Data for a single shot
 */
export interface ShotData {
    power: number;                     // Shot power (0.0 - 1.0)
    direction: number;                 // Angle in degrees (0-360)
    launchAngle: number;              // Vertical angle (0-90)
    spin: number;                      // Hook/slice (-1.0 to 1.0)
    backspin: number;                 // Backspin amount (0.0 - 1.0)
    club: ClubType;                   // Club used for the shot
}

/**
 * Score data for a player on a hole
 */
export interface ScoreData {
    strokes: number;                   // Total strokes taken
    timeSeconds: number;               // Time taken to complete hole
    parDelta: number;                 // Score relative to par (-3 to +3, etc.)
    moneyEarned: number;              // Currency earned this hole
    kills: number;                    // Combat kills
    deaths: number;                   // Times downed/killed
    holedOut: boolean;                // Whether hole was completed
}

/**
 * Full player statistics for the round
 */
export interface PlayerStats {
    totalStrokes: number;
    totalTime: number;
    totalMoney: number;
    totalKills: number;
    totalDeaths: number;
    holesCompleted: number;
    birdies: number;
    eagles: number;
    aces: number;
    bogeys: number;
}

///////////////////////////////////////////////////////////////////////////////
// EXTENDED PLAYER TYPE
///////////////////////////////////////////////////////////////////////////////

/**
 * Extended player class for MortarGolf
 * Extends the base JsPlayer pattern with golf-specific properties
 */
export interface GolfPlayer {
    player: mod.Player;                // Base player reference
    role: PlayerRole;                  // Golfer, Caddy, or Spectator
    teamId: number;                    // Team ID
    caddyPlayer: mod.Player | null;    // Assigned caddy (if golfer)
    golferPlayer: mod.Player | null;   // Assigned golfer (if caddy)
    
    // Current state
    currentHole: number;               // Current hole number (1-9)
    holePhase: HolePhase;             // Current phase of hole
    shotCount: number;                // Shots taken on current hole
    currentLie: string;               // 'tee', 'fairway', 'rough', 'green', 'oob'
    
    // Scoring
    holeScores: ScoreData[];          // Score for each hole
    stats: PlayerStats;               // Cumulative statistics
    money: number;                    // Current money balance
    
    // UI Elements
    widgets: Widget[];                // UI widgets for cleanup
    
    // Shot data
    lastShotPosition: mod.Vector | null;  // Position of last shot
    ballPosition: mod.Vector | null;      // Current ball position
    distanceToPin: number;            // Distance remaining to hole
}
