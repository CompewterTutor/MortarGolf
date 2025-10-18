#!/usr/bin/env node

/**
 * Battlefield 6 Portal - Mod Build Tool
 * 
 * This script combines multiple TypeScript source files into a single .ts file
 * for deployment as a BF6 Portal mod, while preserving all code structure.
 * 
 * Usage:
 *   node tools/build-mod.js <config-file>
 *   node tools/build-mod.js mods/MortarGolf/build.config.json
 */

const fs = require('fs');
const path = require('path');

class ModBuilder {
    constructor(configPath) {
        this.configPath = configPath;
        this.config = null;
        this.processedFiles = new Set();
        this.sections = {
            header: [],
            types: [],
            constants: [],
            helpers: [],
            classes: [],
            globals: [],
            functions: [],
            exports: []
        };
    }

    /**
     * Load and validate build configuration
     */
    loadConfig() {
        if (!fs.existsSync(this.configPath)) {
            throw new Error(`Config file not found: ${this.configPath}`);
        }

        const configContent = fs.readFileSync(this.configPath, 'utf8');
        this.config = JSON.parse(configContent);

        // Validate required fields
        if (!this.config.modName) {
            throw new Error('Config missing required field: modName');
        }
        if (!this.config.sourceDir) {
            throw new Error('Config missing required field: sourceDir');
        }
        if (!this.config.outputFile) {
            throw new Error('Config missing required field: outputFile');
        }
        if (!this.config.entryPoint) {
            throw new Error('Config missing required field: entryPoint');
        }

        console.log(`✓ Loaded config for: ${this.config.modName}`);
    }

    /**
     * Read and process a TypeScript source file
     */
    readSourceFile(filePath) {
        if (this.processedFiles.has(filePath)) {
            return; // Already processed
        }

        if (!fs.existsSync(filePath)) {
            throw new Error(`Source file not found: ${filePath}`);
        }

        console.log(`  Processing: ${path.relative(process.cwd(), filePath)}`);
        
        const content = fs.readFileSync(filePath, 'utf8');
        this.processedFiles.add(filePath);
        
        return content;
    }

    /**
     * Categorize code sections from a file
     */
    categorizeCode(content, filePath) {
        const lines = content.split('\n');
        let currentSection = 'globals';
        let blockComment = false;
        let buffer = [];
        
        const flushBuffer = () => {
            if (buffer.length > 0) {
                this.sections[currentSection].push(...buffer);
                buffer = [];
            }
        };

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();

            // Skip import statements (we'll handle dependencies differently)
            if (trimmed.startsWith('import ') || trimmed.startsWith('export {')) {
                continue;
            }

            // Track block comments
            if (trimmed.includes('/*')) blockComment = true;
            if (trimmed.includes('*/')) blockComment = false;

            // Detect section headers from comments
            if (trimmed.includes('///////////////') || trimmed.includes('==============')) {
                flushBuffer();
                continue;
            }

            if (blockComment || trimmed.startsWith('//')) {
                // Check for section markers in comments
                const lower = trimmed.toLowerCase();
                if (lower.includes('type definition') || lower.includes('types')) {
                    flushBuffer();
                    currentSection = 'types';
                } else if (lower.includes('constants') || lower.includes('configuration')) {
                    flushBuffer();
                    currentSection = 'constants';
                } else if (lower.includes('helper') || lower.includes('utilities')) {
                    flushBuffer();
                    currentSection = 'helpers';
                } else if (lower.includes('class') && i < lines.length - 1 && lines[i + 1].includes('class ')) {
                    flushBuffer();
                    currentSection = 'classes';
                }
                buffer.push(line);
                continue;
            }

            // Detect code types
            if (trimmed.startsWith('type ') || trimmed.startsWith('interface ') || trimmed.startsWith('enum ')) {
                flushBuffer();
                currentSection = 'types';
            } else if (trimmed.startsWith('const ') && trimmed.includes('=') && !trimmed.includes('(')) {
                // Constants (not functions)
                if (currentSection !== 'constants') {
                    flushBuffer();
                    currentSection = 'constants';
                }
            } else if (trimmed.startsWith('let ') || trimmed.startsWith('var ')) {
                if (currentSection !== 'globals') {
                    flushBuffer();
                    currentSection = 'globals';
                }
            } else if (trimmed.startsWith('class ')) {
                flushBuffer();
                currentSection = 'classes';
            } else if (trimmed.startsWith('export async function ') || trimmed.startsWith('export function ')) {
                flushBuffer();
                currentSection = 'exports';
            } else if (trimmed.startsWith('async function ') || trimmed.startsWith('function ')) {
                if (currentSection !== 'functions') {
                    flushBuffer();
                    currentSection = 'functions';
                }
            }

            buffer.push(line);
        }

