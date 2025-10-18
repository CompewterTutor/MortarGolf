# Build System Quick Reference

## Commands

```bash
# Navigate to mod folder
cd mods/MortarGolf

# Install dependencies
npm install

# Build once
npm run build

# Watch for changes (auto-rebuild)
npm run watch

# Clean builds
npm run clean
```

## File Structure

```
mods/YourMod/
├── build.config.json          # Build configuration
├── src/                       # Source files (edit these)
│   ├── types.ts              # Types, enums, interfaces
│   ├── constants.ts          # Configuration constants
│   ├── state.ts              # Global state variables
│   ├── helpers.ts            # Utility functions
│   ├── ui.ts                 # UI classes
│   ├── player.ts             # Player management
│   ├── messages.ts           # Message system
│   ├── gameflow.ts           # Game flow logic
│   ├── updates.ts            # Update loops
│   └── events.ts             # Event handlers (entry)
└── YourMod.ts                # Generated output (DON'T EDIT)
```

## Typical Workflow

1. Edit source files in `src/`
2. Run `npm run watch` (auto-rebuild on save)
3. Test in BF6 Portal using `MortarGolf.ts`
4. Iterate and repeat

## Creating a New Mod

To create a new mod with the build system:

1. **Copy MortarGolf folder**: `cp -r mods/MortarGolf mods/NewMod`
2. **Update config**: Edit `mods/NewMod/build.config.json`
   - Change `modName` to your mod name
   - Update `outputFile` to match your mod name
3. **Clean old build**: `cd mods/NewMod && npm run clean`
4. **Update files**: Modify source files in `src/`
5. **Build**: `npm run build`

## Config Template

```json
{
  "modName": "YourModName",
  "description": "Your mod description",
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

## Important Rules

✅ **DO:**
- Edit files in `src/` directory
- Use `npm run watch:*` during development
- List files in dependency order in config
- Build before testing in game

❌ **DON'T:**
- Edit the generated output file
- Forget to add new files to config
- Create circular dependencies
- Skip building before testing

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check config file paths and syntax |
| Missing code | Add file to `files` array in config |
| Type errors in IDE | Expected; output file will be valid |
| Watch not working | Run `npm install` to get dependencies |

## See Full Docs

For detailed information, see [BUILD_SYSTEM.md](BUILD_SYSTEM.md)
