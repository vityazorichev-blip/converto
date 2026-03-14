document.addEventListener('DOMContentLoaded', () => {
  // Музыка и конверт-оверлей
  const audio = document.getElementById('bgAudio');
  const overlay = document.getElementById('envelopeOverlay');
  const sealBtn = document.getElementById('sealImgBtn');

  function openEnvelope() {
    if (!overlay || overlay.classList.contains('open')) return;

    // запуск музыки по клику
    if (audio) audio.play().catch(()=>{});

    // анимация печати, затем разъезд обложек и скрытие
    if (sealBtn) {
      // лёгкий фейд текста ещё до открытия
      overlay.classList.add('opening');
      sealBtn.classList.add('fall');
      setTimeout(() => {
        sealBtn.style.display = 'none';
        overlay.classList.add('open');

        // скрыть оверлей после завершения разъезда
        setTimeout(() => {
          overlay.classList.add('hidden');
        }, 1100); // длительность transition у обложек
      }, 480); // окончание dropOut
    } else {
      overlay.classList.add('open');
      setTimeout(() => overlay.classList.add('hidden'), 1100);
    }
  }

  if (sealBtn) {
    sealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }

  // Reveal-наблюдатели (плавные появления)
  const ioUp = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        ioUp.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.reveal-up, .reveal-left').forEach(el => ioUp.observe(el));

  // Тайминг: поочередное появление пунктов
  const timingContainer = document.querySelector('.timeline');
  if (timingContainer) {
    const items = Array.from(timingContainer.querySelectorAll('.time-item'));
    const ioTiming = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          items.forEach((it, i) => setTimeout(() => it.classList.add('show'), i * 120));
          ioTiming.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    ioTiming.observe(timingContainer);
  }

  // Слайдер “Пожелания”
  const slider = document.querySelector('.wishes-card');
  if (slider) {
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dots = Array.from(slider.querySelectorAll('.dot'));
    const prevBtn = slider.querySelector('.prev');
    const nextBtn = slider.querySelector('.next');
    let idx = 0;
    let autoTimer;

    function setActive(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, si) => s.classList.toggle('is-active', si === idx));
      dots.forEach((d, di) => {
        d.classList.toggle('is-active', di === idx);
        d.setAttribute('aria-selected', di === idx ? 'true' : 'false');
      });
    }
    function next(n = 1) {
      setActive(idx + n);
      restartAuto();
    }
    function prev() { next(-1); }

    function startAuto() {
      stopAuto();
      autoTimer = setInterval(() => next(1), 4000);
    }
    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
    }
    function restartAuto() { startAuto(); }

    // init
    setActive(0);
    startAuto();

    if (nextBtn) nextBtn.addEventListener('click', () => next(1));
    if (prevBtn) prevBtn.addEventListener('click', () => prev());
    dots.forEach((d, i) => d.addEventListener('click', () => { setActive(i); restartAuto(); }));

    // Пауза автопрокрутки при взаимодействии
    slider.addEventListener('pointerdown', stopAuto);
    slider.addEventListener('pointerup', startAuto);
    slider.addEventListener('mouseenter', stopAuto);
    slider.addEventListener('mouseleave', startAuto);
  }

  // Обратный отсчёт (18 июля 2026, 15:30)
  const target = new Date('2026-07-18T15:30:00');
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minutesEl = document.getElementById('cd-minutes');
  const secondsEl = document.getElementById('cd-seconds');

  function updateCountdown() {
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;
    const now = new Date();
    let diff = target - now;
    if (diff <= 0) {
      daysEl.textContent = '0';
      hoursEl.textContent = '0';
      minutesEl.textContent = '0';
      secondsEl.textContent = '0';
      clearInterval(timerId);
      return;
    }
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hrs = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    daysEl.textContent = String(d);
    hoursEl.textContent = String(hrs).padStart(2, '0');
    minutesEl.textContent = String(min).padStart(2, '0');
    secondsEl.textContent = String(sec).padStart(2, '0');
  }
  const timerId = setInterval(updateCountdown, 1000);
  updateCountdown();
});