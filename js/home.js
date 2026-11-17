/* ============================================================
   Home page scripts
   1) Animated lead-flow panel in the hero
   2) Hero light reveal. Runs on tablet and desktop only (>= 768px).
      It is switched off on phones and for visitors who prefer reduced motion.
   ============================================================ */

/* ---------- 1) Lead-flow panel ---------- */
(function () {
  const items = Array.from(document.querySelectorAll("#flow li"));
  if (!items.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(function (li) { li.classList.add("on", "done"); });
    return;
  }

  let idx = 0;
  function paint() {
    items.forEach(function (li, i) {
      li.classList.toggle("on", i === idx);
      li.classList.toggle("done", i < idx);
    });
  }
  paint();
  setInterval(function () {
    idx = (idx + 1) % (items.length + 1);
    if (idx === items.length) {
      items.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
      return;
    }
    paint();
  }, 1700);
})();

/* ---------- 2) Hero light reveal ---------- */
(function () {
  const root = document.documentElement;
  const hero = document.querySelector(".hero");
  const grid = document.querySelector(".hero-grid");
  const glow = document.querySelector(".hero-light");
  if (!hero || !grid || !glow) return;
  window.__lightOn = true; // tells the safety timer in <head> that this script is running

  /* ---- Tune the effect here ---- */
  const LIGHT = {
    base: 0.18,      // how visible content stays when no light is on it (0 = invisible, 1 = fully visible)
    radius: 340,     // light radius in px
    intro: 2600,     // ms for the first sweep across the headline
    speedX: 0.00042, // drift speed, horizontal (lower = slower)
    speedY: 0.00061  // drift speed, vertical
  };

  const wide = window.matchMedia("(min-width: 768px)");
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
  const allowed = function () { return wide.matches && !calm.matches; };

  let W = 0, H = 0, gx = 0, gy = 0, R = 300;
  function measure() {
    const h = hero.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    W = g.width; H = g.height;
    gx = g.left - h.left; gy = g.top - h.top;
    R = Math.max(190, Math.min(LIGHT.radius, W * 0.5));
    glow.style.setProperty("--gs", (R * 2) + "px");
    grid.style.setProperty("--r", R + "px");
    grid.style.setProperty("--base", LIGHT.base);
  }

  const smooth = function (v) { v = Math.max(0, Math.min(1, v)); return v * v * (3 - 2 * v); };
  const easeInOut = function (p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; };

  /* Pointer light (mouse and pen only) */
  const ptr = { x: -999, y: -999, on: false };
  const cur = { x: -999, y: -999, r: 1 };
  hero.addEventListener("pointermove", function (e) {
    if (e.pointerType === "touch") return;
    const g = grid.getBoundingClientRect();
    ptr.x = e.clientX - g.left;
    ptr.y = e.clientY - g.top;
    ptr.on = true;
  });
  hero.addEventListener("pointerleave", function () { ptr.on = false; });

  let elapsed = 0, last = 0, running = false, raf = 0, visible = true;

  function frame(now) {
    if (!running) return;
    const dtFrame = last ? Math.min(now - last, 64) : 16;
    last = now;
    elapsed += dtFrame;

    const p = Math.min(elapsed / LIGHT.intro, 1);
    const e = easeInOut(p);
    const ix = -R * 0.6 + (W * 0.6 + R * 0.6) * e;
    const iy = H * 0.38;
    const t = Math.max(0, elapsed - LIGHT.intro * 0.6);
    const dx = W * (0.5 + 0.42 * Math.sin(t * LIGHT.speedX + 0.6));
    const dy = H * (0.5 + 0.38 * Math.sin(t * LIGHT.speedY));
    const s = p < 1 ? smooth((p - 0.6) / 0.4) : 1;
    const x = ix + (dx - ix) * s;
    const y = iy + (dy - iy) * s;

    if (ptr.on) {
      if (cur.r <= 2) { cur.x = ptr.x; cur.y = ptr.y; }
      cur.x += (ptr.x - cur.x) * 0.16;
      cur.y += (ptr.y - cur.y) * 0.16;
    }
    cur.r += ((ptr.on ? R * 0.7 : 1) - cur.r) * 0.08;

    grid.style.setProperty("--lx", x.toFixed(1) + "px");
    grid.style.setProperty("--ly", y.toFixed(1) + "px");
    grid.style.setProperty("--px", cur.x.toFixed(1) + "px");
    grid.style.setProperty("--py", cur.y.toFixed(1) + "px");
    grid.style.setProperty("--pr", Math.max(1, cur.r).toFixed(1) + "px");
    glow.style.transform = "translate3d(" + (gx + x - R).toFixed(1) + "px," + (gy + y - R).toFixed(1) + "px,0)";

    raf = requestAnimationFrame(frame);
  }

  function start() { if (running) return; running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  /* Turn the effect on or off whenever the screen size or motion preference changes */
  function sync() {
    if (allowed()) {
      root.classList.add("has-light");
      measure();
      if (visible && !document.hidden) start();
    } else {
      stop();
      root.classList.remove("has-light");
    }
  }

  if ("ResizeObserver" in window) new ResizeObserver(function () { if (allowed()) measure(); }).observe(grid);
  else window.addEventListener("resize", function () { if (allowed()) measure(); });
  if (wide.addEventListener) { wide.addEventListener("change", sync); calm.addEventListener("change", sync); }
  else { wide.addListener(sync); calm.addListener(sync); }

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (allowed()) { visible && !document.hidden ? start() : stop(); }
    }).observe(hero);
  }
  document.addEventListener("visibilitychange", function () {
    if (!allowed()) return;
    if (document.hidden) stop(); else if (visible) start();
  });

  sync();
})();
