'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Calendar, Clock, Heart } from 'lucide-react';

export default function AgeCalculatorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [birthDate, setBirthDate] = useState('');

  const age = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    if (isNaN(birth.getTime()) || birth >= today) return null;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const totalDays = Math.floor((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    return { years, months, days, totalDays };
  }, [birthDate]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.ageCalculator.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Calendar className="h-4 w-4 text-primary" /> {dict.ageCalculator.birthDate}
            </label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {age && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
                <Heart className="h-5 w-5 text-primary" />
                <span>{dict.ageCalculator.age}</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{age.years}</p>
                  <p className="text-xs text-muted-foreground">{dict.ageCalculator.years}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{age.months}</p>
                  <p className="text-xs text-muted-foreground">{dict.ageCalculator.months}</p>
                </div>
                <div className="rounded-lg bg-secondary/50 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{age.days}</p>
                  <p className="text-xs text-muted-foreground">{dict.ageCalculator.days}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 rounded-lg bg-secondary/30 p-3">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">{dict.ageCalculator.totalDays}: <strong className="text-foreground">{age.totalDays.toLocaleString()}</strong></span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
