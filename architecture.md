
# Borrower Copilot — Technical Architecture

## 1. Architecture Overview

Borrower Copilot is a client-side Next.js (React + TypeScript) application.

The architecture separates:

```text
UI
 ↓
Application / Reasoning Engine
 ↓
Calculations
 ↓
Rules
````

The optional AI layer sits **after the deterministic financial analysis**:

```text
User Input
    ↓
Question Engine
    ↓
Decision Engine
    ↓
Calculations
    ↓
Rules / Assumptions
    ↓
Structured Borrower Result
    ↓
┌─────────────────────────────┐
│                             │
│ Results UI                   │
│                             │
│ Optional AI Assistant        │
│                             │
└─────────────────────────────┘
    ↓
Negotiation Card
```

The financial engine is the source of truth.

AI is used for explanation and borrower Q&A, not financial underwriting.

---

# 2. Technology Stack

```text
Frontend
├── Next.js (App Router)
├── React
├── TypeScript
└── CSS / Tailwind

Testing
└── TypeScript test framework

Optional AI
└── AI provider through isolated AI client
```

The prototype does not require:

* Backend
* Database
* Authentication
* Credit bureau integration
* Bank integration
* Lender APIs

---

# 3. Project Structure

```text
borrower-copilot/
│
├── README.md
├── PRD.md
├── RULES.md
├── ARCHITECTURE.md
├── DESIGN.md
├── AGENTS.md
├── PROGRESS.md
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── .gitignore
│
├── public/
│
└── src/
    │
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   └── globals.css
    │
    ├── components/
    │   │
    │   ├── questionnaire/
    │   │   ├── QuestionCard.tsx
    │   │   ├── ProgressBar.tsx
    │   │   └── QuestionRenderer.tsx
    │   │
    │   ├── results/
    │   │   ├── VerdictCard.tsx
    │   │   ├── AmountCard.tsx
    │   │   ├── RateCard.tsx
    │   │   ├── EmiCard.tsx
    │   │   ├── StressCard.tsx
    │   │   └── ConfidenceBadge.tsx
    │   │
    │   ├── negotiation/
    │   │   └── NegotiationCard.tsx
    │   │
    │   └── ai/
    │       └── BorrowerAssistant.tsx
    │
    ├── engine/
    │   ├── decisionEngine.ts
    │   ├── questionEngine.ts
    │   ├── confidenceEngine.ts
    │   ├── stressEngine.ts
    │   ├── productRouter.ts
    │   └── explanationEngine.ts
    │
    ├── calculations/
    │   ├── emi.ts
    │   ├── affordability.ts
    │   ├── interest.ts
    │   ├── loanAmount.ts
    │   ├── fees.ts
    │   └── apr.ts
    │
    ├── rules/
    │   ├── foir.ts
    │   ├── rateBands.ts
    │   ├── tenure.ts
    │   ├── debtStress.ts
    │   ├── productRules.ts
    │   └── config.ts
    │
    ├── types/
    │   ├── borrower.ts
    │   ├── loan.ts
    │   ├── result.ts
    │   └── rules.ts
    │
    ├── data/
    │   ├── questions.ts
    │   └── personas.ts
    │
    ├── ai/
    │   ├── aiClient.ts
    │   ├── prompts.ts
    │   └── borrowerAssistant.ts
    │
    └── tests/
        ├── affordability.test.ts
        ├── emi.test.ts
        ├── decision.test.ts
        ├── questions.test.ts
        └── personas.test.ts
