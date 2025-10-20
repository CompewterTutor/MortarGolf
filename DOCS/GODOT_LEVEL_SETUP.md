# MortarGolf - Godot Level Editor Setup Guide

**Map**: MP_Firestorm  
**Course**: 9-Hole Golf Course  
**Total Items**: 111+ objects to place  
**Last Updated**: October 20, 2025

---

## Overview

This document provides an exact checklist of all items that need to be placed in the Godot level editor to create the MortarGolf course on the Firestorm map.

**Important**: After placing each item, update the corresponding ID in `src/constants.ts` with the actual object ID from Godot.

---

## 📋 Complete Item Checklist

### 1. TEE BOX AREA TRIGGERS (9 total)

These are cylindrical area triggers where players spawn and tee off. Each should be large enough for 4 players to stand in (approximately 10m radius).

| Hole | Name | Position (placeholder) | Radius | ID Variable | Notes |
|------|------|----------------------|--------|-------------|-------|
| 1 | Hole 1 Tee Box | (100, 100, 50) | 10m | `teeBoxIDs[0]` | Wide, welcoming start |
| 2 | Hole 2 Tee Box | (300, 110, 52) | 10m | `teeBoxIDs[1]` | Faces dogleg right |
| 3 | Hole 3 Tee Box | (470, 220, 55) | 10m | `teeBoxIDs[2]` | Elevated tee |
| 4 | Hole 4 Tee Box | (610, 230, 58) | 10m | `teeBoxIDs[3]` | Views elevated green |
| 5 | Hole 5 Tee Box | (770, 370, 70) | 10m | `teeBoxIDs[4]` | Long par 5 vista |
| 6 | Hole 6 Tee Box | (920, 640, 65) | 10m | `teeBoxIDs[5]` | Short but perilous |
| 7 | Hole 7 Tee Box | (1030, 650, 68) | 10m | `teeBoxIDs[6]` | Narrow fairway ahead |
| 8 | Hole 8 Tee Box | (1200, 770, 75) | 10m | `teeBoxIDs[7]` | Highest elevation |
| 9 | Hole 9 Tee Box | (1350, 820, 60) | 10m | `teeBoxIDs[8]` | Championship finish |

**Area Trigger Settings**:
- Shape: Cylinder
- Height: 5m (tall enough for players)
- Trigger event: OnPlayerEnterAreaTrigger
- Team: All teams
- Enable: True

---

### 2. GREEN AREA TRIGGERS (9 total)

These are circular area triggers around the pin where putting mode is enabled.

| Hole | Name | Position (placeholder) | Radius | ID Variable | Notes |
|------|------|----------------------|--------|-------------|-------|
| 1 | Hole 1 Green | (280, 100, 52) | 15m | `greenIDs[0]` | Standard green size |
| 2 | Hole 2 Green | (450, 200, 55) | 15m | `greenIDs[1]` | Elevated green |
| 3 | Hole 3 Green | (590, 220, 58) | 12m | `greenIDs[2]` | Small island green |
| 4 | Hole 4 Green | (750, 350, 70) | 15m | `greenIDs[3]` | Elevated plateau |
| 5 | Hole 5 Green | (900, 620, 65) | 18m | `greenIDs[4]` | Large par 5 green |
| 6 | Hole 6 Green | (1015, 640, 68) | 10m | `greenIDs[5]` | Tiny defended green |
| 7 | Hole 7 Green | (1180, 750, 62) | 14m | `greenIDs[6]` | Standard size |
| 8 | Hole 8 Green | (1330, 810, 60) | 13m | `greenIDs[7]` | Downhill landing |
| 9 | Hole 9 Green | (1550, 520, 58) | 20m | `greenIDs[8]` | Championship green |

**Area Trigger Settings**:
- Shape: Cylinder
- Height: 3m
- Trigger event: OnPlayerEnterAreaTrigger (enables putting mode)
- Team: All teams
- Enable: True

---

### 3. FAIRWAY AREA TRIGGERS (9 total)

These are rectangular/path-like triggers defining the fairway (normal lie). Place along the path from tee to green.

