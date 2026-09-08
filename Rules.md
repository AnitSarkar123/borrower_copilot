## Borrower Copilot — Rules, Thresholds & Assumptions

**Version:** 1.0
**Purpose:** Single source of truth for the deterministic lending rules, thresholds, bands, assumptions, calculations, confidence rules, and decision logic used by Borrower Copilot.

> **Important:** Borrower Copilot is a borrower self-assessment and negotiation-support tool. It is **not** a lender underwriting engine and does not guarantee loan approval, eligibility, pricing, or sanction.

---

## 1. Rule Design Principles

| What                 | Value                                           | Why                                                              | Source          |
| -------------------- | ----------------------------------------------- | ---------------------------------------------------------------- | --------------- |
| Unknown information  | Never treat as zero                             | Prevents false affordability calculations                        | Challenge brief |
| Missing information  | Widen estimate/range                            | Less information means less certainty                            | Challenge brief |
| Required questions   | Approximately 8–10                              | Keep the initial flow short while collecting enough information  | Challenge brief |
| Additional questions | Only ask if they change an output               | Prevents unnecessary questioning                                 | Challenge brief |
| Borrowing verdict    | Borrow / Borrow Less / Don't Borrow             | Borrower must have a genuine non-borrowing option                | Challenge brief |
| Amount               | Show lender-likely and borrower-safe separately | A lender may sanction more than is financially safe              | Challenge brief |
| Interest rate        | Show a band, not a point estimate               | Avoid false precision                                            | Challenge brief |
| Cost                 | Include processing fee/all-in cost              | Headline interest rate alone can be misleading                   | Challenge brief |
| Stress test          | Income/rate stress scenario                     | Shows whether the loan remains affordable when conditions worsen | Challenge brief |
| Explanation          | Every major number has a reason                 | Makes the output understandable and defensible                   | Challenge brief |
| Rules                | Separate from UI                                | Makes assumptions easy to inspect and change                     | Challenge brief |

The challenge explicitly asks for a borrower-facing system rather than a traditional credit-scoring or lender-underwriting model.

---

# 2. Input Rules

## R-001 — Must-Have Questions

The application should collect approximately **8–10 must-have questions**.

The minimum information should cover:

| What               | Value             | Why                                                       | Source          |
| ------------------ | ----------------- | --------------------------------------------------------- | --------------- |
| Loan purpose       | Required          | Determines suitability/context                            | Challenge brief |
| Amount requested   | Required          | Needed for affordability comparison                       | Challenge brief |
| Loan type          | Required          | Determines applicable product assumptions                 | Challenge brief |
| Net monthly income | Required          | Core affordability input                                  | Challenge brief |
| Income type        | Required          | Determines income stability and affordability assumptions | Challenge brief |
| Existing EMIs      | Required          | Determines current debt burden                            | Challenge brief |
| Household expenses | Required          | Determines disposable income                              | Challenge brief |
| Age                | Required          | Relevant to tenure/context                                | Challenge brief |
| Credit score       | Optional if known | Helps estimate rate range                                 | Challenge brief |
| Income stability   | Conditional       | Improves confidence                                       | Challenge brief |
| Emergency savings  | Conditional       | Helps evaluate resilience                                 | Challenge brief |
| Existing loans     | Conditional       | Helps detect debt stress                                  | Challenge brief |
| Collateral         | Conditional       | Helps route to secured products                           | Challenge brief |

---

## R-002 — Unknown Is Never Zero

If a borrower does not know a value, the application must represent it as `unknown`.

```text
Unknown credit score ≠ 0
Unknown expenses ≠ ₹0
Unknown savings ≠ ₹0
Unknown income variability ≠ 0%
```

| What          | Value                 | Why                                                             | Source          |
| ------------- | --------------------- | --------------------------------------------------------------- | --------------- |
| Unknown value | Preserve as `unknown` | Prevents the system from creating artificial financial capacity | Challenge brief |

---

## R-003 — Missing Information Must Widen Uncertainty

If an important input is missing:

```text
Missing information
        ↓
Lower confidence
        ↓
Wider estimate/range
        ↓
Explain uncertainty
```

The application must **not** become more confident merely because information is missing.

| What                | Value                           | Why                                          | Source          |
| ------------------- | ------------------------------- | -------------------------------------------- | --------------- |
| Missing information | Wider ranges + lower confidence | Confidence should reflect available evidence | Challenge brief |

---

# 3. Borrower Classification

## R-004 — Income Type Classification

Borrowers are classified into three broad groups:

| Income Type         | Examples                                  | Why                                            |
| ------------------- | ----------------------------------------- | ---------------------------------------------- |
| Salaried            | Regular employee income                   | Generally easier to establish recurring income |
| Self-employed       | Business owner/professional               | Income may vary and documentation may differ   |
| Informal / variable | Gig worker, cash income, irregular income | Greater uncertainty in income stability        |

This classification affects:

* Additional questions
* Affordability assumptions
* Income stability
* Confidence
* Product routing

| What                  | Value                                        | Why                                 | Source                         |
| --------------------- | -------------------------------------------- | ----------------------------------- | ------------------------------ |
| Income classification | Salaried / Self-employed / Informal-variable | Required for adaptive decision flow | Challenge brief + my judgement |

