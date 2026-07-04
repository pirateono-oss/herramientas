'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Thermometer, Ruler, Weight, ArrowRight } from 'lucide-react';

type Category = 'temperature' | 'length' | 'weight';

const units: Record<Category, { label: string; value: string }[]> = {
  temperature: [
    { label: '°C', value: 'celsius' },
    { label: '°F', value: 'fahrenheit' },
    { label: 'K', value: 'kelvin' },
  ],
  length: [
    { label: 'mm', value: 'mm' },
    { label: 'cm', value: 'cm' },
    { label: 'm', value: 'm' },
    { label: 'km', value: 'km' },
    { label: 'in', value: 'in' },
    { label: 'ft', value: 'ft' },
    { label: 'yd', value: 'yd' },
    { label: 'mi', value: 'mi' },
  ],
  weight: [
    { label: 'mg', value: 'mg' },
    { label: 'g', value: 'g' },
    { label: 'kg', value: 'kg' },
    { label: 'oz', value: 'oz' },
    { label: 'lb', value: 'lb' },
  ],
};

function convertTemperature(value: number, from: string, to: string): number {
  let celsius: number;
  if (from === 'celsius') celsius = value;
  else if (from === 'fahrenheit') celsius = (value - 32) * 5 / 9;
  else celsius = value - 273.15;

  if (to === 'celsius') return celsius;
  if (to === 'fahrenheit') return celsius * 9 / 5 + 32;
  return celsius + 273.15;
}

const lengthToMeters: Record<string, number> = {
  mm: 0.001, cm: 0.01, m: 1, km: 1000,
  in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
};

function convertLength(value: number, from: string, to: string): number {
  const meters = value * lengthToMeters[from];
  return meters / lengthToMeters[to];
}

const weightToKg: Record<string, number> = {
  mg: 0.000001, g: 0.001, kg: 1, oz: 0.0283495, lb: 0.453592,
};

function convertWeight(value: number, from: string, to: string): number {
  const kg = value * weightToKg[from];
  return kg / weightToKg[to];
}

export default function UnitConverterPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [category, setCategory] = useState<Category>('temperature');
  const [from, setFrom] = useState('celsius');
  const [to, setTo] = useState('fahrenheit');
  const [value, setValue] = useState('');

  const availableUnits = units[category];

  // Set defaults when category changes
  const switchCategory = (cat: Category) => {
    setCategory(cat);
    setFrom(units[cat][0].value);
    setTo(units[cat][1]?.value || units[cat][0].value);
  };

  const result = useMemo(() => {
    const v = parseFloat(value);
    if (isNaN(v) || !from || !to) return null;
    if (category === 'temperature') return convertTemperature(v, from, to);
    if (category === 'length') return convertLength(v, from, to);
    return convertWeight(v, from, to);
  }, [value, from, to, category]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.unitConverter.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            {(['temperature', 'length', 'weight'] as const).map((cat) => (
              <button key={cat} onClick={() => switchCategory(cat)} className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${category === cat ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                {cat === 'temperature' ? <Thermometer className="h-3.5 w-3.5" /> : cat === 'length' ? <Ruler className="h-3.5 w-3.5" /> : <Weight className="h-3.5 w-3.5" />}
                {dict.unitConverter[cat]}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.unitConverter.value}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="100"
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.unitConverter.from}</label>
              <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                {availableUnits.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.unitConverter.to}</label>
              <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                {availableUnits.map((u) => <option key={u.value} value={u.value}>{u.label}</option>)}
              </select>
            </div>
          </div>
          {result !== null && (
            <div className="mt-4 flex items-center justify-center gap-3 rounded-lg bg-secondary/50 p-4">
              <span className="text-lg text-muted-foreground">{value} {units[category].find(u => u.value === from)?.label}</span>
              <ArrowRight className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold text-foreground">{result.toLocaleString(undefined, { maximumFractionDigits: 6 })} {units[category].find(u => u.value === to)?.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