| Hole | Name | Center Position | Width | Length | ID Variable |
|------|------|----------------|-------|--------|-------------|
| 1 | Hole 1 Fairway | (190, 100, 51) | 40m | 180m | TBD |
| 2 | Hole 2 Fairway | (375, 155, 53) | 35m | 200m | TBD |
| 3 | Hole 3 Fairway | (530, 220, 56) | 25m | 120m | TBD |
| 4 | Hole 4 Fairway | (680, 290, 64) | 40m | 210m | TBD |
| 5 | Hole 5 Fairway | (835, 495, 68) | 45m | 280m | TBD |
| 6 | Hole 6 Fairway | (970, 640, 66) | 20m | 95m | TBD |
| 7 | Hole 7 Fairway | (1105, 700, 65) | 28m | 190m | TBD |
| 8 | Hole 8 Fairway | (1265, 790, 68) | 30m | 140m | TBD |
| 9 | Hole 9 Fairway | (1450, 670, 59) | 50m | 300m | TBD |

**Area Trigger Settings**:
- Shape: Box (rectangular, path-like)
- Height: 5m
- Lie effect: Fairway (1.0x multiplier)
- Enable: True

---

### 4. ROUGH AREA TRIGGERS (18 total)

These are area triggers for rough terrain (reduced shot distance). Based on hazard data.

| Hole | Location | Position | Radius | Penalty |
|------|----------|----------|--------|---------|
| 1 | Left rough | (190, 80, 50) | 20m | 0.7x distance |
| 1 | Right rough | (190, 120, 50) | 20m | 0.7x distance |
| 2 | Mid rough | (420, 180, 54) | 25m | 0.7x distance |
| 3 | Approach rough | (580, 205, 57) | 10m | 0.7x distance |
| 4 | Approach rough | (730, 330, 68) | 20m | 0.7x distance |
| 5 | Mid rough | (870, 570, 66) | 30m | 0.7x distance |
| 7 | Left rough | (1105, 685, 65) | 25m | 0.7x distance |
| 7 | Right rough | (1105, 715, 65) | 25m | 0.7x distance |
| 8 | Mid rough | (1265, 790, 68) | 20m | 0.7x distance |
| 9 | Approach rough | (1500, 590, 58) | 35m | 0.7x distance |

**Area Trigger Settings**:
- Shape: Cylinder
- Height: 3m
- Lie effect: Rough (0.7x multiplier)
- Visual: Could use different ground texture
- Enable: True

---

### 5. SAND TRAP AREA TRIGGERS (13 total)

Bunkers/sand traps that severely penalize shot distance.

| Hole | Location | Position | Radius | Penalty |
|------|----------|----------|--------|---------|
| 3 | Left bunker | (530, 210, 56) | 15m | 0.5x distance |
| 3 | Right bunker | (530, 230, 56) | 15m | 0.5x distance |
| 5 | Green bunker | (890, 600, 65) | 18m | 0.5x distance |
| 6 | Front-left | (970, 630, 66) | 12m | 0.5x distance |
| 6 | Front-right | (970, 650, 66) | 12m | 0.5x distance |
| 6 | Back-left | (1005, 625, 67) | 10m | 0.5x distance |
| 6 | Back-right | (1005, 655, 67) | 10m | 0.5x distance |
| 8 | Approach bunker | (1315, 800, 61) | 15m | 0.5x distance |
| 9 | Left bunker | (1535, 510, 58) | 20m | 0.5x distance |
| 9 | Right bunker | (1535, 530, 58) | 20m | 0.5x distance |

**Area Trigger Settings**:
- Shape: Cylinder (irregular shapes if available)
- Height: 2m (slightly recessed)
- Lie effect: Sand (0.5x multiplier)
- Visual: Sand/dirt texture
- Enable: True

---

### 6. DESTRUCTIBLE OBSTACLES (5 total)

Physical obstacles that can be destroyed but block shots.

| Hole | Type | Position | Radius | Notes |
|------|------|----------|--------|-------|
| 2 | Building/Structure | (375, 155, 53) | 10m | Mid-fairway obstacle |
| 4 | Building/Structure | (680, 290, 64) | 12m | Approach obstacle |
| 5 | Building/Structure | (835, 495, 68) | 15m | Long carry obstacle |
| 7 | Building/Structure | (1155, 735, 63) | 10m | Narrow fairway block |

**Object Settings**:
- Type: Destructible object (walls, buildings, etc.)
- Health: Medium (can be destroyed with weapons)
- Collision: Yes (blocks mortar shots)
- Enable: True

