/**
 * Player Management
 * 
 * GolfPlayer class for tracking per-player state and golf-specific data.
 * Implements the GolfPlayer interface from types.ts
 */

import { LobbyUI, MessageUI } from './ui';
import { debugJSPlayer, totalHoles } from './constants';
import { gameOver } from './state';
import { GameState, HolePhase, PlayerRole, ScoreData, PlayerStats, ClubType, GolfPlayer as IGolfPlayer } from './types';

export class GolfPlayer implements IGolfPlayer {
    // Base player reference
    player: mod.Player;
    playerId: number;
    
    // Golf-specific role and team
    role: PlayerRole = PlayerRole.Golfer;
    teamId: number = 0;
    caddyPlayer: mod.Player | null = null;
    golferPlayer: mod.Player | null = null;
    
    // Current hole state
    currentHole: number = 1;
    holePhase: HolePhase = HolePhase.Teeoff;
    shotCount: number = 0;
    currentLie: string = 'tee';
    
    // Scoring
    holeScores: ScoreData[] = [];
    stats: PlayerStats = {
        totalStrokes: 0,
        totalTime: 0,
        totalMoney: 0,
        totalKills: 0,
        totalDeaths: 0,
        holesCompleted: 0,
        birdies: 0,
        eagles: 0,
        aces: 0,
        bogeys: 0
    };
    money: number = 500; // Starting money
    
    // Legacy properties (for backwards compatibility)
    score: number = 0;
    deaths: number = 0;
    isDeployed: boolean = false;
    
    // UI Elements
    widgets: mod.UIWidget[] = [];
    lobbyUI?: LobbyUI;
    messageUI?: MessageUI;
    
    // Shot data
    lastShotPosition: mod.Vector | null = null;
    ballPosition: mod.Vector | null = null;
    distanceToPin: number = 0;
    
    // Selected club
    selectedClub: ClubType = ClubType.Driver;
    
    // Track all player instances
    static playerInstances: mod.Player[] = [];
    static #allGolfPlayers: { [key: number]: GolfPlayer } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        this.playerId = mod.GetObjId(player);
        GolfPlayer.playerInstances.push(this.player);
        
        if (debugJSPlayer) {
            console.log("Adding Player [", mod.GetObjId(this.player), "] Creating Golf Player: ", GolfPlayer.playerInstances.length);
        }
        
