"use client";

import Image from "next/image";
import { RotateCw, X } from "lucide-react";
import { useEffect, useId, useState } from "react";

type Product360ViewerProps = {
  image: string;
  title: string;
  serial: string;
  spinVideo?: string;
  locale?: "zh" | "en";
};

export function Product360Viewer({ image, title, serial, spinVideo, locale = "zh" }: Product360ViewerProps) {
  const [open, setOpen] = useState(false);
  const [replayKey, setReplayKey] = useState(0);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="focus-ring absolute bottom-4 right-4 z-20 inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-black/10 bg-[rgba(251,250,246,0.92)] px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-black shadow-[0_10px_30px_rgba(0,0,0,0.12)] backdrop-blur transition hover:border-black/30 hover:bg-white"
        aria-label={locale === "zh" ? `${serial} 360度全景展示` : `${serial} 360 degree view`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setReplayKey((current) => current + 1);
          setOpen(true);
        }}
      >
        <RotateCw size={14} aria-hidden="true" />
        <span>360</span>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/72 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden bg-[var(--porcelain)] text-black shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ash)]">{serial} / 360 Detail Film</p>
                <h2 id={titleId} className="mt-1 text-lg font-normal">
                  {title}
                </h2>
              </div>
              <button
                type="button"
                className="focus-ring inline-flex h-10 w-10 items-center justify-center border border-black/10 text-black transition hover:border-black/30"
                aria-label={locale === "zh" ? "关闭全景展示" : "Close 360 view"}
                onClick={() => setOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="noir-360-stage relative min-h-[420px] overflow-hidden bg-[var(--ivory)]">
                {spinVideo ? (
                  <video key={spinVideo} className="h-full w-full object-contain" src={spinVideo} autoPlay muted playsInline controls />
                ) : (
                  <div key={replayKey} className="noir-360-object absolute inset-10">
                    <Image src={image} alt={title} fill sizes="(max-width: 1024px) 100vw, 60vw" className="object-contain" />
                  </div>
                )}
              </div>
              <div className="flex min-h-[360px] flex-col justify-between border-t border-black/10 p-6 lg:border-l lg:border-t-0">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ash)]">HyperFrames 360</p>
                  <p className="mt-5 text-2xl leading-tight">
                    {locale === "zh" ? "自动旋转一圈，查看轮廓、宝石比例与工艺细节。" : "One full auto-rotation for silhouette, stone ratio, and craft detail."}
                  </p>
                </div>
                <button
                  type="button"
                  className="focus-ring mt-8 inline-flex h-11 items-center justify-center gap-2 border border-black px-5 font-mono text-[11px] uppercase tracking-[0.16em] transition hover:bg-black hover:text-white"
                  onClick={() => setReplayKey((current) => current + 1)}
                >
                  <RotateCw size={14} aria-hidden="true" />
                  {locale === "zh" ? "重新播放" : "Replay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