---

### 7. PIN/FLAG MARKERS (9 total)

Visual markers showing the hole location. These are static visual objects, not triggers.

| Hole | Position | Type | Height |
|------|----------|------|--------|
| 1 | (280, 100, 52) | Flag pole | 5m tall |
| 2 | (450, 200, 55) | Flag pole | 5m tall |
| 3 | (590, 220, 58) | Flag pole | 5m tall |
| 4 | (750, 350, 70) | Flag pole | 5m tall |
| 5 | (900, 620, 65) | Flag pole | 5m tall |
| 6 | (1015, 640, 68) | Flag pole | 5m tall |
| 7 | (1180, 750, 62) | Flag pole | 5m tall |
| 8 | (1330, 810, 60) | Flag pole | 5m tall |
| 9 | (1550, 520, 58) | Flag pole | 5m tall |

**Object Type**: Static visual prop
**Appearance**: Golf flag on pole (use any suitable prop)
**Collision**: No collision (walk-through)

---

### 8. DISTANCE MARKERS (27+ optional)

Visual markers showing distance to green. Typically at 50m, 100m, 150m from green.

**Per Hole (3 markers each)**:
- 50m marker (close range)
- 100m marker (mid range)
- 150m marker (long range)

**Calculation**: Work backward from green position using the hole distance.

**Object Type**: Small prop/sign
**Label**: "50", "100", "150" (or use colored markers)
**Collision**: No collision

---

### 9. VEHICLE SPAWNERS (9-18 total)

Golf cart (vehicle) spawners at each tee box.

| Location | Position | Vehicle Type | Count | ID Variable |
|----------|----------|--------------|-------|-------------|
| Hole 1 Tee | Near (100, 100, 50) | Jeep/Humvee | 2-4 | TBD |
| Hole 2 Tee | Near (300, 110, 52) | Jeep/Humvee | 2-4 | TBD |
| Hole 3 Tee | Near (470, 220, 55) | Jeep/Humvee | 2-4 | TBD |
| Hole 4 Tee | Near (610, 230, 58) | Jeep/Humvee | 2-4 | TBD |
| Hole 5 Tee | Near (770, 370, 70) | Jeep/Humvee | 2-4 | TBD |
| Hole 6 Tee | Near (920, 640, 65) | Jeep/Humvee | 2-4 | TBD |
| Hole 7 Tee | Near (1030, 650, 68) | Jeep/Humvee | 2-4 | TBD |
| Hole 8 Tee | Near (1200, 770, 75) | Jeep/Humvee | 2-4 | TBD |
| Hole 9 Tee | Near (1350, 820, 60) | Jeep/Humvee | 2-4 | TBD |

**Spawner Settings**:
- Vehicle: Jeep or Humvee (light fast vehicle)
- Respawn time: 30 seconds
- Max vehicles: 2-4 per tee
- Enable: True

---

### 10. SHOP LOCATIONS (3 total)

Interactive points where shop can be accessed.

| Location | Position | Type | ID Variable |
|----------|----------|------|-------------|
| Main Shop | Between holes (TBD) | Interact Point | `shopID` |
| Pro Shop | Lobby/spawn area (TBD) | Interact Point | `proShopID` |
| Driving Range | Practice area (TBD) | Interact Point | `drivingRangeID` |

**Object Type**: Interact Point
**Trigger**: OnInteractPointActivated
**Radius**: 5m interaction range

---

### 11. SPAWN POINTS (4+ total)

Player spawn locations for lobby and tee times.

| Location | Position | Team | Purpose |
|----------|----------|------|---------|
| Pro Shop Lobby | (TBD) | All | Initial spawn, matchmaking |
| Driving Range | (TBD) | All | Practice mode spawn |
| Spectator Area | (TBD) | All | Spectator spawn |
| Emergency Spawn | (TBD) | All | Fallback respawn |

**Spawn Settings**:
- Type: Player spawn point
- Team: All teams
- Enable: True

---

### 12. OUT OF BOUNDS TRIGGERS (1-2 total)

Large area triggers that define the course boundaries.

| Name | Coverage | Penalty | Notes |
|------|----------|---------|-------|
| Course Boundary | Entire map edges | +1 stroke | Surrounds playable area |
| Water Hazards (optional) | Any water bodies | +1 stroke | If Firestorm has water |