```

---

# 4. Folder Responsibilities

## `components/`

Contains presentation and user-interaction components.

Components should:

* Render information
* Collect user input
* Handle UI state
* Call application functions

Components should NOT contain financial rules.

---

## `components/questionnaire/`

Handles the assessment experience.

### `QuestionCard.tsx`

Displays one question and its answer input.

### `ProgressBar.tsx`

Shows questionnaire progress.

### `QuestionRenderer.tsx`

Selects the correct input component based on question type.

---

## `components/results/`

Displays the financial analysis.

### `VerdictCard.tsx`

Shows:

```text
Borrow
Borrow Less
Don't Borrow
```

### `AmountCard.tsx`

Shows:

```text
Borrower-safe amount
Indicative lender-likely amount
```

### `RateCard.tsx`

Shows the fair rate range.

### `EmiCard.tsx`

Shows the recommended EMI ceiling.

### `StressCard.tsx`

Shows the stress scenario and result.

### `ConfidenceBadge.tsx`

Shows:

```text
High
Medium
Low
```

---

## `components/negotiation/`

### `NegotiationCard.tsx`

Displays the final one-page borrower negotiation summary.

It should contain:

* Decision
* Safe amount
* Lender-likely amount
* Fair rate
* EMI ceiling
* Tenure
* All-in cost
* Negotiation points
* Red flags

---

# 5. Engine Layer

The `engine/` directory contains the application's reasoning and orchestration logic.

The engine combines calculations and rules into meaningful borrower results.

---

## `decisionEngine.ts`

Determines:

```text
Borrow
Borrow Less
Don't Borrow
```

It uses outputs from:

* Affordability
* Loan amount
* Debt situation
* Product routing
* Stress analysis

The decision must be deterministic.

---

## `questionEngine.ts`

Controls adaptive questioning.

Responsibilities:

* Determine the next question
* Skip irrelevant questions
* Ask additional questions when they can materially change the result
* Handle unknown answers

Target:

```text
Approximately 8–10 core questions
```

---

## `confidenceEngine.ts`

Calculates confidence based on the completeness and stability of the supplied information.

Examples of uncertainty:

* Unknown credit score
* Variable income
* Missing expenses
* Limited income history
* Unknown emergency savings

Output:

```text
High
Medium
Low
```

---

## `stressEngine.ts`

Runs financial stress scenarios.

Example prototype stress:

```text
Income ↓ 10%
Interest rate ↑ 2 percentage points
```

The assumptions come from `rules/`.

---

## `productRouter.ts`

Determines the broad product category that may be more appropriate.

Possible outputs:

```text
Personal Loan
Vehicle Loan
Secured Business Loan
Loan Against Property
Gold Loan
```

It should consider:

* Purpose
* Amount
* Income type
* Business history
* Existing obligations
* Collateral

It must not claim lender approval.

---

## `explanationEngine.ts`

Produces structured explanations for financial results.

Example:

```text
Safe EMI: ₹15,000

Reason:
Existing EMI and household expenses reduce
the amount of monthly income available for
new debt while maintaining a safety buffer.
```

The explanation engine should be deterministic.

The AI layer may make these explanations more conversational.

---

# 6. Calculation Layer

The `calculations/` directory contains pure mathematical functions.

Calculations should not depend on React.

They should be easy to test independently.

---

## `emi.ts`

Calculates monthly EMI.

Formula:

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = principal
r = monthly interest rate
n = number of payments
```

The zero-interest case must be handled explicitly.

---

## `affordability.ts`

Calculates:

* FOIR-based EMI capacity
* Disposable-income capacity
* Safe EMI

Conceptually:

```text
Income
  ↓
FOIR capacity
  ↓
Existing EMI deduction
  ↓
Disposable-income check
  ↓
Safe EMI
```

Exact thresholds come from `rules/`.

---

## `interest.ts`

Calculates:

* Total interest
* Interest over tenure
* Interest comparisons between tenures

---

## `loanAmount.ts`

Converts an affordable EMI into an estimated maximum loan amount.

Flow:

```text
Safe EMI
   +
Interest Rate
   +
Tenure
   ↓
Maximum Affordable Loan
```

---

## `fees.ts`

Calculates known configured fees.

Example:

```text
Processing Fee
=
Loan Amount × Fee Rate
```

Unknown fees should not be fabricated.

---

## `apr.ts`

Calculates the estimated annualized all-in borrowing cost where enough cash-flow information exists.

The implementation must avoid using a simplistic formula and falsely calling it a regulatory APR.

If the result is an estimate, the UI should call it:

```text
Estimated all-in cost
```

or:

```text
Estimated annualized cost
```

as appropriate.

---

# 7. Rules Layer

The `rules/` directory contains financial assumptions and thresholds.

Rules are intentionally separated from calculations.

This allows the reviewer to change an assumption without rewriting the application.

---

## `foir.ts`

Contains prototype FOIR limits.

Example concept:

```text
Salaried
Self-employed
Variable / informal
```

Exact values are documented in `RULES.md`.

---

## `rateBands.ts`

Contains rate ranges based on:

* Product
* Credit profile
* Income stability
* Risk factors

The output is always a range.

---

## `tenure.ts`

Contains prototype tenure assumptions.

Examples:

```text
Personal loan
Vehicle loan
Business borrowing
Secured borrowing
```

---

## `debtStress.ts`

Contains stress assumptions.

Example:

```text
Income reduction
Interest-rate increase
```

---

## `productRules.ts`

Contains routing logic for different borrowing products.

---

## `config.ts`

Central configuration for values that may need to change during the review.

Example:

```ts
export const RULE_CONFIG = {
  stressIncomeDrop: 0.10,
  stressRateIncrease: 0.02,
};
```

The exact configuration should follow `RULES.md`.

---

# 8. Types Layer

The `types/` directory defines domain objects.

---

## `borrower.ts`

Defines borrower information.

Example:

```ts
interface BorrowerProfile {
  age: number;
  incomeType: IncomeType;
  monthlyIncome: number | null;
  householdExpenses: number | null;
  existingEmi: number | null;
  creditScore: number | null;
  requestedAmount: number;
  purpose: LoanPurpose;
}
```

