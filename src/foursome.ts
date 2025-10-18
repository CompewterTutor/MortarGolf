/**
 * Foursome Management
 * 
 * Manages groups of up to 4 players (2 golfers + 2 caddies) progressing through holes.
 * Handles group formation, player management, hole progression, and team color assignment.
 */

import { GolfPlayer } from './player';
import { PlayerRole } from './types';
import { playersPerFoursome, totalHoles, COLOR_TEAM_RED, COLOR_TEAM_BLUE, COLOR_TEAM_GREEN, COLOR_TEAM_YELLOW } from './constants';

/**
 * Enum for team colors
 */
export enum TeamColor {
    Red = 1,
    Blue = 2,
    Green = 3,
    Yellow = 4
}

/**
 * Foursome class - manages a group of players progressing through holes together
 */
export class Foursome {
    id: number;
    teamColor: TeamColor;
    golfers: mod.Player[] = [];
    caddies: mod.Player[] = [];
    currentHole: number = 1;
    holeStartTime: number = 0;
    holeCompleted: boolean = false;
    isActive: boolean = true;
    
    // Track all foursome instances
    static allFoursomes: Foursome[] = [];
    static nextId: number = 1;
    
    constructor(teamColor: TeamColor) {
        this.id = Foursome.nextId++;
        this.teamColor = teamColor;
        Foursome.allFoursomes.push(this);
    }
    
    /**
     * Add a golfer to the foursome
     * Returns true if successful, false if group is full
     */
    addGolfer(player: mod.Player): boolean {
        if (this.golfers.length >= 2) {
            return false; // Maximum 2 golfers per foursome
        }
        
        if (this.golfers.includes(player)) {
            return false; // Already in the group
        }
        
        this.golfers.push(player);
        
        // Update GolfPlayer instance
        const golfPlayer = GolfPlayer.get(player);
        if (golfPlayer) {
            golfPlayer.setRole(PlayerRole.Golfer);
            golfPlayer.teamId = this.teamColor;
        }
        
        // Assign SDK team
        this.assignPlayerToTeam(player);
        
        return true;
    }
    
    /**
     * Add a caddy to the foursome
     * Returns true if successful, false if group is full
     */
    addCaddy(player: mod.Player): boolean {
        if (this.caddies.length >= 2) {
            return false; // Maximum 2 caddies per foursome
        }
        
        if (this.caddies.includes(player)) {
            return false; // Already in the group
        }
        
        this.caddies.push(player);
        
        // Update GolfPlayer instance
        const golfPlayer = GolfPlayer.get(player);
        if (golfPlayer) {
            golfPlayer.setRole(PlayerRole.Caddy);
            golfPlayer.teamId = this.teamColor;
        }
        
        // Assign SDK team
        this.assignPlayerToTeam(player);
        
        return true;
    }
    
    /**
     * Remove a player from the foursome
     */
    removePlayer(player: mod.Player): void {
        const golferIndex = this.golfers.indexOf(player);
        if (golferIndex > -1) {
            this.golfers.splice(golferIndex, 1);
        }
        
        const caddyIndex = this.caddies.indexOf(player);
        if (caddyIndex > -1) {
            this.caddies.splice(caddyIndex, 1);
        }
        
        // Unpair if needed
        const golfPlayer = GolfPlayer.get(player);
        if (golfPlayer) {
            golfPlayer.unpair();
        }
        
        // Check if foursome should be disbanded
        if (this.getTotalPlayers() === 0) {
            this.disband();
        }
    }
    
    /**
     * Get total number of players in the foursome
     */
    getTotalPlayers(): number {
        return this.golfers.length + this.caddies.length;
    }
    
    /**
     * Check if foursome is full
     */
    isFull(): boolean {
        return this.getTotalPlayers() >= playersPerFoursome;
    }
    
    /**
     * Check if foursome has room for more players
     */
    hasRoom(): boolean {
        return this.getTotalPlayers() < playersPerFoursome;
    }
    
    /**
     * Check if all players in the foursome have completed the current hole
     */
    areAllPlayersComplete(): boolean {
        // Check all golfers
        for (const golfer of this.golfers) {
            const golfPlayer = GolfPlayer.get(golfer);
            if (!golfPlayer || golfPlayer.currentHole !== this.currentHole) {
                continue; // Skip if invalid or on different hole
            }
            
            if (!golfPlayer.isOnGreen() && golfPlayer.shotCount > 0) {
                return false; // Still playing
            }
            
            // Check if they've holed out
            const holeScore = golfPlayer.getHoleScore(this.currentHole);
            if (!holeScore || !holeScore.holedOut) {
                return false;
            }
        }
        
        return this.golfers.length > 0; // Only complete if we have golfers
    }
    
    /**
     * Start the current hole for this foursome
     */
    startHole(): void {
        this.holeStartTime = Date.now() / 1000; // Convert to seconds
        this.holeCompleted = false;
        
        // Initialize hole for all golfers
        for (const golfer of this.golfers) {
            const golfPlayer = GolfPlayer.get(golfer);
            if (golfPlayer) {
                golfPlayer.startHole(this.currentHole);
            }
        }
    }
    
