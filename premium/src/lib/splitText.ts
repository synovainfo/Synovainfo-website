/**
 * Custom SplitText utility — splits an element's text into word and
 * character spans, then wraps each visual line in an overflow-hidden mask
 * so it can be revealed with yPercent transforms (the "mask reveal" look).
 *
 * Returns a handle for reverting to the original DOM, plus node arrays.
 */

export interface SplitTextResult {
  words: HTMLSpanElement[];
  chars: HTMLSpanElement[];
  lines: HTMLSpanElement[];
  lineInners: HTMLSpanElement[];
  revert: () => void;
}

function createWord(text: string): HTMLSpanElement {
  const word = document.createElement("span");
  word.className = "split-word";
  word.style.display = "inline-block";
  word.style.whiteSpace = "nowrap";
  word.textContent = text;
  return word;
}

function createChar(text: string): HTMLSpanElement {
  const char = document.createElement("span");
  char.className = "split-char";
  char.textContent = text;
  return char;
}

export function splitText(el: HTMLElement): SplitTextResult {
  const original = el.innerHTML;

  // 1. Split the text content into words, preserving line breaks.
  const text = el.textContent ?? "";
  const wordNodes = text.split(/(\s+)/).filter((t) => t.length > 0);

  el.textContent = "";
  const words: HTMLSpanElement[] = [];

  for (const part of wordNodes) {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const word = createWord(part);
    for (const ch of Array.from(part)) {
      word.appendChild(createChar(ch));
    }
    words.push(word);
    el.appendChild(word);
    el.appendChild(document.createTextNode(" "));
  }

  // 2. Group words into visual lines using their offsetTop.
  const lines: HTMLSpanElement[] = [];
  const lineInners: HTMLSpanElement[] = [];
  let currentTop: number | null = null;
  let currentLine: HTMLSpanElement | null = null;
  let currentInner: HTMLSpanElement | null = null;

  for (const word of words) {
    const top = word.offsetTop;
    if (top !== currentTop) {
      currentTop = top;
      const line = document.createElement("span");
      line.className = "split-line";
      const inner = document.createElement("span");
      inner.className = "split-line-inner";
      line.appendChild(inner);
      el.appendChild(line);
      lines.push(line);
      lineInners.push(inner);
      currentLine = line;
      currentInner = inner;
    }
    if (currentInner) currentInner.appendChild(word);
    void currentLine;
  }

  const chars = words.flatMap((w) => Array.from(w.querySelectorAll(".split-char")));

  return {
    words,
    chars,
    lines,
    lineInners,
    revert: () => {
      el.innerHTML = original;
    },
  };
}

/**
 * Split only into masked lines (used when we want a line-level reveal
 * without character granularity — lighter on the DOM for long paragraphs).
 */
export function splitLines(el: HTMLElement): {
  lineInners: HTMLSpanElement[];
  revert: () => void;
} {
  const original = el.innerHTML;
  const text = el.textContent ?? "";

  el.textContent = "";
  const wordSpans: HTMLSpanElement[] = [];
  const lineInners: HTMLSpanElement[] = [];

  const wordNodes = text.split(/(\s+)/).filter((t) => t.length > 0);
  for (const part of wordNodes) {
    if (/^\s+$/.test(part)) {
      el.appendChild(document.createTextNode(" "));
      continue;
    }
    const w = createWord(part);
    wordSpans.push(w);
    el.appendChild(w);
    el.appendChild(document.createTextNode(" "));
  }

  let currentTop: number | null = null;
  let currentInner: HTMLSpanElement | null = null;

  for (const word of wordSpans) {
    const top = word.offsetTop;
    if (top !== currentTop) {
      currentTop = top;
      const line = document.createElement("span");
      line.className = "split-line";
      const inner = document.createElement("span");
      inner.className = "split-line-inner";
      line.appendChild(inner);
      el.appendChild(line);
      lineInners.push(inner);
      currentInner = inner;
    }
    if (currentInner) currentInner.appendChild(word);
  }

  return {
    lineInners,
    revert: () => {
      el.innerHTML = original;
    },
  };
}
