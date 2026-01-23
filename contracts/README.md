
# BitTask Contracts

This directory contains the Clarity smart contracts for the BitTask decentralized marketplace.

## Contracts

- `bittask.clar`: Main marketplace contract. Manages task creation, assignment, verification, and payments.
- `erc1155.clar` & `token.clar`: Support contracts for token standards (if applicable/used).

## Prerequisites

- [Clarinet](https://github.com/hirosystems/clarinet)
- Node.js & npm

## Testing

We use Vitest with `vitest-environment-clarinet` for unit testing.

### Running Tests

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run all tests:
   ```bash
   npm test
   ```

3. Run specific test file:
   ```bash
   npm test tests/create-task.test.ts
   ```

### Test Coverage

- `create-task`: Verifies task creation logic, validation, and storage.
- `accept-task`: Verifies worker assignment and status updates.
- `submit-work`: Verifies work submission process.
- `approve-work`: Verifies payment release and task completion.

## Deployment

Refer to the root README for deployment instructions using Clarinet.
