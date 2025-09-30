'use client';

import { useLayoutEffect } from 'react';

/**
 * A custom React hook that detects if the document has a vertical scrollbar.
 *
 * @remarks
 * This hook adds the `has-scrollbar` class to the `<html>` element if a scrollbar is present
 * and removes it if not. It uses a `ResizeObserver` and `MutationObserver` to dynamically
 * check for the presence of a scrollbar when the window is resized or the content of the
 * document changes. This is useful for applying styles conditionally, such as `scrollbar-gutter`.
 */
export function useHasScrollbar() {
  useLayoutEffect(() => {
    const checkScrollbar = () => {
      const hasScrollbar =
        document.documentElement.scrollHeight >
        document.documentElement.clientHeight;
      if (hasScrollbar) {
        document.documentElement.classList.add('has-scrollbar');
      } else {
        document.documentElement.classList.remove('has-scrollbar');
      }
    };

    checkScrollbar();

    const resizeObserver = new ResizeObserver(checkScrollbar);
    resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(checkScrollbar);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      document.documentElement.classList.remove('has-scrollbar');
    };
  }, []);
}
