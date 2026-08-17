"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ------------------------------------------------------------------ */
/* Particle field. Generated with a fixed-seed PRNG so the server and  */
/* client produce identical markup (no hydration mismatch) while still */
/* looking random. Entries beyond 28 are hidden on mobile via CSS.     */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Particle = {
  left: string;
  size: number;
  dur: string;
  delay: string;
  drift: string;
  op: number;
  desktopOnly: boolean;
};

const PARTICLES: Particle[] = (() => {
  const r = mulberry32(0x05eaf00d);
  const rr = (a: number, b: number) => a + r() * (b - a);
  return Array.from({ length: 48 }, (_, i) => {
    const bubble = r() < 0.15; // a few faster, slightly larger bubbles
    const dur = bubble ? rr(18, 30) : rr(26, 68);
    return {
      left: `${rr(1, 99).toFixed(1)}%`,
      size: Math.round(bubble ? rr(3, 5) : rr(2, 4)),
      dur: `${dur.toFixed(1)}s`,
      delay: `${(-r() * dur).toFixed(1)}s`,
      drift: `${rr(-3, 3).toFixed(1)}vw`,
      op: +(bubble ? rr(0.06, 0.1) : rr(0.04, 0.09)).toFixed(3),
      desktopOnly: i >= 28,
    };
  });
})();

const BUBBLES = [
  { left: 0, bottom: 0, size: 3 },
  { left: 8, bottom: 12, size: 4 },
  { left: 3, bottom: 24, size: 2 },
];

/* ------------------------------------------------------------------ */
/* Creature population: a guaranteed-minimum pool.                     */
/*                                                                     */
/* CORE slots hand off seamlessly — each slot's next fish enters just  */
/* as the current one exits, so a core slot always has a fish on       */
/* screen. LOOSE slots add randomized extra fish with real gaps        */
/* between passes. Every slot is pinned to a depth band (with          */
/* overlapping ranges, so no visual banding) which keeps the upper     */
/* water populated at all times. All parameters re-roll per respawn.   */
/*                                                                     */
/* Occlusion: silhouettes are rendered OPAQUE. Each creature's fill is */
/* pre-blended against the ocean gradient color at its own height      */
/* (fish*alpha + ocean*(1-alpha)), which looks identical to the old    */
/* translucent fill but fully covers anything passing behind it. A     */
/* stable depth-tiered z-index keeps front/back order deterministic.   */
/* ------------------------------------------------------------------ */

type Band = "U" | "M" | "L";
const BANDS: Record<Band, [number, number]> = {
  U: [0.04, 0.38],
  M: [0.32, 0.7],
  L: [0.66, 0.88],
};

// Desktop: 7 always-on core fish + 6 intermittent → 8-14 visible.
const DESKTOP_CORE: Band[] = ["U", "U", "U", "M", "M", "M", "L"];
const DESKTOP_LOOSE: Band[] = ["U", "U", "M", "M", "M", "L"];
// Mobile: 5 core + 2 loose → 4-7 visible.
const MOBILE_CORE: Band[] = ["U", "U", "M", "M", "L"];
const MOBILE_LOOSE: Band[] = ["U", "M"];

type Variant = "drum" | "slender" | "minnow" | "deep" | "shark";

type SchoolMark = {
  left: number;
  top: number;
  w: number;
  color: string;
  bob: string;
  bobDelay: string;
};

type Spawn = {
  id: number;
  kind: "fish" | "shark" | "school";
  variant: Variant;
  topVh: number;
  z: number; // stable stacking tier; nearer creatures cover distant ones
  dir: 1 | -1;
  width: number; // px; for schools, the formation width
  height?: number; // px; schools only
  dur: number; // full crossing seconds
  progress: number; // 0..1 starting progress (negative animation delay)
  blur: number;
  color: string; // pre-blended opaque color
  dyVh: number;
  bob: string;
  marks?: SchoolMark[];
};

type Rgb = [number, number, number];

