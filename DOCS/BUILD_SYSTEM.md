# BF6 Portal Mod Build System

## Overview

This build system allows you to organize your Battlefield 6 Portal mod into multiple TypeScript files during development, then automatically combine them into a single `.ts` file for deployment. This improves code organization, maintainability, and collaboration while meeting BF6 Portal's single-file requirement.

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Your Mod Structure

```
mods/YourModName/
├── build.config.json       # Build configuration
├── src/                    # Source files (multiple .ts files)
│   ├── types.ts
│   ├── constants.ts
│   ├── state.ts
│   ├── helpers.ts
│   ├── ui.ts
│   ├── player.ts
│   ├── messages.ts
│   ├── gameflow.ts
│   ├── updates.ts
│   └── events.ts
└── YourModName.ts          # Generated output (single file)
```

### 3. Build Your Mod

```bash
# Build once
npm run build:mortar

# Watch for changes and rebuild automatically
npm run watch:mortar
```

---

## File Organization Best Practices

### Recommended Module Structure

Split your mod into logical modules:

#### 1. **types.ts** - Type Definitions
```typescript
export type Widget = mod.UIWidget;
export type Dict = { [key: string]: any };

export enum GameState {
    Lobby,
    Countdown,
    InProgress,
    Ended
}
```

#### 2. **constants.ts** - Configuration & Constants
```typescript
export const VERSION = [1, 0, 0];
export const debugMode = false;
export const minimumInitialPlayerCount: number = 2;
export const mainHQID: number = 1;
export const REDCOLOR: number[] = [1, 0, 0];
```

#### 3. **state.ts** - Global State Management
```typescript
export let gameState: GameState = GameState.Lobby;
export let gameOver: boolean = false;
export let initialPlayerCount: number = 0;

// Provide setter functions for state modification
export function setGameState(state: GameState) {
    gameState = state;
}
```

#### 4. **helpers.ts** - Utility Functions
```typescript
export function MakeMessage(message: string, ...args: any[]): mod.Message {
    // ...
}

export function GetRandomInt(max: number): number {
    // ...
}
```

#### 5. **ui.ts** - UI Classes
```typescript
export class LobbyUI {
    // ...
}

export class MessageUI {
    // ...
}
```

#### 6. **player.ts** - Player Management
```typescript
export class JsPlayer {
    static playerInstances: mod.Player[] = [];
    // ...
}
```

#### 7. **messages.ts** - Message System
```typescript
export function MessageAllUI(message: mod.Message, textColor: number[]): void {
    // ...
}
```

#### 8. **gameflow.ts** - Game Flow Logic
```typescript
export async function CombatCountdown(): Promise<void> {
    // ...
}

export function CheckVictoryConditions(): boolean {
    // ...
}
```

#### 9. **updates.ts** - Update Loops
```typescript
export async function TickUpdate(): Promise<void> {
    // ...
}

export async function ThrottledUpdate(): Promise<void> {
    // ...
}
```

#### 10. **events.ts** - Event Handlers (Entry Point)
```typescript
export async function OnGameModeStarted(): Promise<void> {
    // Main entry point
}

export function OnPlayerJoinGame(player: mod.Player): void {
    // ...
}
// ... all other exported event handlers
```

---

## Build Configuration

### build.config.json Structure

```json
{
  "modName": "YourModName",
  "description": "Brief description of your mod",
  "version": [1, 0, 0],
  "sourceDir": "src",
  "outputFile": "YourModName.ts",
  "entryPoint": "events.ts",
  "files": [
    "types.ts",
    "constants.ts",
    "state.ts",
    "helpers.ts",
    "ui.ts",
    "player.ts",
    "messages.ts",
    "gameflow.ts",
    "updates.ts",
    "events.ts"
  ]
}
```

#### Configuration Fields

- **modName** (required): Name of your mod
- **description** (optional): Brief description
- **version** (optional): Version as [major, minor, patch]
- **sourceDir** (required): Directory containing source files (relative to config)
- **outputFile** (required): Output filename (relative to config)
- **entryPoint** (required): Main entry file (must contain exports)
- **files** (required): Array of source files in build order

**Important**: Files are processed in the order specified. Put dependencies before files that use them.

---

## Build Scripts

### Available Commands

```bash
# Build a specific mod once
npm run build:mortar

# Watch a mod for changes (auto-rebuild)
npm run watch:mortar

# Build all mods at once
npm run build:all

# Clean generated files
npm run clean
```

### Adding a New Mod

1. Create mod folder: `mods/NewModName/`
2. Create `build.config.json` in the mod folder
3. Create `src/` folder with source files
4. Add build script to `package.json`:

