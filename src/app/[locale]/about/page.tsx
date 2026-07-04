import type { Metadata } from 'next';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';
import { Mail, Wrench } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: `About - ${dict.siteTitle}`, description: `About ${dict.siteTitle} - ${dict.siteTagline}` };
}

const aboutContent: Record<string, { title: string; intro: string; sections: { h: string; p: string }[] }> = {
  en: {
    title: 'About Us',
    intro: 'A collection of free online tools including calculators, converters, generators and more!',
    sections: [
      { h: 'What We Offer', p: 'A collection of free online tools including calculators, converters, generators and more. All tools work instantly in your browser.' },
      { h: 'Our Mission', p: 'Our goal is to provide useful, free tools that anyone can use without registration or downloads. All tools work directly in your browser on any device.' },
      { h: 'Contact', p: 'Have a suggestion or feedback? We\'d love to hear from you! Reach out to us at:' }
    ]
  },
  es: {
    title: 'Acerca de Nosotros',
    intro: 'Una colección de herramientas gratuitas online incluyendo calculadoras, conversores, generadores y más!',
    sections: [
      { h: 'Lo que Ofrecemos', p: 'Una colección de herramientas gratuitas online incluyendo calculadoras, conversores, generadores y más. Todas las herramientas funcionan al instante.' },
      { h: 'Nuestra Misión', p: 'Nuestro objetivo es proporcionar herramientas útiles y gratuitas que cualquiera pueda usar sin registro ni descargas. Todas las herramientas funcionan directamente en tu navegador.' },
      { h: 'Contacto', p: '¿Tienes una sugerencia o comentarios? ¡Nos encantaría saber de ti! Escríbenos a:' }
    ]
  },
  pt: {
    title: 'Sobre Nós',
    intro: 'Uma coleção de ferramentas online gratuitas incluindo calculadoras, conversores, geradores e mais!',
    sections: [
      { h: 'O que Oferecemos', p: 'Uma coleção de ferramentas online gratuitas incluindo calculadoras, conversores, geradores e mais. Todas as ferramentas funcionam instantaneamente.' },
      { h: 'Nossa Missão', p: 'Nosso objetivo é fornecer ferramentas úteis e gratuitas que qualquer pessoa possa usar sem registro ou downloads. Todas as ferramentas funcionam diretamente no seu navegador.' },
      { h: 'Contato', p: 'Tem uma sugestão ou feedback? Adoraríamos ouvir você! Entre em contato pelo e-mail:' }
    ]
  }
};

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);
  const content = aboutContent[locale] || aboutContent.en;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 text-center">
        <Wrench className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="mb-2 text-3xl font-bold text-foreground">{content.title}</h1>
        <p className="text-lg text-muted-foreground">{content.intro}</p>
      </div>
      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <section key={i}>
            <h2 className="mb-2 text-xl font-semibold text-foreground">{section.h}</h2>
            <p className="leading-relaxed text-muted-foreground">{section.p}</p>
          </section>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-card p-4">
        <Mail className="h-5 w-5 text-primary" />
        <a href="mailto:contact@herramientas-zigq.vercel.app" className="text-primary hover:underline">contact@herramientas-zigq.vercel.app</a>
      </div>
    </div>
  );
}
