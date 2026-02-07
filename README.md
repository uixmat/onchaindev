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

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Docker Desktop (running)
- Git
- Chrome or Firefox (for MetaMask test profile)

### Quick Start

#### 1. Clone and install dependencies

```bash
git clone <your-repo>
cd onchain
pnpm install
```

#### 2. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Generate a Better Auth secret:

```bash
openssl rand -base64 32
```

Fill in `.env.local`:

```env
# Database (pre-configured for local Docker)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres

# Better Auth
BETTER_AUTH_SECRET=<paste the generated secret>
BETTER_AUTH_URL=http://localhost:3000

# Discord OAuth (get from https://discord.com/developers/applications)
DISCORD_CLIENT_ID=
DISCORD_CLIENT_SECRET=

# WalletConnect (get from https://cloud.walletconnect.com)
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=
```

#### 3. Set up Discord OAuth

1. Go to https://discord.com/developers/applications
2. Click **"New Application"** and give it a name
3. Go to **OAuth2** tab in the left sidebar
4. Copy **Client ID** and **Client Secret**
5. Under **Redirects**, click "Add Redirect" and enter: `http://localhost:3000/api/auth/callback/discord`
6. Click **"Save Changes"**
7. Paste Client ID and Client Secret into `.env.local`

#### 4. Set up WalletConnect/Reown Project ID

1. Go to https://cloud.walletconnect.com/sign-in
2. Sign in with GitHub or email
3. Click **"Create"** to create a new project
4. Name it "onchain-dev"
5. Copy the **Project ID** from the dashboard
6. Paste into `.env.local` as `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`

#### 5. Install Foundry (one-time setup)

```bash
curl -L https://foundry.paradigm.xyz | bash
```

**Important:** Close and reopen your terminal, then run:

```bash
foundryup
```

This installs `anvil`, `forge`, `cast`, and `chisel` to `~/.foundry/bin`.

#### 6. Initialize the database

```bash
pnpm db:start    # Starts Postgres Docker container
pnpm db:push     # Creates database tables
```

Verify tables were created:

```bash
docker exec onchain-db psql -U postgres -c '\dt'
```

You should see: `user`, `session`, `account`, `verification`, `wallet`.

#### 7. Start the dev server

```bash
pnpm dev
```

This command automatically:
- ✓ Starts Postgres (port 5432)
- ✓ Starts Anvil blockchain (port 8545) - logs in `.anvil.log`
- ✓ Starts Next.js dev server (port 3000)

Open http://localhost:3000

---

## MetaMask Setup (First-Time Users)

### 1. Create a test browser profile

**Important:** Use a separate profile to isolate test wallets from any future real crypto.

**Chrome:**
1. Click your profile icon (top right)
2. Click **"Add"**
3. Create a new profile named "Dev Testing"
4. **Use this profile for all local crypto development**

**Firefox:**
1. Click the profile menu
2. **"Manage Profiles"** > **"Create"**
3. Name it "Dev Testing"

### 2. Install MetaMask extension

**In your test profile:**

1. Go to https://metamask.io/download/
2. Click **"Install MetaMask for Chrome"** (or Firefox)
3. Click **"Add to Chrome"** in the Chrome Web Store
4. **CRITICAL: Completely quit and restart your browser** (Cmd+Q on Mac, close all windows on Windows)
   - Don't just refresh - the extension needs a full browser restart to load properly
5. Reopen Chrome/Firefox and switch to your **test profile**
6. Click the **MetaMask fox icon** in the toolbar (should appear in top-right)

### 3. Import Anvil test wallet

Get the test seed phrase from Anvil logs:

```bash
tail -n 50 .anvil.log
```

Look for the **Mnemonic** line:

```
Mnemonic: test test test test test test test test test test test junk
```

**In MetaMask:**

1. Click **"I have an existing wallet"** (black button at bottom)
2. Paste the seed phrase: `test test test test test test test test test test test junk`
3. Click **"Continue"**
4. Create a password (e.g. `testpassword123`) - this just unlocks MetaMask on this browser
5. Enter password in both fields, check the checkbox, click **"Create password"**
6. Click through any completion prompts until you see the main wallet screen

### 4. Add Anvil Local network

**Important:** MetaMask starts on Ethereum Mainnet. You need to add Anvil.

1. Click the **network dropdown** at the top left (says "Ethereum Mainnet")
2. Click **"Add network"** at the bottom
3. Click **"Add a network manually"**
4. Fill in **exactly**:
   - **Network name:** `Anvil Local`
   - **Default RPC URL:** `http://127.0.0.1:8545`
   - **Chain ID:** `31337`
   - **Currency symbol:** `ETH`
   - **Block explorer URL:** (leave empty)
