import * as fs from 'fs';
import * as path from 'path';

/**
 * Interface representing a single Eurojackpot ticket with main and secondary numbers
 */
export interface EuroJackpotTicket {
  main: number[];
  secondary: number[];
}

/**
 * FortuneGenerator class for generating random Eurojackpot number combinations
 */
export class FortuneGenerator {
  private logFile: string;
  private logBuffer: string[] = [];

  constructor(logFileName: string = 'fortune-generator.log') {
    // Create logs directory if it doesn't exist
    const logsDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    this.logFile = path.join(logsDir, logFileName);
  }

  /**
   * Add message to log buffer
   */
  private addLog(message: string): void {
    this.logBuffer.push(message);
    console.log(message);
  }

  /**
   * Format a ticket as a readable string: "main1,main2,main3,main4,main5 - secondary1,secondary2"
   */
  private formatTicket(ticket: EuroJackpotTicket): string {
    const mainStr = ticket.main.map((n) => String(n).padStart(2, ' ')).join(',');
    const secondaryStr = ticket.secondary.map((n) => String(n).padStart(2, ' ')).join(',');
    return `${mainStr} - ${secondaryStr}`;
  }

  /**
   * Log all tickets to file and console
   */
  private logTickets(tickets: EuroJackpotTicket[]): void {
    this.addLog('\n╔════════════════════════════════════════════════════════════╗');
    this.addLog('║          EUROJACKPOT GENERATED TICKETS                      ║');
    this.addLog('╚════════════════════════════════════════════════════════════╝');
    this.addLog(`Generated: ${new Date().toISOString()}`);
    this.addLog(`Total Tickets: ${tickets.length}`);
    this.addLog('────────────────────────────────────────────────────────────');

    // Collect all ticket strings for duplicate verification
    const ticketStrings = new Set<string>();

    tickets.forEach((ticket, index) => {
      const formatted = this.formatTicket(ticket);
      const ticketStr = this.ticketToString(ticket);
      const isDuplicate = ticketStrings.has(ticketStr);

      if (isDuplicate) {
        this.addLog(`[${String(index + 1).padStart(3, ' ')}] ${formatted} ⚠️ DUPLICATE DETECTED!`);
      } else {
        this.addLog(`[${String(index + 1).padStart(3, ' ')}] ${formatted}`);
        ticketStrings.add(ticketStr);
      }
    });

    this.addLog('────────────────────────────────────────────────────────────');
    const uniqueCount = ticketStrings.size;
    const status =
      uniqueCount === tickets.length
        ? '✓ ALL UNIQUE'
        : `✗ DUPLICATES FOUND (${tickets.length - uniqueCount})`;
    this.addLog(`Uniqueness Check: ${status}`);
    this.addLog('══════════════════════════════════════════════════════════════\n');
  }

  /**
   * Write buffered logs to file
   */
  public writeLogsToFile(): void {
    try {
      const content = this.logBuffer.join('\n');
      fs.appendFileSync(this.logFile, content + '\n\n');
      console.log(`✓ Logs written to: ${this.logFile}`);
    } catch (error) {
      console.error(`Failed to write logs to file: ${error}`);
    }
  }

