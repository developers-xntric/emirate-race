/* ==========================================================================
   EVRS 2026 · Community Partners — interactions
   GSAP 3.13 (ScrollTrigger, Draggable, Inertia, SplitText) + Lenis
   ========================================================================== */
(() => {
  "use strict";

  // The application forwards this request securely to the Google Apps Script web app.
  const FORM_ENDPOINT = "/api/evrs-partner-form";

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const isDesk = () => innerWidth > 900;

  if (RM) document.documentElement.classList.add("rm");
  gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin, SplitText);

  const VILLAGES = [
    { k: "qidfa",   name: "Qidfa",           em: "Fujairah",        date: "2026-10-10", c: "#3d93cf", meaning: "Coastal waves" },
    { k: "lehbab",  name: "Al Lehbab",       em: "Dubai",           date: "2026-10-17", c: "#6c71b8", meaning: "Palm frond" },
    { k: "wadi",    name: "Wadi Al Helo",    em: "Sharjah",         date: "2026-10-24", c: "#b80356", meaning: "Ghaf tree" },
    { k: "falaj",   name: "Falaj Al Mualla", em: "Umm Al Quwain",   date: "2026-10-31", c: "#4db4a8", meaning: "The falaj channel" },
    { k: "masfout", name: "Masfout",         em: "Ajman",           date: "2026-11-14", c: "#bb866a", meaning: "The fort" },
    { k: "rams",    name: "Al Rams",         em: "Ras Al Khaimah",  date: "2026-11-28", c: "#f1926e", meaning: "Pearls & fishing" },
    { k: "shuwaib", name: "Al Shuwaib",      em: "Abu Dhabi",       date: "2026-12-05", c: "#dccbc0", meaning: "Desert dunes", dark: true },
  ];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const raceStart = (v) => new Date(v.date + "T00:00:00+04:00"); // start of race day, UAE time
  const pad2 = (n) => String(n).padStart(2, "0");

  const makeMark = () => $("#markTpl").content.firstElementChild.cloneNode(true);
  $$("[data-mark]").forEach((el) => el.append(makeMark()));

  /* ------------------------------------------------------------------ Lenis */
  let lenis = null;
  if (!RM) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1 });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollToEl = (el) => {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { duration: 1.6, easing: (t) => 1 - Math.pow(1 - t, 4) });
    else el.scrollIntoView({ behavior: RM ? "auto" : "smooth" });
  };
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const el = document.querySelector(a.getAttribute("href"));
    if (!el) return;
    e.preventDefault();
    scrollToEl(el);
  });

  /* --------------------------------------------------------------- Confetti */
  const confetti = (() => {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    let parts = [], running = false, dpr = 1;
    const size = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    };
    size(); addEventListener("resize", size);
    const colors = VILLAGES.map((v) => v.c).concat(["#0a3251", "#50acbf"]);
    function burst(x, y, n = 60, cols = colors, power = 1) {
      if (RM) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = (4 + Math.random() * 9) * power;
        parts.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 6 * power,
          r: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
          s: 6 + Math.random() * 9, c: cols[(Math.random() * cols.length) | 0],
          sh: (Math.random() * 3) | 0, life: 1,
        });
      }
      if (!running) { running = true; gsap.ticker.add(tick); }
    }
    function tick() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
      for (const p of parts) {
        p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.006;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
        ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.fillStyle = p.c;
        if (p.sh === 0) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
        else if (p.sh === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 2.6, 0, Math.PI * 2); ctx.fill(); }
        else { ctx.beginPath(); ctx.moveTo(0, -p.s / 2); ctx.lineTo(p.s / 2, p.s / 2); ctx.lineTo(-p.s / 2, p.s / 2); ctx.closePath(); ctx.fill(); }
        ctx.restore();
      }
      if (!parts.length) { running = false; gsap.ticker.remove(tick); ctx.clearRect(0, 0, innerWidth, innerHeight); }
    }
    return { burst };
  })();

  /* ----------------------------------------------------------------- Cursor */
  if (FINE && !RM) {
    document.body.classList.add("has-cursor");
    const ring = $(".cursor"), dot = $(".cursor-dot"), label = $(".cursor span");
    gsap.set([ring, dot], { x: -100, y: -100 });
    const rx = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3" });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08 });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08 });
    addEventListener("pointermove", (e) => { rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); });
    document.addEventListener("pointerover", (e) => {
      const t = e.target.closest("[data-cursor]");
      if (t) { label.textContent = t.dataset.cursor; ring.classList.add("has-label"); }
      else ring.classList.remove("has-label");
    });
    addEventListener("pointerdown", () => ring.classList.add("is-down"));
    addEventListener("pointerup", () => ring.classList.remove("is-down"));
    document.addEventListener("pointerleave", () => gsap.to([ring, dot], { opacity: 0, duration: 0.2 }));
    document.addEventListener("pointerenter", () => gsap.to([ring, dot], { opacity: 1, duration: 0.2 }));
  }

  /* --------------------------------------------------------------- Magnetic */
  if (FINE && !RM) {
    $$(".magnetic").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.28, y: (e.clientY - r.top - r.height / 2) * 0.4, duration: 0.4, ease: "power3" });
      });
      el.addEventListener("pointerleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.35)" }));
    });
  }

  /* ----------------------------------------------------------------- Header */
  const header = $("#header");
  let lastY = 0;
  const onScrollHeader = (y) => {
    header.classList.toggle("is-hidden", y > 400 && y > lastY + 2);
    if (y < lastY - 2 || y < 400) header.classList.remove("is-hidden");
    lastY = y;
  };
  if (lenis) lenis.on("scroll", ({ scroll }) => onScrollHeader(scroll));
  else addEventListener("scroll", () => onScrollHeader(scrollY), { passive: true });

  /* ================================================================ 01 HERO */
  const tilesEl = $("#tiles");
  const heroPattern = $(".hero-pattern");
  let tiles = [];
  function buildTiles() {
    const cols = innerWidth < 700 ? 5 : 10, rows = innerWidth < 700 ? 8 : 6;
    tilesEl.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    tilesEl.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
    if (tiles.length !== cols * rows) {
      tilesEl.innerHTML = "";
      tiles = Array.from({ length: cols * rows }, () => {
        const d = document.createElement("div"); d.className = "tile"; tilesEl.append(d); return d;
      });
    }
    const W = heroPattern.offsetWidth, H = heroPattern.offsetHeight;
    const sc = Math.max(W / 2400, H / 1349), iw = 2400 * sc, ih = 1349 * sc;
    const ox = (W - iw) / 2, oy = (H - ih) / 2, tw = W / cols, th = H / rows;
    tiles.forEach((t, i) => {
      const x = i % cols, y = (i / cols) | 0;
      t.style.backgroundSize = `${iw + 1}px ${ih + 1}px`;
      t.style.backgroundPosition = `${ox - x * tw}px ${oy - y * th}px`;
    });
    return { cols, rows };
  }
  let grid = buildTiles();
  addEventListener("resize", () => { grid = buildTiles(); });

  // Rahhal speaks
  const LINES = [
    "You look quick.",
    "Not quicker than me though.",
    "Think you can beat me?",
    "Seven villages. I’m running all of them. You?",
    "Bring the whole club. I’ll wait. Briefly.",
  ];
  const bubbleText = $("#bubbleText"), bubble = $("#bubble");
  let lineIx = 0, typer = null, bubbleAuto = null;
  function say(text) {
    clearInterval(typer);
    let i = 0; bubbleText.textContent = "";
    gsap.fromTo(bubble, { scale: 0.7, rotation: -6 }, { scale: 1, rotation: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" });
    if (RM) { bubbleText.textContent = text; return; }
    typer = setInterval(() => { bubbleText.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(typer); }, 34);
  }
  const nextLine = () => { lineIx = (lineIx + 1) % LINES.length; say(LINES[lineIx]); };
  const heroRahhal = $("#heroRahhal"), heroImg = $("#heroRahhal img");
  function hop() {
    if (!RM) {
      gsap.timeline()
        .to(heroImg, { scaleY: 0.88, scaleX: 1.08, duration: 0.12, ease: "power2.in" })
        .to(heroImg, { y: -70, scaleY: 1.06, scaleX: 0.96, rotation: gsap.utils.random(-6, 6), duration: 0.32, ease: "power2.out" })
        .to(heroImg, { y: 0, scaleX: 1, scaleY: 1, rotation: 0, duration: 0.7, ease: "bounce.out" });
      const r = heroRahhal.getBoundingClientRect();
      confetti.burst(r.left + r.width / 2, r.top + r.height * 0.3, 26, undefined, 0.7);
    }
    nextLine();
    clearInterval(bubbleAuto); bubbleAuto = setInterval(nextLine, 5200);
  }
  heroRahhal.addEventListener("click", hop);
  heroRahhal.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hop(); } });

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
    if (!RM) {
      tl.from(tiles, {
        scale: 0, rotation: () => gsap.utils.random(-120, 120), opacity: 0, duration: 1.1, ease: "back.out(1.4)",
        stagger: { grid: [grid.rows, grid.cols], from: "center", amount: 0.9 },
      }, 0)
        .from("#heroPanel", { y: 80, opacity: 0, duration: 1.2 }, 0.35)
        .from("#heroTitle .line > span", { yPercent: 115, duration: 1.2, stagger: 0.12 }, 0.5)
        .from(".hero-panel .eyebrow, .hero-sub, .hero-ctas > *", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.8)
        .from(heroImg, { y: 160, scale: 0.8, opacity: 0, duration: 1.4, ease: "elastic.out(1, 0.7)" }, 0.7)
        .from(".rahhal-shadow", { scale: 0, opacity: 0, duration: 0.8 }, 0.9)
        .from(bubble, { scale: 0, opacity: 0, duration: 0.6, ease: "back.out(2)" }, 1.5)
        .from(".scroll-cue", { y: 30, opacity: 0, duration: 0.8 }, 1.6);
    }
    tl.add(() => { say(LINES[0]); bubbleAuto = setInterval(nextLine, 5200); }, RM ? 0 : 1.6);
    $$(".hero-stats strong").forEach((el, i) => {
      const o = { v: 0 };
      tl.to(o, { v: +el.dataset.count, duration: 1.4, ease: "power2.out", onUpdate: () => (el.textContent = Math.round(o.v)) }, RM ? 0 : 1.1 + i * 0.1);
    });
    return tl;
  }

  // mouse parallax + scroll-out
  if (FINE && !RM) {
    const px = gsap.quickTo(tilesEl, "x", { duration: 1.2, ease: "power3" });
    const py = gsap.quickTo(tilesEl, "y", { duration: 1.2, ease: "power3" });
    const rr = gsap.quickTo(heroRahhal, "rotationY", { duration: 0.8, ease: "power3" });
    const rx = gsap.quickTo(heroRahhal, "x", { duration: 0.8, ease: "power3" });
    const pp = gsap.quickTo("#heroPanel", "x", { duration: 1, ease: "power3" });
    gsap.set(heroRahhal, { transformPerspective: 900 });
    $(".hero").addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      px(-nx * 30); py(-ny * 24); rr(nx * 18); rx(nx * 24); pp(nx * -10);
    });
  }
  if (!RM) {
    gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } })
      .to(heroPattern, { scale: 1.18, yPercent: 8, ease: "none" }, 0)
      .to("#heroPanel", { yPercent: 18, ease: "none" }, 0)
      .to(heroRahhal, { yPercent: -16, ease: "none" }, 0)
      .to(".scroll-cue", { opacity: 0, ease: "none", duration: 0.2 }, 0);
  }

  /* ---------------------------------------------------------------- Marquee */
  (function marquee() {
    const track = $("#marqueeTrack");
    const group = () => {
      const g = document.createElement("div"); g.className = "mq-group";
      VILLAGES.forEach((v) => {
        const d = new Date(v.date + "T00:00:00");
        g.insertAdjacentHTML("beforeend",
          `<span class="mq-item" style="--c:${v.c}"><i class="ico" style="--m:url(assets/icons/${v.k}.png)"></i>${v.name}<em>${pad2(d.getDate())} ${MONTHS[d.getMonth()]}</em></span><span class="mq-sep"></span>`);
      });
      return g;
    };
    track.append(group(), group());
    if (RM) return;
    const loop = gsap.to(track, { xPercent: -50, duration: 38, ease: "none", repeat: -1 });
    const skew = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3" });
    let dir = 1;
    if (lenis) lenis.on("scroll", ({ velocity, direction }) => {
      if (direction) dir = direction;
      gsap.to(loop, { timeScale: dir * (1 + Math.min(Math.abs(velocity) / 6, 5)), duration: 0.3, overwrite: true });
      skew(gsap.utils.clamp(-10, 10, -velocity * 0.4));
    });
  })();

  /* ========================================================== 02 INVITATION */
  (function invite() {
    const sils = $$("#invOverlay .sil");
    sils.forEach((p) => p.setAttribute("d", window.MARK7_SIL));
    const groups = $$("#invOverlay .hole-g");
    const overlay = $("#invOverlay"), photo = $("#invitePhoto");
    const BB = { cx: 500.5, cy: 272, h: 190 }, STEM = { x: 480, y: 302 };
    const lerp = (a, b, t) => a + (b - a) * t;
    const state = { e: 0 };
    function apply() {
      const W = innerWidth, H = innerHeight, e = state.e;
      const desk = W > 900;
      const h0 = desk ? Math.min(H * 0.74, W * 0.44) : Math.min(W * 0.62, H * 0.36);
      const c0 = desk ? { x: W * 0.72, y: H * 0.52 } : { x: W * 0.52, y: H * 0.74 };
      const s0 = h0 / BB.h;
      const sEnd = Math.hypot(W, H) / 2 / 26;
      const ee = e * e * (3 - 2 * e);
      const s = s0 * Math.pow(sEnd / s0, ee);
      const pxv = lerp(BB.cx, STEM.x, ee), pyv = lerp(BB.cy, STEM.y, ee);
      const cx = lerp(c0.x, W / 2, ee), cy = lerp(c0.y, H / 2, ee);
      const tr = `translate(${cx} ${cy}) scale(${s}) translate(${-pxv} ${-pyv})`;
      groups.forEach((g) => g.setAttribute("transform", tr));
    }
    apply();
    addEventListener("resize", apply);

    // split paragraph into words for the scroll highlight
    const body = $("#inviteBody");
    body.innerHTML = body.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    const words = $$(".w", body);

    if (RM) { gsap.set(overlay, { display: "none" }); return; }

    gsap.set("#inviteStatement .line > span", { yPercent: 115 });
    gsap.set("#inviteStatement .eyebrow", { opacity: 0 });
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: "#invitePin", start: "top top", end: "+=260%", pin: true, scrub: 0.8, anticipatePin: 1 },
    });
    tl.to(words, { color: "#0a3251", stagger: 0.02, duration: 0.1 }, 0)
      .to("#inviteCopy", { yPercent: -30, opacity: 0, duration: 0.18 }, 0.34)
      .to(state, { e: 1, duration: 0.5, ease: "power1.inOut", onUpdate: apply }, 0.3)
      .fromTo(photo, { scale: 1.3 }, { scale: 1, duration: 0.55 }, 0.28)
      .to(overlay, { opacity: 0, duration: 0.08 }, 0.74)
      .fromTo(photo, { "--dim": 0 }, { "--dim": 1, duration: 0.2 }, 0.62)
      .to("#inviteStatement .eyebrow", { opacity: 1, duration: 0.06 }, 0.8)
      .to("#inviteStatement .line > span", { yPercent: 0, stagger: 0.05, duration: 0.12, ease: "power3.out" }, 0.8)
      .to({}, { duration: 0.06 });
  })();

  /* ============================================================= 03 SEASON */
  const cardsEl = $("#cards");
  (function season() {
    const now = new Date();
    const nextIx = VILLAGES.findIndex((v) => now < new Date(raceStart(v).getTime() + 864e5));
    VILLAGES.forEach((v, i) => {
      const d = new Date(v.date + "T00:00:00");
      const start = raceStart(v), end = new Date(start.getTime() + 864e5);
      let status = "Upcoming", cls = "";
      if (now >= end) { status = "Completed"; cls = "is-done"; }
      else if (now >= start) { status = "Race day"; cls = "is-next"; }
      else if (i === nextIx) { status = "Next up"; cls = "is-next"; }
      cardsEl.insertAdjacentHTML("beforeend", `
        <article class="vcard ${v.dark ? "dark-text" : ""}" style="--c:${v.c}" data-v="${v.k}" tabindex="0" role="button"
          aria-label="Race ${i + 1}: ${v.name}, ${v.em}, Saturday ${d.getDate()} ${MONTHS[d.getMonth()]}. Press to flip for its medal piece." data-cursor="Flip">
          <div class="vcard-inner">
            <div class="vcard-front">
              <div class="vc-top"><span>Race 0${i + 1}</span><span class="vc-status ${cls}">${status}</span></div>
              <div class="vc-date"><strong>${pad2(d.getDate())}</strong><span>${MONTHS[d.getMonth()]}</span></div>
              <i class="ico vc-icon" style="--m:url(assets/icons/${v.k}.png)"></i>
              <div class="vc-foot"><h3>${v.name}</h3><p>${v.em}</p></div>
              <span class="vc-hint" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10a8 8 0 0 0-14-4L4 8M4 14a8 8 0 0 0 14 4l2-2"/><path d="M4 3v5h5M20 21v-5h-5"/></svg></span>
            </div>
            <div class="vcard-back">
              <div class="vb-top"><span>Medal piece</span><span>0${i + 1} / 07</span></div>
              <img src="assets/medals/${v.k}.webp" alt="${v.name} medal piece" loading="lazy">
              <p>${v.name}<span>${v.meaning}</span></p>
            </div>
          </div>
        </article>`);
    });
    const end = document.createElement("div");
    end.className = "vcard-end";
    end.innerHTML = `<div class="end-mark"></div><h3>Collect all seven</h3><p>Seven races. One seven-piece medal for the runners who finish them all.</p><a class="btn btn-navy" href="#collect" data-cursor="Show me">See the medal</a>`;
    $(".end-mark", end).append(makeMark());
    $(".end-mark .mark7", end).style.width = "110px";
    cardsEl.append(end);

    // flip + tilt
    $$(".vcard", cardsEl).forEach((card) => {
      const flip = () => {
        card.classList.toggle("is-flipped");
        if (card.classList.contains("is-flipped") && !RM) {
          const r = card.getBoundingClientRect();
          confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 18, [card.style.getPropertyValue("--c"), "#0a3251", "#fff"], 0.6);
        }
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
      if (FINE && !RM) {
        card.addEventListener("pointermove", (e) => {
          const r = card.getBoundingClientRect();
          card.classList.add("is-tilting");
          card.style.setProperty("--ty", ((e.clientX - r.left) / r.width - 0.5) * 18 + "deg");
          card.style.setProperty("--tx", -((e.clientY - r.top) / r.height - 0.5) * 14 + "deg");
        });
        card.addEventListener("pointerleave", () => {
          card.classList.remove("is-tilting");
          card.style.setProperty("--tx", "0deg"); card.style.setProperty("--ty", "0deg");
        });
      }
    });

    // countdown to the next race day
    const nrName = $("#nrName"), nrLabel = $("#nrLabel"), units = {};
    $$("#nrCount b").forEach((b) => (units[b.dataset.u] = b));
    function tickCountdown() {
      const n = new Date();
      const ix = VILLAGES.findIndex((v) => n < new Date(raceStart(v).getTime() + 864e5));
      if (ix < 0) { nrLabel.textContent = "Season complete"; nrName.textContent = "See you in 2027"; $("#nrCount").hidden = true; return; }
      const v = VILLAGES[ix], diff = Math.max(0, raceStart(v) - n);
      nrLabel.textContent = diff === 0 ? "Race day" : `Next village · Race 0${ix + 1}`;
      nrName.textContent = `${v.name} · ${v.em}`;
      const vals = { d: Math.floor(diff / 864e5), h: Math.floor(diff / 36e5) % 24, m: Math.floor(diff / 6e4) % 60, s: Math.floor(diff / 1e3) % 60 };
      for (const k in vals) {
        const t = pad2(vals[k]);
        if (units[k].textContent !== t) {
          units[k].textContent = t;
          if (!RM && k !== "d") gsap.fromTo(units[k], { yPercent: -35, opacity: 0.2 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
        }
      }
    }
    tickCountdown(); setInterval(tickCountdown, 1000);

    // route line beneath the cards
    const route = $("#route"), routeLine = $("#routeLine"), routeBg = $("#routeBg"), cpsG = $("#routeCps"), runner = $("#routeRunner");
    cardsEl.append(route, runner);
    let len = 0, cpLens = [], routeTop = 0;
    function buildRoute() {
      const cards = $$(".vcard", cardsEl);
      const W = cardsEl.scrollWidth;
      route.setAttribute("width", W); route.setAttribute("height", 120); route.style.width = W + "px";
      const pts = cards.map((c, i) => ({ x: c.offsetLeft + c.offsetWidth / 2, y: i % 2 ? 34 : 78 }));
      pts.unshift({ x: 0, y: 56 });
      let d = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i], mx = (a.x + b.x) / 2;
        d += ` C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
      }
      routeLine.setAttribute("d", d); routeBg.setAttribute("d", d);
      len = routeLine.getTotalLength();
      routeTop = cardsEl.offsetHeight - 14;
      routeLine.style.strokeDasharray = len; routeLine.style.strokeDashoffset = len;
      cpsG.innerHTML = "";
      cpLens = [];
      pts.slice(1, -1).forEach((p, i) => {
        const c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 9); c.setAttribute("class", "route-cp");
        c.dataset.c = VILLAGES[i].c; cpsG.append(c);
        cpLens.push(lenAtX(p.x));
      });
    }
    function lenAtX(x) {
      let lo = 0, hi = len;
      for (let i = 0; i < 22; i++) { const mid = (lo + hi) / 2; if (routeLine.getPointAtLength(mid).x < x) lo = mid; else hi = mid; }
      return lo;
    }
    function updateRunner(progress) {
      if (!len) return;
      const clampedProgress = Math.max(0, Math.min(1, progress));
      const L = len * clampedProgress;
      routeLine.style.strokeDashoffset = len - L;
      const p = routeLine.getPointAtLength(L), p2 = routeLine.getPointAtLength(Math.min(len, L + 4));
      const ang = Math.atan2(p2.y - p.y, p2.x - p.x) * 57.3;
      gsap.set(runner, { x: p.x - 32, y: routeTop + p.y - 78, rotation: ang * 0.35, scaleX: -1 });
      $$("circle", cpsG).forEach((c, i) => {
        const on = L >= cpLens[i] - 2;
        c.style.fill = on ? c.dataset.c : "#fff";
        c.setAttribute("r", on ? 11 : 9);
      });
    }

    const mm = gsap.matchMedia();
    mm.add({ desk: "(min-width: 901px)", mob: "(max-width: 900px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
      buildRoute();
      if (ctx.conditions.desk && !ctx.conditions.reduce) {
        const dist = () => cardsEl.scrollWidth - innerWidth;
        const h = gsap.to(cardsEl, {
          x: () => -dist(), ease: "none",
          scrollTrigger: {
            trigger: "#seasonPin", start: "top -40px", end: () => "+=" + dist(), pin: true, scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true,
            onRefresh: buildRoute,
            onUpdate: (self) => updateRunner(self.progress),
          },
        });
        $$(".vcard", cardsEl).forEach((card, i) => {
          gsap.from(card, {
            yPercent: 18, rotation: i % 2 ? 7 : -7, opacity: 0.2, ease: "power2.out",
            scrollTrigger: { trigger: card, containerAnimation: h, start: "left 105%", end: "left 62%", scrub: true },
          });
          gsap.from($(".vc-icon", card), {
            scale: 0.3, rotation: -90, ease: "back.out(2)",
            scrollTrigger: { trigger: card, containerAnimation: h, start: "left 95%", end: "left 55%", scrub: true },
          });
        });
        updateRunner(0);
      } else {
        const track = $("#seasonTrack");
        const onS = () => updateRunner(track.scrollWidth > track.clientWidth ? track.scrollLeft / (track.scrollWidth - track.clientWidth) : 0);
        track.addEventListener("scroll", onS, { passive: true });
        onS();

        if (!ctx.conditions.mob) return () => track.removeEventListener("scroll", onS);

        const slides = $$(".vcard, .vcard-end", cardsEl);
        const dots = document.createElement("div");
        dots.className = "season-dots";
        dots.setAttribute("aria-label", "Season race cards");
        const dotButtons = slides.map((slide, index) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "season-dot";
          button.setAttribute("aria-label", index < VILLAGES.length ? `Show race ${index + 1}` : "Show Collect all seven");
          dots.append(button);
          return button;
        });
        track.insertAdjacentElement("afterend", dots);

        let active = 0;
        const setActive = (index) => {
          active = index;
          dotButtons.forEach((button, dotIndex) => button.classList.toggle("is-active", dotIndex === active));
        };
        const goTo = (index, behavior = "smooth") => {
          const next = (index + slides.length) % slides.length;
          const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
          const target = Math.max(0, Math.min(maxScroll, slides[next].offsetLeft - (track.clientWidth - slides[next].offsetWidth) / 2));
          setActive(next);
          track.scrollTo({ left: target, behavior });
        };
        const syncActive = () => {
          const center = track.scrollLeft + track.clientWidth / 2;
          let nearest = 0;
          let nearestDistance = Infinity;
          slides.forEach((slide, index) => {
            const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center);
            if (distance < nearestDistance) { nearest = index; nearestDistance = distance; }
          });
          setActive(nearest);
        };
        const onCarouselScroll = () => syncActive();
        track.addEventListener("scroll", onCarouselScroll, { passive: true });
        dotButtons.forEach((button, index) => button.addEventListener("click", () => goTo(index)));
        setActive(0);
        const autoplay = ctx.conditions.reduce ? null : window.setInterval(() => goTo(active + 1), 1500);
        return () => {
          track.removeEventListener("scroll", onS);
          track.removeEventListener("scroll", onCarouselScroll);
          if (autoplay) window.clearInterval(autoplay);
          dots.remove();
        };
      }
    });
  })();

  /* ========================================================== 04 RACE DAY */
  (function raceday() {
    const DIST = [
      { n: 10, dec: 0, desc: "A competitive timed race", laps: "≈ 25 laps of a 400 m track", tag: "The race", c: "var(--wadi)", img: "rahhal-kick.webp", lap: 1.5 },
      { n: 5, dec: 0, desc: "A community run for clubs and groups", laps: "≈ 12.5 laps of a 400 m track", tag: "The club run", c: "var(--teal)", img: "rahhal-run.webp", lap: 2.4 },
      { n: 1.5, dec: 1, desc: "A family run for all ages", laps: "≈ 3.75 laps of a 400 m track", tag: "The family run", c: "var(--orange)", img: "rahhal-bottle.webp", lap: 3.6 },
    ];
    const dist = $("#dist"), tabs = $$(".dist-tab"), num = $("#distNum"), desc = $("#distDesc"), laps = $("#distLaps"), tag = $("#distTag"), img = $("#distRahhal");
    const trail = $("#trail"), dot = $("#trackDot");
    const L = trail.getTotalLength(), SEG = 110;
    trail.style.strokeDasharray = `${SEG} ${L}`;
    let cur = 0, lapDur = DIST[0].lap, t0 = performance.now(), auto = true, autoTween = null, numObj = { v: 10 };

    gsap.ticker.add(() => {
      const p = (((performance.now() - t0) / 1000) / lapDur) % 1;
      const at = p * L, pt = trail.getPointAtLength(at);
      dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y);
      trail.style.strokeDashoffset = SEG - at;
    });

    function select(i, user) {
      if (user) { auto = false; autoTween && autoTween.kill(); gsap.set(".dist-tab .bar", { width: 0 }); }
      if (i === cur && !user) return;
      const d = DIST[i]; cur = i;
      tabs.forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
      dist.style.setProperty("--dc", d.c);
      const keep = (((performance.now() - t0) / 1000) / lapDur) % 1;
      lapDur = d.lap; t0 = performance.now() - keep * lapDur * 1000;
      gsap.to(numObj, { v: d.n, duration: RM ? 0 : 0.9, ease: "power3.out", onUpdate: () => (num.textContent = numObj.v.toFixed(d.dec)) });
      desc.textContent = d.desc; laps.textContent = d.laps; tag.textContent = d.tag;
      if (!RM) {
        gsap.fromTo([desc, laps, tag], { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: "power3.out" });
        gsap.to(img, {
          y: 80, opacity: 0, rotation: 8, duration: 0.25, ease: "power2.in",
          onComplete: () => { img.src = "assets/img/" + d.img; gsap.fromTo(img, { y: 80, opacity: 0, rotation: -8 }, { y: 0, opacity: 1, rotation: 0, duration: 0.8, ease: "back.out(1.8)" }); },
        });
      } else img.src = "assets/img/" + d.img;
      if (auto && !RM) runAuto();
    }
    function runAuto() {
      autoTween && autoTween.kill();
      gsap.set(".dist-tab .bar", { width: 0 });
      autoTween = gsap.to(tabs[cur].querySelector(".bar"), { width: "100%", duration: 5, ease: "none", onComplete: () => auto && select((cur + 1) % 3) });
    }
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(i, true));
      t.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); select((cur + 1) % 3, true); tabs[cur].focus(); }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); select((cur + 2) % 3, true); tabs[cur].focus(); }
      });
    });
    ScrollTrigger.create({
      trigger: dist, start: "top 75%", end: "bottom top",
      onEnter: () => auto && !RM && runAuto(), onEnterBack: () => auto && !RM && runAuto(),
      onLeave: () => autoTween && autoTween.pause(), onLeaveBack: () => autoTween && autoTween.pause(),
    });
    if (!RM) gsap.from(dist, { y: 80, opacity: 0, duration: 1.1, ease: "expo.out", scrollTrigger: { trigger: dist, start: "top 88%" } });
  })();

  /* ------------------------------------------------------ Collect the seven */
  (function collect() {
    const wrap = $("#collectMark"), mark = $(".mark7", wrap), tip = $("#segTip"), row = $("#medalRow");
    const numEl = $("#collectNum"), msg = $("#collectMsg"), autoBtn = $("#collectAuto"), resetBtn = $("#collectReset"), reveal = $("#medalReveal");
    const head = $(".m7-head", mark);
    const got = new Set();
    VILLAGES.forEach((v, i) => {
      row.insertAdjacentHTML("beforeend",
        `<button class="medal-btn ${v.dark ? "dark-text" : ""}" type="button" style="--c:${v.c}" data-v="${v.k}" aria-pressed="false" data-cursor="Collect">
           <span class="chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg></span>
           <img src="assets/medals/${v.k}.webp" alt="" loading="lazy"><span>${v.name}</span>
         </button>`);
    });
    const seg = (k) => $(`.m7-seg[data-v="${k}"]`, mark);
    const btn = (k) => $(`.medal-btn[data-v="${k}"]`, row);

    function take(k, from) {
      if (got.has(k)) return;
      got.add(k);
      const v = VILLAGES.find((x) => x.k === k), s = seg(k), b = btn(k);
      b.setAttribute("aria-pressed", "true");
      const sr = s.getBoundingClientRect();
      const done = () => {
        s.classList.add("got");
        if (!RM) {
          gsap.fromTo(s, { scale: 1.35 }, { scale: 1, duration: 0.9, ease: "elastic.out(1, 0.4)", transformOrigin: "50% 50%" });
          confetti.burst(sr.left + sr.width / 2, sr.top + sr.height / 2, 34, [v.c, "#0a3251", "#ffffff"], 0.8);
        }
        numEl.textContent = got.size;
        if (!RM) gsap.fromTo(numEl, { scale: 1.3 }, { scale: 1, duration: 0.6, ease: "back.out(3)" });
        msg.textContent = got.size < 7 ? `${v.name} collected` : "Full medal unlocked";
        resetBtn.hidden = false;
        if (got.size === 7) finale();
      };
      const srcImg = (from || b).querySelector("img");
      if (RM || !srcImg) return done();
      const r = srcImg.getBoundingClientRect();
      const fly = srcImg.cloneNode();
      fly.className = "fly-medal";
      document.body.append(fly);
      gsap.set(fly, { left: r.left, top: r.top, width: r.width });
      gsap.to(fly, {
        left: sr.left + sr.width / 2 - r.width / 2, top: sr.top + sr.height / 2 - r.height / 2,
        rotation: 360, scale: 0.5, duration: 0.7, ease: "power3.inOut",
        onComplete: () => { fly.remove(); done(); },
      });
      gsap.to(fly, { opacity: 0, duration: 0.2, delay: 0.55 });
    }
    function finale() {
      head.classList.add("got");
      autoBtn.hidden = true;
      if (!RM) {
        const r = wrap.getBoundingClientRect();
        gsap.timeline()
          .to(mark, { rotation: -6, scale: 1.06, duration: 0.25, ease: "power2.out" })
          .to(mark, { rotation: 0, scale: 1, duration: 1, ease: "elastic.out(1, 0.35)" });
        gsap.fromTo(head, { x: -24 }, { x: 0, duration: 0.8, ease: "back.out(3)" });
        confetti.burst(r.left + r.width / 2, r.top + r.height / 2, 160, undefined, 1.3);
        setTimeout(() => confetti.burst(innerWidth * 0.2, innerHeight * 0.4, 70, undefined, 1), 250);
        setTimeout(() => confetti.burst(innerWidth * 0.8, innerHeight * 0.4, 70, undefined, 1), 420);
      }
      reveal.classList.add("is-shown"); reveal.setAttribute("aria-hidden", "false");
      ScrollTrigger.refresh();
      requestAnimationFrame(() => requestAnimationFrame(() => reveal.classList.add("is-open")));
    }
    function reset() {
      got.clear();
      $$(".m7-seg", mark).forEach((s) => s.classList.remove("got"));
      head.classList.remove("got");
      $$(".medal-btn", row).forEach((b) => b.setAttribute("aria-pressed", "false"));
      numEl.textContent = 0; msg.textContent = "Pieces collected";
      resetBtn.hidden = true; autoBtn.hidden = false;
      reveal.classList.remove("is-open", "is-shown"); reveal.setAttribute("aria-hidden", "true");
      ScrollTrigger.refresh();
    }
    row.addEventListener("click", (e) => { const b = e.target.closest(".medal-btn"); if (b) take(b.dataset.v, b); });
    $$(".m7-seg", mark).forEach((s) => {
      s.addEventListener("click", () => take(s.dataset.v));
      s.addEventListener("pointerenter", () => {
        const i = VILLAGES.findIndex((v) => v.k === s.dataset.v), v = VILLAGES[i], d = new Date(v.date + "T00:00:00");
        tip.textContent = `Race 0${i + 1} · ${v.name} · ${d.getDate()} ${MONTHS[d.getMonth()]}`;
        tip.classList.add("on");
      });
      s.addEventListener("pointermove", (e) => {
        const r = wrap.parentElement.getBoundingClientRect();
        tip.style.left = e.clientX - r.left + "px"; tip.style.top = e.clientY - r.top + "px";
      });
      s.addEventListener("pointerleave", () => tip.classList.remove("on"));
    });
    autoBtn.addEventListener("click", () => {
      VILLAGES.filter((v) => !got.has(v.k)).forEach((v, i) => setTimeout(() => take(v.k), i * (RM ? 0 : 420)));
    });
    resetBtn.addEventListener("click", reset);

    if (!RM) {
      gsap.from($$(".m7-seg", mark), {
        scale: 0, rotation: () => gsap.utils.random(-60, 60), transformOrigin: "50% 50%", duration: 0.8, stagger: 0.07, ease: "back.out(2)",
        scrollTrigger: { trigger: wrap, start: "top 80%" },
      });
      gsap.from($$(".medal-btn", row), { y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "back.out(1.6)", scrollTrigger: { trigger: row, start: "top 92%" } });
    }
  })();

  /* ====================================================== 05 EVRS IN NUMBERS */
  (function numbers() {
    const fmt = (v, f, done) => {
      if (f === "K") return done ? "6K+" : Math.round(v).toLocaleString("en-US");
      if (f === "M") return done ? "2M+" : Math.round(v).toLocaleString("en-US");
      if (f === "comma") return Math.round(v).toLocaleString("en-US") + (done ? "+" : "");
      return Math.round(v) + (done ? "+" : "");
    };
    $$(".stat").forEach((s, idx) => {
      const to = +s.dataset.to, f = s.dataset.fmt, num = $(".stat-num", s), dotsEl = $(".stat-dots", s);
      const n = +s.dataset.dots;
      for (let i = 0; i < n; i++) dotsEl.append(document.createElement("i"));
      const dots = [...dotsEl.children];
      if (RM) { num.textContent = fmt(to, f, true); return; }
      num.textContent = fmt(0, f, false);
      const o = { v: 0 };
      const tl = gsap.timeline({ paused: true });
      tl.from(s, { y: 90, rotation: idx % 2 ? 4 : -4, opacity: 0, duration: 1, ease: "expo.out" }, idx * 0.12)
        .from($(".stat-ico", s), { scale: 0, rotation: -120, duration: 0.8, ease: "back.out(2.4)" }, idx * 0.12 + 0.3)
        .to(o, { v: to, duration: 2, ease: "power3.out", onUpdate: () => (num.textContent = fmt(o.v, f, false)) }, idx * 0.12 + 0.3)
        .from(dots, { scale: 0, duration: 0.4, ease: "back.out(3)", stagger: { amount: 1.6, from: "start" } }, idx * 0.12 + 0.3)
        .add(() => { num.textContent = fmt(to, f, true); gsap.fromTo(num, { scale: 1.18 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.4)", transformOrigin: "0% 100%" }); });
      ScrollTrigger.create({ trigger: "#stats", start: "top 80%", once: true, onEnter: () => tl.play() });
      if (FINE) {
        s.addEventListener("pointerenter", () => {
          gsap.to(s, { y: -10, duration: 0.4, ease: "power3.out" });
          gsap.fromTo(dots, { scale: 0.4 }, { scale: 1, duration: 0.5, ease: "back.out(3)", stagger: { amount: 0.5, from: "random" } });
        });
        s.addEventListener("pointerleave", () => gsap.to(s, { y: 0, duration: 0.6, ease: "elastic.out(1, 0.5)" }));
      }
    });
  })();

  /* ======================================================== 06 PARTNERSHIP */
  (function partnership() {
    const pair = $("#pair"), svg = $("#links");
    const left = $$("#pcClub .pc-item"), right = $$("#pcEvrs .pc-item");
    function draw() {
      if (!isDesk()) { svg.innerHTML = ""; return; }
      const pr = pair.getBoundingClientRect();
      svg.setAttribute("viewBox", `0 0 ${pr.width} ${pr.height}`);
      svg.innerHTML = right.flatMap((rt) => rt.dataset.pair.split(" ").map((p) => {
        const l = left.find((x) => x.dataset.pair === p);
        if (!l) return "";
        const a = l.getBoundingClientRect(), b = rt.getBoundingClientRect();
        const x1 = a.right - pr.left, y1 = a.top + a.height / 2 - pr.top, x2 = b.left - pr.left, y2 = b.top + b.height / 2 - pr.top;
        return `<path data-pair="${p}" d="M ${x1} ${y1} C ${x1 + 70} ${y1}, ${x2 - 70} ${y2}, ${x2} ${y2}"/>`;
      })).join("");
    }
    draw(); addEventListener("resize", draw); ScrollTrigger.addEventListener("refresh", draw);
    const hot = (n, on) => {
      $$(`[data-pair~="${n}"]`, pair).forEach((el) => {
        el.classList.toggle("is-hot", on);
        if (el.matches(".pc-item") && !RM && isDesk()) gsap.to(el, { x: on ? (el.closest("#pcEvrs") ? -8 : 8) : 0, duration: 0.4, ease: "power3.out" });
        const av = el.querySelector && el.querySelector(".pc-av");
        if (av && !RM) gsap.to(av, { rotation: on ? -10 : 0, scale: on ? 1.12 : 1, duration: 0.5, ease: "back.out(2)" });
      });
      if (!RM) gsap.to("#xBadge", { rotation: on ? 90 * n[0] : 0, scale: on ? 1.12 : 1, duration: 0.6, ease: "back.out(2)" });
    };
    [...left, ...right].forEach((li) => {
      const ps = li.dataset.pair.split(" ");
      li.addEventListener("pointerenter", () => ps.forEach((p) => hot(p, true)));
      li.addEventListener("pointerleave", () => ps.forEach((p) => hot(p, false)));
    });
    const tickAll = () => {
      left.forEach((li, i) => setTimeout(() => li.classList.add("is-ticked"), RM ? 0 : 300 + i * 260));
      right.forEach((li, i) => setTimeout(() => li.classList.add("is-ticked"), RM ? 0 : 430 + i * 260));
    };
    if (RM) { tickAll(); return; }
    gsap.timeline({ scrollTrigger: { trigger: pair, start: "top 72%", onEnter: tickAll } })
      .from("#pcClub", { x: -140, rotation: -4, opacity: 0, duration: 1.1, ease: "expo.out" }, 0)
      .from("#pcEvrs", { x: 140, rotation: 4, opacity: 0, duration: 1.1, ease: "expo.out" }, 0)
      .from("#xBadge", { scale: 0, rotation: -180, duration: 1, ease: "back.out(2)" }, 0.4)
      .from(".pc-item", { y: 26, opacity: 0, stagger: 0.07, duration: 0.7, ease: "power3.out" }, 0.3)
      .from(".pc-chans i", { scale: 0, opacity: 0, stagger: 0.1, duration: 0.6, ease: "back.out(2.5)" }, 1)
      .from(".pc-av", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)" }, 1.1)
      .from("#links path", { opacity: 0, duration: 0.8, stagger: 0.15 }, 0.9);
  })();

  /* ====================================================== 06 COMMUNITY PILE */
  (function pile() {
    const PHOTOS = [
      { src: "rahhal-startline", cap: "Race day, reporting in.", c: "var(--falaj)", wide: true },
      { src: "rahhal-selfie", cap: "Post-run selfie.", c: "var(--masfout)" },
      { src: "rahhal-cheer", cap: "Last stretch. Keep going.", c: "var(--lehbab)" },
      { src: "rahhal-highfive", cap: "High-fives on the course.", c: "var(--wadi)" },
      { src: "club-warmup", cap: "Warm-up, Rahhal style.", c: "var(--rams)" },
      { src: "rahhal-start", cap: "Start line energy.", c: "var(--qidfa)" },
      { src: "club-group", cap: "Club photo. Guess who’s in the middle.", c: "var(--teal-2)" },
    ];
    const el = $("#pile");
    PHOTOS.forEach((p) => el.insertAdjacentHTML("beforeend",
      `<figure class="snap ${p.wide ? "wide" : ""}" style="--c:${p.c}"><img src="assets/img/${p.src}.webp" alt="Rahhal with runners: ${p.cap}" loading="lazy" draggable="false"><figcaption>${p.cap}<i></i></figcaption></figure>`));
    const snaps = $$(".snap", el);
    let z = 10;
    const scatter = (animate) => {
      const W = el.offsetWidth, H = el.offsetHeight;
      snaps.forEach((s, i) => {
        const props = {
          xPercent: -50, yPercent: -50,
          x: gsap.utils.random(-W * 0.26, W * 0.26), y: gsap.utils.random(-H * 0.2, H * 0.16),
          rotation: gsap.utils.random(-14, 14),
        };
        if (animate) gsap.to(s, { ...props, duration: 1, ease: "expo.out", delay: i * 0.04 });
        else gsap.set(s, props);
      });
    };
    scatter(false);
    const peek = $("#peek"), peekBubble = $("#peekBubble");
    Draggable.create(snaps, {
      type: "x,y", inertia: true, bounds: { minX: -innerWidth, maxX: innerWidth, minY: -innerHeight * 0.6, maxY: innerHeight * 0.6 },
      zIndexBoost: false,
      onPress() { this.target.style.zIndex = ++z; gsap.to(this.target, { scale: 1.06, duration: 0.25 }); },
      onDrag() { gsap.to(this.target, { rotation: gsap.utils.clamp(-25, 25, this.deltaX * 1.2), duration: 0.4 }); if (!RM) gsap.to(peek, { rotation: -14, duration: 0.4 }); },
      onRelease() { gsap.to(this.target, { scale: 1, duration: 0.4 }); if (!RM) gsap.to(peek, { rotation: -4, duration: 0.8, ease: "elastic.out(1,0.4)" }); },
      onClick() { gsap.fromTo(this.target, { rotation: "-=12" }, { rotation: "+=12", duration: 0.7, ease: "elastic.out(1,0.35)" }); },
    });
    $(".pile-hint", el).addEventListener("click", () => scatter(true));
    el.addEventListener("dblclick", () => scatter(true));
    if (RM) return;
    gsap.from(snaps, {
      y: () => innerHeight * 0.7, rotation: () => gsap.utils.random(-50, 50), opacity: 0, duration: 1.2, stagger: 0.09, ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 78%" },
    });
    ScrollTrigger.create({
      trigger: ".moment", start: "top 40%", end: "bottom 60%",
      onToggle: (st) => {
        gsap.to(peek, { x: st.isActive ? "0%" : "120%", rotation: st.isActive ? -4 : -8, duration: st.isActive ? 1.1 : 0.6, ease: st.isActive ? "elastic.out(1,0.6)" : "power3.in", delay: st.isActive ? 0.8 : 0 });
        gsap.to(peekBubble, { opacity: st.isActive ? 1 : 0, scale: st.isActive ? 1 : 0.6, duration: 0.5, ease: "back.out(2)", delay: st.isActive ? 1.6 : 0 });
      },
    });
  })();

  /* =============================================================== 07 JOIN */
  (function join() {
    const chips = $("#chips"), form = $("#joinForm"), size = $("#fSize"), out = $("#sizeOut"), crowd = $("#crowd");
    VILLAGES.forEach((v) => chips.insertAdjacentHTML("beforeend",
      `<button type="button" class="chip ${v.dark ? "dark-text" : ""}" style="--cc:${v.c}" data-v="${v.k}" aria-pressed="false"><i class="ico" style="--m:url(assets/icons/${v.k}.png)"></i>${v.name}</button>`));
    chips.insertAdjacentHTML("beforeend", `<button type="button" class="chip all" data-v="all" aria-pressed="false">Full season · all 7</button>`);
    const vChips = $$('.chip:not(.all)', chips), all = $(".chip.all", chips);
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return;
      if (c === all) { const on = all.getAttribute("aria-pressed") !== "true"; vChips.forEach((x, i) => { x.setAttribute("aria-pressed", on); if (on && !RM) gsap.fromTo(x, { scale: 0.8 }, { scale: 1, duration: 0.5, delay: i * 0.04, ease: "back.out(3)" }); }); }
      else { c.setAttribute("aria-pressed", c.getAttribute("aria-pressed") !== "true"); if (!RM) gsap.fromTo(c, { scale: 0.85 }, { scale: 1, duration: 0.5, ease: "back.out(3)" }); }
      all.setAttribute("aria-pressed", vChips.every((x) => x.getAttribute("aria-pressed") === "true"));
    });

    const cols = VILLAGES.map((v) => v.c);
    function sizeUpdate() {
      const v = +size.value, p = ((v - size.min) / (size.max - size.min)) * 100;
      size.style.setProperty("--p", p + "%");
      out.textContent = v >= 500 ? "500+" : v;
      const n = Math.max(1, Math.round(v / 10));
      while (crowd.children.length < n) {
        const i = document.createElement("i"); i.style.setProperty("--cc", cols[crowd.children.length % 7]); crowd.append(i);
        if (!RM) gsap.from(i, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.4, ease: "back.out(3)" });
      }
      while (crowd.children.length > n) crowd.lastElementChild.remove();
    }
    size.addEventListener("input", sizeUpdate); sizeUpdate();

    const emailOk = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const feedback = $(".jf-fine", form);
      feedback.classList.remove("is-error");
      let bad = [];
      [["#fClub", (v) => v.trim()], ["#fName", (v) => v.trim()], ["#fEmail", emailOk]].forEach(([sel, ok]) => {
        const f = $(sel), wrap = f.closest(".field");
        const fine = ok(f.value); wrap.classList.toggle("has-error", !fine);
        f.setAttribute("aria-invalid", !fine);
        if (!fine) bad.push(f);
      });
      if (bad.length) {
        bad[0].focus();
        if (!RM) bad.forEach((f) => gsap.fromTo(f.closest(".field"), { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1.2, 0.3)" }));
        return;
      }
      const data = {
        club: $("#fClub").value.trim(), name: $("#fName").value.trim(), email: $("#fEmail").value.trim(), phone: $("#fPhone").value.trim(),
        members: size.value, villages: vChips.filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.textContent.trim()),
        note: $("#fNote").value.trim(), source: "EVRS community partners landing page", submittedAt: new Date().toISOString(),
      };
      const submit = $(".jf-submit", form);
      const submitMarkup = submit.innerHTML;
      submit.disabled = true;
      submit.textContent = "Sending…";
      if (FORM_ENDPOINT) {
        try {
          const r = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
          if (!r.ok) throw new Error(r.status);
        } catch (err) {
          submit.disabled = false;
          submit.innerHTML = submitMarkup;
          feedback.classList.add("is-error");
          feedback.textContent = "That didn’t go through. Please try again in a moment.";
          return;
        }
      }
      const fr = form.getBoundingClientRect(), br = submit.getBoundingClientRect();
      const ok = $("#jfSuccess");
      ok.style.setProperty("--sx", ((br.left + br.width / 2 - fr.left) / fr.width) * 100 + "%");
      ok.style.setProperty("--sy", ((br.top + br.height / 2 - fr.top) / fr.height) * 100 + "%");
      $("#jfTitle").textContent = `See you at the start line, ${data.club}.`;
      form.classList.add("is-submitted");
      ok.classList.add("is-on");
      if (!RM) {
        gsap.fromTo($("img", ok), { x: -260, rotation: -10 }, { x: 0, rotation: 0, duration: 1.2, ease: "expo.out", delay: 0.3 });
        confetti.burst(br.left + br.width / 2, br.top, 120, undefined, 1.2);
      }
    });

    if (RM) return;
    gsap.to("#joinPattern", { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".join", start: "top bottom", end: "bottom top", scrub: true } });
    const jr = $("#joinRahhal");
    gsap.timeline({ scrollTrigger: { trigger: ".join", start: "top 60%" } })
      .from(jr, { x: -500, y: 40, rotation: -14, duration: 1.4, ease: "expo.out" })
      .to(jr, { y: -14, rotation: 2, duration: 0.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.from(".join-form", { y: 90, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".join", start: "top 65%" } });
    gsap.from(".join-panel", { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: ".join", start: "top 70%" } });
  })();

  /* ================================================================== HUD */
  (function hud() {
    const hudEl = $("#hud"), fill = $("#hudFill"), runner = $("#hudRunner"), km = $("#hudKm"), track = $("#hudTrack");
    const secs = $$("main > section");
    const dotCols = ["#50acbf", ...VILLAGES.map((v) => v.c)];
    const labels = ["Welcome", "Invitation", "Season", "Race day", "In numbers", "Partnership", "Community", "Join"];
    const dots = secs.map((s, i) => {
      const b = document.createElement("button");
      b.className = "hud-dot"; b.type = "button"; b.style.setProperty("--c", dotCols[i % dotCols.length]);
      b.dataset.label = `0${i + 1} · ${labels[i]}`; b.setAttribute("aria-label", `Go to section ${i + 1}: ${labels[i]}`);
      b.addEventListener("click", () => scrollToEl(s));
      track.append(b); return b;
    });
    let marks = [];
    const measure = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      marks = secs.map((s) => Math.min(1, Math.max(0, (s.getBoundingClientRect().top + scrollY) / max)));
      dots.forEach((d, i) => (d.style.left = marks[i] * 100 + "%"));
    };
    ScrollTrigger.addEventListener("refresh", measure); measure();
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: (st) => {
        const p = st.progress;
        fill.style.width = p * 100 + "%";
        gsap.set(runner, { left: p * 100 + "%", scaleX: -1 });
        km.textContent = (p * 10).toFixed(1);
        dots.forEach((d, i) => d.classList.toggle("is-passed", p >= marks[i] - 0.001));
        hudEl.classList.toggle("is-on", scrollY > innerHeight * 0.6);
      },
    });
    if (!RM) gsap.to(runner, { y: -3, duration: 0.18, yoyo: true, repeat: -1, ease: "sine.inOut" });
  })();

  /* ------------------------------------------------------- Title reveals */
  function titleReveals() {
    if (RM) return;
    $$(".reveal-title").forEach((el) => {
      SplitText.create(el, {
        type: "lines", mask: "lines", autoSplit: true,
        onSplit: (self) => gsap.from(self.lines, { yPercent: 110, duration: 1.1, stagger: 0.1, ease: "expo.out", scrollTrigger: { trigger: el, start: "top 88%" } }),
      });
    });
    const ups = $$(".raceday-head .lead, .collect-copy .lead, .collect-score, .moment-copy > p, .moment-lines li, .join-contact a, .partner-foot, .eyebrow:not(.hero-panel .eyebrow):not(.invite-statement .eyebrow)");
    gsap.set(ups, { y: 30, opacity: 0 });
    ScrollTrigger.batch(ups, { start: "top 90%", once: true, onEnter: (b) => gsap.to(b, { y: 0, opacity: 1, duration: 0.9, stagger: 0.08, ease: "power3.out" }) });
  }

  /* ---------------------------------------------------------------- Loader */
  function runLoader() {
    const loader = $("#loader"), mark = $(".loader .mark7");
    const done = () => {
      loader.remove();
      document.body.classList.remove("is-loading");
      lenis && lenis.start();
    };
    if (RM) { done(); return Promise.resolve(); }
    const segs = VILLAGES.map((v) => $(`.m7-seg[data-v="${v.k}"]`, mark));
    const vEl = $("#loaderVillage"), cEl = $("#loaderCount");
    return new Promise((res) => {
      const tl = gsap.timeline({ onComplete: () => { done(); res(); } });
      tl.from($(".m7-base", mark), { scale: 0.5, opacity: 0, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(1.6)" });
      segs.forEach((s, i) => {
        const at = 0.3 + i * 0.13;
        tl.from(s, { scale: 0, rotation: gsap.utils.random(-50, 50), opacity: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.4)" }, at);
        tl.call(() => { vEl.textContent = VILLAGES[i].name; vEl.style.color = VILLAGES[i].c; cEl.textContent = i + 1; }, null, at);
        tl.fromTo(vEl, { yPercent: 100 }, { yPercent: 0, duration: 0.25, ease: "power3.out" }, at);
      });
      tl.from($(".m7-head", mark), { x: -40, opacity: 0, duration: 0.6, ease: "back.out(2)" }, ">-0.1");
      tl.call(() => { vEl.textContent = "Your club. Seven villages."; vEl.style.color = "#fff"; });
      tl.to({}, { duration: 0.45 });
      tl.to(".loader-village, .loader-count, .loader-skip", { opacity: 0, y: -10, duration: 0.3 });
      tl.to(mark, { scale: 16, rotation: -10, duration: 0.95, ease: "expo.in" }, "<");
      tl.to(loader, { opacity: 0, duration: 0.35 }, "-=0.3");
      $("#loaderSkip").addEventListener("click", () => tl.progress(1));
    });
  }

  const navLinks = $$(".nav a");
  ["s2", "s3", "s4", "numbers", "s5", "s6"].forEach((id) => {
    ScrollTrigger.create({
      trigger: "#" + id, start: "top 50%", end: "bottom 50%",
      onToggle: (st) => navLinks.forEach((a) => a.classList.toggle("is-active", st.isActive && a.getAttribute("href") === "#" + id)),
    });
  });

  /* ------------------------------------------------------------------ Boot */
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 900))]).then(() => {
    titleReveals();
    const intro = heroIntro();
    intro.pause();
    runLoader().then(() => { intro.play(0); ScrollTrigger.refresh(); });
    if (RM) intro.progress(1);
  });
  addEventListener("load", () => ScrollTrigger.refresh());
})();