        // Create UI for human players only
        if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
            this.lobbyUI = new LobbyUI(this);
            this.messageUI = new MessageUI(this);
        }
        
        // Initialize hole scores array
        this.holeScores = [];
    }
    
    /**
     * Get or create GolfPlayer instance for a player
     */
    static get(player: mod.Player): GolfPlayer | undefined {
        if (!gameOver && mod.GetObjId(player) > -1) {
            let index = mod.GetObjId(player);
            let jsPlayer = this.#allGolfPlayers[index];
            
            if (!jsPlayer) {
                jsPlayer = new GolfPlayer(player);
                this.#allGolfPlayers[index] = jsPlayer;
            }
            
            return jsPlayer;
        }
        return undefined;
    }
    
    /**
     * Remove invalid players and clean up
     */
    static removeInvalidJSPlayers(invalidPlayerId: number): void {
        if (gameOver) return;
        
        if (debugJSPlayer) {
            console.log("Removing Invalid GolfPlayer:", invalidPlayerId);
        }
        
        // Clean up UI
        this.#allGolfPlayers[invalidPlayerId]?.destroyUI();
        
        // Remove from dictionary
        delete this.#allGolfPlayers[invalidPlayerId];
        
        // Remove from instances array
        let indexToRemove = -1;
        GolfPlayer.playerInstances.forEach((player: mod.Player, i: number) => {
            if (mod.GetObjId(player) < 0) {
                indexToRemove = i;
            }
        });
        
        if (indexToRemove > -1) {
            GolfPlayer.playerInstances.splice(indexToRemove, 1);
        }
    }
    
    /**
     * Clean up all UI elements
     */
    destroyUI(): void {
        this.lobbyUI?.close();
        this.messageUI?.close();
        
        // Clean up all tracked widgets
        this.widgets.forEach(widget => {
            mod.DeleteUIWidget(widget);
        });
        this.widgets = [];
    }
    
    /**
     * Assign a role to this player (Golfer, Caddy, or Spectator)
     */
    setRole(role: PlayerRole): void {
        this.role = role;
        
        // Reset role-specific properties
        if (role === PlayerRole.Golfer) {
            this.caddyPlayer = null;
        } else if (role === PlayerRole.Caddy) {
            this.golferPlayer = null;
        } else if (role === PlayerRole.Spectator) {
            this.caddyPlayer = null;
            this.golferPlayer = null;
        }
    }
    
    /**
     * Pair this golfer with a caddy
     */
    assignCaddy(caddy: mod.Player): void {
        if (this.role !== PlayerRole.Golfer) {
            console.warn("Cannot assign caddy to non-golfer player");
            return;
        }
        
        this.caddyPlayer = caddy;
        
        // Update the caddy's golfer reference
        let caddyGolfPlayer = GolfPlayer.get(caddy);
        if (caddyGolfPlayer) {
            caddyGolfPlayer.golferPlayer = this.player;
        }
    }
    
    /**
     * Pair this caddy with a golfer
     */
    assignGolfer(golfer: mod.Player): void {
        if (this.role !== PlayerRole.Caddy) {
            console.warn("Cannot assign golfer to non-caddy player");
            return;
        }
        
        this.golferPlayer = golfer;
        
        // Update the golfer's caddy reference
        let golferGolfPlayer = GolfPlayer.get(golfer);
        if (golferGolfPlayer) {
            golferGolfPlayer.caddyPlayer = this.player;
        }
    }
    
    /**
     * Remove caddy/golfer pairing
     */
    unpair(): void {
        if (this.caddyPlayer) {
            let caddyGolfPlayer = GolfPlayer.get(this.caddyPlayer);
            if (caddyGolfPlayer) {
                caddyGolfPlayer.golferPlayer = null;
            }
            this.caddyPlayer = null;
        }
        
        if (this.golferPlayer) {
            let golferGolfPlayer = GolfPlayer.get(this.golferPlayer);
            if (golferGolfPlayer) {
                golferGolfPlayer.caddyPlayer = null;
            }
            this.golferPlayer = null;
        }
    }
    
    /**
     * Start a new hole
     */
    startHole(holeNumber: number): void {
        this.currentHole = holeNumber;
        this.holePhase = HolePhase.Teeoff;
        this.shotCount = 0;
        this.currentLie = 'tee';
        this.lastShotPosition = null;
        this.ballPosition = null;
        this.distanceToPin = 0;
        this.selectedClub = ClubType.Driver;
    }
    
    /**
     * Complete the current hole and record score
     */
    completeHole(scoreData: ScoreData): void {
        this.holeScores.push(scoreData);
        this.holePhase = HolePhase.Complete;
        
        // Update cumulative statistics
        this.stats.totalStrokes += scoreData.strokes;
        this.stats.totalTime += scoreData.timeSeconds;
        this.stats.totalMoney += scoreData.moneyEarned;
        this.stats.totalKills += scoreData.kills;
        this.stats.totalDeaths += scoreData.deaths;
        this.stats.holesCompleted++;
        
        // Update money
        this.money += scoreData.moneyEarned;
        
        // Track special scores
        if (scoreData.parDelta === -3) this.stats.aces++;
        else if (scoreData.parDelta === -2) this.stats.eagles++;
        else if (scoreData.parDelta === -1) this.stats.birdies++;
        else if (scoreData.parDelta === 1) this.stats.bogeys++;
    }
    
    /**
     * Increment shot count
     */
    takeShot(): void {
        this.shotCount++;
    }
    
    /**
     * Get the player's current total score (total strokes)
     */
    getTotalScore(): number {
        return this.stats.totalStrokes;
    }
    
    /**
     * Get the player's score relative to par
     */
    getScoreRelativeToPar(coursePar: number): number {
        return this.stats.totalStrokes - coursePar;
    }
    
    /**
     * Get score for a specific hole
     */
    getHoleScore(holeNumber: number): ScoreData | undefined {
        return this.holeScores[holeNumber - 1];
    }
    
    /**
     * Check if player has a caddy assigned
     */
    hasCaddy(): boolean {
        return this.caddyPlayer !== null;
    }
    
    /**
     * Check if player is on the green
     */
    isOnGreen(): boolean {
        return this.currentLie === 'green';
    }
    
    /**
     * Update player's lie type based on position
     */
    setLie(lieType: string): void {
        this.currentLie = lieType;
        
        // Switch to putting phase if on green
        if (lieType === 'green' && this.holePhase !== HolePhase.Putting) {
            this.holePhase = HolePhase.Putting;
            this.selectedClub = ClubType.Putter;
        }
    }
    
    /**
     * Get all golfer players
     */
    static getAllGolfers(): GolfPlayer[] {
        return GolfPlayer.playerInstances
            .map(p => GolfPlayer.get(p))
            .filter((gp): gp is GolfPlayer => gp !== undefined && gp.role === PlayerRole.Golfer);
    }
    
    /**
     * Get all caddy players
     */
    static getAllCaddies(): GolfPlayer[] {
        return GolfPlayer.playerInstances
            .map(p => GolfPlayer.get(p))
            .filter((gp): gp is GolfPlayer => gp !== undefined && gp.role === PlayerRole.Caddy);
    }
    
    /**
     * Get all players (GolfPlayer instances)
     */
    static getAll(): GolfPlayer[] {
        return GolfPlayer.playerInstances
            .map(p => GolfPlayer.get(p))
            .filter((gp): gp is GolfPlayer => gp !== undefined);
    }
}
