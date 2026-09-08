

# Borrower Copilot — Product Requirements Document

## 1. Product Overview

Borrower Copilot is a personal borrowing assistant for Indian borrowers.

It helps a borrower answer four practical questions before accepting a loan:

1. **Should I borrow at all?**
2. **How much am I realistically eligible for?**
3. **What is a fair interest-rate range for me?**
4. **What EMI should I agree to?**

The product then converts the analysis into a simple **Negotiation Card** that the borrower can use when speaking with a lender.

The product is designed as a transparent decision-support tool, not as a lender approval system.

---

## 2. Problem

Borrowers often focus on the loan amount or advertised interest rate without understanding:

- Whether they should borrow at all
- Whether the requested amount is affordable
- The difference between lender-possible and borrower-safe borrowing
- The real cost after processing fees
- How tenure changes total interest
- How a fall in income or increase in interest rate affects repayment
- What terms they should negotiate with a lender

Borrower Copilot makes these trade-offs understandable before the borrower commits.

---

## 3. Target User

### Primary User

An Indian borrower considering a new loan.

The borrower may be:

- Salaried
- Self-employed
- Informal or variable-income
- A first-time borrower
- Someone with an existing loan
- Someone who does not know their exact credit score

### Initial Personas

The product must support the three challenge personas:

#### Priya

- Age: 29
- Location: Bengaluru
- Employment: Salaried software engineer
- Experience: 5 years
- Monthly net income: ₹1.10 lakh
- Existing car EMI: ₹14,000
- Remaining car tenure: 2 years
- Credit score: 780
- Rent: ₹28,000
- Requested loan: ₹8 lakh
- Purpose: Wedding

#### Ravi

- Age: 42
- Location: Mysuru
- Employment: Self-employed kirana business
- Business history: 14 years
- Cash income: ₹40,000–₹80,000/month
- ITR: ₹4.2 lakh/year
- Owns shop worth approximately ₹45 lakh
- Shop is unencumbered
- No formal loan history / score
- Wife's income: ₹18,000/month
- Requested loan: ₹15 lakh
- Purpose: Stock line + delivery vehicle

#### Anita

- Age: 35
- Location: Hubballi
- Income: Informal delivery riding + tailoring
- Monthly income: ₹26,000–₹30,000
- Children: 2
- Husband unemployed for 8 months
- Existing app loans: 3
- Existing outstanding: ₹35,000
- Existing loans: 30%+ interest
- One EMI bounced last month
- Requested loan: ₹1.5 lakh
- Purpose: EV scooter to increase delivery income

---

# 4. Product Goals

## Goal 1 — Borrow / Don't Borrow Decision

The product must provide one clear recommendation:

- **Borrow**
- **Borrow Less**
- **Don't Borrow**

The recommendation must include a short explanation.

Example:

> Borrow less. Your requested EMI would leave too little monthly buffer after existing obligations and essential expenses.

The product must make the **Don't Borrow** path reachable and credible.

It must never assume that taking a loan is the desired outcome.

---

## Goal 2 — Borrowing Amount

The product must show two different amounts:

### Borrower-safe amount

The amount the borrower can reasonably afford while maintaining a safety buffer.

### Lender-likely amount

An indicative estimate of what a lender might potentially consider based on the supplied information.

The UI must clearly state:

> Lender-likely does not mean approved.

The borrower-safe amount is the recommended amount to use for decision-making.

---

## Goal 3 — Fair Rate

The product must provide a **rate band**, not a fake precise rate.

Example:

> Fair range: 11.0%–13.0%

The result should consider relevant factors such as:

- Loan type
- Credit score
- Income stability
- Existing obligations
- Borrower profile
- Secured vs unsecured borrowing

If important information is unknown, the range should become wider and confidence should decrease.

---

## Goal 4 — All-in Cost

The product must show more than the headline interest rate.

It should account for:

- Interest rate
- Processing fee
- Other known upfront charges
- Loan amount
- Tenure
- EMI
- Total repayment

Where sufficient information exists, the product should calculate an estimated annualized all-in borrowing cost.

The UI must distinguish between:

> Advertised interest rate

and

> Estimated all-in cost

The product must not claim that its calculation is an official RBI APR calculation unless the implementation actually satisfies the applicable regulatory methodology.

---

