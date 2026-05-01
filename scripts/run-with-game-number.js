#!/usr/bin/env node
const { execSync } = require('child_process');

// npm sets npm_config_* env vars from --key=value flags (lowercased)
// e.g. --gameNumber=123 becomes npm_config_gamenumber=123
const gameNumber = process.env['npm_config_gamenumber'] || '10';

execSync('npx playwright test fortune-generator-with-params.spec.ts --headed', {
  stdio: 'inherit',
  env: { ...process.env, GAME_NUMBER: gameNumber },
});
