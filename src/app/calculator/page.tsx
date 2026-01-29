'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BedroomType,
  City,
  CityResult,
  calculateCityResult,
  formatCurrency,
  formatNumber,
  getCities,
} from '@/lib/calculations';

const SALARY_MIN = 50000;
const SALARY_MAX = 300000;
const SALARY_STEP = 1000;
const MAX_COMPARE = 5;

const housingOptions: { value: BedroomType; label: string }[] = [
  { value: 'studio', label: 'Studio' },
  { value: '1br', label: '1BR' },
  { value: '2br', label: '2BR' },
  { value: '3br', label: '3BR' },
  { value: '4br', label: '4BR' },
];

function formatSalaryShort(value: number): string {
  return `${Math.round(value / 1000)}K`;
}

function getDefaultCityIds(cities: City[]): string[] {
  return cities.slice(0, 3).map((city) => city.id);
}

export default function CalculatorPage() {
  const cities = useMemo(() => {
    const sorted = [...getCities()].sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, []);

  const [salary, setSalary] = useState(150000);
  const [bedrooms, setBedrooms] = useState<BedroomType>('1br');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [hasCar, setHasCar] = useState(true);
  const [cityIds, setCityIds] = useState<string[]>(() => getDefaultCityIds(cities));

  const selectedCities = useMemo(() => {
    return cityIds.map((id) => cities.find((city) => city.id === id)).filter(Boolean) as City[];
  }, [cityIds, cities]);

  const results = useMemo(() => {
    return selectedCities.map((city) =>
      calculateCityResult(salary, city, { bedrooms, adults, children, hasCar })
    );
  }, [salary, selectedCities, bedrooms, adults, children, hasCar]);

  const bestCityId = useMemo(() => {
    if (results.length === 0) return '';
    const best = results.reduce((top, current) =>
      current.monthlySurplus > top.monthlySurplus ? current : top
    );
    return best.city.id;
  }, [results]);

  const handleCityChange = (index: number, value: string) => {
    setCityIds((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleAddCity = () => {
    setCityIds((prev) => {
      if (prev.length >= MAX_COMPARE) return prev;
      const remaining = cities.find((city) => !prev.includes(city.id));
      return remaining ? [...prev, remaining.id] : prev;
    });
  };

  const handleRemoveCity = (index: number) => {
    setCityIds((prev) => prev.filter((_, idx) => idx !== index));
  };

  const tableRows: {
    label: string;
    value: (result: CityResult) => string | number;
    helper?: string;
  }[] = [
    {
      label: 'Monthly Rent',
      value: (result) => formatCurrency(result.monthlyRent),
    },
    {
      label: 'Monthly Living Costs',
      value: (result) => formatCurrency(result.monthlyCostOfLivingBase),
      helper: 'Food, utilities, transit, etc.',
    },
    {
      label: 'Monthly Car Cost',
      value: (result) => (hasCar ? formatCurrency(result.monthlyCarCost) : '—'),
    },
    {
      label: 'Total Monthly Expenses',
      value: (result) => formatCurrency(result.monthlyRent + result.monthlyCostOfLiving),
    },
    {
      label: 'Federal Tax (Annual)',
      value: (result) => formatCurrency(result.federalTax),
    },
    {
      label: 'State Tax (Annual)',
      value: (result) => formatCurrency(result.stateTax),
    },
    {
      label: 'Local Tax (Annual)',
      value: (result) => formatCurrency(result.localTax),
    },
    {
      label: 'FICA (Annual)',
      value: (result) => formatCurrency(result.ficaTax),
    },
    {
      label: 'Net Income (Annual)',
      value: (result) => formatCurrency(result.netIncome),
    },
    {
      label: 'Monthly Surplus',
      value: (result) => formatCurrency(result.monthlySurplus),
    },
    {
      label: 'Annual Surplus',
      value: (result) => formatCurrency(result.annualSurplus),
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-white">
            Realocation
          </Link>
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link href="/results" className="hover:text-white">
              Results
            </Link>
            <Link href="/login" className="hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="space-y-8">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
                Full Calculator
              </p>
              <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">
                Compare cities, tweak the levers, and find your best move.
              </h1>
              <p className="mt-3 text-slate-300">
                Update salary, housing, family size, and car ownership. Results update instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Annual Salary</p>
                  <p className="mt-2 text-3xl font-semibold text-white">
                    {formatCurrency(salary)}
                  </p>
                </div>
                <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  {formatSalaryShort(SALARY_MIN)} - {formatSalaryShort(SALARY_MAX)}
                </div>
              </div>
              <div className="mt-6">
                <input
                  type="range"
                  min={SALARY_MIN}
                  max={SALARY_MAX}
                  step={SALARY_STEP}
                  value={salary}
                  onChange={(event) => setSalary(parseInt(event.target.value, 10))}
                  className="w-full accent-emerald-400"
                />
                <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                  <span>{formatSalaryShort(SALARY_MIN)}</span>
                  <span>{formatSalaryShort(SALARY_MAX)}</span>
                </div>
                <div className="mt-4">
                  <label className="text-xs text-slate-400">Fine tune</label>
                  <input
                    type="number"
                    min={SALARY_MIN}
                    max={SALARY_MAX}
                    step={SALARY_STEP}
                    value={salary}
                    onChange={(event) => setSalary(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm font-semibold text-white">Housing Type</p>
                <select
                  value={bedrooms}
                  onChange={(event) => setBedrooms(event.target.value as BedroomType)}
                  className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                >
                  {housingOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
                <p className="text-sm font-semibold text-white">Car Ownership</p>
                <button
                  type="button"
                  onClick={() => setHasCar((prev) => !prev)}
                  className={`mt-3 flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-medium transition ${
                    hasCar
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                      : 'border-slate-700 bg-slate-950 text-slate-300'
                  }`}
                >
                  <span>{hasCar ? 'Yes, I own a car' : 'No car needed'}</span>
                  <span className="text-xs uppercase tracking-wider">
                    {hasCar ? 'On' : 'Off'}
                  </span>
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
              <p className="text-sm font-semibold text-white">Family Size</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-slate-400">Adults</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={adults}
                    onChange={(event) => setAdults(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400">Children</label>
                  <input
                    type="number"
                    min={0}
                    max={6}
                    value={children}
                    onChange={(event) => setChildren(Number(event.target.value))}
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">Compare Cities</p>
                  <p className="text-xs text-slate-400">Add up to {MAX_COMPARE} cities.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddCity}
                  disabled={cityIds.length >= MAX_COMPARE}
                  className="rounded-full border border-emerald-400/50 px-3 py-1 text-xs font-semibold text-emerald-200 hover:border-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  + Add city
                </button>
              </div>
              <div className="mt-4 space-y-3">
                {cityIds.map((cityId, index) => {
                  const selectedIds = cityIds.filter((_, idx) => idx !== index);
                  return (
                    <div key={`${cityId}-${index}`} className="flex items-center gap-3">
                      <select
                        value={cityId}
                        onChange={(event) => handleCityChange(index, event.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                      >
                        {cities
                          .filter((city) => city.id === cityId || !selectedIds.includes(city.id))
                          .map((city) => (
                            <option key={city.id} value={city.id}>
                              {city.name}, {city.state}
                            </option>
                          ))}
                      </select>
                      {cityIds.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveCity(index)}
                          className="rounded-full border border-slate-700 px-3 py-2 text-xs text-slate-300 hover:border-slate-500"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
              <h2 className="text-sm font-semibold text-white">Snapshot</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Household</p>
                  <p className="mt-2 text-sm text-white">
                    {adults} adult{adults > 1 ? 's' : ''}, {children} child{children !== 1 ? 'ren' : ''}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Housing</p>
                  <p className="mt-2 text-sm text-white">
                    {housingOptions.find((option) => option.value === bedrooms)?.label}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Cars</p>
                  <p className="mt-2 text-sm text-white">{hasCar ? '1 vehicle' : 'No vehicle'}</p>
                </div>
                <div className="rounded-xl bg-slate-950/70 p-4">
                  <p className="text-xs text-slate-400">Cities Compared</p>
                  <p className="mt-2 text-sm text-white">{cityIds.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">
              Comparison Table
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Your take-home, side-by-side.
            </h2>
          </div>
          <div className="rounded-full border border-slate-800 px-4 py-2 text-xs text-slate-300">
            Best city highlighted
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
          <table className="min-w-[760px] w-full border-collapse text-left text-sm">
            <thead className="bg-slate-950/70 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-4">Metric</th>
                {results.map((result) => {
                  const isBest = result.city.id === bestCityId;
                  return (
                    <th
                      key={result.city.id}
                      className={`px-4 py-4 font-semibold ${
                        isBest ? 'text-emerald-200' : 'text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>
                          {result.city.name}, {result.city.state}
                        </span>
                        {isBest && (
                          <span className="rounded-full bg-emerald-400/20 px-2 py-1 text-[10px] uppercase text-emerald-200">
                            Best
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={row.label} className="border-t border-slate-800">
                  <td className="px-4 py-4 text-slate-300">
                    <div>{row.label}</div>
                    {row.helper && <div className="text-xs text-slate-500">{row.helper}</div>}
                  </td>
                  {results.map((result) => {
                    const isBest = result.city.id === bestCityId;
                    const value = row.value(result);
                    return (
                      <td
                        key={`${row.label}-${result.city.id}`}
                        className={`px-4 py-4 font-medium ${
                          isBest ? 'bg-emerald-500/10 text-emerald-100' : 'text-white'
                        }`}
                      >
                        {typeof value === 'number' ? formatNumber(value) : value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
