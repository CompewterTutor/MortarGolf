/**
 * Update Loops
 * 
 * Main update loops that run continuously during gameplay.
 * Different logic runs based on current game state.
 */

import * as state from './state';
import { GameState } from './types';
import { tickRate, slowTickRate } from './constants';
import { UpdateMessages } from './messages';
import { CheckVictoryConditions } from './gameflow';
import { GolfPlayer } from './player';
import * as stateMachine from './statemachine';
import { MatchmakingQueue } from './matchmaking';
import { Foursome } from './foursome';
import { updateHazardSystem } from './hazards';

///////////////////////////////////////////////////////////////////////////////
// FAST UPDATE LOOP (60fps)
///////////////////////////////////////////////////////////////////////////////

export async function TickUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(tickRate);
        
        if (state.gameOver || stateMachine.isGamePaused()) continue;
        
        const currentState = state.gameState;
        
        switch (currentState) {
            case GameState.Lobby:
                updateLobbyTick();
                break;
            
            case GameState.TeeTime:
                updateTeeTimeTick();
                break;
            
            case GameState.Countdown:
                updateCountdownTick();
                break;
            
            case GameState.Playing:
                updatePlayingTick();
                break;
            
            case GameState.Shopping:
                updateShoppingTick();
                break;
            
            case GameState.RoundEnd:
                updateRoundEndTick();
                break;
            
            case GameState.GameOver:
                updateGameOverTick();
                break;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// SLOW UPDATE LOOP (1 second)
///////////////////////////////////////////////////////////////////////////////

export async function ThrottledUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(slowTickRate);
        
        if (state.gameOver || stateMachine.isGamePaused()) continue;
        
        const currentState = state.gameState;
        
        // Update messages across all states
        UpdateMessages();
        
        // Decrement state timer
        stateMachine.decrementStateTimer();
        
        switch (currentState) {
            case GameState.Lobby:
                updateLobbyThrottled();
                break;
            
            case GameState.TeeTime:
                updateTeeTimeThrottled();
                break;
            
            case GameState.Countdown:
                updateCountdownThrottled();
                break;
            
            case GameState.Playing:
                updatePlayingThrottled();
                break;
            
            case GameState.Shopping:
                updateShoppingThrottled();
                break;
            
            case GameState.RoundEnd:
                updateRoundEndThrottled();
                break;
            
            case GameState.GameOver:
                updateGameOverThrottled();
                break;
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// LOBBY STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateLobbyTick(): void {
    // Fast checks for lobby
    // - Player position updates
    // - UI animations
}

function updateLobbyThrottled(): void {
    // Process matchmaking queue
    MatchmakingQueue.processQueue();
    
    // Check if we have enough players to start
    if (stateMachine.isStateTimerExpired()) {
        const playerCount = GolfPlayer.playerInstances.length;
        if (playerCount > 0) {
            // Start the game
            stateMachine.startTeeTime();
        } else {
            // Reset timer if no players
            stateMachine.setStateTimer(10);
        }
    }
    
    // Display countdown
    const timer = stateMachine.getStateTimer();
    if (timer <= 10 && timer > 0) {
        // TODO: Display countdown UI
    }
}

///////////////////////////////////////////////////////////////////////////////
// TEE TIME STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateTeeTimeTick(): void {
    // Fast checks for tee time
    // - Check if players reached tee box
    // - Update distance markers
}

function updateTeeTimeThrottled(): void {
    // Check if all players are ready at tee box
    // For now, just use timer
    if (stateMachine.isStateTimerExpired()) {
        stateMachine.startCountdown();
    }
    
    // Display timer
    const timer = stateMachine.getStateTimer();
    if (timer > 0) {
        // TODO: Update UI with "Get to tee box: XX seconds"
    }
}

///////////////////////////////////////////////////////////////////////////////
// COUNTDOWN STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateCountdownTick(): void {
    // Fast checks for countdown
    // - Animation updates
}

