/**
 * Helper Functions
 * 
 * Utility functions used throughout the mod.
 */

import { GolfPlayer } from './player';

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
    
    GolfPlayer.playerInstances.forEach((player: mod.Player) => {
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
    
    GolfPlayer.playerInstances.forEach((player: mod.Player) => {
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
    
    GolfPlayer.playerInstances.forEach((player: mod.Player) => {
        let golfPlayer = GolfPlayer.get(player);
        if (!golfPlayer) return;
        
        if (mod.GetObjId(mod.GetTeam(player)) == teamID 
            && mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive)) {
            teamPlayers.push(player);
        }
    });
    
    return teamPlayers;
}

/**
 * Clamp a value between min and max
 */
export function Clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
}

/**
 * Check if a value is within a range
 */
export function InRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Calculate distance between two vectors
 */
export function GetDistance(pos1: mod.Vector, pos2: mod.Vector): number {
    return mod.DistanceBetween(pos1, pos2);
}

/**
 * Calculate 2D distance (ignoring Y axis)
 */
export function GetDistance2D(pos1: mod.Vector, pos2: mod.Vector): number {
    let x1 = mod.GetVectorElement(pos1, 0);
    let z1 = mod.GetVectorElement(pos1, 2);
    let x2 = mod.GetVectorElement(pos2, 0);
    let z2 = mod.GetVectorElement(pos2, 2);
    
    let dx = x2 - x1;
    let dz = z2 - z1;
    
    return Math.sqrt(dx * dx + dz * dz);
}

/**
 * Check if player is valid and alive
 */
export function IsPlayerAlive(player: mod.Player): boolean {
    if (!player) return false;
    return mod.GetSoldierState(player, mod.SoldierStateBool.IsAlive);
}

/**
 * Get player position
 */
export function GetPlayerPosition(player: mod.Player): mod.Vector | null {
    if (!IsPlayerAlive(player)) return null;
    return mod.GetSoldierState(player, mod.SoldierStateVector.GetPosition);
}

/**
 * Teleport player to position
 */
export function TeleportPlayer(player: mod.Player, position: mod.Vector): void {
    mod.SetSoldierState(player, mod.SoldierStateVector.SetPosition, position);
}

/**
 * Get all teams as an array
 */
export function GetAllTeams(): mod.Team[] {
    let teams: mod.Team[] = [];
    for (let i = 1; i <= 4; i++) {
        try {
            let team = mod.GetTeamById(i);
            if (team) teams.push(team);
        } catch (e) {
            // Team doesn't exist
        }
    }
    return teams;
}

/**
 * Compare two team IDs for equality
 */
export function TeamEquals(team1: mod.Team, team2: mod.Team): boolean {
    return mod.GetObjId(team1) === mod.GetObjId(team2);
}

/**
 * Get team ID from team object
 */
export function GetTeamId(team: mod.Team): number {
    return mod.GetObjId(team);
}

/**
 * Get player's team ID
 */
export function GetPlayerTeamId(player: mod.Player): number {
    return mod.GetObjId(mod.GetTeam(player));
}

/**
 * Check if two players are on the same team
 */
export function AreTeammates(player1: mod.Player, player2: mod.Player): boolean {
    return GetPlayerTeamId(player1) === GetPlayerTeamId(player2);
}

/**
 * Count alive players on a team
 */
export function CountAlivePlayersOnTeam(team: mod.Team): number {
    return GetLivingPlayersOnTeam(team).length;
}

/**
 * Count total players on a team
 */
export function CountPlayersOnTeam(team: mod.Team): number {
    return GetPlayersOnTeam(team).length;
}

/**
 * Get all alive players (any team)
 */
export function GetAllAlivePlayers(): mod.Player[] {
    let alivePlayers: mod.Player[] = [];
    
    GolfPlayer.playerInstances.forEach((player: mod.Player) => {
        if (IsPlayerAlive(player)) {
            alivePlayers.push(player);
        }
    });
    
    return alivePlayers;
}

/**
 * Format time in seconds to MM:SS string
 */
export function FormatTime(seconds: number): string {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Format score with +/- notation
 */
export function FormatScore(score: number, par: number): string {
    let diff = score - par;
    if (diff === 0) return "E"; // Even par
    return diff > 0 ? `+${diff}` : `${diff}`;
}

/**
 * Get score name (birdie, eagle, etc.)
 */
export function GetScoreName(score: number, par: number): string {
    let diff = score - par;
    
    if (diff <= -4) return "Condor";
    if (diff === -3) return "Albatross";
    if (diff === -2) return "Eagle";
    if (diff === -1) return "Birdie";
    if (diff === 0) return "Par";
    if (diff === 1) return "Bogey";
    if (diff === 2) return "Double Bogey";
    if (diff === 3) return "Triple Bogey";
    
    return `+${diff}`;
}

/**
 * Weighted random selection
 * weights should sum to 1.0
 */
export function WeightedRandom<T>(items: T[], weights: number[]): T {
    if (items.length !== weights.length) {
        throw new Error("Items and weights arrays must have same length");
    }
    
    let random = Math.random();
    let sum = 0;
    
    for (let i = 0; i < items.length; i++) {
        sum += weights[i];
        if (random <= sum) {
            return items[i];
        }
    }
    
    return items[items.length - 1];
}

/**
 * Shuffle an array (Fisher-Yates)
 */
export function ShuffleArray<T>(array: T[]): T[] {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = GetRandomInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get random element from array
 */
export function GetRandomElement<T>(array: T[]): T {
    return array[GetRandomInt(array.length)];
}

/**
 * Calculate angle between two positions (in degrees)
 */
export function GetAngleBetween(from: mod.Vector, to: mod.Vector): number {
    let dx = mod.GetVectorElement(to, 0) - mod.GetVectorElement(from, 0);
    let dz = mod.GetVectorElement(to, 2) - mod.GetVectorElement(from, 2);
    
    let angle = Math.atan2(dz, dx) * (180 / Math.PI);
    return angle;
}

/**
 * Normalize angle to 0-360 range
 */
export function NormalizeAngle(angle: number): number {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
}

/**
 * Get direction vector from angle (in degrees)
 */
export function GetDirectionFromAngle(angle: number): mod.Vector {
    let rad = angle * (Math.PI / 180);
    return mod.CreateVector(Math.cos(rad), 0, Math.sin(rad));
}

/**
 * Create a vector with all same values
 */
export function CreateVectorUniform(value: number): mod.Vector {
    return mod.CreateVector(value, value, value);
}

/**
 * Create RGB color vector (0-1 range)
 */
export function CreateColor(r: number, g: number, b: number): mod.Vector {
    return mod.CreateVector(r, g, b);
}

/**
 * Create color from hex (#RRGGBB)
 */
export function CreateColorFromHex(hex: string): mod.Vector {
    hex = hex.replace('#', '');
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    return mod.CreateVector(r, g, b);
}

/**
 * Common colors
 */
export const Colors = {
    White: CreateColor(1, 1, 1),
    Black: CreateColor(0, 0, 0),
    Red: CreateColor(1, 0, 0),
    Green: CreateColor(0, 1, 0),
    Blue: CreateColor(0, 0, 1),
    Yellow: CreateColor(1, 1, 0),
    Cyan: CreateColor(0, 1, 1),
    Magenta: CreateColor(1, 0, 1),
    Orange: CreateColor(1, 0.5, 0),
    Purple: CreateColor(0.5, 0, 0.5),
    Gray: CreateColor(0.5, 0.5, 0.5),
};

/**
 * Wait for a condition to be true (with timeout)
 */
export async function WaitForCondition(
    condition: () => boolean,
    timeout: number = 30,
    checkInterval: number = 0.1
): Promise<boolean> {
    let elapsed = 0;
    
    while (elapsed < timeout) {
        if (condition()) return true;
        await mod.Wait(checkInterval);
        elapsed += checkInterval;
    }
    
    return false;
}

/**
 * Execute function with delay
 */
export async function DelayedExecute(delay: number, fn: () => void): Promise<void> {
    await mod.Wait(delay);
    fn();
}

/**
 * Percentage calculation
 */
export function Percentage(value: number, total: number): number {
    if (total === 0) return 0;
    return (value / total) * 100;
}

/**
 * Ease in/out function (smooth interpolation)
 */
export function EaseInOut(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

/**
 * Round to decimal places
 */
export function RoundTo(value: number, decimals: number): number {
    let multiplier = Math.pow(10, decimals);
    return Math.round(value * multiplier) / multiplier;
}

/**
 * Format number with commas
 */
export function FormatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Create a countdown timer
 */
export async function CountdownTimer(
    seconds: number,
    onTick: (remaining: number) => void,
    onComplete?: () => void
): Promise<void> {
    for (let i = seconds; i > 0; i--) {
        onTick(i);
        await mod.Wait(1);
    }
    if (onComplete) onComplete();
}

/**
 * Deep copy an object (simple implementation)
 */
export function DeepCopy<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Check if array is empty
 */
export function IsEmpty<T>(array: T[]): boolean {
    return array.length === 0;
}

/**
 * Remove duplicates from array
 */
export function UniqueArray<T>(array: T[]): T[] {
    return [...new Set(array)];
}

/**
 * Find closest player to a position
 */
export function FindClosestPlayer(position: mod.Vector, players?: mod.Player[]): mod.Player | null {
    if (!players) {
        players = GetAllAlivePlayers();
    }
    
    if (IsEmpty(players)) return null;
    
    let closestPlayer: mod.Player | null = null;
    let closestDistance = Infinity;
    
    players.forEach(player => {
        let playerPos = GetPlayerPosition(player);
        if (!playerPos) return;
        
        let distance = GetDistance(position, playerPos);
        if (distance < closestDistance) {
            closestDistance = distance;
            closestPlayer = player;
        }
    });
    
    return closestPlayer;
}

/**
 * Sort players by score (ascending)
 */
export function SortPlayersByScore(players: mod.Player[], getScore: (p: mod.Player) => number): mod.Player[] {
    return [...players].sort((a, b) => getScore(a) - getScore(b));
}

/**
 * Group players by team
 */
export function GroupPlayersByTeam(players: mod.Player[]): Map<number, mod.Player[]> {
    let grouped = new Map<number, mod.Player[]>();
    
    players.forEach(player => {
        let teamId = GetPlayerTeamId(player);
        if (!grouped.has(teamId)) {
            grouped.set(teamId, []);
        }
        grouped.get(teamId)!.push(player);
    });
    
    return grouped;
}

///////////////////////////////////////////////////////////////////////////////
// FOURSOME & GROUP HELPERS
///////////////////////////////////////////////////////////////////////////////

/**
 * Calculate the time elapsed since hole start for a foursome
 */
export function GetFoursomeHoleTime(holeStartTime: number): number {
    const currentTime = Date.now() / 1000;
    return currentTime - holeStartTime;
}

/**
 * Format hole time for display (MM:SS)
 */
export function FormatHoleTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Check if all players in an array are valid
 */
export function AreAllPlayersValid(players: mod.Player[]): boolean {
    return players.every(p => mod.GetObjId(p) > -1);
}

/**
 * Remove invalid players from an array
 */
export function RemoveInvalidPlayers(players: mod.Player[]): mod.Player[] {
    return players.filter(p => mod.GetObjId(p) > -1);
}

/**
 * Get the best score among a group of players
 */
export function GetBestScoreInGroup(players: mod.Player[]): number {
    if (players.length === 0) return 0;
    
    let bestScore = Infinity;
    players.forEach(player => {
        // This would reference a GolfPlayer method
        // For now, return a placeholder
        // TODO: Implement when score tracking is added
    });
    
    return bestScore;
}

/**
 * Calculate average score for a group
 */
export function GetAverageScoreInGroup(players: mod.Player[]): number {
    if (players.length === 0) return 0;
    
    let totalScore = 0;
    players.forEach(player => {
        // TODO: Implement when score tracking is added
    });
    
    return totalScore / players.length;
}

/**
 * Check if a hole number is valid
 */
export function IsValidHole(holeNumber: number, totalHoles: number): boolean {
    return holeNumber >= 1 && holeNumber <= totalHoles;
}

/**
 * Get next hole number
 */
export function GetNextHole(currentHole: number, totalHoles: number): number {
    if (currentHole >= totalHoles) {
        return -1; // No more holes
    }
    return currentHole + 1;
}

/**
 * Check if this is the final hole
 */
export function IsFinalHole(holeNumber: number, totalHoles: number): boolean {
    return holeNumber === totalHoles;
}

