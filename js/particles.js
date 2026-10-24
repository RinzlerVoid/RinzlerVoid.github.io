/* Lightweight constellation particles for NEKRONEX.
   Connected points create an elegant network effect without a rendering library.
   Pauses when the tab is hidden and respects reduced-motion preferences. */
(() => {
  "use strict";
  const motionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (motionQuery?.matches) return;

  const canvas = document.createElement("canvas");
  canvas.className = "nx-particle-field";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
  if (!ctx) { canvas.remove(); return; }

  let width = 0, height = 0, scale = 1, points = [];
  let resizeTimer = 0, timer = 0, raf = 0;
  const mobile = () => window.innerWidth < 700;
  const palette = [
    [112, 224, 255],
    [163, 190, 255],
    [191, 160, 255],
    [198, 225, 245]
  ];
  const rand = (min, max) => Math.random() * (max - min) + min;

  function makePoint() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: rand(-0.10, 0.10),
      vy: rand(-0.11, 0.11),
      r: rand(0.65, 1.45),
      alpha: rand(0.30, 0.68),
      phase: rand(0, Math.PI * 2),
      pulse: rand(0.45, 1.0),
      color: palette[Math.floor(Math.random() * palette.length)]
    };
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    scale = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.floor(width * scale);
    canvas.height = Math.floor(height * scale);
    canvas.style.width = width + "px";
    canvas.style.height = "100vh";
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const target = mobile()
      ? Math.min(26, Math.max(17, Math.floor(width * height / 33000)))
      : Math.min(46, Math.max(28, Math.floor(width * height / 30000)));
    points = Array.from({ length: target }, makePoint);
  }

  function draw(time) {
    raf = 0;
    if (document.hidden) return;
    ctx.clearRect(0, 0, width, height);
    const maxDistance = mobile() ? 92 : 132;
    const maxDistanceSq = maxDistance * maxDistance;
    const t = (time || 0) * 0.001;

    // Draw faint links first, like a calm constellation rather than a rigid grid.
    ctx.lineWidth = 0.65;
    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      for (let j = i + 1; j < points.length; j++) {
        const b = points[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > maxDistanceSq) continue;
        const ratio = 1 - Math.sqrt(d2) / maxDistance;
        const shimmer = 0.62 + 0.38 * Math.sin(t * 0.8 + a.phase + b.phase);
        ctx.strokeStyle = `rgba(113,205,255,${ratio * 0.16 * shimmer})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }

    // Gently pulsing nodes.
    for (const p of points) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -8) p.x = width + 8;
      if (p.x > width + 8) p.x = -8;
      if (p.y < -8) p.y = height + 8;
      if (p.y > height + 8) p.y = -8;
      const pulse = 0.72 + 0.28 * Math.sin(t * p.pulse + p.phase);
      const [r, g, b] = p.color;
      ctx.globalAlpha = p.alpha * pulse;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * (0.88 + pulse * 0.16), 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    timer = window.setTimeout(() => {
      timer = 0;
      start();
    }, 40);
  }

  function start() {
    if (!raf && !timer && !document.hidden) {
      raf = requestAnimationFrame(draw);
    }
  }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    raf = 0;
    timer = 0;
  }

  resize();
  start();
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      stop();
      resize();
      start();
    }, 160);
  }, { passive: true });
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  motionQuery?.addEventListener?.("change", (event) => {
    if (event.matches) {
      stop();
      canvas.remove();
    }
  });
})();