```json
{
  "scripts": {
    "build:newmod": "node tools/build-mod.js mods/NewModName/build.config.json",
    "watch:newmod": "node tools/watch-mod.js mods/NewModName/build.config.json"
  }
}
```

---

## How the Build Process Works

### 1. Code Categorization

The build tool automatically categorizes your code into sections:

- **Types** - `type`, `interface`, `enum` declarations
- **Constants** - `const` declarations (non-functions)
- **Globals** - `let` and `var` declarations
- **Helpers** - Standalone functions
- **Classes** - `class` declarations
- **Functions** - Regular functions
- **Exports** - Exported functions (event handlers)

### 2. Section Ordering

The output file is organized in this order:

1. Build header with metadata
2. Type definitions
3. Constants
4. Global state variables
5. Helper functions
6. Classes
7. Internal functions
8. Exported event handlers

### 3. Import/Export Handling

- `import` statements are removed (code is combined)
- `export` keywords are preserved for event handlers
- Internal `export` keywords (for cross-file usage) are removed

---

## Development Workflow

### Typical Workflow

1. **Setup**: Create mod structure and config file
2. **Develop**: Write code in separate source files
3. **Build**: Run `npm run build:yourmod` to generate output
4. **Test**: Test the generated file in BF6 Portal
5. **Iterate**: Make changes and rebuild
6. **Watch Mode**: Use `npm run watch:yourmod` for auto-rebuild

### Using Watch Mode

Watch mode is highly recommended during development:

```bash
npm run watch:mortar
```

- Monitors all source files for changes
- Automatically rebuilds when files are saved
- Shows clear console output
- Press `Ctrl+C` to stop

### Best Practices

1. **Never edit the generated output file** - always edit source files
2. **Use watch mode** during active development
3. **Build before committing** to ensure output is up-to-date
4. **Test after building** to verify the combined file works
5. **Keep files focused** - one responsibility per file
6. **Document dependencies** in file headers

---

## Module Dependencies

### Managing Cross-File Dependencies

When one file depends on another, import what you need:

```typescript
// helpers.ts
export function MakeMessage(message: string, ...args: any[]): mod.Message {
    // ...
}

// messages.ts
import { MakeMessage } from './helpers';

export function MessageAllUI(message: mod.Message): void {
    // Use MakeMessage here
}
```

**Important**: Ensure files are listed in dependency order in `build.config.json`.

### Avoiding Circular Dependencies

Circular dependencies can cause issues. Avoid them by:

1. **Using interfaces** instead of importing concrete classes
2. **Moving shared types** to `types.ts`
3. **Extracting shared code** to a common module
4. **Using dependency injection** patterns

Example:

```typescript
// ui.ts - Instead of importing JsPlayer
export class LobbyUI {
    #jsPlayer: any; // Generic type, no import needed
    
    constructor(jsPlayer: any) {
        this.#jsPlayer = jsPlayer;
    }
}

// player.ts - Can safely import LobbyUI
import { LobbyUI } from './ui';

export class JsPlayer {
    lobbyUI?: LobbyUI;
}
```

---

## Troubleshooting

### Build Fails

**Problem**: Build script throws an error

**Solutions**:
- Check that all files in `build.config.json` exist
- Verify JSON syntax in config file
- Ensure `sourceDir` and `outputFile` paths are correct
- Check console for specific error messages

### Missing Code in Output

**Problem**: Some code doesn't appear in the output file

**Solutions**:
- Verify the file is listed in `build.config.json` files array
- Check that the file is in the correct `sourceDir`
- Ensure imports/exports are used correctly
- Look for syntax errors in source files

### Type Errors in Source Files

**Problem**: TypeScript shows errors in source files

**Solutions**:
- These are expected during development (separate files)
- The build tool removes imports when combining
- The final output should be valid TypeScript
- Focus on whether the *output* file works correctly

### Output File Not Working in BF6

**Problem**: Generated file doesn't work in Portal

**Solutions**:
- Check console logs in game for errors
- Verify all `mod.` API calls are correct
- Ensure exported functions match Portal's expected names
- Test event handlers are being called
- Check that global state is properly initialized

---

## Advanced Usage

### Section Comments

Use comment markers to help the build tool categorize code:

```typescript
///////////////////////////////////////////////////////////////////////////////
// HELPER FUNCTIONS
///////////////////////////////////////////////////////////////////////////////

function myHelper() {
    // ...
}
```

Recognized markers:
- `TYPE DEFINITION` or `TYPES` → types section
- `CONSTANTS` or `CONFIGURATION` → constants section
- `HELPER` or `UTILITIES` → helpers section
- `CLASS` (before class declaration) → classes section