  /**
   * Clear log buffer
   */
  public clearLogBuffer(): void {
    this.logBuffer = [];
  }
  /**
   * Generate random unique numbers from a range
   */
  private generateUniqueNumbers(min: number, max: number, count: number, exclude: number[] = []): number[] {
    const numbers: number[] = [];
    const available = Array.from({ length: max - min + 1 }, (_, i) => i + min)
      .filter((n) => !exclude.includes(n));

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * available.length);
      numbers.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return numbers.sort((a, b) => a - b);
  }

  /**
   * Convert ticket to string for duplicate checking
   */
  private ticketToString(ticket: EuroJackpotTicket): string {
    return `${ticket.main.join(',')}|${ticket.secondary.join(',')}`;
  }

  /**
   * Parse existing tickets from the log format string:
   * "[  1] 10,17,19,28,45 -  7,11"
   */
  public parseExistingTickets(raw: string): EuroJackpotTicket[] {
    return raw.split('|').map((entry) => {
      const [mainPart, secondaryPart] = entry.split('-');
      const main = mainPart.split(',').map((n) => parseInt(n.trim(), 10)).filter(Boolean);
      const secondary = secondaryPart.split(',').map((n) => parseInt(n.trim(), 10)).filter(Boolean);
      return { main, secondary };
    }).filter((t) => t.main.length === 5 && t.secondary.length === 2);
  }

  /**
   * Generate unique Eurojackpot tickets
   * Main numbers: 5 numbers between 1-50
   * Secondary numbers: 2 numbers between 1-12
   * @param count - Total number of tickets needed
   * @param logResults - Whether to log results to console and file
   * @param existingTickets - Already played tickets to exclude and prepend
   * @returns Full array: existingTickets + newly generated tickets
   */
  public generateEuroJackpot(
    count: number,
    logResults: boolean = true,
    existingTickets: EuroJackpotTicket[] = [],
  ): EuroJackpotTicket[] {
    if (count <= 0) {
      throw new Error('Count must be greater than 0');
    }

    this.clearLogBuffer();

    if (logResults) {
      this.addLog(`\n🎲 Generating ${count} new unique Eurojackpot tickets${existingTickets.length > 0 ? ` (excluding ${existingTickets.length} existing)` : ''}...`);
    }

    const tickets: EuroJackpotTicket[] = [];
    const seenTickets = new Set<string>(existingTickets.map((t) => this.ticketToString(t)));

    const maxAttempts = count * 100;
    let attempts = 0;

    while (tickets.length < count && attempts < maxAttempts) {
      const mainNumbers = this.generateUniqueNumbers(1, 50, 5);
      const secondaryNumbers = this.generateUniqueNumbers(1, 12, 2, mainNumbers);

      const ticket: EuroJackpotTicket = {
        main: mainNumbers,
        secondary: secondaryNumbers,
      };

      const ticketString = this.ticketToString(ticket);

      // Check if ticket is unique
      if (!seenTickets.has(ticketString)) {
        tickets.push(ticket);
        seenTickets.add(ticketString);
      }

      attempts++;
    }

    // Check if we generated enough unique tickets
    if (tickets.length < count) {
      throw new Error(
        `Could not generate ${count} unique tickets after ${maxAttempts} attempts. Generated ${tickets.length} tickets.`,
      );
    }

    if (logResults) {
      this.logTickets(tickets);
      this.writeLogsToFile();
    }

    return tickets;
  }

  /**
   * Generate Eurojackpot tickets with a specific seed for reproducibility
   * @param count - Number of unique tickets to generate
   * @param seed - Random seed for reproducible results
   * @param logResults - Whether to log results to console and file
   * @returns Array of unique Eurojackpot tickets
   */
  public generateEuroJackpotWithSeed(
    count: number,
    seed: number,
    logResults: boolean = true,
  ): EuroJackpotTicket[] {
    if (logResults) {
      this.clearLogBuffer();
      this.addLog(
        `\n🎲 Starting seeded generation (seed: ${seed}) of ${count} unique Eurojackpot tickets...`,
      );
    }

    // Simple seeded random number generator
    let currentSeed = seed;
    const seededRandom = () => {
      currentSeed = (currentSeed * 9301 + 49297) % 233280;
      return currentSeed / 233280;
    };

    const tickets: EuroJackpotTicket[] = [];
    const seenTickets = new Set<string>();

    const maxAttempts = count * 100;
    let attempts = 0;

    while (tickets.length < count && attempts < maxAttempts) {
      const mainNumbers = this.generateUniqueNumbersWithRandom(1, 50, 5, seededRandom);
      const secondaryNumbers = this.generateUniqueNumbersWithRandom(1, 12, 2, seededRandom, mainNumbers);

      const ticket: EuroJackpotTicket = {
        main: mainNumbers,
        secondary: secondaryNumbers,
      };

      const ticketString = this.ticketToString(ticket);

      if (!seenTickets.has(ticketString)) {
        tickets.push(ticket);
        seenTickets.add(ticketString);
      }

      attempts++;
    }

    if (tickets.length < count) {
      throw new Error(
        `Could not generate ${count} unique tickets after ${maxAttempts} attempts. Generated ${tickets.length} tickets.`,
      );
    }

    // Verify all tickets are unique
    const ticketStrings = tickets.map((t) => this.ticketToString(t));
    const uniqueTickets = new Set(ticketStrings);

    if (uniqueTickets.size !== count) {
      throw new Error(
        `Duplicate tickets detected! Generated: ${count}, Unique: ${uniqueTickets.size}`,
      );
    }

    if (logResults) {
      this.logTickets(tickets);
      this.writeLogsToFile();
    }

    return tickets;
  }

  /**
   * Helper method to generate unique numbers with a custom random function
   */
  private generateUniqueNumbersWithRandom(
    min: number,
    max: number,
    count: number,
    randomFn: () => number,
    exclude: number[] = [],
  ): number[] {
    const numbers: number[] = [];
    const available = Array.from({ length: max - min + 1 }, (_, i) => i + min)
      .filter((n) => !exclude.includes(n));

    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(randomFn() * available.length);
      numbers.push(available[randomIndex]);
      available.splice(randomIndex, 1);
    }

    return numbers.sort((a, b) => a - b);
  }

  /**
   * Validate Eurojackpot ticket
   */
  public validateTicket(ticket: EuroJackpotTicket): boolean {
    // Check main numbers
    if (
      !ticket.main ||
      ticket.main.length !== 5 ||
      ticket.main.some((n) => n < 1 || n > 50) ||
      new Set(ticket.main).size !== 5
    ) {
      return false;
    }

    // Check secondary numbers
    if (
      !ticket.secondary ||
      ticket.secondary.length !== 2 ||
      ticket.secondary.some((n) => n < 1 || n > 12) ||
      new Set(ticket.secondary).size !== 2
    ) {
      return false;
    }

    // Check no overlap between main and secondary
    if (ticket.secondary.some((n) => ticket.main.includes(n))) {
      return false;
    }

    return true;
  }

  /**
   * Verify that all tickets in a list are unique and log results
   */
  public verifyNoDuplicates(tickets: EuroJackpotTicket[]): {
    isDuplicate: boolean;
    totalTickets: number;
    uniqueCount: number;
    duplicateCount: number;
    allValid: boolean;
  } {
    const ticketStrings = new Set<string>();
    let duplicateCount = 0;
    let allValid = true;

    const ticketChecks = tickets.map((ticket, index) => {
      const isValid = this.validateTicket(ticket);
      const ticketStr = this.ticketToString(ticket);
      const isDuplicate = ticketStrings.has(ticketStr);

      if (!isValid) allValid = false;
      if (isDuplicate) duplicateCount++;

      ticketStrings.add(ticketStr);

      return {
        index: index + 1,
        ticket: this.formatTicket(ticket),
        isDuplicate,
        isValid,
      };
    });

    this.addLog('\n╔════════════════════════════════════════════════════════════╗');
    this.addLog('║            TICKET VERIFICATION REPORT                      ║');
    this.addLog('╚════════════════════════════════════════════════════════════╝');

    ticketChecks.forEach((check) => {
      const status = check.isDuplicate ? '⚠️ DUPLICATE' : check.isValid ? '✓ OK' : '✗ INVALID';
      this.addLog(`[${String(check.index).padStart(3, ' ')}] ${check.ticket} ${status}`);
    });

    const uniqueCount = ticketStrings.size;
    const hasDuplicates = duplicateCount > 0;

    this.addLog('────────────────────────────────────────────────────────────');
    this.addLog(`Total Tickets: ${tickets.length}`);
    this.addLog(`Unique Count: ${uniqueCount}`);
    this.addLog(`Duplicate Count: ${duplicateCount}`);
    this.addLog(`All Valid: ${allValid ? '✓ YES' : '✗ NO'}`);

    if (hasDuplicates) {
      this.addLog('⚠️  WARNING: Duplicate tickets detected!');
    } else {
      this.addLog('✓ No duplicates found');
    }

    this.addLog('══════════════════════════════════════════════════════════════\n');

    return {
      isDuplicate: hasDuplicates,
      totalTickets: tickets.length,
      uniqueCount,
      duplicateCount,
      allValid,
    };
  }
}
