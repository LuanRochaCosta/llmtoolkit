interface ColumnConfig {
  index: number;
  type: 'num' | 'text';
}

export function initPricingSort(): void {
  const table = document.getElementById('pricing-table') as HTMLTableElement | null;
  if (!table) return;

  const tbody = table.tBodies[0];
  if (!tbody) return;

  const headers = Array.from(table.tHead?.rows[0]?.cells ?? []);
  const columns = new Map<string, ColumnConfig>();

  headers.forEach((th, index) => {
    const key = (th as HTMLElement).dataset.sort;
    if (!key) return;
    columns.set(key, { index, type: (th as HTMLElement).dataset.type === 'num' ? 'num' : 'text' });
    if (key === 'model') return;

    th.addEventListener('click', () => {
      const state = (th as HTMLElement).dataset.state ?? 'none';
      const next = state === 'asc' ? 'desc' : 'asc';
      headers.forEach((h) => {
        delete (h as HTMLElement).dataset.state;
        h.querySelector('.sort-arrow')?.remove();
      });
      (th as HTMLElement).dataset.state = next;
      th.append(document.createTextNode(' '));
      const arrow = document.createElement('span');
      arrow.className = 'sort-arrow';
      arrow.textContent = next === 'asc' ? '↑' : '↓';
      th.append(arrow);

      const rows = Array.from(tbody.rows);
      rows.sort((a, b) => {
        const cellA = a.cells[index];
        const cellB = b.cells[index];
        if (!cellA || !cellB) return 0;
        let va: number | string;
        let vb: number | string;
        if (columns.get(key)?.type === 'num') {
          va = parseFloat(cellA.dataset.value ?? '-1');
          vb = parseFloat(cellB.dataset.value ?? '-1');
        } else {
          va = cellA.textContent ?? '';
          vb = cellB.textContent ?? '';
        }
        const cmp =
          typeof va === 'number' && typeof vb === 'number'
            ? va - vb
            : String(va).localeCompare(String(vb));
        return next === 'asc' ? cmp : -cmp;
      });
      rows.forEach((row) => tbody.appendChild(row));
    });
  });
}
