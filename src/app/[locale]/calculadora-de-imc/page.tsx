'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Weight, Ruler, Activity } from 'lucide-react';

export default function BmiCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const bmi = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w || h <= 0 || w <= 0) return null;
    const hMeters = h / 100;
    return w / (hMeters * hMeters);
  }, [height, weight]);

  const category = useMemo(() => {
    if (bmi === null) return null;
    if (bmi < 18.5) return { label: dict.bmiCalculator.underweight, color: 'text-blue-500' };
    if (bmi < 25) return { label: dict.bmiCalculator.normal, color: 'text-green-500' };
    if (bmi < 30) return { label: dict.bmiCalculator.overweight, color: 'text-yellow-500' };
    return { label: dict.bmiCalculator.obese, color: 'text-red-500' };
  }, [bmi, dict]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.bmiCalculator.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Ruler className="h-4 w-4 text-primary" /> {dict.bmiCalculator.height} ({dict.bmiCalculator.cm})
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              min="50"
              max="300"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Weight className="h-4 w-4 text-primary" /> {dict.bmiCalculator.weight} ({dict.bmiCalculator.kg})
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              min="1"
              max="500"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {bmi !== null && category && (
            <div className="mt-6 rounded-lg bg-secondary/50 p-6 text-center">
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <Activity className="h-5 w-5 text-primary" />
                <span>{dict.bmiCalculator.result}</span>
              </div>
              <p className="mt-2 text-5xl font-bold text-foreground">{bmi.toFixed(1)}</p>
              <p className={`mt-2 text-lg font-medium ${category.color}`}>{category.label}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