const rand = (a: number, b: number) => a + Math.random() * (b - a);
const randInt = (a: number, b: number) => Math.round(rand(a, b));
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(Math.random() * arr.length)];
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/* JS mirror of the body gradient in globals.css, used to estimate the
   ocean color behind a creature at a given viewport height. */
const GRADIENT_STOPS: [number, Rgb][] = [
  [0, [9, 155, 254]],
  [5, [6, 141, 249]],
  [10, [5, 124, 242]],
  [15, [2, 99, 230]],
  [25, [2, 70, 213]],
  [35, [0, 47, 179]],
  [45, [2, 30, 137]],
  [55, [1, 18, 90]],
  [65, [0, 8, 45]],
  [75, [1, 3, 16]],
  [85, [1, 2, 10]],
  [95, [0, 0, 0]],
  [100, [0, 0, 0]],
];

function oceanRgbAt(topVh: number): Rgb {
  // The gradient spans the full document, so convert the viewport
  // position into a document fraction before sampling.
  const docH = Math.max(document.documentElement.scrollHeight, window.innerHeight);
  const frac = clamp(((topVh / 100) * window.innerHeight * 100) / docH, 0, 100);
  for (let i = 1; i < GRADIENT_STOPS.length; i++) {
    const [p1, c1] = GRADIENT_STOPS[i - 1];
    const [p2, c2] = GRADIENT_STOPS[i];
    if (frac <= p2) {
      const t = p2 === p1 ? 0 : (frac - p1) / (p2 - p1);
      return [lerp(c1[0], c2[0], t), lerp(c1[1], c2[1], t), lerp(c1[2], c2[2], t)];
    }
  }
  return [0, 0, 0];
}

/* Pre-blend: the opaque color that looks like `fg` at `alpha` over `bg`. */
function blendOver(fg: Rgb, bg: Rgb, alpha: number): string {
  const c = fg.map((f, i) => Math.round(clamp(f * alpha + bg[i] * (1 - alpha), 0, 255)));
  return `rgb(${c[0]}, ${c[1]}, ${c[2]})`;
}

/* Depth (0 = surface, 1 = seafloor): every creature stays inside the
   dark navy family. Shallow fish read clearer purely through contrast
   against the brighter water (plus higher alpha and less blur), never
   by lightening toward gray. Jitter varies same-depth fish. */
const SHALLOW_RGB: Rgb = [14, 38, 84];
const DEEP_RGB: Rgb = [3, 10, 30];

function depthRgb(depth: number): Rgb {
  const j = rand(-8, 8);
  return SHALLOW_RGB.map((s, i) =>
    clamp(lerp(s, DEEP_RGB[i], depth) + j, 0, 255)
  ) as Rgb;
}

const depthOpacity = (depth: number) =>
  clamp(lerp(0.28, 0.11, depth) + rand(-0.04, 0.04), 0.07, 0.34);

const depthBlur = (depth: number) =>
  +clamp(lerp(0.3, 2.6, depth) + rand(-0.2, 0.3), 0, 3).toFixed(2);

const FISH_VARIANTS = [
  { variant: "drum", min: 44, max: 78 },
  { variant: "slender", min: 56, max: 100 },
  { variant: "minnow", min: 22, max: 40 },
  { variant: "deep", min: 36, max: 60 },
] as const;

function makeFish(id: number, band: Band, mobile: boolean, progress: number): Spawn {
  const depth = rand(...BANDS[band]);
  const v = pick(FISH_VARIANTS);
  const large = Math.random() < 0.1 ? 1.4 : 1;
  const width = Math.round(rand(v.min, v.max) * large * (mobile ? 0.85 : 1));
  const sizePace = width < 40 ? 0.85 : width > 80 ? 1.15 : 1;
  const topVh = +(depth * 88).toFixed(1);
  const alpha = depthOpacity(depth) * (mobile ? 0.9 : 1);
  return {
    id,
    kind: "fish",
    variant: v.variant,
    topVh,
    z: 40 + Math.round((1 - depth) * 40),
    dir: Math.random() < 0.5 ? 1 : -1,
    width,
    dur: +(rand(14, 24) * lerp(1, 1.4, depth) * sizePace).toFixed(1),
    progress,
    blur: depthBlur(depth),
    color: blendOver(depthRgb(depth), oceanRgbAt(topVh + 2), alpha),
    dyVh: +rand(-5, 5).toFixed(1),
    bob: `${rand(3, 7).toFixed(1)}s`,
  };
}