---

# 4. FOIR-Based Affordability

## R-005 — FOIR Formula

Borrower Copilot uses a **FOIR-style affordability calculation**.

```text
FOIR =
(Existing EMIs + Proposed EMI)
--------------------------------
      Net Monthly Income
```

Example:

```text
Existing EMI = ₹14,000
Proposed EMI = ₹20,000
Net income = ₹1,00,000

FOIR = (14,000 + 20,000) / 1,00,000
     = 34%
```

| What | Value                                                 | Why                                          | Source                                |
| ---- | ----------------------------------------------------- | -------------------------------------------- | ------------------------------------- |
| FOIR | `(Existing EMIs + Proposed EMI) / Net Monthly Income` | Measures debt obligations relative to income | My judgement / FOIR-style methodology |

> The challenge asks for **FOIR-style affordability**. It does not provide a single official FOIR threshold that must be used. Therefore the thresholds below are prototype assumptions.

---

## R-006 — Target FOIR Limits

The prototype uses:

| Income Type         | Maximum Target FOIR | Source       |
| ------------------- | ------------------: | ------------ |
| Salaried            |                 45% | My judgement |
| Self-employed       |                 40% | My judgement |
| Informal / variable |                 35% | My judgement |

These values are **not presented as universal lender rules**.

They are conservative prototype assumptions intended to prioritize borrower safety.

---

## R-007 — FOIR-Based EMI Capacity

The maximum proposed EMI based on the target FOIR is:

```text
FOIR EMI Capacity =
(Net Monthly Income × FOIR Limit)
− Existing EMIs
```

Example:

```text
Net income = ₹1,10,000
FOIR limit = 45%
Existing EMI = ₹14,000

FOIR EMI Capacity
= (₹1,10,000 × 0.45) − ₹14,000
= ₹35,500
```

| What              | Value                                   | Why                                                             | Source                       |
| ----------------- | --------------------------------------- | --------------------------------------------------------------- | ---------------------------- |
| FOIR EMI capacity | `(Income × FOIR limit) − Existing EMIs` | Determines proposed EMI capacity under the assumed FOIR ceiling | Derived from R-005 and R-006 |

---

# 5. Disposable Income

## R-008 — Disposable Income

The application calculates:

```text
Disposable Income =
Net Monthly Income
− Household Expenses
− Existing EMIs
```

Example:

```text
Income = ₹1,10,000
Household expenses = ₹28,000
Existing EMIs = ₹14,000

Disposable Income
= ₹1,10,000 − ₹28,000 − ₹14,000
= ₹68,000
```

| What              | Value                                       | Why                                           | Source                                            |
| ----------------- | ------------------------------------------- | --------------------------------------------- | ------------------------------------------------- |
| Disposable income | Income − household expenses − existing EMIs | Shows cash remaining before the proposed loan | My judgement / standard affordability calculation |

---

## R-009 — Disposable-Income EMI Buffer

The application should not assume that the borrower can use 100% of disposable income for a new EMI.

The prototype reserves **20%** as a basic buffer.

```text
Disposable-Based EMI Capacity =
Disposable Income × 80%
```

Example:

```text
Disposable income = ₹68,000

Disposable-based EMI capacity
= ₹68,000 × 0.80
= ₹54,400
```

| What                         | Value | Why                          | Source       |
| ---------------------------- | ----: | ---------------------------- | ------------ |
| Disposable income allocation |   80% | Preserves a basic 20% buffer | My judgement |

---

## R-010 — Borrower-Safe EMI Ceiling

The borrower-safe EMI is the lower of:

```text
Safe EMI =
MIN(
    FOIR EMI Capacity,
    Disposable-Based EMI Capacity
)
```

Example:

```text
FOIR EMI capacity = ₹35,500
Disposable-based EMI capacity = ₹54,400

Safe EMI = MIN(₹35,500, ₹54,400)

Safe EMI = ₹35,500
```

| What     | Value                                                  | Why                                                                    | Source       |
| -------- | ------------------------------------------------------ | ---------------------------------------------------------------------- | ------------ |
| Safe EMI | Minimum of FOIR capacity and disposable-based capacity | Prevents one metric from producing an overly aggressive recommendation | My judgement |

---

# 6. Lender-Likely vs Borrower-Safe Amount

## R-011 — Keep Two Amounts Separate

The system must show two different concepts:

### Lender-Likely Sanction

An estimate of what could potentially fit within the assumed lender-style affordability constraints.

### Borrower-Safe Amount

The amount that the borrower can reasonably afford under the application's safety rules.

These must **not** be merged into one number.

| What                 | Value             | Why                                           | Source          |
| -------------------- | ----------------- | --------------------------------------------- | --------------- |
| Lender-likely amount | Separate estimate | Represents possible lender-side affordability | Challenge brief |
| Borrower-safe amount | Separate estimate | Represents borrower-side financial safety     | Challenge brief |

---

## R-012 — Lender-Likely EMI

For the prototype:

