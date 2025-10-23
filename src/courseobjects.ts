/**
 * Course Objects
 * 
 * Manages all physical course objects including area triggers, markers,
 * visual elements, and course infrastructure. This module handles the
 * creation, placement, and management of all course objects that players
 * interact with during gameplay.
 */

import { HoleData, HazardData } from './types';
import { COURSE_HOLES, totalHoles } from './constants';
import { getCurrentHoleNumber } from './state';
import { getCourseHole } from './course';
import { TeamColor } from './foursome';

///////////////////////////////////////////////////////////////////////////////
// COURSE OBJECT IDs
///////////////////////////////////////////////////////////////////////////////

/**
 * Object ID ranges for different course elements.
 * These must match the Godot level setup with actual trigger objects.
 */
export const CourseObjectIDs = {
    // Tee Box Triggers (1-9)
    TEE_BOX_START: 1000,
    TEE_BOX_END: 1008,
    
    // Green Triggers (10-18)
    GREEN_START: 1010,
    GREEN_END: 1018,
    
    // Fairway Triggers (19-27)
    FAIRWAY_START: 1019,
    FAIRWAY_END: 1027,
    
    // Rough Triggers (28-36)
    ROUGH_START: 1028,
    ROUGH_END: 1036,
    
    // Out of Bounds Triggers (37-45)
    OUT_OF_BOUNDS_START: 1037,
    OUT_OF_BOUNDS_END: 1045,
    
    // Pin/Flag Markers (46-54)
    PIN_MARKER_START: 1046,
    PIN_MARKER_END: 1054,
    
    // Distance Markers (55-100)
    DISTANCE_MARKER_START: 1055,
    DISTANCE_MARKER_END: 1100,
    
    // Hazard Objects (101-200)
    HAZARD_START: 1101,
    HAZARD_END: 1200,
    
    // Visual Elements (201-300)
    VISUAL_START: 1201,
    VISUAL_END: 1300
} as const;

///////////////////////////////////////////////////////////////////////////////
// COURSE OBJECT STATE
///////////////////////////////////////////////////////////////////////////////

/**
 * Active course objects cache for performance.
 * Prevents repeated SDK calls for the same objects.
 */
interface CourseObjectCache {
    teeBoxes: Map<number, mod.AreaTrigger | null>;
    greens: Map<number, mod.AreaTrigger | null>;
    fairways: Map<number, mod.AreaTrigger | null>;
    roughs: Map<number, mod.AreaTrigger | null>;
    outOfBounds: Map<number, mod.AreaTrigger | null>;
    pinMarkers: Map<number, mod.WorldObject | null>;
    distanceMarkers: Map<number, mod.WorldObject | null>;
    hazards: Map<number, mod.WorldObject | null>;
    visualElements: Map<number, mod.WorldObject | null>;
}

let courseObjectCache: CourseObjectCache = {
    teeBoxes: new Map(),
    greens: new Map(),
    fairways: new Map(),
    roughs: new Map(),
    outOfBounds: new Map(),
    pinMarkers: new Map(),
    distanceMarkers: new Map(),
    hazards: new Map(),
    visualElements: new Map()
};

///////////////////////////////////////////////////////////////////////////////
// AREA TRIGGER MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Get the area trigger ID for a specific hole and zone type.
 */
export function getAreaTriggerId(holeNumber: number, zoneType: 'tee' | 'green' | 'fairway' | 'rough' | 'oob'): number {
    switch (zoneType) {
        case 'tee':
            return CourseObjectIDs.TEE_BOX_START + (holeNumber - 1);
        case 'green':
            return CourseObjectIDs.GREEN_START + (holeNumber - 1);
        case 'fairway':
            return CourseObjectIDs.FAIRWAY_START + (holeNumber - 1);
        case 'rough':
            return CourseObjectIDs.ROUGH_START + (holeNumber - 1);
        case 'oob':
            return CourseObjectIDs.OUT_OF_BOUNDS_START + (holeNumber - 1);
        default:
            throw new Error(`Unknown zone type: ${zoneType}`);
    }
}

