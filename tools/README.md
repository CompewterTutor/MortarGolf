# MortarGolf Build Tools

This directory contains the build tools for combining multiple TypeScript source files into a single BF6 Portal mod file.

## Tools

### build-mod.js

Main build script that combines multiple `.ts` files into one.

**Usage:**
```bash
node tools/build-mod.js <config-file>
node tools/build-mod.js build.config.json
```

### watch-mod.js

Watch script that monitors source files and rebuilds automatically on changes.

**Usage:**
```bash
node tools/watch-mod.js <config-file>
node tools/watch-mod.js build.config.json
```

Press `Ctrl+C` to stop watching.

### build-all-mods.js

Builds this mod (simplified from multi-mod version).

**Usage:**
```bash
node tools/build-all-mods.js
```

### clean-builds.js

Removes generated build files.

**Usage:**
```bash
node tools/clean-builds.js
```

## NPM Scripts

Instead of calling these directly, use the npm scripts:

```bash
npm run build      # Build mod
npm run watch      # Watch mod
npm run clean      # Clean builds
```

## Dependencies

- **Node.js** - Required
- **chokidar** - Required for watch mode (`npm install`)

## Documentation

See the main documentation:
- [BUILD_SYSTEM.md](../DOCS/BUILD_SYSTEM.md) - Complete guide
- [BUILD_QUICK_REF.md](../DOCS/BUILD_QUICK_REF.md) - Quick reference
