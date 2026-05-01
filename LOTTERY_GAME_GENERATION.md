# Parameterized Lottery Game Generation Guide

This document explains how to use the parameterized test runner to generate different numbers of Eurojackpot ticket combinations.

## Quick Start

### Predefined Scripts (Easiest)

Generate 5 tickets:

```bash
npm run generate:5
```

Generate 10 tickets:

```bash
npm run generate:10
```

Generate 20 tickets:

```bash
npm run generate:20
```

Generate 50 tickets:

```bash
npm run generate:50
```

### Custom Count with Environment Variable

Generate 15 tickets:

```bash
cross-env GAME_NUMBER=15 npm test fortune-generator-with-params.spec.ts
```

Generate 30 tickets:

```bash
cross-env GAME_NUMBER=30 npm test fortune-generator-with-params.spec.ts
```

Generate 100 tickets:

```bash
cross-env GAME_NUMBER=100 npm test fortune-generator-with-params.spec.ts
```

## Available NPM Scripts

### Generation Scripts

| Command               | Description                | Count |
| --------------------- | -------------------------- | ----- |
| `npm run generate:5`  | Generate 5 unique tickets  | 5     |
| `npm run generate:10` | Generate 10 unique tickets | 10    |
| `npm run generate:20` | Generate 20 unique tickets | 20    |
| `npm run generate:50` | Generate 50 unique tickets | 50    |

### Custom Count Script

```bash
npm run test:generate:games -- --gameNumber=25
```

**Note:** This script accepts a `gameNumber` parameter (e.g., 25, 100, etc.)

## Parameter Methods

### Method 1: Environment Variable with `cross-env` (Recommended)

Works on Windows, macOS, and Linux:

```bash
cross-env GAME_NUMBER=25 npm test fortune-generator-with-params.spec.ts
```

### Method 2: Direct Environment Variable (Unix/Linux/macOS)

```bash
GAME_NUMBER=25 npm test fortune-generator-with-params.spec.ts
```

### Method 3: Windows Command Line

```cmd
set GAME_NUMBER=25 && npm test fortune-generator-with-params.spec.ts
```

### Method 4: Windows PowerShell

```powershell
$env:GAME_NUMBER=25; npm test fortune-generator-with-params.spec.ts
```

## Test File Features

The `fortune-generator-with-params.spec.ts` test file includes:

### Test Suite 1: Parameterized Tests

- Generate specified number of unique tickets
- Verify no duplicates
- Validate ticket format and ordering
- Log results to file

### Test Suite 2: Play Generated Tickets

- Generate tickets with specified count
- Login to lottery website
- Play all generated tickets automatically
- Log each ticket played

### Test Suite 3: Statistics and Summary

- Calculate min/max/average for numbers
- Show unique numbers used
- Display comprehensive statistics

## Output and Logging

### Console Output

Tests provide real-time feedback:

```
🎲 Configured to generate 10 unique Eurojackpot tickets

📊 Starting generation of 10 unique tickets...
✓ Generated 10 tickets
✓ Unique tickets: 10/10

🔍 Verifying format of 10 tickets...
📋 Format Verification Results:
  - Valid & Ordered: 10/10
  - Format Errors: 0

✅ All 10 tickets are properly formatted and ordered!
```

### Log Files

Logs are saved to `logs/` directory:

- `fortune-generated.log` - Main generation log
- `fortune-format-check.log` - Format verification log
- `fortune-{GAME_NUMBER}-tickets.log` - Numbered by count
- `lottery-{GAME_NUMBER}-play.log` - Lottery play log
- `fortune-stats-{GAME_NUMBER}.log` - Statistics log

### Log File Format

Each ticket is formatted as:

```
[ 1] 01,04,08,12,45 - 01,12
[ 2] 05,12,23,34,44 - 02,11
[ 3] 02,15,28,39,43 - 03,10
...
```

Format: `main1,main2,main3,main4,main5 - secondary1,secondary2`