function makeShark(id: number, mobile: boolean, range: [number, number]): Spawn {
  // Mostly mid/lower water; occasionally a smaller shark near the top.
  const upper = Math.random() < 0.15;
  const depth = upper ? rand(0.12, 0.3) : rand(range[0], range[1]);
  const scale = (upper ? 0.7 : 1) * (mobile ? 0.85 : 1);
  const topVh = +(depth * 88).toFixed(1);
  const alpha = clamp(lerp(0.17, 0.09, depth) + rand(-0.01, 0.01), 0.08, 0.16);
  return {
    id,
    kind: "shark",
    variant: "shark",
    topVh,
    z: 15 + Math.round((1 - depth) * 10),
    dir: Math.random() < 0.5 ? 1 : -1,
    width: Math.round(rand(120, 180) * scale),
    dur: +rand(22, 35).toFixed(1),
    progress: 0,
    blur: +(depthBlur(depth) + 0.4).toFixed(2),
    color: blendOver(depthRgb(clamp(depth + 0.15, 0, 1)), oceanRgbAt(topVh + 3), alpha),
    dyVh: +rand(-5, 5).toFixed(1),
    bob: `${rand(7, 10).toFixed(1)}s`,
  };
}

function makeSchool(id: number, mobile: boolean, progress: number): Spawn {
  const depth = Math.random() < 0.7 ? rand(0.05, 0.45) : rand(0.45, 0.75);
  const count = mobile ? randInt(10, 16) : randInt(12, 24);
  const W = Math.round(rand(150, 240) * (mobile ? 0.8 : 1));
  const H = Math.round(rand(45, 90));
  const topVh = +(depth * 78).toFixed(1);
  const alpha = clamp(lerp(0.26, 0.1, depth) + rand(-0.03, 0.03), 0.08, 0.3);
  const schoolRgb = depthRgb(depth);
  const ocean = oceanRgbAt(topVh + 3);
  const marks: SchoolMark[] = Array.from({ length: count }, () => ({
    left: Math.round(rand(0, W - 16)),
    top: Math.round(rand(0, H - 6)),
    w: Math.round(rand(9, 16)),
    color: blendOver(schoolRgb, ocean, alpha * rand(0.65, 1)),
    bob: `${rand(2, 4.5).toFixed(1)}s`,
    bobDelay: `${rand(-3, 0).toFixed(1)}s`,
  }));
  return {
    id,
    kind: "school",
    variant: "minnow",
    topVh,
    z: 25 + Math.round((1 - depth) * 10),
    dir: Math.random() < 0.5 ? 1 : -1,
    width: W,
    height: H,
    dur: +rand(24, 40).toFixed(1),
    progress,
    blur: +(depthBlur(depth) + 0.3).toFixed(2),
    color: blendOver(schoolRgb, ocean, alpha),
    dyVh: +rand(-4, 4).toFixed(1),
    bob: "3s",
    marks,
  };
}