Unknown values should be represented explicitly.

---

## `loan.ts`

Defines:

* Loan amount
* Interest rate
* Tenure
* EMI
* Fees
* Product type

---

## `result.ts`

Defines the complete financial analysis result.

Example:

```ts
interface BorrowerResult {
  decision: Decision;
  safeAmount: number;
  lenderLikelyAmount: number;
  fairRateRange: RateRange;
  safeEmi: number;
  tenure: TenureResult;
  stress: StressResult;
  confidence: ConfidenceResult;
  explanation: Explanation;
}
```

---

## `rules.ts`

Defines the structure of configurable financial rules.

---

# 9. Data Layer

The `data/` directory contains static application data.

---

## `questions.ts`

Contains questionnaire definitions.

Example:

```ts
{
  id: "monthly_income",
  type: "currency",
  label: "What is your monthly take-home income?"
}
```

---

## `personas.ts`

Contains the three challenge personas:

```text
Priya
Ravi
Anita
```

These are used for:

* Demonstration
* Testing
* Validation

---

# 10. AI Layer

The AI layer is optional from the perspective of the core financial engine.

It exists to provide conversational explanations.

Architecture:

```text
Structured Financial Result
          ↓
      AI Client
          ↓
    AI Assistant
          ↓
Borrower-friendly response
```

---

## `aiClient.ts`

Responsible for communication with the selected AI provider.

The provider-specific implementation should be isolated here.

The rest of the application should not directly depend on provider-specific APIs.

---

## `prompts.ts`

Contains bounded prompts that define the AI assistant's behaviour.

The prompt should instruct the model to:

* Explain results
* Use supplied calculated values
* Admit uncertainty
* Avoid inventing facts
* Avoid changing financial calculations
* Avoid claiming lender approval
* Avoid inventing RBI requirements

---

## `borrowerAssistant.ts`

Provides a small application-level interface for AI responses.

Conceptually:

```ts
answerBorrowerQuestion(
  question,
  borrowerResult
)
```

The function should provide the AI with the relevant structured result.

---

# 11. AI Data Flow

The intended data flow is:

```text
User Answers
      ↓
Question Engine
      ↓
Decision Engine
      ↓
Calculations
      ↓
Rules
      ↓
Structured Borrower Result
      ↓
┌───────────────────────┐
│                       │
│ Results UI             │
│                       │
│ AI Assistant           │
│                       │
└───────────────────────┘
```

The AI does not sit before the financial engine.

---

# 12. AI Boundary

The following must remain deterministic:

```text
Decision
Safe Amount
Lender-Likely Amount
FOIR
Safe EMI
Fair Rate Range
Stress Assumptions
Confidence Calculation
```

The AI may:

```text
Explain
Summarize
Answer questions
Explain trade-offs
Explain the Negotiation Card
```

The AI must not:

```text
Approve
Reject
Set EMI
Set FOIR
Set rate
Calculate credit risk
Override results
```

---

# 13. AI Failure Handling

The core application must work without AI.

```text
AI Available
    ↓
Results + AI explanations

AI Unavailable
    ↓
Results still work
```

AI failure must not break:

* Questionnaire
* Calculations
* Decision
* Results
* Negotiation Card

---

# 14. Application Data Flow

The complete application flow is:

```text
                 ┌─────────────────┐
                 │     Borrower    │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Questionnaire  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Question Engine │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Decision Engine │
                 └────────┬────────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
       Calculations     Rules      Product Router
             │            │            │
             └────────────┼────────────┘
                          ▼
                 ┌─────────────────┐
                 │ Structured      │
                 │ Result          │
                 └────────┬────────┘
                          │
             ┌────────────┴────────────┐
             ▼                         ▼
      ┌───────────────┐       ┌────────────────┐
      │ Results UI    │       │ AI Assistant   │
      └───────┬───────┘       └───────┬────────┘
              │                       │
              └───────────┬───────────┘
                          ▼
                 ┌─────────────────┐
                 │ Negotiation     │
                 │ Card            │
                 └─────────────────┘
```

---

# 15. State Management

The application does not require a large state-management framework.

React state is sufficient for the prototype.

Primary state:

```text
Current question
Borrower answers
Questionnaire progress
Calculation result
AI conversation
```

Financial calculations should remain outside React state where possible.

---

# 16. Session Data

Borrower information can remain in the current browser session/application state.

The prototype does not require persistent storage.

Do not add a database simply to store questionnaire answers.

---

# 17. Privacy Architecture

The application should avoid collecting unnecessary sensitive information.

Do not request:

```text
Aadhaar
PAN
Bank passwords
Bank credentials
Credit-bureau credentials
```

