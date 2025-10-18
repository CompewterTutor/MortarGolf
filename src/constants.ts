/**
 * Constants
 * 
 * All game configuration constants, IDs, timings, colors, and vectors.
 */

///////////////////////////////////////////////////////////////////////////////
// VERSION & DEBUG FLAGS
///////////////////////////////////////////////////////////////////////////////

export const VERSION = [0, 0, 3]; // [major, minor, patch]
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

export const LOBBY_WAIT_TIME: number = 10;     // Wait for players in lobby
export const HOLE_COUNTDOWN: number = 5;       // Countdown before hole starts
export const ROUND_END_DELAY: number = 10;     // Delay before next hole
export const GAME_OVER_DELAY: number = 20;     // Delay at end of game

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

export const ZEROVEC: mod.Vector = mod.CreateVector(0, 0, 0);
export const ONEVEC: mod.Vector = mod.CreateVector(1, 1, 1);
export const UPVEC: mod.Vector = mod.CreateVector(0, 0, 1);
