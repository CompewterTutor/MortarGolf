/**
 * Update Loops
 * 
 * Main update loops that run continuously during gameplay.
 */

import { gameOver, combatStarted } from './state';
import { tickRate, slowTickRate } from './constants';
import { UpdateMessages } from './messages';
import { CheckVictoryConditions } from './gameflow';
import { JsPlayer } from './player';

export async function TickUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(tickRate);
        
        if (gameOver) continue;
        
        // Fast update logic here (60fps)
        // - Proximity checks
        // - Progress bars
        // - Input handling
    }
}

export async function ThrottledUpdate(): Promise<void> {
    while (true) {
        await mod.Wait(slowTickRate);
        
        if (gameOver) continue;
        
        // Slow update logic here (1 second)
        UpdateMessages();
        
        JsPlayer.playerInstances.forEach(player => {
            if (!mod.IsPlayerValid(player)) return;
            
            // Update player-specific logic
            // - UI refreshes
            // - Position checks
            // - Timers
        });
        
        // Check victory conditions
        if (combatStarted) {
            CheckVictoryConditions();
        }
    }
}