    /**
     * Complete the current hole and advance to next
     */
    completeHole(): void {
        this.holeCompleted = true;
        
        if (this.currentHole >= totalHoles) {
            // Round complete
            this.isActive = false;
        } else {
            // Move to next hole
            this.currentHole++;
        }
    }
    
    /**
     * Check if foursome has completed all holes
     */
    hasCompletedAllHoles(): boolean {
        return this.currentHole > totalHoles;
    }
    
    /**
     * Pair golfers with caddies in the foursome
     * Prioritizes solo players getting AI caddies
     */
    pairPlayersWithCaddies(): void {
        // Simple pairing: first caddy with first golfer, etc.
        for (let i = 0; i < Math.min(this.golfers.length, this.caddies.length); i++) {
            const golfer = this.golfers[i];
            const caddy = this.caddies[i];
            
            const golfPlayer = GolfPlayer.get(golfer);
            if (golfPlayer) {
                golfPlayer.assignCaddy(caddy);
            }
        }
    }
    
    /**
     * Disband the foursome and clean up
     */
    disband(): void {
        this.isActive = false;
        
        // Remove from global list
        const index = Foursome.allFoursomes.indexOf(this);
        if (index > -1) {
            Foursome.allFoursomes.splice(index, 1);
        }
    }
    
    /**
     * Assign player to the SDK team based on foursome color
     */
    private assignPlayerToTeam(player: mod.Player): void {
        const team = mod.GetTeam(this.teamColor);
        if (team) {
            mod.SetTeam(player, team);
        }
    }
    
    /**
     * Get the color array for this foursome's team
     */
    getTeamColorArray(): number[] {
        switch (this.teamColor) {
            case TeamColor.Red: return COLOR_TEAM_RED;
            case TeamColor.Blue: return COLOR_TEAM_BLUE;
            case TeamColor.Green: return COLOR_TEAM_GREEN;
            case TeamColor.Yellow: return COLOR_TEAM_YELLOW;
            default: return COLOR_TEAM_RED;
        }
    }
    
    /**
     * Get the team name for this foursome
     */
    getTeamName(): string {
        switch (this.teamColor) {
            case TeamColor.Red: return "Red Team";
            case TeamColor.Blue: return "Blue Team";
            case TeamColor.Green: return "Green Team";
            case TeamColor.Yellow: return "Yellow Team";
            default: return "Unknown Team";
        }
    }
    
    // ============================================================================
    // STATIC HELPER METHODS
    // ============================================================================
    
    /**
     * Create a new foursome with the next available color
     */
    static createFoursome(): Foursome | null {
        const availableColor = this.getNextAvailableColor();
        if (availableColor === null) {
            return null; // All teams in use
        }
        
        return new Foursome(availableColor);
    }
    
    /**
     * Get the next available team color (up to 4 teams)
     */
    static getNextAvailableColor(): TeamColor | null {
        const usedColors = new Set(this.allFoursomes.map(f => f.teamColor));
        
        for (const color of [TeamColor.Red, TeamColor.Blue, TeamColor.Green, TeamColor.Yellow]) {
            if (!usedColors.has(color)) {
                return color;
            }
        }
        
        return null; // All colors in use
    }
    
    /**
     * Find a foursome with available space
     */
    static findAvailableFoursome(): Foursome | null {
        for (const foursome of this.allFoursomes) {
            if (foursome.isActive && foursome.hasRoom() && foursome.currentHole === 1) {
                return foursome;
            }
        }
        return null;
    }
    
    /**
     * Get foursome by player
     */
    static getFoursomeByPlayer(player: mod.Player): Foursome | undefined {
        return this.allFoursomes.find(f => 
            f.golfers.includes(player) || f.caddies.includes(player)
        );
    }
    
    /**
     * Get all foursomes on a specific hole
     */
    static getFoursomesByHole(holeNumber: number): Foursome[] {
        return this.allFoursomes.filter(f => 
            f.isActive && f.currentHole === holeNumber
        );
    }
    
    /**
     * Get all active foursomes
     */
    static getActiveFoursomes(): Foursome[] {
        return this.allFoursomes.filter(f => f.isActive);
    }
    
    /**
     * Clear all foursomes (for game reset)
     */
    static clearAll(): void {
        for (const foursome of this.allFoursomes) {
            foursome.isActive = false;
        }
        this.allFoursomes = [];
        this.nextId = 1;
    }
    
    /**
     * Get count of active foursomes
     */
    static getActiveCount(): number {
        return this.getActiveFoursomes().length;
    }
    
    /**
     * Check if any foursomes are currently playing
     */
    static anyFoursomesPlaying(): boolean {
        return this.allFoursomes.some(f => f.isActive && !f.holeCompleted);
    }
}
