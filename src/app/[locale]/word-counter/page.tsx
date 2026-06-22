'use client';
import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Type, Hash, Minus, Quote, Pilcrow, Clock } from 'lucide-react';

export default function WordCounterPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = trimmed ? trimmed.split(/[.!?]+/).filter(Boolean).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/).filter(Boolean).length : 0;
    const readingTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, charsNoSpaces, sentences, paragraphs, readingTime };
  }, [text]);

  const items = [
    { icon: Type, label: dict.wordCounter.words, value: stats.words },
    { icon: Hash, label: dict.wordCounter.characters, value: stats.chars },
    { icon: Minus, label: dict.wordCounter.charactersNoSpaces, value: stats.charsNoSpaces },
    { icon: Quote, label: dict.wordCounter.sentences, value: stats.sentences },
    { icon: Pilcrow, label: dict.wordCounter.paragraphs, value: stats.paragraphs },
    { icon: Clock, label: dict.wordCounter.readingTime, value: `${stats.readingTime} min` },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.wordCounter.title}</h1>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={dict.wordCounter.placeholder}
        className="mb-6 h-48 w-full rounded-xl border border-border bg-card p-4 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-4 text-center">
            <Icon className="mx-auto mb-2 h-5 w-5 text-primary" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
