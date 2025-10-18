# MortarGolf - Battlefield 6 Portal Mod

## 🚀 Quick Start

```bash
# Navigate to mod folder
cd mods/MortarGolf

# Install dependencies (first time only)
npm install

# Start development with auto-rebuild
npm run watch

# Or build once
npm run build
```

The generated `MortarGolf.ts` file is ready to use in BF6 Portal!

---

## Build System

This mod uses a **modular build system** that allows organizing code into multiple TypeScript files during development, then automatically combines them into a single `.ts` file for BF6 Portal deployment.

### Quick Start

```bash
# Navigate to the mod folder
cd mods/MortarGolf

# Install dependencies (first time only)
npm install

# Build the mod once
npm run build

# Watch for changes and auto-rebuild (recommended during development)
npm run watch
```

### File Structure

```
MortarGolf/
├── build.config.json          # Build configuration
├── src/                       # Source code (EDIT THESE)
│   ├── types.ts              # Type definitions, enums
│   ├── constants.ts          # Game constants and config
│   ├── state.ts              # Global state management
│   ├── helpers.ts            # Utility functions
│   ├── ui.ts                 # UI classes (LobbyUI, MessageUI)
│   ├── player.ts             # JsPlayer class
│   ├── messages.ts           # Message display system
│   ├── gameflow.ts           # Game flow and victory logic
│   ├── updates.ts            # Update loops (tick, throttled)
│   └── events.ts             # Event handlers (entry point)
├── MortarGolf.ts             # Generated output (DON'T EDIT)
├── MortarGolf.strings.json   # Localization strings
├── DOCS/
│   ├── BUILD_SYSTEM.md       # Complete build system docs
│   ├── BUILD_QUICK_REF.md    # Quick reference guide
│   ├── dev_guidelines.md     # Development guidelines
│   └── common_checklist.md   # Development checklist
└── README.md                 # This file
```

### Development Workflow

1. **Make changes** to files in the `src/` directory
2. **Build** with `npm run build` or use watch mode (`npm run watch`)
3. **Test** the generated `MortarGolf.ts` file in BF6 Portal
4. **Iterate** and repeat

### Important Notes

- ⚠️ **Never edit `MortarGolf.ts` directly** - it's auto-generated
- ✅ Always edit files in the `src/` directory
- 📦 The build process combines all source files into one
- 👀 Use watch mode (`npm run watch:mortar`) for automatic rebuilds
- 📝 See `DOCS/BUILD_SYSTEM.md` for complete documentation

### Why Use the Build System?

**Benefits:**
- **Better organization** - Split code into logical modules
- **Easier maintenance** - Find and update code quickly
- **Cleaner diffs** - Review changes to specific modules
- **Team collaboration** - Multiple people can work on different files
- **Single file output** - Meets BF6 Portal's requirements

**How it works:**
1. Write code in separate TypeScript files with imports/exports
2. Build tool combines files in the correct order
3. Removes internal imports/exports, preserves event handler exports
4. Generates a single, valid BF6 Portal mod file

### Adding New Features

When adding new functionality:

1. Decide which module it belongs in (or create a new one)
2. Edit the appropriate file in `src/`
3. If you create a new file, add it to `build.config.json`
4. Build and test

### Documentation

- **[BUILD_SYSTEM.md](DOCS/BUILD_SYSTEM.md)** - Complete build system guide
- **[BUILD_QUICK_REF.md](DOCS/BUILD_QUICK_REF.md)** - Quick reference
- **[dev_guidelines.md](DOCS/dev_guidelines.md)** - Development best practices
- **[common_checklist.md](DOCS/common_checklist.md)** - Development checklist

### Troubleshooting

| Problem | Solution |
|---------|----------|
| Build fails | Check console for errors, verify config file |
| Missing code in output | Ensure file is in `build.config.json` files array |
| Type errors in IDE | Expected in source; check output file validity |
| Output doesn't work | Check console in game, verify event handlers |

### Getting Help

1. Check `DOCS/BUILD_SYSTEM.md` for detailed information
2. Review the example source files in `src/`
3. Read `dev_guidelines.md` for best practices
4. Check console output for specific error messages

---

**Happy modding! 🎮**