## Goal 5 — Safe EMI

The product must recommend an EMI ceiling.

The result should answer:

> What is the maximum EMI I should agree to?

The calculation should consider:

- Income
- Household expenses
- Existing EMIs
- Income stability
- Safety buffer
- Borrower type

The recommended EMI should be conservative enough to leave room for normal financial shocks.

---

## Goal 6 — Tenure Trade-off

The product must explain the trade-off between:

- Lower EMI with longer tenure
- Higher EMI with shorter tenure

Example:

> A longer tenure reduces monthly EMI but increases total interest paid.

The user should be able to understand the trade-off without doing the mathematics themselves.

---

## Goal 7 — Stress Case

The product must show what happens under a reasonable negative scenario.

Examples:

- Income decreases
- Interest rate increases
- Expenses increase

The stress result should answer:

> Would this loan still be manageable if conditions become worse?

The stress scenario must clearly identify its assumptions.

---

# 5. AI Assistant

Borrower Copilot may include a bounded AI assistant to make the financial analysis easier to understand.

The AI layer is an **explanation and conversation layer**, not the financial decision engine.

The architecture is:

```text
Borrower Input
      ↓
Deterministic Financial Engine
      ↓
Calculated Result
      ↓
AI Assistant
      ↓
Explanation / Borrower Q&A
````

## AI Responsibilities

The AI assistant may:

* Explain the recommendation in simple language
* Explain why the safe amount is lower or higher
* Explain the fair-rate range
* Explain EMI and tenure trade-offs
* Explain the stress scenario
* Explain the Negotiation Card
* Answer borrower questions about the already-calculated result
* Help translate technical financial concepts into borrower-friendly language

Example:

**User:**

> Why should I borrow less?

**AI:**

> Your requested loan would create an EMI above the safer monthly limit calculated from your income, existing EMI, and household expenses. Borrowing less leaves you with a larger monthly buffer.

---

## AI Restrictions

The AI must **not** independently determine:

* Borrow / Borrow Less / Don't Borrow
* Borrower-safe loan amount
* Lender-likely amount
* FOIR
* Safe EMI
* Fair-rate band
* Credit risk
* Stress thresholds
* Financial rules

These must come from deterministic application logic.

```text
Financial Rules
      ↓
TypeScript Calculations
      ↓
Decision Engine
      ↓
Final Structured Result
      ↓
AI Explanation
```

The AI must not override or modify the calculated result.

---

## AI Input

The AI should receive the structured result produced by the financial engine rather than independently calculating the financial recommendation.

Example:

```text
Decision: BORROW LESS

Requested Amount: ₹8,00,000
Safe Amount: ₹6,50,000
Lender-Likely Amount: ₹7,20,000

Fair Rate: 11.5%–13.5%

Safe EMI: ₹15,000

Stress Result: Monthly buffer becomes tight

Confidence: Medium
```

The AI can explain this information to the borrower.

---

## AI Honesty

The AI must not:

* Invent lender policies
* Invent RBI requirements
* Claim lender approval
* Present assumptions as facts
* Create unsupported interest rates
* Hide uncertainty
* Change deterministic calculations

When information is unavailable, the AI should say so.

Example:

> Your credit score wasn't provided, so the rate range is wider than it would be with a known score.

---

## AI Failure Handling

If the AI service is unavailable:

```text
AI unavailable
      ↓
Core Borrower Copilot still works
      ↓
Deterministic results remain available
```

The application must not fail financially because the AI layer is unavailable.

The borrower should still be able to see:

* Decision
* Safe amount
* Lender-likely amount
* Rate range
* EMI
* Stress result
* Confidence
* Negotiation Card

AI is an enhancement, not a dependency for the core financial calculation.

---

# 6. Question Design

The assessment should normally require approximately **8–10 questions**.

Questions should be adaptive.

The product should ask additional questions only when the answer can materially change:

* The recommendation
* Loan amount
* Rate band
* EMI
* Confidence
* Product routing

The product should avoid unnecessary questions.

---

## Core Information

The assessment should collect relevant information such as:

* Age
* Income type
* Monthly take-home income
* Income stability
* Household expenses
* Existing EMI obligations
* Requested loan amount
* Loan purpose
* Credit score if known
* Emergency savings if known
* Existing lender quote if available
* Relevant collateral/product information

Not every borrower needs every question.

---

# 7. Unknown Information

Unknown information must **not automatically be treated as zero**.

For example:

```text
Credit score: Unknown
```

must not become:

```text
Credit score: 0
```

Instead:

* Use available information
* Widen the relevant range
* Reduce confidence
* Explain what information is missing

Example:

> Your rate range is wider because your credit score is unknown.

---

# 8. Decision Engine

The decision engine combines:

```text
Borrower Profile
       +
