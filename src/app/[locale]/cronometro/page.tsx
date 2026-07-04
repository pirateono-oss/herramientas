'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Play, Square, RotateCcw, Timer } from 'lucide-react';

export default function StopwatchPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [mode, setMode] = useState<'stopwatch' | 'countdown'>('stopwatch');
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [countdownInput, setCountdownInput] = useState({ m: '5', s: '0' });
  const [countdownTime, setCountdownTime] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setRunning(true);
  }, [clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setRunning(false);
  }, [clearTimer]);

  const reset = useCallback(() => {
    clearTimer();
    setRunning(false);
    setElapsed(0);
    setCountdownTime(0);
  }, [clearTimer]);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsed((prev) => prev + 100);
      } else {
        setCountdownTime((prev) => {
          if (prev <= 0) { clearTimer(); setRunning(false); return 0; }
          return prev - 100;
        });
      }
    }, 100);
    return clearTimer;
  }, [running, mode, clearTimer]);

  const startCountdown = () => {
    const m = parseInt(countdownInput.m) || 0;
    const s = parseInt(countdownInput.s) || 0;
    const total = (m * 60 + s) * 1000;
    if (total <= 0) return;
    setCountdownTime(total);
    start();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    const cs = Math.floor((ms % 1000) / 100);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${cs}`;
  };

  const displayTime = mode === 'stopwatch' ? elapsed : countdownTime;
  const isFinished = mode === 'countdown' && countdownTime <= 0 && !running;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.stopwatch.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="mb-6 flex gap-2">
          <button onClick={() => { reset(); setMode('stopwatch'); }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === 'stopwatch' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
            Stopwatch
          </button>
          <button onClick={() => { reset(); setMode('countdown'); }} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${mode === 'countdown' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
            {dict.stopwatch.countdownTitle}
          </button>
        </div>

        <div className="py-8 text-center">
          <p className={`font-mono text-6xl font-bold ${isFinished ? 'text-green-500 animate-pulse' : 'text-foreground'}`}>
            {formatTime(displayTime)}
          </p>
          {isFinished && <p className="mt-2 text-green-500 font-medium">Time's up!</p>}
        </div>

        {mode === 'countdown' && !running && (
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">{dict.stopwatch.minutes}</label>
              <input type="number" value={countdownInput.m} onChange={(e) => setCountdownInput(prev => ({ ...prev, m: e.target.value }))} min="0" max="99" className="w-full rounded-lg border border-border bg-background p-3 text-center text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">{dict.stopwatch.seconds}</label>
              <input type="number" value={countdownInput.s} onChange={(e) => setCountdownInput(prev => ({ ...prev, s: e.target.value }))} min="0" max="59" className="w-full rounded-lg border border-border bg-background p-3 text-center text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
        )}

        <div className="flex justify-center gap-3">
          {!running ? (
            <button onClick={mode === 'countdown' ? startCountdown : start} className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Play className="h-5 w-5" /> {dict.stopwatch.start}
            </button>
          ) : (
            <button onClick={stop} className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-yellow-600">
              <Square className="h-5 w-5" /> {dict.stopwatch.stop}
            </button>
          )}
          <button onClick={reset} className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80">
            <RotateCcw className="h-4 w-4" /> {dict.stopwatch.reset}
          </button>
        </div>
      </div>
    </div>
  );
}
