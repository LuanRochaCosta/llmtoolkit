// Pricing data verified against official provider pages on 2026-08-26.
// Verification discipline (see README): every row carries source + lastChecked;
// rows that could not be traced to an official page are marked verified: false.
// Monthly full re-verification: 1st of each month.
//
// 2026-08-26 full re-verification notes:
// - Claude Sonnet 5 corrected to $2/$10: Anthropic cancelled the scheduled
//   Sept 1 increase to $3/$15 — the $2/$10 intro price is now standard.
// - GPT-4o cached input corrected to $1.25; GPT-4o mini cached to $0.075.
// - Gemini 3.1 Flash-Lite removed (no longer on Google's pricing page);
//   replaced by Gemini 3.5 Flash-Lite ($0.30/$2.50).
// - Added current generations: GPT-5.6 family, GPT-5.5, GPT-5.4, GPT-5.2,
//   o3, o4-mini, Claude Fable 5, Gemini 3.7 Flash.
// - Claude 5-series context windows corrected to 1M: Anthropic's pricing page
//   states Claude 4.6 and later include the full 1M token context window at
//   standard pricing. Haiku 4.5 (pre-4.6) remains at 200K.

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
  note?: string;
  charsPerToken?: number;
}

const OPENAI_OFFICIAL = 'https://developers.openai.com/api/docs/pricing.md';
const ANTHROPIC_OFFICIAL = 'https://platform.claude.com/docs/en/about-claude/pricing';
const GOOGLE_OFFICIAL = 'https://ai.google.dev/gemini-api/docs/pricing';

export const models: LLMModel[] = [
  // ---------- OpenAI ----------
  {
    id: 'gpt-5-6-sol',
    provider: 'OpenAI',
    name: 'GPT-5.6 Sol',
    contextWindow: 400_000,
    inputPer1M: 4.0,
    outputPer1M: 20.0,
    cachedInputPer1M: 0.4,
    verified: true,
    lastChecked: '2026-09-02',
    source: OPENAI_OFFICIAL,
    note: 'Promotional pricing at least through Nov 21, 2026; long-context tier $8 in / $30 out',
  },
  {
    id: 'gpt-5-6-terra',
    provider: 'OpenAI',
    name: 'GPT-5.6 Terra',
    contextWindow: 400_000,
    inputPer1M: 2.0,
    outputPer1M: 12.0,
    cachedInputPer1M: 0.2,
    verified: true,
    lastChecked: '2026-09-02',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-6-luna',
    provider: 'OpenAI',
    name: 'GPT-5.6 Luna',
    contextWindow: 400_000,
    inputPer1M: 0.2,
    outputPer1M: 1.2,
    cachedInputPer1M: 0.02,
    verified: true,
    lastChecked: '2026-09-02',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-5',
    provider: 'OpenAI',
    name: 'GPT-5.5',
    contextWindow: 400_000,
    inputPer1M: 5.0,
    outputPer1M: 30.0,
    cachedInputPer1M: 0.5,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-4',
    provider: 'OpenAI',
    name: 'GPT-5.4',
    contextWindow: 400_000,
    inputPer1M: 2.5,
    outputPer1M: 15.0,
    cachedInputPer1M: 0.25,
    verified: true,
    lastChecked: '2026-08-26',
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
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
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
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5-2',
    provider: 'OpenAI',
    name: 'GPT-5.2',
    contextWindow: 400_000,
    inputPer1M: 1.75,
    outputPer1M: 14.0,
    cachedInputPer1M: 0.175,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-5',
    provider: 'OpenAI',
    name: 'GPT-5',
    contextWindow: 400_000,
    inputPer1M: 1.25,
    outputPer1M: 10.0,
    cachedInputPer1M: 0.125,
    verified: true,
    lastChecked: '2026-08-26',
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
    lastChecked: '2026-08-26',
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
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-4o',
    provider: 'OpenAI',
    name: 'GPT-4o',
    contextWindow: 128_000,
    inputPer1M: 2.5,
    outputPer1M: 10.0,
    cachedInputPer1M: 1.25,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'gpt-4o-mini',
    provider: 'OpenAI',
    name: 'GPT-4o mini',
    contextWindow: 128_000,
    inputPer1M: 0.15,
    outputPer1M: 0.6,
    cachedInputPer1M: 0.075,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'o3',
    provider: 'OpenAI',
    name: 'o3',
    contextWindow: 200_000,
    inputPer1M: 2.0,
    outputPer1M: 8.0,
    cachedInputPer1M: 0.5,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  {
    id: 'o4-mini',
    provider: 'OpenAI',
    name: 'o4-mini',
    contextWindow: 200_000,
    inputPer1M: 1.1,
    outputPer1M: 4.4,
    cachedInputPer1M: 0.275,
    verified: true,
    lastChecked: '2026-08-26',
    source: OPENAI_OFFICIAL,
  },
  // ---------- Anthropic ----------
  {
    id: 'claude-fable-5',
    provider: 'Anthropic',
    name: 'Claude Fable 5',
    contextWindow: 1_000_000,
    inputPer1M: 10.0,
    outputPer1M: 50.0,
    cachedInputPer1M: 1.0,
    verified: true,
    lastChecked: '2026-09-02',
    source: ANTHROPIC_OFFICIAL,
    charsPerToken: 2.7,
  },
  {
    id: 'claude-opus-5',
    provider: 'Anthropic',
    name: 'Claude Opus 5',
    contextWindow: 1_000_000,
    inputPer1M: 5.0,
    outputPer1M: 25.0,
    cachedInputPer1M: 0.5,
    verified: true,
    lastChecked: '2026-09-02',
    source: ANTHROPIC_OFFICIAL,
    charsPerToken: 2.7,
  },
  {
    id: 'claude-sonnet-5',
    provider: 'Anthropic',
    name: 'Claude Sonnet 5',
    contextWindow: 1_000_000,
    inputPer1M: 2.0,
    outputPer1M: 10.0,
    cachedInputPer1M: 0.2,
    verified: true,
    lastChecked: '2026-09-02',
    source: ANTHROPIC_OFFICIAL,
    charsPerToken: 2.7,
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
    lastChecked: '2026-09-02',
    source: ANTHROPIC_OFFICIAL,
    charsPerToken: 3.5,
  },
  // ---------- Google ----------
  {
    id: 'gemini-3-7-flash',
    provider: 'Google',
    name: 'Gemini 3.7 Flash',
    contextWindow: 1_000_000,
    inputPer1M: 0.75,
    outputPer1M: 3.75,
    cachedInputPer1M: 0.075,
    verified: true,
    lastChecked: '2026-09-02',
    source: GOOGLE_OFFICIAL,
    note: 'Intro pricing through Dec 31, 2026 — rises to $1.50 in / $7.50 out on Jan 1, 2027',
  },
  {
    id: 'gemini-3-5-flash',
    provider: 'Google',
    name: 'Gemini 3.5 Flash',
    contextWindow: 1_000_000,
    inputPer1M: 1.5,
    outputPer1M: 9.0,
    cachedInputPer1M: 0.15,
    verified: true,
    lastChecked: '2026-09-02',
    source: GOOGLE_OFFICIAL,
  },
  {
    id: 'gemini-3-5-flash-lite',
    provider: 'Google',
    name: 'Gemini 3.5 Flash-Lite',
    contextWindow: 1_000_000,
    inputPer1M: 0.3,
    outputPer1M: 2.5,
    cachedInputPer1M: 0.03,
    verified: true,
    lastChecked: '2026-09-02',
    source: GOOGLE_OFFICIAL,
  },
];

export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return '—';
  return `$${price.toFixed(2)}`;
}