/**
 * Get an area trigger by hole and zone type.
 * Uses caching to avoid repeated SDK calls.
 */
export function getAreaTrigger(holeNumber: number, zoneType: 'tee' | 'green' | 'fairway' | 'rough' | 'oob'): mod.AreaTrigger | null {
    const triggerId = getAreaTriggerId(holeNumber, zoneType);
    let cache: Map<number, mod.AreaTrigger | null>;
    
    switch (zoneType) {
        case 'tee':
            cache = courseObjectCache.teeBoxes;
            break;
        case 'green':
            cache = courseObjectCache.greens;
            break;
        case 'fairway':
            cache = courseObjectCache.fairways;
            break;
        case 'rough':
            cache = courseObjectCache.roughs;
            break;
        case 'oob':
            cache = courseObjectCache.outOfBounds;
            break;
    }
    
    // Return cached value if available
    if (cache.has(holeNumber)) {
        return cache.get(holeNumber) || null;
    }
    
    // Fetch from SDK and cache
    const trigger = mod.GetAreaTrigger(triggerId);
    cache.set(holeNumber, trigger);
    
    return trigger;
}

/**
 * Enable or disable an area trigger.
 */
export function setAreaTriggerEnabled(holeNumber: number, zoneType: 'tee' | 'green' | 'fairway' | 'rough' | 'oob', enabled: boolean): void {
    const trigger = getAreaTrigger(holeNumber, zoneType);
    if (trigger) {
        mod.EnableAreaTrigger(trigger, enabled);
    }
}

/**
 * Enable all area triggers for a specific hole.
 */
export function enableHoleTriggers(holeNumber: number, enabled: boolean): void {
    setAreaTriggerEnabled(holeNumber, 'tee', enabled);
    setAreaTriggerEnabled(holeNumber, 'green', enabled);
    setAreaTriggerEnabled(holeNumber, 'fairway', enabled);
    setAreaTriggerEnabled(holeNumber, 'rough', enabled);
    setAreaTriggerEnabled(holeNumber, 'oob', enabled);
}

/**
 * Enable all course triggers for all holes.
 */
export function enableAllCourseTriggers(enabled: boolean): void {
    for (let i = 1; i <= totalHoles; i++) {
        enableHoleTriggers(i, enabled);
    }
}

///////////////////////////////////////////////////////////////////////////////
// PIN MARKER MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Get the pin marker ID for a specific hole.
 */
export function getPinMarkerId(holeNumber: number): number {
    return CourseObjectIDs.PIN_MARKER_START + (holeNumber - 1);
}

/**
 * Get the pin/flag marker for a specific hole.
 */
export function getPinMarker(holeNumber: number): mod.WorldObject | null {
    const markerId = getPinMarkerId(holeNumber);
    
    if (courseObjectCache.pinMarkers.has(holeNumber)) {
        return courseObjectCache.pinMarkers.get(holeNumber) || null;
    }
    
    const marker = mod.GetWorldObject(markerId);
    courseObjectCache.pinMarkers.set(holeNumber, marker);
    
    return marker;
}

/**
 * Set the visibility of a pin marker.
 */
export function setPinMarkerVisible(holeNumber: number, visible: boolean): void {
    const marker = getPinMarker(holeNumber);
    if (marker) {
        mod.SetWorldObjectVisible(marker, visible);
    }
}

/**
 * Update pin marker position based on hole data.
 * This would be used if pins can move or for dynamic positioning.
 */
export function updatePinMarkerPosition(holeNumber: number): void {
    const hole = getCourseHole(holeNumber);
    const marker = getPinMarker(holeNumber);
    
    if (hole && marker) {
        const position = mod.CreateVector(hole.greenPosition.x, hole.greenPosition.y, hole.greenPosition.z);
        mod.SetWorldObjectPosition(marker, position);
    }
}

///////////////////////////////////////////////////////////////////////////////
// DISTANCE MARKER MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Distance marker configuration.
 */
interface DistanceMarker {
    id: number;
    holeNumber: number;
    distance: number; // Distance from tee in meters
    position: mod.Vector;
    label: string;
}

