/* Text splitting for the reveal system. Only two shapes are used: words (paragraph mask) and lines (hero headline). */

// Wraps each word in a clipping span with an inner span that can slide up. <br>, <em> and links survive.
export function splitWords(root: HTMLElement) {
  const original = root.innerHTML;
  const inner: HTMLElement[] = [];
  const walk = (node: Node) => {
    Array.from(node.childNodes).forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const fragment = document.createDocumentFragment();
        (child.textContent ?? "").split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { fragment.appendChild(document.createTextNode(" ")); return; }
          const mask = document.createElement("span");
          mask.className = "wm";
          const word = document.createElement("span");
          word.className = "wi";
          word.textContent = part;
          mask.appendChild(word);
          inner.push(word);
          fragment.appendChild(mask);
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && (child as HTMLElement).tagName !== "BR") {
        walk(child);
      }
    });
  };
  walk(root);
  return { inner, revert: () => { root.innerHTML = original; } };
}
