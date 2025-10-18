#!/usr/bin/env node

/**
 * Battlefield 6 Portal - Clean Builds Tool
 * 
 * Removes all generated build files.
 */

const fs = require('fs');
const path = require('path');

const modDir = path.resolve(__dirname, '..');

console.log('🧹 Cleaning build files...\n');

const configPath = path.join(modDir, 'build.config.json');

if (!fs.existsSync(configPath)) {
    console.error('❌ build.config.json not found');
    process.exit(1);
}

// Read config to find output file
try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const outputPath = path.join(modDir, config.outputFile);
    
    if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
        console.log(`🗑️  Removed: ${path.relative(process.cwd(), outputPath)}`);
        console.log(`\n✅ Cleaned 1 file`);
    } else {
        console.log(`ℹ️  No build files found`);
    }
} catch (error) {
    console.error(`❌ Error cleaning: ${error.message}`);
    process.exit(1);
}