5. Ignore warnings about name/symbol mismatches (this is expected for local chains)
6. Click **"Save"**
7. Click **"Switch to Anvil Local"** when prompted

You should now see **10,000 ETH** in your balance (fake test ETH).

---

## Testing the Complete Flow

With `pnpm dev` running and MetaMask set up:

### 1. Sign in with Discord

1. Go to http://localhost:3000
2. Click **"Sign in"**
3. Click **"Sign in with Discord"**
4. Authorize the app
5. You'll land on `/dashboard`

### 2. Connect your wallet

1. On the dashboard, click **"Connect Wallet"**
2. RainbowKit modal appears with wallet options
3. Click **"MetaMask"**
4. The modal shows "Opening MetaMask..."
5. **A MetaMask approval popup should appear** (if not, click the MetaMask extension icon in your toolbar)
6. Make sure MetaMask is on **Anvil Local** network (top left in popup)
7. Click **"Next"** > **"Connect"**
8. Your wallet address now shows in the dashboard UI

The wallet address is **automatically saved** to your Postgres `wallet` table linked to your Discord user account.

### 3. Verify in database

```bash
docker exec onchain-db psql -U postgres -c 'SELECT * FROM wallet;'
```

You should see:
- Your wallet address (`0x70997...`)
- Your user ID
- `is_primary = t`
- Timestamp

---

## Common Issues

**MetaMask won't connect:**
- Make sure you're on **Anvil Local** network in MetaMask (not Ethereum Mainnet)
- Make sure MetaMask is **unlocked** (enter password if needed)
- Refresh the dashboard page and try again
- Check that Anvil is running: `lsof -i :8545`

**"Opening MetaMask..." hangs:**
- **Click the MetaMask extension icon** in your browser toolbar - the approval screen is usually there
- Make sure MetaMask is unlocked (not showing password screen)
- Check browser console (F12) for error messages

**"Cannot save network" in MetaMask:**
- Make sure RPC URL has `http://` prefix: `http://127.0.0.1:8545`
- If onboarding flow is stuck, close it and add network through Settings after completing setup
- Click "Open wallet" first, then add network via Settings > Networks > Add network

**Anvil not found:**
- Run `source ~/.zshenv` or restart your terminal
- Verify with: `which anvil` (should show `~/.foundry/bin/anvil`)

**Database connection error:**
- Make sure Docker is running
- Restart the container: `docker restart onchain-db`

**Wrong network in MetaMask:**
- Click the network dropdown (top left)
- Select **"Anvil Local"** from the list
- You should see 10,000 ETH when on the correct network

**Connected wallet shows wrong address:**
- MetaMask remembers which account was selected for each network
- Switch accounts in MetaMask if needed (click account dropdown at top)

---

## What Data Can You Display?

Now that you have both authentication and wallet connectivity, you can display:

### From Better Auth (Database)
- User profile (name, email, Discord avatar)
- Session information
- Linked wallet addresses

### From Connected Wallet (On-Chain via wagmi hooks)
- Wallet address (`useAccount()`)
- ETH balance (`useBalance({ address })`)
- Current chain ID and name (`useChainId()`)
- Transaction history (via indexers like Alchemy)
- ERC-20 token balances (`useReadContract()`)
- NFTs owned (via APIs like Reservoir or Alchemy)

### Combined (Database + Blockchain)
- User dashboard with both off-chain profile and on-chain wallet data
- Token holdings for authenticated users
- Transaction history tied to user accounts
- Multi-wallet support (users can link multiple addresses)

## Development

### Scripts

```bash
pnpm dev          # Start DB + Anvil + Next.js dev server
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run linter (biome via ultracite)
pnpm fix          # Auto-fix linting issues

# Database
pnpm db:start     # Start/create Postgres container
pnpm db:push      # Push schema changes to DB
pnpm db:generate  # Generate migration files
pnpm db:studio    # Open Drizzle Studio (DB GUI)

# Blockchain
pnpm anvil:start  # Start Anvil (auto-called by dev)
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

## Advanced Tips

### Viewing All Anvil Test Accounts

Anvil creates 10 pre-funded accounts. To see all private keys:

```bash
tail -n 100 .anvil.log
```

### Switching Between Test Accounts in MetaMask

To import additional Anvil accounts:

1. Click account icon (top right in MetaMask)
2. Click **"Add account or hardware wallet"** > **"Import account"**
3. Paste a different private key from `.anvil.log`
4. Each account has 10,000 ETH on Anvil Local

### Stopping Services

```bash
# Stop dev server (Ctrl+C in terminal)
# Or individually:
pkill -f anvil           # Stop Anvil
docker stop onchain-db   # Stop Postgres
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
