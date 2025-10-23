/**
 * Event Handlers
 * 
 * All exported event handler functions that BF6 Portal calls.
 */

import { VERSION, minimumInitialPlayerCount, mainHQID, interactPointID } from './constants';
import { 
    initialPlayerCount, 
    combatStarted, 
    incrementInitialPlayerCount,
    decrementInitialPlayerCount,
    setGameOver,
    combatStartDelayRemaining
} from './state';
import { GolfPlayer } from './player';
import { HideAllMessageUI, UpdateAllLobbyUI } from './messages';
import { CombatCountdown } from './gameflow';
import { TickUpdate, ThrottledUpdate } from './updates';
import * as stateMachine from './statemachine';
import { MatchmakingQueue } from './matchmaking';
import { PlayerRole, HolePhase } from './types';
import { initializeCourseObjects } from './courseobjects';
import { initializeCourse } from './course';
import { initializeHazardSystem, updateHazardSystem, cleanupHazardSystem } from './hazards';
import { getCurrentHoleNumber } from './state';

///////////////////////////////////////////////////////////////////////////////
// EXPORTED EVENT HANDLERS
///////////////////////////////////////////////////////////////////////////////

/**
 * Called once when the game mode starts
 */
export async function OnGameModeStarted(): Promise<void> {
    console.log("Game Mode Started - Version", VERSION[0], ".", VERSION[1], ".", VERSION[2]);
    
    // 1. Initialize state machine
    stateMachine.initializeStateMachine();
    
    // 2. Initialize course system
    initializeCourse();
    
    // 3. Initialize course objects
    initializeCourseObjects();
    
    // 4. Initialize hazard system for first hole
    initializeHazardSystem(1);
    
    // 4. Configure game settings
    mod.SetFriendlyFire(false);
    mod.SetSpawnMode(mod.SpawnModes.AutoSpawn);
    
    // 5. Setup game objects (HQs, objectives, etc.)
    let mainHQ = mod.GetHQ(mainHQID);
    mod.EnableHQ(mainHQ, true);
    
    // 6. Begin update loops (these run continuously)
    TickUpdate();
    ThrottledUpdate();
    
    // 7. Display welcome message
    mod.DisplayHighlightedWorldLogMessage(
        mod.Message("welcomeMessage")
    );
    
    console.log("MortarGolf initialized - waiting for players...");
}

/**
 * Called when game mode is ending
 */
export function OnGameModeEnding(): void {
    setGameOver(true);
    HideAllMessageUI();
    
    // Clean up hazard system
    cleanupHazardSystem();
    
    console.log("Game Mode Ending");
}

/**
 * Called every game tick
 */
export function OngoingGlobal(): void {
    // Use sparingly - this is called every frame
    // Prefer using async update loops instead
}

/**
 * Called when a player joins the game
 */
export async function OnPlayerJoinGame(player: mod.Player): Promise<void> {
    await mod.Wait(0.1); // Small delay for initialization
    
    let golfPlayer = GolfPlayer.get(player);
    if (!golfPlayer) return;
    
    // Check if human player
    if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
        // Add to matchmaking queue
        MatchmakingQueue.addPlayer(player, PlayerRole.Golfer);
        
        // Show lobby UI if in lobby
        if (stateMachine.isInLobby() || stateMachine.isInTeeTime()) {
            golfPlayer.lobbyUI?.open();
            incrementInitialPlayerCount();
            console.log("Player joined. Total:", initialPlayerCount);
            UpdateAllLobbyUI();
        }
        
        // Display welcome message to player
        mod.DisplayNotificationMessage(
            mod.Message("welcomeMessage"),
            player
        );
    }
}

/**
 * Called when a player leaves the game
 */
export async function OnPlayerLeaveGame(playerId: number): Promise<void> {
    // Get player before removing
    const allPlayers = GolfPlayer.getAll();
    const leavingPlayer = allPlayers.find(gp => mod.GetObjId(gp.player) === playerId);
    
    // Remove from matchmaking queue
    if (leavingPlayer) {
        MatchmakingQueue.removePlayer(leavingPlayer.player);
    }
    
    // Clean up player instance
    GolfPlayer.removeInvalidJSPlayers(playerId);
    
    if (!combatStarted) {
        decrementInitialPlayerCount();
        UpdateAllLobbyUI();
    }
}