```text
Lender-Likely EMI Capacity =
(Net Monthly Income × FOIR Limit)
− Existing EMIs
```

This is only an estimate.

It does **not** mean a lender will actually approve that EMI or loan amount.

| What                       | Value               | Why                                                               | Source       |
| -------------------------- | ------------------- | ----------------------------------------------------------------- | ------------ |
| Lender-likely EMI capacity | FOIR-based capacity | Gives the borrower a separate lender-side affordability reference | My judgement |

---

## R-013 — Borrower-Safe EMI

The borrower-safe EMI is:

```text
Borrower-Safe EMI =
MIN(
    FOIR EMI Capacity,
    Disposable-Based EMI Capacity
)
```

This may be lower than the lender-likely capacity.

---

## R-014 — Recommended Maximum Amount

The recommended maximum loan amount is:

```text
Recommended Maximum Amount =
MIN(
    Lender-Likely Amount,
    Borrower-Safe Amount
)
```

The borrower should generally use the safer number rather than attempting to maximize the lender's possible sanction.

| What               | Value                                              | Why                                                      | Source       |
| ------------------ | -------------------------------------------------- | -------------------------------------------------------- | ------------ |
| Recommended amount | Minimum of lender-likely and borrower-safe amounts | Prevents lender capacity from overriding borrower safety | My judgement |

---

# 7. EMI Calculation

## R-015 — Standard EMI Formula

For a reducing-balance loan:

```text
                 P × r × (1 + r)^n
EMI = -----------------------------------------
             (1 + r)^n − 1
```

Where:

```text
P = Principal / loan amount
r = Monthly interest rate
n = Number of monthly instalments
```

| What        | Value                           | Why                                       | Source                    |
| ----------- | ------------------------------- | ----------------------------------------- | ------------------------- |
| EMI formula | `P × r × (1+r)^n / ((1+r)^n−1)` | Standard reducing-balance EMI calculation | Standard loan mathematics |

---

## R-016 — Monthly Interest Rate

Annual interest rate must be converted into a monthly rate:

```text
r = Annual Interest Rate / 12
```

Example:

```text
Annual rate = 12%

r = 12% / 12
  = 1%
  = 0.01
```

---

## R-017 — Loan Amount Supported by EMI

To calculate the principal supported by an affordable EMI:

```text
                   EMI × ((1 + r)^n − 1)
P = ------------------------------------------------
                     r × (1 + r)^n
```

Where:

```text
P   = Supported principal
EMI = Maximum affordable EMI
r   = Monthly interest rate
n   = Number of monthly instalments
```

| What                        | Value               | Why                                                              | Source             |
| --------------------------- | ------------------- | ---------------------------------------------------------------- | ------------------ |
| Maximum supported principal | Inverse EMI formula | Converts affordable monthly outflow into approximate loan amount | Derived from R-015 |

---

# 8. Tenure Rules

## R-018 — Indicative Maximum Tenures

The prototype uses the following indicative maximum tenures:

| Product                    | Maximum Tenure | Source       |
| -------------------------- | -------------: | ------------ |
| Personal Loan              |        5 years | My judgement |
| Two-Wheeler / Vehicle Loan |        7 years | My judgement |
| Home Loan                  |       30 years | My judgement |
| Loan Against Property      |       15 years | My judgement |
| Business Loan              |       10 years | My judgement |
| Gold Loan                  |        3 years | My judgement |

These are **prototype assumptions**, not guaranteed lender terms.

---

## R-019 — Tenure Trade-Off

The application must show the trade-off:

```text
Longer tenure
      ↓
Lower monthly EMI
      ↓
Higher total interest
```

Therefore, the application should show multiple tenure scenarios where useful instead of automatically recommending the longest possible tenure.

| What             | Value                                                  | Why                                     | Source                    |
| ---------------- | ------------------------------------------------------ | --------------------------------------- | ------------------------- |
| Tenure trade-off | Longer tenure reduces EMI but increases total interest | Helps borrower understand the real cost | Standard loan mathematics |

---

# 9. Interest Rate Bands

## R-020 — Personal Loan Rate Bands

The prototype uses these indicative borrower-facing bands:

| Credit Profile | Indicative Fair Rate | Source       |
| -------------- | -------------------: | ------------ |
| Excellent      |             10–11.5% | My judgement |
| Very Good      |             11–12.5% | My judgement |
| Good           |               12–14% | My judgement |
| Moderate       |               14–17% | My judgement |
| Higher Risk    |               18–24% | My judgement |
| Unknown        |          Wider range | My judgement |

These are **not guaranteed lender offers**.

---

## R-021 — Home Loan Rate Bands

| Profile | Indicative Fair Rate | Source       |
| ------- | -------------------: | ------------ |
| Strong  |             7.9–8.8% | My judgement |
| Average |             8.8–9.8% | My judgement |

---

## R-022 — Gold Loan Rate Band

```text
8–11%
```

| What                                 | Value | Why                                  | Source       |
| ------------------------------------ | ----: | ------------------------------------ | ------------ |
| Indicative gold-loan fair-rate range | 8–11% | Provides a borrower comparison range | My judgement |

---

