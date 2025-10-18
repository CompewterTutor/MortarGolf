/**
 * Helper Functions
 * 
 * Utility functions used throughout the mod.
 */

import { JsPlayer } from './player';

/**
 * Create a localized message with variable arguments
 */
export function MakeMessage(message: string, ...args: any[]): mod.Message {
    switch (args.length) {
        case 0: return mod.Message(message);
        case 1: return mod.Message(message, args[0]);
        case 2: return mod.Message(message, args[0], args[1]);
        default: return mod.Message(message, args[0], args[1], args[2]);
    }
}

/**
 * Generate random integer from 0 to max-1
 */
export function GetRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
}

/**
 * Generate random float in range [min, max)
 */
export function GetRandomFloatInRange(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

/**
 * Linear interpolation between a and b
 */
export function Lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/**
 * Get all players within range of a point
 */
export async function GetPlayersInRange(point: mod.Vector, distance: number): Promise<mod.Player[]> {
    let closePlayers: mod.Player[] = [];
    
    JsPlayer.playerInstances.forEach(player => {
        if (mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            let pos = mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
            let dist = mod.DistanceBetween(pos, point);
            if (dist <= distance) {
                closePlayers.push(player);
            }
        }
    });
    
    return closePlayers;
}

/**
 * Get all players on a specific team
 */
export function GetPlayersOnTeam(team: mod.Team): mod.Player[] {
    let teamPlayers: mod.Player[] = [];
    let teamID = mod.GetObjId(team);
    
    JsPlayer.playerInstances.forEach(player => {
        if (mod.GetObjId(mod.GetTeam(player)) == teamID) {
            teamPlayers.push(player);
        }
    });
    
    return teamPlayers;
}

/**
 * Get all living players on a specific team
 */
export function GetLivingPlayersOnTeam(team: mod.Team): mod.Player[] {
    let teamPlayers: mod.Player[] = [];
    let teamID = mod.GetObjId(team);
    
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        
        if (mod.GetObjId(mod.GetTeam(player)) == teamID 
            && mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            teamPlayers.push(player);
        }
    });
    
    return teamPlayers;
}
