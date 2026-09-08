

# Borrower Copilot — AI Coding Agent Instructions

## 1. Project Context

You are working on **Borrower Copilot**, a take-home assignment for a Software Engineer Intern role.

Borrower Copilot is a borrower-first financial decision-support application for Indian borrowers.

The product helps users answer:

1. Should I borrow at all?
2. How much am I realistically eligible for?
3. What is a fair interest-rate range?
4. What EMI should I agree to?

The application also generates a one-page Negotiation Card.

The product is a **decision-support prototype**, not a lender approval system.

---

# 2. Read Before Coding

Before making significant changes, read these files:

```text
PRD.md
RULES.md
ARCHITECTURE.md
DESIGN.md
PROGRESS.md
````

These documents define:

* Product requirements
* Financial assumptions
* Technical architecture
* UI/UX behaviour
* Current implementation status

Treat them as the primary project context.

Do not invent requirements that are not needed for the assignment.

---

# 3. Core Development Principle

Prefer:

```text
Simple
+
Readable
+
Deterministic
+
Testable
```

over:

```text
Complex
+
Over-engineered
+
Hard to explain
```

This is a focused take-home assignment.

Do not build a production banking platform.

---

# 4. Technology

Use:

```text
Next.js (App Router)
React
TypeScript
CSS / Tailwind
```

Prefer the existing project dependencies.

Do not add a dependency unless there is a clear reason.

Before installing a package, consider:

```text
Can the existing stack solve this cleanly?
```

If yes, use the existing stack.

---

# 5. Architecture

Maintain this separation:

```text
UI
 ↓
Engine
 ↓
Calculations
 ↓
Rules
```

The optional AI layer comes after deterministic analysis:

```text
User Input
    ↓
Question Engine
    ↓
Decision Engine
    ↓
Calculations
    ↓
Rules
    ↓
Structured Result
    ↓
AI Explanation
```

The financial engine is the source of truth.

AI is not the financial decision-maker.

---

# 6. Project Structure

Keep the project approximately organized as:

```text
src/
├── components/
│   ├── questionnaire/
│   ├── results/
│   ├── negotiation/
│   └── ai/
│
├── engine/
├── calculations/
├── rules/
├── types/
├── data/
├── ai/
└── tests/
```

Do not create additional architectural layers unless they solve a real problem.

---

# 7. Financial Logic Must Be Deterministic

The following must be calculated by TypeScript application logic:

```text
Borrow / Borrow Less / Don't Borrow
Borrower-safe amount
Indicative lender-likely amount
FOIR
Safe EMI
Fair-rate band
Total interest
Fees
All-in cost
Stress result
Confidence
```

The same inputs should produce the same outputs.

Do not use an LLM to decide these values.

---

# 8. AI Role

AI is an optional **explanation and conversation layer**.

AI may:

```text
Explain results
Explain financial concepts
Explain trade-offs
Answer borrower questions
Explain the Negotiation Card
Rewrite explanations in simpler language
```

AI must NOT:

```text
Approve a loan
Reject a loan
Choose the safe EMI
Choose the safe loan amount
Choose the FOIR
Choose the fair-rate band
Calculate credit risk
Override financial calculations
Invent lender policies
Invent RBI requirements
```

Correct flow:

```text
Deterministic Engine
        ↓
Structured Result
        ↓
AI
        ↓
Explanation
```

Incorrect flow:

```text
Borrower Input
        ↓
LLM
        ↓
Loan Decision
```

---

# 9. AI Must Not Override Results

Suppose the engine produces:

```text
Decision: Borrow Less
Safe Amount: ₹6,50,000
Safe EMI: ₹15,000
Fair Rate: 11.5%–13.5%
```

The AI must explain these values.

It must not respond:

```text
Actually, you can safely borrow ₹8,00,000.
```

If the AI disagrees with the result, the deterministic result remains authoritative.

---

# 10. AI Input

Pass structured financial results to the AI.

Example:

```ts
{
  decision: "BORROW_LESS",
  requestedAmount: 800000,
  safeAmount: 650000,
  lenderLikelyAmount: 720000,
  fairRate: {
    min: 11.5,
    max: 13.5
  },
  safeEmi: 15000,
  confidence: "MEDIUM"
}
```

The AI should use these values rather than independently recalculating them.

---

# 11. AI Prompt Rules

AI prompts should explicitly instruct the model to:

```text
1. Explain the supplied result.
2. Use the supplied calculated numbers.
3. Do not invent financial values.
4. Do not invent lender policies.
5. Do not invent RBI requirements.
6. Do not claim loan approval.
7. Be transparent about uncertainty.
8. Say when information is unavailable.
9. Never override deterministic results.
10. Keep explanations borrower-friendly.
```

---

# 12. AI Failure Handling

The application must continue working if the AI service fails.

Correct behaviour:

```text
AI unavailable
      ↓
