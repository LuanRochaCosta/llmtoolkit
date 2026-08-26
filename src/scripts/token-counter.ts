interface ModelOption {
  id: string;
  provider: string;
  name: string;
  contextWindow: number;
  inputPer1M: number | null;
  outputPer1M: number | null;
  lastChecked: string;
  charsPerToken?: number;
}

type BpeEncoding = 'o200k_base' | 'cl100k_base';

interface Encoder {
  encode(text: string): { length: number };
}

const CHAR_RATIOS: Record<string, number> = {
  Anthropic: 3.5,
  Google: 4,
};

function encodingFor(id: string): BpeEncoding | null {
  if (/^(gpt-5|gpt-4o|o[134])/.test(id)) return 'o200k_base';
  if (/^(gpt-4|gpt-3\.5)/.test(id)) return 'cl100k_base';
  return null;
}

const rankLoaders: Record<BpeEncoding, () => Promise<{ default: Record<string, unknown> }>> = {
  o200k_base: () => import('js-tiktoken/ranks/o200k_base'),
  cl100k_base: () => import('js-tiktoken/ranks/cl100k_base'),
};

const encoders = new Map<BpeEncoding, Encoder>();

async function getEncoder(enc: BpeEncoding): Promise<Encoder> {
  if (!encoders.has(enc)) {
    const [{ Tiktoken }, ranks] = await Promise.all([
      import('js-tiktoken/lite'),
      rankLoaders[enc](),
    ]);
    encoders.set(enc, new Tiktoken(ranks.default) as unknown as Encoder);
  }
  return encoders.get(enc) as Encoder;
}

function formatCost(cost: number): string {
  if (cost === 0) return '$0';
  if (cost < 0.00001) return '$' + cost.toExponential(1);
  if (cost < 0.01) return '$' + cost.toFixed(5);
  if (cost < 1) return '$' + cost.toFixed(4);
  return '$' + cost.toFixed(2);
}

function formatInt(n: number): string {
  return n.toLocaleString('en-US');
}

export function initTokenCounter(): void {
  const dataEl = document.getElementById('model-data');
  const input = document.getElementById('token-input') as HTMLTextAreaElement | null;
  const select = document.getElementById('model-select') as HTMLSelectElement | null;
  const statTokens = document.getElementById('stat-tokens');
  const statWords = document.getElementById('stat-words');
  const statChars = document.getElementById('stat-chars');
  const statCost = document.getElementById('stat-cost');
  const costDetail = document.getElementById('cost-detail');
  const methodBadge = document.getElementById('method-badge');
  const contextFill = document.getElementById('context-fill');
  const contextLabel = document.getElementById('context-label');

  if (!dataEl || !input || !select || !statTokens || !statWords || !statChars || !statCost || !costDetail || !methodBadge || !contextFill || !contextLabel) {
    return;
  }

  const models = JSON.parse(dataEl.textContent ?? '[]') as ModelOption[];

  const byProvider = new Map<string, ModelOption[]>();
  for (const m of models) {
    const list = byProvider.get(m.provider) ?? [];
    list.push(m);
    byProvider.set(m.provider, list);
  }
  for (const [provider, list] of byProvider) {
    const group = document.createElement('optgroup');
    group.label = provider;
    for (const m of list) {
      const option = document.createElement('option');
      option.value = m.id;
      option.textContent = m.name;
      if (m.id === 'gpt-4o') option.selected = true;
      group.appendChild(option);
    }
    select.appendChild(group);
  }

  let currentModel = models.find((m) => m.id === 'gpt-4o') ?? models[0];
  let lastText = '';
  let timer: ReturnType<typeof setTimeout> | undefined;

  function currentModelById(): ModelOption | undefined {
    return models.find((m) => m.id === select.value);
  }

  async function recompute(): Promise<void> {
    const text = input.value;
    lastText = text;
    const model = currentModelById();
    if (!model) return;
    currentModel = model;

    const chars = text.length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;

    const enc = encodingFor(model.id);
    let tokens: number;
    let method: string;

    if (enc) {
      methodBadge.textContent = 'Loading tokenizer…';
      const encoder = await getEncoder(enc);
      if (lastText !== text) return;
      tokens = text === '' ? 0 : encoder.encode(text).length;
      method = `Exact — ${enc} BPE, same as the API`;
    } else {
      const ratio = model.charsPerToken ?? CHAR_RATIOS[model.provider] ?? 4;
      tokens = Math.ceil(chars / ratio);
      method = `Estimated — ~${ratio} chars/token`;
    }
    methodBadge.textContent = method;

    statTokens.textContent = formatInt(tokens);
    statWords.textContent = formatInt(words);
    statChars.textContent = formatInt(chars);

    if (model.inputPer1M !== null) {
      const cost = (tokens / 1_000_000) * model.inputPer1M;
      statCost.textContent = formatCost(cost);
      costDetail.textContent = `${model.name}: $${model.inputPer1M.toFixed(2)} per 1M input tokens · checked ${model.lastChecked}`;
    } else {
      statCost.textContent = '—';
      costDetail.textContent = `${model.name}: pricing unavailable`;
    }

    const pct = model.contextWindow > 0 ? (tokens / model.contextWindow) * 100 : 0;
    contextFill.style.width = Math.min(pct, 100) + '%';
    contextFill.style.backgroundColor = pct > 80 ? '#9A3412' : '#0F6B5C';
    contextLabel.textContent =
      pct < 0.1
        ? `Context usage: <0.1% of ${model.name}'s ${formatInt(model.contextWindow)}-token window`
        : `Context usage: ${pct.toFixed(1)}% of ${model.name}'s ${formatInt(model.contextWindow)}-token window`;
  }

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(recompute, 150);
  });
  select.addEventListener('change', recompute);

  void recompute();
}
