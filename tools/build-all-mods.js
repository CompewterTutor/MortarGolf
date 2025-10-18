#!/usr/bin/env node

/**
 * Battlefield 6 Portal - Build All Mods Tool
 * 
 * Builds all mods that have a build.config.json file.
 */

const fs = require('fs');
const path = require('path');
const ModBuilder = require('./build-mod.js');

// When running from mod directory, just build this mod
const modDir = path.resolve(__dirname, '..');

console.log('🚀 Building mod...\n');

const configPath = path.join(modDir, 'build.config.json');

if (!fs.existsSync(configPath)) {
    console.error('❌ build.config.json not found in mod directory');
    process.exit(1);
}

console.log(`📦 Building ${path.basename(modDir)}...`);

const builder = new ModBuilder(configPath);
const success = builder.build();

if (success) {
    console.log(`✅ Build successful\n`);
} else {
    console.log(`❌ Build failed\n`);
}

process.exit(success ? 0 : 1);
