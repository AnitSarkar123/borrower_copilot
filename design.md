

# Borrower Copilot — UI/UX Design Specification

## 1. Design Goal

Borrower Copilot should feel like a **trusted financial guide**, not a loan-sales form.

The experience should help a borrower understand:

- Whether borrowing is sensible
- How much they can safely borrow
- What rate is reasonable
- What EMI they should accept
- What happens if their financial situation worsens
- What they should negotiate with a lender

The design should prioritize **clarity, transparency, and decision support** over visual complexity.

---

# 2. Design Principles

## 2.1 Borrower First

The product should optimize for the borrower's financial safety.

It should never feel like the application is trying to maximize the loan amount.

---

## 2.2 One Question at a Time

The assessment should avoid a large traditional form.

Preferred flow:

```text
Question
   ↓
Answer
   ↓
Next
   ↓
Question
````

This keeps the cognitive load low.

---

## 2.3 Explain Every Important Number

Important results should have a visible explanation.

Example:

```text
Safe EMI
₹15,000 / month

Why?
Your income, existing EMI and household expenses
leave room for this monthly repayment while
maintaining a safety buffer.
```

The user should not have to understand financial formulas to understand the recommendation.

---

## 2.4 Be Honest About Uncertainty

If information is unknown:

```text
Unknown
```

should remain unknown.

The UI should communicate uncertainty through:

* Wider ranges
* Lower confidence
* Clear explanations

Never display false precision.

---

## 2.5 Separate Safe From Possible

The interface must clearly distinguish:

```text
Borrower-safe amount
```

from:

```text
Indicative lender-likely amount
```

The safe amount should receive greater visual emphasis.

---

# 3. Overall User Journey

```text
Landing
   ↓
Start Assessment
   ↓
Questionnaire
   ↓
Adaptive Questions
   ↓
Review
   ↓
Analysis
   ↓
Results
   ↓
Negotiation Card
   ↓
Optional AI Q&A
```

---

# 4. Screen 1 — Landing Page

## Purpose

Explain the product in a few seconds and encourage the borrower to begin.

### Content

```text
Borrower Copilot

Know what you can safely borrow
before you accept a loan.

We help you understand:
• Whether you should borrow
• A safer borrowing amount
• A fair rate range
• An EMI you can afford
• What to negotiate

[ Start Assessment ]
```

### Supporting text

```text
No login.
No credit-bureau pull.
Uses information you provide.
```

Avoid unnecessary marketing claims.

---

# 5. Screen 2 — Assessment Introduction

Before asking questions, briefly explain the process.

```text
Let's understand your borrowing situation.

This takes around 8–10 questions.

We'll look at:
✓ Affordability
✓ Existing debt
✓ Loan cost
✓ Stress scenarios
✓ Borrowing options

