# Tap2 GamePay Architecture

## System Overview

Tap2 GamePay is a purpose-built payment platform for gaming, designed for ultra-low latency and gaming-specific fraud protection.

```
┌─────────────────────────────────────────────────────────────────┐
│                         Game Clients                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  Unity   │  │  Unreal  │  │   Web    │  │  Mobile  │       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘       │
└───────┼────────────┼─────────────┼─────────────┼──────────────┘
        │            │             │             │
        └────────────┴─────────────┴─────────────┘
                             │
                    ┌────────▼────────┐
                    │  Tap2 SDK API   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼────────┐
│  Payment API   │  │  Wallet Service │  │  Fraud Engine │
│ Cloudflare     │  │  Cloudflare D1  │  │  Workers AI   │
│ Workers        │  │  + KV           │  │  + ML Models  │
└────────┬───────┘  └────────┬────────┘  └───────┬───────┘
         │                   │                    │
         └───────────────────┴────────────────────┘
                             │
                    ┌────────▼────────┐
                    │ Payment Gateway │
                    │ (Stripe/...)    │
                    └─────────────────┘
```

---

## Technology Stack

### Core Platform

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Cloudflare Workers | Sub-millisecond cold starts, global edge deployment |
| Database | D1 (SQLite) | Relational data, edge-optimized |
| Cache | KV | Low-latency key-value lookups |
| ML/AI | Workers AI | Gaming-specific fraud detection at the edge |
| Objects | R2 | Receipt and audit log storage |

### SDKs

| Platform | Technology |
|----------|------------|
| Unity | C# SDK |
| Unreal | C++ SDK |
| Web | TypeScript/JavaScript SDK |
| Mobile | React Native (future) |

---

## API Design

### Core Endpoints

#### Payments

```typescript
// In-game purchase (async, sub-100ms)
POST /v1/game/purchase
{
  gameId: string,
  playerId: string,
  itemId: string,
  amount: number,
  currency: string
}
→ { purchaseId: string, status: "pending" }

// Confirm purchase (webhook/websocket)
GET /v1/game/purchase/{purchaseId}
→ { status: "confirmed", transactionId: string }
```

#### Wallet

```typescript
// Get wallet balance
GET /v1/game/wallet/balance?playerId={id}
→ { balances: { USD: 100.00, "GOLD": 5000 } }

// Top up wallet
POST /v1/game/wallet/topup
{
  playerId: string,
  amount: number,
  paymentMethod: string
}
→ { transactionId: string, status: "processing" }
```

#### Items

```typescript
// Grant virtual items (async)
POST /v1/game/items/grant
{
  playerId: string,
  items: Array<{ itemId: string, quantity: number }>
}
→ { grantId: string, status: "granted" }
```

---

## Data Model

### Tables

```sql
-- Players
CREATE TABLE players (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  metadata JSON
);

-- Wallets
CREATE TABLE wallets (
  player_id TEXT PRIMARY KEY,
  balances JSON NOT NULL,  -- { "USD": 100.00, "GOLD": 5000 }
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  player_id TEXT NOT NULL,
  type TEXT NOT NULL,  -- 'purchase', 'topup', 'grant'
  amount REAL,
  currency TEXT,
  status TEXT NOT NULL,  -- 'pending', 'confirmed', 'failed'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id)
);

-- Items
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  game_id TEXT NOT NULL,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  currency TEXT NOT NULL,
  metadata JSON
);

-- Inventory
CREATE TABLE inventory (
  player_id TEXT NOT NULL,
  item_id TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  obtained_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (player_id, item_id),
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (item_id) REFERENCES items(id)
);
```

---

## Fraud Detection

### Gaming-Specific Signals

| Signal Type | Examples | Weight |
|-------------|----------|--------|
| Velocity | Purchases/hour, sudden spikes | High |
| Geographic | Login/payment location mismatch | Medium |
| Behavioral | New account + large purchase | High |
| Device | Emulators, VMs, known fraud devices | Medium |
| Pattern | Serial refund requests | Critical |

### ML Model

- **Training Data**: Gaming-specific transaction history
- **Features**: 50+ risk signals
- **Output**: Risk score 0-100 with confidence interval
- **Action**: Auto-block for >80, manual review for 50-80

---

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| API Latency (p50) | <50ms | Workers analytics |
| API Latency (p99) | <100ms | Workers analytics |
| Cold Start | <5ms | Workers analytics |
| DB Query | <10ms | D1 metrics |
| Cache Hit Rate | >95% | KV metrics |

---

## Security

### Authentication

- **API Keys**: For game studios
- **JWT**: For player sessions
- **Webhook Signatures**: HMAC-SHA256 for callbacks

### Authorization

- **RBAC**: Studio, Admin, Player roles
- **Scopes**: `payments:write`, `wallet:read`, `items:grant`

### Compliance

- **PCI DSS**: SAQ A (redirect flow)
- **GDPR**: Data residency options
- **COPPA**: Parental controls for minors

---

## Deployment

### Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local testing | `localhost:8787` |
| Staging | Pre-production | `staging-api.tap2.gamepay.com` |
| Production | Live traffic | `api.tap2.gamepay.com` |

### CI/CD

```yaml
# GitHub Actions workflow
1. Run tests (Vitest)
2. Type check (tsc)
3. Lint (ESLint)
4. Build (Wrangler)
5. Deploy to staging
6. Run E2E tests
7. Deploy to production (manual approval)
```

---

## Monitoring

### Metrics

- Request rate, error rate, latency
- Fraud detection accuracy
- Payment success rate
- Wallet balance changes

### Alerts

- Error rate > 1%
- p99 latency > 100ms
- Fraud rate spike
- Payment gateway downtime

---

## Future Considerations

### SDK Architecture

- Unified API across all platforms
- Plugin system for game engines
- Offline mode with sync

### Multiplayer Support

- In-game trading between players
- Guild/clan wallets
- Tournament prize distribution

### Blockchain/Web3 (Optional)

- NFT item support
- Crypto wallet connections
- Smart contract settlements
