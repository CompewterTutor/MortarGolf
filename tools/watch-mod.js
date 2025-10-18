#!/usr/bin/env node

/**
 * Battlefield 6 Portal - Mod Watch Tool
 * 
 * Watches source files and automatically rebuilds when changes are detected.
 * 
 * Usage:
 *   node tools/watch-mod.js <config-file>
 *   node tools/watch-mod.js mods/MortarGolf/build.config.json
 */

const fs = require('fs');
const path = require('path');
const ModBuilder = require('./build-mod.js');

let chokidar;
try {
    chokidar = require('chokidar');
} catch (e) {
    console.error('❌ chokidar not found. Install it with: npm install chokidar');
    process.exit(1);
}

class ModWatcher {
    constructor(configPath) {
        this.configPath = configPath;
        this.builder = new ModBuilder(configPath);
        this.watcher = null;
        this.building = false;
        this.rebuildQueued = false;
    }

    /**
     * Build the mod
     */
    async build() {
        if (this.building) {
            this.rebuildQueued = true;
            return;
        }

        this.building = true;
        console.clear();
        console.log('🔄 Building...\n');
        
        const success = this.builder.build();
        
        this.building = false;

        if (success) {
            console.log(`\n👀 Watching for changes... (Press Ctrl+C to stop)`);
        }

        // If rebuild was queued during build, do it now
        if (this.rebuildQueued) {
            this.rebuildQueued = false;
            setTimeout(() => this.build(), 100);
        }
    }

    /**
     * Start watching files
     */
    start() {
        try {
            // Load config to get source directory
            this.builder.loadConfig();
            
            const baseDir = path.dirname(this.configPath);
            const sourceDir = path.resolve(baseDir, this.builder.config.sourceDir);

            // Initial build
            this.build();

            // Watch source directory
            this.watcher = chokidar.watch(sourceDir, {
                ignored: /(^|[\/\\])\../, // ignore dotfiles
                persistent: true,
                ignoreInitial: true
            });

            // Watch config file too
            this.watcher.add(this.configPath);

            this.watcher
                .on('change', (filePath) => {
                    const relative = path.relative(process.cwd(), filePath);
                    console.log(`\n📝 Changed: ${relative}`);
                    this.build();
                })
                .on('add', (filePath) => {
                    const relative = path.relative(process.cwd(), filePath);
                    console.log(`\n➕ Added: ${relative}`);
                    this.build();
                })
                .on('unlink', (filePath) => {
                    const relative = path.relative(process.cwd(), filePath);
                    console.log(`\n➖ Removed: ${relative}`);
                    this.build();
                })
                .on('error', (error) => {
                    console.error(`\n❌ Watcher error: ${error}`);
                });

        } catch (error) {
            console.error('\n❌ Watch failed:');
            console.error(error.message);
            process.exit(1);
        }
    }

    /**
     * Stop watching files
     */
    stop() {
        if (this.watcher) {
            this.watcher.close();
        }
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Usage: node watch-mod.js <config-file>');
        console.error('Example: node watch-mod.js mods/MortarGolf/build.config.json');
        process.exit(1);
    }

    const configPath = args[0];
    const watcher = new ModWatcher(configPath);
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\n\n👋 Stopping watcher...');
        watcher.stop();
        process.exit(0);
    });

    watcher.start();
}

module.exports = ModWatcher;
