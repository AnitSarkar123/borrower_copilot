'use client';

import { useMemo, useState } from 'react';
import { PERSONA_PROFILES } from '../data/personas';
import { buildBorrowerResult } from '../engine/borrowerEngine';
import type { BorrowerProfile } from '../types/borrower';

const defaultState: BorrowerProfile = PERSONA_PROFILES.priya;

const formatMoney = (value: number | null) =>
  value == null ? 'Unknown' : `₹${value.toLocaleString('en-IN')}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

export default function Home() {
  const [profile, setProfile] = useState<BorrowerProfile>(defaultState);
  const [selectedPersona, setSelectedPersona] = useState<'priya' | 'ravi' | 'anita'>('priya');

  const result = useMemo(() => buildBorrowerResult(profile, 12), [profile]);

  const updateField = <K extends keyof BorrowerProfile>(key: K, value: BorrowerProfile[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
  };

  const applyPersona = (name: 'priya' | 'ravi' | 'anita') => {
    setSelectedPersona(name);
    setProfile(PERSONA_PROFILES[name]);
  };

  return (
    <main className="min-h-screen bg-[#f5f5f3] px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 card p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Borrower Copilot
              </p>
              <h1 className="mt-2 text-3xl font-bold">Know what you can safely borrow</h1>
            </div>
            <div className="flex gap-2">
              {(['priya', 'ravi', 'anita'] as const).map((persona) => (
                <button
                  key={persona}
                  onClick={() => applyPersona(persona)}
                  className={`rounded-full border px-3 py-2 text-sm font-medium ${
                    selectedPersona === persona
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  {persona.charAt(0).toUpperCase() + persona.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr]">
          <section className="card p-5">
            <h2 className="mb-4 text-xl font-bold">Borrower details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Income type
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.incomeType}
                  onChange={(e) => updateField('incomeType', e.target.value as BorrowerProfile['incomeType'])}
                >
                  <option value="salaried">Salaried</option>
                  <option value="self_employed">Self-employed</option>
                  <option value="informal">Informal / variable</option>
                </select>
              </label>

              <label className="text-sm font-medium text-slate-700">
                Monthly net income
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.monthlyIncome ?? ''}
                  onChange={(e) => updateField('monthlyIncome', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Household expenses
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.householdExpenses ?? ''}
                  onChange={(e) => updateField('householdExpenses', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Existing EMI
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.existingEmi ?? ''}
                  onChange={(e) => updateField('existingEmi', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Requested amount
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.requestedAmount ?? ''}
                  onChange={(e) => updateField('requestedAmount', Number(e.target.value) || 0)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Credit score
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.creditScore ?? ''}
                  onChange={(e) => updateField('creditScore', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Emergency savings
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.emergencySavings ?? ''}
                  onChange={(e) => updateField('emergencySavings', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700">
                Income history (years)
                <input
                  type="number"
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.incomeYears ?? ''}
                  onChange={(e) => updateField('incomeYears', Number(e.target.value) || null)}
                />
              </label>

              <label className="text-sm font-medium text-slate-700 sm:col-span-2">
                Loan purpose
                <select
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2"
                  value={profile.purpose}
                  onChange={(e) => updateField('purpose', e.target.value as BorrowerProfile['purpose'])}
                >
                  <option value="wedding">Wedding</option>
                  <option value="business_expansion">Business expansion</option>
                  <option value="vehicle_income">Income-generating vehicle</option>
                  <option value="vehicle_personal">Personal vehicle</option>
                  <option value="home">Home</option>
                  <option value="education">Education</option>
                  <option value="medical">Medical</option>
                  <option value="debt_repayment">Debt repayment</option>
                  <option value="personal_other">Other</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
              <span>Meaningful unencumbered collateral?</span>
              <button
                className={`rounded-full px-3 py-1.5 font-medium ${
                  profile.hasCollateral ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700 border border-slate-300'
                }`}
                onClick={() => updateField('hasCollateral', !profile.hasCollateral)}
              >
                {profile.hasCollateral ? 'Yes' : 'No'}
              </button>
            </div>
          </section>

          <section className="space-y-6">
            <div className="card p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Verdict</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                  {result.confidence}
                </span>
              </div>

              <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">{result.verdict}</h2>
              <p className="mt-2 text-slate-700">{result.verdictReasons[0]}</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Borrower-safe amount</p>
                <p className="mt-2 text-3xl font-bold">{formatMoney(result.safeAmount)}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Lender-likely amount</p>
                <p className="mt-2 text-3xl font-bold">{formatMoney(result.lenderLikelyAmount)}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Fair rate range</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatPercent(result.rateRange.minPercent)} – {formatPercent(result.rateRange.maxPercent)}
                </p>
                <p className="mt-2 text-sm text-slate-600">Expected around {formatPercent(result.rateRange.expectedPercent)}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Safe EMI ceiling</p>
                <p className="mt-2 text-2xl font-bold">{formatMoney(result.safeEmi)}/month</p>
                <p className="mt-2 text-sm text-slate-600">Indicative lender EMI: {formatMoney(result.lenderLikelyEmi)}/month</p>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold">Why this result</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Monthly income: {formatMoney(profile.monthlyIncome)}</li>
                <li>• Existing EMI: {formatMoney(profile.existingEmi)}</li>
                <li>• Household expenses: {formatMoney(profile.householdExpenses)}</li>
                <li>• Proposed loan: {formatMoney(profile.requestedAmount)}</li>
              </ul>
              <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                {result.explanations.safeAmount}
              </p>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold">Stress scenario</h3>
              <p className="mt-2 text-sm text-slate-700">
                Income falls by {result.stress.incomeDropPercent}% and rate rises by {result.stress.rateIncreasePoints} percentage points.
              </p>
              <p className="mt-3 text-sm font-medium text-slate-900">
                {result.stress.warning ?? 'Stress result remains manageable.'}
              </p>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold">Negotiation card</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                {result.negotiationPoints.map((point) => (
                  <li key={point}>• {point}</li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
