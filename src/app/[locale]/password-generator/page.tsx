'use client';
import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Copy, Check, RefreshCw } from 'lucide-react';

export default function PasswordGeneratorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const num = '0123456789';
    const sym = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    let chars = '';
    if (uppercase) chars += upper;
    if (lowercase) chars += lower;
    if (numbers) chars += num;
    if (symbols) chars += sym;
    if (!chars) return;
    let result = '';
    for (let i = 0; i < length; i++) result += chars[Math.floor(Math.random() * chars.length)];
    setPassword(result);
    setCopied(false);
  }, [length, uppercase, lowercase, numbers, symbols]);

  const copyToClipboard = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.passwordGenerator.title}</h1>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        {password && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-secondary/50 p-4">
            <code className="flex-1 break-all text-lg font-mono text-foreground">{password}</code>
            <button onClick={copyToClipboard} className="shrink-0 rounded-lg bg-primary p-2 text-primary-foreground transition-colors hover:bg-primary/90">
              {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            </button>
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="mb-1 flex items-center justify-between text-sm text-foreground">
              <span>{dict.passwordGenerator.length}: {length}</span>
            </label>
            <input type="range" min="4" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-primary" />
          </div>
          {([
            ['uppercase', uppercase, setUppercase],
            ['lowercase', lowercase, setLowercase],
            ['numbers', numbers, setNumbers],
            ['symbols', symbols, setSymbols],
          ] as const).map(([key, val, setter]) => (
            <label key={key} className="flex items-center gap-3 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={val} onChange={() => setter(!val)} className="rounded border-border accent-primary" />
              <span>{
                key === 'uppercase' ? dict.passwordGenerator.includeUppercase :
                key === 'lowercase' ? dict.passwordGenerator.includeLowercase :
                key === 'numbers' ? dict.passwordGenerator.includeNumbers :
                dict.passwordGenerator.includeSymbols
              }</span>
            </label>
          ))}
          <button onClick={generate} className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
            <RefreshCw className="h-4 w-4" /> {dict.passwordGenerator.generate}
          </button>
        </div>
      </div>
    </div>
  );
}