/**
 * Called when a player deploys into the game
 */
export function OnPlayerDeployed(eventPlayer: mod.Player): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    golfPlayer.isDeployed = true;
    
    // Setup player based on role and game state
    if (stateMachine.isPlaying()) {
        // Spawn at appropriate location based on role
        if (golfPlayer.role === PlayerRole.Golfer) {
            // Spawn at ball/shot location
        } else if (golfPlayer.role === PlayerRole.Caddy) {
            // Spawn near golfer
        }
    }
}

/**
 * Called when a player undeploys
 */
export function OnPlayerUndeploy(eventPlayer: mod.Player): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    golfPlayer.isDeployed = false;
}

/**
 * Called when a player dies
 */
export function OnPlayerDied(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    golfPlayer.deaths++;
    golfPlayer.stats.totalDeaths++;
    
    // Apply death penalty if during playing
    if (stateMachine.isPlaying() && golfPlayer.role === PlayerRole.Golfer) {
        golfPlayer.shotCount++; // +1 stroke penalty
        
        mod.DisplayNotificationMessage(
            mod.Message("playerDowned"),
            eventPlayer
        );
    }
}

/**
 * Called when a player earns a kill
 */
export function OnPlayerEarnedKill(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDeathType: mod.DeathType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    // Skip redeploy "kills"
    if (mod.EventDeathTypeCompare(eventDeathType, mod.PlayerDeathTypes.Redeploy)) {
        return;
    }
    
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    golfPlayer.score++;
    golfPlayer.stats.totalKills++;
}

/**
 * Called when a player takes damage
 */
export function OnPlayerDamaged(
    eventPlayer: mod.Player,
    eventOtherPlayer: mod.Player,
    eventDamageType: mod.DamageType,
    eventWeaponUnlock: mod.WeaponUnlock
): void {
    // Custom damage modifiers based on game state
    // - Reduce damage during shot setup?
    // - Increase damage in certain areas?
}

/**
 * Called when a player interacts with an interact point
 */
export async function OnPlayerInteract(
    player: mod.Player,
    interactPoint: mod.InteractPoint
): Promise<void> {
    let id = mod.GetObjId(interactPoint);
    let golfPlayer = GolfPlayer.get(player);
    if (!golfPlayer) return;
    
    // Switch on interact point ID
    switch (id) {
        case interactPointID:
            // Handle interaction (shop, tee box, etc.)
            console.log("Player interacted with object:", id);
            break;
        
        default:
            console.log("Unknown interact point:", id);
    }
}

/**
 * Called when a player switches teams
 */
export function OnPlayerSwitchTeam(
    eventPlayer: mod.Player,
    eventTeam: mod.Team
): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (golfPlayer) {
        golfPlayer.teamId = mod.GetObjId(eventTeam);
        console.log("Player switched to team:", golfPlayer.teamId);
    }
}

/**
 * Called when a player enters an area trigger
 */