        flushBuffer();
    }

    /**
     * Process all source files in order
     */
    processSourceFiles() {
        console.log('\n📦 Processing source files...');

        // Get base directory
        const baseDir = path.dirname(this.configPath);
        const sourceDir = path.resolve(baseDir, this.config.sourceDir);

        // Process files in specified order
        const filesToProcess = this.config.files || [];
        
        if (filesToProcess.length === 0) {
            // No specific files listed, process entry point
            filesToProcess.push(this.config.entryPoint);
        }

        for (const file of filesToProcess) {
            const filePath = path.resolve(sourceDir, file);
            const content = this.readSourceFile(filePath);
            
            if (content) {
                this.categorizeCode(content, filePath);
            }
        }

        console.log(`✓ Processed ${this.processedFiles.size} file(s)`);
    }

    /**
     * Generate the combined output file
     */
    generateOutput() {
        console.log('\n🔨 Generating output file...');

        const lines = [];

        // Add header
        lines.push('/**');
        lines.push(` * ${this.config.modName}`);
        if (this.config.description) {
            lines.push(` * ${this.config.description}`);
        }
        lines.push(' * ');
        lines.push(` * This file was automatically generated by the BF6 Portal build system.`);
        lines.push(` * Build date: ${new Date().toISOString()}`);
        lines.push(' * ');
        lines.push(' * DO NOT EDIT THIS FILE DIRECTLY!');
        lines.push(' * Edit the source files in the src/ directory instead.');
        lines.push(' */');
        lines.push('');

        // Add build info comment
        if (this.config.version) {
            lines.push(`// Version: ${this.config.version.join('.')}`);
            lines.push('');
        }

        // Add sections in order
        const sectionOrder = [
            { key: 'types', header: 'TYPE DEFINITIONS' },
            { key: 'constants', header: 'CONSTANTS' },
            { key: 'globals', header: 'GLOBAL STATE VARIABLES' },
            { key: 'helpers', header: 'HELPER FUNCTIONS' },
            { key: 'classes', header: 'CLASSES' },
            { key: 'functions', header: 'FUNCTIONS' },
            { key: 'exports', header: 'EXPORTED EVENT HANDLERS' }
        ];

        for (const section of sectionOrder) {
            if (this.sections[section.key].length > 0) {
                lines.push('///////////////////////////////////////////////////////////////////////////////');
                lines.push(`// ${section.header}`);
                lines.push('///////////////////////////////////////////////////////////////////////////////');
                lines.push('');
                lines.push(...this.sections[section.key]);
                lines.push('');
            }
        }

        // Write output file
        const baseDir = path.dirname(this.configPath);
        const outputPath = path.resolve(baseDir, this.config.outputFile);
        const outputDir = path.dirname(outputPath);

        // Create output directory if needed
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');

        console.log(`✓ Output written to: ${path.relative(process.cwd(), outputPath)}`);
        console.log(`  Total lines: ${lines.length}`);
    }

    /**
     * Run the complete build process
     */
    build() {
        try {
            console.log('🚀 BF6 Portal Mod Builder\n');
            
            this.loadConfig();
            this.processSourceFiles();
            this.generateOutput();
            
            console.log('\n✅ Build complete!\n');
            return true;
        } catch (error) {
            console.error('\n❌ Build failed:');
            console.error(error.message);
            if (error.stack && process.env.DEBUG) {
                console.error('\nStack trace:');
                console.error(error.stack);
            }
            return false;
        }
    }
}

// Main execution
if (require.main === module) {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.error('Usage: node build-mod.js <config-file>');
        console.error('Example: node build-mod.js mods/MortarGolf/build.config.json');
        process.exit(1);
    }

    const configPath = args[0];
    const builder = new ModBuilder(configPath);
    const success = builder.build();
    
    process.exit(success ? 0 : 1);
}

module.exports = ModBuilder;
