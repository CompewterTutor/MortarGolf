/**
 * Course Management
 * 
 * Handles all course-related logic including hole data retrieval,
 * course initialization, and hole validation.
 */

import { HoleData } from './types';
import { COURSE_HOLES, totalHoles } from './constants';
import { getCurrentHoleNumber } from './state';

///////////////////////////////////////////////////////////////////////////////
// COURSE INITIALIZATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize the course system
 * Validates course data and prepares for play
 */
export function initializeCourse(): boolean {
    // Validate course data
    if (COURSE_HOLES.length !== totalHoles) {
        console.error(`[Course] Invalid course data: Expected ${totalHoles} holes, got ${COURSE_HOLES.length}`);
        return false;
    }
    
    // Validate each hole
    for (let i = 0; i < COURSE_HOLES.length; i++) {
        const hole = COURSE_HOLES[i];
        
        // Check hole number matches index
        if (hole.number !== i + 1) {
            console.error(`[Course] Hole ${i + 1} has incorrect number: ${hole.number}`);
            return false;
        }
        
        // Validate hole data
        if (!validateHoleData(hole)) {
            console.error(`[Course] Invalid data for hole ${hole.number}`);
            return false;
        }
    }
    
    console.log(`[Course] Successfully initialized ${totalHoles}-hole course`);
    console.log(`[Course] Total par: ${COURSE_HOLES.reduce((sum, h) => sum + h.par, 0)}`);
    console.log(`[Course] Total distance: ${COURSE_HOLES.reduce((sum, h) => sum + h.distance, 0)}m`);
    
    return true;
}

/**
 * Validate hole data structure
 */
function validateHoleData(hole: HoleData): boolean {
    // Check required fields
    if (hole.number < 1 || hole.number > totalHoles) {
        console.error(`[Course] Invalid hole number: ${hole.number}`);
        return false;
    }
    
    if (hole.par < 3 || hole.par > 5) {
        console.warn(`[Course] Unusual par value for hole ${hole.number}: ${hole.par}`);
    }
    
    if (hole.distance < 50 || hole.distance > 500) {
        console.warn(`[Course] Unusual distance for hole ${hole.number}: ${hole.distance}m`);
    }
    
    if (hole.greenRadius < 5 || hole.greenRadius > 30) {
        console.warn(`[Course] Unusual green radius for hole ${hole.number}: ${hole.greenRadius}m`);
    }
    
    if (hole.fairwayWidth < 15 || hole.fairwayWidth > 100) {
        console.warn(`[Course] Unusual fairway width for hole ${hole.number}: ${hole.fairwayWidth}m`);
    }
    
    // Check positions exist
    if (!hole.teePosition || !hole.greenPosition) {
        console.error(`[Course] Missing position data for hole ${hole.number}`);
        return false;
    }
    
    return true;
}

///////////////////////////////////////////////////////////////////////////////
// HOLE DATA RETRIEVAL
///////////////////////////////////////////////////////////////////////////////

/**
 * Get hole data by hole number (1-9)
 * @param holeNumber The hole number (1-based)
 * @returns HoleData or null if invalid
 */
export function getCourseHole(holeNumber: number): HoleData | null {
    if (!validateHoleNumber(holeNumber)) {
        console.error(`[Course] Invalid hole number: ${holeNumber}`);
        return null;
    }
    
    // Convert 1-based to 0-based index
    return COURSE_HOLES[holeNumber - 1];
}

/**
 * Get the current hole data based on game state
 * @returns Current HoleData or null if not playing
 */
export function getCurrentHole(): HoleData | null {
    const currentHoleNum = getCurrentHoleNumber();
    
    if (currentHoleNum === 0) {
        console.warn('[Course] No current hole - not in play');
        return null;
    }
    
    return getCourseHole(currentHoleNum);
}

/**
 * Get all holes on the course
 * @returns Array of all HoleData
 */
export function getAllHoles(): HoleData[] {
    return COURSE_HOLES;
}

/**
 * Get the first hole
 * @returns First HoleData
 */
export function getFirstHole(): HoleData {
    return COURSE_HOLES[0];
}

/**
 * Get the last hole
 * @returns Last HoleData
 */
export function getLastHole(): HoleData {
    return COURSE_HOLES[totalHoles - 1];
}

///////////////////////////////////////////////////////////////////////////////
// HOLE NAVIGATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Get the next hole number
 * @param currentHole Current hole number (1-based)
 * @returns Next hole number or 0 if at end
 */
export function getNextHoleNumber(currentHole: number): number {
    if (!validateHoleNumber(currentHole)) {
        return 0;
    }
    
    if (currentHole >= totalHoles) {
        return 0; // Course complete
    }
    
    return currentHole + 1;
}

