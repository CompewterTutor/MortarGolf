/**
 * UI Classes
 * 
 * All UI-related classes for managing player interfaces.
 */

import { MakeMessage } from './helpers';
import { 
    combatCountdownStarted, 
    combatStartDelayRemaining, 
    initialPlayerCount 
} from './state';
import { 
    minimumInitialPlayerCount,
    ZEROVEC 
} from './constants';

export class LobbyUI {
    #jsPlayer: any; // JsPlayer type (avoiding circular dependency)
    #rootWidget: mod.UIWidget | undefined;
    #statusText: mod.UIWidget | undefined;
    #isVisible: boolean = false;
    
    #containerWidth = 700;
    #containerHeight = 300;
    
    constructor(jsPlayer: any) {
        this.#jsPlayer = jsPlayer;
    }
    
    open(): void {
        if (!this.#rootWidget) this.#create();
        if (!this.#rootWidget) return;
        
        mod.SetUIWidgetVisible(this.#rootWidget, true);
        this.#isVisible = true;
    }
    
    close(): void {
        if (this.#rootWidget) {
            mod.SetUIWidgetVisible(this.#rootWidget, false);
            this.#isVisible = false;
        }
    }
    
    refresh(): void {
        if (!this.#statusText) return;
        
        if (combatCountdownStarted) {
            mod.SetUITextLabel(
                this.#statusText,
                MakeMessage(mod.stringkeys.combatStartDelayCountdown || "Starting in {0}...", combatStartDelayRemaining)
            );
        } else {
            mod.SetUITextLabel(
                this.#statusText,
                MakeMessage(mod.stringkeys.waitingforplayersX || "Waiting for players: {0}/{1}", initialPlayerCount, minimumInitialPlayerCount)
            );
        }
    }
    
    isOpen(): boolean {
        return this.#isVisible;
    }
    
    #create(): void {
        mod.AddUIContainer(
            "LobbyContainer",
            mod.CreateVector(0, 100, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.TopCenter,
            mod.GetUIRoot(),
            true,
            0,
            mod.CreateVector(0.1, 0.1, 0.1),
            1,
            mod.UIBgFill.Blur,
            this.#jsPlayer.player
        );
        
        this.#rootWidget = mod.FindUIWidgetWithName("LobbyContainer") as mod.UIWidget;
        if (!this.#rootWidget) return;
        
        mod.AddUIText(
            "LobbyStatusText",
            mod.CreateVector(0, -30, 0),
            mod.CreateVector(this.#containerWidth, 50, 0),
            mod.UIAnchor.BottomCenter,
            this.#rootWidget,
            true,
            8,
            ZEROVEC,
            0,
            mod.UIBgFill.None,
            MakeMessage(mod.stringkeys.waitingforplayersX || "Waiting...", 0, minimumInitialPlayerCount),
            36,
            mod.CreateVector(1, 1, 1),
            1,
            mod.UIAnchor.Center,
            this.#jsPlayer.player
        );
        
        this.#statusText = mod.FindUIWidgetWithName("LobbyStatusText") as mod.UIWidget;
    }
}

export class MessageUI {
    #jsPlayer: any; // JsPlayer type
    #rootWidget: mod.UIWidget | undefined;
    #messageText: mod.UIWidget | undefined;
    #isVisible: boolean = false;
    
    #containerWidth = 700;
    #containerHeight = 100;
    
    constructor(jsPlayer: any) {
        this.#jsPlayer = jsPlayer;
    }
    
    open(message: mod.Message, textColor: number[]): void {
        if (!this.#rootWidget) {
            this.#create(message, textColor);
        } else {
            this.refresh(message);
            if (this.#messageText && textColor.length >= 3) {
                mod.SetUITextColor(this.#messageText, mod.CreateVector(textColor[0], textColor[1], textColor[2]));
            }
        }
        
        if (!this.#rootWidget) return;
        mod.SetUIWidgetVisible(this.#rootWidget, true);
        this.#isVisible = true;
    }
    
    close(): void {
        if (this.#rootWidget) {
            mod.SetUIWidgetVisible(this.#rootWidget, false);
            this.#isVisible = false;
        }
    }
    
    refresh(message: mod.Message): void {
        if (!this.#messageText) return;
        mod.SetUITextLabel(this.#messageText, message);
    }
    
    isOpen(): boolean {
        return this.#isVisible;
    }
    
    #create(message: mod.Message, textColor: number[]): void {
        mod.AddUIContainer(
            "MessageContainer",
            mod.CreateVector(0, 25, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.TopCenter,
            mod.GetUIRoot(),
            true,
            0,
            ZEROVEC,
            0.8,
            mod.UIBgFill.Blur,
            this.#jsPlayer.player
        );
        
        this.#rootWidget = mod.FindUIWidgetWithName("MessageContainer") as mod.UIWidget;
        if (!this.#rootWidget) return;
        
        mod.AddUIText(
            "MessageText",
            mod.CreateVector(0, 0, 0),
            mod.CreateVector(this.#containerWidth, this.#containerHeight, 0),
            mod.UIAnchor.Center,
            this.#rootWidget,
            true,
            8,
            ZEROVEC,
            0,
            mod.UIBgFill.None,
            message,
            36,
            mod.CreateVector(textColor[0], textColor[1], textColor[2]),
            1,
            mod.UIAnchor.Center,
            this.#jsPlayer.player
        );
        
        this.#messageText = mod.FindUIWidgetWithName("MessageText") as mod.UIWidget;
    }
}
