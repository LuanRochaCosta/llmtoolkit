// Pricing data verified against official provider pages on 2026-08-25.
// Verification discipline (see README): every row carries source + lastChecked;
// rows that could not be traced to an official page are marked verified: false.
// Monthly full re-verification: 1st of each month.

export interface LLMModel {
  id: string;
  provider: 'OpenAI' | 'Anthropic' | 'Google';
  name: string;
  contextWindow: number;
  inputPer1M: number | null;
  outputPer1M: number | null;
  cachedInputPer1M?: number | null;
  freeTier?: boolean;
  verified: boolean;
  lastChecked: string;
  source: string;
}

const OPENAI_OFFICIAL = 'https://developers.openai.com/api/docs/pricing.md';
const ANTHROPIC_OFFICIAL = 'https://platform.claude.com/docs/en/about-claude/pricing';
const GOOGLE_OFFICIAL = 'https://ai.google.dev/gemini-api/docs/pricing';

export const models: LLMModel[] = [
  // ---------- OpenAI ----------
  {
    id: 'gpt-5',
    provider: 'OpenAI',
    name: 'GPT-5',
    contextWindow: 400_000,
    inputPer1M: 1.25,
    outputPer1M: 10.0,
    cachedInputPer1M: 0.125,
    verified: true,
    lastChecked: '2026-08-25',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-mini',
    provider: 'OpenAI',
    name: 'GPT-5 mini',
    contextWindow: 400_000,
    inputPer1M: 0.25,
    outputPer1M: 2.0,
    cachedInputPer1M: 0.025,
    verified: true,
    lastChecked: '2026-08-25',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-nano',
    provider: 'OpenAI',
    name: 'GPT-5 nano',
    contextWindow: 400_000,
    inputPer1M: 0.05,
    outputPer1M: 0.4,
    cachedInputPer1M: 0.005,
    verified: true,
    lastChecked: '2026-08-25',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-4-mini',
    provider: 'OpenAI',
    name: 'GPT-5.4 mini',
    contextWindow: 400_000,
    inputPer1M: 0.75,
    outputPer1M: 4.5,
    cachedInputPer1M: 0.075,
    verified: true,
    lastChecked: '2026-08-25',
    source: 'https://community.openai.com/t/introducing-gpt-5-4-mini-and-nano-our-most-capable-small-models-yet/1377015/1',
  },
  {
    id: 'gpt-5-4-nano',
    provider: 'OpenAI',
    name: 'GPT-5.4 nano',
    contextWindow: 400_000,
    inputPer1M: 0.2,
    outputPer1M: 1.25,
    cachedInputPer1M: 0.02,
    verified: true,
    lastChecked: '2026-08-25',
    source: 'https://openai.com/api/pricing/',
  },
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    name: 'GPT-4o',
    contextWindow: 128_000,
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    cachedInputPer1M: 0.625,
    verified: true,
    lastChecked: '2026-08-25',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    name: 'GPT-4o mini',
    contextWindow: 128_000,
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    cachedInputPer1M: 0.0375,
    verified: true,
    lastChecked: '2026-08-25',
    source: OPENAI_OFFICIAL,
  },
  // ---------- Anthropic ----------
  {
    id: 'claude-opus-5',
    provider: 'Anthropic',
    name: 'Claude Opus 5',
    contextWindow: 200_000,
    inputPer1M: 5.0,
    outputPer1M: 25.0,
    cachedInputPer1M: 0.5,
    verified: true,
    lastChecked: '2026-08-25',
    source: ANTHROPIC_OFFICIAL,
  },
  {
    id: 'claude-sonnet-5',
    provider: 'Anthropic',
    name: 'Claude Sonnet 5',
    contextWindow: 200_000,
    inputPer1M: 3.0,
    outputPer1M: 15.0,
    cachedInputPer1M: 0.3,
    verified: true,
    lastChecked: '2026-08-25',
    source: ANTHROPIC_OFFICIAL,
  },
  {
    id: 'claude-haiku-4-5',
    provider: 'Anthropic',
    name: 'Claude Haiku 4.5',
    contextWindow: 200_000,
    inputPer1M: 1.0,
    outputPer1M: 5.0,
    cachedInputPer1M: 0.1,
    verified: true,
    lastChecked: '2026-08-25',
    source: ANTHROPIC_OFFICIAL,
  },
  // ---------- Google ----------
  {
    id: 'gemini-3-5-flash',
    provider: 'Google',
    name: 'Gemini 3.5 Flash',
    contextWindow: 1_000_000,
    inputPer1M: 1.5,
    outputPer1M: 9.0,
    verified: true,
    lastChecked: '2026-08-25',
    source: GOOGLE_OFFICIAL,
  },
  {
    id: 'gemini-3-1-flash-lite',
    provider: 'Google',
    name: 'Gemini 3.1 Flash-Lite',
    contextWindow: 1_000_000,
    inputPer1M: 0.25,
    outputPer1M: 1.5,
    verified: false,
    lastChecked: '2026-08-25',
    source: 'https://curlscape.com/blog/google-gemini-api-pricing-guide-2026',
  },
];

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '—';
  return `$${price.toFixed(2)}`;
}
