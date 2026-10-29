# IMPLEMENTATION_PLAN.md

# ChainTrace — Blockchain Transaction Integrity Simulator

**Project type:** College mini-project / educational web simulator  
**Subject:** FinTech Engineering & Digital Financial Systems — Digital Payments, Open Banking & Blockchain Basics  
**Core question:** How can blockchain detect unauthorized changes to financial transaction records?  
**Primary demonstration:** Change an old transaction, recompute hashes without updating stored values, identify the mismatched block, and show why the rest of the chain can no longer be trusted.

---

## 1. Purpose and expected outcome

Build a polished, interactive, single-page web application that demonstrates the tamper-evident property of a blockchain-style hash chain using fictional financial transactions.

A student should be able to open the application, inspect a valid ledger, change an existing transaction as if someone had modified a stored database record, and verify the chain. The application must use actual SHA-256 calculations. After the edit, it must identify:

1. **The altered block** — its recomputed hash does not match the hash stored when the block was originally created.
2. **The first broken downstream link** — the next block still refers to the parent's old hash, not the parent's newly recomputed hash.
3. **Later untrusted descendants** — blocks that may still match their own local content hashes but descend from the compromised history.

A reset must rebuild the exact original content and hashes, returning the chain to a valid state.

This is a local educational model. It does not process real payments or implement a full distributed blockchain.

## 2. Project boundaries

### 2.1 Must implement

- A responsive dashboard with a branded header and concise explanation.
- A real, seeded chain containing at least five blocks: one genesis block and four or more regular blocks.
- At least eight fictional financial transactions denominated in INR across the regular blocks.
- Actual Web Crypto API SHA-256 hashing.
- A deterministic canonical block-payload serialization.
- A connected block-chain view showing block index, timestamp, transaction count, previous hash, stored hash, and integrity status.
- Block selection and transaction inspection.
- An intentional transaction-edit flow for a non-genesis block.
- A deliberate-tamper action that preserves old stored hashes and previous-hash fields.
- A verifier that recomputes all hashes and checks parent links in sequence.
- Distinct `HASH_MISMATCH`, `BROKEN_LINK`, and `UNTRUSTED_DESCENDANT` statuses in addition to `VALID`.
- A clear result panel naming the altered block and showing stored versus recomputed hashes.
- A working reset action.
- Unit tests for seed generation, hashing, tampering, verification, and validation.
- A README explaining setup, use, logic, and limitations.

### 2.2 Must not implement

Do **not** add any of the following:

- Real banking, UPI, card, wallet, payment-gateway, or open-banking API integrations.
- A live public blockchain, smart contracts, wallet connect, real tokens, cryptocurrency trading, mining, consensus networking, or peer-to-peer communication.
- Authentication, authorization, a server, a database, or remote persistence.
- Actual customer or bank data.
- A production-grade digital-signature system.
- Unrelated dashboards, portfolio/account-management features, charts that do not help explain the hash chain, or broad finance features.

Keep the implementation focused on transaction modification and integrity verification.

## 3. Audience and design goals

The audience is a college student, faculty evaluator, and classmates viewing a live demonstration. The app should be understandable without requiring deep blockchain knowledge.

Design goals:

- **Immediate clarity:** It must be obvious which block changed and why.
- **Demonstrable:** The primary interaction must work reliably during a short presentation.
- **Technically honest:** All shown hashes come from real calculations; no hard-coded mismatch or fake verification result.
- **Educational:** Explain what happened in plain English next to the technical values.
- **Polished:** A restrained fintech dashboard, strong spacing and typography, clear hierarchy, responsive layout, visible focus styles, and deliberate empty/loading/error states.
- **Safe:** Use fictional example data and an explicit educational-sandbox notice.

Suggested visual language: deep navy/slate, white or near-white surfaces, teal/blue informational elements, amber warnings, and red integrity failures. Every status must also have text/iconography; color must not be the only cue.

---

## 4. Required technology and project setup

### 4.1 Stack

