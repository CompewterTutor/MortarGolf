/**
 * Constants
 * 
 * All game configuration constants, IDs, timings, colors, and vectors.
 */

declare global {
    const mod: any;
}

import { HoleData } from './types';

///////////////////////////////////////////////////////////////////////////////
// VERSION & DEBUG FLAGS
///////////////////////////////////////////////////////////////////////////////

export const VERSION = [0, 1, 0]; // [major, minor, patch]
export const debugJSPlayer = true;
export const debugMode = true; // DISABLE BEFORE SHARING

///////////////////////////////////////////////////////////////////////////////
// PLAYER REQUIREMENTS
///////////////////////////////////////////////////////////////////////////////

export const minimumPlayers: number = 1;       // For testing
export const minimumInitialPlayerCount: number = 1; // For testing (alias)
export const maximumPlayers: number = 32;      // Max server capacity
export const playersPerFoursome: number = 4;   // Max in a group (2 golfers + 2 caddies)
export const combatStartDelaySeconds: number = 30;

///////////////////////////////////////////////////////////////////////////////
// COURSE CONFIGURATION
///////////////////////////////////////////////////////////////////////////////

export const totalHoles: number = 9;           // 9-hole course
export const defaultPar: number = 4;           // Default par if not specified

/**
 * FIRESTORM GOLF COURSE - 9 Holes
 * 
 * A challenging 9-hole course designed around the Firestorm map.
 * 
 * Course Layout:
 * - Par 3s: Holes 3, 6, 8 (short, precision holes)
 * - Par 4s: Holes 1, 2, 4, 7 (medium, strategic holes)
 * - Par 5s: Holes 5, 9 (long, risk/reward holes)
 * Total Par: 36
 * 
 * NOTE: Coordinates are placeholders and will be updated once the Godot
 * level is created with actual trigger placements. These represent approximate
 * positions across the Firestorm map to create varied hole layouts.
 */
