# MortarGolf - Quick Placement Checklist

**Quick reference for Godot level setup**

## REQUIRED ITEMS (Must place for game to work)

### ✅ Core Course (27 items)
- [ ] 9 Tee Box Triggers (one per hole)
- [ ] 9 Green Triggers (one per hole)
- [ ] 9 Pin/Flag Markers (visual at each green)

### ✅ Playing Surface (40 items)
- [ ] 9 Fairway Triggers (define normal lie areas)
- [ ] 18 Rough Triggers (penalty areas, 2 per hole average)
- [ ] 13 Sand Traps (bunkers, varies per hole)

### ✅ Obstacles (5 items)
- [ ] 5 Destructible Objects (buildings/structures on holes 2, 4, 5, 7, 9)

### ✅ Transportation (9-18 items)
- [ ] 9-18 Vehicle Spawners (2 golf carts per tee minimum)

### ✅ Infrastructure (8-10 items)
- [ ] 3 Shop Interact Points (Main Shop, Pro Shop, Driving Range)
- [ ] 4+ Spawn Points (Lobby, Range, Spectator, Emergency)
- [ ] 1-2 Out of Bounds Triggers (course boundary)
- [ ] 1 HQ (optional, for team setup)

**TOTAL REQUIRED: ~98-111 items**

---

## OPTIONAL ITEMS (Enhance gameplay)

### 🎯 Visual Markers (27+ items)
- [ ] 27 Distance Markers (50m, 100m, 150m per hole)
- [ ] Decorative props (signs, benches, etc.)
- [ ] Spectator areas

---

## ID REFERENCE QUICK LIST

After placing, update these in `src/constants.ts`:

```typescript
// TEE BOXES (9)
teeBoxIDs: [10, 11, 12, 13, 14, 15, 16, 17, 18]

// GREENS (9)  
greenIDs: [20, 21, 22, 23, 24, 25, 26, 27, 28]

// SHOPS (3)
shopID: 100
proShopID: 101
drivingRangeID: 102

// OTHER
mainHQID: 1
```

Replace with actual IDs from Godot.

---

## POSITION REFERENCE

Update these positions in `src/constants.ts` COURSE_HOLES array:

| Hole | Tee Position | Green Position |
|------|--------------|----------------|
| 1 | (100, 100, 50) | (280, 100, 52) |
| 2 | (300, 110, 52) | (450, 200, 55) |
| 3 | (470, 220, 55) | (590, 220, 58) |
| 4 | (610, 230, 58) | (750, 350, 70) |
| 5 | (770, 370, 70) | (900, 620, 65) |
| 6 | (920, 640, 65) | (1015, 640, 68) |
| 7 | (1030, 650, 68) | (1180, 750, 62) |
| 8 | (1200, 770, 75) | (1330, 810, 60) |
| 9 | (1350, 820, 60) | (1550, 520, 58) |

These are placeholders - replace with actual Godot coordinates!

---

## NEXT STEPS

1. Open Firestorm map in Godot editor
2. Work through checklist section by section
3. Start with Core Course items (tees, greens, pins)
4. Record actual positions and IDs
5. Update constants.ts
6. Rebuild: `npm run build`
7. Test in-game

**See GODOT_LEVEL_SETUP.md for detailed specifications!**