- **Frontend:** React
- **Language:** TypeScript with strict typing
- **Build tool/dev server:** Vite
- **Styling:** Tailwind CSS
- **Icons:** `lucide-react`
- **Hash implementation:** Browser Web Crypto API, `crypto.subtle.digest('SHA-256', ...)`
- **Testing:** Vitest; use a suitable DOM testing setup if component interaction tests are added
- **Package manager:** npm

If a compatible React + TypeScript project already exists, reuse its working configuration where sensible. Otherwise initialize a standard Vite React TypeScript application and configure Tailwind according to the installed Tailwind/Vite versions. Avoid blindly copying configuration from a different Tailwind major version.

### 4.2 Execution constraints

- The app runs locally in the browser.
- No backend or secrets are required.
- All chain state is kept in React/application memory.
- The app should use `crypto.subtle`; modern browsers support it on secure contexts such as `localhost`.
- Do not use a server-side hash library for browser functionality.
- Avoid local storage for the core demo. In-memory state makes reset behavior easy to reason about and ensures the app never persists a tampered chain accidentally.

### 4.3 Suggested npm scripts

Provide working scripts consistent with the selected tool setup, ideally:

- `npm run dev` — run the development server.
- `npm run build` — type-check as appropriate and create the production build.
- `npm run preview` — preview the production build.
- `npm run test` — run the test suite.
- `npm run test:watch` — optional test watch mode.

If the project uses a dedicated type-check script, document it in the README.

---

## 5. Functional specification

### 5.1 Initial application load

1. Build the original chain from fixed fictional seed data.
2. Compute each stored hash using SHA-256 and the canonical block payload.
3. Construct each block in order so its `previousHash` equals the prior block's stored hash at the moment of creation.
4. Run verification on the newly built chain.
5. The initial overall integrity state must be **VALID**; every block must receive the `VALID` status.
6. Select a sensible default block (for example, block index 2) so the ledger is ready to explore.
7. Show the educational-sandbox notice and a brief description of how a previous hash links blocks.

The seed data must be deterministic in content. Do not use random IDs, random transaction amounts, or current timestamps for the block/transaction contents. This ensures the same canonical data produces the same hashes when rebuilt in the same implementation.

### 5.2 Seeded chain

Create at least five blocks:

- Block `0`: genesis block; empty transaction array; previous hash equals the genesis sentinel.
- Blocks `1` through `4` (or more): regular blocks with fictional INR transactions.
- Total regular transactions: at least eight, with at least two per regular block recommended.

Each example transaction should look plausible in a fintech teaching demo but must be fictional. Suggested fields and sample names include a sender/recipient, a small or moderate INR amount, a short payment description, and a fictional reference such as `REF-DEMO-2001`. Do not suggest the records correspond to actual people or payments.

Use stable content for every seed. A date such as an ISO 8601 timestamp is appropriate. Dates are data for the sample scenario, not claims about real payments.

### 5.3 Ledger view

Display a chain view with a connected visual relationship between adjacent blocks. The layout may use a horizontal scrollable timeline on larger screens and a vertical connected list on narrow screens, or use a clean responsive grid if the predecessor/successor relationship remains unambiguous.

Each block card must show:

- `Block #<index>` and a clear genesis label where appropriate.
- Timestamp.
- Transaction count.
- Shortened stored hash.
- Shortened previous hash.
- Current integrity status.
- A clear selected state when clicked.

Hash shortening is only a display transformation; retain and use the full strings for comparisons. Provide access to the full value by copying it or revealing it in the details section. Ensure long hashes do not break the layout.

The initial valid chain should make the `previousHash` to parent-hash relationship visually understandable. After modification, use labels such as `HASH MISMATCH`, `BROKEN LINK`, and `UNTRUSTED DESCENDANT` rather than marking every affected block as if its transaction content had directly changed.

### 5.4 Block detail panel

When a block is selected, show:

- Index and timestamp.
- Full stored hash and full previous hash, with copy affordances if practical.
- Number of transactions.
- Transaction rows with transaction ID, timestamp, sender, recipient, amount, description/reference as space allows.
- The block's integrity status and a short human-readable explanation based on the current verification report.

On small screens, render the selected details below the chain view or in a readable full-width panel. Avoid requiring hover to reveal important information.

### 5.5 Modify a transaction (the tampering simulation)

