/**
 * Matchmaking System
 * 
 * Manages player queue and foursome formation.
 * Handles automatic group creation, player preferences, and wait times.
 */

import { GolfPlayer } from './player';
import { Foursome } from './foursome';
import { PlayerRole } from './types';

/**
 * Player queue entry
 */
interface QueuedPlayer {
    player: mod.Player;
    joinTime: number;
    preferredRole: PlayerRole;
}

/**
 * Matchmaking manager class
 */
export class MatchmakingQueue {
    private static queue: QueuedPlayer[] = [];
    private static readonly MAX_WAIT_TIME = 30; // seconds before auto-assigning
    
    /**
     * Add a player to the matchmaking queue
     */
    static addPlayer(player: mod.Player, preferredRole: PlayerRole = PlayerRole.Golfer): void {
        // Check if already in queue
        if (this.isPlayerInQueue(player)) {
            console.warn("Player already in matchmaking queue");
            return;
        }
        
        const queueEntry: QueuedPlayer = {
            player: player,
            joinTime: Date.now() / 1000,
            preferredRole: preferredRole
        };
        
        this.queue.push(queueEntry);
        
        console.log(`Player ${mod.GetObjId(player)} added to matchmaking queue (role: ${PlayerRole[preferredRole]})`);
    }
    
    /**
     * Remove a player from the queue
     */
    static removePlayer(player: mod.Player): void {
        const index = this.queue.findIndex(q => mod.GetObjId(q.player) === mod.GetObjId(player));
        if (index > -1) {
            this.queue.splice(index, 1);
            console.log(`Player ${mod.GetObjId(player)} removed from matchmaking queue`);
        }
    }
    
    /**
     * Check if a player is in the queue
     */
    static isPlayerInQueue(player: mod.Player): boolean {
        return this.queue.some(q => mod.GetObjId(q.player) === mod.GetObjId(player));
    }
    
    /**
     * Get player's position in queue
     */
    static getPlayerPosition(player: mod.Player): number {
        return this.queue.findIndex(q => mod.GetObjId(q.player) === mod.GetObjId(player));
    }
    
    /**
     * Get player's wait time in seconds
     */
    static getPlayerWaitTime(player: mod.Player): number {
        const entry = this.queue.find(q => mod.GetObjId(q.player) === mod.GetObjId(player));
        if (!entry) return 0;
        
        const currentTime = Date.now() / 1000;
        return currentTime - entry.joinTime;
    }
    
    /**
     * Get queue size
     */
    static getQueueSize(): number {
        return this.queue.length;
    }
    
    /**
     * Clear the entire queue
     */
    static clearQueue(): void {
        this.queue = [];
        console.log("Matchmaking queue cleared");
    }
    
    /**
     * Process the queue and attempt to form foursomes
     * Called periodically from update loop
     */
    static processQueue(): void {
        if (this.queue.length === 0) return;
        
        // Try to form complete foursomes first
        this.tryFormCompleteGroups();
        
        // Handle players who have waited too long
        this.handleLongWaitPlayers();
        
        // Auto-assign solo players if possible
        this.autoAssignSoloPlayers();
    }
    
    /**
     * Try to form complete foursomes (4 players)
     */
    private static tryFormCompleteGroups(): void {
        // Need at least 4 players
        if (this.queue.length < 4) return;
        
        // Separate by role preference
        const golferQueue = this.queue.filter(q => q.preferredRole === PlayerRole.Golfer);
        const caddyQueue = this.queue.filter(q => q.preferredRole === PlayerRole.Caddy);
        
        // Try to form balanced groups (2 golfers + 2 caddies)
        while (golferQueue.length >= 2 && caddyQueue.length >= 2) {
            const foursome = Foursome.createFoursome();
            if (!foursome) {
                console.warn("Cannot create more foursomes (max teams reached)");
                break;
            }
            
            // Add 2 golfers
            for (let i = 0; i < 2; i++) {
                const queueEntry = golferQueue.shift();
                if (queueEntry) {
                    foursome.addGolfer(queueEntry.player);
                    this.removePlayer(queueEntry.player);
                }
            }
            
            // Add 2 caddies
            for (let i = 0; i < 2; i++) {
                const queueEntry = caddyQueue.shift();
                if (queueEntry) {
                    foursome.addCaddy(queueEntry.player);
                    this.removePlayer(queueEntry.player);
                }
            }
            
            // Pair golfers with caddies
            foursome.pairPlayersWithCaddies();
            
            console.log(`Formed foursome ${foursome.id} with ${foursome.getTotalPlayers()} players`);
        }
    }
    