You can say "I don't know" when you're unsure.
```

CTA:

```text
[ Continue ]
```

---

# 6. Questionnaire Design

## Layout

Each question should occupy most of the screen.

```text
┌──────────────────────────────┐
│  Question 4 of 9             │
│  ███████████░░░░░            │
│                              │
│  What is your monthly        │
│  take-home income?           │
│                              │
│  ₹                           │
│  ┌────────────────────────┐  │
│  │ 1,10,000               │  │
│  └────────────────────────┘  │
│                              │
│  This means income after     │
│  deductions.                │
│                              │
│             [ Continue ]     │
└──────────────────────────────┘
```

---

# 7. Question Types

Use the simplest input appropriate for the question.

### Currency

```text
₹ [ 1,10,000 ]
```

### Number

```text
[ 29 ]
```

### Choice

```text
○ Salaried
○ Self-employed
○ Informal / variable income
```

### Range

```text
₹40,000 ───────── ₹80,000
```

### Unknown

For information that may not be known:

```text
[ I don't know ]
```

Unknown should be a first-class answer.

---

# 8. Progress Indicator

Show progress without making the assessment feel long.

Example:

```text
Question 5 of 9
███████████░░░░
```

If adaptive questions are added, avoid promising an exact final number if it may change.

Instead:

```text
About halfway there
```

can be used when the final question count is dynamic.

---

# 9. Navigation

Provide:

```text
[ ← Back ]                     [ Continue → ]
```

The user should be able to revisit previous answers.

If a previous answer changes the path:

```text
Income type changed
      ↓
Relevant adaptive questions update
```

---

# 10. Adaptive Question Experience

The application should not ask every borrower the same questions.

Example:

```text
Income Type
     ↓
Salaried
     ↓
Ask employment stability

Self-employed
     ↓
Ask business history / documented income

Variable income
     ↓
Ask income range / variability
```

The transition should feel natural.

Avoid explaining the internal decision tree to the user.

---

# 11. Review Screen

Before calculating the result, show a concise summary.

```text
Review your information

Income
₹1,10,000 / month

Existing EMI
₹14,000 / month

Household expenses
₹28,000 / month

Requested loan
₹8,00,000

Purpose
Wedding

Credit score
780

[ Edit answers ]

[ Calculate my borrowing position ]
```

This gives the borrower a chance to catch mistakes.

---

# 12. Calculation State

The calculation stage should be brief.

Example:

```text
Analyzing your borrowing position...

Checking affordability
✓

Estimating safe borrowing amount
✓

Estimating rate range
✓

Testing repayment stress
✓
```

Avoid fake long-running animations.

The analysis should complete quickly.

---

# 13. Results Page

The results page is the most important screen.

The top should immediately communicate the decision.

```text
Your borrowing result

BORROW LESS

Your requested ₹8L loan is higher than
the amount we estimate you can comfortably
repay.

Recommended safe amount
₹6.5L
```

The user should not need to scroll to understand the main recommendation.

---

# 14. Verdict Card

The verdict card should visually distinguish the three possible outcomes.

### Borrow

```text
BORROW

Your requested borrowing appears
manageable under the assumptions used.
```

### Borrow Less

```text
BORROW LESS

A smaller loan gives you a healthier
monthly repayment buffer.
```

### Don't Borrow

```text
DON'T BORROW

The proposed repayment would put
too much pressure on your current
cash flow.
```

Do not use color alone to communicate the outcome.

Include text and an icon/label.

---

# 15. Amount Card

Show both amounts together.

```text
How much?

Recommended safe amount
₹6.5L

Indicative lender-likely amount
₹7.2L

Why the difference?

A lender may consider a higher amount,
but the safer amount leaves more room
in your monthly budget.

⚠ Lender-likely is not an approval.
```

The safe amount should have stronger visual hierarchy.

---

# 16. Fair Rate Card

Example:

```text
Fair rate range

11.5% – 13.5%

Expected range based on:
• Loan type
• Credit profile
• Income stability
• Existing obligations

Your rate may differ by lender.

[ Why this range? ]
```

Never display:

```text
12.47%
```

as though the application knows the exact rate a lender will offer.

---

# 17. Cost Card

The borrower should see the difference between rate and total cost.

```text
What will this loan really cost?

Interest rate
12.0%

Processing fee
₹8,000

Estimated total interest
₹1,18,000

Estimated total repayment
₹7,68,000

Estimated all-in cost
See assumptions
```

The terminology should remain honest about whether the figure is an estimate.

---

# 18. EMI Card

The EMI card should be prominent.

```text
Your EMI ceiling

₹15,000 / month

Try not to agree to an EMI above this
without reassessing your budget.

Current example:
₹6.5L
at 12%
for 5 years

EMI ≈ ₹14,500
```

Include:

```text
[ Compare tenures ]
```

when useful.

---

# 19. Tenure Comparison

Allow the borrower to understand the trade-off.

Example:

```text
Choose your tenure

3 years
EMI: ₹21,600
Total interest: ₹1.28L

5 years
EMI: ₹14,500
Total interest: ₹2.20L

Longer tenure:
↓ EMI
↑ Total interest
```

The preferred option should be highlighted based on the borrower's affordability.

---

# 20. Stress Card

The stress result should be understandable without technical knowledge.

```text
What if things get worse?

Stress scenario
Income falls by 10%
Rate increases by 2%

Normal
Monthly buffer: ₹18,000

Stress
Monthly buffer: ₹9,000

Result:
⚠ Repayment becomes tighter
```

Clearly label stress assumptions as prototype assumptions where applicable.

---

# 21. Confidence Card

Example:

```text
Confidence

MEDIUM

Why?

Your income and existing EMI are known,
but some information about your expenses
is uncertain.

Providing more information could narrow
the recommendation range.
```

Avoid making confidence look like a credit score.

---

# 22. Explanation Sections

Every result card should provide a way to understand the reasoning.

Possible interaction:

```text
Why am I seeing this?
        ↓
Expand
        ↓
Explanation
```

Keep explanations short by default.

Allow more detail through an expandable section.

---

# 23. AI Assistant

The AI assistant should appear **after the deterministic result is available**.

It should not replace the results page.

Example:

```text
┌──────────────────────────────────┐
│ Ask Borrower Copilot             │
│                                  │
│ Why should I borrow less?        │
│                                  │
│ [ Ask a question...          ]   │
│                                  │
│ Suggested:                       │
│ • Why is my EMI capped?          │
│ • Why is my rate range high?     │
│ • What should I negotiate?       │
└──────────────────────────────────┘
```

---

# 24. AI Interaction Rules

The AI should explain the **already-calculated result**.

Example:

```text
Deterministic Result
       ↓
AI
       ↓
Plain-language explanation
```

The AI must not:

```text
User question
      ↓
LLM decides loan amount
```

The financial engine remains the source of truth.

---

# 25. AI Example

### User

> Why is my safe amount only ₹6.5L?

### AI

> Your safe amount is lower than your requested ₹8L because the calculation considers your existing EMI, household expenses, and a monthly safety buffer. A ₹6.5L loan keeps the expected repayment closer to the amount your current cash flow can comfortably support.

The AI should use the actual structured result rather than inventing numbers.

---

# 26. AI Error State

If AI is unavailable:

```text
Borrower Copilot explanations are
temporarily unavailable.

Your financial analysis is still available
below.
```

The following must remain functional:

```text
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

# 27. Negotiation Card

The Negotiation Card should be visually distinct.

```text
┌──────────────────────────────────────┐
│        BORROWER NEGOTIATION CARD     │
│                                      │
│ Decision                             │
│ BORROW LESS                          │
│                                      │
│ Safe amount                          │
│ ₹6.5L                                │
│                                      │
│ Fair rate                            │
│ 11.5% – 13.5%                        │
│                                      │
│ EMI ceiling                          │
│ ₹15,000/month                        │
│                                      │
│ Preferred tenure                     │
│ 5 years                              │
│                                      │
│ ASK THE LENDER                       │
│ • Quote the interest rate            │
│ • Disclose processing fee            │
│ • Disclose all upfront charges       │
│ • Keep EMI within ₹15,000            │
│                                      │
│ RED FLAGS                            │
│ • Rate materially above range        │
│ • High processing fee                │
│ • Hidden charges                     │
│ • Pressure to borrow more            │
└──────────────────────────────────────┘
```

---

# 28. Negotiation Card Actions

Provide simple actions such as:

```text
[ Copy ]
[ Share ]
```

If implemented, screenshot-friendly styling should be prioritized.

Do not build a complicated document-generation system.

---

# 29. Mobile Design

The primary experience should work well on mobile.

Recommended:

```text
max-width: 720px
margin: auto
padding: 16px–24px
```

Cards should stack vertically.

Avoid wide tables on small screens.

---

# 30. Desktop Design

On desktop, maintain a narrow borrower-focused reading width.

Possible layout:

```text
┌──────────────────────────────────────────┐
│ Header                                   │
├──────────────────────────────────────────┤
│                                          │
│        Main Borrower Content             │
│                                          │
│   Question / Result / Negotiation Card   │
│                                          │
└──────────────────────────────────────────┘
```

Avoid filling the entire screen with dashboards.

---

# 31. Typography

Use a clean sans-serif font.

Hierarchy:

```text
Page title
    ↓
Section heading
    ↓
Result number
    ↓
Supporting explanation
    ↓
Assumption/detail
```

Important numbers should be visually prominent.

Example:

```text
₹15,000
/month
```

rather than burying the amount in a paragraph.

---

# 32. Color Usage

Use color semantically.

Possible meaning:

```text
Positive
→ Borrow appears manageable

Warning
→ Borrow Less / repayment becoming tight

Negative
→ Don't Borrow / high financial pressure

Neutral
→ Information / assumptions
```

Do not rely solely on color.

Every important state should also have:

* Text label
* Icon where useful
* Explanation

---

# 33. Assumptions

Provide an expandable assumptions section.

Example:

```text
Assumptions
⌄

FOIR limit
45%
Prototype judgement

Stress income reduction
10%
Prototype judgement

Stress rate increase
+2 percentage points
Prototype judgement

These assumptions are not lender approval criteria.
```

This supports transparency and the review discussion.

---

# 34. Source / Rule Visibility

Where a financial assumption has a source, show it appropriately.

Where it is a product judgement, say:

```text
Product judgement
```

Do not create fake citations.

The complete rule documentation remains in:

```text
RULES.md
```

---

# 35. Accessibility

The interface should support:

* Keyboard navigation
* Visible focus states
* Proper labels
* Semantic buttons
* Sufficient text contrast
* Error messages next to relevant inputs
* Clear units for currency and percentages

Do not make critical information dependent only on color.

---

# 36. Error Handling

Validation errors should be simple.

Example:

```text
Please enter your monthly income.
```

For invalid values:

```text
Please enter an amount greater than ₹0.
```

Do not expose technical errors such as:

```text
TypeError: Cannot read properties of undefined
```

to the borrower.

---

# 37. Empty / Unknown States

Example:

```text
Credit score

I don't know
```

Result:

```text
Credit score
Unknown

Your rate range is wider because this
information wasn't available.
```

This is preferable to forcing the user to enter a guessed number.

---

# 38. Loading States

Loading should be used only when needed.

Questionnaire:

```text
Instant transition
```

Financial calculation:

```text
Calculating your position...
```

AI:

```text
Borrower Copilot is thinking...
```

Avoid artificial delays.

---

# 39. Responsive Result Structure

Desktop:

```text
Decision
    ↓
Amount + Rate
    ↓
EMI + Tenure
    ↓
Stress + Confidence
    ↓
Negotiation Card
    ↓
AI Assistant
```

Mobile:

```text
Decision
↓
Safe Amount
↓
Lender-Likely Amount
↓
Rate
↓
EMI
↓
Tenure
↓
Stress
↓
Confidence
↓
Negotiation Card
↓
AI Assistant
```

---

# 40. Component Mapping

The UI should map to the project architecture.

```text
components/
├── questionnaire/
│   ├── QuestionCard.tsx
│   ├── ProgressBar.tsx
│   └── QuestionRenderer.tsx
│
├── results/
│   ├── VerdictCard.tsx
│   ├── AmountCard.tsx
│   ├── RateCard.tsx
│   ├── EmiCard.tsx
│   ├── StressCard.tsx
│   └── ConfidenceBadge.tsx
│
└── negotiation/
    └── NegotiationCard.tsx
```

AI UI may be added as:

```text
components/
└── ai/
    └── BorrowerAssistant.tsx
```

The AI component should only handle the conversation UI.

It should not contain financial calculations.

---

# 41. AI Data Flow

The intended flow is:

```text
User Answers
     ↓
Question Engine
     ↓
Decision Engine
     ↓
Calculations
     ↓
Structured Result
     ↓
Results UI
     ↓
Optional AI Assistant
```

The AI receives the relevant structured result.

It does not independently recalculate the loan.

---

# 42. Security / Privacy UX

Do not ask for:

```text
Aadhaar
PAN
Bank password
Bank account credentials
```

The landing page should reinforce:

```text
No login
No bureau pull
Self-reported information
```

If an external AI service is used, the application should minimize the information sent to that service.

---

# 43. Visual Priority

The visual hierarchy should follow:

```text
1. Decision
2. Safe amount
3. EMI ceiling
4. Fair rate
5. Lender-likely amount
6. Tenure trade-off
7. Stress
8. Confidence
9. Negotiation Card
10. AI Assistant
```

The AI assistant should not visually overpower the financial result.

---

# 44. What Not to Build

Avoid:

* Complex dashboards
* Large financial charts
* Excessive animations
* Multi-page onboarding
* Login screens
* Account management
* Admin panels
* Lender dashboards
* Complex chat-first interfaces
* Fake real-time lender approval
* Unnecessary graphs
* Overly decorative UI

The goal is a focused borrower decision tool.

---

# 45. Core UX Principle

The product should make the borrower feel:

> **"I understand what I can afford, what I should negotiate, and what could go wrong before I take this loan."**

Not:

> "This app convinced me to take a loan."

```
```