### Custom Build Tools

You can extend the build system:

```javascript
// tools/custom-builder.js
const ModBuilder = require('./build-mod.js');

class CustomBuilder extends ModBuilder {
    // Override or extend methods
    generateOutput() {
        // Custom output generation
        super.generateOutput();
    }
}
```

---

## Example: Creating a New Mod

### Step 1: Create Directory Structure

```bash
mkdir -p mods/MyNewMod/src
```

### Step 2: Create Config File

`mods/MyNewMod/build.config.json`:

```json
{
  "modName": "MyNewMod",
  "description": "My awesome new game mode",
  "version": [1, 0, 0],
  "sourceDir": "src",
  "outputFile": "MyNewMod.ts",
  "entryPoint": "events.ts",
  "files": [
    "types.ts",
    "constants.ts",
    "events.ts"
  ]
}
```

### Step 3: Create Source Files

`mods/MyNewMod/src/types.ts`:

```typescript
export enum GameState {
    Waiting,
    Active,
    Ended
}
```

`mods/MyNewMod/src/constants.ts`:

```typescript
export const VERSION = [1, 0, 0];
export const MIN_PLAYERS = 2;
```

`mods/MyNewMod/src/events.ts`:

```typescript
import { VERSION, MIN_PLAYERS } from './constants';
import { GameState } from './types';

export async function OnGameModeStarted(): Promise<void> {
    console.log("MyNewMod Started - Version", VERSION.join('.'));
    // Your game mode logic here
}

export function OnPlayerJoinGame(player: mod.Player): void {
    console.log("Player joined");
}
```

### Step 4: Add Build Scripts

In `package.json`:

```json
{
  "scripts": {
    "build:mynewmod": "node tools/build-mod.js mods/MyNewMod/build.config.json",
    "watch:mynewmod": "node tools/watch-mod.js mods/MyNewMod/build.config.json"
  }
}
```

### Step 5: Build and Test

```bash
npm run build:mynewmod
```

This generates `mods/MyNewMod/MyNewMod.ts` ready for BF6 Portal!

---

## Tips & Tricks

### 1. Use TypeScript Features

Even though the output is a single file, use TypeScript features in your source:

- Type safety with interfaces and types
- Enums for state management
- Access modifiers (private, protected)
- Async/await for cleaner code

### 2. Keep Modules Small

Aim for 100-300 lines per file. Benefits:

- Easier to navigate
- Simpler to test
- Clearer responsibilities
- Better for collaboration

### 3. Version Control

Commit both source files AND generated output:

```
git add mods/MyMod/src/*.ts
git add mods/MyMod/MyMod.ts
git add mods/MyMod/build.config.json
```

This lets you:
- Track changes to both source and output
- Review diffs in source files
- Ensure output stays in sync

### 4. Code Reviews

Review the **source files** in PRs, not the generated output. The output is just a build artifact.

### 5. Documentation

Document each module's purpose at the top:

```typescript
/**
 * Player Management Module
 * 
 * Handles player state tracking, lifecycle events, and per-player data.
 * 
 * Dependencies: ui.ts, constants.ts
 * Exports: JsPlayer class
 */
```

---

## Migration Guide

### Converting Single-File Mods

To convert an existing single-file mod:

1. **Create structure**:
   ```bash
   mkdir -p mods/ExistingMod/src
   ```

2. **Split the file** into logical modules:
   - Extract types → `types.ts`
   - Extract constants → `constants.ts`
   - Extract classes → separate files per class
   - Extract event handlers → `events.ts`

3. **Add imports/exports** between files

4. **Create** `build.config.json`

5. **Build and test**:
   ```bash
   npm run build:existingmod
   ```

6. **Compare** output with original to verify correctness

---

## Support & Troubleshooting

### Getting Help

1. Check this documentation
2. Review the example `MortarGolf` mod structure
3. Read `dev_guidelines.md` for best practices
4. Check console output for specific errors

### Common Issues Reference

| Issue | Solution |
|-------|----------|
| Build fails | Check config file syntax and paths |
| Missing code | Verify file is in config files array |
| Type errors | Expected in source; check output file |
| Circular deps | Refactor using interfaces or any types |
| Watch not working | Ensure chokidar is installed |

---

## Future Enhancements

Potential improvements to the build system:

- [ ] Minification support
- [ ] Source maps for debugging
- [ ] Automatic dependency resolution
- [ ] Code validation before build
- [ ] Build profiles (debug/release)
- [ ] Hot reloading in development

---

## License & Credits

Part of the Battlefield 6 Portal SDK.

Build system created for the MortarGolf mod development.

---

**Happy coding! 🎮**
