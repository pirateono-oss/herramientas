'use client';
import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Copy, Check, Type, Hash } from 'lucide-react';

type CaseMode = 'uppercase' | 'lowercase' | 'titleCase' | 'sentenceCase';

export default function TextCaseConverterPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [input, setInput] = useState('');
  const [mode, setMode] = useState<CaseMode>('uppercase');
  const [copied, setCopied] = useState(false);

  const output = useMemo(() => {
    if (!input) return '';
    switch (mode) {
      case 'uppercase': return input.toUpperCase();
      case 'lowercase': return input.toLowerCase();
      case 'titleCase': return input.replace(/\b\w/g, (c) => c.toUpperCase());
      case 'sentenceCase': return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
    }
  }, [input, mode]);

  const stats = useMemo(() => ({
    chars: input.length,
    words: input.trim() ? input.trim().split(/\s+/).length : 0,
  }), [input]);

  const copyToClipboard = useCallback(() => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.textCaseConverter.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {(['uppercase', 'lowercase', 'titleCase', 'sentenceCase'] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === m ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                {dict.textCaseConverter[m]}
              </button>
            ))}
          </div>
          <div>
            <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-foreground">
              <Type className="h-4 w-4 text-primary" /> {dict.textCaseConverter.input}
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type or paste your text here..."
              rows={4}
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-y"
            />
            <div className="mt-1 flex gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> {dict.textCaseConverter.characterCount}: {stats.chars}</span>
              <span className="flex items-center gap-1"><Type className="h-3 w-3" /> {dict.textCaseConverter.wordCount}: {stats.words}</span>
            </div>
          </div>
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-medium text-foreground">
              <span className="flex items-center gap-2">
                <Copy className="h-4 w-4 text-primary" /> {dict.textCaseConverter.output}
              </span>
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                rows={4}
                className="w-full rounded-lg border border-border bg-secondary/30 p-3 text-foreground resize-y"
              />
              <button
                onClick={copyToClipboard}
                className="absolute right-2 top-2 flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? dict.textCaseConverter.copied : dict.textCaseConverter.copy}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
