# Animation sequence scroll — logic & documentation

This document explains how the **scroll-driven frame sequence** works on the Roots home hero: scroll position controls which image frame is shown, so the animation is tied to how far the user has scrolled.

---

## 1. High-level idea

- The hero is a **long scroll area** (e.g. 400vh). As the user scrolls through it, a **single sticky viewport** stays on screen and shows one image at a time.
- **Scroll progress** (0 → 1 from top to bottom of that area) is mapped to **frame index** (0 → N−1).
- Frames are **preloaded** from `/public/sequence/` (e.g. `ezgif-frame-001.jpg` … `ezgif-frame-240.jpg`). The visible frame is drawn on an **HTML5 Canvas** so it stays smooth and avoids layout thrash.

So: **scroll position** → **progress 0–1** → **frame index** → **draw that frame on the canvas**.

---

## 2. Layout structure

The scroll “track” is a tall container; the “viewport” is a sticky block that stays fixed while you scroll through the track.

```
┌─────────────────────────────────────┐
│  Scroll container (ref = containerRef)│
│  height: 400vh                       │
│  ┌─────────────────────────────────┐│
│  │ Sticky viewport (sticky top-0)   ││  ← stays on screen
│  │ h-screen, w-full                 ││
│  │  ┌─────────────────────────────┐ ││
│  │  │ Canvas (current frame)      │ ││
│  │  │ + overlay text              │ ││
│  │  └─────────────────────────────┘ ││
│  └─────────────────────────────────┘│
│  … more “scroll space” below …      │
└─────────────────────────────────────┘
```

- **Outer div**: `height: 400vh`, `ref={containerRef}`. This is the **scroll target**: scrolling from top to bottom of the page moves this block from “start at top” to “end at bottom”.
- **Inner div**: `position: sticky`, `top: 0`, `height: 100vh`, `width: 100%`. It stays fixed in the viewport while the user scrolls through the 400vh. So the **same viewport** shows different content (different frames) as scroll changes.

Implementation: `src/components/ChipScroll.tsx` (the wrapper with `style={{ height: "400vh" }}` and the sticky child).

---

## 3. Scroll-to-progress mapping (Framer Motion)

We need a number **0 → 1** that represents “how far through the scroll area” the user is.

- **`useScroll`** (Framer Motion) is given:
  - `target: containerRef` — the 400vh element
  - `offset: ["start start", "end end"]` — progress is 0 when the **top** of the container meets the **top** of the viewport, and 1 when the **bottom** of the container meets the **bottom** of the viewport.

So:

- At the **top** of the scroll: `scrollYProgress = 0`
- At the **bottom**: `scrollYProgress = 1`
- In between: linear interpolation (e.g. 25% down → ~0.25).

Code:

```ts
const { scrollYProgress } = useScroll({
  target: containerRef,
  offset: ["start start", "end end"],
});
```

`scrollYProgress` is a **MotionValue** (reactive): it updates as the user scrolls.

---

## 4. Progress → frame index

We map **scroll progress** to **frame index** so that:

- progress `0` → frame `0` (first image)
- progress `1` → frame `totalFrames - 1` (last image)

**`useTransform`** does this mapping:

```ts
const frameIndex = useTransform(
  scrollYProgress,
  [0, 1],                    // input: progress 0 and 1
  [0, Math.max(frameCount - 1, 0)]  // output: frame 0 and last
);
```

So for 240 frames, progress 0 → 0, progress 1 → 239, progress 0.5 → ~119.5 (we then round when drawing).

To drive React state (for the canvas), we subscribe to `frameIndex` and round to an integer:

```ts
const [index, setIndex] = useState(0);
useEffect(() => {
  const unsub = frameIndex.on("change", (v) => setIndex(Math.round(v)));
  return () => unsub();
}, [frameIndex, frameCount]);
```

So **scroll** → **scrollYProgress** → **frameIndex** → **index** (integer) → canvas draws `frames[index]`.

---

## 5. Frame detection and preloading

Frames live in **`/public/sequence/`** with a fixed naming pattern, e.g.:

- `ezgif-frame-001.jpg`, `ezgif-frame-002.jpg`, … `ezgif-frame-240.jpg`

**Detection (how many frames exist):**

- Try loading `ezgif-frame-001.jpg`, `ezgif-frame-002.jpg`, … in order until one **fails** (e.g. 404).
- The last successful index is the **frame count** (e.g. 240).

**Preloading:**

- Once the count is known, we load **all** frames with `new Image()` and `img.src = url`, and wait for `Promise.all(...)` so we don’t show the experience until every frame is in memory. That avoids flicker or missing frames when the user scrolls quickly.

**Background colour:**