/**
 * Generate distance markers for a hole.
 * Creates markers at 50m, 100m, 150m, etc. intervals.
 */
export function generateDistanceMarkers(holeNumber: number): DistanceMarker[] {
    const hole = getCourseHole(holeNumber);
    if (!hole) return [];
    
    const markers: DistanceMarker[] = [];
    const teePos = hole.teePosition;
    const greenPos = hole.greenPosition;
    const totalDistance = hole.distance;
    
    // Calculate direction vector from tee to green
    const direction = {
        x: greenPos.x - teePos.x,
        y: greenPos.y - teePos.y,
        z: greenPos.z - teePos.z
    };
    
    // Normalize direction
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y + direction.z * direction.z);
    direction.x /= length;
    direction.y /= length;
    direction.z /= length;
    
    // Create markers at 50m intervals
    const markerInterval = 50;
    let markerId = CourseObjectIDs.DISTANCE_MARKER_START + (holeNumber - 1) * 10; // 10 markers per hole max
    
    for (let distance = markerInterval; distance < totalDistance; distance += markerInterval) {
        const position = {
            x: teePos.x + direction.x * distance,
            y: teePos.y + direction.y * distance,
            z: teePos.z + direction.z * distance
        };
        
        markers.push({
            id: markerId++,
            holeNumber,
            distance,
            position,
            label: `${distance}m`
        });
    }
    
    return markers;
}

/**
 * Get a distance marker world object.
 */
export function getDistanceMarker(markerId: number): mod.WorldObject | null {
    return mod.GetWorldObject(markerId);
}

/**
 * Set visibility of all distance markers for a hole.
 */
export function setDistanceMarkersVisible(holeNumber: number, visible: boolean): void {
    const markers = generateDistanceMarkers(holeNumber);
    
    markers.forEach(marker => {
        const worldObject = getDistanceMarker(marker.id);
        if (worldObject) {
            mod.SetWorldObjectVisible(worldObject, visible);
        }
    });
}

///////////////////////////////////////////////////////////////////////////////
// HAZARD OBJECT MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Get hazard object ID for a specific hole and hazard index.
 */
export function getHazardObjectId(holeNumber: number, hazardIndex: number): number {
    return CourseObjectIDs.HAZARD_START + (holeNumber - 1) * 20 + hazardIndex; // 20 hazards per hole max
}

/**
 * Get hazard world object for a specific hole and hazard.
 */
export function getHazardObject(holeNumber: number, hazardIndex: number): mod.WorldObject | null {
    const objectId = getHazardObjectId(holeNumber, hazardIndex);
    
    const cacheKey = `${holeNumber}-${hazardIndex}`;
    if (courseObjectCache.hazards.has(objectId)) {
        return courseObjectCache.hazards.get(objectId) || null;
    }
    
    const hazard = mod.GetWorldObject(objectId);
    courseObjectCache.hazards.set(objectId, hazard);
    
    return hazard;
}

/**
 * Initialize all hazard objects for a hole based on hole data.
 */
export function initializeHoleHazards(holeNumber: number): void {
    const hole = getCourseHole(holeNumber);
    if (!hole || !hole.hazards) return;
    
    hole.hazards.forEach((hazard, index) => {
        const hazardObject = getHazardObject(holeNumber, index);
        if (hazardObject) {
            // Set position based on hazard data
            const position = mod.CreateVector(hazard.position.x, hazard.position.y, hazard.position.z);
            mod.SetWorldObjectPosition(hazardObject, position);
            
            // Set visibility based on hazard type
            mod.SetWorldObjectVisible(hazardObject, true);
            
            // Set up collision/interaction based on hazard type
            setupHazardInteraction(hazardObject, hazard);
        }
    });
}

/**
 * Set up interaction for a specific hazard object.
 */
