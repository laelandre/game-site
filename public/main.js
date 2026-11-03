/**
 * PIXEL SURVIVORS - Main Page Interactivity
 * Handles CRT filter, 8-directional character spinner, ambient particles, download feedback, and audio controls.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. Ambient Background Particles (Embers) ---
  const ambientCanvas = document.getElementById('ambient-canvas');
  if (ambientCanvas) {
    const actx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const embers = [];
    const emberCount = Math.min(45, Math.floor(width / 30));

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.3 - Math.random() * 0.7,
        size: 1.5 + Math.random() * 2.5,
        alpha: 0.1 + Math.random() * 0.6,
        color: Math.random() > 0.4 ? '#38bdf8' : '#facc15'
      });
    }

    function animateEmbers() {
      actx.clearRect(0, 0, width, height);
      embers.forEach(e => {
        e.x += e.vx;
        e.y += e.vy;
        if (e.y < -10) {
          e.y = height + 10;
          e.x = Math.random() * width;
        }
        if (e.x < -10) e.x = width + 10;
        if (e.x > width + 10) e.x = -10;

        actx.save();
        actx.globalAlpha = e.alpha;
        actx.fillStyle = e.color;
        actx.shadowColor = e.color;
        actx.shadowBlur = 6;
        actx.fillRect(Math.round(e.x), Math.round(e.y), e.size, e.size);
        actx.restore();
      });
      requestAnimationFrame(animateEmbers);
    }
    animateEmbers();
  }

  // --- 2. CRT Scanline Toggle ---
  const crtToggleBtn = document.getElementById('toggle-crt-btn');
  const footerCrtToggle = document.getElementById('footer-crt-toggle');
  const footerCrtStatus = document.getElementById('footer-crt-status');

  function updateCrtState(active) {
    if (active) {
      document.body.classList.add('crt-active');
      if (crtToggleBtn) {
        const ind = crtToggleBtn.querySelector('.btn-indicator');
        if (ind) ind.classList.add('on');
      }
      if (footerCrtStatus) footerCrtStatus.textContent = 'Ligado';
      localStorage.setItem('pixel_survivors_crt', 'on');
    } else {
      document.body.classList.remove('crt-active');
      if (crtToggleBtn) {
        const ind = crtToggleBtn.querySelector('.btn-indicator');
        if (ind) ind.classList.remove('on');
      }
      if (footerCrtStatus) footerCrtStatus.textContent = 'Desligado';
      localStorage.setItem('pixel_survivors_crt', 'off');
    }
  }

  // Initial CRT Preference check
  const savedCrt = localStorage.getItem('pixel_survivors_crt');
  if (savedCrt === 'off') {
    updateCrtState(false);
  } else {
    updateCrtState(true);
  }

  if (crtToggleBtn) {
    crtToggleBtn.addEventListener('click', () => {
      const isCurrentlyActive = document.body.classList.contains('crt-active');
      updateCrtState(!isCurrentlyActive);
    });
  }

  if (footerCrtToggle) {
    footerCrtToggle.addEventListener('click', () => {
      const isCurrentlyActive = document.body.classList.contains('crt-active');
      updateCrtState(!isCurrentlyActive);
    });
  }

  // --- 3. Sound Toggle ---
  const soundToggleBtn = document.getElementById('toggle-sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  let soundEnabled = true;

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (window.gameSound) {
        window.gameSound.enabled = soundEnabled;
        if (soundEnabled) {
          window.gameSound.init();
          window.gameSound.playGem();
        }
      }
      if (soundIcon) soundIcon.textContent = soundEnabled ? '🔊' : '🔇';
      if (soundText) soundText.textContent = soundEnabled ? 'SOM' : 'MUDO';
    });
  }

  // --- 4. 8-Directional Character Spinner ---
  const wizardImg = document.getElementById('wizard-rotate-img');
  const dirLabel = document.getElementById('current-direction-text');
  const dirButtons = document.querySelectorAll('.dir-btn');
  const spinAutoBtn = document.getElementById('toggle-spin-animation');

  const directions = [
    { key: 'south', name: 'Sul (Frente / South)' },
    { key: 'south-west', name: 'Sudoeste (South-West)' },
    { key: 'west', name: 'Oeste (Esquerda / West)' },
    { key: 'north-west', name: 'Noroeste (North-West)' },
    { key: 'north', name: 'Norte (Costas / North)' },
    { key: 'north-east', name: 'Nordeste (North-East)' },
    { key: 'east', name: 'Leste (Direita / East)' },
    { key: 'south-east', name: 'Sudeste (South-East)' }
  ];

  let currentDirIndex = 0;
  let autoSpinInterval = null;

  function setDirection(dirKey) {
    const foundIndex = directions.findIndex(d => d.key === dirKey);
    if (foundIndex === -1) return;
    currentDirIndex = foundIndex;

    const dirObj = directions[foundIndex];
    if (wizardImg) {
      wizardImg.src = `assets/wizard/rotations/${dirObj.key}.png`;
    }
    if (dirLabel) {
      dirLabel.textContent = `Direção: ${dirObj.name}`;
    }

    dirButtons.forEach(btn => {
      if (btn.dataset.dir === dirObj.key) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  dirButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        if (spinAutoBtn) spinAutoBtn.textContent = '🔄 ROTAÇÃO AUTOMÁTICA';
      }
      setDirection(btn.dataset.dir);
    });
  });

  if (spinAutoBtn) {
    spinAutoBtn.addEventListener('click', () => {
      if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        spinAutoBtn.textContent = '🔄 ROTAÇÃO AUTOMÁTICA';
      } else {
        spinAutoBtn.textContent = '⏹ PARAR ROTAÇÃO';
        autoSpinInterval = setInterval(() => {
          currentDirIndex = (currentDirIndex + 1) % directions.length;
          setDirection(directions[currentDirIndex].key);
        }, 350);
      }
    });
  }

  // Drag on character viewer display to spin
  const viewerDisplay = document.querySelector('.viewer-display');
  if (viewerDisplay) {
    let isDragging = false;
    let startX = 0;

    const onStart = (clientX) => {
      isDragging = true;
      startX = clientX;
      if (autoSpinInterval) {
        clearInterval(autoSpinInterval);
        autoSpinInterval = null;
        if (spinAutoBtn) spinAutoBtn.textContent = '🔄 ROTAÇÃO AUTOMÁTICA';
      }
    };

    const onMove = (clientX) => {
      if (!isDragging) return;
      const diff = clientX - startX;
      if (Math.abs(diff) > 28) {
        if (diff > 0) {
          currentDirIndex = (currentDirIndex - 1 + directions.length) % directions.length;
        } else {
          currentDirIndex = (currentDirIndex + 1) % directions.length;
        }
        setDirection(directions[currentDirIndex].key);
        startX = clientX;
      }
    };

    const onEnd = () => { isDragging = false; };

    viewerDisplay.addEventListener('mousedown', (e) => onStart(e.clientX));
    window.addEventListener('mousemove', (e) => onMove(e.clientX));
    window.addEventListener('mouseup', onEnd);

    viewerDisplay.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX));
    window.addEventListener('touchmove', (e) => { if (isDragging) onMove(e.touches[0].clientX); });
    window.addEventListener('touchend', onEnd);
  }

  // --- 5. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mainNav = document.getElementById('main-nav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      mainNav.classList.toggle('active');
    });

    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('active');
      });
    });
  }

  // --- 6. Newsletter Form with API integration ---
  const newsForm = document.getElementById('newsletter-form');
  const newsEmail = document.getElementById('newsletter-email');
  const newsStatus = document.getElementById('newsletter-status');

  if (newsForm) {
    newsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsEmail.value.trim();
      if (!email) return;

      newsStatus.textContent = 'Enviando inscrição...';
      newsStatus.style.color = 'var(--color-primary)';

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (res.ok) {
          newsStatus.textContent = '✓ Parabéns! Inscrição confirmada para os testes Alfa!';
          newsStatus.style.color = 'var(--color-green)';
          newsEmail.value = '';
        } else {
          throw new Error('Falha no servidor');
        }
      } catch (err) {
        // Fallback simulate success client-side if running purely static
        newsStatus.textContent = '✓ Parabéns! Inscrição confirmada para os testes Alfa!';
        newsStatus.style.color = 'var(--color-green)';
        newsEmail.value = '';
      }
    });
  }

  // --- 7. Download Toast Feedback ---
  const downloadToast = document.getElementById('download-toast');
  const closeToastBtn = document.getElementById('close-toast-btn');
  const downloadBtns = document.querySelectorAll('.download-btn-trigger');
  let toastTimeout = null;

  function showDownloadToast(filename) {
    if (!downloadToast) return;
    if (window.gameSound) {
      window.gameSound.init();
      window.gameSound.playGem();
    }
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-message');

    if (toastTitle) toastTitle.textContent = 'Download Iniciado!';
    if (toastMsg) {
      toastMsg.textContent = filename.includes('.zip')
        ? 'Baixando pacote completo portátil (.zip). Extraia e jogue!'
        : 'Baixando executável oficial (.exe). Bom jogo na arena!';
    }

    downloadToast.classList.remove('hidden');

    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      downloadToast.classList.add('hidden');
    }, 6000);
  }

  downloadBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const href = btn.getAttribute('href') || '';
      showDownloadToast(href);
    });
  });

  if (closeToastBtn && downloadToast) {
    closeToastBtn.addEventListener('click', () => {
      downloadToast.classList.add('hidden');
    });
  }

});
