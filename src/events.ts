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
import { JsPlayer } from './player';
import { HideAllMessageUI, UpdateAllLobbyUI } from './messages';
import { CombatCountdown } from './gameflow';
import { TickUpdate, ThrottledUpdate } from './updates';

///////////////////////////////////////////////////////////////////////////////
// EXPORTED EVENT HANDLERS
///////////////////////////////////////////////////////////////////////////////

/**
 * Called once when the game mode starts
 */
export async function OnGameModeStarted(): Promise<void> {
    console.log("Game Mode Started - Version", VERSION[0], ".", VERSION[1], ".", VERSION[2]);
    
    // 1. Configure game settings
    mod.SetFriendlyFire(false);
    mod.SetSpawnMode(mod.SpawnModes.AutoSpawn);
    
    // 2. Setup game objects (HQs, objectives, etc.)
    let mainHQ = mod.GetHQ(mainHQID);
    mod.EnableHQ(mainHQ, true);
    
    // 3. Wait for minimum players
    while (initialPlayerCount < minimumInitialPlayerCount) {
        await mod.Wait(1);
    }
    
    console.log("Adequate players have joined. Starting countdown.");
    
    // 4. Start countdown
    await CombatCountdown();
    
    // 5. Begin update loops (don't await these)
    TickUpdate();
    ThrottledUpdate();
}

/**
 * Called when game mode is ending
 */
export function OnGameModeEnding(): void {
    setGameOver(true);
    HideAllMessageUI();
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
    
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Check if human player
    if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
        if (!combatStarted) {
            jsPlayer.lobbyUI?.open();
            incrementInitialPlayerCount();
            console.log("Player joined. Total:", initialPlayerCount);
            UpdateAllLobbyUI();
        }
    }
}

/**
 * Called when a player leaves the game
 */
export async function OnPlayerLeaveGame(playerId: number): Promise<void> {
    JsPlayer.removeInvalidJSPlayers(playerId);
    
    if (!combatStarted) {
        decrementInitialPlayerCount();
        UpdateAllLobbyUI();
    }
}

/**
 * Called when a player deploys into the game
 */
export function OnPlayerDeployed(eventPlayer: mod.Player): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.isDeployed = true;
    
    // Setup player loadout, position, etc.
    if (!combatStarted) {
        // Pre-game spawn logic
    } else {
        // In-game spawn logic
    }
}

/**
 * Called when a player undeploys
 */
export function OnPlayerUndeploy(eventPlayer: mod.Player): void {
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.isDeployed = false;
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
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.deaths++;
    
    // Handle death logic
    // - Update scores
    // - Check victory conditions
    // - Trigger events
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
    
    let jsPlayer = JsPlayer.get(eventPlayer);
    if (!jsPlayer) return;
    
    jsPlayer.score++;
    
    // Handle kill logic
    // - Award points
    // - Update UI
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
    // Handle damage events
    // - Custom damage modifiers
    // - Damage feedback
}

/**
 * Called when a player interacts with an interact point
 */
export async function OnPlayerInteract(
    player: mod.Player,
    interactPoint: mod.InteractPoint
): Promise<void> {
    let id = mod.GetObjId(interactPoint);
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Switch on interact point ID
    switch (id) {
        case interactPointID:
            // Handle interaction
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
    console.log("Player switched to team:", mod.GetObjId(eventTeam));
}

/**
 * Called when a player enters an area trigger
 */
export function OnPlayerEnterAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let id = mod.GetObjId(eventAreaTrigger);
    
    // Handle area trigger entry
    console.log("Player entered area trigger:", id);
}

/**
 * Called when a player exits an area trigger
 */
export function OnPlayerExitAreaTrigger(
    eventPlayer: mod.Player,
    eventAreaTrigger: mod.AreaTrigger
): void {
    let id = mod.GetObjId(eventAreaTrigger);
    
    // Handle area trigger exit
    console.log("Player exited area trigger:", id);
}

/**
 * Called when a player enters a capture point
 */
export function OnPlayerEnterCapturePoint(
    eventPlayer: mod.Player,
    eventCapturePoint: mod.CapturePoint
): void {
    // Handle capture point entry
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
    // Display capture progress
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
    // Handle vehicle spawn
    // - Custom vehicle behavior
    // - Destroy in certain areas
}

/**
 * Called when a vehicle is destroyed
 */
export function OnVehicleDestroyed(
    eventVehicle: mod.Vehicle,
    eventPlayer: mod.Player
): void {
    // Handle vehicle destruction
}

/**
 * Called when a UI button is pressed
 */
export function OnPlayerUIButtonEvent(
    player: mod.Player,
    widget: mod.UIWidget,
    event: mod.UIButtonEvent
): void {
    let jsPlayer = JsPlayer.get(player);
    if (!jsPlayer) return;
    
    // Handle button events
    // - Store purchases
    // - Menu navigation
}
