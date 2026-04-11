(function () {
  const hudTime = document.getElementById('hudTime');
  function tick() {
    const d = new Date();
    const pad = function (n) { return String(n).padStart(2, '0'); };
    hudTime.textContent = pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  tick();
  setInterval(tick, 1000);

  var sfxClick = new Audio('music/click.wav');
  var sfxPageFlip = new Audio('music/pageflip.wav');
  sfxClick.preload = 'auto';
  sfxPageFlip.preload = 'auto';
  var SFX_VOL = 0.55;
  function playUiClick() {
    sfxClick.volume = SFX_VOL;
    sfxClick.currentTime = 0;
    sfxClick.play().catch(function () {});
  }
  function playPageFlipSfx() {
    sfxPageFlip.volume = SFX_VOL;
    sfxPageFlip.currentTime = 0;
    sfxPageFlip.play().catch(function () {});
  }

  const fsBtn = document.getElementById('fsBtn');
  fsBtn.addEventListener('click', function () {
    playUiClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen();
    }
  });

  var THEME_KEY = 'animeDollTheme';
  function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'verdant' ? 'verdant' : 'cyber';
  }
  function setTheme(theme) {
    if (theme !== 'verdant' && theme !== 'cyber') theme = 'verdant';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {}
    document.dispatchEvent(new CustomEvent('animeDollThemeChange', { detail: { theme: theme } }));
    updateThemeBtn();
  }
  function updateThemeBtn() {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    var t = getTheme();
    btn.textContent = t === 'verdant' ? '森意' : '赛博';
    btn.setAttribute('aria-label', t === 'verdant' ? '当前为森意白金主题，点击切换为赛博青橙' : '当前为赛博青橙主题，点击切换为森意白金');
    btn.title = t === 'verdant' ? '森意白金 · 点击切换赛博青橙' : '赛博青橙 · 点击切换森意白金';
  }
  var themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      playUiClick();
      setTheme(getTheme() === 'cyber' ? 'verdant' : 'cyber');
    });
  }
  updateThemeBtn();

  (function initBgm() {
    var audio = document.getElementById('bgMusic');
    var toggle = document.getElementById('bgmToggle');
    var volInput = document.getElementById('bgmVolume');
    var dock = document.getElementById('bgmDock');
    if (!audio || !toggle || !volInput || !dock) return;

    var VOL_KEY = 'animeDollBgmVolume';
    /** 用户在本会话中主动点了暂停后，不再自动恢复播放 */
    var userPausedBgm = false;

    function clamp01(n) {
      if (n < 0) return 0;
      if (n > 1) return 1;
      return n;
    }

    function applyVolume(v) {
      v = clamp01(v);
      audio.volume = v;
      volInput.value = String(v);
      var pct = Math.round(v * 100);
      volInput.setAttribute('aria-valuetext', pct + '%');
      try {
        localStorage.setItem(VOL_KEY, String(v));
      } catch (err) {}
    }

    try {
      var stored = localStorage.getItem(VOL_KEY);
      if (stored != null && stored !== '') {
        var parsed = parseFloat(stored);
        if (!isNaN(parsed)) applyVolume(parsed);
        else applyVolume(0.35);
      } else {
        applyVolume(0.35);
      }
    } catch (err) {
      applyVolume(0.35);
    }

    function syncPlayingUi() {
      var playing = !audio.paused;
      toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
      toggle.setAttribute('aria-label', playing ? '暂停背景音乐' : '播放背景音乐');
      toggle.title = playing ? '暂停背景音乐' : '播放背景音乐';
      dock.classList.toggle('bgm-dock--playing', playing);
    }

    function tryAutoplayBgm() {
      if (userPausedBgm || audio.volume <= 0) return;
      return audio.play().catch(function () {});
    }

    function removeGestureUnlock() {
      document.removeEventListener('pointerdown', gestureUnlock, true);
      document.removeEventListener('keydown', gestureUnlock, true);
    }

    function gestureUnlock() {
      if (!userPausedBgm && audio.volume > 0 && audio.paused) {
        tryAutoplayBgm();
      }
    }

    syncPlayingUi();
    audio.addEventListener('play', syncPlayingUi);
    audio.addEventListener('pause', syncPlayingUi);
    audio.addEventListener('ended', syncPlayingUi);

    audio.addEventListener('playing', function onPlaying() {
      removeGestureUnlock();
    }, { once: true });

    tryAutoplayBgm();
    audio.addEventListener('canplay', function onCanPlay() {
      audio.removeEventListener('canplay', onCanPlay);
      tryAutoplayBgm();
    });

    document.addEventListener('pointerdown', gestureUnlock, true);
    document.addEventListener('keydown', gestureUnlock, true);

    toggle.addEventListener('click', function () {
      playUiClick();
      if (audio.paused) {
        userPausedBgm = false;
        audio.play().catch(function () {});
      } else {
        userPausedBgm = true;
        audio.pause();
      }
    });

    volInput.addEventListener('input', function () {
      applyVolume(parseFloat(volInput.value) || 0);
      if (audio.volume > 0 && audio.paused && !userPausedBgm) {
        audio.play().catch(function () {});
      }
    });

    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        dock.classList.add('bgm-dock--reduced-motion');
      }
    } catch (e) {}
  })();

  const slides = document.querySelectorAll('.slide');
  const totalSlides = slides.length;
  let currentIndex = 0;
  let isTransitioning = false;
  var slideTransitionMs = 480;
  try {
    var ms = getComputedStyle(document.documentElement).getPropertyValue('--slide-transition-ms').trim();
    if (ms) slideTransitionMs = parseInt(ms, 10) || slideTransitionMs;
  } catch (err) {}

  document.getElementById('totalSlides').textContent = String(totalSlides).padStart(2, '0');

  const dotsContainer = document.getElementById('navDots');
  slides.forEach(function (_, i) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', '第 ' + (i + 1) + ' 页');
    dot.addEventListener('click', function () { goToSlide(i); });
    dotsContainer.appendChild(dot);
  });

  function updateUI() {
    document.getElementById('currentSlide').textContent = String(currentIndex + 1).padStart(2, '0');
    var pct = ((currentIndex + 1) / totalSlides) * 100;
    document.getElementById('progressBar').style.width = pct + '%';
    document.getElementById('progressBar').setAttribute('aria-valuenow', String(currentIndex + 1));
    document.getElementById('progressBar').setAttribute('aria-valuemax', String(totalSlides));
    document.querySelectorAll('.nav-dot').forEach(function (d, i) {
      d.classList.toggle('active', i === currentIndex);
    });
    document.getElementById('prevBtn').classList.toggle('hidden', currentIndex === 0);
    document.getElementById('nextBtn').classList.toggle('hidden', currentIndex === totalSlides - 1);
  }

  function goToSlide(index) {
    if (isTransitioning || index === currentIndex || index < 0 || index >= totalSlides) return;
    playPageFlipSfx();
    isTransitioning = true;
    var direction = index > currentIndex ? 1 : -1;
    var prevEl = slides[currentIndex];
    var nextEl = slides[index];

    prevEl.classList.remove('active', 'exit-left', 'exit-right', 'enter-from-right', 'enter-from-left');
    prevEl.classList.add(direction > 0 ? 'exit-left' : 'exit-right');

    nextEl.classList.remove('active', 'exit-left', 'exit-right', 'enter-from-right', 'enter-from-left');
    nextEl.classList.add(direction > 0 ? 'enter-from-right' : 'enter-from-left');

    requestAnimationFrame(function () {
      void nextEl.offsetWidth;
      nextEl.classList.remove('enter-from-right', 'enter-from-left');
      nextEl.classList.add('active');
      currentIndex = index;
      updateUI();
      onSlideActivate(nextEl);

      var transitionFinished = false;
      var fallbackTimer;
      function finishTransition() {
        if (transitionFinished) return;
        transitionFinished = true;
        clearTimeout(fallbackTimer);
        nextEl.removeEventListener('transitionend', onTransitionEnd);
        prevEl.classList.remove('exit-left', 'exit-right');
        isTransitioning = false;
      }

      function onTransitionEnd(e) {
        if (e.target !== nextEl || e.propertyName !== 'opacity') return;
        finishTransition();
      }

      nextEl.addEventListener('transitionend', onTransitionEnd);
      fallbackTimer = setTimeout(finishTransition, slideTransitionMs + 80);
    });
  }

  function nextSlide() { goToSlide(currentIndex + 1); }
  function prevSlide() { goToSlide(currentIndex - 1); }

  document.getElementById('nextBtn').addEventListener('click', nextSlide);
  document.getElementById('prevBtn').addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      prevSlide();
    }
    if (e.key === 'Home') {
      e.preventDefault();
      goToSlide(0);
    }
    if (e.key === 'End') {
      e.preventDefault();
      goToSlide(totalSlides - 1);
    }
  });

  var touchStartX = 0;
  var touchStartY = 0;
  var touchAxis = null;
  var touchStartedOnHero = false;
  var wrapper = document.getElementById('slidesWrapper');

  wrapper.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    touchStartedOnHero = !!(e.target && e.target.closest && e.target.closest('.cover-hero-canvas-host, .cover-hero-wrap'));
    if (touchStartedOnHero) return;
    touchStartX = e.touches[0].screenX;
    touchStartY = e.touches[0].screenY;
    touchAxis = null;
  }, { passive: true });

  wrapper.addEventListener('touchmove', function (e) {
    if (e.touches.length !== 1) return;
    if (touchStartedOnHero) return;
    var mx = e.touches[0].screenX - touchStartX;
    var my = e.touches[0].screenY - touchStartY;
    if (!touchAxis && (Math.abs(mx) > 12 || Math.abs(my) > 12)) {
      touchAxis = Math.abs(mx) >= Math.abs(my) ? 'h' : 'v';
    }
  }, { passive: true });

  wrapper.addEventListener('touchend', function (e) {
    if (touchStartedOnHero) {
      touchStartedOnHero = false;
      touchAxis = null;
      return;
    }
    var touchEndX = e.changedTouches[0].screenX;
    var diffX = touchStartX - touchEndX;
    var diffY = Math.abs(touchStartY - e.changedTouches[0].screenY);
    if (touchAxis === 'v') {
      touchAxis = null;
      return;
    }
    if (Math.abs(diffX) > 50 && diffY < 100) {
      if (diffX > 0) nextSlide();
      else prevSlide();
    }
    touchAxis = null;
  }, { passive: true });

  var mouseDown = false;
  var mouseStartX = 0;
  wrapper.addEventListener('mousedown', function (e) {
    if (e.target && e.target.closest && e.target.closest('.cover-hero-canvas-host, .cover-hero-wrap')) return;
    mouseDown = true;
    mouseStartX = e.clientX;
  });
  wrapper.addEventListener('mouseup', function (e) {
    if (!mouseDown) return;
    if (e.target && e.target.closest && e.target.closest('.cover-hero-canvas-host, .cover-hero-wrap')) {
      mouseDown = false;
      return;
    }
    mouseDown = false;
    var diff = mouseStartX - e.clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
  });
  wrapper.addEventListener('mouseleave', function () { mouseDown = false; });

  function onSlideActivate(slideEl) {
    // Data bar animation
    var bars = slideEl.querySelectorAll('.data-bar-fill');
    if (bars.length) {
      bars.forEach(function (b) { b.classList.remove('bar-animated'); });
      requestAnimationFrame(function () {
        bars.forEach(function (b) { b.classList.add('bar-animated'); });
      });
    }

    // SVG sparkline draw-in
    var sparklines = slideEl.querySelectorAll('.cagr-sparkline');
    sparklines.forEach(function (sp) {
      sp.classList.remove('sparkline-drawn');
      void sp.offsetWidth;
      sp.classList.add('sparkline-drawn');
    });

    // Matrix point pop-in
    var points = slideEl.querySelectorAll('.matrix-point');
    if (points.length) {
      points.forEach(function (p) { p.classList.remove('pop-in'); });
      requestAnimationFrame(function () {
        points.forEach(function (p) { p.classList.add('pop-in'); });
      });
    }

    // Architecture flow sequential reveal
    var archNodes = slideEl.querySelectorAll('.arch-node');
    var archArrows = slideEl.querySelectorAll('.arch-arrow');
    if (archNodes.length) {
      archNodes.forEach(function (n) { n.classList.remove('node-lit'); });
      archArrows.forEach(function (a) { a.classList.remove('arrow-lit'); });
      archNodes.forEach(function (n, i) {
        setTimeout(function () {
          n.classList.add('node-lit');
          if (i > 0 && archArrows[i - 1]) {
            archArrows[i - 1].classList.add('arrow-lit');
          }
        }, i * 400);
      });
    }

    // Story timeline progressive reveal
    var timeline = slideEl.querySelector('.story-timeline');
    if (timeline) {
      timeline.classList.remove('timeline-active');
      var items = timeline.querySelectorAll('.story-item');
      items.forEach(function (it) { it.classList.remove('story-visible'); });
      requestAnimationFrame(function () {
        timeline.classList.add('timeline-active');
        items.forEach(function (it, i) {
          setTimeout(function () { it.classList.add('story-visible'); }, 200 + i * 250);
        });
      });
    }
  }

  // Canvas dust particle system
  (function initDust() {
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    var canvas = document.getElementById('canvas-dust');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var particles = [];
    var w = 0, h = 0;
    var dustWarmShadow = 'rgba(255, 140, 60, 0.5)';
    var dustWarmFill = 'rgba(255, 160, 80, 0.7)';
    var dustCoolShadow = 'rgba(5, 167, 220, 0.5)';
    var dustCoolFill = 'rgba(120, 210, 240, 0.6)';
    function refreshDustColors() {
      try {
        var st = getComputedStyle(document.documentElement);
        var ws = st.getPropertyValue('--dust-warm-shadow').trim();
        var wf = st.getPropertyValue('--dust-warm-fill').trim();
        var cs = st.getPropertyValue('--dust-cool-shadow').trim();
        var cf = st.getPropertyValue('--dust-cool-fill').trim();
        if (ws) dustWarmShadow = ws;
        if (wf) dustWarmFill = wf;
        if (cs) dustCoolShadow = cs;
        if (cf) dustCoolFill = cf;
      } catch (e) {}
    }
    refreshDustColors();
    document.addEventListener('animeDollThemeChange', refreshDustColors);

    function resize() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    }
    resize();
    window.addEventListener('resize', resize);

    var count = Math.min(Math.floor((w + h) / 35), 60);
    for (var i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: Math.random() * 1.8 + 0.4,
        vy: Math.random() * 0.8 + 0.1,
        rx: Math.random() * 2.5 + 0.5,
        ry: Math.random() * 2.5 + 0.5,
        rot: Math.PI * Math.floor(Math.random() * 2),
        blur: Math.random() * 4 + 1,
        hue: Math.random() > 0.7 ? 20 : 195
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x -= p.vx;
        p.y -= p.vy;
        if (p.x < -10 || p.y < -10) {
          p.x = w + Math.random() * 20;
          p.y = Math.random() * h;
        }
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.shadowBlur = p.blur;
        ctx.shadowColor = p.hue === 20 ? dustWarmShadow : dustCoolShadow;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.rx, p.ry, p.rot, 0, Math.PI * 2);
        ctx.fillStyle = p.hue === 20 ? dustWarmFill : dustCoolFill;
        ctx.fill();
        ctx.restore();
      }
      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  })();

  // 主区大卡片 3D 悬浮：滚动必须在 .ak-card 自身，不能包在外层 overflow 里，否则 3D 会被展平（浏览器限制）
  (function initCardTilt() {
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    function params() {
      if (mqReduce.matches) {
        return { MAX_TILT: 0.4, BASE_ROTATE_Y: -1.0, LIFT_PX: 2, HOVER_SCALE: 1.001 };
      }
      return { MAX_TILT: 0.5, BASE_ROTATE_Y: -1.2, LIFT_PX: 3, HOVER_SCALE: 1.002 };
    }

    var cards = document.querySelectorAll('.ak-card');
    cards.forEach(function (card) {
      var raf = null;
      var pending = null;

      function applyFromEvent(e) {
        var p = params();
        var rect = card.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        var cx = (e.clientX - rect.left) / rect.width;
        var cy = (e.clientY - rect.top) / rect.height;
        cx = Math.max(0, Math.min(1, cx));
        cy = Math.max(0, Math.min(1, cy));
        var tiltX = (0.5 - cy) * p.MAX_TILT * 2;
        var tiltY = (cx - 0.5) * p.MAX_TILT * 2;
        var ry = p.BASE_ROTATE_Y + tiltY;
        card.style.transform =
          'perspective(800px) rotateX(' + tiltX + 'deg) rotateY(' + ry + 'deg) translateZ(' + p.LIFT_PX + 'px) scale(' + p.HOVER_SCALE + ')';
        card.style.setProperty('--tilt-x', (cx * 100) + '%');
        card.style.setProperty('--tilt-y', (cy * 100) + '%');
      }

      function scheduleApply(e) {
        pending = e;
        if (raf != null) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          if (pending) applyFromEvent(pending);
        });
      }

      card.addEventListener('pointerenter', function (e) {
        card.classList.add('tilt-active');
        card.style.transition = 'transform 0.12s ease-out, box-shadow 0.35s ease-out';
        applyFromEvent(e);
      });

      card.addEventListener('pointermove', scheduleApply);

      card.addEventListener('pointerleave', function () {
        if (raf != null) { cancelAnimationFrame(raf); raf = null; }
        pending = null;
        card.classList.remove('tilt-active');
        card.style.transition = 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.45s cubic-bezier(0.22, 1, 0.36, 1)';
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0) scale(1)';
        card.style.removeProperty('--tilt-x');
        card.style.removeProperty('--tilt-y');
      });
    });
  })();

  (function initSidebarInteraction() {
    var mqFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mqFinePointer.matches) return;

    var sidebars = document.querySelectorAll('.ak-sidebar');
    sidebars.forEach(function (sidebar) {
      var raf = null;
      var pending = null;

      function clamp(v, min, max) {
        return Math.max(min, Math.min(max, v));
      }

      function applyFromEvent(e) {
        var rect = sidebar.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) return;
        var nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        var ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
        nx = clamp(nx, -1, 1);
        ny = clamp(ny, -1, 1);

        sidebar.style.setProperty('--ak-sidebar-tilt-x', (-ny * 2.3).toFixed(2) + 'deg');
        sidebar.style.setProperty('--ak-sidebar-tilt-y', (nx * 3.1).toFixed(2) + 'deg');
        sidebar.style.setProperty('--ak-sidebar-shift-x', (nx * 4.5).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-sidebar-shift-y', (ny * 3.5).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-label-shift-x', (nx * 3.2).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-label-shift-y', (ny * 2.4).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-voice-shift-x', (nx * 5.1).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-voice-shift-y', (ny * 3.6).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-pill-shift-x', (nx * 4.0).toFixed(2) + 'px');
        sidebar.style.setProperty('--ak-pill-shift-y', (ny * 2.8).toFixed(2) + 'px');
      }

      function scheduleApply(e) {
        pending = e;
        if (raf != null) return;
        raf = requestAnimationFrame(function () {
          raf = null;
          if (pending) applyFromEvent(pending);
        });
      }

      function reset() {
        sidebar.style.setProperty('--ak-sidebar-tilt-x', '0deg');
        sidebar.style.setProperty('--ak-sidebar-tilt-y', '0deg');
        sidebar.style.setProperty('--ak-sidebar-shift-x', '0px');
        sidebar.style.setProperty('--ak-sidebar-shift-y', '0px');
        sidebar.style.setProperty('--ak-label-shift-x', '0px');
        sidebar.style.setProperty('--ak-label-shift-y', '0px');
        sidebar.style.setProperty('--ak-voice-shift-x', '0px');
        sidebar.style.setProperty('--ak-voice-shift-y', '0px');
        sidebar.style.setProperty('--ak-pill-shift-x', '0px');
        sidebar.style.setProperty('--ak-pill-shift-y', '0px');
      }

      sidebar.addEventListener('pointerenter', function (e) {
        sidebar.classList.add('is-interacting');
        applyFromEvent(e);
      });

      sidebar.addEventListener('pointermove', scheduleApply);

      sidebar.addEventListener('pointerleave', function () {
        if (raf != null) { cancelAnimationFrame(raf); raf = null; }
        pending = null;
        sidebar.classList.remove('is-interacting');
        reset();
      });
    });
  })();

  updateUI();
  onSlideActivate(slides[0]);
  window.goToSlide = goToSlide;
})();
