"use client";

import { useEffect, useState } from "react";

// @google/model-viewer registers itself as a custom element at import time
// via `window`/`customElements`, which doesn't exist during Next's server
// render of this "use client" component — so the import is deferred into an
// effect (browser-only) instead of sitting at module top level.
export function ModelViewer({ src }: { src: string }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("@google/model-viewer").then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="aspect-square w-full bg-bg">
      {ready ? (
        <model-viewer
          src={src}
          alt="3D-логотип BOB Retail"
          auto-rotate
          auto-rotate-delay="0"
          rotation-per-second="15deg"
          camera-controls
          disable-zoom
          style={{ width: "100%", height: "100%", backgroundColor: "#ffffff" }}
        />
      ) : null}
    </div>
  );
}
