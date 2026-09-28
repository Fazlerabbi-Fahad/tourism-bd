import { useEffect, useLayoutEffect, useRef, type RefObject } from "react";
import type { MotionValue } from "motion/react";
import { useMotionValueEvent } from "motion/react";
import { HERO_FRAME_COUNT, heroFrameSrc } from "../../lib/heroFrames";

const BONE = "#f5f1e8";
const LERP_FACTOR = 0.16;
const SNAP_EPSILON = 0.004;
const SEQUENCE_END = 0.6;
const WASH_START = 0.72;
const WASH_END = 1;
const WASH_MAX_ALPHA = 0.55;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

function targetFrameFromProgress(progress: number) {
  const t = clamp01(progress / SEQUENCE_END);
  return t * (HERO_FRAME_COUNT - 1);
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;

  const imageRatio = iw / ih;
  const canvasRatio = cw / ch;

  let sx = 0;
  let sy = 0;
  let sw = iw;
  let sh = ih;

  if (imageRatio > canvasRatio) {
    sw = ih * canvasRatio;
    sx = (iw - sw) / 2;
  } else {
    sh = iw / canvasRatio;
    sy = (ih - sh) / 2;
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export default function ScrubCanvas({
  trackRef,
  progress,
}: {
  trackRef: RefObject<HTMLDivElement>;
  progress: MotionValue<number>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const progressRef = useRef(0);
  const isActiveRef = useRef(true);
  const rafIdRef = useRef<number | null>(null);

  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
    targetFrameRef.current = targetFrameFromProgress(v);
  });

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const fillBone = () => {
      ctx.fillStyle = BONE;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const draw = () => {
      fillBone();

      const images = imagesRef.current;
      const pos = currentFrameRef.current;
      const floorIndex = Math.floor(pos);
      const ceilIndex = Math.min(Math.ceil(pos), HERO_FRAME_COUNT - 1);
      const frac = pos - floorIndex;

      const floorImg = images[floorIndex];
      if (floorImg && floorImg.complete && floorImg.naturalWidth > 0) {
        ctx.globalAlpha = 1;
        drawCover(ctx, floorImg, canvas.width, canvas.height);
      }

      if (ceilIndex !== floorIndex && frac > 0) {
        const ceilImg = images[ceilIndex];
        if (ceilImg && ceilImg.complete && ceilImg.naturalWidth > 0) {
          ctx.globalAlpha = frac;
          drawCover(ctx, ceilImg, canvas.width, canvas.height);
          ctx.globalAlpha = 1;
        }
      }

      const p = progressRef.current;
      const washT = clamp01((p - WASH_START) / (WASH_END - WASH_START));
      const washAlpha = washT * WASH_MAX_ALPHA;
      if (washAlpha > 0) {
        ctx.globalAlpha = washAlpha;
        ctx.fillStyle = BONE;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.imageSmoothingQuality = "high";
      draw();
    };

    resize();

    const loop = () => {
      const target = targetFrameRef.current;
      const cur = currentFrameRef.current;
      const diff = target - cur;

      currentFrameRef.current =
        Math.abs(diff) < SNAP_EPSILON ? target : cur + diff * LERP_FACTOR;

      draw();

      rafIdRef.current = isActiveRef.current ? requestAnimationFrame(loop) : null;
    };
    rafIdRef.current = requestAnimationFrame(loop);

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const trackEl = trackRef.current;
    let intersectionObserver: IntersectionObserver | null = null;
    if (trackEl) {
      intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          const wasActive = isActiveRef.current;
          isActiveRef.current = entry.isIntersecting;
          if (!wasActive && isActiveRef.current && rafIdRef.current === null) {
            rafIdRef.current = requestAnimationFrame(loop);
          }
        },
        { rootMargin: "300px" }
      );
      intersectionObserver.observe(trackEl);
    }

    return () => {
      if (rafIdRef.current !== null) cancelAnimationFrame(rafIdRef.current);
      resizeObserver.disconnect();
      intersectionObserver?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= HERO_FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      if (i === 1) {
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d", { alpha: false });
          if (!canvas || !ctx) return;
          ctx.globalAlpha = 1;
          drawCover(ctx, img, canvas.width, canvas.height);
        };
      }
      img.src = heroFrameSrc(i);
      images[i - 1] = img;
    }
    imagesRef.current = images;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full"
    />
  );
}
