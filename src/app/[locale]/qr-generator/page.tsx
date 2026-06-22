'use client';
import { useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Download } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function QrGeneratorPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const [text, setText] = useState('');
  const svgRef = useRef<HTMLDivElement>(null);

  const downloadQr = () => {
    if (!svgRef.current || !text.trim()) return;
    const svg = svgRef.current.querySelector('svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const img = new Image();
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, 512, 512);
      ctx.drawImage(img, 32, 32, 448, 448);
      URL.revokeObjectURL(url);
      const a = document.createElement('a');
      a.download = 'qrcode.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = url;
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.qrGenerator.title}</h1>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={dict.qrGenerator.placeholder}
          className="mb-6 w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <div className="flex flex-col items-center gap-4">
          <div ref={svgRef} className="flex items-center justify-center rounded-lg bg-white p-4">
            {text.trim() ? (
              <QRCodeSVG value={text.trim()} size={256} level="M" />
            ) : (
              <div className="flex h-64 w-64 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground">
                QR Code
              </div>
            )}
          </div>
          {text.trim() && (
            <button onClick={downloadQr} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
              <Download className="h-4 w-4" /> {dict.qrGenerator.download}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
