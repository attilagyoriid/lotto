import { test, expect } from './fixtures';
import { FortuneGenerator } from '../src/utils/FortuneGenerator';
import type { EuroJackpotTicket } from '../src/utils/FortuneGenerator';

/**
 * This test file uses environment variables to determine the number of tickets to generate
 * Usage:
 *   npm run generate:10        # Generate 10 tickets
 *   npm run generate:20        # Generate 20 tickets
 *   npm run generate:50        # Generate 50 tickets
 *   npm run generate:5         # Generate 5 tickets
 *
 * Or with custom count:
 *   GAME_NUMBER=15 npm test fortune-generator-with-params.spec.ts
 *
 * Or using npm script parameter:
 *   npm run test:generate:games -- --gameNumber=25
 */

// Get game number from environment variable or use default
const _raw = process.env['GAME_NUMBER'] ?? process.env['npm_config_gamenumber'] ?? '10';
const GAME_NUMBER = parseInt(_raw, 10) > 0 ? parseInt(_raw, 10) : 10;

// Parse optional pre-existing tickets from EXISTING_TICKETS env var
const _existingRaw = process.env['EXISTING_TICKETS'] ?? '';
const EXISTING_TICKETS: EuroJackpotTicket[] = _existingRaw
  ? new FortuneGenerator().parseExistingTickets(_existingRaw)
  : [];

if (EXISTING_TICKETS.length > 0) {
  console.log(`\n📋 Found ${EXISTING_TICKETS.length} existing tickets, will generate ${GAME_NUMBER} new unique ones\n`);
}

console.log(`\n🎲 Configured to generate ${GAME_NUMBER} unique Eurojackpot tickets\n`);

test.describe('FortuneGenerator - Parameterized Tests', () => {
  test(`should generate ${GAME_NUMBER} unique tickets with no duplicates`, async () => {
    const generator = new FortuneGenerator('fortune-generated.log');

    console.log(`\n📊 Starting generation of ${GAME_NUMBER} unique tickets...`);

    // Generate tickets with the specified count
    const tickets = generator.generateEuroJackpot(GAME_NUMBER, true, EXISTING_TICKETS);

    // Verify count
    expect(tickets.length).toBe(GAME_NUMBER);
    console.log(`✓ Generated ${tickets.length} tickets`);

    // Verify all unique
    const ticketStrings = tickets.map((t) => `${t.main.join(',')}|${t.secondary.join(',')}`);
    const uniqueSet = new Set(ticketStrings);

    console.log(`✓ Unique tickets: ${uniqueSet.size}/${GAME_NUMBER}`);
    expect(uniqueSet.size).toBe(GAME_NUMBER);

    // Verify no duplicates
    const verification = generator.verifyNoDuplicates(tickets);
    generator.writeLogsToFile();

    console.log(`\n✓ Verification Report:`);
    console.log(`  - Total: ${verification.totalTickets}`);
    console.log(`  - Unique: ${verification.uniqueCount}`);
    console.log(`  - Duplicates: ${verification.duplicateCount}`);
    console.log(`  - All Valid: ${verification.allValid ? 'YES' : 'NO'}`);
    console.log(`  - Has Duplicates: ${verification.isDuplicate ? 'YES' : 'NO'}`);

    expect(verification.isDuplicate).toBe(false);
    expect(verification.uniqueCount).toBe(GAME_NUMBER);
    expect(verification.allValid).toBe(true);

    console.log(`\n✅ All ${GAME_NUMBER} tickets generated successfully with no duplicates!\n`);
  });

  test(`should verify all ${GAME_NUMBER} tickets are properly formatted and ordered`, async () => {
    const generator = new FortuneGenerator('fortune-format-check.log');
    const tickets = generator.generateEuroJackpot(GAME_NUMBER, false, EXISTING_TICKETS);

    console.log(`\n🔍 Verifying format of ${GAME_NUMBER} tickets...`);

    let validCount = 0;
    let formatErrors = 0;

    tickets.forEach((ticket, index) => {
      const isValid = generator.validateTicket(ticket);

      if (!isValid) {
        console.log(`❌ Ticket ${index + 1} INVALID`);
        formatErrors++;
        return;
      }

      // Check main numbers ordering
      for (let i = 1; i < ticket.main.length; i++) {
        if (ticket.main[i] <= ticket.main[i - 1]) {
          console.log(`❌ Ticket ${index + 1}: Main numbers not ordered`);
          formatErrors++;
          return;
        }
      }

      // Check secondary numbers ordering
      for (let i = 1; i < ticket.secondary.length; i++) {
        if (ticket.secondary[i] <= ticket.secondary[i - 1]) {
          console.log(`❌ Ticket ${index + 1}: Secondary numbers not ordered`);
          formatErrors++;
          return;
        }
      }

      validCount++;
    });

    console.log(`\n📋 Format Verification Results:`);
    console.log(`  - Valid & Ordered: ${validCount}/${GAME_NUMBER}`);
    console.log(`  - Format Errors: ${formatErrors}`);

    expect(validCount).toBe(GAME_NUMBER);
    expect(formatErrors).toBe(0);

    console.log(`\n✅ All ${GAME_NUMBER} tickets are properly formatted and ordered!\n`);
  });

  test(`should generate and log ${GAME_NUMBER} tickets to file`, async () => {
    const generator = new FortuneGenerator(`fortune-${GAME_NUMBER}-tickets.log`);

    console.log(`\n📝 Generating ${GAME_NUMBER} tickets and logging to file...`);

    const tickets = generator.generateEuroJackpot(GAME_NUMBER, true);
    generator.writeLogsToFile();

    console.log(`\n✓ Log file created: logs/fortune-${GAME_NUMBER}-tickets.log`);
    console.log(`✓ Total tickets logged: ${tickets.length}`);
    console.log(`\n✅ Successfully generated and logged ${GAME_NUMBER} tickets!\n`);

    expect(tickets.length).toBe(GAME_NUMBER);
  });
});