    /**
     * Handle players who have waited longer than MAX_WAIT_TIME
     */
    private static handleLongWaitPlayers(): void {
        const currentTime = Date.now() / 1000;
        
        for (const entry of this.queue) {
            const waitTime = currentTime - entry.joinTime;
            
            if (waitTime >= this.MAX_WAIT_TIME) {
                // Try to place in any available foursome
                const availableFoursome = Foursome.findAvailableFoursome();
                
                if (availableFoursome) {
                    this.assignPlayerToFoursome(entry.player, availableFoursome, entry.preferredRole);
                } else {
                    // Create a new foursome for this player
                    const newFoursome = Foursome.createFoursome();
                    if (newFoursome) {
                        this.assignPlayerToFoursome(entry.player, newFoursome, entry.preferredRole);
                    }
                }
            }
        }
    }
    
    /**
     * Auto-assign solo players to existing foursomes with space
     */
    private static autoAssignSoloPlayers(): void {
        if (this.queue.length === 0) return;
        
        // Find foursomes that need players
        const availableFoursomes = Foursome.getActiveFoursomes().filter(f => f.hasRoom());
        
        for (const foursome of availableFoursomes) {
            if (this.queue.length === 0) break;
            
            // Determine what roles the foursome needs
            const needsGolfer = foursome.golfers.length < 2;
            const needsCaddy = foursome.caddies.length < 2;
            
            // Try to fill with matching roles first
            if (needsGolfer) {
                const golferEntry = this.queue.find(q => q.preferredRole === PlayerRole.Golfer);
                if (golferEntry) {
                    this.assignPlayerToFoursome(golferEntry.player, foursome, PlayerRole.Golfer);
                    continue;
                }
            }
            
            if (needsCaddy) {
                const caddyEntry = this.queue.find(q => q.preferredRole === PlayerRole.Caddy);
                if (caddyEntry) {
                    this.assignPlayerToFoursome(caddyEntry.player, foursome, PlayerRole.Caddy);
                    continue;
                }
            }
            
            // If still need players and have flexible players, assign them
            if (foursome.hasRoom() && this.queue.length > 0) {
                const entry = this.queue[0];
                const role = needsGolfer ? PlayerRole.Golfer : PlayerRole.Caddy;
                this.assignPlayerToFoursome(entry.player, foursome, role);
            }
        }
    }
    
    /**
     * Assign a player to a specific foursome
     */
    private static assignPlayerToFoursome(
        player: mod.Player,
        foursome: Foursome,
        role: PlayerRole
    ): boolean {
        let success = false;
        
        if (role === PlayerRole.Golfer) {
            success = foursome.addGolfer(player);
        } else if (role === PlayerRole.Caddy) {
            success = foursome.addCaddy(player);
        }
        
        if (success) {
            this.removePlayer(player);
            console.log(`Assigned player ${mod.GetObjId(player)} to foursome ${foursome.id} as ${PlayerRole[role]}`);
            
            // Send notification to player
            mod.DisplayNotificationMessage(
                mod.Message("assignedToGroup", foursome.getTeamName()),
                player
            );
        }
        
        return success;
    }
    
    /**
     * Get queue statistics for display
     */
    static getQueueStats(): {
        totalPlayers: number;
        golfers: number;
        caddies: number;
        averageWaitTime: number;
    } {
        const golfers = this.queue.filter(q => q.preferredRole === PlayerRole.Golfer).length;
        const caddies = this.queue.filter(q => q.preferredRole === PlayerRole.Caddy).length;
        
        const currentTime = Date.now() / 1000;
        const totalWaitTime = this.queue.reduce((sum, entry) => sum + (currentTime - entry.joinTime), 0);
        const averageWaitTime = this.queue.length > 0 ? totalWaitTime / this.queue.length : 0;
        
        return {
            totalPlayers: this.queue.length,
            golfers,
            caddies,
            averageWaitTime
        };
    }
    
    /**
     * Form an immediate foursome from the first N players in queue
     * Used when enough players are ready to start
     */
    static formImmediateFoursome(): Foursome | null {
        if (this.queue.length < 2) return null; // Need at least 2 players
        
        const foursome = Foursome.createFoursome();
        if (!foursome) return null;
        
        // Take up to 4 players from the front of the queue
        const playersToAdd = Math.min(4, this.queue.length);
        
        for (let i = 0; i < playersToAdd; i++) {
            const entry = this.queue.shift();
            if (!entry) break;
            
            // Alternate between golfer and caddy if we have room
            if (foursome.golfers.length < 2 && (entry.preferredRole === PlayerRole.Golfer || foursome.caddies.length >= 2)) {
                foursome.addGolfer(entry.player);
            } else if (foursome.caddies.length < 2) {
                foursome.addCaddy(entry.player);
            } else {
                // Shouldn't happen, but handle it
                foursome.addGolfer(entry.player);
            }
        }
        
        // Pair golfers with caddies
        foursome.pairPlayersWithCaddies();
        
        console.log(`Immediately formed foursome ${foursome.id} with ${foursome.getTotalPlayers()} players`);
        
        return foursome;
    }
}
