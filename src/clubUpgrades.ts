/**
 * Club Upgrade System
 * 
 * Manages club upgrades, shop integration, and upgrade effects.
 * Players can purchase upgrades for their clubs to improve
 * distance, accuracy, and spin control.
 */

import { ClubType, ClubLevel, ClubUpgrade, PlayerClubUpgrades, GolfPlayer, Player } from './types';
import { MakeMessage } from './helpers';
import { getClubMaxDistance } from './shots';
import { GolfPlayer as GolfPlayerClass } from './player';

///////////////////////////////////////////////////////////////////////////////
// CLUB UPGRADE DATA
///////////////////////////////////////////////////////////////////////////////

/**
 * All available club upgrades
 */
const CLUB_UPGRADES: ClubUpgrade[] = [
    // Driver Upgrades
    {
        club: ClubType.Driver,
        level: ClubLevel.Pro,
        price: 500,
        distanceBonus: 1.15,    // 15% more distance
        accuracyBonus: 0.1,     // 10% more accuracy
        spinBonus: 0.05,        // 5% more spin control
        name: MakeMessage('proDriver'),
        description: MakeMessage('proDriverDesc')
    },
    {
        club: ClubType.Driver,
        level: ClubLevel.Elite,
        price: 1500,
        distanceBonus: 1.30,    // 30% more distance
        accuracyBonus: 0.2,     // 20% more accuracy
        spinBonus: 0.1,        // 10% more spin control
        name: MakeMessage('eliteDriver'),
        description: MakeMessage('eliteDriverDesc')
    },
    
    // Iron Upgrades
    {
        club: ClubType.Iron,
        level: ClubLevel.Pro,
        price: 400,
        distanceBonus: 1.12,    // 12% more distance
        accuracyBonus: 0.15,    // 15% more accuracy
        spinBonus: 0.08,        // 8% more spin control
        name: MakeMessage('proIron'),
        description: MakeMessage('proIronDesc')
    },
    {
        club: ClubType.Iron,
        level: ClubLevel.Elite,
        price: 1200,
        distanceBonus: 1.25,    // 25% more distance
        accuracyBonus: 0.25,    // 25% more accuracy
        spinBonus: 0.15,       // 15% more spin control
        name: MakeMessage('eliteIron'),
        description: MakeMessage('eliteIronDesc')
    },
    
    // Wedge Upgrades
    {
        club: ClubType.Wedge,
        level: ClubLevel.Pro,
        price: 350,
        distanceBonus: 1.10,    // 10% more distance
        accuracyBonus: 0.2,     // 20% more accuracy
        spinBonus: 0.12,       // 12% more spin control
        name: MakeMessage('proWedge'),
        description: MakeMessage('proWedgeDesc')
    },
    {
        club: ClubType.Wedge,
        level: ClubLevel.Elite,
        price: 1000,
        distanceBonus: 1.20,    // 20% more distance
        accuracyBonus: 0.3,     // 30% more accuracy
        spinBonus: 0.2,        // 20% more spin control
        name: MakeMessage('eliteWedge'),
        description: MakeMessage('eliteWedgeDesc')
    },
    
    // Putter Upgrades
    {
        club: ClubType.Putter,
        level: ClubLevel.Pro,
        price: 300,
        distanceBonus: 1.08,    // 8% more distance (better range)
        accuracyBonus: 0.25,    // 25% more accuracy
        spinBonus: 0.1,        // 10% more spin control
        name: MakeMessage('proPutter'),
        description: MakeMessage('proPutterDesc')
    },
    {
        club: ClubType.Putter,
        level: ClubLevel.Elite,
        price: 800,
        distanceBonus: 1.15,    // 15% more distance
        accuracyBonus: 0.4,     // 40% more accuracy
        spinBonus: 0.2,        // 20% more spin control
        name: MakeMessage('elitePutter'),
        description: MakeMessage('elitePutterDesc')
    }
];

///////////////////////////////////////////////////////////////////////////////
// PLAYER UPGRADE MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Get default club upgrades for new players
 */
export function getDefaultClubUpgrades(): PlayerClubUpgrades {
    return {
        driverLevel: ClubLevel.Standard,
        ironLevel: ClubLevel.Standard,
        wedgeLevel: ClubLevel.Standard,
        putterLevel: ClubLevel.Standard
    };
}

/**
 * Get upgrade for specific club and level
 */
export function getClubUpgrade(club: ClubType, level: ClubLevel): ClubUpgrade | null {
    return CLUB_UPGRADES.find(upgrade => 
        upgrade.club === club && upgrade.level === level
    ) || null;
}

/**
 * Get all available upgrades for a club
 */
export function getAvailableUpgrades(club: ClubType, currentLevel: ClubLevel): ClubUpgrade[] {
    return CLUB_UPGRADES.filter(upgrade => 
        upgrade.club === club && 
        (upgrade.level === ClubLevel.Pro && currentLevel === ClubLevel.Standard ||
         upgrade.level === ClubLevel.Elite && currentLevel === ClubLevel.Pro)
    );
}

/**
 * Get player's current club level
 */
