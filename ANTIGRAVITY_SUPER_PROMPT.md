# Antigravity Super Prompt — Blockchain Transaction Integrity Simulator

You are a senior full-stack engineer, product designer, and careful technical educator. Build a complete, polished, working college project that demonstrates how a blockchain-style hash chain can reveal unauthorized changes to financial transaction records.

## 1. Read this first — source of truth

Before writing code, read the repository's `IMPLEMENTATION_PLAN.md` from top to bottom. Treat it as the single source of truth for scope, data structures, hashing rules, verification behavior, UX, tests, and acceptance criteria. Follow it closely. Do not silently change the core algorithm or add unrelated features.

If `IMPLEMENTATION_PLAN.md` is missing, create it from the plan supplied by the user before implementing the app. Inspect the existing repository first. If it is empty, initialize the stack specified in the plan. If it already contains a compatible React + TypeScript app, reuse it and avoid needless rewrites. If something in the existing repository conflicts with a mandatory plan requirement, make the smallest sensible correction and explain it in your final summary. Do not ask the user questions; make reasonable, documented decisions and keep building.

## 2. Project objective

Build a browser-based educational application named **ChainTrace — Blockchain Transaction Integrity Simulator**. It must let a student:

1. Inspect a pre-populated, sequential chain of fictional financial transaction records.
2. See how every block stores its own SHA-256 hash and the previous block's hash.
3. Deliberately modify an old transaction without updating its original stored block hash or later blocks' previous-hash references.
4. Run or view chain verification and see the computed hash differ from the stored hash for the altered block.
5. Clearly identify the altered block, the first downstream broken link, and later blocks whose chain history can no longer be trusted.
6. Reset to the original valid chain and repeat the demonstration.

This is an educational simulation only. It must not connect to a bank, payment provider, wallet, blockchain network, or real financial account. Use fictional names and sample INR amounts only.

## 3. Mandatory implementation rules

- Build an actual working application, not just a mockup, static prototype, slide deck, or written explanation.
- Use **React + TypeScript + Vite**. Use **Tailwind CSS** for styling and **lucide-react** for icons, unless a compatible existing project already has a working equivalent.
- Use the browser **Web Crypto API** (`crypto.subtle.digest('SHA-256', ...)`) for real hashing. Do not hard-code fake hashes, use a random string as a hash, or simulate mismatch with a boolean alone.
- Keep everything client-side and in memory. No backend, database, external APIs, real blockchain, wallet, authentication, payment processing, or environment secrets.
- Follow the `IMPLEMENTATION_PLAN.md` data model and verification algorithm exactly. In particular, an intentional edit must **not** recalculate the altered block's stored hash or any later `previousHash` field.
- Keep all source code typed, modular, readable, and reasonably small. Do not put the whole app in one giant component.
- Complete the core behavior before adding visual polish. Do not add unrelated features that compete with the central demonstration.
- Do not leave TODOs, placeholder handlers, buttons that do nothing, fake progress, hard-coded verification outcomes, or broken imports.
- Use accessible labels, semantic HTML, keyboard-accessible controls, visible focus states, and responsive layouts.
- Do not claim that a simple hash chain is impossible to alter. Explain in the UI and README that it is tamper-evident, while a production blockchain relies on additional mechanisms such as consensus, distributed copies, and often digital signatures.

## 4. Required experience and visual direction

Create a clean, premium fintech-style dashboard suitable for a college demo and a short live presentation. Make the integrity story immediately understandable. Use a restrained palette: deep navy/slate for the main frame, clean neutral surfaces, teal/blue for normal chain information, amber for warnings, and red for detected integrity failures. Do not depend on color alone; include clear text labels and icons.

The application is a single-page experience with the following areas:

### A. Header and explanation
- Product name: **ChainTrace**.
- Subtitle: **Blockchain Transaction Integrity Simulator**.
- A visible label such as **Educational Sandbox — Fictional Data**.
- A concise explanation that every block contains transactions, its stored hash, and the previous block's hash.
- A prominent but not oversized primary action for verifying the chain.

### B. Summary metrics
Show at least:
- Total blocks.
- Total transactions.
- Overall chain status: `VALID` or `TAMPERED` / `INTEGRITY FAILURE`.
- Last verification time or clear initial verification state.

Metrics must be derived from real current state, never hard-coded to one outcome. Reset must restore the original values and a valid chain.