Show deterministic result
      ↓
Show Negotiation Card
      ↓
Allow borrower to continue
```

Do not make the core application dependent on an AI API.

The following must work without AI:

```text
Questionnaire
Decision
Safe amount
Lender-likely amount
Rate
EMI
Tenure
Stress
Confidence
Negotiation Card
```

---

# 13. Unknown Values

Unknown is never automatically zero.

Incorrect:

```ts
creditScore = 0;
```

Correct:

```ts
creditScore = null;
```

or another explicit unknown representation.

Unknown information should generally:

```text
Widen ranges
+
Reduce confidence
+
Be explained to the user
```

Do not invent missing borrower information.

---

# 14. Financial Rules

Keep thresholds and assumptions inside:

```text
src/rules/
```

Do not scatter financial constants throughout the UI.

Prefer:

```ts
const safeFoir = RULE_CONFIG.foir.salaried;
```

over:

```ts
const safeFoir = 0.45;
```

inside a component.

---

# 15. Rule Documentation

If a financial assumption is changed in code, update:

```text
RULES.md
```

Each important assumption should identify whether it is:

```text
Source-backed
```

or:

```text
Prototype judgement
```

Do not present prototype assumptions as universal lender or RBI requirements.

---

# 16. Borrower-Safe Amount

The borrower-safe amount is the conservative recommendation.

It should prioritize:

```text
Affordability
+
Monthly buffer
+
Existing obligations
+
Financial resilience
```

Do not increase the safe amount merely to make the borrower qualify.

---

# 17. Lender-Likely Amount

The lender-likely amount is only an indicative estimate.

Never call it:

```text
Approved amount
Sanctioned amount
Guaranteed amount
```

Use:

```text
Indicative lender-likely amount
```

Always make it clear:

> This is not a lender approval.

---

# 18. Decision Outcomes

The system must support all three:

```text
Borrow
Borrow Less
Don't Borrow
```

Do not remove the `Don't Borrow` path.

Do not modify rules to force a positive borrowing decision.

A borrower receiving:

```text
Don't Borrow
```

is a valid and important product outcome.

---

# 19. Question Design

Keep the assessment around:

```text
8–10 core questions
```

Ask additional questions only when they can materially affect:

```text
Decision
Safe amount
Rate
EMI
Confidence
Product routing
```

Avoid collecting unnecessary information.

---

# 20. Adaptive Questions

Question flow should be deterministic.

Example:

```text
Salaried
    ↓
Ask employment stability

Self-employed
    ↓
Ask business history / documented income

Variable income
    ↓
Ask income variability

Unknown credit score
    ↓
Do not invent a score
```

Do not ask every borrower every possible question.

---

# 21. EMI Calculation

Use the standard reducing-balance EMI formula:

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = principal
r = monthly interest rate
n = number of payments
```

Handle zero-interest cases explicitly.

Keep EMI calculation in:

```text
src/calculations/emi.ts
```

Do not duplicate EMI formulas elsewhere.

---

# 22. APR / All-In Cost

Do not use a simplistic calculation and falsely label it as regulatory APR.

If the implementation is an estimate, label it appropriately:

```text
Estimated all-in cost
```

or:

```text
Estimated annualized cost
```

Only use stronger APR terminology if the calculation actually supports it.

Do not claim regulatory compliance without evidence.

---

# 23. Fees

Only calculate configured and documented fees.

Do not invent unknown charges.

Processing fee example:

```text
Processing Fee
=
Loan Amount × Fee Rate
```

Display fees separately from interest.

---

# 24. Stress Testing

Use the assumptions defined in:

```text
RULES.md
```

Do not silently change stress assumptions.

The stress result should show:

```text
Base Case
    ↓
Stress Assumption
    ↓
Stress Result
```

The current prototype may use:

```text
Income ↓ 10%
Interest rate ↑ 2 percentage points
```

if this matches `RULES.md`.

---

# 25. Confidence

Confidence represents confidence in the recommendation based on the information available.

It is NOT:

```text
Credit score
```

Lower confidence when important information is:

```text
Missing
Unknown
Highly variable
Uncertain
```

Use:

```text
High
Medium
Low
```

with a short explanation.

---

# 26. Explanations

Every important number should have a reason.

Bad:

```text
Safe EMI: ₹15,000
```

Better:

```text
Safe EMI: ₹15,000

