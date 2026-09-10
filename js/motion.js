(() => {
  "use strict";

  /* =========================================================
     NEKRONEX MOTION V5
     Same engine as V4, hardened so one failing module can
     never take down reveal/animations/transitions for the
     whole page, plus new blink/glow "alive" effects.
     ========================================================= */

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const lowPower = window.matchMedia?.("(max-width: 720px)").matches ?? false;
  const AUDIO_KEY = "nekronex-audio-v4";
  const PORTAL_MS = 1500; // must match css/motion.css .nx-page-transition timings

  const state = {
    audioEnabled: (() => { try { return localStorage.getItem(AUDIO_KEY) !== "off"; } catch { return true; } })(),
    audio: null,
    navigating: false,
    pointerX: innerWidth / 2,
    pointerY: innerHeight / 2,
    particles: [],
    cursorOrb: null,
    cursorHalo: null
  };

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // Run a setup step in isolation: if it throws, log it and keep going
  // instead of aborting every later step (this was the root cause of
  // pages getting stuck with invisible/blurred content).
  function safe(name, fn) {
    try { fn(); } catch (err) { console.error(`[NekroMotion] "${name}" failed, continuing:`, err); }
  }

  function ensureAudio() {
    if (!state.audioEnabled) return null;
    if (state.audio) {
      if (state.audio.ctx.state === "suspended") state.audio.ctx.resume().catch(() => {});
      return state.audio;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      const ctx = new AC();
      const master = ctx.createGain();
      master.gain.value = 0.045;
      master.connect(ctx.destination);
      state.audio = { ctx, master };
      return state.audio;
    } catch {
      return null;
    }
  }

  function tone(kind = "hover") {
    const audio = ensureAudio();
    if (!audio) return;
    const { ctx, master } = audio;
    const presets = {
      hover: [420, 680, 0.045, 0.11, "sine"],
      click: [190, 540, 0.075, 0.17, "triangle"],
      open: [100, 720, 0.24, 0.24, "sine"],
      close: [620, 130, 0.18, 0.20, "triangle"],
      confirm: [360, 980, 0.18, 0.28, "sine"],
      error: [160, 72, 0.19, 0.22, "sawtooth"],
      portal: [42, 1300, 0.80, 0.48, "sine"]
    };
    const [a, b, d, v, type] = presets[kind] || presets.hover;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    osc.type = type;
    osc.frequency.setValueAtTime(a, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, b), now + d);
    filter.type = "lowpass";
    filter.frequency.value = kind === "portal" ? 3800 : 2600;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(v, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + d);
    osc.connect(filter).connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + d + 0.03);

    if (["open", "confirm", "portal"].includes(kind)) {
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = "sine";
      o2.frequency.setValueAtTime(a * 1.95, now);
      o2.frequency.exponentialRampToValueAtTime(Math.max(1, b * 1.18), now + d);
      g2.gain.setValueAtTime(0.0001, now);
      g2.gain.exponentialRampToValueAtTime(v * 0.10, now + 0.015);
      g2.gain.exponentialRampToValueAtTime(0.0001, now + d);
      o2.connect(g2).connect(master);
      o2.start(now);
      o2.stop(now + d + 0.03);
    }
  }

  function trackPointer() {
    // Custom cursor: replaces the OS pointer entirely on desktop-sized
    // screens (touch devices don't have a hover pointer, so we leave
    // the system cursor alone there).
    if (innerWidth >= 900 && matchMedia("(pointer:fine)").matches) {
      document.documentElement.classList.add("nx-custom-cursor");
      const orb = document.createElement("span");
      orb.className = "nx-cursor-orb";
      const halo = document.createElement("span");
      halo.className = "nx-cursor-halo";
      document.body.append(halo, orb);

      document.addEventListener("pointermove", (e) => {
        state.pointerX = e.clientX;
        state.pointerY = e.clientY;
        orb.style.left = `${e.clientX}px`;
        orb.style.top = `${e.clientY}px`;
        halo.style.left = `${e.clientX}px`;
        halo.style.top = `${e.clientY}px`;
      }, { passive: true });

      const interactive = () => {
        document.documentElement.classList.add("nx-pointer-interactive");
        clearTimeout(interactive.timer);
        interactive.timer = setTimeout(() => document.documentElement.classList.remove("nx-pointer-interactive"), 120);
      };
      document.addEventListener("pointerover", (e) => {
        if (e.target.closest("a,button,select,.product-card,.feature,.plan,.faq-q")) interactive();
      }, { passive: true });

      // If the pointer leaves the window or the device turns out to
      // actually be touch-driven, don't leave the user without any
      // visible cursor at all.
      document.addEventListener("pointerdown", (e) => {
        if (e.pointerType === "touch") {
          document.documentElement.classList.remove("nx-custom-cursor");
          orb.remove(); halo.remove();
        }
      }, { passive: true, once: true });
      return;
    }

    document.addEventListener("pointermove", (e) => {
      state.pointerX = e.clientX;
      state.pointerY = e.clientY;
    }, { passive: true });
  }

  function setupNebula() {
    // Soft drifting color clouds behind the stars — pure CSS (no
    // per-frame JS cost), inspired by the nebula art in the brand logo.
    if ($(".nx-nebula-field")) return;
    const field = document.createElement("div");
    field.className = "nx-nebula-field";
    field.setAttribute("aria-hidden", "true");
    const palette = ["blue", "purple", "cyan", "gold", "green", "red"];
    const blobs = lowPower ? 3 : 5;
    for (let i = 0; i < blobs; i++) {
      const blob = document.createElement("span");
      blob.className = `nx-nebula-blob nx-nebula-${palette[i % palette.length]}`;
      blob.style.left = `${Math.random() * 90}%`;
      blob.style.top = `${Math.random() * 90}%`;
      blob.style.setProperty("--nx-neb-dur", `${52 + Math.random() * 40}s`);
      blob.style.setProperty("--nx-neb-delay", `${-Math.random() * 40}s`);
      field.appendChild(blob);
    }
    document.body.appendChild(field);
  }

  function setupParticles() {
    // Full intensity always — this site prioritizes visual impact over
    // following the OS's reduced-motion hint (matches how the reference
    // sites behave: their effects show regardless of that setting).
    const canvas = document.createElement("canvas");
    canvas.className = "nx-visual-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const count = lowPower ? 40 : 85;

    const resize = () => {
      // Capped lower than the usual devicePixelRatio (which can be 2-3
      // on modern phones/laptops): the particle field is soft glowing
      // shapes, not text or sharp UI, so it doesn't need full retina
      // sharpness — and every extra 0.5x here is a real jump in the
      // number of pixels the canvas has to fill every frame.
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    state.particles = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() < 0.08 ? 2.4 + Math.random() * 3.4 : 0.6 + Math.random() * 2.0,
      a: 0.16 + Math.random() * 0.5,
      vy: 0.025 + Math.random() * 0.22,
      vx: (Math.random() - .5) * 0.11,
      tw: Math.random() * Math.PI * 2,
      pulse: Math.random() < 0.45,
      hue: Math.random(),
      glow: false // set below once we know each particle's radius
    }));
    // Only the handful of larger particles get a glow — this is what
    // used to cost a shadowBlur call on every single particle, every
    // frame (the single most expensive thing canvas can do).
    state.particles.forEach(p => { p.glow = p.r > 1.9; });

    // Pre-render one small glow sprite per color instead of asking
    // canvas to blur a shadow live, 190 times a frame. Colors pulled
    // from the site's actual brand palette (not a fixed gold/purple
    // pair) so the field feels like it belongs to the whole site.
    const glowColors = ["45,140,255", "161,107,255", "34,214,255", "212,175,55", "156,255,0", "255,53,71", "255,255,255"];
    const glowSprites = {};
    glowColors.forEach(c => {
      const size = 48;
      const off = document.createElement("canvas");
      off.width = off.height = size;
      const octx = off.getContext("2d");
      const grad = octx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      grad.addColorStop(0, `rgba(${c},.9)`);
      grad.addColorStop(1, `rgba(${c},0)`);
      octx.fillStyle = grad;
      octx.fillRect(0, 0, size, size);
      glowSprites[c] = off;
    });
    // Weighted so white/gold still show up often (keeps the "starfield"
    // feel) while the rest of the palette adds color variety.
    const colorFor = (hue) =>
      hue > .86 ? glowColors[0] :
      hue > .72 ? glowColors[1] :
      hue > .58 ? glowColors[2] :
      hue > .40 ? glowColors[3] :
      hue > .28 ? glowColors[4] :
      hue > .16 ? glowColors[5] :
      glowColors[6];

    resize();
    addEventListener("resize", resize, { passive: true });

    // No more connecting lines between particles — that "constellation/
    // circuit" look required rebuilding a spatial grid and redrawing
    // dozens of line segments every few frames. Removed by request in
    // favor of a plain drifting star/nebula-sparkle field, which reads
    // as the same space theme with a fraction of the per-frame work.

    // Frame-rate cap: without this, the browser tries to redraw the
    // canvas as fast as the display refreshes (60/120/144Hz+). Capping
    // to ~30fps here is the single biggest lever for devices without
    // GPU acceleration, since it directly halves (or more) how often
    // any of the drawing below has to run, and the drift is slow
    // enough that the difference isn't visually noticeable.
    const frameInterval = 1000 / 30;
    let lastFrameTime = 0;

    const frame = (now) => {
      requestAnimationFrame(frame);
      if (now - lastFrameTime < frameInterval) return;
      lastFrameTime = now;

      ctx.clearRect(0, 0, innerWidth, innerHeight);

      state.particles.forEach(p => {
        p.y -= p.vy;
        p.x += p.vx;
        p.tw += p.pulse ? 0.018 : 0.009;
        if (p.y < -10) p.y = innerHeight + 10;
        if (p.x < -10) p.x = innerWidth + 10;
        if (p.x > innerWidth + 10) p.x = -10;

        const pulse = p.pulse ? (0.62 + Math.sin(p.tw) * 0.38) : 1;
        const color = colorFor(p.hue);
        const alpha = Math.min(.92, p.a * pulse);

        if (p.glow) {
          // Cheap glow: draw the pre-rendered sprite instead of a live
          // shadowBlur (drawImage is orders of magnitude cheaper).
          const s = p.r * 9;
          ctx.globalAlpha = alpha;
          ctx.drawImage(glowSprites[color], p.x - s / 2, p.y - s / 2, s, s);
        }

        ctx.globalAlpha = alpha;
        ctx.fillStyle = `rgb(${color})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    requestAnimationFrame(frame);
  }

  function liquid(el) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const wrap = document.createElement("span");
    wrap.className = "nx-liquid-burst";
    wrap.style.left = `${cx}px`;
    wrap.style.top = `${cy}px`;
    const blobCount = 6;
    for (let i = 0; i < blobCount; i++) {
      const blob = document.createElement("span");
      blob.className = "nx-liquid-blob";
      const angle = (i / blobCount) * Math.PI * 2 + Math.random() * 0.6;
      const dist = 26 + Math.random() * 30;
      blob.style.setProperty("--bx", `${Math.cos(angle) * dist}px`);
      blob.style.setProperty("--by", `${Math.sin(angle) * dist}px`);
      blob.style.setProperty("--bs", `${0.5 + Math.random() * 0.7}`);
      blob.style.setProperty("--bd", `${420 + Math.random() * 260}ms`);
      wrap.appendChild(blob);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 760);
  }

  function createPortal() {
    if ($(".nx-page-transition")) return;
    const layer = document.createElement("div");
    layer.className = "nx-page-transition";
    layer.innerHTML = `
      <div class="nx-portal-aura"></div>
      <div class="nx-portal-ring nx-ring-a"></div>
      <div class="nx-portal-ring nx-ring-b"></div>
      <div class="nx-portal-core"></div>
      <div class="nx-portal-sparks"></div>
      <div class="nx-portal-caption">NEKRONEX // TRANSIT</div>
    `;
    document.body.appendChild(layer);
  }

  function spawnSpark(x1, y1, x2, y2, duration = 620, size = 2.5) {
    const s = document.createElement("span");
    s.className = "nx-energy-spark";
    s.style.setProperty("--x1", `${x1}px`);
    s.style.setProperty("--y1", `${y1}px`);
    s.style.setProperty("--x2", `${x2}px`);
    s.style.setProperty("--y2", `${y2}px`);
    s.style.setProperty("--dur", `${duration}ms`);
    s.style.setProperty("--size", `${size}px`);
    document.body.appendChild(s);
    s.addEventListener("animationend", () => s.remove(), { once: true });
  }

  function energy(el, { count = 8, mode = "burst" } = {}) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const d = mode === "orbit" ? Math.max(r.width, r.height) * (.7 + Math.random() * 1.2) : 28 + Math.random() * 80;
      spawnSpark(cx, cy, cx + Math.cos(a) * d, cy + Math.sin(a) * d, 460 + Math.random() * 420, 1.4 + Math.random() * 2.7);
    }
    const pulse = document.createElement("span");
    pulse.className = "nx-energy-pulse";
    pulse.style.left = `${cx}px`;
    pulse.style.top = `${cy}px`;
    document.body.appendChild(pulse);
    pulse.addEventListener("animationend", () => pulse.remove(), { once: true });
  }

  function ripple(el, e) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    const s = document.createElement("span");
    s.className = "nx-ripple-v4";
    s.style.left = `${e.clientX - r.left}px`;
    s.style.top = `${e.clientY - r.top}px`;
    el.appendChild(s);
    s.addEventListener("animationend", () => s.remove(), { once: true });
  }

  function portal(url) {
    if (state.navigating) return;
    state.navigating = true;
    tone("portal");
    const layer = $(".nx-page-transition");
    layer?.classList.add("active");
    energy(document.body, { count: 56, mode: "center" });
    document.documentElement.classList.add("nx-routing");

    // Failsafe: if for any reason we never navigate (blocked popup,
    // JS error elsewhere), don't leave the UI locked forever.
    const failsafe = setTimeout(() => {
      state.navigating = false;
      document.documentElement.classList.remove("nx-routing");
      layer?.classList.remove("active");
    }, PORTAL_MS + 1500);

    setTimeout(() => {
      clearTimeout(failsafe);
      location.href = url;
    }, PORTAL_MS);
  }

  function navigation() {
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target.closest("a[href]");
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.closest("[data-no-transition]")) return;
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("javascript:")) return;
      let url;
      try { url = new URL(href, location.href); } catch { return; }
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.search === location.search && url.hash) return;
      event.preventDefault();
      $$(".open,.active").filter(el => el.closest(".lang,.nav-menu-group,.mobile-menu,.nx-support-widget")).forEach(el => el.classList.remove("open", "active"));
      ripple(link, event);
      portal(url.href);
    });
  }

  function interactions() {
    // By request: no more hover-triggered sound/sparks (was firing on
    // every single element the pointer passed over — costly and, per
    // feedback, more annoying than "interactive" feeling). Ambient
    // motion (particles, nebula, glow/blink) keeps running on its own;
    // actual interaction feedback now only happens on click.
    document.addEventListener("click", (event) => {
      const t = event.target.closest("button,a,select,.faq-q,.product-card,.feature,.plan");
      if (!t) return;
      ripple(t, event);
      energy(t, { count: 6, mode: "burst" });
      if (!t.matches(".lang-btn,.nav-menu-trigger,.faq-q")) tone("click");
    });
  }

  // ---- Reveal on scroll, with a hard fallback so content can never
  // stay stuck invisible even if IntersectionObserver misbehaves. ----
  function reveals() {
    const nodes = $$(".reveal,[data-reveal],.nx-reveal");
    if (!nodes.length) return;

    const forceShow = () => nodes.forEach(n => n.classList.add("visible", "nx-visible"));

    if (!("IntersectionObserver" in window)) { forceShow(); return; }

    try {
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add("visible", "nx-visible");
          obs.unobserve(target);
        });
      }, { threshold: .08, rootMargin: "0px 0px -30px 0px" });

      nodes.forEach((n, i) => {
        n.style.setProperty("--reveal-delay", `${Math.min(i % 8, 7) * 70}ms`);
        io.observe(n);
      });

      // Safety net: whatever hasn't revealed itself after 1.4s
      // (observer edge cases, elements outside any scroll container,
      // a slow/blocked layout) gets revealed anyway.
      setTimeout(() => {
        nodes.forEach(n => { if (!n.classList.contains("visible")) n.classList.add("visible", "nx-visible"); });
      }, 1400);
    } catch (err) {
      console.error("[NekroMotion] reveal observer failed, showing content:", err);
      forceShow();
    }
  }

  function cards() {
    // Tilt-on-hover removed by request (no more "reacts when you pass
    // over it" behavior) — cards just get their base styling class,
    // whatever hover/click visuals exist now live purely in CSS.
    $$(".product-card,.feature,.metric,.collab,.plan,.premium,.ecosystem-panel,.command,.support-card,.cta-box,.visual-panel,.faq-item").forEach(card => {
      card.classList.add("nx-card-v4");
    });
  }

  // ---- New: blinking "live" badges and glowing icon halos, in the
  // spirit of the reference video (pulsing dot on status badges,
  // soft glow breathing on feature icons). Pure CSS-driven so it
  // never depends on JS staying alive after this runs once. ----
  function liveEffects() {
    $$(".eyebrow, .premium-live-badge, .kicker").forEach(el => {
      if (el.querySelector(".nx-live-dot")) return;
      const dot = document.createElement("span");
      dot.className = "nx-live-dot";
      el.prepend(dot);
    });
    $$(".feature-icon").forEach(el => el.classList.add("nx-icon-glow"));
  }

  function pageEntry() {
    document.body.classList.add("nx-entering");
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.body.classList.remove("nx-entering");
      document.body.classList.add("nx-ready");
      reveals();
    }));
    // Extra safety: even if rAF chain gets starved (backgrounded tab,
    // very slow device), never leave the body stuck blurred/hidden.
    setTimeout(() => {
      document.body.classList.remove("nx-entering");
      document.body.classList.add("nx-ready");
    }, 900);
  }

  function audioControl() {
    if ($(".nx-audio-control")) return;
    const btn = document.createElement("button");
    btn.className = "nx-audio-control";
    btn.type = "button";
    btn.setAttribute("aria-label", "Toggle NekroNex interface audio");
    const render = () => {
      btn.innerHTML = `<span>${state.audioEnabled ? "◉" : "○"}</span><small>${state.audioEnabled ? "AUDIO" : "MUTED"}</small>`;
      btn.classList.toggle("muted", !state.audioEnabled);
    };
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.audioEnabled = !state.audioEnabled;
      try { localStorage.setItem(AUDIO_KEY, state.audioEnabled ? "on" : "off"); } catch {}
      if (state.audioEnabled) tone("confirm");
      energy(btn, { count: 10, mode: "burst" });
      render();
    });
    document.body.appendChild(btn);
    render();
  }

  function scrollProgress() {
    const bar = document.createElement("div");
    bar.className = "nx-scroll-progress-v4";
    document.body.appendChild(bar);
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = `${max > 0 ? (scrollY / max) * 100 : 0}%`;
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    update();
  }

  function boot() {
    document.documentElement.dataset.nxMotion = "v5";

    // Each visual module runs isolated: a failure in particles/cursor/etc
    // must never prevent the page content from becoming visible.
    safe("cursor", trackPointer);
    safe("nebula", setupNebula);
    safe("particles", setupParticles);
    safe("portal-layer", createPortal);
    safe("scroll-progress", scrollProgress);
    safe("interactions", interactions);
    safe("navigation", navigation);
    safe("cards", cards);
    safe("live-effects", liveEffects);
    safe("page-entry", pageEntry);
    safe("audio-control", audioControl);

    // Belt-and-braces: run reveal again independently of pageEntry,
    // and once more after full load in case fonts/images shifted layout.
    setTimeout(() => safe("reveals-1", reveals), 80);
    addEventListener("load", () => safe("reveals-2", reveals), { once: true });

    window.NekroMotion = {
      open: (el) => { el?.classList.add("nx-open"); tone("open"); energy(el, { count: 12, mode: "orbit" }); },
      close: (el) => { el?.classList.remove("nx-open"); tone("close"); },
      spark: energy,
      energy,
      liquid,
      portal,
      sound: tone,
      toggleAudio: () => {
        state.audioEnabled = !state.audioEnabled;
        try { localStorage.setItem(AUDIO_KEY, state.audioEnabled ? "on" : "off"); } catch {}
        if (state.audioEnabled) tone("confirm");
        return state.audioEnabled;
      }
    };
    window.dispatchEvent(new CustomEvent("nekronex:motion-ready"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