The user must be able to select an existing transaction in a non-genesis block and modify at least its amount. A modal/dialog is recommended. Allow modifying `sender`, `recipient`, `amount`, and `description`; keep `id`, `timestamp`, `currency`, and `reference` read-only unless there is a clear reason to include them.

Before committing, display a warning such as:

> This simulates an unauthorized database edit. The transaction will change, but the original stored hashes and subsequent previous-hash references will not be recalculated.

Validation rules:

- Sender and recipient are required after trimming whitespace.
- Amount must parse as a finite number greater than zero.
- Description must not be empty after trimming.
- Display amount using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })` or an equivalent robust formatter.
- Do not mutate the original seed constants or shared nested objects in place. Use immutable state updates and clone nested arrays/objects.

On successful save:

1. Replace only the chosen transaction's editable values in the chosen block.
2. Preserve the block's original `hash` string.
3. Preserve every block's `previousHash` value.
4. Do not rebuild the chain and do not call a “mine” or “repair” function.
5. Run the verifier against the now-modified current chain.
6. Update all summary metrics, block statuses, result messages, and selected details from the current state.
7. Clearly identify the edited record and the altered block.

If the user cancels the editor, no chain data should change.

### 5.6 Verification interaction

A primary button, **Verify chain**, must calculate a fresh report from the current in-memory chain. It cannot fix, rewrite, mine, or replace any block. Repeated verification of an unchanged chain must return the same report content (except for the UI's optional “verified at” time).

The verifier must compare full hash strings. It must not rely on shortened display strings.

### 5.7 Reset interaction

**Reset demo** must rebuild the original seed chain from the immutable seed definitions:

- Restore every original transaction field.
- Recompute the correct hashes sequentially.
- Restore all valid parent links.
- Clear edited-transaction markers and old verification findings.
- Set overall status to `VALID` after running verification.
- Restore the default selection and initial metrics.

Do not reset by reverting only a status flag. The chain data and all stored hashes must truly return to their original state.

### 5.8 Teaching note

Include a short section titled **How tampering is detected** (or equivalent) explaining:

1. A block hash is calculated from block data and its previous-hash value.
2. A transaction edit changes the current block's canonical payload.
3. SHA-256 of the edited payload differs from the block's originally stored hash.
4. The next block still stores the original parent hash, so its link is now inconsistent with the parent's recomputed hash.
5. Descendant blocks may have internally matching content hashes, but their ancestry cannot be trusted once an earlier link is broken.

Include an important limitation statement: **This project demonstrates tamper evidence, not a full production blockchain.** A standalone local hash chain can be rewritten by an actor who can change every block and recalculate every hash. Real blockchain security also depends on the system's consensus and replication model, and may use digital signatures and other controls.

---

## 6. Data model and hashing rules

Keep these types explicit and shared between the blockchain logic and UI.

### 6.1 Transaction type

Use a model equivalent to:

```ts
export interface Transaction {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  amount: number;
  currency: "INR";
  description: string;
  reference: string;
}
```

The exact names may be adjusted if consistent throughout the app, but do not remove the required concepts. Amount must be a number in the hashed data, not a locale-formatted string.

### 6.2 Block type

Use a model equivalent to:

```ts
export interface Block {
  index: number;
  timestamp: string;
  transactions: Transaction[];
  previousHash: string;
  nonce: number;
  hash: string;
}
```

`hash` is the stored hash value and is excluded from the payload being hashed. `nonce` is fixed at `0`; the project does not need proof-of-work or mining.

### 6.3 Integrity statuses

Use a discriminated union or an equivalent type-safe representation for:

```ts
export type BlockIntegrityStatus =
  | "VALID"
  | "HASH_MISMATCH"
  | "BROKEN_LINK"
  | "UNTRUSTED_DESCENDANT";