Why?
Your existing EMI and household expenses
reduce the amount of monthly income available
for a new loan while keeping a safety buffer.
```

The explanation should be understandable to a non-finance user.

---

# 27. Product Routing

Product routing should consider:

```text
Loan purpose
Requested amount
Income type
Existing debt
Business history
Collateral
```

Possible categories:

```text
Personal Loan
Vehicle Loan
Secured Business Loan
Loan Against Property
Gold Loan
```

Do not claim a lender will approve a specific product.

---

# 28. Ravi

Ravi has:

```text
Established business
Substantial borrowing requirement
Unencumbered shop
```

The product should consider a secured/business borrowing route rather than automatically treating the requirement as an unsecured personal loan.

This is a product recommendation, not an approval.

---

# 29. Anita

Anita's profile contains important risk signals:

```text
Variable/informal income
Existing app loans
High existing interest
EMI bounce
Household income pressure
```

Do not ignore these signals because the proposed EV scooter could potentially increase future income.

Potential future income should not automatically be treated as guaranteed current income.

---

# 30. Priya

Priya has:

```text
Stable salaried income
Strong credit score
Existing car EMI
Rent
Large requested personal loan
```

Existing obligations must be included in affordability calculations.

Do not judge affordability from income alone.

---

# 31. React Components

React components should handle:

```text
Rendering
User interaction
UI state
Navigation
```

They should not contain core financial calculations.

Avoid:

```tsx
if (income * 0.45 - existingEmi > 20000) {
  ...
}
```

inside components.

Prefer:

```tsx
const result = makeBorrowingDecision(borrower);
```

and render the result.

---

# 32. TypeScript

Use strong types for important domain data.

Avoid unnecessary:

```ts
any
```

Prefer explicit types for:

```text
Borrower
Loan
Result
Rules
Question
Stress Result
Confidence Result
```

Represent optional/unknown values explicitly.

---

# 33. Testing

Financial logic must be tested independently of the UI.

At minimum test:

```text
EMI
Affordability
Loan amount
Decision
Question adaptation
Stress
Confidence
Three personas
```

Important edge cases:

```text
Zero interest
Zero existing EMI
High existing EMI
Unknown credit score
Variable income
Missing expenses
Requested amount above safe amount
Requested amount below safe amount
```

---

# 34. Persona Testing

Always test:

```text
Priya
Ravi
Anita
```

The expected outcome should be deterministic.

Do not change persona inputs merely to produce nicer results.

---

# 35. Rule Change Testing

When a rule changes:

```text
Change rule
    ↓
Run tests
    ↓
Run personas
    ↓
Verify result
    ↓
Verify UI
```

Example:

```text
FOIR:
45% → 40%
```

The system should update the result through centralized configuration.

---

# 36. UI Requirements

Keep the UI:

```text
Simple
Borrower-first
Mobile-friendly
Readable
Explanation-focused
```

Preferred questionnaire flow:

```text
One question
    ↓
Answer
    ↓
Next
```

Avoid giant forms.

---

# 37. Results Priority

Results should appear in this order:

```text
1. Decision
2. Borrower-safe amount
3. Lender-likely amount
4. Fair rate
5. Safe EMI
6. Tenure trade-off
7. Stress
8. Confidence
9. Negotiation Card
10. Optional AI Assistant
```

The AI assistant should not overpower the financial result.

---

# 38. Negotiation Card

The card must show:

```text
Decision
Safe amount
Lender-likely amount
Fair rate range
EMI ceiling
Preferred tenure
Estimated all-in cost
Negotiation points
Red flags
```

The AI may explain the card but must not modify its financial values.

---

# 39. Privacy

Do not add:

```text
Aadhaar
PAN
Bank credentials
Bureau credentials
```

The prototype uses self-reported information.

Do not add persistent personal-data storage unless explicitly required.

If an external AI provider is used, minimize the borrower information sent to it.

---

# 40. No Unnecessary Backend

Do not create:

```text
Backend
Database
Authentication
Microservices
```

unless a real requirement appears.

The core prototype should work locally.

---

# 41. Dependency Discipline

Do not install packages simply because an AI agent suggests them.

Before adding a dependency, check:

```text
Is it necessary?
Can existing tools solve it?
Does it add complexity?
Will the reviewer understand why it exists?
```

Prefer a small dependency footprint.

---

# 42. Avoid Over-Engineering

Do not introduce unnecessary:

```text
Repository pattern
Factory pattern
Strategy framework
Dependency injection container
Event bus
CQRS
GraphQL
Microservices
ORM
Complex state-management system
LLM orchestration framework
```

A clean TypeScript function is often better.

---

# 43. Agent Workflow

For every implementation task:

```text
1. Read the relevant documentation.
2. Inspect the current source tree.
3. Identify the smallest correct change.
4. Implement it.
5. Run relevant tests.
6. Fix failures.
7. Check affected UI.
8. Update documentation if required.
9. Summarize what changed.
```

Do not rewrite unrelated files.

---

# 44. Before Large Changes

Before changing architecture or financial logic, verify:

```text
PRD.md
RULES.md
ARCHITECTURE.md
```

If the proposed change conflicts with them, explain the conflict before proceeding.

---

# 45. Ambiguous Requirements

When something is unclear:

```text
Is it defined in PRD?
        ↓
