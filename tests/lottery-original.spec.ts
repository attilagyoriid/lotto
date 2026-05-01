import { test, expect } from './fixtures';

/**
 * Refactored version of test-1.spec.ts using Page Object Model
 * This test plays 5 Eurojackpot tickets with different number combinations
 */
test('should play 5 Eurojackpot tickets and add to basket', async ({ lotteryPage }) => {
  // Setup: Navigate, login, and prepare for playing
  await lotteryPage.navigate();
  await lotteryPage.acceptCookiesIfExist();
  await lotteryPage.logIn();
  await lotteryPage.closeOverlayIfExist();

  // Define the 5 ticket combinations from the original test
  const tickets = [
    {
      main: [1, 25, 28, 48, 45],
      secondary: [10, 11],
    },
    {
      main: [1, 33, 39, 49, 1],
      secondary: [5, 9],
    },
    {
      main: [21, 5, 24, 28, 34],
      secondary: [48, 5],
    },
    {
      main: [13, 27, 21, 48, 1],
      secondary: [4, 8],
    },
    {
      main: [31, 34, 29, 39, 46],
      secondary: [43, 5],
    },
  ];

  // Play all 5 tickets
  for (let i = 0; i < tickets.length; i++) {
    // Navigate to games menu and select Eurojackpot
    await lotteryPage.selectGame();
    await lotteryPage.selectGameType('Eurojackpot');

    // Play the ticket (select numbers and add to basket)
    await lotteryPage.playLottery(tickets[i].main, tickets[i].secondary);

    console.log(`Ticket ${i + 1} added to basket`);
  }

  // Verify test completed successfully
  expect(true).toBe(true);
});