function setupHazardInteraction(hazardObject: mod.WorldObject, hazard: HazardData): void {
    switch (hazard.type) {
        case 'destructible':
            // Enable damage for destructible obstacles
            mod.SetWorldObjectDamageable(hazardObject, true);
            break;
        case 'water':
            // Set up water hazard (no collision, but penalty on entry)
            mod.SetWorldObjectCollision(hazardObject, false);
            break;
        case 'sand':
            // Set up sand trap (slows movement)
            mod.SetWorldObjectCollision(hazardObject, true);
            break;
        case 'rough':
            // Set up rough area (affects shot distance)
            mod.SetWorldObjectCollision(hazardObject, false);
            break;
    }
}

///////////////////////////////////////////////////////////////////////////////
// VISUAL ELEMENTS MANAGEMENT
///////////////////////////////////////////////////////////////////////////////

/**
 * Visual element types for course decoration.
 */
export enum VisualElementType {
    Flag = 'flag',
    Banner = 'banner',
    Sign = 'sign',
    Light = 'light',
    Tree = 'tree',
    Rock = 'rock',
    Bench = 'bench',
    CartPath = 'cartpath'
}

/**
 * Get visual element object ID.
 */
export function getVisualElementId(elementType: VisualElementType, index: number): number {
    const elementOffset = {
        [VisualElementType.Flag]: 0,
        [VisualElementType.Banner]: 10,
        [VisualElementType.Sign]: 20,
        [VisualElementType.Light]: 30,
        [VisualElementType.Tree]: 40,
        [VisualElementType.Rock]: 50,
        [VisualElementType.Bench]: 60,
        [VisualElementType.CartPath]: 70
    };
    
    return CourseObjectIDs.VISUAL_START + elementOffset[elementType] + index;
}

/**
 * Get visual element world object.
 */
export function getVisualElement(elementType: VisualElementType, index: number): mod.WorldObject | null {
    const elementId = getVisualElementId(elementType, index);
    
    const cacheKey = `${elementType}-${index}`;
    if (courseObjectCache.visualElements.has(elementId)) {
        return courseObjectCache.visualElements.get(elementId) || null;
    }
    
    const element = mod.GetWorldObject(elementId);
    courseObjectCache.visualElements.set(elementId, element);
    
    return element;
}

/**
 * Set up visual elements for the entire course.
 */
export function initializeCourseVisualElements(): void {
    // Enable hole flags/pins
    for (let i = 1; i <= totalHoles; i++) {
        setPinMarkerVisible(i, true);
    }
    
    // Enable distance markers for current hole
    const currentHole = getCurrentHoleNumber();
    if (currentHole > 0) {
        setDistanceMarkersVisible(currentHole, true);
    }
    
    // Set up other visual elements
    setupCourseBanners();
    setupCourseSignage();
    setupCourseLighting();
}

/**
 * Set up course banners and branding.
 */
function setupCourseBanners(): void {
    // Enable tournament banners around the course
    for (let i = 0; i < 10; i++) {
        const banner = getVisualElement(VisualElementType.Banner, i);
        if (banner) {
            mod.SetWorldObjectVisible(banner, true);
        }
    }
}

/**
 * Set up course signage (hole numbers, directions, etc.).
 */
function setupCourseSignage(): void {
    // Enable hole number signs at each tee
    for (let i = 0; i < totalHoles; i++) {
        const sign = getVisualElement(VisualElementType.Sign, i);
        if (sign) {
            mod.SetWorldObjectVisible(sign, true);
        }
    }
}

/**
 * Set up course lighting for different times of day.
 */