## R-023 — Loan Against Property Rate Band

```text
9.5–12%
```

| What                           |   Value | Why                                | Source       |
| ------------------------------ | ------: | ---------------------------------- | ------------ |
| Indicative LAP fair-rate range | 9.5–12% | Provides borrower comparison range | My judgement |

---

## R-024 — Business Loan Rate Band

```text
11–16%
```

| What                                     |  Value | Why                                | Source       |
| ---------------------------------------- | -----: | ---------------------------------- | ------------ |
| Indicative business-loan fair-rate range | 11–16% | Provides borrower comparison range | My judgement |

---

# 10. Credit Score Rules

## R-025 — Credit Score Segmentation

| Credit Score | Profile     | Source                             |
| -----------: | ----------- | ---------------------------------- |
|         800+ | Excellent   | My judgement                       |
|      750–799 | Very Good   | My judgement                       |
|      700–749 | Good        | My judgement                       |
|      650–699 | Moderate    | My judgement                       |
|         <650 | Higher Risk | My judgement                       |
|      Unknown | Unknown     | Challenge principle + my judgement |

These bands are used only for indicative pricing/context.

They are not official lender underwriting thresholds.

---

## R-026 — Unknown Credit Score

If the borrower does not know their credit score:

```text
Credit Score = UNKNOWN
```

Do not assume:

```text
Unknown = Poor
```

Instead:

```text
Unknown score
      ↓
Lower confidence
      ↓
Wider rate range
```

| What                 | Value             | Why                              | Source          |
| -------------------- | ----------------- | -------------------------------- | --------------- |
| Unknown credit score | Unknown, not poor | Prevents unsupported assumptions | Challenge brief |

---

# 11. Fees and All-In Cost

## R-027 — Processing Fees Must Be Visible

The application should display known processing fees separately from the headline interest rate.

```text
Loan Amount
+
Interest Cost
+
Processing Fee
+
Other Known Charges
=
Total Borrowing Cost
```

The exact calculation should only include charges that are actually known or explicitly assumed.

| What           | Value              | Why                                               | Source          |
| -------------- | ------------------ | ------------------------------------------------- | --------------- |
| Processing fee | Display separately | Headline interest rate does not capture all costs | Challenge brief |

---

## R-028 — Processing Fee Percentage

```text
Processing Fee Rate =
Processing Fee
------------------
  Loan Amount
```

Example:

```text
Loan Amount = ₹5,00,000
Processing Fee = ₹10,000

Processing Fee Rate
= ₹10,000 / ₹5,00,000
= 2%
```

---

## R-029 — Estimated APR / All-In Comparison

For the prototype, a simplified annualized comparison metric may be used:

```text
Estimated APR ≈
Interest Rate
+
(Processing Fee / Loan Amount)
×
(12 / Tenure in Months)
```

This is an **estimated comparison metric**, not a claim that it is a legally/regulatorily calculated APR.

The UI should therefore use:

```text
Estimated APR
```

or:

```text
Estimated All-In Cost
```

when using this simplified calculation.

| What               | Value                            | Why                                                            | Source       |
| ------------------ | -------------------------------- | -------------------------------------------------------------- | ------------ |
| Estimated APR      | Simplified annualized comparison | Allows headline rate + fee to be compared                      | My judgement |
| Official APR claim | Not allowed                      | Simplified calculation is not a full regulated APR methodology | My judgement |

---

## R-030 — Lender Quote Comparison

If the borrower provides a lender quote, compare:

```text
Lender Quote
      ↓
Fair Rate Band
      +
Processing Fee
      +
Estimated All-In Cost
      +
EMI
```

A lower headline interest rate does **not** automatically mean the loan is cheaper.

---

# 12. Borrowing Verdict

## R-031 — BORROW

The system may return:

```text
BORROW
```

when:

* Proposed borrowing fits within the borrower-safe affordability limit.
* There is no severe debt-distress signal.
* The borrower remains reasonably resilient under the stated assumptions.
* The product is suitable for the stated purpose.

The application must still show the assumptions behind the decision.

---

## R-032 — BORROW LESS

The system should return:

```text
BORROW LESS
```

when:

```text
Requested Amount > Borrower-Safe Amount
```

but a smaller amount can fit within the borrower's safe affordability.

The app should show:

```text
Requested: ₹X
Safer amount: ₹Y
```

and explain why.

---

## R-033 — DON'T BORROW

The system should return:

```text
DON'T BORROW
```

when the available information indicates that additional borrowing is not currently defensible.

Potential triggers include:

| Trigger                                  | Action                     |
| ---------------------------------------- | -------------------------- |
| Proposed EMI exceeds safe capacity       | Don't Borrow / Borrow Less |
| Disposable income is negative            | Don't Borrow               |
| Severe existing high-cost debt           | Don't Borrow               |
| Recent repayment failure + weak capacity | Don't Borrow               |
| Severe income instability + no buffer    | Don't Borrow               |
| Clear debt spiral                        | Don't Borrow               |

The system should show the **specific reason**, not just the verdict.

---

# 13. Debt Stress

## R-034 — High-Cost Debt Signals

The following are treated as debt-stress signals:

