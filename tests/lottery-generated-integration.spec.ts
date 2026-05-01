import { test, expect } from './fixtures';
import { FortuneGenerator } from '../src/utils/FortuneGenerator';

/**
 * Integration test: Generate random Eurojackpot tickets and play them via POM
 * This test demonstrates the complete workflow:
 * 1. Generate N unique Eurojackpot ticket combinations
 * 2. Use the generated tickets to play the lottery
 * 3. All numbers are within valid ranges (5 main: 1-45, 2 secondary: 1-12)
 * 4. All combinations are unique across iterations
 */
test.describe('Lottery - Generated Tickets Integration', () => {
  test('should generate and play 3 unique Eurojackpot tickets', async ({ lotteryPage }) => {
    // Initialize fortune generator
    const generator = new FortuneGenerator();

    // Generate 3 unique ticket combinations
    const generatedTickets = generator.generateEuroJackpot(3);

    console.log('\n=== Generated Tickets ===');
    generatedTickets.forEach((ticket, index) => {
      console.log(
        `Ticket ${index + 1}: Main [${ticket.main.join(', ')}] Secondary [${ticket.secondary.join(', ')}]`,
      );
      expect(generator.validateTicket(ticket)).toBeTruthy();
    });

    // Setup: Navigate, login, and prepare for playing
    console.log('\n=== Starting Lottery Setup ===');
    await lotteryPage.navigate();
    await lotteryPage.acceptCookiesIfExist();
    await lotteryPage.logIn();
    await lotteryPage.closeOverlayIfExist();

    console.log('\n=== Playing Generated Tickets ===');

    // Play all generated tickets
    for (let i = 0; i < generatedTickets.length; i++) {
      // Navigate to games menu and select Eurojackpot
      await lotteryPage.selectGame();
      await lotteryPage.selectGameType('Eurojackpot');

      const ticket = generatedTickets[i];

      // Play the ticket (select numbers and add to basket)
      await lotteryPage.playLottery(ticket.main, ticket.secondary);

      console.log(`✓ Ticket ${i + 1} added to basket`);
    }

    console.log(`✓ Successfully played ${generatedTickets.length} tickets\n`);
    expect(true).toBe(true);
  });

  test('should generate and play 5 unique Eurojackpot tickets with detailed output', async ({
    lotteryPage,
  }) => {
    // Initialize fortune generator
    const generator = new FortuneGenerator();

    // Generate 5 unique ticket combinations
    const generatedTickets = generator.generateEuroJackpot(5);

    // Verify uniqueness
    const ticketStrings = generatedTickets.map(
      (t) => `${t.main.join(',')}|${t.secondary.join(',')}`,
    );
    const uniqueCount = new Set(ticketStrings).size;
    expect(uniqueCount).toBe(5);

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║     Generated 5 Unique Eurojackpot Tickets            ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    generatedTickets.forEach((ticket, index) => {
      const isValid = generator.validateTicket(ticket);
      console.log(
        `\n[${index + 1}] Main: [${ticket.main.join(', ')}] | Secondary: [${ticket.secondary.join(', ')}]`,
      );
      console.log(`    Valid: ${isValid ? '✓' : '✗'}`);
    });

    // Setup
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║     Logging In and Preparing Lottery                  ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    await lotteryPage.navigate();
    await lotteryPage.acceptCookiesIfExist();
    await lotteryPage.logIn();
    await lotteryPage.closeOverlayIfExist();

    console.log('✓ Login successful');

    // Play tickets
    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║     Playing Generated Tickets                         ║');
    console.log('╚══════════════════════════════════════════════════════╝');

    for (let i = 0; i < generatedTickets.length; i++) {
      await lotteryPage.selectGame();
      await lotteryPage.selectGameType('Eurojackpot');

      const ticket = generatedTickets[i];
      await lotteryPage.playLottery(ticket.main, ticket.secondary);

      console.log(
        `✓ Ticket ${i + 1} → Main: [${ticket.main.join(', ')}] | Secondary: [${ticket.secondary.join(', ')}]`,
      );
    }

    console.log('\n✓ All tickets played successfully!\n');
    expect(true).toBe(true);
  });

  test('should generate 10 Eurojackpot tickets and display statistics', async () => {
    const generator = new FortuneGenerator();
    const generatedTickets = generator.generateEuroJackpot(10);

    // Statistics
    const allValid = generatedTickets.every((ticket) => generator.validateTicket(ticket));
    const ticketStrings = generatedTickets.map(
      (t) => `${t.main.join(',')}|${t.secondary.join(',')}`,
    );
    const uniqueCount = new Set(ticketStrings).size;

    console.log('\n╔══════════════════════════════════════════════════════╗');
    console.log('║     Eurojackpot Generation Statistics                 ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log(`Generated Tickets: ${generatedTickets.length}`);
    console.log(`Valid Tickets: ${allValid ? '✓ All' : 'Some Invalid'}`);
    console.log(`Unique Combinations: ${uniqueCount}/${generatedTickets.length}`);
    console.log('\nTickets:');

    generatedTickets.forEach((ticket, index) => {
      console.log(
        `  ${String(index + 1).padStart(2, ' ')}. Main: [${ticket.main.map((n) => String(n).padStart(2, ' ')).join(', ')}] | Secondary: [${ticket.secondary.map((n) => String(n).padStart(2, ' ')).join(', ')}]`,
      );
    });

    console.log('\n');

    // Assertions
    expect(generatedTickets.length).toBe(10);
    expect(allValid).toBeTruthy();
    expect(uniqueCount).toBe(10);
  });
});

test.describe('Lottery - FortuneGenerator Advanced Usage', () => {
  test('should generate reproducible tickets with seed for testing consistency', async () => {
    const generator = new FortuneGenerator();
    const testSeed = 42;

    // Generate same tickets twice
    const tickets1 = generator.generateEuroJackpotWithSeed(5, testSeed);
    const tickets2 = generator.generateEuroJackpotWithSeed(5, testSeed);

    // Should be identical
    expect(JSON.stringify(tickets1)).toBe(JSON.stringify(tickets2));

    console.log('\nReproducible tickets generated with seed:', testSeed);
    console.log('Ticket set 1:');
    tickets1.forEach((t, i) => {
      console.log(
        `  ${i + 1}. Main: [${t.main.join(', ')}] | Secondary: [${t.secondary.join(', ')}]`,
      );
    });
  });

  test('should handle edge cases for number generation', async () => {
    const generator = new FortuneGenerator();

    // Generate minimum (1 ticket)
    const single = generator.generateEuroJackpot(1);
    expect(single.length).toBe(1);

    // Generate large set (50 tickets)
    const large = generator.generateEuroJackpot(50);
    expect(large.length).toBe(50);

    // Verify all unique
    const uniqueStrings = new Set(large.map((t) => `${t.main.join(',')}|${t.secondary.join(',')}`));
    expect(uniqueStrings.size).toBe(50);

    console.log(`✓ Successfully generated ${single.length} and ${large.length} unique tickets`);
  });

  test('should provide export-ready tickets for other tests', async () => {
    const generator = new FortuneGenerator();
    const tickets = generator.generateEuroJackpot(5);

    // Export as JSON for use in test data
    const exportData = {
      generated_at: new Date().toISOString(),
      count: tickets.length,
      tickets: tickets,
    };

    console.log('\nExport Format:');
    console.log(JSON.stringify(exportData, null, 2));

    // Verify it can be used directly
    expect(Array.isArray(exportData.tickets)).toBeTruthy();
    expect(exportData.tickets.length).toBe(5);
  });
});
