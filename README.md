# onchain

An on-chain dashboard for managing user accounts, wallet connections, and blockchain interactions.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Authentication:** Better Auth with Discord OAuth
- **Database:** PostgreSQL 17 (Docker) with Drizzle ORM
- **Wallet:** RainbowKit + wagmi + viem
- **UI:** shadcn/ui (Radix UI primitives, Tailwind CSS v4)
- **Local Blockchain:** Anvil (Foundry)

## Project Structure

```
onchain/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx              # Discord login page
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── page.tsx              # Server component with auth check
│   │       └── dashboard-client.tsx  # Client dashboard UI
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...all]/
│   │   │       └── route.ts          # Better Auth handler
│   │   └── wallet/
│   │       └── link/
│   │           └── route.ts          # Link wallet to user account
│   ├── globals.css
│   ├── layout.tsx                    # Root layout with providers
│   └── page.tsx                      # Landing page
├── components/
│   ├── ui/                           # shadcn components
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── web3-provider.tsx             # RainbowKit + wagmi providers
├── hooks/
│   ├── use-link-wallet.ts            # Auto-link wallet to user
│   └── use-mobile.ts
├── lib/
│   ├── db/
│   │   ├── index.ts                  # Drizzle instance
│   │   ├── schema.ts                 # Database schema (auth + wallet)
│   │   └── migrations/               # Generated migrations
│   ├── auth.ts                       # Better Auth server config
│   ├── auth-client.ts                # Better Auth React client
│   ├── utils.ts
│   └── wagmi.ts                      # wagmi/RainbowKit config
├── proxy.ts                          # Next.js 16 route protection
├── drizzle.config.ts
└── .env.local                        # Environment variables (gitignored)
```

## Dependencies

### Core
- `next` 16.1.6 - React framework with App Router
- `react` 19.2.3 - UI library
- `typescript` 5.x - Type safety

### Authentication & Database
- `better-auth` 1.4.18 - Authentication framework
- `drizzle-orm` 0.45.1 - TypeScript ORM
- `drizzle-kit` 0.31.8 - Migration tooling
- `pg` 8.18.0 - PostgreSQL client

### Wallet & Web3
- `@rainbow-me/rainbowkit` 2.2.10 - Wallet connection UI
- `wagmi` 2.x - React hooks for Ethereum
- `viem` 2.x - TypeScript interface for Ethereum
- `@tanstack/react-query` 5.90.20 - Async state management

### UI
- `shadcn` 3.8.4 - Component CLI
- `tailwindcss` 4.x - CSS framework
- `radix-ui` 1.4.3 - Headless UI primitives
- `lucide-react` 0.563.0 - Icons
- `next-themes` 0.4.6 - Dark mode

### Dev Tools
- `@biomejs/biome` 2.3.13 - Linter/formatter
- `ultracite` 7.1.4 - Linting orchestrator
- `husky` 9.1.7 - Git hooks

## Installation

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop
- Git

### 1. Clone and install

```bash
git clone <your-repo>
cd onchain
pnpm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
# Database (pre-filled for local Docker Postgres)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=<run: openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000

# Discord OAuth (get from https://discord.com/developers/applications)
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# WalletConnect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

### 3. Set up Discord OAuth

1. Go to https://discord.com/developers/applications
2. Click "New Application"
3. Go to **OAuth2** tab
4. Copy **Client ID** and **Client Secret**
5. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
6. Paste credentials into `.env.local`

### 4. Set up WalletConnect/Reown

1. Go to https://cloud.walletconnect.com/sign-in
2. Sign in and create a new project
3. Copy the **Project ID**
4. Paste into `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

### 5. Start the database and push schema

```bash
pnpm db:start    # Starts Postgres Docker container
pnpm db:push     # Pushes Drizzle schema to DB
```

This creates 5 tables: `user`, `session`, `account`, `verification`, `wallet`.

### 6. Run the dev server

```bash
pnpm dev
```

The dev server automatically starts the Postgres container before Next.js.

Open http://localhost:3000

## Development

### Scripts

```bash
pnpm dev          # Start DB + Next.js dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm check        # Run linter (same as lint)
pnpm fix          # Auto-fix linting issues

# Database
pnpm db:start     # Start/create Postgres container
pnpm db:push      # Push schema changes to DB
pnpm db:generate  # Generate migration files
pnpm db:studio    # Open Drizzle Studio (DB GUI)
```

### Database Management

View tables:
```bash
docker exec onchain-db psql -U postgres -c '\dt'
```

Query data:
```bash
docker exec onchain-db psql -U postgres -c 'SELECT * FROM "user";'
docker exec onchain-db psql -U postgres -c 'SELECT * FROM wallet;'
```

Stop/remove container:
```bash
docker stop onchain-db
docker rm onchain-db
```

## Local Wallet Testing

Since this app requires wallet connectivity, you'll need to set up a local blockchain and test wallet.

### 1. Install Foundry

```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Start Anvil (local blockchain)

In a **separate terminal**:

```bash
anvil
```

This starts a local Ethereum node at `http://127.0.0.1:8545` (Chain ID: 31337) with 10 pre-funded accounts, each having 10,000 ETH.

Copy the **first private key** from the output:

```
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

### 3. Set up MetaMask (test profile)

**Important: Use a separate browser profile for development to keep test keys isolated.**

**Chrome:**
1. Profile icon (top right) > Add > Create "Dev Testing" profile
2. In that profile, install MetaMask: https://metamask.io/download/

**Import Anvil wallet:**
1. Open MetaMask
2. Account icon > **Import Account**
3. Select **Private Key**
4. Paste: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
5. Click **Import**

**Add Anvil network:**
1. Network dropdown (top left) > **Add Network** > **Add manually**
2. Fill in:
   - Network Name: `Anvil Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `31337`
   - Currency Symbol: `ETH`
3. Click **Save**

### 4. Test the complete flow

With both Anvil and the dev server running:

1. Go to http://localhost:3000
2. Click **"Sign in"** > Authenticate with Discord
3. You'll land on `/dashboard`
4. Click **"Connect Wallet"**
5. RainbowKit modal appears
6. Select **MetaMask**
7. Ensure MetaMask is on **Anvil Local** network
8. Click **Connect**
9. Your wallet address appears in the UI
10. The wallet is automatically linked to your user account in Postgres

Verify:
```bash
docker exec onchain-db psql -U postgres -c 'SELECT * FROM wallet;'
```

## Architecture

### Authentication Flow

```
Discord OAuth → Better Auth → Session Cookie → Protected Routes (proxy.ts)
```

### Wallet Linking Flow

```
ConnectButton → wagmi useAccount → useLinkWallet hook → /api/wallet/link → Postgres
```

### Database Schema

**Core Auth Tables** (Better Auth):
- `user` - User profiles
- `session` - Active sessions
- `account` - OAuth provider accounts
- `verification` - Email verification tokens

**Custom Tables**:
- `wallet` - Linked wallet addresses (many-to-one with user)

## License

MIT
