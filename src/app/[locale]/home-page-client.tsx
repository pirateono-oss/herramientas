'use client';
import Link from 'next/link';
import type { Locale, TranslationDict, ToolId } from '@/lib/types';
import { Wifi, Key, FileText, QrCode } from 'lucide-react';

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
        <h1 className="mb-3 text-4xl font-bold text-foreground">{dict.siteTitle}</h1>
        <p className="text-lg text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        {tools.map(([id, tool]) => (
          <Link
            key={id}
            href={`/${locale}/${id}`}
            className="group flex items-start gap-4 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
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
