"use client";

import { useEffect, useState, type ReactNode } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/layout/icons";

// Headless carousel (Embla) — deliberately unstyled by the library itself,
// so the look stays fully ours rather than an off-the-shelf slider's
// default chrome. Nav buttons sit below the track, not overlaid on the
// sides, per the brief.
export function Carousel({ children }: { children: ReactNode }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  useEffect(() => {
    if (!emblaApi) return;
    let cancelled = false;

    const onSelect = () => {
      if (cancelled) return;
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };

    // Deferred (not called synchronously in the effect body) — same rule
    // as the header logo's cycle and the intro splash.
    const initHandle = window.setTimeout(onSelect, 0);
    emblaApi.on("select", onSelect).on("reInit", onSelect);

    return () => {
      cancelled = true;
      window.clearTimeout(initHandle);
      emblaApi.off("select", onSelect).off("reInit", onSelect);
    };
  }, [emblaApi]);

  return (
    <div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 sm:gap-6">{children}</div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
          aria-label="Попередній"
          className="flex h-10 w-10 items-center justify-center border border-border hover:border-fg disabled:opacity-20"
        >
          <ChevronLeftIcon />
        </button>
        <button
          type="button"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
          aria-label="Наступний"
          className="flex h-10 w-10 items-center justify-center border border-border hover:border-fg disabled:opacity-20"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </div>
  );
}
