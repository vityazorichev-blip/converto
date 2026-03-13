document.addEventListener('DOMContentLoaded', () => {
  const env = document.getElementById('photoEnvelope');
  const sealBtn = document.getElementById('sealBtn');
  const audio = document.getElementById('bgAudio');
  const topDiamond = document.querySelector('.diamond.top');
  const bottomDiamond = document.querySelector('.diamond.bottom');

  function alignDiamonds() {
    if (!topDiamond || !bottomDiamond) return;

    // Берём вычисленную сторону квадрата до поворота
    const rect = topDiamond.getBoundingClientRect();
    const side = rect.width; // ширина = сторона квадрата

    // Половина диагонали: расстояние от центра до острого угла при повороте 45°
    // halfDiag = side / (2*sqrt(2))
    const halfDiag = side / (2 * Math.SQRT2);

    // Сдвигаем: верхний ↑, нижний ↓ на одинаковую величину, чтобы вершины встретились в центре
    topDiamond.style.transform = `translate(-50%, ${-50 - (halfDiag / window.innerHeight) * 100}%) rotate(45deg)`;
    bottomDiamond.style.transform = `translate(-50%, ${-50 + (halfDiag / window.innerHeight) * 100}%) rotate(45deg)`;
  }

  function openEnvelope(){
    if (!env || env.classList.contains('open')) return;

    if (audio) audio.play().catch(()=>{});

    // Отлипание и падение печати
    sealBtn.classList.add('fall');

    // По завершении падения — прячем печать и уводим ромбы
    setTimeout(() => {
      sealBtn.style.display = 'none';
      env.classList.add('open');

      // Скрыть оверлей после анимации
      setTimeout(() => {
        env.classList.add('hidden');
      }, 1100);
    }, 800);
  }

  // Выравнивание при загрузке и изменении размеров/ориентации
  window.addEventListener('load', alignDiamonds);
  window.addEventListener('resize', alignDiamonds);
  window.addEventListener('orientationchange', alignDiamonds);

  // Клик по печати
  if (sealBtn) {
    sealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }
});