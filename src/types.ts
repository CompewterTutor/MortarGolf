/**
 * Type Definitions
 * 
 * All custom types, interfaces, and enums used throughout the mod.
 */

export type Widget = mod.UIWidget;
export type Dict = { [key: string]: any };

export enum GameState {
    Lobby,
    Countdown,
    InProgress,
    Ended
}
