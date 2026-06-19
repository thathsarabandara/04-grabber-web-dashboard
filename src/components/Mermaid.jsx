import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
});

export function Mermaid({ chart }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && chart) {
      mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart)
        .then((result) => {
          containerRef.current.innerHTML = result.svg;
        })
        .catch((e) => {
          console.error("Mermaid error:", e);
        });
    }
  }, [chart]);

  return <div ref={containerRef} className="my-10 flex justify-center w-full overflow-x-auto" />;
}
