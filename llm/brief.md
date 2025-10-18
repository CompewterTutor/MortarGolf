# Game Mode Brief: [Your Game Mode Name]

> **Quick Summary:** MortarGolf is a gamemode where you play a wacky version of golf with mortars and try to get the lowest score with some help from your caddy ai or friend. Speed is a factor and watch out for pesky opponents trying to shoot during your downswing.

---

## 📋 Basic Information

**Game Mode Name:** MortarGolf
**Version:** 0.0.1
**Author:** CompewterTutor
**Source Code:** https://github.com/compewtertutor/mortargolf

**Last Updated:** [10/17/25]

**Development Status:**
- [x] Planning
- [ ] In Development
- [ ] Testing
- [ ] Complete

---

## 🎮 Game Description

### Overview
MortarGolf is a wacky take on the regular rules of golf. Each player starts at the 1st hole teebox and needs to shoot mortars to try to get to the "green" and then putt in the goal. When playing the combat mode, you can shoot at opponents while they are driving/shooting to disrupt them, but watch out from counterfire from their caddy. Speed is a factor, so driving your golfcart  (jeep/humvee) from shot to shot across obstacles and gunfire will affect how well you score speedwise. Up to 4 players/4 caddies can play on a single hole at a time. Teeboxes are big enough for all players to tee off at the same time.

### Core Gameplay Loop
Players all play on the same hole at the same time and they do not move onto the next hole (out of 9) before the last person has sunk their putt. Depending on who scored the lowest on the previous hole they get to pick their teeoff spot and the speed in which they finish will determine how much money they receive to buy equipment for the next hole. Players compete to see who has the best score/time combination at the end of the course (9 or 18 holes)

