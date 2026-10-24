/* Lightweight ambient points: viewport-only canvas, no connecting lines or audio. */
(() => {
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.createElement('canvas');
  canvas.className = 'nx-particle-field';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
  if (!ctx) { canvas.remove(); return; }
  let width = 0, height = 0, scale = 1, points = [], resizeTimer = 0, timer = 0, raf = 0;
  const palette = ['#77e7ff', '#c3d9eb', '#b0a1ff'];
  const makePoint = () => ({
    x: Math.random() * width, y: Math.random() * height,
    r: Math.random() * 1.15 + .4,
    vy: Math.random() * .16 + .04,
    vx: (Math.random() - .5) * .045,
    a: Math.random() * .44 + .18,
    phase: Math.random() * Math.PI * 2,
    pulse: Math.random() * .025 + .012,
    c: palette[Math.floor(Math.random() * palette.length)]
  });
  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    scale = Math.min(window.devicePixelRatio || 1, 1.25);
    canvas.width = Math.floor(width * scale); canvas.height = Math.floor(height * scale);
    canvas.style.width = width + 'px'; canvas.style.height = '100vh';
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    const count = Math.min(window.innerWidth < 700 ? 22 : 48, Math.max(window.innerWidth < 700 ? 14 : 24, Math.floor(width * height / 42000)));
    points = Array.from({ length: count }, makePoint);
  }
  function draw() {
    raf = 0;
    if (document.hidden) return;
    ctx.clearRect(0, 0, width, height);
    for (const p of points) {
      p.y -= p.vy; p.x += p.vx;
      if (p.y < -4) { p.y = height + 4; p.x = Math.random() * width; }
      if (p.x < -4) p.x = width + 4;
      if (p.x > width + 4) p.x = -4;
      p.phase += p.pulse;
      ctx.globalAlpha = p.a * (0.68 + 0.32 * ((Math.sin(p.phase) + 1) / 2)); ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    timer = window.setTimeout(() => { timer = 0; start(); }, 45);
  }
  function start() { if (!raf && !timer && !document.hidden) raf = requestAnimationFrame(draw); }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    raf = 0; timer = 0;
  }
  resize(); start();
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(() => { stop(); resize(); start(); }, 140); }, { passive: true });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();