- The first frame is drawn into a 1×1 canvas and we sample the centre pixel colour. That colour is used as the canvas (and sticky area) background so the edges blend with the page. Fallback is `#050505` if there are no frames.

Relevant helpers in `ChipScroll.tsx`:

- `detectFrameCount()` — returns number of frames.
- `preloadFrames(count)` — returns `Promise<HTMLImageElement[]>`.
- `useFrameImages(totalFrames)` — runs preload, samples background, exposes `{ frames, ready, sampledBg }`.

The **loading screen** stays until `ready` is true (and `onReady()` is called), so the scroll animation only starts after preload is done.

---

## 6. Canvas drawing (current frame)

The visible frame is drawn by **`CanvasFrame`**:

- **Inputs:** `frameIndex`, `images` (array of preloaded `HTMLImageElement`), `sampledBg`.
- **Behaviour:**
  - Resize canvas to match the **display size × devicePixelRatio** (capped, e.g. 2) for sharpness on retina.
  - Fill with `sampledBg`, then draw the image **contained and centred** (preserve aspect ratio, fit inside canvas).
  - Use `drawImage(img, drawX, drawY, drawW, drawH)` with computed dimensions so the frame never stretches.

**When it runs:** Whenever `frameIndex` (or the rounded `index`) or `images` changes, a `useEffect` runs and redraws the canvas with `images[frameIndex]`. So **every scroll update** that changes the mapped frame index triggers a single redraw.

---

## 7. Fallback when there are no frames

If **no** sequence images are found (e.g. folder empty or wrong naming), `frameCount === 0`. In that case we don’t draw image frames; instead **`ProceduralCanvas`** draws a simple gradient that changes with **scroll progress** (e.g. a radial pulse). So the same scroll mechanic still works, just without real frames.

---

## 8. Story overlays (text on top)

**`StoryOverlays`** uses the **same** scroll progress to show different copy at different scroll positions (e.g. 0%, 30%, 60%, 90%):

- It uses **`useScrollProgress()`**, which reads `scrollYProgress` from the same `ChipScroll` context.
- For each “section” (e.g. at progress `0.3`), it uses **`useTransform(scrollYProgress, [...], [...])`** to derive:
  - **Opacity:** e.g. 0 away from the section, 1 at the section, 0 again after (smooth fade in/out).
  - **Y offset:** slight vertical motion for a cinematic feel.

So the **same** `scrollYProgress` that drives the frame index also drives overlay opacity and position. No extra scroll logic — one source of truth.

---

## 9. Data flow summary

```
User scrolls
    → useScroll({ target: containerRef, offset: ["start start", "end end"] })
    → scrollYProgress (0 → 1)

scrollYProgress
    → useTransform(..., [0, 1], [0, lastFrameIndex])
    → frameIndex (float)
    → .on("change", v => setIndex(Math.round(v)))
    → index (integer)

index + preloaded images
    → CanvasFrame draws images[index] on canvas
    → user sees the frame for current scroll position

scrollYProgress (same)
    → StoryOverlays useTransform(..., opacity / y)
    → text fades in/out at 0%, 30%, 60%, 90%
```

---

## 10. File reference

| File | Role |
|------|------|
| `src/components/ChipScroll.tsx` | Scroll container (400vh), sticky viewport, scroll/progress → frame index, frame detection & preload, canvas vs procedural fallback, context for `scrollYProgress` and `ready`. |
| `src/components/StoryOverlays.tsx` | Uses `useScrollProgress()`; maps `scrollYProgress` to opacity and y for each copy section. |
| `src/app/page.tsx` | Renders `ChipScroll` + `StoryOverlays`, loading screen until `onReady()`. |
| `public/sequence/` | Image sequence: `ezgif-frame-001.jpg` … `ezgif-frame-XXX.jpg` (see README there). |

---

## 11. Customisation notes

- **Scroll length:** Change `height: "400vh"` in `ChipScroll` to make the scroll track shorter (e.g. 300vh) or longer (e.g. 500vh). Same mapping: 0→first frame, 1→last frame.
- **Frame naming:** Adjust `SEQUENCE_BASE`, `pad3()`, and `SEQUENCE_EXT` in `ChipScroll.tsx` if you use another naming scheme (e.g. `frame-0.webp`).
- **Overlay positions:** Edit the `progress` values in `StoryOverlays.tsx` (e.g. 0, 0.3, 0.6, 0.9) to change when each line appears.
- **Smoothing:** The current logic uses `Math.round(frameIndex)` so each scroll position shows one discrete frame. For smoother motion you could use the fractional part for crossfade or sub-frame interpolation (not implemented here).

This is the full logic behind the animation sequence scroll: one scroll range, one progress value, one frame index, one canvas draw per update, plus overlay text driven by the same progress.