* Multiple short-term/app loans.
* Very high existing interest rates.
* Recent EMI bounce.
* Borrowing to repay existing borrowing.
* Increasing total debt obligations despite insufficient income.

A single signal should not automatically determine the verdict unless it represents severe distress.

The system should evaluate:

```text
Existing Debt
+
Existing EMI
+
Income
+
Expenses
+
Repayment History
+
New Loan
```

---

## R-035 — Debt Spiral Detection

If the borrower appears to be using additional debt primarily to service existing expensive debt:

```text
Existing expensive debt
        +
New borrowing for repayment
        ↓
Potential debt spiral
        ↓
DON'T BORROW
```

This is a borrower-safety rule.

| What        | Value                         | Why                                                        | Source       |
| ----------- | ----------------------------- | ---------------------------------------------------------- | ------------ |
| Debt spiral | Strong warning / Don't Borrow | Prevents new borrowing from worsening existing debt stress | My judgement |

---

# 14. Secured vs Unsecured Product Routing

## R-036 — Secured Product Routing

If a borrower has meaningful unencumbered collateral and requires a substantial amount, the application should consider a secured product.

Example:

```text
Established business
+
Meaningful collateral
+
Large borrowing requirement
```

may lead to:

```text
Consider Loan Against Property
```

rather than automatically treating the request as an unsecured personal loan.

The challenge specifically expects Ravi to be routed toward a secured product.

| What                                                        | Value                    | Why                                              | Source          |
| ----------------------------------------------------------- | ------------------------ | ------------------------------------------------ | --------------- |
| Established business + collateral + substantial requirement | Consider secured lending | May provide a more appropriate product structure | Challenge brief |

---

## R-037 — Product Suitability

Product selection considers:

```text
Purpose
+
Amount
+
Income Type
+
Existing Debt
+
Collateral
+
Repayment Capacity
```

The application should not recommend a product solely because it has the lowest headline interest rate.

---

# 15. Productive Borrowing

## R-038 — Productive Purpose

Potentially productive borrowing includes:

* Business expansion.
* Inventory expansion.
* Income-generating vehicle.
* Productive equipment.

Such borrowing may receive positive contextual treatment.

However:

```text
Productive purpose
≠
Automatic approval
```

Affordability remains mandatory.

| What               | Value            | Why                                        | Source       |
| ------------------ | ---------------- | ------------------------------------------ | ------------ |
| Productive purpose | Positive context | Loan may generate additional income/value  | My judgement |
| Affordability      | Always required  | Purpose cannot override repayment capacity | My judgement |

---

# 16. Purpose Classification

## R-039 — Purpose Context

The prototype may classify purposes broadly:

| Purpose                   | Context                |
| ------------------------- | ---------------------- |
| Home                      | Essential/long-term    |
| Education                 | Potentially productive |
| Business expansion        | Productive             |
| Income-generating vehicle | Productive             |
| Wedding                   | Discretionary          |
| Vacation                  | Discretionary          |

Purpose classification should **not** act as a standalone approval/rejection rule.

It provides additional context for the recommendation.

---

# 17. Income Stability

## R-040 — Income Stability

The prototype may use the following qualitative scale:

| Situation                  | Stability Score |
| -------------------------- | --------------: |
| Salaried, 3+ years         |               5 |
| Salaried, 1–3 years        |               4 |
| Business, 5+ years         |               4 |
| Business, 2–5 years        |               3 |
| Informal / highly variable |               2 |
| Income history <1 year     |               1 |

This is **not a credit score**.

It is used to influence confidence and uncertainty.

| What                   | Value | Why                                   | Source       |
| ---------------------- | ----- | ------------------------------------- | ------------ |
| Income stability score | 1–5   | Helps represent uncertainty in income | My judgement |

---

# 18. Confidence System

## R-041 — Confidence Meaning

Confidence represents how complete and reliable the information is for the self-assessment.

It is **not**:

* Probability of approval.
* Probability of repayment.
* Credit score.
* Lender confidence.

---

## R-042 — Starting Confidence

```text
Confidence = 100
```

---

## R-043 — Missing Information Penalties

The prototype uses:

| Missing Information | Penalty | Source       |
| ------------------- | ------: | ------------ |
| Credit score        |     -10 | My judgement |
| Income history      |     -10 | My judgement |
| Household expenses  |     -15 | My judgement |
| Emergency savings   |     -10 | My judgement |
| Income variability  |     -10 | My judgement |

Final confidence:

```text
Confidence = MAX(0, MIN(100, Confidence))
```

---

## R-044 — Confidence Labels

|  Score | Label  |
| -----: | ------ |
| 80–100 | High   |
|  60–79 | Medium |
|   0–59 | Low    |

---

## R-045 — Low Confidence Widens Estimates

When confidence decreases:

```text
Lower confidence
      ↓
Wider ranges
      ↓
More explicit uncertainty
```

The system must not use low confidence as an excuse to invent precise numbers.

---

# 19. Stress Testing

## R-046 — Required Stress Case

Every borrower must receive a stress scenario.

The prototype uses:

```text
Income decreases by 10%
+
Interest rate increases by 2 percentage points
```