```

The overall verification result should include at least:

- `isValid: boolean`.
- A per-block report in chain order.
- For each block: index, stored hash, recomputed hash, `hashMatches`, `parentLinkMatches`, `hasUntrustedAncestor`, `chainIsTrusted`, and status.
- Enough information for the UI to explain and label each affected block.

The report may also include a summary of altered block indices and broken-link indices. Derive summaries from the per-block report instead of maintaining a second conflicting source of truth.

### 6.4 Canonical payload serialization

Create a single pure function such as `serializeBlockPayload(block)` that explicitly creates a new object in a fixed field order:

```ts
{
  index: block.index,
  timestamp: block.timestamp,
  transactions: block.transactions.map((tx) => ({
    id: tx.id,
    timestamp: tx.timestamp,
    sender: tx.sender,
    recipient: tx.recipient,
    amount: tx.amount,
    currency: tx.currency,
    description: tx.description,
    reference: tx.reference,
  })),
  previousHash: block.previousHash,
  nonce: block.nonce,
}
```

Serialize that object using `JSON.stringify`. Do not include `block.hash` in this object. Never use a display string, rounded amount, shortened hash, locale-formatted date, or locale-formatted currency value in the payload.

The explicit construction of the payload ensures stable field order and prevents UI-only properties from accidentally entering the hash.

### 6.5 SHA-256 calculation

Implement an asynchronous helper:

1. Take the canonical serialized payload string.
2. Encode it with `TextEncoder`.
3. Calculate the digest using `crypto.subtle.digest("SHA-256", encodedBytes)`.
4. Convert each digest byte to a two-character lowercase hexadecimal pair.
5. Return the 64-character lowercase hexadecimal hash.

Do not fake the SHA-256 calculation. If crypto is unavailable in a non-browser test/runtime, configure the test environment correctly instead of silently returning a fake hash.

### 6.6 Building the chain

The chain builder must be asynchronous because `crypto.subtle.digest` is asynchronous.

Pseudo-process:

1. Copy the immutable seed transactions/definitions into new objects.
2. Start with `previousHash = GENESIS_PREVIOUS_HASH`.
3. For every block definition in order, create its payload with index, timestamp, transactions, `previousHash`, and nonce `0`.
4. Calculate its hash from the canonical payload.
5. Store that calculated value as the block's `hash`.
6. Push the completed block into the resulting chain.
7. Set the next `previousHash` to the just-created block's stored hash.
8. Return the complete chain.

Use a sentinel constant, for example:

```ts
export const GENESIS_PREVIOUS_HASH = "0";
```

Do not include the stored `hash` in its own hash input.

### 6.7 Exact verification algorithm

Verification is an async, read-only operation. It must not mutate the chain or repair any links.

For each block in ascending index order:

1. Calculate `computedHash` from its **current** canonical payload.
2. Compute `hashMatches = computedHash === block.hash`.
3. For index `0`, set `parentLinkMatches` according to whether `block.previousHash === GENESIS_PREVIOUS_HASH`.
4. For each other index, set `parentLinkMatches` according to whether `block.previousHash === previousReport.computedHash`. **Compare against the parent's recomputed hash, not only the parent's stored hash.**
5. Compute `hasUntrustedAncestor` from whether the previous report is already not chain-trusted. For the first block this is `false`.
6. Compute `chainIsTrusted = hashMatches && parentLinkMatches && !hasUntrustedAncestor`.
7. Classify status in this precedence order:
   - If `!hashMatches`, status is `HASH_MISMATCH`.
   - Else if `!parentLinkMatches`, status is `BROKEN_LINK`.
   - Else if `hasUntrustedAncestor`, status is `UNTRUSTED_DESCENDANT`.
   - Else status is `VALID`.
8. Store the complete per-block result for use by the next block.

The overall chain is valid only if `chainIsTrusted` is true for every block (equivalently, all statuses are `VALID`).

**Important example:** If block 2's transaction is changed but its stored hash is preserved:

- Block 2: `HASH_MISMATCH`.
- Block 3: expected to be `BROKEN_LINK`, because its `previousHash` still points to block 2's old hash rather than block 2's recomputed hash.
- Block 4 and later: expected to be `UNTRUSTED_DESCENDANT` if their own hashes and immediate links match but they inherit an untrusted ancestor.

If multiple transactions or blocks are edited, report each direct hash mismatch and classify other blocks based on actual computed values and ancestry. Do not hard-code the example statuses or indices.

---

## 7. State design and data flow

Use React state and a small hook or clearly separated app-level functions. No global state library is necessary.

Recommended state:

- `chain: Block[]` — the current chain including stored hashes. It is the source of truth for block content.
- `verificationReport: VerificationReport | null` — derived by running the verifier after load, tampering, reset, and manual verification.
- `selectedBlockIndex: number` — selected block.
- `selectedTransactionId: string | null` — optional, to mark the edited transaction.
- `isEditorOpen: boolean` and selected edit target/form draft state.
- `isInitializing: boolean` or equivalent for the initial asynchronous chain build.
- `lastVerifiedAt: Date | null` — UI metadata only; never include this value in hash payloads.
- `errorMessage: string | null` for recoverable initialization or hashing errors.

Keep seed definitions immutable and separate from live state. Reset must rebuild the chain from those definitions.

After loading:

1. Build the seed chain.
2. Store it in state.
3. Verify it.
4. Render valid statuses.

After a successful edit:

1. Create a new chain array.
2. Clone the modified block, its transactions array, and the changed transaction.
3. Preserve block hashes and every `previousHash` field.
4. Store the new current chain.
5. Verify that exact new chain.
6. Mark the changed transaction in the UI.

After manual verification:

1. Run the verifier on current `chain`.
2. Update report and verification time.
3. Do not update any block field.

After reset:

1. Build a new pristine chain from the seed definitions.
2. Verify it.
3. Clear selected edit markers and restore the default selected block.

Avoid race conditions from stale React state. Prefer explicit functions receiving a specific chain argument, and use functional state updates where appropriate. The hash/verify logic must remain outside the visual component tree.

---

## 8. Suggested repository structure

Adapt to the existing repository if needed, but preserve the separation of concerns.

```text
.
├── IMPLEMENTATION_PLAN.md
├── README.md
├── package.json
├── vite.config.ts
├── tsconfig.json
├── index.html
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── blockchain.ts
    ├── data/
    │   └── seedData.ts
    ├── lib/
    │   ├── formatters.ts
    │   └── blockchain/
    │       ├── serialize.ts
    │       ├── hash.ts
    │       ├── buildChain.ts
    │       ├── tamper.ts
    │       └── verifyChain.ts
    ├── components/
    │   ├── AppHeader.tsx
    │   ├── SummaryMetricCard.tsx
    │   ├── BlockchainView.tsx
    │   ├── BlockCard.tsx
    │   ├── BlockDetailsPanel.tsx
    │   ├── TransactionTable.tsx
    │   ├── TamperTransactionDialog.tsx
    │   ├── IntegritySummary.tsx
    │   ├── IntegrityBadge.tsx
    │   └── HowItWorks.tsx
    └── test/
        ├── blockchain.test.ts
        └── setup.ts (if a DOM test setup needs it)
