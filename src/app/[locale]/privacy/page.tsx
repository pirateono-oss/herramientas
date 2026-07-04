import type { Metadata } from 'next';
import { isValidLocale, getDictionary } from '@/lib/i18n';
import type { Locale } from '@/lib/types';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isValidLocale(locale)) return {};
  const dict = getDictionary(locale as Locale);
  return { title: `Privacy Policy - ${dict.siteTitle}`, description: `Privacy policy for ${dict.siteTitle}.` };
}

const privacyContent: Record<string, { title: string; sections: { h: string; p: string }[] }> = {
  en: {
    title: 'Privacy Policy',
    sections: [
      { h: 'Information We Collect', p: 'We do not collect any personal information. Our website uses Google AdSense, which may use cookies. No registration or personal data is required.' },
      { h: 'Cookies', p: 'We use cookies solely for Google AdSense. Google AdSense uses cookies to serve relevant ads. You can opt out via Google Ads Settings.' },
      { h: 'Third-Party Services', p: 'We display ads through Google AdSense. Google may use cookies to collect information about your visits to provide relevant advertisements.' },
      { h: 'Data Security', p: 'We do not store, process, or share any personal data. All tools run directly in your browser.' },
      { h: 'Changes', p: 'We may update this policy from time to time. Changes will be posted here.' },
      { h: 'Contact', p: 'Questions? Contact us through the About page.' }
    ]
  },
  es: {
    title: 'Política de Privacidad',
    sections: [
      { h: 'Información que Recopilamos', p: 'No recopilamos información personal. Usamos Google AdSense, que puede usar cookies. No se requiere registro.' },
      { h: 'Cookies', p: 'Usamos cookies solo para Google AdSense. Google AdSense usa cookies para anuncios relevantes. Puedes optar por no recibir publicidad personalizada.' },
      { h: 'Servicios de Terceros', p: 'Mostramos anuncios a través de Google AdSense. Google puede usar cookies para proporcionar anuncios relevantes.' },
      { h: 'Seguridad de Datos', p: 'No almacenamos ni compartimos datos personales. Todas las herramientas funcionan en tu navegador.' },
      { h: 'Cambios', p: 'Podemos actualizar esta política. Los cambios se publicarán aquí.' },
      { h: 'Contacto', p: '¿Preguntas? Contáctanos a través de la página Acerca de.' }
    ]
  },
  pt: {
    title: 'Política de Privacidade',
    sections: [
      { h: 'Informações que Coletamos', p: 'Não coletamos informações pessoais. Usamos o Google AdSense, que pode usar cookies. Nenhum registro é necessário.' },
      { h: 'Cookies', p: 'Usamos cookies apenas para o Google AdSense. O Google AdSense usa cookies para anúncios relevantes. Você pode optar por não receber publicidade personalizada.' },
      { h: 'Serviços de Terceiros', p: 'Exibimos anúncios através do Google AdSense. O Google pode usar cookies para fornecer anúncios relevantes.' },
      { h: 'Segurança de Dados', p: 'Não armazenamos nem compartilhamos dados pessoais. Todas as ferramentas funcionam no seu navegador.' },
      { h: 'Alterações', p: 'Podemos atualizar esta política. As alterações serão publicadas aqui.' },
      { h: 'Contato', p: 'Dúvidas? Entre em contato através da página Sobre.' }
    ]
  }
};

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isValidLocale(locale)) return null;
  const dict = getDictionary(locale as Locale);
  const content = privacyContent[locale] || privacyContent.en;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">{content.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground"><strong>{dict.siteTitle}</strong> — {dict.siteTagline}</p>
      <div className="space-y-6">
        {content.sections.map((section, i) => (
          <section key={i}>
            <h2 className="mb-2 text-xl font-semibold text-foreground">{section.h}</h2>
            <p className="leading-relaxed text-muted-foreground">{section.p}</p>
          </section>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Last updated: 2026-07-04</p>
    </div>
  );
}
