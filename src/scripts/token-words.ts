const WORDS_PER_TOKEN = 0.75;

export function initTokenWords(): void {
  const input = document.getElementById('cv-input') as HTMLInputElement | null;
  const result = document.getElementById('cv-result');
  const dirTokens = document.getElementById('dir-tokens') as HTMLButtonElement | null;
  const dirWords = document.getElementById('dir-words') as HTMLButtonElement | null;

  if (!input || !result || !dirTokens || !dirWords) return;

  let tokensToWords = true;

  function fmt(n: number): string {
    return Math.round(n).toLocaleString('en-US');
  }

  function compute(): void {
    const v = parseFloat(input.value);
    if (!Number.isFinite(v) || v < 0) {
      result.textContent = '—';
      return;
    }
    if (tokensToWords) {
      const words = v * WORDS_PER_TOKEN;
      const pages = words / 500;
      result.textContent =
        `${fmt(v)} tokens ≈ ${fmt(words)} words` + (pages >= 0.1 ? ` ≈ ${pages < 10 ? pages.toFixed(1) : fmt(pages)} pages` : '');
    } else {
      const tokens = v / WORDS_PER_TOKEN;
      result.textContent = `${fmt(v)} words ≈ ${fmt(tokens)} tokens`;
    }
  }

  function setDirection(toWords: boolean): void {
    tokensToWords = toWords;
    const active = 'rounded-lg border-2 border-[#0F6B5C] bg-[#0F6B5C] px-4 py-2.5 text-sm font-medium text-white';
    const inactive = 'rounded-lg border-2 border-[#E5E1D7] bg-white px-4 py-2.5 text-sm font-medium';
    dirTokens.className = toWords ? active : inactive;
    dirWords.className = toWords ? inactive : active;
    compute();
  }

  input.addEventListener('input', compute);
  dirTokens.addEventListener('click', () => setDirection(true));
  dirWords.addEventListener('click', () => setDirection(false));

  compute();
}
