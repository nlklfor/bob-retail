import type { DetailedHTMLProps, HTMLAttributes } from "react";

// @google/model-viewer registers a real custom element at runtime; this
// just teaches JSX its attributes so TSX can render <model-viewer> directly
// instead of needing a wrapper with dangerouslySetInnerHTML.
type ModelViewerAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  alt?: string;
  "auto-rotate"?: boolean;
  "auto-rotate-delay"?: string;
  "rotation-per-second"?: string;
  "camera-controls"?: boolean;
  "disable-zoom"?: boolean;
  "shadow-intensity"?: string;
  exposure?: string;
  loading?: "auto" | "lazy" | "eager";
  reveal?: "auto" | "interaction" | "manual";
};

// React 19's JSX namespace lives inside the "react" module (not globalThis),
// so that's what has to be augmented for a custom element like
// <model-viewer> to type-check.
declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerAttributes;
    }
  }
}

export {};