function updateCountdownThrottled(): void {
    const timer = stateMachine.getStateTimer();
    
    // Display countdown
    if (timer > 0) {
        mod.DisplayHighlightedWorldLogMessage(
            mod.Message(`Starting in ${timer}...`)
        );
    }
    
    // Transition to playing when countdown ends
    if (stateMachine.isStateTimerExpired()) {
        stateMachine.startPlaying();
    }
}

///////////////////////////////////////////////////////////////////////////////
// PLAYING STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updatePlayingTick(): void {
    // Fast checks during gameplay
    // - Shot trajectory preview
    // - Player positions relative to hole
    // - Out of bounds detection
    // - Distance to pin calculations
    
    // Update hazard system (fast updates for wind, destructibles, etc.)
    updateHazardSystem(state.currentHoleNumber);
    
    GolfPlayer.getAllGolfers().forEach(golfPlayer => {
        if (!mod.IsPlayerValid(golfPlayer.player)) return;
        
        // Update player-specific fast logic
        // - Shot power meter
        // - Aiming reticle
        // - Cart position
    });
}

function updatePlayingThrottled(): void {
    // Slow checks during gameplay
    // - Hole completion status
    // - Shot timeouts
    // - Player statistics
    
    GolfPlayer.getAllGolfers().forEach(golfPlayer => {
        if (!mod.IsPlayerValid(golfPlayer.player)) return;
        
        // Update player UI
        // - Score display
        // - Stroke count
        // - Distance to pin
    });
    
    // Check if all players have holed out
    checkAllPlayersComplete();
    
    // Check victory conditions (if needed)
    if (state.combatStarted) {
        CheckVictoryConditions();
    }
}

///////////////////////////////////////////////////////////////////////////////
// SHOPPING STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateShoppingTick(): void {
    // Fast checks during shopping
    // - Shop UI interactions
}

function updateShoppingThrottled(): void {
    const timer = stateMachine.getStateTimer();
    
    // Display remaining shop time
    if (timer > 0 && timer <= 10) {
        // Notify each player individually
        GolfPlayer.getAll().forEach(golfPlayer => {
            if (mod.IsPlayerValid(golfPlayer.player)) {
                mod.DisplayNotificationMessage(
                    mod.Message("shopOpening", timer),
                    golfPlayer.player
                );
            }
        });
    }
    
    // Close shop when timer expires
    if (stateMachine.isStateTimerExpired()) {
        mod.DisplayHighlightedWorldLogMessage(
            mod.Message("shopClosed")
        );
        
        // Move to next hole
        stateMachine.nextHole();
    }
}

///////////////////////////////////////////////////////////////////////////////
// ROUND END STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateRoundEndTick(): void {
    // Fast checks for round end
    // - Scoreboard animations
}

function updateRoundEndThrottled(): void {
    // Display scores and stats
    // Timer handles automatic transition
    
    if (stateMachine.isStateTimerExpired()) {
        // Check if more holes remain
        if (state.currentHoleNumber < 9) { // TODO: Use totalHoles constant
            // Open shop
            stateMachine.openShop();
        } else {
            // End game
            stateMachine.endRound();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// GAME OVER STATE UPDATES
///////////////////////////////////////////////////////////////////////////////

function updateGameOverTick(): void {
    // Fast checks for game over
    // - Final animations
}

function updateGameOverThrottled(): void {
    // Display final scores
    // Generate passcodes
    // Wait for players to review
    
    // Eventually return to lobby or close match
}

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Check if all players have completed the current hole
 */
function checkAllPlayersComplete(): void {
    const foursomes = Foursome.getActiveFoursomes();
    
    for (const foursome of foursomes) {
        if (foursome.currentHole === state.currentHoleNumber) {
            if (foursome.areAllPlayersComplete()) {
                // This foursome is done with the hole
                // Transition to round end or shop
                stateMachine.endHole();
                return;
            }
        }
    }
}

/**
 * Update player UI elements
 */
function updatePlayerUI(golfPlayer: GolfPlayer): void {
    if (!mod.IsPlayerValid(golfPlayer.player)) return;
    
    // Update HUD elements based on state
    // - Score
    // - Timer
    // - Distance to pin
    // - Current club
    // - Shot count
}
