export type Locale = 'en' | 'es' | 'pt';

export type ToolId = 'ip-lookup' | 'password-generator' | 'word-counter' | 'qr-generator'
  | 'calculadora-de-imc' | 'calculadora-de-edad' | 'calculadora-de-porcentaje'
  | 'calculadora-de-propinas' | 'conversor-de-unidades' | 'cronometro'
  | 'lanzador-de-dados' | 'lanzar-moneda' | 'conversor-de-color' | 'convertir-texto';

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
  bmiCalculator: {
    title: string;
    height: string;
    weight: string;
    calculate: string;
    result: string;
    category: string;
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
    cm: string;
    kg: string;
  };
  ageCalculator: {
    title: string;
    birthDate: string;
    calculate: string;
    years: string;
    months: string;
    days: string;
    totalDays: string;
    age: string;
  };
  percentageCalculator: {
    title: string;
    whatIs: string;
    of: string;
    is: string;
    percent: string;
    calculate: string;
    result: string;
  };
  tipCalculator: {
    title: string;
    billAmount: string;
    tipPercentage: string;
    tipAmount: string;
    totalAmount: string;
    calculate: string;
    perPerson: string;
    people: string;
    eachPays: string;
  };
  unitConverter: {
    title: string;
    from: string;
    to: string;
    value: string;
    convert: string;
    temperature: string;
    length: string;
    weight: string;
    result: string;
  };
  stopwatch: {
    title: string;
    start: string;
    stop: string;
    reset: string;
    countdownTitle: string;
    minutes: string;
    seconds: string;
    setTime: string;
  };
  diceRoller: {
    title: string;
    roll: string;
    total: string;
    results: string;
    diceCount: string;
  };
  coinFlip: {
    title: string;
    flip: string;
    heads: string;
    tails: string;
    result: string;
    times: string;
    headsCount: string;
    tailsCount: string;
  };
  colorConverter: {
    title: string;
    hex: string;
    rgb: string;
    hsl: string;
    convert: string;
    preview: string;
    copied: string;
  };
  textCaseConverter: {
    title: string;
    input: string;
    output: string;
    uppercase: string;
    lowercase: string;
    titleCase: string;
    sentenceCase: string;
    copy: string;
    copied: string;
    characterCount: string;
    wordCount: string;
  };
};
