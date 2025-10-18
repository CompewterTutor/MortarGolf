/**
 * Game Flow Functions
 * 
 * Functions that control the main game flow and state transitions.
 */

import { 
    setCombatCountdownStarted, 
    setCombatStarted,
    decrementCombatStartDelayRemaining,
    combatStartDelayRemaining,
    team1Score,
    team2Score
} from './state';
import { UpdateAllLobbyUI, HideAllLobbyUI } from './messages';

export async function CombatCountdown(): Promise<void> {
    setCombatCountdownStarted(true);
    console.log("Combat Countdown Started");
    
    while (combatStartDelayRemaining > 0) {
        UpdateAllLobbyUI();
        await mod.Wait(1);
        decrementCombatStartDelayRemaining();
    }
    
    setCombatStarted(true);
    mod.DisablePlayerJoin();
    console.log("Combat Started");
    HideAllLobbyUI();
    return Promise.resolve();
}

export function CheckVictoryConditions(): boolean {
    // Implement your victory logic here
    // Return true if game should end
    
    // Example: Check team scores
    if (team1Score >= 10) {
        mod.EndGameMode(mod.GetTeam(1));
        return true;
    }
    
    if (team2Score >= 10) {
        mod.EndGameMode(mod.GetTeam(2));
        return true;
    }
    
    return false;
}