export function OnPlayerEnterAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    // Get the trigger ID to identify which zone was entered
    const triggerId = mod.GetObjId(eventAreaTrigger);
    
    // Determine which hole and zone type this trigger belongs to
    const zoneInfo = identifyTriggerZone(triggerId);
    if (!zoneInfo) return;
    
    console.log(`Player ${mod.GetPlayerName(eventPlayer)} entered ${zoneInfo.zoneType} on hole ${zoneInfo.holeNumber}`);
    
    // Handle zone-specific logic
    switch (zoneInfo.zoneType) {
        case 'tee':
            handleTeeBoxEntry(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'green':
            handleGreenEntry(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'fairway':
            handleFairwayEntry(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'rough':
            handleRoughEntry(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'oob':
            handleOutOfBoundsEntry(golfPlayer, zoneInfo.holeNumber);
            break;
    }
}

/**
 * Called when a player exits an area trigger
 */
export function OnPlayerExitAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let golfPlayer = GolfPlayer.get(eventPlayer);
    if (!golfPlayer) return;
    
    // Get the trigger ID to identify which zone was exited
    const triggerId = mod.GetObjId(eventAreaTrigger);
    
    // Determine which hole and zone type this trigger belongs to
    const zoneInfo = identifyTriggerZone(triggerId);
    if (!zoneInfo) return;
    
    console.log(`Player ${mod.GetPlayerName(eventPlayer)} exited ${zoneInfo.zoneType} on hole ${zoneInfo.holeNumber}`);
    
    // Handle zone-specific exit logic
    switch (zoneInfo.zoneType) {
        case 'tee':
            handleTeeBoxExit(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'green':
            handleGreenExit(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'fairway':
            handleFairwayExit(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'rough':
            handleRoughExit(golfPlayer, zoneInfo.holeNumber);
            break;
        case 'oob':
            handleOutOfBoundsExit(golfPlayer, zoneInfo.holeNumber);
            break;
    }
}

/**
 * Called when a player enters a capture point
 */
export function OnPlayerEnterCapturePoint(
    eventPlayer: mod.Player,
    eventCapturePoint: mod.CapturePoint
): void {
    // Handle capture point entry (if used for mechanics)
}

/**
 * Called when a player exits a capture point
 */
export function OnPlayerExitCapturePoint(
    eventPlayer: mod.Player,
    eventCapturePoint: mod.CapturePoint
): void {
    // Handle capture point exit
}

/**
 * Called when a capture point is being captured
 */
export function OnCapturePointCapturing(
    eventCapturePoint: mod.CapturePoint
): void {
    // Display capture progress (if used)
}

/**
 * Called when a capture point is captured
 */
export function OnCapturePointCaptured(
    eventCapturePoint: mod.CapturePoint
): void {
    let ownerTeam = mod.GetCurrentOwnerTeam(eventCapturePoint);
    console.log("Point captured by team:", mod.GetObjId(ownerTeam));
}

/**
 * Called when a vehicle spawns
 */
export async function OnVehicleSpawned(eventVehicle: mod.Vehicle): Promise<void> {
    // Handle vehicle spawn - golf carts
    // - Set vehicle properties
    // - Assign to players
}

/**
 * Called when a vehicle is destroyed
 */
export function OnVehicleDestroyed(
    eventVehicle: mod.Vehicle,
    eventPlayer: mod.Player
): void {
    // Handle vehicle destruction - golf cart destroyed
}

/**
 * Called when a UI button is pressed
 */
export function OnPlayerUIButtonEvent(
    player: mod.Player,
    widget: mod.UIWidget,
    event: mod.UIButtonEvent
): void {
    let golfPlayer = GolfPlayer.get(player);
    if (!golfPlayer) return;
    
    // Handle button events based on game state
    // - Shop purchases
    // - Menu navigation
    // - Club selection
    // - Shot confirmation
}

///////////////////////////////////////////////////////////////////////////////
// AREA TRIGGER EVENT HANDLERS
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
// ZONE HANDLING FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Identify which hole and zone type a trigger belongs to
 */
interface TriggerZoneInfo {
    holeNumber: number;
    zoneType: 'tee' | 'green' | 'fairway' | 'rough' | 'oob';
}

function identifyTriggerZone(triggerId: number): TriggerZoneInfo | null {
    // Check if this trigger belongs to a hole zone
    if (triggerId >= 1000 && triggerId <= 1045) {
        // Calculate hole number (1-9)
        const holeNumber = Math.floor((triggerId - 1000) % 10) + 1;
        
        // Determine zone type based on ID range
        if (triggerId >= 1000 && triggerId <= 1008) {
            return { holeNumber, zoneType: 'tee' };
        } else if (triggerId >= 1010 && triggerId <= 1018) {
            return { holeNumber, zoneType: 'green' };
        } else if (triggerId >= 1019 && triggerId <= 1027) {
            return { holeNumber, zoneType: 'fairway' };
        } else if (triggerId >= 1028 && triggerId <= 1036) {
            return { holeNumber, zoneType: 'rough' };
        } else if (triggerId >= 1037 && triggerId <= 1045) {
            return { holeNumber, zoneType: 'oob' };
        }
    }
    
    return null;
}

/**
 * Handle player entering tee box
 */
function handleTeeBoxEntry(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Check if this is the current hole
    const currentHole = getCurrentHoleNumber();
    if (holeNumber !== currentHole) return;
    
    // Set player's current hole if not already set
    if (golfPlayer.currentHole !== holeNumber) {
        golfPlayer.currentHole = holeNumber;
    }
    
    // Set player to teeoff phase if they're on the correct hole
    if (golfPlayer.holePhase === HolePhase.Teeoff || !golfPlayer.holePhase) {
        golfPlayer.holePhase = HolePhase.Teeoff;
        
        // Show notification
        mod.DisplayNotificationMessage(
            mod.Message("teeBoxEntry", holeNumber),
            golfPlayer.player
        );
    }
}

/**
 * Handle player exiting tee box
 */
function handleTeeBoxExit(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Player has left the tee box, likely after taking their shot
    if (golfPlayer.holePhase === HolePhase.Teeoff) {
        golfPlayer.holePhase = HolePhase.Fairway;
    }
}

/**
 * Handle player entering green
 */
function handleGreenEntry(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Check if this is the current hole
    const currentHole = getCurrentHoleNumber();
    if (holeNumber !== currentHole) return;
    
    // Set player to putting phase
    golfPlayer.holePhase = HolePhase.Putting;
    
    // Show putting notification
    mod.DisplayNotificationMessage(
        mod.Message("greenEntry"),
        golfPlayer.player
    );
    
    // Enable putting UI/mode
    // TODO: Implement putting mode setup
}

/**
 * Handle player exiting green
 */
function handleGreenExit(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Player left the green (maybe to retrieve ball)
    if (golfPlayer.holePhase === HolePhase.Putting) {
        golfPlayer.holePhase = HolePhase.Fairway;
    }
}

/**
 * Handle player entering fairway
 */
function handleFairwayEntry(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Check if this is the current hole
    const currentHole = getCurrentHoleNumber();
    if (holeNumber !== currentHole) return;
    
    // Set player to fairway phase if coming from tee
    if (golfPlayer.holePhase === HolePhase.Teeoff) {
        golfPlayer.holePhase = HolePhase.Fairway;
    }
    
    // Update lie type to fairway
    golfPlayer.setLie('fairway');
}

/**
 * Handle player exiting fairway
 */
function handleFairwayExit(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Lie type will be updated by the next zone entry
}

/**
 * Handle player entering rough
 */
function handleRoughEntry(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Check if this is the current hole
    const currentHole = getCurrentHoleNumber();
    if (holeNumber !== currentHole) return;
    
    // Update lie type to rough
    golfPlayer.setLie('rough');
    
    // Show rough notification
    mod.DisplayNotificationMessage(
        mod.Message("roughEntry"),
        golfPlayer.player
    );
}

/**
 * Handle player exiting rough
 */
function handleRoughExit(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Lie type will be updated by the next zone entry
}

/**
 * Handle player entering out of bounds
 */
function handleOutOfBoundsEntry(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Check if this is the current hole
    const currentHole = getCurrentHoleNumber();
    if (holeNumber !== currentHole) return;
    
    // Apply out of bounds penalty
    golfPlayer.strokes++; // Add penalty stroke
    
    // Show out of bounds notification
    mod.DisplayNotificationMessage(
        mod.Message("outOfBoundsEntry"),
        golfPlayer.player
    );
    
    // Reset player to previous position or tee box
    // TODO: Implement position reset logic
}

/**
 * Handle player exiting out of bounds
 */
function handleOutOfBoundsExit(golfPlayer: GolfPlayer, holeNumber: number): void {
    // Player has been brought back in bounds
}