Example:

```text
Current income = ₹1,00,000
Stressed income = ₹90,000

Current rate = 12%
Stressed rate = 14%
```

The challenge requires a stress case involving income decline or rate increase.

---

## R-047 — Stress Recalculation

Under the stress scenario, recalculate:

```text
Stressed Income
Stressed Interest Rate
Stressed EMI
Stressed FOIR
Stressed Disposable Income
Stressed Safe EMI
```

---

## R-048 — Stress Warning

If the loan becomes unaffordable under the stress scenario:

```text
WARNING

This EMI becomes unsafe under the stress scenario.
```

The application should make the consequence visible before the borrower accepts the proposed borrowing.

---

# 20. Adaptive Questions

## R-049 — Must Questions vs Additional Questions

The questionnaire has two layers.

### Must Questions

Approximately:

```text
8–10 questions
```

These establish the minimum information needed for the four outputs.

### Additional Questions

Asked only when they can tighten or change an output.

---

## R-050 — Every Additional Question Must Matter

An additional question must satisfy:

```text
Question
   ↓
Changes / tightens an output
```

If the answer cannot affect:

* Borrowing verdict
* Maximum amount
* Fair rate
* EMI/outflow
* Confidence

then the question should not be asked.

---

## R-051 — Salaried Adaptive Path

For salaried borrowers, prioritize:

* Employment duration.
* Existing EMIs.
* Household expenses.
* Credit score.
* Emergency savings.
* Other debt.
* Income stability.

---

## R-052 — Self-Employed Adaptive Path

For self-employed borrowers, prioritize:

* Business duration.
* Income range.
* Documented income.
* Income variability.
* Existing obligations.
* Collateral.
* Business purpose.
* Business cash flow where relevant.

---

## R-053 — Informal / Variable Income Adaptive Path

For informal or variable-income borrowers, prioritize:

* Income range.
* Income volatility.
* Existing debt.
* Repayment history.
* Household dependents.
* Emergency savings.
* Loan purpose.
* Current financial stress.

---

# 21. Negotiation Card

## R-054 — Required Negotiation Card Information

The Negotiation Card should contain:

```text
Borrower-safe amount
Lender-likely amount
Recommended amount
Safe EMI ceiling
Fair interest-rate range
Estimated all-in cost
Lender quote
Key reasons
Confidence
Stress warning
```

The lender quote should only appear if the borrower provides one.

---

## R-055 — Negotiation Card Example

```text
BORROWER COPILOT — NEGOTIATION CARD

REQUESTED LOAN
₹8,00,000

BORROWER-SAFE AMOUNT
₹X

LENDER-LIKELY AMOUNT
₹Y

SAFE EMI
₹Z / month

FAIR RATE
11–12.5%

LENDER QUOTE
14%

ESTIMATED ALL-IN COST
X%

WHY
Your income, existing obligations and credit profile
support a lower indicative rate range under our assumptions.

CONFIDENCE
High

STRESS
At +2% interest and -10% income, EMI affordability becomes X.
```

All `X/Y/Z` values must be calculated dynamically.

---

# 22. Explainability

## R-056 — Every Major Number Has a Why

Every major output must be traceable:

```text
Borrower Input
      ↓
Rule
      ↓
Calculation
      ↓
Output
      ↓
Explanation
```

Example:

```text
SAFE EMI: ₹22,000/month

WHY?

Your income is ₹1,10,000/month and you already have
₹14,000 in existing EMI obligations.

Our affordability rules limit total debt obligations
and preserve a financial buffer.
```

---

## R-057 — One-Sentence Traceability

Each major output should have a short explanation.

Examples:

```text
Safe EMI: ₹22,000

Why:
This keeps your total monthly debt obligations within
the assumed affordability limit.
```

```text
Borrow Less: ₹5 lakh

Why:
Your requested ₹8 lakh would require an EMI above your
borrower-safe affordability ceiling.
```

```text
Consider LAP

Why:
You have established business income and substantial
unencumbered collateral, so a secured product may be
more appropriate than unsecured borrowing.
```

---

# 23. No Guarantees

## R-058 — No Approval Guarantee

Never say:

```text
"You will get this loan."
```

Instead:

```text
"Estimated lender-likely amount"
```

or:

```text
"Based on the information you provided..."
```

---

## R-059 — No Rate Guarantee

Never say:

```text
"Your interest rate will be 11.73%."
```

Instead:

```text
"Indicative fair-rate range: 11–12.5%"
```

The range represents a borrower comparison estimate, not a lender commitment.

---

# 24. Precision Rules

## R-060 — Avoid False Precision

Borrower-facing outputs should be appropriately rounded.

Instead of:

```text
₹2,37,481
```

prefer:

```text
₹2.4 lakh
```

when exact rupee precision does not materially improve the decision.

Similarly:

```text
11–12.5%
```

is preferable to:

```text
11.73%
```

when the underlying estimate does not justify that precision.

---

# 25. Financial Limitations

## R-061 — What Borrower Copilot Does Not Know

The prototype does not:

* Pull bureau data.
* Verify credit scores.
* Verify income.
* Verify employment.
* Verify business revenue.
* Verify documents.
* Read bank statements.
* Perform lender underwriting.
* Guarantee loan approval.
* Guarantee interest rates.
* Guarantee a lender's sanction amount.

The challenge explicitly states that the application should use self-reported information and does not require bureau integration.

---

# 26. Source Classification

## R-062 — Source Labels

Every important rule should be classified as one of:

### Challenge Brief

Directly required or described by the Lokta challenge.

### Source-Backed

Supported by an external authoritative source.

### Industry-Practice-Informed

Based on common lending/financial practices.

### My Judgement

A prototype assumption created specifically for this application.

---

## R-063 — No False Authority

A prototype assumption must never be presented as:

```text
"RBI requires this exact threshold."
```

unless the exact rule is actually supported by an authoritative source.

Likewise, do not claim:

```text
"Lenders always use 45% FOIR."
```

The prototype's FOIR limits are assumptions.

---

# 27. Rule Precedence

## R-064 — Decision Priority

When multiple rules interact, use this conceptual priority:

```text
1. Severe financial distress
             ↓
2. Borrower-safe affordability
             ↓
3. Stress-test affordability
             ↓
4. Product suitability
             ↓
5. Lender-likely affordability
             ↓
6. Requested amount
```

A potential lender sanction must never override borrower-safety constraints.

---

# 28. Calculation Traceability

## R-065 — Reproducible Calculations

Every major output must be reproducible from the input values and rules.

Example:

```text
INPUTS

Net income = ₹1,10,000
Existing EMI = ₹14,000
FOIR limit = 45%

RULES

R-005 → FOIR
R-006 → FOIR limit
R-007 → FOIR EMI capacity

CALCULATION

(₹1,10,000 × 45%) − ₹14,000

OUTPUT

FOIR EMI Capacity = ₹35,500
```

The same input + same rules should produce the same output.

---

# 29. Separation of Rules and UI

## R-066 — Rules Must Be Independent of UI

The rules engine must be separate from the UI layer.

Conceptually:

```text
UI
 ↓
Input Validation
 ↓
Question Engine
 ↓
Rules Engine
 ↓
Calculations
 ↓
Decision Engine
 ↓
Outputs
```

Changing:

```text
Salaried FOIR = 45%
```

to:

```text
Salaried FOIR = 40%
```

should not require rewriting the UI.

---

# 30. Rule Configuration

## R-067 — Centralize Important Assumptions

Important assumptions should be centralized.

Examples:

```text
FOIR_LIMITS
RATE_BANDS
TENURE_LIMITS
STRESS_ASSUMPTIONS
CONFIDENCE_PENALTIES
```

This allows the evaluator to change an assumption and immediately see the application recalculate.

---

# 31. Rule Changeability

## R-068 — Live Assumption Changes

If an evaluator changes:

```text
Salaried FOIR:
45% → 40%
```

the application should recalculate all affected outputs.

Potentially affected values include:

```text
Safe EMI
Lender-Likely EMI
Borrower-Safe Amount
Recommended Amount
Borrowing Verdict
Stress Result
Negotiation Card
```

This directly supports the challenge's follow-up evaluation where an assumption may be changed live.

---

# 32. Four Required Outputs

## R-069 — O1: Borrowing Verdict

The application must produce:

```text
BORROW
BORROW LESS
DON'T BORROW
```

with a reason.

---

## R-070 — O2: Maximum Amount

The application must produce:

```text
Lender-Likely Amount
+
Borrower-Safe Amount
```

and explain which number the borrower should use.

---

## R-071 — O3: Fair Interest Rate

The application must produce:

```text
Fair Rate Band
+
Expected Rate / Indicative Position
+
Estimated All-In Cost
+
Processing Fee
```

when sufficient information is available.

---

## R-072 — O4: EMI / Outflow

The application must produce:

```text
Safe EMI Ceiling
+
Tenure Trade-Off
+
Stress Case
```

---

# 33. Final Decision Principle

## R-073 — Borrower First

The final recommendation should prioritize:

```text
Borrower Safety
      +
Affordability
      +
Debt Stress
      +
Product Suitability
      +
Rate Fairness
      +
All-In Cost
      +
Stress Resilience
      +
Confidence
```

The goal is **not** to maximize the amount the borrower can obtain.

The goal is to help the borrower make a financially defensible borrowing decision.

---

# 34. Master Rule Table

