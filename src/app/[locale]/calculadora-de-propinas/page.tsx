'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { DollarSign, Users, Percent } from 'lucide-react';

export default function TipCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [bill, setBill] = useState('');
  const [tipPercent, setTipPercent] = useState('15');
  const [people, setPeople] = useState('1');

  const amounts = useMemo(() => {
    const b = parseFloat(bill);
    const tp = parseFloat(tipPercent);
    const p = parseInt(people) || 1;
    if (isNaN(b) || isNaN(tp) || b <= 0) return null;
    const tip = b * (tp / 100);
    const total = b + tip;
    return {
      tip: tip,
      total: total,
      each: total / p,
    };
  }, [bill, tipPercent, people]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.tipCalculator.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <DollarSign className="h-4 w-4 text-primary" /> {dict.tipCalculator.billAmount}
            </label>
            <input
              type="number"
              value={bill}
              onChange={(e) => setBill(e.target.value)}
              placeholder="50.00"
              min="0"
              step="0.01"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Percent className="h-4 w-4 text-primary" /> {dict.tipCalculator.tipPercentage}
            </label>
            <input
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              placeholder="15"
              min="0"
              max="100"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <div className="mt-2 flex gap-2">
              {[10, 15, 18, 20, 25].map((p) => (
                <button key={p} onClick={() => setTipPercent(String(p))} className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${String(p) === tipPercent ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                  {p}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Users className="h-4 w-4 text-primary" /> {dict.tipCalculator.people}
            </label>
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="1"
              min="1"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {amounts && (
            <div className="mt-6 space-y-3 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.tipCalculator.tipAmount}</span>
                <span className="text-xl font-bold text-green-500">${amounts.tip.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{dict.tipCalculator.totalAmount}</span>
                <span className="text-xl font-bold text-foreground">${amounts.total.toFixed(2)}</span>
              </div>
              {parseInt(people) > 1 && (
                <div className="border-t border-border pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{dict.tipCalculator.eachPays}</span>
                    <span className="text-xl font-bold text-primary">${amounts.each.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