```

Avoid creating many tiny files that contain only a line or two. The structure is a guide, not a reason to over-engineer.

### Responsibilities

- `types/blockchain.ts`: transaction, block, status, per-block report, overall report.
- `data/seedData.ts`: immutable, fictional, deterministic block/transaction definitions without prefilled hash values.
- `serialize.ts`: canonical payload object and serialization.
- `hash.ts`: SHA-256 helper and byte-to-hex conversion.
- `buildChain.ts`: sequential asynchronous genesis/chain construction.
- `tamper.ts`: immutable transaction edit helper that never updates hashes or previous links.
- `verifyChain.ts`: read-only sequential verification and integrity classification.
- `formatters.ts`: display-only INR, timestamp, and shortened hash helpers.
- UI components: render state and send user actions to app logic; do not duplicate cryptographic logic.
- `App.tsx`: coordinate initial build, selected block, editor actions, verification, reset, and errors.

---

## 9. UI specification in detail

### 9.1 Header / introduction

Include:

- `ChainTrace` title.
- `Blockchain Transaction Integrity Simulator` subtitle.
- `Educational Sandbox · Fictional Data` badge.
- One or two sentences describing the exercise.
- Buttons for `Verify chain` and `Reset demo` in a sensible location.

Use a clear title hierarchy. Avoid walls of text.

### 9.2 Summary cards

Minimum cards:

1. **Blocks** — current `chain.length`.
2. **Transactions** — sum of `block.transactions.length` across the current chain.
3. **Chain integrity** — derived from `verificationReport.isValid`.
4. **Last verified** — format the last verification timestamp or show a clear initializing label.

When the chain becomes invalid, the integrity metric and the results panel must update together.

### 9.3 Chain view and statuses

The chain view should communicate that block order matters. Include a visible line/connector or other obvious predecessor-to-successor grouping.

Status display:

| Status | Meaning shown to user |
|---|---|
| `VALID` | This block's contents match its stored hash, its parent link matches, and its ancestors are trusted. |
| `HASH MISMATCH` | The data currently stored in this block produces a different hash from its stored hash. This is the direct tamper indicator. |
| `BROKEN LINK` | This block points to a hash that does not match its parent's recomputed current hash. |
| `UNTRUSTED DESCENDANT` | This block may be locally consistent, but at least one earlier block/link in its ancestry is invalid. |

The selected block needs a visible outline/background/indicator distinct from integrity status. Do not make selection and failure status look identical.

### 9.4 Transaction table/editor

Show transaction details in a readable table on desktop and an accessible stacked/card layout on mobile as necessary. Do not require horizontal scrolling on a phone for every field.

The edit dialog must:

- Have a descriptive title and explain the simulation.
- Identify the selected block and transaction.
- Have associated labels for form fields.
- Restrict numeric input to a positive amount and validate again in code (HTML `min` alone is insufficient).
- Display inline validation feedback.
- Provide clear `Apply simulated edit` and `Cancel` actions.
- Close on successful save and avoid changing anything on cancellation.
- Remain usable with keyboard-only navigation.

When the altered transaction is shown afterward, provide an explicit `Modified for demonstration` label or equivalent. Do not falsely imply the payment itself was processed.

### 9.5 Result panel

Before tampering, display a clear green/neutral success state such as:

> Chain integrity verified. All blocks match their stored hashes and previous-hash links.

After tampering, display a clear error state with the overall conclusion and a list of block findings. For a direct hash mismatch, show:

- Block index.
- Stored hash.
- Recomputed hash.
- A concise statement that the values differ.

For the first broken link, show the expected parent hash (the parent's recomputed hash) versus the actual `previousHash` saved in the child block. For later descendants, explain that a prior ancestor has failed verification. Make long values wrap or be expandable/copyable.

The result panel should be driven by `verificationReport`, not UI flags alone.

### 9.6 Loading and errors

Because Web Crypto hashing and chain building are asynchronous:

- Show a deliberate initial loading state while the seeded chain is being computed.
- Disable actions that require the chain until initialization completes.
- Catch errors from `crypto.subtle` and surface a readable error message.
- Never quietly substitute a fake hash if cryptography fails.
- Avoid an indefinite spinner if initialization rejects.

---

## 10. Testing plan

Prefer pure unit tests for the cryptographic core, then add a small number of UI tests for the high-risk interaction.

### 10.1 Hashing and serialization tests

- The canonical payload excludes the stored `hash` value.
- Canonical field order is consistent.
- Identical block payloads return identical hashes.
- A changed transaction amount changes the computed hash.
- The output hash is 64 lowercase hexadecimal characters.

### 10.2 Chain builder tests

- The seed creates at least five blocks total.
- Genesis has the sentinel previous hash and no regular payment transactions.
- Each non-genesis block's `previousHash` equals the previous block's stored `hash` at build time.
- A pristine newly built chain verifies as valid.
- The chain contains at least eight transactions in total.
- Seed definitions are not mutated by chain building.

### 10.3 Tamper helper tests

- Editing a chosen transaction changes only that transaction's editable data in the returned chain.
- The changed block retains its old stored hash.
- Every `previousHash` in the chain remains unchanged.
- The input chain is not mutated in place.
- Invalid input is rejected by validation before the helper is called, or by a clear validation function.

### 10.4 Verification tests

- A pristine chain reports every block as `VALID` and the overall chain valid.
- Editing a transaction in block 2 reports block 2 as `HASH_MISMATCH`.
- The immediate child reports `BROKEN_LINK` because it still points to the original stored hash of block 2 rather than block 2's recomputed hash.
- A later descendant with a locally matching hash/link reports `UNTRUSTED_DESCENDANT` if an ancestor failed.
- Overall verification fails for any non-valid block.
- Multiple edits are detected without assuming one fixed index.
- Verification never mutates the supplied chain.
- Repeated verification on unchanged content returns the same status and hash values.

### 10.5 UI interaction tests

At least test the high-risk user flow if component testing is practical:

1. Initial page reports a valid chain.
2. User opens the modify transaction editor and changes the amount to a valid number.
3. After applying, the UI reports a hash mismatch and names the edited block.
4. Reset restores the valid state.
5. Invalid amount/name input does not modify the chain.

### 10.6 Completion checks

Run the test suite, TypeScript validation, and production build. Resolve failures instead of leaving them for the user. The final report must distinguish passed checks from checks that could not run.

---

## 11. README requirements

`README.md` must be written for someone who has just cloned/downloaded the project. Include:

1. Project title and short overview.
2. Why hashes and previous-hash links can help detect unauthorized edits.
3. Feature list.
4. Tech stack.
5. Prerequisites.
6. Installation and run commands that match the actual package scripts.
7. How to perform the demo in a short presentation:
   - Run the app and observe the valid chain.
   - Select a non-genesis block.
   - Modify an old transaction amount.
   - Click/apply the simulated edit.
   - Observe the stored/recomputed hash mismatch.
   - Inspect the broken link and untrusted descendants.
   - Reset and observe the valid chain again.
8. How the verification algorithm distinguishes direct content tampering, the first broken link, and later untrusted descendants.
9. Testing command.
10. Limitations: educational local simulation, no real payments/network, and not a complete proof of production-blockchain security.

Do not claim production-grade security, a live blockchain, or real payment integration.

---

## 12. Build sequence and implementation milestones

Implement in this order so the UI cannot mask an incorrect integrity algorithm.

### Milestone 1 — inspect and bootstrap

- Inspect existing files and scripts.
- Read this plan and the Antigravity task prompt.
- Reuse a compatible React/TypeScript Vite project or scaffold one.
- Install only necessary dependencies.
- Ensure the project starts before adding features.

**Exit criteria:** development server runs and the project structure is understood.

### Milestone 2 — types and deterministic seed data

- Define shared transaction, block, status, and report types.
- Add immutable fictional seed definitions for genesis plus at least four payment blocks.
- Ensure there are at least eight transactions.
- Keep stored hashes out of seed definitions.

**Exit criteria:** type definitions and deterministic seed data exist with no cryptographic work yet.

### Milestone 3 — canonical serialization and SHA-256

- Implement one canonical serializer using fixed field order.
- Implement Web Crypto SHA-256 and hexadecimal encoding.
- Add tests for determinism, output format, and payload sensitivity.

**Exit criteria:** same payload yields same 64-character digest; changing hashed data changes the digest.

### Milestone 4 — build and verify the chain

- Build blocks sequentially with genesis sentinel and parent stored hashes.
- Implement the read-only verifier and status precedence.
- Test a valid chain and a manually constructed altered-chain fixture.

**Exit criteria:** clean chain passes; altered block gets `HASH_MISMATCH`; immediate child gets `BROKEN_LINK`; later descendants are classified accurately.

### Milestone 5 — intentional tamper helper

- Implement immutable transaction edit that does not update stored hashes or previous links.
- Add validation helper for editable fields.
- Test preservation of stored hashes and immutability.

**Exit criteria:** a real edit causes computed/stored mismatch, and no hash is silently repaired.

### Milestone 6 — dashboard and chain view

- Build the header, educational notice, summary metrics, connected block cards, status badges, and selected-block state.
- Bind UI values to real state and verification reports.
- Add loading and recoverable error states.

**Exit criteria:** app loads a verified chain and all displayed metrics derive from data.

### Milestone 7 — detail panel, editor, report, reset

- Display block and transaction details.
- Build accessible transaction editor with validation and explanatory warning.
- Apply edit, immediately verify, show hash comparison and downstream impact.
- Wire manual verification and reset.

**Exit criteria:** the complete demo flow works end to end and can be repeated after reset.

### Milestone 8 — responsive polish and teaching note

- Polish desktop layout and small-screen behavior.
- Add full-hash reveal/copy behavior where practical.
- Add “How tampering is detected” and limitations.
- Check keyboard flow, labels, focus states, and long hash wrapping.

**Exit criteria:** the UI is demo-ready and accessible enough for normal keyboard and mobile use.

### Milestone 9 — automated tests and final audit

- Run all unit and UI tests.
- Run TypeScript checking and production build.
- Fix warnings/errors that affect correctness or usability.
- Compare implementation against the acceptance checklist below.
- Write or update README commands and demo steps.

**Exit criteria:** all checks that can run in the environment have passed and any limitation is documented honestly.

---

## 13. Acceptance checklist — do not mark complete until verified

### Core behavior

- [x] The application builds and launches locally.
- [x] Initial chain has at least five blocks and at least eight transactions.
- [x] Initial verification succeeds; all blocks start `VALID`.
- [x] Hashes are actual SHA-256 digests over the defined canonical payload.
- [x] Each block includes the previous block's stored hash, except genesis which uses the sentinel.
- [x] The user can edit a transaction in a non-genesis block.
- [x] An intentional edit changes transaction data but preserves that block's stored hash.
- [x] All subsequent `previousHash` fields remain unchanged during tampering.
- [x] Verification detects the exact altered block.
- [x] The first child link is marked broken when appropriate.
- [x] Later descendants are marked untrusted if an ancestor failed.
- [x] Full stored and recomputed hashes are inspectable in the result panel.
- [x] Manual re-verification does not repair the chain.
- [x] Reset rebuilds the exact pristine chain and verifies successfully.

### UX and educational value

- [x] The app states that data is fictional and the app is educational.
- [x] Amounts display using INR conventions.
- [x] Overall integrity is visible without scrolling through every block.
- [x] Statuses use text in addition to color.
- [x] The altered block and the broken downstream link are visually distinguishable.
- [x] The “How tampering is detected” note explains the key steps.
- [x] A limitation note distinguishes this from a real distributed blockchain.
- [x] Layout behaves on desktop and small screens.
- [x] Inputs have labels and helpful validation messages.
- [x] Buttons do what their labels promise; no placeholder actions remain.

### Engineering quality

- [x] Seed definitions are immutable and deterministic.
- [x] Chain building, hashing, tampering, and verification are separated from UI components.
- [x] Verification is read-only and has automated tests.
- [x] Tests cover clean chain, tampered chain, broken link, descendant trust, reset, and input validation.
- [x] TypeScript checks pass.
- [x] Production build passes.
- [x] README setup and demo instructions match the application.
- [x] No network, backend, real payment integration, wallet, or unrelated features were added.
- [x] Final handoff reports actual checks and any remaining limitation honestly.

---

## 14. Demo script for the college presentation

Target duration: approximately 2–3 minutes.

1. Open ChainTrace and point out that the chain begins in a valid state.
2. Explain that every block has transaction data, a stored hash, and a previous hash pointing to the preceding block.
3. Select block 2 (or another non-genesis block) and choose a transaction.
4. Change its amount to a visibly different amount, for example from ₹2,500 to ₹9,250, and apply the simulated unauthorized edit.
5. Point to the `HASH MISMATCH` marker and compare the stored hash with the recomputed hash.
6. Point to the next block's `BROKEN LINK` status: its saved previous hash still points to the original parent hash.
7. Point out later `UNTRUSTED DESCENDANT` blocks: they may have matching local values but no longer have a trustworthy chain of history.
8. Explain that the app did not repair anything automatically; it only detected the inconsistency.
9. Press `Reset demo` and show that the original valid chain returns.
10. Close with the limitation: this illustrates tamper evidence, while a real blockchain also depends on distributed agreement and additional security mechanisms.

---

## 15. Final implementation instruction

Implement the complete project described in this file. Prioritize algorithmic correctness, actual SHA-256 hashing, clear detection results, reset reliability, and a polished responsive interface. Do not ask for clarification on details that are explicitly specified here. If a minor detail remains unspecified, choose the simplest reasonable option, keep it consistent, and document it. Finish by running available checks and summarizing the actual results.
