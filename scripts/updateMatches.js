#!/usr/bin/env node

/**
 * Build-time script to fetch and update matches.json
 * Run this during deployment: node scripts/updateMatches.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = "https://fixturedownload.com/feed/json/fifa-world-cup-2026";
const OUTPUT_FILE = path.join(__dirname, "../src/data/matches.json");

async function updateMatches() {
  try {
    console.log("🌐 Fetching FIFA World Cup 2026 fixtures...");
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`API returned ${response.status} ${response.statusText}`);
    }

    const matches = await response.json();

    // Validate that we got an array
    if (!Array.isArray(matches) || matches.length === 0) {
      throw new Error("Invalid response: expected non-empty array");
    }

    // Write to file with nice formatting
    fs.writeFileSync(
      OUTPUT_FILE,
      JSON.stringify(matches, null, 4) + "\n",
      "utf8",
    );

    console.log(`✅ Updated ${matches.length} matches`);
    console.log(`📁 Saved to ${OUTPUT_FILE}`);
    console.log(`⏰ Last updated: ${new Date().toISOString()}`);
  } catch (error) {
    console.error("❌ Error updating matches:");
    console.error(error.message);
    process.exitCode = 1;
  }
}

updateMatches();
