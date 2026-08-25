interface ModelRow {
  id: string;
  provider: string;
  name: string;
  inputPer1M: number;
  outputPer1M: number;
  cachedInputPer1M: number | null;
  verified: boolean;
}

interface ComputedRow extends ModelRow {
  inputCost: number;
  outputCost: number;
  total: number;
}

const PRESETS: Record<string, { requests: number; in: number; out: number; cache: number }> = {
  chatbot: { requests: 30_000, in: 2_000, out: 500, cache: 40 },
  agent: { requests: 500_000, in: 12_000, out: 1_500, cache: 70 },
  bulk: { requests: 2_000_000, in: 800, out: 120, cache: 20 },
};

function fmtMoney(n: number): string {
  if (n === 0) return '$0';
  if (n < 0.01) return '$' + n.toFixed(4);
  if (n < 1) return '$' + n.toFixed(3);
  if (n < 1000) return '$' + n.toFixed(2);
  return '$' + Math.round(n).toLocaleString('en-US');
}

function fmtTokens(n: number): string {
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1) + 'B';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return Math.round(n / 1_000) + 'K';
  return String(Math.round(n));
}

export function initCostCalculator(): void {
  const dataEl = document.getElementById('model-data');
  const requestsEl = document.getElementById('inp-requests') as HTMLInputElement | null;
  const inEl = document.getElementById('inp-tokens-in') as HTMLInputElement | null;
  const outEl = document.getElementById('inp-tokens-out') as HTMLInputElement | null;
  const cacheEl = document.getElementById('inp-cache') as HTMLInputElement | null;
  const cacheValueEl = document.getElementById('cache-value');
  const tbody = document.getElementById('cost-tbody');
  const statTokens = document.getElementById('stat-total-tokens');
  const statCheapestName = document.getElementById('stat-cheapest-name');
  const statCheapestCost = document.getElementById('stat-cheapest-cost');
  const statFlagship = document.getElementById('stat-flagship-cost');
  const statSavings = document.getElementById('stat-savings');

  if (!dataEl || !requestsEl || !inEl || !outEl || !cacheEl || !cacheValueEl || !tbody || !statTokens || !statCheapestName || !statCheapestCost || !statFlagship || !statSavings) {
    return;
  }

  const models = JSON.parse(dataEl.textContent ?? '[]') as ModelRow[];

  function readNumber(el: HTMLInputElement, fallback: number): number {
    const v = parseFloat(el.value);
    return Number.isFinite(v) && v >= 0 ? v : fallback;
  }

  function compute(): void {
    const requests = readNumber(requestsEl, 0);
    const tokensIn = readNumber(inEl, 0);
    const tokensOut = readNumber(outEl, 0);
    const cacheRate = readNumber(cacheEl, 0) / 100;

    cacheValueEl.textContent = String(Math.round(cacheRate * 100));

    const totalTokens = requests * (tokensIn + tokensOut);
    statTokens.textContent = fmtTokens(totalTokens) + '/mo';

    const rows: ComputedRow[] = models.map((m) => {
      const effectiveInput =
        m.cachedInputPer1M !== null
          ? m.inputPer1M * (1 - cacheRate) + m.cachedInputPer1M * cacheRate
          : m.inputPer1M;
      const inputCost = (requests * tokensIn * effectiveInput) / 1_000_000;
      const outputCost = (requests * tokensOut * m.outputPer1M) / 1_000_000;
      return { ...m, inputCost, outputCost, total: inputCost + outputCost };
    });

    rows.sort((a, b) => a.total - b.total);

    const cheapest = rows[0];
    const flagship = rows.find((r) => r.id === 'gpt-5');
    statCheapestName.textContent = cheapest.name;
    statCheapestCost.textContent = fmtMoney(cheapest.total) + '/mo';

    if (flagship && flagship.total > 0) {
      statFlagship.textContent = fmtMoney(flagship.total) + '/mo';
      statSavings.textContent = 'nano saves ' + Math.round((1 - cheapest.total / flagship.total) * 100) + '%';
    }

    tbody.replaceChildren();

    for (const r of rows) {
      const tr = document.createElement('tr');
      tr.className = 'border-b border-[#E5E1D7] last:border-0 hover:bg-[#FBFAF7]';

      const tdName = document.createElement('td');
      tdName.className = 'px-4 py-3';
      const nameSpan = document.createElement('span');
      nameSpan.className = 'font-medium';
      nameSpan.textContent = r.name;
      const provSpan = document.createElement('span');
      provSpan.className = 'block text-xs text-[#6E6A60]';
      provSpan.textContent = r.provider;
      tdName.append(nameSpan, provSpan);

      const tdIn = document.createElement('td');
      tdIn.className = 'px-4 py-3 font-mono text-[#6E6A60]';
      tdIn.textContent = fmtMoney(r.inputCost);

      const tdOut = document.createElement('td');
      tdOut.className = 'px-4 py-3 font-mono text-[#6E6A60]';
      tdOut.textContent = fmtMoney(r.outputCost);

      const tdTotal = document.createElement('td');
      tdTotal.className = 'px-4 py-3 font-mono font-bold';
      tdTotal.textContent = fmtMoney(r.total);
      if (r.id === cheapest.id) {
        tdTotal.classList.add('text-[#0F6B5C]');
      }

      const tdVs = document.createElement('td');
      tdVs.className = 'px-4 py-3 font-mono text-xs';
      if (flagship && flagship.total > 0 && r.id !== flagship.id) {
        const ratio = r.total / flagship.total;
        tdVs.textContent = ratio < 1 ? `${ratio.toFixed(2)}×` : `${ratio.toFixed(1)}×`;
        tdVs.classList.add(ratio < 1 ? 'text-[#0F6B5C]' : 'text-[#9A3412]');
      } else if (r.id === flagship.id) {
        tdVs.textContent = 'baseline';
        tdVs.classList.add('text-[#6E6A60]');
      }

      tr.append(tdName, tdIn, tdOut, tdTotal, tdVs);
      tbody.appendChild(tr);
    }
  }

  for (const el of [requestsEl, inEl, outEl]) {
    el.addEventListener('input', compute);
  }
  cacheEl.addEventListener('input', compute);

  document.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const p = PRESETS[btn.dataset.preset ?? ''];
      if (!p) return;
      requestsEl.value = String(p.requests);
      inEl.value = String(p.in);
      outEl.value = String(p.out);
      cacheEl.value = String(p.cache);
      compute();
    });
  });

  compute();
}