export function getPlayerClubLevel(golfPlayer: GolfPlayer, club: ClubType): ClubLevel {
    switch (club) {
        case ClubType.Driver:
            return golfPlayer.clubUpgrades.driverLevel;
        case ClubType.Iron:
            return golfPlayer.clubUpgrades.ironLevel;
        case ClubType.Wedge:
            return golfPlayer.clubUpgrades.wedgeLevel;
        case ClubType.Putter:
            return golfPlayer.clubUpgrades.putterLevel;
        default:
            return ClubLevel.Standard;
    }
}

/**
 * Check if player can afford upgrade
 */
export function canAffordUpgrade(golfPlayer: GolfPlayer, upgrade: ClubUpgrade): boolean {
    return golfPlayer.money >= upgrade.price;
}

/**
 * Purchase club upgrade for player
 */
export function purchaseClubUpgrade(player: Player, club: ClubType, level: ClubLevel): boolean {
    const golfPlayer = GolfPlayerClass.get(player);
    if (!golfPlayer) {
        console.log('[ClubUpgrades] purchaseClubUpgrade: Player not found');
        return false;
    }
    
    const upgrade = getClubUpgrade(club, level);
    if (!upgrade) {
        console.log('[ClubUpgrades] purchaseClubUpgrade: Upgrade not found');
        return false;
    }
    
    // Check if player already has this level or higher
    const currentLevel = getPlayerClubLevel(golfPlayer, club);
    if (level <= currentLevel) {
        mod.DisplayNotificationMessage(
            MakeMessage('upgradeAlreadyOwned'),
            player
        );
        return false;
    }
    
    // Check if player can afford it
    if (!canAffordUpgrade(golfPlayer, upgrade)) {
        mod.DisplayNotificationMessage(
            MakeMessage('notEnoughMoney'),
            player
        );
        return false;
    }
    
    // Purchase upgrade
    golfPlayer.money -= upgrade.price;
    
    // Update club level
    switch (club) {
        case ClubType.Driver:
            golfPlayer.clubUpgrades.driverLevel = level;
            break;
        case ClubType.Iron:
            golfPlayer.clubUpgrades.ironLevel = level;
            break;
        case ClubType.Wedge:
            golfPlayer.clubUpgrades.wedgeLevel = level;
            break;
        case ClubType.Putter:
            golfPlayer.clubUpgrades.putterLevel = level;
            break;
    }
    
    // Notify player
    mod.DisplayNotificationMessage(
        MakeMessage('upgradePurchased', upgrade.name),
        player
    );
    
    console.log(`[ClubUpgrades] ${mod.GetPlayerName(player)} purchased ${upgrade.name} for ${upgrade.price}`);
    return true;
}

/**
 * Get upgraded club distance with bonuses
 */
export function getUpgradedClubDistance(club: ClubType, level: ClubLevel): number {
    const baseDistance = getClubMaxDistance(club);
    const upgrade = getClubUpgrade(club, level);
    
    if (!upgrade || level === ClubLevel.Standard) {
        return baseDistance;
    }
    
    return Math.floor(baseDistance * upgrade.distanceBonus);
}

/**
 * Get upgraded club accuracy with bonuses
 */
export function getUpgradedClubAccuracy(club: ClubType, level: ClubLevel): number {
    const upgrade = getClubUpgrade(club, level);
    
    if (!upgrade || level === ClubLevel.Standard) {
        return 1.0; // Base accuracy
    }
    
    return 1.0 + upgrade.accuracyBonus;
}

/**
 * Get upgraded club spin with bonuses
 */
export function getUpgradedClubSpin(club: ClubType, level: ClubLevel): number {
    const upgrade = getClubUpgrade(club, level);
    
    if (!upgrade || level === ClubLevel.Standard) {
        return 1.0; // Base spin
    }
    
    return 1.0 + upgrade.spinBonus;
}

///////////////////////////////////////////////////////////////////////////////
// SHOP INTEGRATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Get all club upgrades available for purchase
 */
export function getShopClubUpgrades(golfPlayer: GolfPlayer): ClubUpgrade[] {
    const availableUpgrades: ClubUpgrade[] = [];
    
    // Check each club type
    const clubs = [ClubType.Driver, ClubType.Iron, ClubType.Wedge, ClubType.Putter];
    
    for (const club of clubs) {
        const currentLevel = getPlayerClubLevel(golfPlayer, club);
        const upgrades = getAvailableUpgrades(club, currentLevel);
        availableUpgrades.push(...upgrades);
    }
    
    return availableUpgrades;
}

/**
 * Format upgrade price for display
 */
export function formatUpgradePrice(price: number): string {
    return `$${price}`;
}

/**
 * Get upgrade level display name
 */
export function getLevelDisplayName(level: ClubLevel): string {
    switch (level) {
        case ClubLevel.Standard:
            return MakeMessage('standardLevel');
        case ClubLevel.Pro:
            return MakeMessage('proLevel');
        case ClubLevel.Elite:
            return MakeMessage('eliteLevel');
        default:
            return 'Unknown';
    }
}