| Rule ID | Rule                    | Value / Formula                                                 | Source                            |
| ------- | ----------------------- | --------------------------------------------------------------- | --------------------------------- |
| R-001   | Must-have questions     | Approximately 8–10                                              | Challenge brief                   |
| R-002   | Unknown values          | Never treat as zero                                             | Challenge brief                   |
| R-003   | Missing information     | Widen ranges + reduce confidence                                | Challenge brief                   |
| R-004   | Income types            | Salaried / Self-employed / Informal-variable                    | Challenge brief + judgement       |
| R-005   | FOIR                    | `(Existing EMIs + Proposed EMI) / Income`                       | FOIR-style methodology            |
| R-006   | Salaried FOIR           | 45%                                                             | My judgement                      |
| R-006   | Self-employed FOIR      | 40%                                                             | My judgement                      |
| R-006   | Informal FOIR           | 35%                                                             | My judgement                      |
| R-007   | FOIR EMI capacity       | `(Income × FOIR) − Existing EMIs`                               | Derived                           |
| R-008   | Disposable income       | `Income − Expenses − Existing EMIs`                             | Affordability methodology         |
| R-009   | Disposable EMI capacity | `Disposable Income × 80%`                                       | My judgement                      |
| R-010   | Safe EMI                | `MIN(FOIR capacity, disposable capacity)`                       | My judgement                      |
| R-011   | Amount outputs          | Lender-likely + borrower-safe                                   | Challenge brief                   |
| R-014   | Recommended amount      | `MIN(lender-likely, borrower-safe)`                             | My judgement                      |
| R-015   | EMI                     | Standard reducing-balance formula                               | Standard mathematics              |
| R-017   | Principal from EMI      | Inverse EMI formula                                             | Derived                           |
| R-018   | Personal tenure         | 5 years                                                         | My judgement                      |
| R-018   | Two-wheeler tenure      | 7 years                                                         | My judgement                      |
| R-018   | Home tenure             | 30 years                                                        | My judgement                      |
| R-018   | LAP tenure              | 15 years                                                        | My judgement                      |
| R-018   | Business tenure         | 10 years                                                        | My judgement                      |
| R-018   | Gold tenure             | 3 years                                                         | My judgement                      |
| R-020   | Personal rate bands     | 10–24% depending on profile                                     | My judgement                      |
| R-021   | Home rate bands         | 7.9–9.8%                                                        | My judgement                      |
| R-022   | Gold rate               | 8–11%                                                           | My judgement                      |
| R-023   | LAP rate                | 9.5–12%                                                         | My judgement                      |
| R-024   | Business rate           | 11–16%                                                          | My judgement                      |
| R-025   | Credit score bands      | 800+, 750–799, 700–749, 650–699, <650                           | My judgement                      |
| R-026   | Unknown score           | Wider range + lower confidence                                  | Challenge brief                   |
| R-027   | Processing fees         | Must be visible                                                 | Challenge brief                   |
| R-029   | Estimated APR           | Simplified comparison metric                                    | My judgement                      |
| R-031   | Borrow                  | Safe + suitable + no severe distress                            | My judgement                      |
| R-032   | Borrow Less             | Requested > safe amount                                         | My judgement                      |
| R-033   | Don't Borrow            | Severe affordability/debt distress                              | My judgement                      |
| R-036   | Secured routing         | Collateral + substantial requirement → consider secured product | Challenge brief                   |
| R-038   | Productive borrowing    | Positive context, never overrides affordability                 | My judgement                      |
| R-040   | Income stability        | 1–5 qualitative score                                           | My judgement                      |
| R-042   | Starting confidence     | 100                                                             | My judgement                      |
| R-043   | Confidence penalties    | -10/-10/-15/-10/-10                                             | My judgement                      |
| R-044   | Confidence labels       | High 80–100 / Medium 60–79 / Low 0–59                           | My judgement                      |
| R-046   | Stress test             | Income -10%, rate +2pp                                          | My judgement                      |
| R-049   | Must questions          | Approximately 8–10                                              | Challenge brief                   |
| R-050   | Additional questions    | Must change/tighten an output                                   | Challenge brief                   |
| R-054   | Negotiation Card        | Amount + EMI + rate + cost + reasons + confidence               | Challenge brief                   |
| R-056   | Explainability          | Every major number needs a reason                               | Challenge brief                   |
| R-058   | Approval                | Never guaranteed                                                | Challenge brief/product principle |
| R-059   | Rate                    | Never guaranteed                                                | Product principle                 |
| R-060   | Precision               | Avoid unsupported precision                                     | Challenge brief                   |
| R-066   | Architecture            | Rules separated from UI                                         | Challenge brief                   |
| R-068   | Rule changes            | Outputs must recalculate                                        | Challenge brief                   |

---

# 35. Important Assumption Notice

The following are **prototype assumptions created for Borrower Copilot** rather than values supplied directly by the challenge:

```text
FOIR thresholds
Disposable-income 80% allocation
Personal-loan rate bands
Home-loan rate bands
Gold-loan rate band
LAP rate band
Business-loan rate band
Maximum tenure assumptions
Credit-score segmentation
Confidence penalties
Income-stability scores
10% income stress
+2 percentage-point rate stress
Purpose-risk classifications
```

These assumptions are intentionally centralized so they can be changed during evaluation.

The challenge's own requirements remain the higher-level product constraints:

```text
Borrower-first
+
Explainable
+
Adaptive
+
Honest about uncertainty
+
Lender number ≠ borrower number
+
Don't Borrow must be reachable
+
India / INR
+
Rules must be inspectable
+
Rules must be changeable
```

---

# 36. Final Rule

```text
The system should never ask:

"How much can the borrower possibly get?"

It should ask:

"Given what we know, what borrowing decision is
defensible for this borrower?"
```

That principle governs all rules in this document.