### C. Blockchain ledger / chain view
- Show the genesis block and a minimum of four subsequent blocks in sequence.
- Present blocks as connected cards or a clear horizontal/vertical chain view; make it responsive on narrow screens.
- For each block, show the block index, timestamp, number of transactions, shortened stored hash, shortened previous hash, and integrity status.
- Clicking a block must select it and reveal the block's complete details in a detail panel or responsive section.
- Hashes need a readable shortened presentation plus a way to inspect/copy the full value where practical.
- On a valid chain, make the valid links/status easy to understand.
- After a tamper, visually distinguish the block with a hash mismatch, the first child with a broken link, and any later descendants whose lineage is untrusted.

### D. Transaction details and intentional tampering
- Show fictional transactions inside the selected block. Transaction fields should include ID, timestamp, sender, recipient, amount in INR, description, and a reference identifier.
- Provide a clear action such as **Simulate unauthorized edit** or **Modify transaction** for a non-genesis transaction.
- Open an accessible dialog or a clearly separated editor. The student must be able to change at least the transaction amount; also support changing sender, recipient, and description if practical.
- Keep the transaction ID, timestamp, and reference read-only to keep the task focused.
- Validate required text fields and require a finite, positive amount. Format display amounts using Indian locale/currency conventions.
- Before applying the edit, explain that the simulator will intentionally leave stored hashes untouched to imitate a database-level unauthorized modification.
- When the edit is applied, mutate only the chosen transaction data in application state. Do not recompute any stored hashes or next-block references. Then run verification automatically so the mismatch is visible immediately.
- Mark the altered transaction and affected chain sections clearly, but do not delete records or silently repair the chain.

### E. Verification result
Provide a dedicated integrity result section with:
- A clear overall pass/fail status.
- The exact altered block index/indices with a `Stored hash` and `Recomputed hash` comparison (full hashes may be wrapped or placed in expandable/copyable fields).
- The first downstream block whose `previousHash` no longer matches the recomputed parent hash.
- Later descendants marked as untrusted because an earlier link in their history is invalid, even when their own transaction content has not changed.
- A short plain-English explanation of why each status was assigned.
- A **Verify chain** action that recalculates the report from current data; it must not repair the chain.
- Verification must be repeatable and deterministic for the same in-memory chain.

### F. Reset
- Provide **Reset demo**.
- Reset must rebuild the exact original seeded chain with fresh correct hashes, clear any simulated edits, select a sensible default block, and restore the valid state.
- Ask for confirmation only if needed; if a confirmation dialog is included, ensure its buttons work and it is keyboard accessible.

### G. Teaching note / limitations
Include a compact “How the detection works” section or expandable explainer:
1. A block hash is calculated from the block's content, including its transaction data and previous hash.
2. Changing transaction data changes the recomputed hash.
3. The stored hash no longer matches the recomputed hash, exposing the modified block.
4. The next block still points to the original parent hash, so the link from the altered block is broken.
5. All later blocks belong to a chain whose history is no longer trustworthy.

Add a clear limitation note: a single local hash-chain simulation demonstrates tamper detection, not the complete security of a real distributed blockchain. An attacker who can rewrite a whole local chain can recalculate hashes; production systems use additional safeguards.

## 5. Exact data and hashing behavior

Use the TypeScript types and algorithm in `IMPLEMENTATION_PLAN.md`. Important requirements:

- Seed at least five blocks total: one genesis block with no payment transactions and at least four regular blocks containing a total of at least eight fictional INR transactions.
- Give each transaction a stable fictional ID, timestamp, sender, recipient, numeric amount, currency, description, and reference.
- Give every block an index, timestamp, transactions array, `previousHash`, nonce (use `0` unless the plan specifies otherwise), and stored `hash`.
- Use a single explicit, stable serialization function with a fixed field order. Hash exactly that serialization with SHA-256 and convert the digest to lowercase hexadecimal.
- Exclude the stored `hash` itself from the hashed payload. Include index, timestamp, transactions, previousHash, and nonce in the payload.
- The genesis block's `previousHash` must be the defined genesis sentinel (for example, `GENESIS_PREVIOUS_HASH = '0'`).
- Construct the initial chain sequentially: the next block's `previousHash` must use the preceding block's stored hash at the time the chain is built.
- Store the seeded baseline in a reliable way so **Reset demo** rebuilds the original content, not an already-tampered state.
- Never compute a replacement hash during the intentional-tamper action.

### Required verification algorithm
For every block in index order:

1. Recompute `computedHash` from the block's current payload.
2. Set `hashMatches = computedHash === block.hash`.
3. For the genesis block, check its `previousHash` against the genesis sentinel. For every other block, check whether `block.previousHash === previousReport.computedHash`. This is important: compare a block's previous hash against its parent's **recomputed current hash**, not only the parent's stored hash.
4. Track whether any ancestor is untrusted.
5. Classify the block as:
   - `VALID`: its hash matches, its parent link matches, and no ancestor is untrusted.
   - `HASH_MISMATCH`: its current contents recompute to a different value than its stored hash. This identifies direct content tampering.
   - `BROKEN_LINK`: its own hash may match, but its previous hash does not match its parent's recomputed hash. This is expected for the first block after a modified parent.
   - `UNTRUSTED_DESCENDANT`: its own hash and immediate link may match, but it descends from an already-invalid part of the chain.
6. Overall chain integrity is valid only when every block is `VALID`.

Keep the report logic in a pure, testable function separate from React components. The editor must not change a block's stored hash, and verification must never repair or mine the chain automatically.

## 6. Recommended architecture

Follow the implementation plan's file tree. Keep hashing, seeded-chain creation, verification, formatting, state management, and UI components separated. Use names that make the code self-explanatory. A reasonable baseline is:

- `src/types/` for transaction, block, and verification types.
- `src/lib/blockchain/` for canonical serialization, SHA-256, seeded-chain creation, tamper mutation, and verification.
- `src/lib/` for currency/date/hash display helpers.
- `src/components/` for header, metric cards, block cards/chain, detail panel, transaction editor dialog, status badges, and integrity report.
- `src/App.tsx` for page composition and state orchestration.
- Unit tests for hashing, seed generation, tampering, and verification.

Do not introduce a state library unless an actual need appears. React state and small custom hooks are sufficient.

## 7. Required tests and quality checks

Add meaningful automated tests, preferably Vitest. At minimum test:

1. The seeded chain has at least five blocks and all blocks verify as valid.
2. Every non-genesis block points to the previous block's stored hash on a pristine chain.
3. Identical canonical payloads produce identical SHA-256 hashes.
4. Changing a transaction field changes its recomputed block hash.
5. An intentional tamper leaves the old stored hash unchanged.
6. Verification identifies the edited block as `HASH_MISMATCH`.
7. The first child is `BROKEN_LINK` after parent tampering.
8. Later descendants are `UNTRUSTED_DESCENDANT` where appropriate.
9. The overall status fails if any block is invalid.
10. Reset/rebuild generates a pristine, valid seeded chain.
11. Form validation rejects empty required names and non-positive/non-finite amounts.

Also run and fix:
- The automated tests.
- TypeScript checks/build.
- Production build.

If a check cannot be run due to the environment, report that accurately rather than claiming it passed.

## 8. README and handoff

Create a useful `README.md` containing:
- Project purpose and learning objectives.
- Features and a concise user walkthrough for a college demonstration.
- Tech stack.
- Prerequisites and exact commands to install, run, test, and build.
- A simple explanation of SHA-256 hashes, previous-hash links, the mismatch, and downstream trust impact.
- Educational limitations and the difference between this local simulation and a real distributed blockchain.

## 9. Definition of done — verify all before finishing

The project is complete only when:

- The app starts successfully and the initial chain is valid.
- At least five connected blocks and eight fictional transactions are shown.
- Every displayed hash is calculated from real block content, not hard-coded.
- A student can select a non-genesis transaction and deliberately modify it.
- The edit leaves stored hashes untouched and immediately exposes a real SHA-256 mismatch.
- The altered block is identified exactly; the first broken child link and later untrusted descendants are explained distinctly.
- Re-verifying reports the same findings without repairing anything.
- Reset restores the exact original valid demo chain.
- The layout works on desktop and mobile, and the editor/controls are accessible.
- Automated tests, type checks, and production build pass, or any environment blocker is reported honestly.
- README instructions match the actual implementation.
- No real payment integration, wallet, blockchain network, database, authentication system, or unrelated feature has been added.

## 10. Work method and final response

Work in this order:
1. Inspect the repository and read `IMPLEMENTATION_PLAN.md`.
2. Summarize the implementation approach in a few lines in your working notes, then implement without asking the user to approve the obvious steps.
3. Build and test the hashing/verification core before wiring up the UI.
4. Implement the UI and tamper/reset interactions.
5. Run tests, type checks, and production build; fix errors.
6. Review the project against every definition-of-done item.
7. Update `README.md` and any plan checklist that should reflect completed work, but do not rewrite the plan to excuse missing requirements.

At the end, provide a concise handoff: what was built, key files, commands to run it, tests/build checks and their actual results, and any known limitations. Do not say the app was tested successfully unless you actually ran the relevant commands and inspected their results.

**Now implement the project. The `IMPLEMENTATION_PLAN.md` is the source of truth. Stay within scope and finish the working application.**