function CreatureSvg({ variant }: { variant: Variant }) {
  if (variant === "shark") {
    return (
      <svg viewBox="0 0 160 60" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M154 36c-14-8-30-11-44-12-5 0-11 0-16 0-4-4-8-12-12-18-2 8-6 16-12 20-14 3-30 6-44 8l-20-18c4 10 6 17 10 22l-8 14c8-5 16-8 22-6 12 2 24 3 36 2l8 13c3-7 6-11 12-13 26 0 50-4 68-12z" />
      </svg>
    );
  }
  if (variant === "slender") {
    return (
      <svg viewBox="0 0 96 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M92 10C80 4 56 3 36 4 24 5 14 7 8 10c6 3 16 5 28 6 20 1 44 0 56-6z" />
        <path d="M12 10L2 3c3 5 3 9 0 14z" />
      </svg>
    );
  }
  if (variant === "minnow") {
    return (
      <svg viewBox="0 0 40 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M37 8c-5-5-15-6-22-5-5 1-9 3-11 5 2 2 6 4 11 5 7 1 17 0 22-5z" />
        <path d="M7 8L1 3c2 3 2 7 0 10z" />
      </svg>
    );
  }
  if (variant === "deep") {
    return (
      <svg viewBox="0 0 64 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 18C52 8 40 4 30 5 20 6 12 11 8 18c4 7 12 12 22 13 10 1 22-3 30-13z" />
        <path d="M11 18L2 8c3 6 3 14 0 20z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 72 28" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M68 14c-7-8-19-11-30-11C26 3 14 8 10 14c4 6 16 11 28 11 11 0 23-3 30-11z" />
      <path d="M13 14L1 5c3.2 6 3.2 12 0 18z" />
    </svg>
  );
}

export function Underwater() {
  const [pop, setPop] = useState<Spawn[]>([]);
  const idRef = useRef(1);
  const activeRef = useRef<Spawn[]>([]);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timers = new Set<ReturnType<typeof setTimeout>>();
    let stopped = false;

    const later = (fn: () => void, ms: number) => {
      const t = setTimeout(() => {
        timers.delete(t);
        fn();
      }, ms);
      timers.add(t);
    };

    const sync = () => setPop([...activeRef.current]);

    // Add a spawn and remove it shortly after its crossing completes,
    // keeping the DOM a bounded pool.
    const addSpawn = (c: Spawn, lifeSec: number) => {
      activeRef.current.push(c);
      sync();
      later(() => {
        activeRef.current = activeRef.current.filter((x) => x.id !== c.id);
        sync();
      }, lifeSec * 1000);
    };

    const isMobile = () => window.innerWidth < 640;

    // Core slot: the next fish starts before the current one finishes,
    // bridging both edge transits — the slot always has a visible fish.
    const coreFish = (band: Band, progress: number) => {
      if (stopped) return;
      const mobile = isMobile();
      const f = makeFish(idRef.current++, band, mobile, progress);
      const remaining = (1 - progress) * f.dur;
      addSpawn(f, remaining + 2);
      const lead = mobile ? rand(3, 5) : rand(2, 3.5);
      later(() => coreFish(band, 0), Math.max(1, remaining - lead) * 1000);
    };

    // Loose slot: a real randomized gap between passes adds variety on
    // top of the guaranteed core population.
    const looseFish = (band: Band, progress: number) => {
      if (stopped) return;
      const mobile = isMobile();
      const f = makeFish(idRef.current++, band, mobile, progress);
      const remaining = (1 - progress) * f.dur;
      addSpawn(f, remaining + 2);
      later(() => looseFish(band, 0), (remaining + (mobile ? rand(5, 14) : rand(4, 14))) * 1000);
    };

    const schoolSlot = (progress: number) => {
      if (stopped) return;
      const s = makeSchool(idRef.current++, isMobile(), progress);
      const remaining = (1 - progress) * s.dur;
      addSpawn(s, remaining + 2);
      later(() => schoolSlot(0), (remaining + rand(3, 12)) * 1000);
    };

    // Desktop runs two shark slots pinned to separated depth ranges, so
    // simultaneous sharks sit at clearly different heights. Per-slot
    // cadence 30-60s => combined, a shark spawns roughly every 15-30s.
    // Mobile runs one slot at 25-45s.
    const sharkSlot = (range: [number, number]) => {
      if (stopped) return;
      const mobile = isMobile();
      const s = makeShark(idRef.current++, mobile, range);
      addSpawn(s, s.dur + 2);
      const gap = mobile ? rand(3, 10) : rand(8, 25);
      later(() => sharkSlot(range), (s.dur + gap) * 1000);
    };

    const start = () => {
      const mobile = isMobile();
      const core = mobile ? MOBILE_CORE : DESKTOP_CORE;
      const loose = mobile ? MOBILE_LOOSE : DESKTOP_LOOSE;
      // Every slot starts mid-crossing at a different random progress:
      // the scene is fully populated immediately, and because every
      // subsequent timing is re-rolled per respawn, slots never align.
      core.forEach((band) => coreFish(band, rand(0.05, 0.9)));
      loose.forEach((band) => looseFish(band, rand(0.05, 0.9)));
      schoolSlot(rand(0.2, 0.7));
      if (!mobile) later(() => schoolSlot(0), rand(8, 20) * 1000);
      if (mobile) {
        later(() => sharkSlot([0.35, 0.88]), rand(8, 20) * 1000);
      } else {
        later(() => sharkSlot([0.3, 0.55]), rand(5, 15) * 1000);
        later(() => sharkSlot([0.6, 0.88]), rand(20, 40) * 1000);
      }
    };

    const stopAll = () => {
      timers.forEach(clearTimeout);
      timers.clear();
      activeRef.current = [];
      sync();
    };

    const onRmChange = () => {
      stopAll();
      if (!mql.matches) start();
    };

    if (!mql.matches) start();
    mql.addEventListener("change", onRmChange);

    return () => {
      stopped = true;
      mql.removeEventListener("change", onRmChange);
      timers.forEach(clearTimeout);
      timers.clear();
      activeRef.current = [];
    };
  }, []);

  return (
    <div aria-hidden="true" className="underwater">
      {pop.map((c) => (
        <div
          key={c.id}
          className="uw-js"
          data-kind={c.kind}
          style={
            {
              top: `${c.topVh}vh`,
              width: c.kind === "school" ? c.width : `min(${c.width}px, 72vw)`,
              height: c.height,
              zIndex: c.z,
              filter: c.blur > 0 ? `blur(${c.blur}px)` : undefined,
              color: c.color,
              "--uw-cross-dur": `${c.dur}s`,
              "--uw-cross-delay": `${(-c.progress * c.dur).toFixed(1)}s`,
              "--uw-from": c.dir === 1 ? "calc(-100% - 2vw)" : "calc(100vw + 2vw)",
              "--uw-to": c.dir === 1 ? "calc(100vw + 2vw)" : "calc(-100% - 2vw)",
              "--uw-face": String(c.dir),
              "--uw-dy": `${c.dyVh}vh`,
              "--uw-bob": c.bob,
            } as CSSProperties
          }
        >
          {c.kind === "school"
            ? c.marks!.map((m, i) => (
                <span
                  key={i}
                  className="uw-school-mark"
                  style={
                    {
                      left: m.left,
                      top: m.top,
                      width: m.w,
                      color: m.color,
                      "--uw-bob": m.bob,
                      "--uw-bob-delay": m.bobDelay,
                    } as CSSProperties
                  }
                >
                  <CreatureSvg variant="minnow" />
                </span>
              ))
            : <CreatureSvg variant={c.variant} />}
        </div>
      ))}

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className={p.desktopOnly ? "uw-particle uw-p-desktop" : "uw-particle"}
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size,
              "--uw-dur": p.dur,
              "--uw-delay": p.delay,
              "--uw-drift": p.drift,
              "--uw-op": p.op,
            } as CSSProperties
          }
        />
      ))}

      <div className="uw-bubbles">
        {BUBBLES.map((b, i) => (
          <span
            key={i}
            style={{ left: b.left, bottom: b.bottom, width: b.size, height: b.size }}
          />
        ))}
      </div>
    </div>
  );
}