The challenge uses self-reported information.

If an external AI provider is used:

```text
Borrower Input
     ↓
Minimal Required AI Context
     ↓
AI Provider
```

Only the information necessary for the explanation should be sent.

---

# 18. Dependency Direction

Keep dependencies flowing in one direction:

```text
components
    ↓
engine
    ↓
calculations
    ↓
rules
```

Types may be shared across layers.

AI should consume structured results:

```text
engine/result
      ↓
AI
```

The AI layer should not modify rules.

---

# 19. Separation of Concerns

### UI

Responsible for:

```text
Display
Input
Navigation
Interaction
```

### Engine

Responsible for:

```text
Reasoning
Decision
Question selection
Stress
Confidence
Explanations
Routing
```

### Calculations

Responsible for:

```text
Mathematics
```

### Rules

Responsible for:

```text
Thresholds
Bands
Assumptions
Configuration
```

### AI

Responsible for:

```text
Natural-language explanation
Borrower Q&A
```

---

# 20. Testing Architecture

Tests should focus on deterministic financial behaviour.

```text
tests/
├── affordability.test.ts
├── emi.test.ts
├── decision.test.ts
├── questions.test.ts
└── personas.test.ts
```

Important scenarios:

```text
Normal borrower
High debt
Low income
Variable income
Unknown credit score
Requested amount above safe amount
Requested amount below safe amount
```

---

# 21. Persona Validation

The three required personas act as end-to-end examples.

```text
Priya
   ↓
Questionnaire
   ↓
Analysis
   ↓
Result

Ravi
   ↓
Questionnaire
   ↓
Analysis
   ↓
Result

Anita
   ↓
Questionnaire
   ↓
Analysis
   ↓
Result
```

Each should produce a reproducible result.

---

# 22. Rule Change Architecture

Rules should be changeable centrally.

Example:

```text
Before

FOIR = 45%

      ↓

Financial Engine

      ↓

Result A
```

Change:

```text
FOIR = 40%
```

Then:

```text
Financial Engine

      ↓

Result B
```

The UI should automatically display the updated result.

No component-level financial rule changes should be required.

---

# 23. Example Rule Change Flow

```text
src/rules/config.ts

FOIR:
45%
    ↓
40%
    ↓
run tests
    ↓
recalculate personas
    ↓
updated results
```

This is important for the challenge's follow-up discussion.

---

# 24. Security Boundaries

The prototype has a deliberately small attack surface because it does not require:

* Authentication
* Database
* Backend API
* Payment system
* Lender integration

If AI API access is implemented through a frontend-only prototype, API-key exposure must be considered.

A real production implementation should not expose a private AI API key in browser code.

For the take-home prototype, keep the AI integration replaceable and document the chosen approach.

---

# 25. Performance

The application should feel immediate.

Target behaviour:

```text
Question transitions
→ Immediate

Financial calculation
→ Near-instant

Results rendering
→ Immediate

AI response
→ Network dependent
```

Do not add unnecessary loading delays.

---

# 26. Error Boundaries

Errors should be handled at appropriate layers.

Financial calculation errors should not silently produce a financial result.

Example:

```text
Invalid input
    ↓
Validation error
    ↓
Ask user to correct input
```

AI errors should degrade gracefully:

```text
AI error
    ↓
Show deterministic result
```

---

# 27. Extensibility

The architecture should allow future additions without requiring a rewrite.

Possible future additions:

```text
More loan products
More borrower profiles
More stress scenarios
More financial rules
Additional AI providers
Additional languages
```

However, these should not be implemented unless required by the assignment.

The current architecture intentionally prioritizes simplicity.

---

# 28. What This Architecture Does Not Include

This prototype does not require:

```text
Microservices
Event-driven architecture
GraphQL
Database ORM
Repository layer
Complex dependency injection
Message queues
Kubernetes
Cloud infrastructure
Production authentication
Production underwriting system
ML credit scoring
Autonomous AI underwriting
```

These would add complexity without improving the take-home outcome.

---

# 29. Architectural Principle

The most important architectural rule is:

```text
                     SOURCE OF TRUTH
                           │
                           ▼
                    Deterministic Rules
                           │
                           ▼
                     Calculations
                           │
                           ▼
                    Decision Engine
                           │
                           ▼
                  Structured Result
                     │           │
                     ▼           ▼
                Results UI       AI
                               Explanation
```

The AI layer is downstream from the financial decision.

This ensures:

* Financial logic is inspectable
* Calculations are testable
* Rules are easy to change
* Results are reproducible
* AI can improve usability without controlling the financial decision

---

# 30. Final Architecture Principle

> **Keep the financial brain deterministic, keep the UI simple, and use AI as an explanation layer rather than as the authority making the borrowing decision.**

```
```
