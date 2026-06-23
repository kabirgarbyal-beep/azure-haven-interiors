/* Maison Lumière — interactions */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Loader ---------- */
  const loader = $('#loader');
  const bar = loader.querySelector('.loader__bar span');
  const pct = $('#loaderPct');
  let p = 0;
  const tick = () => {
    p += Math.random() * 14 + 4;
    if (p > 100) p = 100;
    bar.style.width = p + '%';
    pct.textContent = Math.floor(p) + '%';
    if (p < 100) setTimeout(tick, 90 + Math.random() * 120);
    else setTimeout(() => loader.classList.add('is-done'), 350);
  };
  window.addEventListener('load', tick);

  /* ---------- Scroll progress ---------- */
  const sp = $('#scrollProgress');
  const onScroll = () => {
    const h = document.documentElement;
    const sc = h.scrollTop / (h.scrollHeight - h.clientHeight);
    sp.style.width = (sc * 100) + '%';
    nav.classList.toggle('is-scrolled', h.scrollTop > 40);
  };

  /* ---------- Nav ---------- */
  const nav = $('#nav');
  document.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Particles ---------- */
  const pc = $('#particles');
  if (!reduced) {
    const N = window.innerWidth < 700 ? 14 : 28;
    for (let i = 0; i < N; i++) {
      const e = document.createElement('i');
      const s = Math.random() * 2 + 1;
      e.style.width = e.style.height = s + 'px';
      e.style.left = Math.random() * 100 + 'vw';
      e.style.top = Math.random() * 100 + 'vh';
      e.style.animationDuration = (Math.random() * 18 + 14) + 's';
      e.style.animationDelay = (-Math.random() * 20) + 's';
      e.style.opacity = (Math.random() * .5 + .25).toFixed(2);
      pc.appendChild(e);
    }
  }

  /* ---------- Cursor ---------- */
  const cur = $('#cursor'), dot = $('#cursorDot');
  let cx = 0, cy = 0, tx = 0, ty = 0;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    dot.style.transform = `translate(${tx}px,${ty}px) translate(-50%,-50%)`;
  });
  (function loop() {
    cx += (tx - cx) * .18; cy += (ty - cy) * .18;
    cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  })();
  $$('a, button, [data-magnetic], summary, .card, .compare').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
    el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
  });

  /* ---------- Magnetic buttons ---------- */
  if (!reduced) {
    $$('[data-magnetic]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left - r.width / 2;
        const my = e.clientY - r.top - r.height / 2;
        el.style.transform = `translate(${mx * .25}px, ${my * .35}px)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((ents) => {
    ents.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  $$('.reveal, .reveal-mask, .reveal-words').forEach(el => io.observe(el));

  /* ---------- Split title words for reveal-words ---------- */
  $$('.reveal-words').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w, i) => `<span class="word" style="--i:${i}"><i>${w}</i></span>`).join(' ');
  });

  /* ---------- Stats counter ---------- */
  const cio = new IntersectionObserver((ents) => {
    ents.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const end = +el.dataset.count;
      const suf = el.dataset.suffix || '';
      const dur = 1800; const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur);
        const v = Math.floor(end * (1 - Math.pow(1 - k, 3)));
        el.textContent = v + suf;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- Before / After ---------- */
  const comp = $('#compare');
  if (comp) {
    const after = $('#compareAfter');
    const handle = $('#compareHandle');
    let drag = false;
    const set = (x) => {
      const r = comp.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (x - r.left) / r.width));
      after.style.clipPath = `inset(0 0 0 ${p * 100}%)`;
      handle.style.left = (p * 100) + '%';
    };
    const start = () => drag = true;
    const end = () => drag = false;
    const move = (e) => { if (!drag) return; const x = e.touches ? e.touches[0].clientX : e.clientX; set(x); };
    comp.addEventListener('mousedown', (e) => { start(); set(e.clientX); });
    comp.addEventListener('touchstart', (e) => { start(); set(e.touches[0].clientX); }, { passive: true });
    window.addEventListener('mouseup', end);
    window.addEventListener('touchend', end);
    window.addEventListener('mousemove', move);
    window.addEventListener('touchmove', move, { passive: true });
  }

  /* ---------- Testimonials ---------- */
  const quotes = $$('.quote');
  const dots = $('#qDots');
  let qi = 0; let qTimer;
  quotes.forEach((_, i) => {
    const d = document.createElement('i');
    if (i === 0) d.classList.add('is-active');
    d.addEventListener('click', () => go(i));
    dots.appendChild(d);
  });
  const go = (i) => {
    qi = (i + quotes.length) % quotes.length;
    quotes.forEach((q, k) => q.classList.toggle('is-active', k === qi));
    [...dots.children].forEach((d, k) => d.classList.toggle('is-active', k === qi));
    restart();
  };
  const restart = () => { clearInterval(qTimer); qTimer = setInterval(() => go(qi + 1), 6000); };
  $$('.qbtn').forEach(b => b.addEventListener('click', () => go(qi + (b.dataset.q === 'next' ? 1 : -1))));
  restart();

  /* ---------- Parallax on hero glows & cards ---------- */
  if (!reduced) {
    const glowA = $('.hero__glow--a');
    const glowB = $('.hero__glow--b');
    document.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (glowA) glowA.style.transform = `translateY(${y * .25}px)`;
      if (glowB) glowB.style.transform = `translateY(${y * .15}px)`;
    }, { passive: true });

    /* tilt cards subtly */
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg)`;
      });
      el.addEventListener('mouseleave', () => el.style.transform = '');
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    });
  });
})();