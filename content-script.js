/* eslint-disable functional/no-expression-statement */
/* eslint-disable functional/no-conditional-statement */

// TODO fix this
/* eslint-disable @typescript-eslint/strict-boolean-expressions */

/**
 * @param {EventTarget | null} node
 * @return {HTMLAnchorElement | null}
 */
const clickedLink = (node) => {
  if (node instanceof HTMLAnchorElement) {
    return node;
  } else if (node instanceof Node) {
    return clickedLink(node.parentNode);
  } else {
    return null;
  }
};

window.addEventListener(
  "click",
  (e) => {
    const wasMiddleClick = e.button === 1;
    const wasModifiedLeftClick =
      e.button === 0 && (e.metaKey || e.ctrlKey || e.shiftKey);

    if (wasMiddleClick || wasModifiedLeftClick) {
      const target = clickedLink(e.target);
      const href = target && target.href && target.href.trim();
      const hrefAttr = target && target.getAttribute("href");
      const shouldHandleClick =
        href && hrefAttr && !href.startsWith("javascript:") && hrefAttr !== "#";

      if (target !== null && shouldHandleClick) {
        e.preventDefault();
        e.stopImmediatePropagation();

        /** @type {Message} */
        const message = {
          url: target.href,
          metaKey: e.metaKey,
          ctrlKey: e.ctrlKey,
          shiftKey: e.shiftKey,
        };

        chrome.runtime.sendMessage(message);
      }
    }
  },
  true
);