Income
       +
Expenses
       +
Existing Debt
       +
Requested Loan
       +
Loan/Product Type
       +
Risk Indicators
       ↓
Decision Engine
       ↓
Borrow
Borrow Less
Don't Borrow
```

The engine should be deterministic.

The same inputs should produce the same output.

Rules must be stored separately from UI components.

---

# 9. Affordability Logic

The prototype should use an FOIR-style affordability approach.

Conceptually:

```text
FOIR Capacity
=
Income × Applicable FOIR Limit
```

Then:

```text
Available EMI Capacity
=
FOIR Capacity - Existing EMIs
```

A second disposable-income check should be applied:

```text
Disposable Income
=
Income
- Household Expenses
- Existing EMIs
```

The safe EMI should use the more conservative result.

Exact thresholds and assumptions are defined in:

```text
RULES.md
```

These thresholds are prototype judgements unless explicitly sourced.

They must not be presented as universal lender or RBI rules.

---

# 10. Loan Amount Calculation

The system should estimate:

```text
Maximum Affordable EMI
        ↓
Maximum Loan Amount
```

using:

* Interest-rate assumption/range
* Tenure
* EMI affordability

The requested amount must then be compared with the safe amount.

Example:

```text
Requested: ₹8,00,000
Safe:      ₹6,50,000

Recommendation:
Borrow Less
```

---

# 11. Lender-Likely vs Borrower-Safe

The system must keep these concepts separate.

### Borrower-safe

Conservative amount intended to protect the borrower's monthly cash flow.

### Lender-likely

Indicative amount based on less-conservative underwriting assumptions.

The product must never state:

> You are approved for ₹X.

Instead:

> Indicative lender-likely amount: ₹X

and:

> This is not a lender approval or sanction.

---

# 12. Product Routing

The system should identify the most appropriate broad product category where useful.

Possible categories include:

* Personal loan
* Two-wheeler / vehicle loan
* Secured business loan
* Loan against property
* Gold loan
* Other secured borrowing

Product routing should consider:

* Purpose
* Requested amount
* Income profile
* Existing debt
* Available collateral
* Business history

Example:

```text
Ravi
↓
Established business
+
₹15L requirement
+
₹45L unencumbered shop
↓
Consider secured business borrowing
rather than automatically routing to
an expensive unsecured personal loan.
```

This is a product recommendation, not a lender approval.

---

# 13. Rate Engine

The rate engine should produce a range.

Example:

```text
Fair Rate Range
11.0% – 13.0%
```

The range should be influenced by:

* Product type
* Credit score
* Income stability
* Existing debt
* Risk indicators
* Secured/unsecured status

Rate bands must be maintained in:

```text
src/rules/rateBands.ts
```

and documented in:

```text
RULES.md
```

Each band must specify:

* Value
* Reason
* Source or judgement

---

# 14. EMI Calculation

The system should calculate EMI using the standard reducing-balance loan formula:

```text
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
```

Where:

```text
P = Principal
r = Monthly interest rate
n = Number of monthly payments
```

The implementation belongs in:

```text
src/calculations/emi.ts
```

The UI should show:

* EMI
* Tenure
* Total repayment
* Total interest

---

# 15. Fee Calculation

Where a processing fee is applicable:

```text
Processing Fee
=
Loan Amount × Fee Rate
```

The system should clearly show:

```text
Loan Amount
+ Interest
+ Processing Fee
+ Other Known Charges
=
Approximate Total Cost
```

Unknown fees should not be invented.

---

# 16. Stress Testing

The system should run at least one stress scenario.

Prototype example:

```text
Income ↓ 10%
Interest Rate ↑ 2 percentage points
```

The exact stress assumptions are defined in:

```text
RULES.md
```

The result should be understandable.

Example:

```text
Normal EMI: ₹18,500

