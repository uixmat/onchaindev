# onchain

An NFT portfolio explorer powered by the [OpenSea API](https://docs.opensea.io/). Browse trending collections, search any wallet or ENS name, view NFT details with collection sales charts, and explore portfolios.

**Live:** [onchaindev.vercel.app](https://onchaindev.vercel.app)

## Features

- **Trending NFTs** -- real-time top collections by 7-day volume from OpenSea
- **Portfolio viewer** -- enter any wallet address or ENS name to see their NFTs
- **NFT detail page** -- traits, collection stats, sales chart, and related NFTs
- **Authentication** -- Discord OAuth via Better Auth
- **Wallet connection** -- RainbowKit + wagmi for viewing your own portfolio
- **Dark/light mode** -- system-aware theming

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19, Turbopack)
- **Data:** [OpenSea API v2](https://docs.opensea.io/) for NFT data, collections, and sales
- **Auth:** Better Auth with Discord OAuth
- **Database:** PostgreSQL (Supabase in production) with Drizzle ORM
- **Wallet:** RainbowKit + wagmi + viem
- **UI:** shadcn/ui, Tailwind CSS v4, Framer Motion
- **Charts:** visx-based composable chart components

## Quick Start

### Prerequisites

- Node.js 20+, pnpm 9+
- Docker (for local Postgres) or a Supabase account
- [OpenSea API key](https://opensea.io/settings/developer)

### Setup

```bash
git clone https://github.com/uixmat/onchaindev.git
cd onchaindev
pnpm install
cp .env.example .env.local
```

Fill in `.env.local`:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/postgres
BETTER_AUTH_SECRET=<openssl rand -base64 32>
BETTER_AUTH_URL=http://localhost:3000
DISCORD_CLIENT_ID=<from discord.com/developers>
DISCORD_CLIENT_SECRET=<from discord.com/developers>
OPENSEA_API_KEY=<from opensea.io/settings/developer>
NEXT_PUBLIC_DATA_SOURCE=api
```

### Run

```bash
pnpm dev
```

Open http://localhost:3000, search for `dfinzer.eth` or any Ethereum address.

### Mock mode

To run without an OpenSea API key, set `NEXT_PUBLIC_DATA_SOURCE=mock` in `.env.local`. This uses hardcoded NFT data for development.

## Project Structure

```
app/
├── page.tsx                          # Homepage with trending NFTs
├── (auth)/login/                     # Discord OAuth login
├── (dashboard)/dashboard/            # User dashboard with portfolio
├── portfolio/[address]/              # Wallet portfolio view
├── token/[contract]/[tokenId]/       # NFT detail page
└── api/
    ├── auth/[...all]/                # Better Auth handler
    ├── trending/                     # Trending NFTs endpoint
    ├── nfts/[address]/               # NFTs by wallet (with ENS resolution)
    ├── nft-detail/[contract]/[tokenId]/ # NFT detail + collection sales
    └── profile/[address]/            # OpenSea account profile

lib/
├── opensea.ts                        # OpenSea API v2 client
├── data-source.ts                    # Data layer (mock/API toggle)
├── auth.ts                           # Better Auth config
└── db/                               # Drizzle ORM schema + connection

components/
├── nft-media.tsx                     # Image/video handler for NFTs
├── price-history-chart.tsx           # Collection sales line chart
├── trending-grid.tsx                 # Homepage NFT grid
└── charts/                           # visx-based chart components
```

## OpenSea API Integration

The app uses the following OpenSea API v2 endpoints:

| Feature | Endpoint |
|---------|----------|
| Trending collections | `GET /api/v2/collections?order_by=seven_day_volume` |
| Wallet NFTs | `GET /api/v2/chain/{chain}/account/{address}/nfts` |
| NFT detail | `GET /api/v2/chain/{chain}/contract/{contract}/nfts/{token_id}` |
| Collection info | `GET /api/v2/collections/{slug}` |
| Collection stats | `GET /api/v2/collections/{slug}/stats` |
| Sale events | `GET /api/v2/events/collection/{slug}?event_type=sale` |
| Account profile | `GET /api/v2/accounts/{address}` |

## Scripts

```bash
pnpm dev          # Start dev server (+ Docker Postgres + Anvil)
pnpm build        # Production build
pnpm start        # Start production server
pnpm lint         # Run linter
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Drizzle Studio
```

## Deployment

Deployed on Vercel with Supabase PostgreSQL. Environment variables are set in the Vercel dashboard.

Required production env vars: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `DISCORD_CLIENT_ID`, `DISCORD_CLIENT_SECRET`, `OPENSEA_API_KEY`, `NEXT_PUBLIC_DATA_SOURCE=api`, `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

## License

MIT
