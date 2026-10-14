/* Portfolio template scripts: footer year, hero sort animation, project filters. */
(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Hero: insertion sort visualization ---------- */
  const barsEl = document.getElementById('sortviz-bars');

  if (barsEl) {
    const COUNT = 28;
    const STEP_MS = 70;
    const HOLD_TICKS = 28; // pause on the finished result before reshuffling

    const toggleBtn = document.getElementById('sv-toggle');
    const shuffleBtn = document.getElementById('sv-shuffle');
    const comparesEl = document.getElementById('sv-compares');
    const swapsEl = document.getElementById('sv-swaps');

    const bars = [];
    for (let k = 0; k < COUNT; k += 1) {
      const bar = document.createElement('div');
      bar.className = 'bar';
      barsEl.appendChild(bar);
      bars.push(bar);
    }

    let values = [];
    let i = 1;        // start of the unsorted region
    let j = 1;        // position of the item being inserted
    let compares = 0;
    let swaps = 0;
    let done = false;
    let hold = 0;
    let timer = null;
    let running = !prefersReducedMotion;

    const shuffled = () => {
      const list = Array.from({ length: COUNT }, (_, n) => n + 1);
      for (let n = list.length - 1; n > 0; n -= 1) {
        const m = Math.floor(Math.random() * (n + 1));
        [list[n], list[m]] = [list[m], list[n]];
      }
      return list;
    };

    const render = (a = -1, b = -1, swapped = false) => {
      for (let k = 0; k < COUNT; k += 1) {
        const bar = bars[k];
        bar.style.height = `${(values[k] / COUNT) * 100}%`;
        let cls = 'bar';
        if (k < i) cls += ' is-sorted';
        if (k === a || k === b) cls += swapped ? ' is-swap' : ' is-compare';
        bar.className = cls;
      }
      comparesEl.textContent = `compares ${compares}`;
      swapsEl.textContent = `swaps ${swaps}`;
    };

    const reset = () => {
      values = shuffled();
      i = 1;
      j = 1;
      compares = 0;
      swaps = 0;
      done = false;
      hold = 0;
      render();
    };

    const tick = () => {
      if (done) {
        hold += 1;
        if (hold >= HOLD_TICKS) reset();
        return;
      }

      compares += 1;
      const a = j - 1;
      const b = j;

      if (values[a] > values[b]) {
        [values[a], values[b]] = [values[b], values[a]];
        swaps += 1;
        j -= 1;
        if (j === 0) {
          i += 1;
          j = i;
        }
        render(a, b, true);
      } else {
        i += 1;
        j = i;
        render(a, b, false);
      }

      if (i >= COUNT) {
        done = true;
        i = COUNT;
        render();
      }
    };

    const setRunning = (next) => {
      running = next;
      window.clearInterval(timer);
      if (running) timer = window.setInterval(tick, STEP_MS);
      toggleBtn.textContent = running ? 'Pause' : 'Play';
    };

    toggleBtn.addEventListener('click', () => setRunning(!running));
    shuffleBtn.addEventListener('click', () => {
      reset();
      setRunning(true);
    });

    reset();
    setRunning(running);
  }

  /* ---------- Projects page: category filter ---------- */
  const filterButtons = document.querySelectorAll('[data-filter]');

  if (filterButtons.length) {
    const items = document.querySelectorAll('.project-item');
    const status = document.getElementById('project-status');
    const emptyState = document.getElementById('project-empty');

    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        let shown = 0;

        filterButtons.forEach((other) => {
          other.setAttribute('aria-pressed', String(other === btn));
        });

        items.forEach((item) => {
          const match = filter === 'all' || item.dataset.category === filter;
          item.hidden = !match;
          if (match) shown += 1;
        });

        if (status) status.textContent = `Showing ${shown} ${shown === 1 ? 'project' : 'projects'}`;
        if (emptyState) emptyState.hidden = shown !== 0;
      });
    });
  }
})();