/**
 * Get the previous hole number
 * @param currentHole Current hole number (1-based)
 * @returns Previous hole number or 0 if at start
 */
export function getPreviousHoleNumber(currentHole: number): number {
    if (!validateHoleNumber(currentHole)) {
        return 0;
    }
    
    if (currentHole <= 1) {
        return 0; // At first hole
    }
    
    return currentHole - 1;
}

///////////////////////////////////////////////////////////////////////////////
// VALIDATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Validate a hole number is within valid range
 * @param holeNumber Hole number to validate (1-based)
 * @returns True if valid
 */
export function validateHoleNumber(holeNumber: number): boolean {
    return holeNumber >= 1 && holeNumber <= totalHoles;
}

/**
 * Check if this is the first hole
 * @param holeNumber Hole number to check (1-based)
 * @returns True if first hole
 */
export function isFirstHole(holeNumber: number): boolean {
    return holeNumber === 1;
}

/**
 * Check if this is the last hole
 * @param holeNumber Hole number to check (1-based)
 * @returns True if last hole
 */
export function isLastHole(holeNumber: number): boolean {
    return holeNumber === totalHoles;
}

/**
 * Check if course is complete
 * @param currentHole Current hole number (1-based)
 * @returns True if all holes completed
 */
export function isCourseComplete(currentHole: number): boolean {
    return currentHole > totalHoles;
}

///////////////////////////////////////////////////////////////////////////////
// COURSE STATISTICS
///////////////////////////////////////////////////////////////////////////////

/**
 * Calculate total par for a range of holes
 * @param startHole Starting hole (1-based, inclusive)
 * @param endHole Ending hole (1-based, inclusive)
 * @returns Total par for range
 */
export function getTotalParForRange(startHole: number, endHole: number): number {
    if (!validateHoleNumber(startHole) || !validateHoleNumber(endHole)) {
        return 0;
    }
    
    let totalPar = 0;
    for (let i = startHole; i <= endHole; i++) {
        const hole = getCourseHole(i);
        if (hole) {
            totalPar += hole.par;
        }
    }
    
    return totalPar;
}

/**
 * Calculate total distance for a range of holes
 * @param startHole Starting hole (1-based, inclusive)
 * @param endHole Ending hole (1-based, inclusive)
 * @returns Total distance in meters
 */
export function getTotalDistanceForRange(startHole: number, endHole: number): number {
    if (!validateHoleNumber(startHole) || !validateHoleNumber(endHole)) {
        return 0;
    }
    
    let totalDistance = 0;
    for (let i = startHole; i <= endHole; i++) {
        const hole = getCourseHole(i);
        if (hole) {
            totalDistance += hole.distance;
        }
    }
    
    return totalDistance;
}

/**
 * Get course difficulty rating (average par)
 * @returns Average par across all holes
 */
export function getCourseDifficulty(): number {
    const totalPar = COURSE_HOLES.reduce((sum, h) => sum + h.par, 0);
    return totalPar / totalHoles;
}

/**
 * Get par for specific hole type
 * @param parValue Par value (3, 4, or 5)
 * @returns Array of hole numbers with that par
 */
export function getHolesByPar(parValue: number): number[] {
    return COURSE_HOLES
        .filter(h => h.par === parValue)
        .map(h => h.number);
}

///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Format hole name with number and par
 * @param holeNumber Hole number (1-based)
 * @returns Formatted string like "Hole 1 - Par 4 - The Opening Drive"
 */
export function formatHoleName(holeNumber: number): string {
    const hole = getCourseHole(holeNumber);
    if (!hole) {
        return `Hole ${holeNumber}`;
    }
    
    let name = `Hole ${hole.number} - Par ${hole.par}`;
    if (hole.name) {
        name += ` - ${hole.name}`;
    }
    return name;
}

/**
 * Format hole info with distance
 * @param holeNumber Hole number (1-based)
 * @returns Formatted string like "Hole 1: Par 4, 180m"
 */
export function formatHoleInfo(holeNumber: number): string {
    const hole = getCourseHole(holeNumber);
    if (!hole) {
        return `Hole ${holeNumber}`;
    }
    
    return `Hole ${hole.number}: Par ${hole.par}, ${hole.distance}m`;
}

/**
 * Get course progress percentage
 * @param currentHole Current hole number (1-based)
 * @returns Progress as percentage (0-100)
 */
export function getCourseProgress(currentHole: number): number {
    if (!validateHoleNumber(currentHole)) {
        return 0;
    }
    
    return Math.round((currentHole / totalHoles) * 100);
}

/**
 * Get holes remaining
 * @param currentHole Current hole number (1-based)
 * @returns Number of holes remaining
 */
export function getHolesRemaining(currentHole: number): number {
    if (!validateHoleNumber(currentHole)) {
        return 0;
    }
    
    return totalHoles - currentHole;
}
