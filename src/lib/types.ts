export type Locale = 'en' | 'es' | 'pt';

export type ToolId = 'ip-lookup' | 'password-generator' | 'word-counter' | 'qr-generator';

export type TranslationDict = {
  siteTitle: string;
  siteTagline: string;
  home: string;
  tools: string;
  language: string;
  allRightsReserved: string;
  toolsList: Record<ToolId, { title: string; desc: string }>;
  ipLookup: {
    title: string;
    yourIp: string;
    location: string;
    isp: string;
    loading: string;
    error: string;
  };
  passwordGenerator: {
    title: string;
    length: string;
    includeUppercase: string;
    includeLowercase: string;
    includeNumbers: string;
    includeSymbols: string;
    generate: string;
    copied: string;
    copy: string;
  };
  wordCounter: {
    title: string;
    placeholder: string;
    words: string;
    characters: string;
    charactersNoSpaces: string;
    sentences: string;
    paragraphs: string;
    readingTime: string;
  };
  qrGenerator: {
    title: string;
    placeholder: string;
    download: string;
  };
};