export const COURSE_HOLES: HoleData[] = [
    // Hole 1: Par 4, 180m - Gentle start, wide fairway
    {
        number: 1,
        par: 4,
        distance: 180,
        teePosition: mod.CreateVector(100, 100, 50),
        greenPosition: mod.CreateVector(280, 100, 52),
        greenRadius: 15,
        fairwayWidth: 40,
        hazards: [
            { type: 'rough', position: mod.CreateVector(190, 80, 50), radius: 20 },
            { type: 'rough', position: mod.CreateVector(190, 120, 50), radius: 20 }
        ],
        name: "The Opening Drive"
    },
    
    // Hole 2: Par 4, 200m - Slight dogleg right with obstacles
    {
        number: 2,
        par: 4,
        distance: 200,
        teePosition: mod.CreateVector(300, 110, 52),
        greenPosition: mod.CreateVector(450, 200, 55),
        greenRadius: 15,
        fairwayWidth: 35,
        hazards: [
            { type: 'destructible', position: mod.CreateVector(375, 155, 53), radius: 10 },
            { type: 'rough', position: mod.CreateVector(420, 180, 54), radius: 25 }
        ],
        name: "Dogleg Danger"
    },
    
    // Hole 3: Par 3, 120m - Short precision shot over hazards
    {
        number: 3,
        par: 3,
        distance: 120,
        teePosition: mod.CreateVector(470, 220, 55),
        greenPosition: mod.CreateVector(590, 220, 58),
        greenRadius: 12,
        fairwayWidth: 25,
        hazards: [
            { type: 'sand', position: mod.CreateVector(530, 210, 56), radius: 15 },
            { type: 'sand', position: mod.CreateVector(530, 230, 56), radius: 15 },
            { type: 'rough', position: mod.CreateVector(580, 205, 57), radius: 10 }
        ],
        name: "Island Green"
    },
    
    // Hole 4: Par 4, 210m - Open but elevated green
    {
        number: 4,
        par: 4,
        distance: 210,
        teePosition: mod.CreateVector(610, 230, 58),
        greenPosition: mod.CreateVector(750, 350, 70),
        greenRadius: 15,
        fairwayWidth: 40,
        hazards: [
            { type: 'destructible', position: mod.CreateVector(680, 290, 64), radius: 12 },
            { type: 'rough', position: mod.CreateVector(730, 330, 68), radius: 20 }
        ],
        name: "High Ground"
    },
    
    // Hole 5: Par 5, 280m - Long hole with multiple hazards (risk/reward)
    {
        number: 5,
        par: 5,
        distance: 280,
        teePosition: mod.CreateVector(770, 370, 70),
        greenPosition: mod.CreateVector(900, 620, 65),
        greenRadius: 18,
        fairwayWidth: 45,
        hazards: [
            { type: 'destructible', position: mod.CreateVector(835, 495, 68), radius: 15 },
            { type: 'rough', position: mod.CreateVector(870, 570, 66), radius: 30 },
            { type: 'sand', position: mod.CreateVector(890, 600, 65), radius: 18 }
        ],
        name: "The Gauntlet"
    },
    
    // Hole 6: Par 3, 95m - Very short but heavily guarded
    {
        number: 6,
        par: 3,
        distance: 95,
        teePosition: mod.CreateVector(920, 640, 65),
        greenPosition: mod.CreateVector(1015, 640, 68),
        greenRadius: 10,
        fairwayWidth: 20,
        hazards: [
            { type: 'sand', position: mod.CreateVector(970, 630, 66), radius: 12 },
            { type: 'sand', position: mod.CreateVector(970, 650, 66), radius: 12 },
            { type: 'sand', position: mod.CreateVector(1005, 625, 67), radius: 10 },
            { type: 'sand', position: mod.CreateVector(1005, 655, 67), radius: 10 }
        ],
        name: "Bunker Hell"
    },
    
    // Hole 7: Par 4, 190m - Narrow fairway requires accuracy
    {
        number: 7,
        par: 4,
        distance: 190,
        teePosition: mod.CreateVector(1030, 650, 68),
        greenPosition: mod.CreateVector(1180, 750, 62),
        greenRadius: 14,
        fairwayWidth: 28,
        hazards: [
            { type: 'rough', position: mod.CreateVector(1105, 685, 65), radius: 25 },
            { type: 'rough', position: mod.CreateVector(1105, 715, 65), radius: 25 },
            { type: 'destructible', position: mod.CreateVector(1155, 735, 63), radius: 10 }
        ],
        name: "Tight Squeeze"
    },
    
    // Hole 8: Par 3, 140m - Mid-range par 3, elevated tee
    {
        number: 8,
        par: 3,
        distance: 140,
        teePosition: mod.CreateVector(1200, 770, 75),
        greenPosition: mod.CreateVector(1330, 810, 60),
        greenRadius: 13,
        fairwayWidth: 30,
        hazards: [
            { type: 'rough', position: mod.CreateVector(1265, 790, 68), radius: 20 },
            { type: 'sand', position: mod.CreateVector(1315, 800, 61), radius: 15 }
        ],
        name: "The Drop"
    },
    
    // Hole 9: Par 5, 300m - Dramatic finishing hole, longest on course
    {
        number: 9,
        par: 5,
        distance: 300,
        teePosition: mod.CreateVector(1350, 820, 60),
        greenPosition: mod.CreateVector(1550, 520, 58),
        greenRadius: 20,
        fairwayWidth: 50,
        hazards: [
            { type: 'destructible', position: mod.CreateVector(1450, 670, 59), radius: 18 },
            { type: 'rough', position: mod.CreateVector(1500, 590, 58), radius: 35 },
            { type: 'sand', position: mod.CreateVector(1535, 510, 58), radius: 20 },
            { type: 'sand', position: mod.CreateVector(1535, 530, 58), radius: 20 }
        ],
        name: "Championship Finish"
    }
];