Stress scenario:
Income falls by 10%
Rate increases by 2%

Result:
EMI remains manageable but monthly buffer becomes tight.
```

---

# 17. Confidence

Every major result should have a confidence indicator.

Example:

```text
High Confidence
Medium Confidence
Low Confidence
```

Confidence should decrease when important information is missing or uncertain.

Examples:

* Unknown credit score
* Variable income
* Unknown expenses
* No income history
* Unknown emergency savings

Confidence is a product judgement, not a credit score.

---

# 18. Explanation Requirements

Every major number should answer:

> Why am I seeing this number?

For example:

```text
Safe EMI: ₹22,000

Why?
Your estimated monthly income is ₹1.10L,
you already pay ₹14,000 in EMI,
and the calculation keeps a buffer for
household expenses and financial shocks.
```

The deterministic explanation engine should provide the factual reasoning.

The AI assistant may then turn that reasoning into more natural, borrower-friendly language.

---

# 19. Negotiation Card

The final output must be a one-page Negotiation Card.

It should contain:

```text
BORROWER NEGOTIATION CARD

Recommended Decision
Borrow / Borrow Less / Don't Borrow

Safe Amount
₹X

Indicative Lender-Likely Amount
₹Y

Fair Rate
X% – Y%

Recommended EMI Ceiling
₹Z

Preferred Tenure
X months / years

Maximum Comfortable Tenure
X months / years

Estimated All-in Cost
₹X

Key Negotiation Points
- Ask for rate within the fair range
- Ask for processing fee disclosure
- Ask for all upfront charges
- Avoid EMI above recommended ceiling
- Prefer shorter tenure if cash flow permits

Red Flags
- Rate above fair range
- High processing fee
- Hidden charges
- EMI above safe ceiling
- Pressure to borrow more
```

The AI assistant may explain the card, but it must not change the values generated by the deterministic engine.

The card should be easy to screenshot or show to a lender.

---

# 20. UI Requirements

The interface should be:

* Simple
* Borrower-first
* Mobile-friendly
* Easy to scan
* Explanation-focused
* Low cognitive load

The assessment should use:

```text
One question
     ↓
Answer
     ↓
Next question
```

rather than displaying a large form.

---

# 21. AI Conversation UI

After the deterministic results are available, the borrower should have an optional way to ask questions.

Example:

```text
Your Result
     ↓
Ask Borrower Copilot
     ↓
"Why should I borrow less?"
     ↓
AI Explanation
```

Suggested questions may include:

```text
Why is this my safe EMI?
Why is my rate range this high?
What happens if I increase the tenure?
Why is the safe amount lower than the lender-likely amount?
What should I negotiate?
```

The AI interaction should remain secondary to the core financial result.

The main decision should never be hidden behind the chat interface.

---

# 22. Results Page

The results page should present information in this order:

```text
1. Decision
2. Borrower-safe amount
3. Lender-likely amount
4. Fair rate
5. Safe EMI
6. Tenure trade-off
7. Stress case
8. Confidence
9. Negotiation Card
10. Optional AI explanation / Q&A
```

The most important recommendation must be visible first.

---

# 23. Data Privacy

The prototype must not require:

* Login
* Account creation
* Aadhaar
* PAN
* Bank credentials
* Bureau API
* Permanent personal-data storage

The challenge expects self-reported information.

Borrower information should remain local to the current session unless explicitly required by the implementation.

If an external AI API is used, only the minimum information required for the explanation should be sent.

The product should avoid sending unnecessary personal information to an AI provider.

---

# 24. AI Usage

AI may be used during development and may assist with:

* Coding
* Debugging
* Documentation
* Test generation
* UX iteration

AI may also be used inside the product as the bounded borrower explanation assistant described in Section 5.

However, the core financial decision logic should remain:

```text
Deterministic
+
Inspectable
+
Documented
```

The AI layer must not become the source of truth for financial calculations.

---

# 25. Technical Requirements

The application should run locally.

Preferred stack:

```text
Next.js (App Router)
React
TypeScript
CSS / Tailwind
```

No backend is required for the deterministic MVP.

No database is required.

No authentication is required.

Core calculations should be implemented as reusable TypeScript functions.

If an AI API is integrated, isolate it behind a small AI service/client layer so that the core application can operate without it.

---

# 26. Architecture Requirements

The implementation should separate:

```text
UI
↓
Engine
↓
Calculations
↓
Rules
```

with the optional AI layer after the deterministic result:

```text
UI
↓
Engine
↓
Calculations
↓
Rules
↓
Structured Result
↓
AI Explanation Layer
```

Recommended structure:

```text
src/
├── components/
├── engine/
├── calculations/
├── rules/
├── types/
├── data/
├── ai/
└── tests/
```

The AI layer should not contain financial decision rules.

---

# 27. Testing Requirements

The application should test:

### Calculations

* EMI
* Total interest
* Affordability
* Loan amount
* Fees

### Decision logic

* Borrow
* Borrow Less
* Don't Borrow

### Question logic

* Required questions
* Adaptive questions
* Unknown values

### AI boundaries

* AI receives deterministic results
* AI does not calculate financial decisions
* Core results remain available if AI is unavailable
* AI does not override deterministic values

### Personas

The three challenge personas should have deterministic expected outcomes.

---

# 28. Required Run-throughs

The final implementation must demonstrate:

```text
Priya
Ravi
Anita
```

Each run-through should show:

* Questions/answers
* Decision
* Safe amount
* Lender-likely amount
* Rate band
* EMI ceiling
* Tenure trade-off
* Stress case
* Confidence
* Negotiation Card

AI explanation may be demonstrated for at least one run-through.

---

# 29. Rule Change Requirement

The system must make assumptions easy to change.

Example:

```text
Current safe FOIR:
45%

