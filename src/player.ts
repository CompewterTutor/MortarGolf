/**
 * Player Management
 * 
 * JsPlayer class for tracking per-player state and data.
 */

import { LobbyUI, MessageUI } from './ui';
import { debugJSPlayer } from './constants';
import { gameOver } from './state';

export class JsPlayer {
    player: mod.Player;
    playerId: number;
    
    // Game-specific properties
    score: number = 0;
    deaths: number = 0;
    isDeployed: boolean = false;
    
    // UI references
    lobbyUI?: LobbyUI;
    messageUI?: MessageUI;
    
    // Track all player instances
    static playerInstances: mod.Player[] = [];
    static #allJsPlayers: { [key: number]: JsPlayer } = {};
    
    constructor(player: mod.Player) {
        this.player = player;
        this.playerId = mod.GetObjId(player);
        JsPlayer.playerInstances.push(this.player);
        
        if (debugJSPlayer) {
            console.log("Adding Player [", mod.GetObjId(this.player), "] Creating JS Player: ", JsPlayer.playerInstances.length);
        }
        
        // Create UI for human players only
        if (!mod.GetSoldierState(player, mod.SoldierStateBool.IsAISoldier)) {
            this.lobbyUI = new LobbyUI(this);
            this.messageUI = new MessageUI(this);
        }
    }
    
    /**
     * Get or create JsPlayer instance for a player
     */
    static get(player: mod.Player): JsPlayer | undefined {
        if (!gameOver && mod.GetObjId(player) > -1) {
            let index = mod.GetObjId(player);
            let jsPlayer = this.#allJsPlayers[index];
            
            if (!jsPlayer) {
                jsPlayer = new JsPlayer(player);
                this.#allJsPlayers[index] = jsPlayer;
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
            console.log("Removing Invalid JSPlayer:", invalidPlayerId);
        }
        
        // Clean up UI
        this.#allJsPlayers[invalidPlayerId]?.destroyUI();
        
        // Remove from dictionary
        delete this.#allJsPlayers[invalidPlayerId];
        
        // Remove from instances array
        let indexToRemove = -1;
        JsPlayer.playerInstances.forEach((player, i) => {
            if (mod.GetObjId(player) < 0) {
                indexToRemove = i;
            }
        });
        
        if (indexToRemove > -1) {
            JsPlayer.playerInstances.splice(indexToRemove, 1);
        }
    }
    
    /**
     * Clean up all UI elements
     */
    destroyUI(): void {
        this.lobbyUI?.close();
        this.messageUI?.close();
    }
}
