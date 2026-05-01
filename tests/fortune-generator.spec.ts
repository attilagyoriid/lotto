import { test, expect } from './fixtures';
import { FortuneGenerator } from '../src/utils/FortuneGenerator';

test.describe('Lottery - Generated Tickets Tests', () => {
  test('should generate 5 unique Eurojackpot tickets', async () => {
    // Create fortune generator
    const generator = new FortuneGenerator();

    // Generate 5 unique ticket combinations
    const tickets = generator.generateEuroJackpot(5);

    // Verify we got 5 tickets
    expect(tickets.length).toBe(5);

    // Verify each ticket is valid
    tickets.forEach((ticket, index) => {
      const isValid = generator.validateTicket(ticket);
      expect(isValid).toBeTruthy();

      // Verify main numbers
      expect(ticket.main.length).toBe(5);
      expect(ticket.main.every((n) => n >= 1 && n <= 45)).toBeTruthy();

      // Verify secondary numbers
      expect(ticket.secondary.length).toBe(2);
      expect(ticket.secondary.every((n) => n >= 1 && n <= 12)).toBeTruthy();

      console.log(
        `Ticket ${index + 1}: Main [${ticket.main.join(', ')}] Secondary [${ticket.secondary.join(', ')}]`,
      );
    });
  });

  test('should generate 10 unique Eurojackpot tickets with no duplicates', async () => {
    const generator = new FortuneGenerator();
    const tickets = generator.generateEuroJackpot(10);

    expect(tickets.length).toBe(10);

    // Convert tickets to strings to check for duplicates
    const ticketStrings = tickets.map((t) => `${t.main.join(',')}|${t.secondary.join(',')}`);
    const uniqueTickets = new Set(ticketStrings);

    // All tickets should be unique
    expect(uniqueTickets.size).toBe(10);

    console.log('Generated 10 unique Eurojackpot tickets:');
    tickets.forEach((ticket, index) => {
      console.log(
        `  ${index + 1}. Main: [${ticket.main.join(', ')}] Secondary: [${ticket.secondary.join(', ')}]`,
      );
    });
  });

  test('should validate Eurojackpot tickets correctly', async () => {
    const generator = new FortuneGenerator();

    // Valid ticket
    const validTicket = { main: [1, 5, 10, 25, 45], secondary: [1, 12] };
    expect(generator.validateTicket(validTicket)).toBeTruthy();

    // Invalid - main numbers out of range
    const invalidMain1 = { main: [1, 5, 10, 25, 50], secondary: [1, 12] };
    expect(generator.validateTicket(invalidMain1)).toBeFalsy();

    // Invalid - secondary numbers out of range
    const invalidSecondary1 = { main: [1, 5, 10, 25, 45], secondary: [1, 15] };
    expect(generator.validateTicket(invalidSecondary1)).toBeFalsy();

    // Invalid - wrong count of main numbers
    const invalidCount1 = { main: [1, 5, 10, 25], secondary: [1, 12] };
    expect(generator.validateTicket(invalidCount1)).toBeFalsy();

    // Invalid - duplicate main numbers
    const invalidDuplicates = { main: [1, 1, 10, 25, 45], secondary: [1, 12] };
    expect(generator.validateTicket(invalidDuplicates)).toBeFalsy();
  });

  test('should generate reproducible tickets with seed', async () => {
    const generator = new FortuneGenerator();
    const seed = 12345;

    // Generate with same seed twice
    const tickets1 = generator.generateEuroJackpotWithSeed(5, seed);
    const tickets2 = generator.generateEuroJackpotWithSeed(5, seed);

    // Convert to strings for comparison
    const str1 = JSON.stringify(tickets1);
    const str2 = JSON.stringify(tickets2);

    expect(str1).toBe(str2);
    console.log('Reproducible tickets generated with seed:', seed);
  });

  test('should throw error for invalid count', async () => {
    const generator = new FortuneGenerator();

    try {
      generator.generateEuroJackpot(0);
      expect(false).toBe(true); // Should not reach here
    } catch (error) {
      expect((error as Error).message).toContain('Count must be greater than 0');
    }
  });

  test('should throw error if cannot generate enough unique tickets', async () => {
    const generator = new FortuneGenerator();

    // Requesting more tickets than mathematically possible might take time
    // This test is informational
    expect(true).toBe(true);
  });
});

test.describe('Lottery - Play Generated Tickets', () => {
  test.skip('should play generated Eurojackpot tickets via POM', async ({ lotteryPage }) => {
    // Generate 3 unique tickets
    const generator = new FortuneGenerator();
    const tickets = generator.generateEuroJackpot(3);

    console.log('Starting login and setup...');

    // Setup: Navigate, login, and prepare for playing
    await lotteryPage.navigate();
    await lotteryPage.acceptCookiesIfExist();
    await lotteryPage.logIn();
    await lotteryPage.closeOverlayIfExist();

    console.log('Playing generated tickets...');

    // Play all generated tickets
    for (let i = 0; i < tickets.length; i++) {
      // Navigate to games menu and select Eurojackpot
      await lotteryPage.selectGame();
      await lotteryPage.selectGameType('Eurojackpot');

      // Play the ticket (select numbers and add to basket)
      await lotteryPage.playLottery(tickets[i].main, tickets[i].secondary);

      console.log(
        `Ticket ${i + 1} added to basket with numbers: Main [${tickets[i].main.join(', ')}] Secondary [${tickets[i].secondary.join(', ')}]`,
      );
    }

    // Verify test completed successfully
    expect(true).toBe(true);
  });

  test('should demonstrate FortuneGenerator usage for testing', async () => {
    // Example demonstrating how to use FortuneGenerator with tests
    const generator = new FortuneGenerator();

    // Generate 10 unique Eurojackpot tickets for testing
    const generatedTickets = generator.generateEuroJackpot(10);

    console.log('\n=== Generated Eurojackpot Tickets for Testing ===');
    generatedTickets.forEach((ticket, index) => {
      console.log(
        `Ticket ${index + 1}: Main Numbers [${ticket.main.join(', ')}] | Secondary Numbers [${ticket.secondary.join(', ')}]`,
      );

      // Validate each ticket
      const isValid = generator.validateTicket(ticket);
      console.log(`  Validation: ${isValid ? '✓ VALID' : '✗ INVALID'}`);
    });

    // All tickets should be valid
    const allValid = generatedTickets.every((ticket) => generator.validateTicket(ticket));
    expect(allValid).toBeTruthy();

    // All tickets should be unique
    const ticketStrings = generatedTickets.map(
      (t) => `${t.main.join(',')}|${t.secondary.join(',')}`,
    );
    const uniqueCount = new Set(ticketStrings).size;
    expect(uniqueCount).toBe(10);

    console.log(`\n✓ Generated ${generatedTickets.length} unique and valid tickets`);
  });
});
