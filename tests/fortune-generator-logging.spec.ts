import { test, expect } from './fixtures';
import { FortuneGenerator } from '../src/utils/FortuneGenerator';

test.describe('FortuneGenerator - With Logging and Duplicate Verification', () => {
  test('should generate 5 unique tickets and log with no duplicates', async () => {
    const generator = new FortuneGenerator('fortune-test-5.log');
    const tickets = generator.generateEuroJackpot(5, true);

    // Verify generation
    expect(tickets.length).toBe(5);

    // Verify all unique
    const ticketStrings = tickets.map((t) => `${t.main.join(',')}|${t.secondary.join(',')}`);
    const uniqueSet = new Set(ticketStrings);
    expect(uniqueSet.size).toBe(5);

    // Verify no duplicates report
    const verification = generator.verifyNoDuplicates(tickets);
    expect(verification.isDuplicate).toBe(false);
    expect(verification.duplicateCount).toBe(0);
    expect(verification.uniqueCount).toBe(5);
    expect(verification.allValid).toBe(true);
  });

  test('should generate 10 unique tickets with detailed logging', async () => {
    const generator = new FortuneGenerator('fortune-test-10.log');
    const tickets = generator.generateEuroJackpot(10, true);

    console.log(`\n✓ Generated ${tickets.length} tickets`);

    // Verify
    const verification = generator.verifyNoDuplicates(tickets);
    generator.writeLogsToFile();

    expect(verification.isDuplicate).toBe(false);
    expect(verification.uniqueCount).toBe(10);
    expect(verification.allValid).toBe(true);
  });

  test('should log and verify 3 tickets with formatted output', async () => {
    const generator = new FortuneGenerator('fortune-test-3.log');
    const tickets = generator.generateEuroJackpot(3, true);

    // Detailed verification and logging
    const verification = generator.verifyNoDuplicates(tickets);
    generator.writeLogsToFile();

    // All assertions
    expect(tickets.length).toBe(3);
    expect(verification.totalTickets).toBe(3);
    expect(verification.duplicateCount).toBe(0);
    expect(verification.isDuplicate).toBe(false);

    // Verify format: each ticket should be ordered
    tickets.forEach((ticket) => {
      // Main numbers should be ordered
      for (let i = 1; i < ticket.main.length; i++) {
        expect(ticket.main[i]).toBeGreaterThan(ticket.main[i - 1]);
      }
      // Secondary numbers should be ordered
      for (let i = 1; i < ticket.secondary.length; i++) {
        expect(ticket.secondary[i]).toBeGreaterThan(ticket.secondary[i - 1]);
      }
    });
  });

  test('should generate 20 tickets and ensure no duplicates across large set', async () => {
    const generator = new FortuneGenerator('fortune-test-20.log');
    const tickets = generator.generateEuroJackpot(20, true);

    expect(tickets.length).toBe(20);

    // Verify no duplicates
    const ticketMap = new Map<string, number>();
    let duplicateFound = false;

    tickets.forEach((ticket) => {
      const key = `${ticket.main.join(',')}|${ticket.secondary.join(',')}`;
      if (ticketMap.has(key)) {
        console.log(`Duplicate found: ${key}`);
        duplicateFound = true;
      }
      ticketMap.set(key, (ticketMap.get(key) || 0) + 1);
    });

    expect(duplicateFound).toBe(false);
    expect(ticketMap.size).toBe(20);

    // Log verification
    const verification = generator.verifyNoDuplicates(tickets);
    generator.writeLogsToFile();

    expect(verification.isDuplicate).toBe(false);
  });

  test('should generate tickets with seed and verify reproducibility', async () => {
    const seed = 12345;

    const generator1 = new FortuneGenerator('fortune-seed-1.log');
    const tickets1 = generator1.generateEuroJackpot(5, false); // No logging yet

    const generator2 = new FortuneGenerator('fortune-seed-2.log');
    const tickets2 = generator2.generateEuroJackpotWithSeed(5, seed, false);

    const generator3 = new FortuneGenerator('fortune-seed-3.log');
    const tickets3 = generator3.generateEuroJackpotWithSeed(5, seed, false);

    // With same seed, should be identical
    const str2 = JSON.stringify(tickets2);
    const str3 = JSON.stringify(tickets3);
    expect(str2).toBe(str3);

    // Verify no duplicates in each set
    [tickets1, tickets2, tickets3].forEach((tickets) => {
      const unique = new Set(tickets.map((t) => `${t.main.join(',')}|${t.secondary.join(',')}`));
      expect(unique.size).toBe(5);
    });

    console.log('✓ Reproducibility test passed');
  });

  test('should log all tickets in ordered format: X,X,X,X,X - X,X', async () => {
    const generator = new FortuneGenerator('fortune-format-test.log');
    const tickets = generator.generateEuroJackpot(5, true);

    // Verify format by checking console output
    tickets.forEach((ticket, index) => {
      // Main numbers: 5 numbers, each 1-45, ordered
      expect(ticket.main.length).toBe(5);
      expect(ticket.main.every((n) => n >= 1 && n <= 45)).toBe(true);
      for (let i = 1; i < ticket.main.length; i++) {
        expect(ticket.main[i]).toBeGreaterThan(ticket.main[i - 1]);
      }

      // Secondary numbers: 2 numbers, each 1-12, ordered
      expect(ticket.secondary.length).toBe(2);
      expect(ticket.secondary.every((n) => n >= 1 && n <= 12)).toBe(true);
      expect(ticket.secondary[1]).toBeGreaterThan(ticket.secondary[0]);

      console.log(
        `Ticket ${index + 1}: [${ticket.main.join(',')}] - [${ticket.secondary.join(',')}]`,
      );
    });

    generator.writeLogsToFile();
  });
});

test.describe('FortuneGenerator - Integration with LotteryPage', () => {
  test('should generate unique tickets and play them', async ({ lotteryPage }) => {
    const generator = new FortuneGenerator('lottery-play.log');

    // Generate 2 unique tickets
    const tickets = generator.generateEuroJackpot(2, true);

    // Verify before playing
    const verification = generator.verifyNoDuplicates(tickets);
    expect(verification.isDuplicate).toBe(false);

    // Setup lottery
    console.log('\n🎰 Starting lottery with generated tickets...');
    await lotteryPage.navigate();
    await lotteryPage.acceptCookiesIfExist();
    await lotteryPage.logIn();
    await lotteryPage.closeOverlayIfExist();

    // Play generated tickets
    for (let i = 0; i < tickets.length; i++) {
      await lotteryPage.selectGame();
      await lotteryPage.selectGameType('Eurojackpot');
      await lotteryPage.playLottery(tickets[i].main, tickets[i].secondary);

      console.log(
        `✓ Ticket ${i + 1} played: [${tickets[i].main.join(', ')}] - [${tickets[i].secondary.join(', ')}]`,
      );
    }

    generator.writeLogsToFile();
    console.log('✓ Successfully played all generated tickets\n');
  });
});
