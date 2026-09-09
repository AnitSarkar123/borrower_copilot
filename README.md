# Borrower Copilot

Borrower Copilot is a borrower-first decision support app for Indian borrowers. It helps users understand whether a loan is sensible, how much is financially safe to borrow, what a fair rate range looks like, and whether the EMI remains manageable under a stress scenario.

The app is deliberately deterministic: it does not rely on an AI model to approve or reject borrowing. Instead, the financial logic is implemented in TypeScript and exposed through a simple UI that can be used for negotiation and borrower education.

## Overview

Borrower Copilot answers four key questions:

1. Should I borrow at all?
2. How much is it safe to borrow?
3. What is a reasonable rate range?
4. What EMI should I aim for?

It also produces a negotiation card with borrower-safe guidance and a clear verdict:

- Borrow
- Borrow Less
- Don't Borrow

## Key Features

- Borrower profile inputs for income, expenses, EMIs, requested amount, and loan purpose
- Deterministic affordability and EMI calculations
- Borrower-safe amount vs lender-likely amount separation
- Fair rate band based on profile and product type
- Stress scenario analysis for income drop and rate increase
- Persona presets for Priya, Ravi, and Anita
- Negotiation card summary for lender discussions
- Vitest regression tests for affordability and verdict logic
- Next.js App Router UI with TypeScript

## Product Philosophy

This project follows a simple principle:

- The UI is for explanation and decision support.
- The financial engine is the source of truth.
- AI, if added later, should only explain the result rather than replace rule-based logic.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Vitest

## Project Structure

```text
borrower_copilot/
├── README.md
├── PRD.md
├── RULES.md
├── architecture.md
├── DESIGN.md
├── PROGRESS.md
├── AGENT.md
├── AGENTS.md
├── CLAUDE.md
├── package.json
├── next.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── app/
    │   ├── globals.css
    │   ├── layout.tsx
    │   └── page.tsx
    ├── calculations/
    ├── data/
    ├── engine/
    ├── rules/
    ├── tests/
    └── types/
```

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open http://localhost:3000 in the browser.

## Run Tests

```bash
npm test
```

## Production Build

```bash
npm run build
```

## Verification Status

The project is currently validated with:

- Vitest test suite passing
- Next.js production build succeeding

## Documentation Set

The project includes companion documents that explain the product and implementation intent:

- PRD.md — product requirements
- RULES.md — business assumptions and thresholds
- architecture.md — technical design
- DESIGN.md — UI and UX decisions
- PROGRESS.md — current implementation status

## Notes

Borrower Copilot is a prototype and is intended for educational / decision-support use, not for official lender underwriting or approval decisions.

## License

This project is provided as a local assignment/demo project without a formal externally published license.

