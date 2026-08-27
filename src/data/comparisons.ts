import { models, type LLMModel } from './models';

export interface ComparePair {
  slug: string;
  a: LLMModel;
  b: LLMModel;
}

const PAIR_IDS: [string, string][] = [
  ['gpt-5', 'claude-opus-5'],
  ['gpt-5-mini', 'claude-sonnet-5'],
  ['gpt-5-nano', 'claude-haiku-4-5'],
  ['gpt-5', 'gemini-3-5-flash'],
  ['gemini-3-5-flash', 'gpt-5-mini'],
  ['gemini-3-5-flash', 'claude-sonnet-5'],
  ['claude-opus-5', 'gemini-3-5-flash'],
  ['gpt-5', 'gpt-5-mini'],
  ['gpt-5-mini', 'gpt-5-nano'],
  ['gpt-5', 'gpt-4o'],
  ['claude-opus-5', 'claude-sonnet-5'],
  ['claude-sonnet-5', 'claude-haiku-4-5'],
  ['gpt-4o', 'claude-sonnet-5'],
  ['gpt-4o-mini', 'gpt-5-nano'],
  ['gpt-4o', 'gpt-4o-mini'],
  ['gemini-3-5-flash', 'gemini-3-5-flash-lite'],
];

function byId(id: string): LLMModel | undefined {
  return models.find((m) => m.id === id);
}

export const comparePairs: ComparePair[] = PAIR_IDS.flatMap(([aId, bId]) => {
  const a = byId(aId);
  const b = byId(bId);
  if (!a || !b) return [];
  return [{ slug: `${aId}-vs-${bId}`, a, b }];
});

export interface CostScenario {
  label: string;
  requests: number;
  tokensIn: number;
  tokensOut: number;
  cacheRate: number;
}

export const costScenarios: CostScenario[] = [
  { label: 'Side-project chatbot', requests: 30_000, tokensIn: 2_000, tokensOut: 500, cacheRate: 0.4 },
  { label: 'Coding agent', requests: 500_000, tokensIn: 12_000, tokensOut: 1_500, cacheRate: 0.7 },
  { label: 'Bulk extraction', requests: 2_000_000, tokensIn: 800, tokensOut: 120, cacheRate: 0.2 },
];

export function monthlyCost(m: LLMModel, s: CostScenario): number {
  if (m.inputPer1M === null || m.outputPer1M === null) return NaN;
  const effectiveInput =
    m.cachedInputPer1M != null
      ? m.inputPer1M * (1 - s.cacheRate) + m.cachedInputPer1M * s.cacheRate
      : m.inputPer1M;
  const inCost = (s.requests * s.tokensIn * effectiveInput) / 1_000_000;
  const outCost = (s.requests * s.tokensOut * m.outputPer1M) / 1_000_000;
  return inCost + outCost;
}

export function priceRatio(x: number | null, y: number | null): string {
  if (x === null || y === null || y === 0) return '—';
  const r = Math.max(x, y) / Math.min(x, y);
  if (r < 1.05) return 'about the same';
  return `${r < 10 ? r.toFixed(1) : Math.round(r)}× ${Math.max(x, y) === x ? 'more' : 'less'} expensive`;
}

export interface FaqItem {
  q: string;
  a: string;
}

export function buildPairFaqs(a: LLMModel, b: LLMModel): FaqItem[] {
  const cheaperIn = (a.inputPer1M ?? Infinity) <= (b.inputPer1M ?? Infinity) ? a : b;
  const cheaperOut = (a.outputPer1M ?? Infinity) <= (b.outputPer1M ?? Infinity) ? a : b;
  const biggerCtx = a.contextWindow >= b.contextWindow ? a : b;
  const smallerCtx = biggerCtx === a ? b : a;
  const balanced = { requests: 100_000, tokensIn: 2_000, tokensOut: 500, cacheRate: 0 };
  const balancedA = monthlyCost(a, balanced);
  const balancedB = monthlyCost(b, balanced);
  const cheaperBalanced = balancedA <= balancedB ? a : b;
  const balancedRatio = Math.max(balancedA, balancedB) / Math.min(balancedA, balancedB);
  const bCheaperOut = (b.outputPer1M ?? Infinity) < (a.outputPer1M ?? Infinity);
  const aCheaperIn = (a.inputPer1M ?? Infinity) < (b.inputPer1M ?? Infinity);

  return [
    {
      q: `Is ${a.name} cheaper than ${b.name}?`,
      a: `${cheaperIn.name} is cheaper on input at ${fmtPrice(cheaperIn.inputPer1M)} per 1M tokens vs ${fmtPrice((cheaperIn === a ? b : a).inputPer1M)} — input pricing is ${priceRatio(a.inputPer1M, b.inputPer1M)}. On output, ${cheaperOut.name} wins at ${fmtPrice(cheaperOut.outputPer1M)} vs ${fmtPrice((cheaperOut === a ? b : a).outputPer1M)}. At a balanced workload (100K requests, 2K in / 500 out), ${cheaperBalanced.name} runs ${fmtMoney(Math.min(balancedA, balancedB))}/mo vs ${fmtMoney(Math.max(balancedA, balancedB))}/mo — a ${balancedRatio < 1.05 ? 'negligible' : balancedRatio.toFixed(1) + '×'} difference.`,
    },
    {
      q: `${a.name} vs ${b.name}: which has the bigger context window?`,
      a:
        a.contextWindow === b.contextWindow
          ? `Neither — both ship the same ${fmtContext(a.contextWindow)} context window. Filling it once costs ${fmtMoney((a.contextWindow / 1_000_000) * (a.inputPer1M ?? 0))} on ${a.name} at list price, vs ${fmtMoney((b.contextWindow / 1_000_000) * (b.inputPer1M ?? 0))} on ${b.name}.`
          : `${biggerCtx.name}, with ${fmtContext(biggerCtx.contextWindow)} tokens vs ${fmtContext(smallerCtx.contextWindow)} — ${(biggerCtx.contextWindow / smallerCtx.contextWindow).toFixed(1)}× more room. Filling ${biggerCtx.name}'s window once costs ${fmtMoney((biggerCtx.contextWindow / 1_000_000) * (biggerCtx.inputPer1M ?? 0))} at list price, vs ${fmtMoney((smallerCtx.contextWindow / 1_000_000) * (smallerCtx.inputPer1M ?? 0))} for the smaller window.`,
    },
    {
      q: `Should I switch from ${a.name} to ${b.name}?`,
      a: `Switch if your bottleneck matches ${b.name}'s strengths: ${b.contextWindow > a.contextWindow ? `the larger ${fmtContext(b.contextWindow)} context` : `its ${fmtContext(b.contextWindow)} context fits your documents`} and ${bCheaperOut ? `cheaper output tokens (${fmtPrice(b.outputPer1M)} vs ${fmtPrice(a.outputPer1M)})` : 'its pricing profile'}. Stay on ${a.name} if ${aCheaperIn ? `input cost dominates your bill — ${a.name} charges ${fmtPrice(a.inputPer1M)} per 1M in` : 'your workload already fits its limits'}. Test both with your real token counts before committing.`,
    },
  ];
}

