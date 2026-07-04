'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Percent, ArrowRight } from 'lucide-react';

export default function PercentageCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [num1, setNum1] = useState('');
  const [num2, setNum2] = useState('');
  const [mode, setMode] = useState<'whatIs' | 'isWhat'>('whatIs');

  const result = (() => {
    const a = parseFloat(num1);
    const b = parseFloat(num2);
    if (isNaN(a) || isNaN(b) || b === 0) return null;
    if (mode === 'whatIs') return (a / 100) * b;
    return (a / b) * 100;
  })();

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.percentageCalculator.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setMode('whatIs')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === 'whatIs' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
              {dict.percentageCalculator.whatIs} X% {dict.percentageCalculator.of} Y?
            </button>
            <button onClick={() => setMode('isWhat')} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === 'isWhat' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
              X {dict.percentageCalculator.is} {dict.percentageCalculator.whatIs}% {dict.percentageCalculator.of} Y?
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">
                {mode === 'whatIs' ? dict.percentageCalculator.percent : dict.percentageCalculator.is}
              </label>
              <input
                type="number"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
                placeholder={mode === 'whatIs' ? '15' : '30'}
                className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.percentageCalculator.of}</label>
              <input
                type="number"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
                placeholder="200"
                className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          {result !== null && (
            <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-secondary/50 p-4">
              <span className="text-lg text-muted-foreground">
                {mode === 'whatIs'
                  ? `${num1}% ${dict.percentageCalculator.of} ${num2}`
                  : `${num1} ${dict.percentageCalculator.is}`}
              </span>
              <ArrowRight className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {mode === 'whatIs' ? result.toFixed(2) : `${result.toFixed(1)}%`}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