1. Matchmaking to gather a foursome with or without player caddies (ai will be supplied if they don't have a caddy)
2. Players meetup at the first teebox and all setup to address the "ball" at the same time. A countdown timer begins while they line up their shot and when it goes off they are given the UI to fire their shot.
3. Players then drive to their next shot while fending off the other players and attempting to finish the hole as fast as they can. If you down a player, they must recover (caddy has to revive them) so they are unable to take a shot until they are back up.
4. Once players reach the "green" area, they must "putt" using a dart and a randomized target. Depending on how close they are to a bullseye on their putt, the next target spawns a corresponding distance within a designated randomized range from them for the next shot. If they get a bullseye/headshot, they finish the hole, moving to the next teebox and no longer taking damage from opponents fire.
5. Scores for the last hole are tallied, with their golf score determining the shot order for the next hole and amount of a headstart (3 seconds per shot by default, adjustable though). Scores under par are given a bonus, and based on the speed they finished the hole they are awarded cash to spend at the next hole's "market" before the next hole begins. Items like ammo, armor, weaponry and gadgets are available at random to the golfers but the store offers the same items for all players in the group.
6. At the end of the course, scores are tallied and a podium is shown with the winners/losers. Since the sdk doesn't allow for networking, we can't keep track of scores across multiple games, but to get around this, the gamestate and score for the player is serialized and hashed so that the player can later visit a website created for the game to keep track of a player's career. Leaderboard can be found in the "Pro Shop" and special titles can be purchased by the players as swag.
7. Players can spend time at the pro shop to sign up for tee times or driving range to practice mechanics before or after the game. The server will be long running so you can play multiple rounds without leaving and signup for "tee times" throughout the day.

### Game Mode Type
- [x] Team-based
- [ ] Free-for-all
- [ ] Cooperative
- [ ] Competitive
- [x] Objective-based
- [ ] Elimination
- [x] Race/Time Trial
- [ ] Other: ___________

---

## 👥 Players & Teams

### Player Count
- **Minimum Players:** [1]
- **Maximum Players:** [32]
- **Recommended:** [4-16]

### Team Configuration
- **Number of Teams:** [1/2/3/4/ of 1 or two players each]
- 4 teams per round (on a hole at once)
- **Team 1:** [Red] - [Red] - [Player/Caddy]
- **Team 2:** [Blue] - [Blue] - [Player/Caddy]
- **Team 3:** [Green] - [Green] - [Player/Caddy]
- **Team 4:** [Yellow] - [Yellow] - [Player/Caddy]
Up to 4 groups on the server at once

### Team Balance
- [ ] Auto-balance enabled
- [x] Fixed team sizes
- [ ] Dynamic team assignment
- [x] Player choice
- [ ] Other: ___________

---

## 🎯 Objectives & Rules

### Primary Objective
Get the lowest score

### Secondary Objectives (if applicable)
1. Fastest Time
2. Most Damage
3. Money earned


### Gameplay Phases

#### Phase 1: Pro Shop/Tee Time assignment

- **Duration:** Until teetime comes
- **Description:** [Players can checkout leaderboards or signup for tee times and get assigned caddy/group]
- **Player Actions:** [view leaderboard, go to driving range, watch from gallery other players]

#### Phase 2: TeeTime

- **Duration:** Players have 30 seconds to get from their carts to the first tee
- **Description:** Drive to the tee, view teams
- **Player Actions:** Get in jeep, drive to tee, select "club"

#### Phase 3: Tee-Off

- **Duration:** Players are given a 10 second countdown to the start of the round once they all reach the tee box.
- **Description:** Players are placed in the "shooting" state on the tee box and can adjust the tee to make their shot as good as possible both for position and for ease of getting their via their jeep.
- **Player Actions:** adjust shot launch angle, direction, and spin. Then once they start their "backswing" they attempt to shoot via a meter where they have to click once to start the shot, once to determine the power of the shot and once for the follow through which will determine hook/slice amount.



---

## 🏆 Win Conditions

### Victory Conditions

- [ ] **Score-based:** [Description - e.g., "First team to 100 points wins"]
- [ ] **Time-based:** [Description - e.g., "Highest score when time expires"]
- [ ] **Objective-based:** [Description - e.g., "Complete all objectives first"]
- [ ] **Elimination:** [Description - e.g., "Last team standing wins"]
- [ ] **Other:** [Custom win condition]

### Point System

| Action | Points Awarded |
|--------|----------------|
| [Action 1] | [Points] |
| [Action 2] | [Points] |
| [Action 3] | [Points] |
| [Action 4] | [Points] |
| [Action 5] | [Points] |

### Match Duration

- **Time Limit:** [Minutes or None]
- **Round Duration:** [If applicable]
- **Number of Rounds:** [If applicable]

### Tiebreaker Rules

If there is a tie in score, the winner is the one who had the quickest cumulative time. If that somehow is tied as well, fireworks go off and they play a sudden death playoff hole (hole 9 if 18, hole 1 otherwise?) and so on until there is a clear winner.

---

## 💀 Death & Respawning

### Death Conditions

- [x] Combat death - Death is temporary always, the caddy can always revive the player
- [x] Environmental hazards - Player is respawned nearest to his death in bounds and loses a stroke.
- [x] Out of bounds Player is respawned nearest to his death in bounds and loses a stroke.
- [x] Time limit Player takes a triple bogie on the hole and is transported to the next teebox. Timer starts counting down if there is another 4some waiting on them.
- [ ] Other: ___________

### Respawn System

- **Respawn Mode:** [Auto-spawn / Manual spawn / Wave spawn / One-life]
- **Respawn Delay:** [Seconds or conditions]
- **Respawn Location:** [Fixed spawns / Team spawns / Dynamic]
- **Respawn Restrictions:** [Any limits or conditions]

### Death Penalties

- [ ] Score loss: [Amount]
- [ ] Equipment loss
- [ ] Respawn delay
- [ ] Team penalty
- [ ] None

---

## 🔫 Combat & Equipment

### Weapon Restrictions
- [ ] All weapons allowed
- [x] Limited weapon types: ___________
- [ ] Custom loadout system
- [/] Weapon unlocks/progression possibly planned for future if we get the system working despite the lack of network access in the sdk

### Default Loadout

- **Primary Weapon:** [Basic Pistol]
- **Secondary Weapon:** None
- **Gadget 1:** Mortar
- **Gadget 2:** Binoculars?
- **Throwable:** Smoke Grenade

### Equipment System
- [x] Fixed loadouts
- [ ] Loadout selection
- [x] In-game pickups (Through purchase)
- [x] Purchase system
- [x] Other:

### Special Equipment (if applicable)

- Money: Used at the store in between holes and at the pro shop
- Item 2: [Description]
- Item 3: [Description]

---

## 🗺️ Map & Environment

### Supported Maps

1. Firestorm (for now)
2. Large-ish outdoor map 1
3. Largeish outdoor map 2
4. Maybe consider creating courses on the smaller maps might make driving between shots interesting

### Key Locations

- **Fairway:** Cart drives 100% speed, no effect on shot
- **Rough:** Depending on the type of rough, cart and shot affected
- **Teebox:** Not sure yet how these will vary
- **Proshop:** Purchase collectibles, swag, buffs, different carts, get tee times, range balls
- **Driving Range**: Practice shots, talk to other players, recruit teammates/caddies, try out items

### Environmental Hazards

- Random Destructible Obstacles: Courses won't play the same every time, randomized obstacles can occur which can change the paths you take through each hole. Start with a few variations of each hole and move towards procedural generated obstacles with a ruleset that still offers multiple paths and options for shot selection and driving path.
- Wind: Randomized wind with variations on directional vector and intensity
- Fanatical Spectators with guns: Think Happy Gilmore jackass guy

### Interactive Objects

- **Teebox:** Location where each player must start each hole.
- **Previous Shot Location/Lie** Where the player's shot ended up, must interact with location to enter shot address mode.
- **Putting Green Lie:** Where the player ended up on the green, starts putting sequence described above
- **Between hole shop:** Ability to purchase upgrades, items, weapons, ammo, armor, new "balls", cart upgrades, and buffs/debuffs
- **Cart girl:** Randomly appears several times a round and offers special buffs if you can afford them.
- **Pro Shop Attendant:** Described above
- **Driving Range** Described above

---

## 📊 Player Variables & Stats

### Tracked Statistics

- [ ] **Score:** [How it's calculated]
- [ ] **Kills:** [Standard tracking]
- [ ] **Deaths:** [Standard tracking]
- [ ] **Assists:** [How assists are determined]
- [ ] **Objectives:** [What counts as an objective completion]
- [ ] **Time Alive:** [Track survival time]
- [ ] **Damage Dealt:** [Track damage output]
- [ ] **Custom Stat 1:** [Description]
- [ ] **Custom Stat 2:** [Description]

### Player State Variables

| Variable | Type | Purpose |
|----------|------|---------|
| [Variable 1] | [number/boolean/string] | [What it tracks] |
| [Variable 2] | [number/boolean/string] | [What it tracks] |
| [Variable 3] | [number/boolean/string] | [What it tracks] |
| [Variable 4] | [number/boolean/string] | [What it tracks] |

### Persistent Data (if applicable)
- [x] Cross-match statistics (kept via passcode on separate website due to network restrictions)
- [x] Unlocks/progression - money earned
- [x] Achievements

---

## 🖥️ UI Elements

### Lobby/Pre-Game UI
- [x] Player count display
- [x] Countdown timer per hole and a total round timer
- [x] Game rules/instructions - special rules screen at start of game that all players must accept before beginning
- [x] Team roster
- [x] Map/Course preview
- [x] Other: Starting Gear

### In-Game HUD
- [x] **Score Display:** Scores are shown on the score screen and in the HUD
- [x] **Timer:** Timers per hole
- [x] **Objective Markers:** Holes are indicated
- [x] **Team Indicators:** Identified by color for now
- [x] **Progress Bars:** [For captures/objectives]
- [x] **Minimap Markers:** Teeboxes, Greens/pins
- [x] **Custom HUD Element 1:** Shot Strength
- [x] **Custom HUD Element 2:** Shot Direction/Spin/Launch Angle

### Messages & Notifications
| Event | Message/Notification |
|-------|---------------------|
| Game start | [Message text] |
| Player kill | [Message text] |
| Objective complete | [Message text] |
| Round end | [Message text] |
| Victory | [Message text] |
| [Custom event] | [Message text] |

### End Game UI
- [ ] Final scores
- [ ] Winner announcement
- [ ] Individual statistics
- [ ] Team statistics
- [ ] MVP/highlights
- [ ] Other: ___________

---

## 🎨 Visual & Audio Design

### Visual Effects
- **[Event 1]:** [VFX description]
- **[Event 2]:** [VFX description]
- **[Event 3]:** [VFX description]

### Sound Effects
- **[Event 1]:** [SFX description]
- **[Event 2]:** [SFX description]
- **[Event 3]:** [SFX description]

### World Icons
- [Icon type 1]: [Purpose and appearance]
- [Icon type 2]: [Purpose and appearance]
- [Icon type 3]: [Purpose and appearance]

---

## 🔧 Technical Requirements

### Required Game Objects
| Object Type | Object ID | Purpose |
|-------------|-----------|---------|
| HQ | [ID] | [Description] |
| Capture Point | [ID] | [Description] |
| Interact Point | [ID] | [Description] |
| Area Trigger | [ID] | [Description] |
| [Custom Object] | [ID] | [Description] |

### Performance Considerations
- [ ] Expected player count: [32]
- [ ] Update frequency requirements
- [ ] UI complexity level
- [ ] VFX/particle usage
- [ ] Known limitations

---

## 🚧 Known Issues & Limitations

### Current Limitations
1. No networking in SDK so we have to get around career persistence with "passcodes" (consider qr codes?)
2. Animations are limited by the game
3. Map design is additive in the sdk so we can only build on existing levels.

### Planned Features
1. Tournament modes
2. Skins Game

### Known Bugs
1. [Bug 1] - [Severity: Low/Medium/High]
2. [Bug 2] - [Severity: Low/Medium/High]
3. [Bug 3] - [Severity: Low/Medium/High]

---

## 📝 Development Notes

### Design Philosophy
[Explain the design goals and philosophy behind this game mode]

### Inspiration
[List any games or modes that inspired this design]

### Playtesting Feedback
[Add key feedback from playtesting sessions]

### Balance Changes
| Date | Change | Reason |
|------|--------|--------|
| [Date] | [Change description] | [Why it was made] |
| [Date] | [Change description] | [Why it was made] |

---

## 📚 Additional Resources

### Related Documentation
- Development Guidelines: `dev_guidelines.md`
- SDK Documentation: `BF6_SDK.md`
- Development Checklist: `common_checklist.md`
- Template Code: `template.ts`

---

## 📞 Contact & Support

**Developer Contact:** CompewterTutor CompewterTutor@gmail.com 
**Submit issues to** https://github.com/compewtertutor/mortargolf
**Last Updated:** 10/17/25
**Version:** 0.1.1