export function buildModelFaqs(m: LLMModel): FaqItem[] {
  const priced = models.filter((x) => x.inputPer1M !== null);
  const byInput = [...priced].sort((a, b) => (a.inputPer1M ?? 0) - (b.inputPer1M ?? 0));
  const rank = byInput.findIndex((x) => x.id === m.id) + 1;
  const cheapest = byInput[0];
  const priciest = byInput[byInput.length - 1];
  const fillCost = (m.contextWindow / 1_000_000) * (m.inputPer1M ?? 0);
  const words = Math.round(m.contextWindow * 0.75);
  const pages = Math.round(words / 500);
  const cachePct =
    m.cachedInputPer1M != null && m.inputPer1M
      ? Math.round((m.cachedInputPer1M / m.inputPer1M) * 100)
      : null;
  const vsCheapest =
    m.inputPer1M && cheapest.inputPer1M ? (m.inputPer1M / cheapest.inputPer1M).toFixed(1) : null;

  const faqs: FaqItem[] = [
    {
      q: `How much does ${m.name} cost per million tokens?`,
      a: `${m.name} costs ${fmtPrice(m.inputPer1M)} per 1M input tokens and ${fmtPrice(m.outputPer1M)} per 1M output tokens${m.cachedInputPer1M != null ? `, with cached input at ${fmtPrice(m.cachedInputPer1M)}` : ''}. Rates are verified against ${m.provider}'s official pricing page as of ${m.lastChecked}.${m.note ? ` Note: ${m.note}.` : ''}`,
    },
    {
      q: `How big is ${m.name}'s context window?`,
      a: `${m.name} ships a ${fmtContext(m.contextWindow)} token context window — roughly ${words.toLocaleString('en-US')} English words, or about ${pages.toLocaleString('en-US')} pages of text. Filling the entire window once costs ${fmtMoney(fillCost)} in input tokens at list price.`,
    },
    {
      q: `Is ${m.name} cheap or expensive compared to other models?`,
      a: `Among the ${priced.length} models we track, ${m.name} ranks #${rank} on input price — cheapest is ${cheapest.name} at ${fmtPrice(cheapest.inputPer1M)}, priciest is ${priciest.name} at ${fmtPrice(priciest.inputPer1M)}.${vsCheapest ? ` At ${fmtPrice(m.inputPer1M)} per 1M input, ${m.name} runs ${vsCheapest}× the cheapest tier.` : ''} Compare it head-to-head with its rivals on the model comparison pages.`,
    },
  ];

  if (cachePct !== null) {
    faqs.push({
      q: `What is cached input pricing on ${m.name}?`,
      a: `${m.name} charges ${fmtPrice(m.cachedInputPer1M)} per 1M cached input tokens — ${cachePct}% of its ${fmtPrice(m.inputPer1M)} base input rate. If your requests repeat context (system prompts, documents, conversation history), prompt caching cuts the input portion of your bill accordingly. Model the exact savings on the API Cost Calculator.`,
    });
  }

  return faqs;
}

export function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '$0';
  if (n < 0.01) return '$' + n.toFixed(4);
  if (n < 1) return '$' + n.toFixed(3);
  if (n < 1000) return '$' + n.toFixed(2);
  return '$' + Math.round(n).toLocaleString('en-US');
}

export function fmtPrice(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return n < 1 ? '$' + n.toFixed(n < 0.1 ? 3 : 2).replace(/0+$/, '').replace(/\.$/, '') : '$' + n.toFixed(2);
}

export function fmtContext(n: number): string {
  return n >= 1_000_000 ? `${n / 1_000_000}M` : `${Math.round(n / 1000)}K`;
}