Yes → Follow PRD

No
 ↓
Is it defined in RULES?
        ↓
Yes → Follow RULES

No
 ↓
Can it be safely inferred?
        ↓
Yes → Implement and document assumption

No
 ↓
Flag the ambiguity
```

Do not silently invent financial rules.

---

# 46. Financial Honesty

Never:

```text
Invent lender approval criteria
Invent RBI requirements
Invent credit scores
Invent borrower information
Invent fees
Invent interest rates
Hide uncertainty
Use false precision
```

Always distinguish:

```text
Known information
vs
Calculated value
vs
Prototype assumption
vs
Unknown information
```

---

# 47. Code Changes

Prefer small, reviewable changes.

Good:

```text
Add EMI calculation
→ Test EMI
→ Integrate into engine
```

Then:

```text
Add affordability
→ Test affordability
→ Integrate into engine
```

Avoid building the entire application in one uncontrolled change.

---

# 48. Documentation Synchronization

If code changes:

### Financial rule

Update:

```text
RULES.md
```

### Architecture

Update:

```text
ARCHITECTURE.md
```

### User experience

Update:

```text
DESIGN.md
```

### Product behaviour

Update:

```text
PRD.md
```

### Implementation status

Update:

```text
PROGRESS.md
```

---

# 49. Git Workflow

Prefer meaningful commits.

Examples:

```text
feat: add borrower questionnaire
feat: add affordability engine
feat: add rate and product rules
feat: add stress testing
feat: add negotiation card
feat: add borrower AI assistant
test: add persona coverage
docs: finalize README
```

Avoid one huge commit when practical.

---

# 50. Definition of Done

A feature is complete when:

```text
[ ] Correct implementation
[ ] Strong types
[ ] Relevant tests
[ ] UI works
[ ] Unknown values handled correctly
[ ] Financial logic remains deterministic
[ ] Explanations are present
[ ] Documentation updated if necessary
[ ] No unrelated changes
```

---

# 51. Final Validation

Before declaring the project complete:

```text
[ ] npm install works
[ ] npm run dev works
[ ] Production build works
[ ] Tests pass

[ ] Questionnaire works
[ ] Adaptive questions work

[ ] Borrow works
[ ] Borrow Less works
[ ] Don't Borrow works

[ ] Safe amount works
[ ] Lender-likely amount works
[ ] Rate range works
[ ] EMI works
[ ] Fees work
[ ] All-in cost works
[ ] Tenure comparison works
[ ] Stress case works
[ ] Confidence works

[ ] Negotiation Card works

[ ] Priya works
[ ] Ravi works
[ ] Anita works

[ ] Rule change can be demonstrated

[ ] AI explanation works if configured
[ ] AI cannot override financial results
[ ] Core app works without AI

[ ] README setup instructions work
[ ] No unnecessary backend/database/auth
[ ] No permanent borrower-data storage
```

---

# 52. Priority Under Time Pressure

If development time becomes limited, prioritize:

```text
P0 — Must Have
├── Questionnaire
├── Decision engine
├── Safe amount
├── Lender-likely amount
├── Rate range
├── EMI
├── Stress
├── Negotiation Card
└── Priya / Ravi / Anita

P1 — Important
├── Adaptive questions
├── Confidence
├── Explanations
├── Tests
└── Rule-change demonstration

P2 — Polish
├── AI Q&A
├── Visual refinement
├── Animations
└── Extra edge cases
```

The AI assistant should not delay completion of the deterministic core.

---

# 53. Final Principle

Always optimize in this order:

```text
Correct financial reasoning
        >
Clear explanations
        >
Simple maintainable code
        >
Reliable tests
        >
AI enhancement
        >
Visual polish
```

The reviewer should be able to trace:

```text
User Input
    ↓
Rule
    ↓
Calculation
    ↓
Decision
    ↓
Explanation
    ↓
Negotiation Card
```

and answer:

> Where did this number come from?

> Which rule produced it?

> Why does that rule exist?

> What happens if the rule changes?

The AI assistant should make this reasoning easier for the borrower to understand — **never harder to audit.**

```
```
