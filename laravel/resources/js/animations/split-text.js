/**
 * Custom SplitText for the Laravel (Blade) DOM.
 * Splits an element's text into word/char spans and wraps each visual line
 * in an overflow-hidden mask so it can be revealed with yPercent transforms.
 *
 * Returns a revert() handle to restore the original markup.
 */

function createWord(text) {
  const word = document.createElement('span');
  word.className = 'split-word';
  word.style.display = 'inline-block';
  word.style.whiteSpace = 'nowrap';
  return word;
}

function createChar(text) {
  const char = document.createElement('span');
  char.className = 'split-char';
  char.textContent = text;
  return char;
}

/**
 * Full split (words + chars + masked lines). Use for display headlines.
 *
 * Accessibility: the split spans are aria-hidden and the original phrase is
 * exposed via aria-label, so screen readers announce the whole heading once
 * instead of reading every character.
 */
function maskForAccessibility(el, text) {
  el.setAttribute('aria-label', text.trim());
  el.querySelectorAll('.split-word, .split-char, .split-line, .split-line-inner').forEach((s) => {
    s.setAttribute('aria-hidden', 'true');
  });
}

export function splitText(el) {
  const original = el.innerHTML;
  const text = el.textContent ?? '';
  const wordNodes = text.split(/(\s+)/).filter((t) => t.length > 0);

  el.textContent = '';
  const words = [];

  for (const part of wordNodes) {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const word = createWord(part);
    for (const ch of Array.from(part)) {
      word.appendChild(createChar(ch));
    }
    words.push(word);
    el.appendChild(word);
    el.appendChild(document.createTextNode(' '));
  }

  const lines = [];
  const lineInners = [];
  let currentTop = null;
  let currentInner = null;

  for (const word of words) {
    const top = word.offsetTop;
    if (top !== currentTop) {
      currentTop = top;
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.className = 'split-line-inner';
      line.appendChild(inner);
      el.appendChild(line);
      lines.push(line);
      lineInners.push(inner);
      currentInner = inner;
    }
    if (currentInner) currentInner.appendChild(word);
  }

  const chars = words.flatMap((w) => Array.from(w.querySelectorAll('.split-char')));
  maskForAccessibility(el, text);

  return {
    words,
    chars,
    lines,
    lineInners,
    revert: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}

/**
 * Lines-only split — lighter DOM footprint for paragraphs and statements.
 */
export function splitLines(el) {
  const original = el.innerHTML;
  const text = el.textContent ?? '';

  el.textContent = '';
  const wordSpans = [];
  const lineInners = [];

  const wordNodes = text.split(/(\s+)/).filter((t) => t.length > 0);
  for (const part of wordNodes) {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(' '));
      continue;
    }
    const w = createWord(part);
    w.textContent = part;
    wordSpans.push(w);
    el.appendChild(w);
    el.appendChild(document.createTextNode(' '));
  }

  let currentTop = null;
  let currentInner = null;
  for (const word of wordSpans) {
    const top = word.offsetTop;
    if (top !== currentTop) {
      currentTop = top;
      const line = document.createElement('span');
      line.className = 'split-line';
      const inner = document.createElement('span');
      inner.className = 'split-line-inner';
      line.appendChild(inner);
      el.appendChild(line);
      lineInners.push(inner);
      currentInner = inner;
    }
    if (currentInner) currentInner.appendChild(word);
  }
  maskForAccessibility(el, text);

  return {
    lineInners,
    revert: () => {
      el.innerHTML = original;
      el.removeAttribute('aria-label');
    },
  };
}