## Examples

### Generate 15 Unique Tickets

```bash
cross-env GAME_NUMBER=15 npm test fortune-generator-with-params.spec.ts
```

Output:

- 4 test suites run
- 15 unique tickets generated
- All tickets logged and verified
- No duplicates found

### Generate and Play 5 Lottery Tickets

```bash
npm run generate:5
```

This will:

1. Generate 5 unique ticket combinations
2. Login to the lottery website
3. Play all 5 tickets
4. Log each ticket played

### Generate 50 Tickets with Statistics

```bash
cross-env GAME_NUMBER=50 npm test fortune-generator-with-params.spec.ts
```

Output includes:

- 50 unique tickets generated
- Format verification
- Comprehensive statistics (min, max, average numbers used)
- All results logged to file

## Verification

Each generated set is automatically verified for:

✅ **Uniqueness**: No duplicate combinations in the set
✅ **Format**: Each ticket has exactly 5 main + 2 secondary numbers
✅ **Ranges**: Main numbers 1-45, Secondary numbers 1-12
✅ **Ordering**: All numbers sorted in ascending order
✅ **Validation**: All tickets pass validation checks

## Default Behavior

If no `GAME_NUMBER` is specified:

```bash
npm test fortune-generator-with-params.spec.ts
```

The default count is **10 tickets**.

## Installation

Before running scripts, install dependencies:

```bash
npm install
```

This installs:

- `@playwright/test` - Playwright testing framework
- `cross-env` - Cross-platform environment variable setter
- `dotenv` - Environment variable loader
- TypeScript and other dependencies

## Troubleshooting

### "GAME_NUMBER is not recognized" Error

**Solution:** Use `cross-env` instead:

```bash
cross-env GAME_NUMBER=10 npm test fortune-generator-with-params.spec.ts
```

### "cross-env not found" Error

**Solution:** Install dependencies:

```bash
npm install
```

### Invalid GAME_NUMBER Error

The count must be a positive number. Valid examples:

```bash
cross-env GAME_NUMBER=5 npm test fortune-generator-with-params.spec.ts
cross-env GAME_NUMBER=100 npm test fortune-generator-with-params.spec.ts
```

Invalid examples:

```bash
cross-env GAME_NUMBER=0 npm test fortune-generator-with-params.spec.ts      # Won't work (0)
cross-env GAME_NUMBER=-5 npm test fortune-generator-with-params.spec.ts      # Won't work (negative)
cross-env GAME_NUMBER=abc npm test fortune-generator-with-params.spec.ts      # Won't work (not a number)
```

## Performance Notes

- Generating 5 tickets: ~1 second
- Generating 10 tickets: ~1.5 seconds
- Generating 20 tickets: ~2 seconds
- Generating 50 tickets: ~3-4 seconds
- Generating 100 tickets: ~5-6 seconds

Performance depends on:

- Number of tickets to generate
- Duplicate checking overhead
- File I/O for logging
- Browser automation (if playing actual tickets)

## Integration with CI/CD

For continuous integration pipelines:

```bash
# GitHub Actions example
- name: Generate 10 lottery tickets
  run: npm run generate:10

# GitLab CI example
generate_tickets:
  script:
    - npm install
    - npm run generate:20
```

## Summary

| Use Case               | Command                                                                  |
| ---------------------- | ------------------------------------------------------------------------ |
| Generate 5 tickets     | `npm run generate:5`                                                     |
| Generate 10 tickets    | `npm run generate:10`                                                    |
| Generate 20 tickets    | `npm run generate:20`                                                    |
| Generate custom count  | `cross-env GAME_NUMBER=X npm test fortune-generator-with-params.spec.ts` |
| Play tickets (5)       | `npm run generate:5` (includes login & play)                             |
| Just generate & verify | `npm run test:generate` (uses default 10)                                |

For more information about FortuneGenerator class, see [src/utils/FortuneGenerator.ts](../src/utils/FortuneGenerator.ts).
