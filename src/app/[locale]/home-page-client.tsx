'use client';
import Link from 'next/link';
import type { Locale, TranslationDict, ToolId } from '@/lib/types';
import { Wifi, Key, FileText, QrCode, Wrench } from 'lucide-react';

const toolIcons: Record<ToolId, React.ReactNode> = {
  'ip-lookup': <Wifi className="h-8 w-8" />,
  'password-generator': <Key className="h-8 w-8" />,
  'word-counter': <FileText className="h-8 w-8" />,
  'qr-generator': <QrCode className="h-8 w-8" />,
};

interface Props { locale: Locale; dict: TranslationDict; }

export function HomePageClient({ locale, dict }: Props) {
  const tools = Object.entries(dict.toolsList) as [ToolId, { title: string; desc: string }][];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-12 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl tool-icon shadow-lg">
          <Wrench className="h-8 w-8 text-white" />
        </div>
        <h1 className="mb-3 text-4xl font-bold text-foreground sm:text-5xl">{dict.siteTitle}</h1>
        <p className="text-lg text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map(([id, tool]) => (
          <Link
            key={id}
            href={`/${locale}/${id}`}
            className="tool-card group flex items-start gap-4 rounded-xl border border-border bg-card p-6"
          >
            <div className="tool-icon flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-md">
              {toolIcons[id]}
            </div>
            <div>
              <h2 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h2>
              <p className="text-sm text-muted-foreground">{tool.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