test.describe('FortuneGenerator - Play Generated Tickets', () => {
  test(`should generate ${GAME_NUMBER} tickets and play them via LotteryPage`, async ({
    lotteryPage,
  }) => {
    const generator = new FortuneGenerator(`lottery-${GAME_NUMBER}-play.log`);

    console.log(`\n🎰 Generating ${GAME_NUMBER} tickets for lottery play...`);

    // Generate tickets
    const tickets = generator.generateEuroJackpot(GAME_NUMBER, true, EXISTING_TICKETS);

    console.log(`\n🔐 Logging in and preparing lottery...`);

    // Setup lottery
    await lotteryPage.navigate();
    await lotteryPage.acceptCookiesIfExist();
    await lotteryPage.logIn();
    await lotteryPage.closeOverlayIfExist();

    console.log(`\n▶️  Playing ${tickets.length} new lottery tickets:\n`);

    for (let i = 0; i < tickets.length; i++) {
      await lotteryPage.navigateToEurojackpot();
      await lotteryPage.playLottery(tickets[i].main, tickets[i].secondary);

      const mainStr = tickets[i].main.map((n) => String(n).padStart(2, ' ')).join(',');
      const secondaryStr = tickets[i].secondary.map((n) => String(n).padStart(2, ' ')).join(',');
      console.log(`   [${String(EXISTING_TICKETS.length + i + 1).padStart(3, ' ')}] ${mainStr} - ${secondaryStr} ✓`);

      // Pause every 25 tickets and wait for user to press C in browser
      if ((i + 1) % 25 === 0 && i + 1 < tickets.length) {
        console.log(`\n⏸️  Played ${i + 1} tickets. Press C in the browser to continue with the next 25...\n`);
        await lotteryPage.waitForContinue();
      }
    }

    generator.writeLogsToFile();

    console.log(`\n✅ Successfully played ${tickets.length} lottery tickets!\n`);
    console.log(`\n⏸️  All done! Press C in the browser to finish...\n`);
    await lotteryPage.waitForContinue();

    expect(tickets.length).toBe(GAME_NUMBER);
  });
});

test.describe('FortuneGenerator - Statistics and Summary', () => {
  test(`should display statistics for ${GAME_NUMBER} generated tickets`, async () => {
    const generator = new FortuneGenerator(`fortune-stats-${GAME_NUMBER}.log`);
    const tickets = generator.generateEuroJackpot(GAME_NUMBER, false, EXISTING_TICKETS);

    // Calculate statistics
    const allMainNumbers: number[] = [];
    const allSecondaryNumbers: number[] = [];

    tickets.forEach((ticket) => {
      allMainNumbers.push(...ticket.main);
      allSecondaryNumbers.push(...ticket.secondary);
    });

    const mainStats = {
      min: Math.min(...allMainNumbers),
      max: Math.max(...allMainNumbers),
      avg: (allMainNumbers.reduce((a, b) => a + b, 0) / allMainNumbers.length).toFixed(2),
    };

    const secondaryStats = {
      min: Math.min(...allSecondaryNumbers),
      max: Math.max(...allSecondaryNumbers),
      avg: (allSecondaryNumbers.reduce((a, b) => a + b, 0) / allSecondaryNumbers.length).toFixed(2),
    };

    console.log(`\n📊 Statistics for ${GAME_NUMBER} Generated Tickets:\n`);
    console.log(`Main Numbers (5 per ticket = ${GAME_NUMBER * 5} total):`);
    console.log(`  Min: ${mainStats.min}, Max: ${mainStats.max}, Avg: ${mainStats.avg}`);
    console.log(`\nSecondary Numbers (2 per ticket = ${GAME_NUMBER * 2} total):`);
    console.log(
      `  Min: ${secondaryStats.min}, Max: ${secondaryStats.max}, Avg: ${secondaryStats.avg}`,
    );
    console.log(`\nTicket Statistics:`);
    console.log(`  Total Tickets: ${tickets.length}`);
    console.log(`  Total Numbers: ${allMainNumbers.length + allSecondaryNumbers.length}`);
    console.log(`  Unique Main Numbers Used: ${new Set(allMainNumbers).size}`);
    console.log(`  Unique Secondary Numbers Used: ${new Set(allSecondaryNumbers).size}`);

    expect(tickets.length).toBe(GAME_NUMBER);
    expect(mainStats.min).toBeGreaterThanOrEqual(1);
    expect(mainStats.max).toBeLessThanOrEqual(50);
    expect(secondaryStats.min).toBeGreaterThanOrEqual(1);
    expect(secondaryStats.max).toBeLessThanOrEqual(12);

    console.log(`\n✅ Statistics collected successfully!\n`);
  });
});
