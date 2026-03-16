"use client";

import { useRef, useEffect, useState, useCallback, createContext, useContext } from "react";
import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";

const SEQUENCE_BASE = "/sequence/ezgif-frame-";
const SEQUENCE_EXT = ".jpg";

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

function frameSrc(index: number) {
  return `${SEQUENCE_BASE}${pad3(index + 1)}${SEQUENCE_EXT}`;
}

const FALLBACK_BG = "#050505";

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


const TOTAL_FRAMES = 240;

function useFrameImages() {
  const [frames, setFrames] = useState<HTMLImageElement[]>([]);
  const [ready, setReady] = useState(false);
  const [sampledBg, setSampledBg] = useState(FALLBACK_BG);

  useEffect(() => {
    let cancelled = false;
    
    // 1. Load the first frame immediately to get background color and initial view
    loadImage(frameSrc(0)).then((firstImg) => {
      if (cancelled) return;
      
      const canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(firstImg, 0, 0, 1, 1);
        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        setSampledBg(`rgb(${r},${g},${b})`);
      }
      
      // We are "ready" once the first frame is here
      setReady(true);
      
      // 2. Load the rest in chunks to avoid slamming the network
      const allFrames = new Array(TOTAL_FRAMES);
      allFrames[0] = firstImg;
      setFrames([...allFrames]);

      const loadRest = async () => {
        // Load in batches of 10
        const batchSize = 10;
        for (let i = 1; i < TOTAL_FRAMES; i += batchSize) {
          if (cancelled) break;
          const end = Math.min(i + batchSize, TOTAL_FRAMES);
          const promises = [];
          for (let j = i; j < end; j++) {
            promises.push(loadImage(frameSrc(j)).then(img => ({ img, j })));
          }
          const results = await Promise.all(promises);
          results.forEach(({ img, j }) => {
            allFrames[j] = img;
          });
          setFrames([...allFrames]);
        }
      };
      
      loadRest();
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return { frames, ready, sampledBg };
}

function CanvasFrame({
  frameIndex,
  images,
  sampledBg,
}: {
  frameIndex: number;
  images: HTMLImageElement[];
  sampledBg: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(
    (img: HTMLImageElement | null) => {
      const canvas = canvasRef.current;
      if (!canvas || !img) return;

      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d", { alpha: false });
      if (!ctx) return;

      ctx.fillStyle = sampledBg;
      ctx.fillRect(0, 0, w, h);

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const viewAspect = w / h;
      let drawW: number, drawH: number, drawX: number, drawY: number;

      if (viewAspect > imgAspect) {
        drawH = h;
        drawW = img.naturalWidth * (h / img.naturalHeight);
        drawX = (w - drawW) / 2;
        drawY = 0;
      } else {
        drawW = w;
        drawH = img.naturalHeight * (w / img.naturalWidth);
        drawX = 0;
        drawY = (h - drawH) / 2;
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
    },
    [sampledBg]
  );

  useEffect(() => {
    const img = images[frameIndex] ?? null;
    draw(img);
  }, [frameIndex, images, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: sampledBg }}
    />
  );
}

function ProceduralCanvas({ progress }: { progress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    ctx.fillStyle = FALLBACK_BG;
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    const baseRadius = Math.min(w, h) * 0.2;
    const pulse = 0.5 + 0.5 * Math.sin(progress * Math.PI);
    const r = baseRadius * (0.8 + 0.4 * pulse);
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 2);
    gradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
    gradient.addColorStop(0.5, "rgba(99, 102, 241, 0.1)");
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ background: FALLBACK_BG }}
    />
  );
}

type ScrollContextValue = {
  scrollYProgress: MotionValue<number>;
  ready: boolean;
  sampledBg: string;
};

const ScrollProgressContext = createContext<ScrollContextValue | null>(null);

export function useScrollProgress() {
  const ctx = useContext(ScrollProgressContext);
  if (!ctx) throw new Error("useScrollProgress must be used within ChipScroll");
  return ctx;
}

export default function ChipScroll({
  children,
  onReady,
}: {
  children?: React.ReactNode;
  onReady?: () => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const unsub = frameIndex.on("change", (v) => setIndex(Math.round(v)));
    return () => unsub();
  }, [frameIndex]);

  const { frames, ready, sampledBg } = useFrameImages();
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [progressValue, setProgressValue] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", setProgressValue);
    return () => unsub();
  }, [progress]);

  useEffect(() => {
    if (ready && onReady) onReady();
  }, [ready, onReady]);

  const contextValue: ScrollContextValue = { scrollYProgress, ready, sampledBg };

  return (
    <ScrollProgressContext.Provider value={contextValue}>
      <div
        ref={containerRef}
        className="relative"
        style={{ height: "400vh" }}
      >
        <div
          className="sticky top-0 h-screen w-full overflow-hidden"
          style={{ background: TOTAL_FRAMES > 0 ? sampledBg : FALLBACK_BG }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {TOTAL_FRAMES > 0 ? (
              <CanvasFrame
                frameIndex={Math.min(index, frames.length - 1)}
                images={frames}
                sampledBg={sampledBg}
              />
            ) : (
              <ProceduralCanvas progress={progressValue} />
            )}
          </div>
          {/* Subtle glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background: `radial-gradient(ellipse 80% 50% at 50% 50%, ${sampledBg}40, transparent 70%)`,
            }}
          />
          {/* Overlay slot for story text */}
          {children}
        </div>
      </div>
    </ScrollProgressContext.Provider>
  );
}
