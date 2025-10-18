/**
 * Message System
 * 
 * Functions for displaying messages to players.
 */

import { JsPlayer } from './player';
import { messageDisplayTime } from './constants';
import { messageTime, setMessageTime, decrementMessageTime } from './state';

export function MessageAllUI(message: mod.Message, textColor: number[]): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        
        if (jsPlayer.messageUI?.isOpen()) {
            jsPlayer.messageUI.refresh(message);
        } else {
            jsPlayer.messageUI?.open(message, textColor);
        }
    });
    setMessageTime(messageDisplayTime);
}

export function HideAllMessageUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.messageUI?.close();
    });
}

export function UpdateAllLobbyUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.lobbyUI?.refresh();
    });
}

export function HideAllLobbyUI(): void {
    JsPlayer.playerInstances.forEach(player => {
        let jsPlayer = JsPlayer.get(player);
        if (!jsPlayer) return;
        jsPlayer.lobbyUI?.close();
    });
}

export async function UpdateMessages(): Promise<void> {
    if (messageTime > 0) {
        decrementMessageTime();
        if (messageTime <= 0) {
            HideAllMessageUI();
            setMessageTime(0);
        }
    }
}