Change:
40%
```

The result should update without rewriting UI components.

Rules should therefore be centralized in:

```text
src/rules/config.ts
```

and documented in:

```text
RULES.md
```

This supports the challenge's live rule-change discussion.

The AI explanation must use the newly calculated result after the rule changes.

It must not retain or invent the old result.

---

# 30. Success Criteria

The product succeeds if a borrower can answer:

### Should I borrow?

Clearly.

### How much should I borrow?

With a safe amount and an indicative lender-likely amount.

### What rate should I accept?

With a defensible rate range.

### What EMI should I accept?

With a clear ceiling.

### What happens if things go wrong?

With an understandable stress scenario.

### What should I negotiate?

With a practical Negotiation Card.

### Why did I get this result?

With a clear deterministic explanation and, optionally, an AI-powered plain-language explanation.

---

# 31. Non-Goals

The prototype will NOT implement:

* Real lender approval
* Credit bureau integration
* Aadhaar verification
* PAN verification
* Bank-account integration
* Real loan application submission
* Loan disbursal
* Production-grade authentication
* Production database
* ML credit scoring
* Autonomous AI credit underwriting
* AI-generated financial decisions
* Large lender marketplace
* Full regulatory compliance engine

The focus is borrower decision support.

---

# 32. Definition of Done

The project is complete when:

* [ ] Application runs locally from README
* [ ] Application can be started within approximately 5 minutes
* [ ] Borrower assessment works end-to-end
* [ ] Approximately 8–10 core questions are used
* [ ] Adaptive questions work
* [ ] Unknown values are handled honestly
* [ ] Borrow / Borrow Less / Don't Borrow works
* [ ] Borrower-safe amount is calculated
* [ ] Lender-likely amount is shown separately
* [ ] Fair rate band is calculated
* [ ] All-in cost is shown
* [ ] EMI ceiling is calculated
* [ ] Tenure trade-off is shown
* [ ] Stress scenario is shown
* [ ] Confidence is shown
* [ ] Negotiation Card is generated
* [ ] Priya run-through works
* [ ] Ravi run-through works
* [ ] Anita run-through works
* [ ] Rules are documented in RULES.md
* [ ] Rule changes can be demonstrated
* [ ] Core calculations have tests
* [ ] AI explanation layer works if enabled
* [ ] AI cannot override deterministic financial results
* [ ] Core application still works when AI is unavailable
* [ ] No unnecessary login/backend/database exists
* [ ] No personal data is permanently stored

---

# 33. Product Principle

The central principle of Borrower Copilot is:

> **The goal is not to help the borrower get the biggest loan. The goal is to help the borrower make the safest informed borrowing decision.**

AI supports this principle by making the result easier to understand — **not by making the financial decision itself.**

```
```