// Course statistics
export const COURSE_TOTAL_PAR: number = 36;        // Sum of all pars
export const COURSE_TOTAL_DISTANCE: number = 1815; // Sum of all distances
export const COURSE_PAR_3_COUNT: number = 3;       // Holes 3, 6, 8
export const COURSE_PAR_4_COUNT: number = 4;       // Holes 1, 2, 4, 7
export const COURSE_PAR_5_COUNT: number = 2;       // Holes 5, 9

///////////////////////////////////////////////////////////////////////////////
// GOLF SCORING CONSTANTS
///////////////////////////////////////////////////////////////////////////////

export const POINTS_ACE: number = 1000;        // Hole in one
export const POINTS_EAGLE: number = 500;       // 2 under par
export const POINTS_BIRDIE: number = 200;      // 1 under par
export const POINTS_PAR: number = 100;         // On par
export const POINTS_BOGEY: number = 50;        // 1 over par
export const POINTS_DOUBLE_BOGEY: number = 25; // 2 over par

export const MONEY_PER_POINT: number = 1;      // Base money multiplier
export const MONEY_TIME_BONUS: number = 50;    // Bonus for fast completion
export const MONEY_KILL_BONUS: number = 25;    // Bonus per kill

export const PENALTY_DEATH: number = 1;        // +1 stroke on death
export const PENALTY_OOB: number = 1;          // +1 stroke out of bounds
export const PENALTY_WATER: number = 1;        // +1 stroke in water

///////////////////////////////////////////////////////////////////////////////
// SHOT MECHANICS CONSTANTS
///////////////////////////////////////////////////////////////////////////////

export const SHOT_TIMEOUT: number = 60;        // Seconds to take a shot
export const PUTT_TIMEOUT: number = 30;        // Seconds to putt
export const SHOT_METER_SPEED: number = 1.0;   // Speed of power meter

// Club distance modifiers (meters at full power)
export const DRIVER_DISTANCE: number = 250;
export const IRON_DISTANCE: number = 150;
export const WEDGE_DISTANCE: number = 80;
export const PUTTER_DISTANCE: number = 20;

// Launch angle settings (degrees)
export const MIN_LAUNCH_ANGLE: number = 10;
export const MAX_LAUNCH_ANGLE: number = 80;
export const DEFAULT_LAUNCH_ANGLE: number = 45;

// Lie effect multipliers
export const TEE_MULTIPLIER: number = 1.1;     // 10% bonus on tee
export const FAIRWAY_MULTIPLIER: number = 1.0; // Normal
export const ROUGH_MULTIPLIER: number = 0.7;   // 30% penalty
export const SAND_MULTIPLIER: number = 0.5;    // 50% penalty

///////////////////////////////////////////////////////////////////////////////
// PHYSICS CONSTANTS
///////////////////////////////////////////////////////////////////////////////

export const MORTAR_BASE_VELOCITY: number = 100;    // Base projectile speed
export const GRAVITY_MODIFIER: number = 1.0;        // Gravity multiplier
export const WIND_MAX_EFFECT: number = 0.2;        // Max wind influence
export const SPIN_MAX_EFFECT: number = 15;         // Max spin deviation (degrees)

///////////////////////////////////////////////////////////////////////////////
// SHOP SYSTEM CONSTANTS
///////////////////////////////////////////////////////////////////////////////

export const SHOP_DURATION: number = 30;           // Seconds shop is open
export const SHOP_ITEMS_PER_CATEGORY: number = 3;  // Items shown per category

// Starting loadout prices
export const PRICE_BASIC_WEAPON: number = 0;       // Free starter
export const PRICE_ADVANCED_WEAPON: number = 200;
export const PRICE_ELITE_WEAPON: number = 500;
export const PRICE_AMMO: number = 50;
export const PRICE_ARMOR_LIGHT: number = 100;
export const PRICE_ARMOR_HEAVY: number = 300;
export const PRICE_GADGET_BASIC: number = 150;
export const PRICE_GADGET_ADVANCED: number = 400;
export const PRICE_CART_UPGRADE: number = 250;
export const PRICE_BUFF_TEMPORARY: number = 100;