function setupCourseLighting(): void {
    // Enable pathway lights and ambient lighting
    for (let i = 0; i < 20; i++) {
        const light = getVisualElement(VisualElementType.Light, i);
        if (light) {
            mod.SetWorldObjectVisible(light, true);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// COURSE OBJECT INITIALIZATION
///////////////////////////////////////////////////////////////////////////////

/**
 * Initialize all course objects for the game.
 * This should be called once when the game mode starts.
 */
export function initializeCourseObjects(): void {
    console.log('Initializing course objects...');
    
    // Clear any existing cache
    clearCourseObjectCache();
    
    // Initialize area triggers for all holes
    for (let i = 1; i <= totalHoles; i++) {
        // Pre-cache all triggers
        getAreaTrigger(i, 'tee');
        getAreaTrigger(i, 'green');
        getAreaTrigger(i, 'fairway');
        getAreaTrigger(i, 'rough');
        getAreaTrigger(i, 'oob');
        
        // Initialize hazards for this hole
        initializeHoleHazards(i);
    }
    
    // Initialize visual elements
    initializeCourseVisualElements();
    
    // Enable triggers for the first hole
    const firstHole = 1;
    enableHoleTriggers(firstHole, true);
    
    // Disable triggers for other holes
    for (let i = 2; i <= totalHoles; i++) {
        enableHoleTriggers(i, false);
    }
    
    console.log('Course objects initialized successfully');
}

/**
 * Clear the course object cache.
 * Useful for reinitialization or memory cleanup.
 */
export function clearCourseObjectCache(): void {
    courseObjectCache = {
        teeBoxes: new Map(),
        greens: new Map(),
        fairways: new Map(),
        roughs: new Map(),
        outOfBounds: new Map(),
        pinMarkers: new Map(),
        distanceMarkers: new Map(),
        hazards: new Map(),
        visualElements: new Map()
    };
}

/**
 * Switch active hole triggers.
 * Disables current hole triggers and enables next hole triggers.
 */
export function switchToHole(holeNumber: number): void {
    if (holeNumber < 1 || holeNumber > totalHoles) {
        console.error(`Invalid hole number: ${holeNumber}`);
        return;
    }
    
    // Disable all hole triggers
    enableAllCourseTriggers(false);
    
    // Enable triggers for the new hole
    enableHoleTriggers(holeNumber, true);
    
    // Update visual elements for new hole
    setDistanceMarkersVisible(holeNumber, true);
    
    // Hide distance markers for other holes
    for (let i = 1; i <= totalHoles; i++) {
        if (i !== holeNumber) {
            setDistanceMarkersVisible(i, false);
        }
    }
    
    console.log(`Switched to hole ${holeNumber}`);
}

///////////////////////////////////////////////////////////////////////////////
// UTILITY FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

/**
 * Check if a position is within any course trigger.
 */
export function isPositionInAnyTrigger(position: Vector3): { zone: string | null, hole: number } {
    for (let hole = 1; hole <= totalHoles; hole++) {
        const zones = ['tee', 'green', 'fairway', 'rough', 'oob'] as const;
        
        for (const zone of zones) {
            const trigger = getAreaTrigger(hole, zone);
            if (trigger && mod.IsPositionInAreaTrigger(trigger, position)) {
                return { zone, hole };
            }
        }
    }
    
    return { zone: null, hole: 0 };
}

/**
 * Get all course objects for debugging purposes.
 */
export function getCourseObjectStatus(): { [key: string]: number } {
    return {
        teeBoxes: courseObjectCache.teeBoxes.size,
        greens: courseObjectCache.greens.size,
        fairways: courseObjectCache.fairways.size,
        roughs: courseObjectCache.roughs.size,
        outOfBounds: courseObjectCache.outOfBounds.size,
        pinMarkers: courseObjectCache.pinMarkers.size,
        distanceMarkers: courseObjectCache.distanceMarkers.size,
        hazards: courseObjectCache.hazards.size,
        visualElements: courseObjectCache.visualElements.size
    };
}

/**
 * Validate that all required course objects exist.
 * Returns a list of missing objects for debugging.
 */
export function validateCourseObjects(): string[] {
    const missing: string[] = [];
    
    // Check area triggers
    for (let hole = 1; hole <= totalHoles; hole++) {
        const zones = ['tee', 'green', 'fairway', 'rough', 'oob'] as const;
        
        for (const zone of zones) {
            const trigger = getAreaTrigger(hole, zone);
            if (!trigger) {
                missing.push(`${zone} trigger for hole ${hole}`);
            }
        }
    }
    
    // Check pin markers
    for (let hole = 1; hole <= totalHoles; hole++) {
        const pin = getPinMarker(hole);
        if (!pin) {
            missing.push(`Pin marker for hole ${hole}`);
        }
    }
    
    return missing;
}