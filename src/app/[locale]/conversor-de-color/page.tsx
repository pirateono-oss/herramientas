'use client';
import { useState, useMemo, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Palette, Copy, Check, RefreshCw } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (!/^[0-9a-fA-F]{6}$/.test(clean) && !/^[0-9a-fA-F]{3}$/.test(clean)) return null;
  let full = clean;
  if (full.length === 3) full = full.split('').map(c => c + c).join('');
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rs = r / 255, gs = g / 255, bs = b / 255;
  const max = Math.max(rs, gs, bs), min = Math.min(rs, gs, bs);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rs) h = ((gs - bs) / d + (gs < bs ? 6 : 0)) / 6;
    else if (max === gs) h = ((bs - rs) / d + 2) / 6;
    else h = ((rs - gs) / d + 4) / 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const s2 = s / 100, l2 = l / 100;
  const c = (1 - Math.abs(2 * l2 - 1)) * s2;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = l2 - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map(v => Math.round(v).toString(16).padStart(2, '0')).join('');
}

export default function ColorConverterPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [hexInput, setHexInput] = useState('#3498db');
  const [rgbInput, setRgbInput] = useState('52, 152, 219');
  const [hslInput, setHslInput] = useState('204, 70, 53');
  const [activeTab, setActiveTab] = useState<'hex' | 'rgb' | 'hsl'>('hex');
  const [copied, setCopied] = useState(false);

  const parseRgb = (s: string) => {
    const parts = s.split(',').map(v => parseInt(v.trim()));
    if (parts.length !== 3 || parts.some(v => isNaN(v))) return null;
    return { r: parts[0], g: parts[1], b: parts[2] };
  };

  const parseHsl = (s: string) => {
    const parts = s.split(',').map(v => parseInt(v.trim()));
    if (parts.length !== 3 || parts.some(v => isNaN(v))) return null;
    return { h: parts[0], s: parts[1], l: parts[2] };
  };

  const colorData = useMemo(() => {
    if (activeTab === 'hex') {
      const rgb = hexToRgb(hexInput);
      if (!rgb) return null;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { hex: hexInput.startsWith('#') ? hexInput : '#' + hexInput, rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`, hsl: `${hsl.h}, ${hsl.s}, ${hsl.l}`, rgbObj: rgb };
    }
    if (activeTab === 'rgb') {
      const rgb = parseRgb(rgbInput);
      if (!rgb) return null;
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      return { hex, rgb: rgbInput, hsl: `${hsl.h}, ${hsl.s}, ${hsl.l}`, rgbObj: rgb };
    }
    if (activeTab === 'hsl') {
      const hsl = parseHsl(hslInput);
      if (!hsl) return null;
      const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      return { hex, rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`, hsl: hslInput, rgbObj: rgb };
    }
    return null;
  }, [activeTab, hexInput, rgbInput, hslInput]);

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.colorConverter.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="space-y-4">
          {colorData && (
            <div className="flex items-center justify-center rounded-lg p-8 transition-colors" style={{ backgroundColor: colorData.hex }}>
              <span className="rounded bg-black/30 px-3 py-1 text-sm font-mono text-white shadow">{colorData.hex}</span>
            </div>
          )}
          <div className="flex gap-2">
            {(['hex', 'rgb', 'hsl'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                {dict.colorConverter[tab]}
              </button>
            ))}
          </div>
          {activeTab === 'hex' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.colorConverter.hex}</label>
              <input type="text" value={hexInput} onChange={(e) => setHexInput(e.target.value)} placeholder="#FF5733" className="w-full rounded-lg border border-border bg-background p-3 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          )}
          {activeTab === 'rgb' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.colorConverter.rgb}</label>
              <input type="text" value={rgbInput} onChange={(e) => setRgbInput(e.target.value)} placeholder="255, 87, 51" className="w-full rounded-lg border border-border bg-background p-3 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          )}
          {activeTab === 'hsl' && (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-foreground">{dict.colorConverter.hsl}</label>
              <input type="text" value={hslInput} onChange={(e) => setHslInput(e.target.value)} placeholder="11, 100, 60" className="w-full rounded-lg border border-border bg-background p-3 font-mono text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          )}
          {colorData && (
            <div className="space-y-2 rounded-lg bg-secondary/50 p-4">
              {(['hex', 'rgb', 'hsl'] as const).map((format) => {
                const val = colorData[format];
                return (
                  <div key={format} className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase">{format}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-foreground">{val}</span>
                      <button onClick={() => copyValue(val)} className="rounded p-1 text-muted-foreground hover:text-foreground transition-colors">
                        {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
