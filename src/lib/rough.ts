import rough from 'roughjs';
import { animate } from 'animejs';

/**
 * Hand-drawn framing for Vernac, the "translator's notebook".
 *
 * `roughFrame` is a Svelte action that overlays a RoughJS-inked outline on top
 * of any element. The outline is stroke-only and click-through, so it reads as a
 * pen border without disturbing the content or focus behaviour underneath.
 *
 * Strokes resolve their colour from CSS custom properties at draw time, so a
 * single shared MutationObserver can re-ink every frame when the theme flips.
 * A per-node ResizeObserver keeps the wobble fitted as the layout reflows.
 */

type Shape = 'frame' | 'underline';

export interface RoughFrameParams {
  /** CSS custom property name to resolve the stroke colour from. */
  stroke?: string;
  strokeWidth?: number;
  roughness?: number;
  bowing?: number;
  /** Corner radius for the frame shape; clamped to half the shorter side. */
  radius?: number;
  /** Inset from the element edges so the wobble stays inside the box. */
  inset?: number;
  shape?: Shape;
  /** Draw the stroke on as if sketched by hand on first mount. */
  animateIn?: boolean;
  /** Re-trace the stroke with the pen-draw animation on the next update (e.g. when the panel gains focus). */
  animate?: boolean;
}

const DEFAULTS: Required<RoughFrameParams> = {
  stroke: '--color-line',
  strokeWidth: 1.4,
  roughness: 1.15,
  bowing: 1.1,
  radius: 12,
  inset: 4,
  shape: 'frame',
  animateIn: false,
  animate: false,
};

const SVG_NS = 'http://www.w3.org/2000/svg';

// One shared observer re-inks every live frame whenever the <html> theme class changes.
const redrawers = new Set<() => void>();
let themeObserver: MutationObserver | null = null;

function ensureThemeObserver(): void {
  if (themeObserver || typeof MutationObserver === 'undefined') return;
  themeObserver = new MutationObserver(() => {
    for (const redraw of redrawers) redraw();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function resolveColor(varName: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim();
  return value || 'currentColor';
}

function roundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  return (
    `M${x + radius},${y} h${w - 2 * radius}` +
    ` a${radius},${radius} 0 0 1 ${radius},${radius} v${h - 2 * radius}` +
    ` a${radius},${radius} 0 0 1 ${-radius},${radius} h${-(w - 2 * radius)}` +
    ` a${radius},${radius} 0 0 1 ${-radius},${-radius} v${-(h - 2 * radius)}` +
    ` a${radius},${radius} 0 0 1 ${radius},${-radius} z`
  );
}

function drawStrokeOn(group: SVGGElement): void {
  const paths = group.querySelectorAll('path');
  paths.forEach((path, index) => {
    const length = path.getTotalLength();
    if (!Number.isFinite(length) || length === 0) return;
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    animate(path, {
      strokeDashoffset: [length, 0],
      duration: 650,
      delay: index * 80,
      ease: 'inOutSine',
    });
  });
}

export function roughFrame(node: HTMLElement, params: RoughFrameParams = {}) {
  let opts: Required<RoughFrameParams> = { ...DEFAULTS, ...params };
  let firstDraw = true;

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('class', 'rough-frame');
  svg.setAttribute('aria-hidden', 'true');

  if (getComputedStyle(node).position === 'static') {
    node.style.position = 'relative';
  }
  node.appendChild(svg);

  function draw(forceAnimate = false): void {
    const w = node.clientWidth;
    const h = node.clientHeight;
    if (w === 0 || h === 0) return;

    svg.setAttribute('width', String(w));
    svg.setAttribute('height', String(h));
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`);
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    const rc = rough.svg(svg);
    const stroke = resolveColor(opts.stroke);
    const o = {
      stroke,
      strokeWidth: opts.strokeWidth,
      roughness: opts.roughness,
      bowing: opts.bowing,
      fill: 'none',
      seed: 42,
    };

    let group: SVGGElement;
    if (opts.shape === 'underline') {
      const y = h - opts.inset;
      group = rc.linearPath(
        [
          [opts.inset, y],
          [w * 0.34, y + 1.5],
          [w * 0.7, y - 1.5],
          [w - opts.inset, y],
        ],
        o,
      ) as SVGGElement;
    } else {
      const inset = opts.inset;
      const rw = Math.max(1, w - inset * 2);
      const rh = Math.max(1, h - inset * 2);
      group = rc.path(roundedRectPath(inset, inset, rw, rh, opts.radius), o) as SVGGElement;
    }

    svg.appendChild(group);

    const shouldAnimate =
      !prefersReducedMotion() && ((firstDraw && opts.animateIn) || forceAnimate);
    if (shouldAnimate) {
      drawStrokeOn(group);
    }
    firstDraw = false;
  }

  ensureThemeObserver();
  redrawers.add(draw);

  const resizeObserver = new ResizeObserver(() => draw());
  resizeObserver.observe(node);

  requestAnimationFrame(() => draw());

  return {
    update(next: RoughFrameParams = {}) {
      opts = { ...DEFAULTS, ...next };
      draw(opts.animate === true);
    },
    destroy() {
      redrawers.delete(draw);
      resizeObserver.disconnect();
      svg.remove();
    },
  };
}