///////////////////////////////////////////////////////////////////////////////
// TIMINGS
///////////////////////////////////////////////////////////////////////////////

export const tickRate: number = 0.016;         // 60fps
export const slowTickRate: number = 1;         // 1 second
export const messageDisplayTime: number = 5;   // Message duration

export const LOBBY_COUNTDOWN_SECONDS: number = 10;     // Wait for players in lobby
export const TEE_TIME_COUNTDOWN_SECONDS: number = 30; // Time to reach tee box
export const COMBAT_COUNTDOWN_SECONDS: number = 5;   // Countdown before playing starts
export const ROUND_END_DISPLAY_SECONDS: number = 10; // Display scores after hole
export const GAME_OVER_DELAY: number = 20;          // Delay at end of game

// Shot system timing
export const SHOT_TIMER_SECONDS: number = 30;       // Time to take shot
export const SHOT_ANIMATION_SECONDS: number = 2.0;  // Shot animation duration
export const SHOT_RESULT_DISPLAY_SECONDS: number = 3; // Show shot result

export const REVIVE_TIME: number = 5;          // Seconds to revive
export const RESPAWN_DELAY: number = 10;       // Respawn after caddy death

///////////////////////////////////////////////////////////////////////////////
// OBJECT IDS (assigned in Godot)
///////////////////////////////////////////////////////////////////////////////

// These will be updated once the Godot level is created
export const mainHQID: number = 1;
export const capturePointID: number = 1;
export const interactPointID: number = 1;

// Tee box area trigger IDs (holes 1-9)
export const teeBoxIDs: number[] = [10, 11, 12, 13, 14, 15, 16, 17, 18];

// Green area trigger IDs (holes 1-9)
export const greenIDs: number[] = [20, 21, 22, 23, 24, 25, 26, 27, 28];

// Shop location IDs
export const shopID: number = 100;
export const proShopID: number = 101;
export const drivingRangeID: number = 102;

///////////////////////////////////////////////////////////////////////////////
// COLORS (for UI)
///////////////////////////////////////////////////////////////////////////////

export const COLOR_BLACK: number[] = [0, 0, 0];
export const COLOR_WHITE: number[] = [1, 1, 1];
export const COLOR_RED: number[] = [1, 0, 0];
export const COLOR_GREEN: number[] = [0, 1, 0];
export const COLOR_BLUE: number[] = [0, 0, 1];
export const COLOR_YELLOW: number[] = [1, 1, 0];
export const COLOR_ORANGE: number[] = [1, 0.5, 0];
export const COLOR_PURPLE: number[] = [0.5, 0, 0.5];
export const COLOR_CYAN: number[] = [0, 1, 1];

// Team colors
export const COLOR_TEAM_RED: number[] = [0.8, 0.1, 0.1];
export const COLOR_TEAM_BLUE: number[] = [0.1, 0.3, 0.8];
export const COLOR_TEAM_GREEN: number[] = [0.1, 0.6, 0.1];
export const COLOR_TEAM_YELLOW: number[] = [0.9, 0.9, 0.1];

// UI element colors
export const COLOR_UI_BG: number[] = [0.1, 0.1, 0.1];
export const COLOR_UI_BG_DARK: number[] = [0.05, 0.05, 0.05];
export const COLOR_UI_TEXT: number[] = [0.9, 0.9, 0.9];
export const COLOR_UI_HIGHLIGHT: number[] = [0.2, 0.6, 1.0];
export const COLOR_UI_SUCCESS: number[] = [0.2, 0.8, 0.2];
export const COLOR_UI_WARNING: number[] = [1.0, 0.6, 0.0];
export const COLOR_UI_DANGER: number[] = [0.9, 0.2, 0.2];

///////////////////////////////////////////////////////////////////////////////
// VECTORS
///////////////////////////////////////////////////////////////////////////////

export const ZEROVEC: any = mod.CreateVector(0, 0, 0);
export const ONEVEC: any = mod.CreateVector(1, 1, 1);
export const UPVEC: any = mod.CreateVector(0, 0, 1);
