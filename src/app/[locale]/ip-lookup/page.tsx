'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { RefreshCw, MapPin, Building2 } from 'lucide-react';

export default function IpLookupPage() {
  const params = useParams();
  const locale = params.locale as string;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);

  const titles: Record<string, string> = {
    en: 'What is my IP? - Find Your Public IP Address',
    es: '¿Cuál es mi IP? - Encuentra tu Dirección IP Pública',
    pt: 'Qual é o meu IP? - Descubra seu Endereço IP Público',
  };

  const [ip, setIp] = useState('');
  const [location, setLocation] = useState('');
  const [isp, setIsp] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchIp = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      setIp(data.ip || '');
      setLocation([data.city, data.region, data.country_name].filter(Boolean).join(', '));
      setIsp(data.org || '');
    } catch {
      try {
        const res = await fetch('https://api.ipify.org?format=json');
        const data = await res.json();
        setIp(data.ip);
        setLocation('Unknown');
        setIsp('Unknown');
      } catch { setIp('Error'); }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    document.title = titles[locale] || titles.en;
    fetchIp();
  }, [locale, fetchIp]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-bold text-foreground">{dict.ipLookup.title}</h1>
        <p className="text-muted-foreground">{dict.siteTagline}</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-8">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span>{dict.ipLookup.loading}</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-1 text-sm text-muted-foreground">{dict.ipLookup.yourIp}</p>
              <p className="text-3xl font-bold text-foreground">{ip}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{dict.ipLookup.location}</p>
                  <p className="font-medium text-foreground">{location}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-4">
                <Building2 className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">{dict.ipLookup.isp}</p>
                  <p className="font-medium text-foreground">{isp}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-center">
        <button onClick={fetchIp} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <RefreshCw className="h-4 w-4" /> Refresh
        </button>
      </div>
    </div>
  );
}
