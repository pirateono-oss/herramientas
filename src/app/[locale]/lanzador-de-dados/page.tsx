'use client';
import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Dice5, Plus, Shuffle } from 'lucide-react';

export default function DiceRollerPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [diceCount, setDiceCount] = useState(1);
  const [results, setResults] = useState<number[]>([]);

  const roll = useCallback(() => {
    const rolls = Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1);
    setResults(rolls);
  }, [diceCount]);

  const total = useMemo(() => results.reduce((a, b) => a + b, 0), [results]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.diceRoller.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.diceRoller.diceCount}</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setDiceCount(Math.max(1, diceCount - 1))} className="rounded-lg bg-secondary px-3 py-2 text-muted-foreground hover:bg-secondary/80 transition-colors">-</button>
              <span className="w-12 text-center text-xl font-bold text-foreground">{diceCount}</span>
              <button onClick={() => setDiceCount(Math.min(10, diceCount + 1))} className="rounded-lg bg-secondary px-3 py-2 text-muted-foreground hover:bg-secondary/80 transition-colors">+</button>
            </div>
          </div>
          <button onClick={roll} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <Shuffle className="h-4 w-4" /> {dict.diceRoller.roll}
          </button>
          {results.length > 0 && (
            <div className="mt-4 space-y-4">
              <div className="flex flex-wrap justify-center gap-3">
                {results.map((r, i) => (
                  <div key={i} className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-primary/30 bg-secondary/50 text-2xl font-bold text-foreground shadow-md">
                    <Dice5 className="h-8 w-8 text-primary" />
                    <span className="absolute text-sm font-bold text-foreground">{r}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-secondary/50 p-3 text-center">
                <p className="text-xs text-muted-foreground">{dict.diceRoller.total}</p>
                <p className="text-2xl font-bold text-foreground">{total}</p>
              </div>
              <div className="rounded-lg bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground mb-1">{dict.diceRoller.results}</p>
                <p className="text-sm text-foreground">{results.join(', ')}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