**Area Trigger Settings**:
- Shape: Box or complex polygon
- Coverage: Everything outside course
- Trigger: OnPlayerEnterAreaTrigger
- Penalty: +1 stroke, respawn at last position

---

### 13. HEADQUARTERS (1 optional)

Optional HQ for team setup or game mode requirements.

| Name | Position | Type | ID Variable |
|------|----------|------|-------------|
| Main HQ | Course center/Pro Shop | HQ | `mainHQID` |

---

## 📝 Implementation Checklist

### Phase 1: Core Course Layout
- [ ] Place all 9 tee box triggers
- [ ] Place all 9 green triggers
- [ ] Place all 9 pin/flag markers
- [ ] Update teeBoxIDs array in constants.ts
- [ ] Update greenIDs array in constants.ts
- [ ] Test player can enter tee and green areas

### Phase 2: Fairways & Hazards
- [ ] Place all 9 fairway triggers
- [ ] Place all 18 rough area triggers
- [ ] Place all 13 sand trap triggers
- [ ] Place all 5 destructible obstacles
- [ ] Test lie detection system
- [ ] Verify hazard penalties apply

### Phase 3: Visual Elements
- [ ] Place 27+ distance markers (3 per hole)
- [ ] Add decorative elements (optional)
- [ ] Place spectator areas
- [ ] Test visibility from tee boxes

### Phase 4: Infrastructure
- [ ] Place 9-18 vehicle spawners (golf carts)
- [ ] Place 3 shop interact points
- [ ] Place 4+ spawn points
- [ ] Place out-of-bounds triggers
- [ ] Place HQ (if needed)
- [ ] Update all IDs in constants.ts

### Phase 5: Testing
- [ ] Walk through entire course
- [ ] Test each hole in sequence
- [ ] Verify all triggers fire correctly
- [ ] Check vehicle spawns work
- [ ] Verify shop locations are accessible
- [ ] Test multiplayer with 4+ players

---

## 🎯 Summary Counts

| Category | Count | Status |
|----------|-------|--------|
| Tee Box Triggers | 9 | ⚠️ Required |
| Green Triggers | 9 | ⚠️ Required |
| Fairway Triggers | 9 | ⚠️ Required |
| Rough Triggers | 18 | ⚠️ Required |
| Sand Traps | 13 | ⚠️ Required |
| Destructible Obstacles | 5 | ⚠️ Required |
| Pin/Flag Markers | 9 | ⚠️ Required |
| Distance Markers | 27+ | ✅ Optional |
| Vehicle Spawners | 9-18 | ⚠️ Required |
| Shop Locations | 3 | ⚠️ Required |
| Spawn Points | 4+ | ⚠️ Required |
| Out of Bounds | 1-2 | ⚠️ Required |
| HQ | 1 | ✅ Optional |
| **TOTAL** | **111-117** | - |

**Legend**:
- ⚠️ Required: Must be placed for game to function
- ✅ Optional: Enhances gameplay but not critical

---

## 📐 Coordinate Reference

All coordinates in this document are **placeholders** using the format `(X, Y, Z)` where:
- X: East-West position
- Y: North-South position
- Z: Elevation

**Important**: After placing each object in Godot, you must:
1. Note the actual position from Godot
2. Update the corresponding position in `src/constants.ts`
3. Rebuild the mod with `npm run build`
4. Test in-game to verify correct placement

---

## 🔧 After Placement

Once all objects are placed in Godot:

1. **Export Object IDs**: Get the ID for each placed trigger/object
2. **Update constants.ts**: Replace placeholder IDs with actual IDs
3. **Update COURSE_HOLES array**: Replace placeholder positions with actual positions
4. **Rebuild**: Run `npm run build`
5. **Test**: Load the mod and verify all triggers work
6. **Iterate**: Adjust positions as needed for gameplay balance

---

## 📚 References

- **Course Configuration**: `src/constants.ts` (COURSE_HOLES array)
- **Course Management**: `src/course.ts`
- **Type Definitions**: `src/types.ts` (HoleData, HazardData)
- **Development Todo**: `llm/todo.md` (Phase 3.2)

---

**Last Updated**: October 20, 2025  
**Next Step**: Begin Godot placement and update IDs
