# Tap2 GamePay - Sprint Plans

## Sprint Overview

This document outlines the planned sprints for Tap2 GamePay development. Each sprint is 2 weeks long.

---

## Sprint 0: Foundation Setup

**Dates**: Feb 3 - Feb 16, 2026
**Goal**: Set up project infrastructure and development environment

### Scope

**In Scope:**
- Repository structure and tooling
- Cloudflare Workers configuration
- Marketing website
- GitHub Issues tracking
- CI/CD pipeline foundation

**Out of Scope:**
- Payment processing implementation
- Wallet service implementation
- Fraud detection models

### Stories

| Story | Points | Status |
|-------|--------|--------|
| US-1.1: Repository Structure | 3 | ✅ Complete |
| US-1.2: Cloudflare Workers Setup | 5 | 🔄 In Progress |
| US-1.3: CI/CD Pipeline | 5 | Pending |
| Marketing Website | 3 | In Progress |

### Definition of Success

- [x] All GitHub Issues created from EPICS.md
- [x] Marketing site deployed
- [ ] Wrangler.toml configured
- [ ] D1 database provisioned
- [ ] KV namespace created
- [ ] GitHub Actions workflow runs successfully

### Risks & Dependencies

- **Risk**: Cloudflare account setup may take longer than expected
- **Dependency**: None - this is the foundation sprint

---

## Sprint 1: Core Payment API

**Dates**: Feb 17 - Mar 2, 2026
**Goal**: Implement basic payment processing

### Scope

**In Scope:**
- Purchase initiation API
- Payment confirmation (polling + webhooks)
- Stripe integration
- Item granting API

**Out of Scope:**
- Virtual wallets
- Fraud detection
- Async confirmation optimization

### Stories

| Story | Points | Priority |
|-------|--------|----------|
| US-2.1: Purchase Initiation | 8 | P0 |
| US-2.2: Payment Confirmation | 8 | P0 |
| US-2.3: Stripe Integration | 5 | P0 |
| US-2.4: Item Granting | 5 | P0 |

**Total Points**: 26

### Definition of Success

- [ ] `POST /v1/game/purchase` works end-to-end
- [ ] p99 latency < 100ms
- [ ] Webhooks deliver confirmations
- [ ] Test charge via Stripe succeeds
- [ ] Items granted to test accounts

### Technical Focus

- Edge function optimization for latency
- Idempotency key handling
- Webhook signature verification
- Error handling for declined payments

---

## Sprint 2: Virtual Wallet Service

**Dates**: Mar 3 - Mar 16, 2026
**Goal**: Implement virtual currency management

### Scope

**In Scope:**
- Wallet creation and management
- Balance checking
- Wallet top-up flows
- Basic spending analytics

**Out of Scope:**
- Multi-currency support (v2)
- Advanced analytics
- Parental controls

### Stories

| Story | Points | Priority |
|-------|--------|----------|
| US-3.1: Wallet Creation | 5 | P0 |
| US-3.2: Balance Checking | 3 | P0 |
| US-3.3: Wallet Top-Up | 5 | P0 |
| US-3.4: Spending Analytics | 8 | P1 |

**Total Points**: 21

### Definition of Success

- [ ] Wallets auto-create on first purchase
- [ ] Balance API returns in <10ms
- [ ] KV caching implemented
- [ ] Top-up processes payments
- [ ] Dashboard shows basic metrics

### Technical Focus

- D1 database schema for wallets
- KV caching strategy
- Balance transaction isolation
- Analytics aggregation queries

---

## Sprint 3: Fraud Detection Foundation

**Dates**: Mar 17 - Mar 30, 2026
**Goal**: Implement basic fraud prevention

### Scope

**In Scope:**
- Velocity checks
- Basic risk scoring
- Account takeover detection

**Out of Scope:**
- ML model training
- Advanced fraud patterns
- Refund abuse detection

### Stories

| Story | Points | Priority |
|-------|--------|----------|
| US-4.1: Risk Scoring | 13 | P1 |
| US-4.2: Velocity Checks | 5 | P1 |
| US-4.3: ATO Prevention | 8 | P1 |

**Total Points**: 26

### Definition of Success

- [ ] Risk score 0-100 returned on each transaction
- [ ] Scoring <50ms
- [ ] Velocity limits enforced
- [ ] Device fingerprinting captures basic signals
- [ ] Location anomalies flagged

### Technical Focus

- Feature extraction pipeline
- Workers AI integration for ML
- KV storage for velocity counters
- Device fingerprint library

---

## Sprint 4: Web SDK

**Dates**: Mar 31 - Apr 13, 2026
**Goal**: Build and publish web SDK

### Scope

**In Scope:**
- npm package
- TypeScript SDK
- React hook (optional)
- Codepen examples

**Out of Scope:**
- Unity SDK
- Unreal SDK
- Native mobile SDKs

### Stories

| Story | Points | Priority |
|-------|--------|----------|
| US-5.3: Web SDK | 13 | P1 |

**Total Points**: 13

### Definition of Success

- [ ] @tap2/gamepay published to npm
- [ ] Full TypeScript definitions
- [ ] Promise-based API
- [ ] Sample app with purchases
- [ ] Codepen demo works

### Technical Focus

- SDK architecture and API design
- Error handling patterns
- Retry logic
- TypeScript strict mode
- Documentation generation

---

## Sprint 5: MVP Polish & Launch

**Dates**: Apr 14 - Apr 27, 2026
**Goal**: Complete MVP and prepare for launch

### Scope

**In Scope:**
- Documentation
- Integration guides
- Performance testing
- Security audit
- Alpha onboarding

**Out of Scope:**
- Production scaling
- Advanced features

### Stories

| Story | Points | Priority |
|-------|--------|----------|
| API Documentation | 5 | P0 |
| Integration Guides | 5 | P0 |
| Performance Testing | 8 | P0 |
| Security Review | 5 | P0 |
| Alpha Partner Onboarding | 8 | P0 |

**Total Points**: 31

### Definition of Success

- [ ] API docs deployed (Redoc/Stoplight)
- [ ] Quick start guide <5 min
- [ ] Load test: 1000 req/s sustained
- [ ] Security audit passed
- [ ] 3 alpha studios integrated
- [ ] Marketing site live with waitlist

### Technical Focus

- Documentation as Code
- Load testing with k6
- Security headers and CORS
- Monitoring and alerting
- Onboarding flow automation

---

## Sprint Planning Notes

### Velocity Estimation

Based on team size (1-2 engineers), estimated velocity per sprint:
- **Conservative**: 15-20 points
- **Expected**: 20-25 points
- **Optimistic**: 25-30 points

### Critical Path

1. Sprint 0 (Foundation) - **BLOCKS ALL**
2. Sprint 1 (Core API) - **BLOCKS Sprints 2, 3, 4**
3. Sprint 2 (Wallets) - Can run parallel to Sprint 3 after Sprint 1
4. Sprint 3 (Fraud) - Can run parallel to Sprint 4 after Sprint 1
5. Sprint 4 (SDK) - Can run parallel after Sprint 1
6. Sprint 5 (MVP) - **BLOCKS LAUNCH**

### Parallel Work Opportunities

After Sprint 1, Wallets, Fraud, and SDK can be developed in parallel by different engineers.

---

*Last Updated: February 3, 2026*
