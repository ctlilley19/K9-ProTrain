#!/usr/bin/env node
/**
 * Icon Generator Script
 *
 * Generates PNG icons from the SVG source for PWA manifest.
 *
 * Usage: npm run generate-icons
 *
 * Prerequisites: npm install sharp
 */

const fs = require('fs');
const path = require('path');

async function generateIcons() {
  // Check if sharp is available
  let sharp;
  try {
    sharp = require('sharp');
  } catch {
    console.error('Error: sharp is not installed.');
    console.log('Please install it first: npm install --save-dev sharp');
    process.exit(1);
  }

  const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
  const inputPath = path.join(__dirname, '../public/icons/icon.svg');
  const outputDir = path.join(__dirname, '../public/icons');

  // Check if source SVG exists
  if (!fs.existsSync(inputPath)) {
    console.error('Error: Source SVG not found at', inputPath);
    process.exit(1);
  }

  console.log('Generating PNG icons from SVG...\n');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    try {
      await sharp(inputPath)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      console.log(`  Created: icon-${size}x${size}.png`);
    } catch (err) {
      console.error(`  Failed to create icon-${size}x${size}.png:`, err.message);
    }
  }

  // Also create favicon.ico (use 32x32 for favicon)
  const faviconPath = path.join(__dirname, '../public/favicon.ico');
  try {
    await sharp(inputPath)
      .resize(32, 32)
      .png()
      .toFile(faviconPath.replace('.ico', '.png'));
    console.log('\n  Created: favicon.png (rename to favicon.ico or use as-is)');
  } catch (err) {
    console.error('  Failed to create favicon:', err.message);
  }

  console.log('\nIcon generation complete!');
  console.log('Remember to update manifest.json if you added new icon sizes.');
}

generateIcons();
