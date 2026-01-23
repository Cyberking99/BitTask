
# BitTask Frontend

A Next.js 16 application for interacting with the BitTask marketplace on the Stacks blockchain.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure

- `app/`: Next.js App Router pages and layouts.
- `components/`: React components.
  - `ui/`: Generic reusable UI components (Button, Card, Input, etc.).
  - `layout/`: Layout components (Header, Footer).
- `hooks/`: Custom React hooks (use-task, use-wallet).
- `lib/`: Utility functions and contract interactions.

## Key Components

- **Header**: Manages wallet connection state using `use-wallet`.
- **TaskList**: Displays a grid of tasks with loading and empty states.
- **TaskCard**: Individual task summary card.
- **TaskDetailsPage**: Detailed view of a task with interaction buttons.

## Environment Variables

Copy `.env.sample` to `.env.local` and configure:
- `NEXT_PUBLIC_STACKS_NETWORK`: 'testnet' or 'mainnet'

## Tech Stack

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS 4
- **Blockchain**: Stacks.js
- **Icons**: Lucide React
