'use client';
import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Coins, RefreshCw } from 'lucide-react';

export default function CoinFlipPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [flips, setFlips] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const flip = useCallback(() => {
    setAnimating(true);
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    setTimeout(() => {
      setFlips((prev) => [result, ...prev].slice(0, 50));
      setAnimating(false);
    }, 400);
  }, []);

  const stats = useMemo(() => {
    const heads = flips.filter((f) => f === 'heads').length;
    const tails = flips.filter((f) => f === 'tails').length;
    return { heads, tails, total: flips.length };
  }, [flips]);

  const lastResult = flips[0];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.coinFlip.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className={`flex h-32 w-32 items-center justify-center rounded-full border-4 transition-all duration-300 ${animating ? 'animate-spin border-primary' : lastResult === 'heads' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-400 bg-gray-100 dark:bg-gray-800'}`}>
              <Coins className={`h-12 w-12 transition-colors ${lastResult ? 'text-foreground' : 'text-muted-foreground'}`} />
            </div>
          </div>
          {lastResult && !animating && (
            <p className="text-center text-xl font-bold text-foreground">
              {lastResult === 'heads' ? dict.coinFlip.heads : dict.coinFlip.tails}!
            </p>
          )}
          <button onClick={flip} disabled={animating} className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${animating ? 'animate-spin' : ''}`} /> {dict.coinFlip.flip}
          </button>
          {stats.total > 0 && (
            <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{dict.coinFlip.times}: <strong className="text-foreground">{stats.total}</strong></span>
              </div>
              <div className="flex gap-4">
                <div className="flex-1 rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{dict.coinFlip.heads}</p>
                  <p className="text-lg font-bold text-yellow-500">{stats.heads}</p>
                  <p className="text-xs text-muted-foreground">{stats.total > 0 ? Math.round((stats.heads / stats.total) * 100) : 0}%</p>
                </div>
                <div className="flex-1 rounded-lg bg-secondary/50 p-3 text-center">
                  <p className="text-xs text-muted-foreground">{dict.coinFlip.tails}</p>
                  <p className="text-lg font-bold text-gray-500">{stats.tails}</p>
                  <p className="text-xs text-muted-foreground">{stats.total > 0 ? Math.round((stats.tails / stats.total) * 100) : 0}%</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
