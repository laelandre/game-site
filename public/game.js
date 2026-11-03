/**
 * PIXEL SURVIVORS - Web Mini-Game Engine
 * Vampire Survivors style Top-Down Roguelite Arena
 */

(function () {
  'use strict';

  // --- Sound Synthesizer (Web Audio API) ---
  class RetroAudio {
    constructor() {
      this.ctx = null;
      this.enabled = true;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    playShoot() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(480, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.12);
      } catch (e) {}
    }

    playHit() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
      } catch (e) {}
    }

    playGem() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(580, this.ctx.currentTime);
        osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      } catch (e) {}
    }

    playLevelUp() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [440, 554, 659, 880];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
          gain.gain.setValueAtTime(0.15, this.ctx.currentTime + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.08 + 0.18);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.08);
          osc.stop(this.ctx.currentTime + idx * 0.08 + 0.2);
        });
      } catch (e) {}
    }

    playHurt() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(80, this.ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      } catch (e) {}
    }

    playGameOver() {
      if (!this.enabled || !this.ctx) return;
      try {
        const notes = [440, 370, 311, 220];
        notes.forEach((freq, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.18);
          gain.gain.setValueAtTime(0.2, this.ctx.currentTime + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.18 + 0.25);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(this.ctx.currentTime + idx * 0.18);
          osc.stop(this.ctx.currentTime + idx * 0.18 + 0.28);
        });
      } catch (e) {}
    }
  }

  // --- Assets Preloader ---
  const assets = {
    wizardWalk: [],
    slime: new Image(),
    morcego: new Image(),
    ogro: new Image()
  };

  for (let i = 0; i < 4; i++) {
    const img = new Image();
    img.src = `assets/wizard/south_walk_${i}.png`;
    assets.wizardWalk.push(img);
  }
  assets.slime.src = 'assets/enemies/slime.png';
  assets.morcego.src = 'assets/enemies/morcego.png';
  assets.ogro.src = 'assets/enemies/ogro.png';

  // --- Game Engine Definition ---
  const canvas = document.getElementById('game-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const sound = new RetroAudio();
  window.gameSound = sound; // Expose for external sound toggle

  // HUD Elements
  const hpFill = document.getElementById('game-hp-fill');
  const hpText = document.getElementById('game-hp-text');
  const xpFill = document.getElementById('game-xp-fill');
  const lvlText = document.getElementById('game-lvl-text');
  const timerText = document.getElementById('game-timer-text');
  const killsText = document.getElementById('game-kills-text');
  const scoreText = document.getElementById('game-score-text');

  // Overlays
  const startOverlay = document.getElementById('game-start-overlay');
  const levelupOverlay = document.getElementById('game-levelup-overlay');
  const gameoverOverlay = document.getElementById('game-over-overlay');
  const upgradesContainer = document.getElementById('upgrades-container');

  const startBtn = document.getElementById('start-game-btn');
  const restartBtn = document.getElementById('restart-game-btn');
  const pauseBtn = document.getElementById('pause-game-btn');
  const fullscreenBtn = document.getElementById('fullscreen-game-btn');

  // Game State
  const STATE = {
    MENU: 0,
    PLAYING: 1,
    LEVELUP: 2,
    GAMEOVER: 3,
    PAUSED: 4
  };

  let gameState = STATE.MENU;
  let gameTime = 0;
  let lastTime = 0;
  let kills = 0;
  let gemsCollected = 0;

  // Key state
  const keys = {
    w: false, a: false, s: false, d: false,
    ArrowUp: false, ArrowLeft: false, ArrowDown: false, ArrowRight: false
  };

  // Player Definition
  const player = {
    x: 400,
    y: 240,
    width: 36,
    height: 48,
    speed: 155,
    maxHp: 100,
    hp: 100,
    level: 1,
    xp: 0,
    nextXp: 30,
    magnetRadius: 100,
    invincibleTime: 0,
    facing: 'south',
    walkFrame: 0,
    walkTimer: 0,
    isMoving: false,

    // Weapons / Upgrades
    missileCooldown: 0,
    missileInterval: 0.65,
    missileDamage: 25,
    missileCount: 1,

    hasOrbital: false,
    orbitalCount: 0,
    orbitalAngle: 0,
    orbitalDamage: 18,

    hasIcePulse: false,
    icePulseCooldown: 0,
    icePulseInterval: 4.5,
    icePulseRadius: 160,

    reset() {
      this.x = canvas.width / 2;
      this.y = canvas.height / 2;
      this.maxHp = 100;
      this.hp = 100;
      this.level = 1;
      this.xp = 0;
      this.nextXp = 30;
      this.speed = 155;
      this.magnetRadius = 100;
      this.missileInterval = 0.65;
      this.missileDamage = 25;
      this.missileCount = 1;
      this.hasOrbital = false;
      this.orbitalCount = 0;
      this.hasIcePulse = false;
      this.walkFrame = 0;
      this.walkTimer = 0;
    }
  };

  // Game Entities Arrays
  let enemies = [];
  let projectiles = [];
  let gems = [];
  let particles = [];
  let floatTexts = [];
  let spawnTimer = 0;

  // Upgrade Options Pool
  const UPGRADES = [
    {
      id: 'missile_count',
      name: 'Orbe Arcano Duplo',
      desc: 'Dispara +1 projétil mágico adicional contra os inimigos.',
      icon: '🔮',
      apply: () => { player.missileCount += 1; }
    },
    {
      id: 'missile_damage',
      name: 'Poder Arcano +',
      desc: 'Aumenta o dano dos feitiços em +35%.',
      icon: '💥',
      apply: () => { player.missileDamage = Math.round(player.missileDamage * 1.35); }
    },
    {
      id: 'missile_speed',
      name: 'Disparo Rápido',
      desc: 'Reduz o intervalo de recarga do disparo automático em 20%.',
      icon: '⚡',
      apply: () => { player.missileInterval = Math.max(0.18, player.missileInterval * 0.8); }
    },
    {
      id: 'orbital_orbs',
      name: 'Orbe Flamejante Protetor',
      desc: 'Invoca uma esfera em órbita que queima inimigos que se aproximam.',
      icon: '🔥',
      apply: () => {
        player.hasOrbital = true;
        player.orbitalCount = Math.min(6, player.orbitalCount + 1);
      }
    },
    {
      id: 'ice_blast',
      name: 'Nevasca Ártica',
      desc: 'Emite uma onda congelante a cada 4 segundos empurrando as criaturas.',
      icon: '❄️',
      apply: () => { player.hasIcePulse = true; }
    },
    {
      id: 'boots',
      name: 'Botas dos Ventos',
      desc: 'Aumenta a velocidade de movimento do herói em +18%.',
      icon: '🥾',
      apply: () => { player.speed += 28; }
    },
    {
      id: 'magnet',
      name: 'Ímã de Almas',
      desc: 'Aumenta o alcance de atração de gemas em +50%.',
      icon: '🧲',
      apply: () => { player.magnetRadius += 55; }
    },
    {
      id: 'vitality',
      name: 'Poção de Vitalidade',
      desc: 'Cura 50 HP e aumenta a vida máxima em +25 HP.',
      icon: '❤️',
      apply: () => {
        player.maxHp += 25;
        player.hp = Math.min(player.maxHp, player.hp + 50);
      }
    }
  ];

  // --- Input Listeners ---
  window.addEventListener('keydown', (e) => {
    if (e.key in keys) {
      keys[e.key] = true;
    }
    if (e.key.toLowerCase() === 'p') {
      togglePause();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key in keys) {
      keys[e.key] = false;
    }
  });

  // Mobile D-Pad Support
  document.querySelectorAll('.dpad-btn').forEach(btn => {
    const key = btn.dataset.key;
    if (!key) return;
    const startHandler = (e) => {
      e.preventDefault();
      keys[key] = true;
    };
    const endHandler = (e) => {
      e.preventDefault();
      keys[key] = false;
    };
    btn.addEventListener('touchstart', startHandler);
    btn.addEventListener('touchend', endHandler);
    btn.addEventListener('mousedown', startHandler);
    btn.addEventListener('mouseup', endHandler);
  });

  // Canvas touch/click targeting/movement
  let touchMove = { active: false, x: 0, y: 0 };
  canvas.addEventListener('touchstart', (e) => {
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    touchMove.active = true;
    touchMove.x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    touchMove.y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  });
  canvas.addEventListener('touchmove', (e) => {
    if (!touchMove.active) return;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    touchMove.x = (touch.clientX - rect.left) * (canvas.width / rect.width);
    touchMove.y = (touch.clientY - rect.top) * (canvas.height / rect.height);
  });
  canvas.addEventListener('touchend', () => {
    touchMove.active = false;
  });

  // --- Enemy Spawning Logic ---
  function spawnEnemy() {
    // Determine spawn side (0: top, 1: right, 2: bottom, 3: left)
    const side = Math.floor(Math.random() * 4);
    let x, y;
    const margin = 30;

    switch (side) {
      case 0: x = Math.random() * canvas.width; y = -margin; break;
      case 1: x = canvas.width + margin; y = Math.random() * canvas.height; break;
      case 2: x = Math.random() * canvas.width; y = canvas.height + margin; break;
      case 3: x = -margin; y = Math.random() * canvas.height; break;
    }

    // Pick enemy type according to elapsed time
    const rand = Math.random();
    let type = 'slime';

    if (gameTime > 60 && rand < 0.15) {
      type = 'ogro';
    } else if (gameTime > 20 && rand < 0.45) {
      type = 'morcego';
    }

    let enemy = {
      x, y,
      type,
      hp: 28,
      maxHp: 28,
      speed: 60,
      width: 28,
      height: 24,
      damage: 10,
      color: '#22c55e',
      xpValue: 10,
      flash: 0
    };

    if (type === 'morcego') {
      enemy.hp = 18;
      enemy.maxHp = 18;
      enemy.speed = 135;
      enemy.width = 30;
      enemy.height = 20;
      enemy.damage = 8;
      enemy.color = '#ef4444';
      enemy.xpValue = 20;
    } else if (type === 'ogro') {
      enemy.hp = 160 + Math.floor(gameTime * 1.5);
      enemy.maxHp = enemy.hp;
      enemy.speed = 38;
      enemy.width = 44;
      enemy.height = 54;
      enemy.damage = 25;
      enemy.color = '#3b82f6';
      enemy.xpValue = 80;
    }

    enemies.push(enemy);
  }

  // --- Particle & Text Effects ---
  function addFloatingText(text, x, y, color = '#facc15') {
    floatTexts.push({
      text, x, y, color,
      vy: -35,
      alpha: 1.0,
      life: 0.65
    });
  }

  function addSparks(x, y, count = 6, color = '#38bdf8') {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 40 + Math.random() * 80;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 2,
        color,
        alpha: 1.0,
        life: 0.35 + Math.random() * 0.25
      });
    }
  }

  // --- Level Up Modal ---
  function showLevelUpModal() {
    gameState = STATE.LEVELUP;
    sound.playLevelUp();

    // Pick 3 random upgrades from pool
    const shuffled = [...UPGRADES].sort(() => 0.5 - Math.random());
    const choices = shuffled.slice(0, 3);

    upgradesContainer.innerHTML = '';
    choices.forEach(upg => {
      const card = document.createElement('div');
      card.className = 'upgrade-card-item';
      card.innerHTML = `
        <div class="upgrade-icon">${upg.icon}</div>
        <div class="upgrade-info">
          <h4>${upg.name}</h4>
          <p>${upg.desc}</p>
        </div>
        <div class="upgrade-level-tag">MELHORIA</div>
      `;
      card.addEventListener('click', () => {
        upg.apply();
        addFloatingText(upg.name, player.x, player.y - 20, '#38bdf8');
        levelupOverlay.classList.add('hidden');
        gameState = STATE.PLAYING;
        lastTime = performance.now();
      });
      upgradesContainer.appendChild(card);
    });

    levelupOverlay.classList.remove('hidden');
  }

  // --- Game Over Trigger ---
  function triggerGameOver() {
    gameState = STATE.GAMEOVER;
    sound.playGameOver();

    const min = Math.floor(gameTime / 60).toString().padStart(2, '0');
    const sec = Math.floor(gameTime % 60).toString().padStart(2, '0');
    document.getElementById('end-time').textContent = `${min}:${sec}`;
    document.getElementById('end-kills').textContent = kills;
    document.getElementById('end-level').textContent = player.level;
    document.getElementById('end-gems').textContent = gemsCollected;

    gameoverOverlay.classList.remove('hidden');
  }

  // --- Toggle Pause ---
  function togglePause() {
    if (gameState === STATE.PLAYING) {
      gameState = STATE.PAUSED;
      pauseBtn.textContent = 'CONTINUAR (P)';
    } else if (gameState === STATE.PAUSED) {
      gameState = STATE.PLAYING;
      pauseBtn.textContent = 'PAUSAR (P)';
      lastTime = performance.now();
    }
  }

  // --- Game Loop Update ---
  function update(dt) {
    if (gameState !== STATE.PLAYING) return;

    gameTime += dt;

    // Movement calculation
    let dx = 0;
    let dy = 0;

    if (keys.w || keys.ArrowUp) dy -= 1;
    if (keys.s || keys.ArrowDown) dy += 1;
    if (keys.a || keys.ArrowLeft) dx -= 1;
    if (keys.d || keys.ArrowRight) dx += 1;

    // Mobile touch move
    if (touchMove.active) {
      const tdx = touchMove.x - player.x;
      const tdy = touchMove.y - player.y;
      const dist = Math.hypot(tdx, tdy);
      if (dist > 15) {
        dx = tdx / dist;
        dy = tdy / dist;
      }
    }

    // Normalize diagonal speed
    if (dx !== 0 && dy !== 0 && !touchMove.active) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    player.isMoving = dx !== 0 || dy !== 0;

    if (player.isMoving) {
      player.x += dx * player.speed * dt;
      player.y += dy * player.speed * dt;

      // Animate walking
      player.walkTimer += dt;
      if (player.walkTimer > 0.12) {
        player.walkTimer = 0;
        player.walkFrame = (player.walkFrame + 1) % 4;
      }
    } else {
      player.walkFrame = 0;
    }

    // Clamp player to canvas bounds
    player.x = Math.max(25, Math.min(canvas.width - 25, player.x));
    player.y = Math.max(35, Math.min(canvas.height - 35, player.y));

    if (player.invincibleTime > 0) {
      player.invincibleTime -= dt;
    }

    // --- Auto-Attack Nearest Enemy ---
    player.missileCooldown -= dt;
    if (player.missileCooldown <= 0 && enemies.length > 0) {
      player.missileCooldown = player.missileInterval;

      // Sort enemies by distance
      const sorted = [...enemies].sort((a, b) => {
        const da = Math.hypot(a.x - player.x, a.y - player.y);
        const db = Math.hypot(b.x - player.x, b.y - player.y);
        return da - db;
      });

      const targets = sorted.slice(0, player.missileCount);
      targets.forEach((target, i) => {
        const angle = Math.atan2(target.y - player.y, target.x - player.x) + (i - (player.missileCount - 1) / 2) * 0.15;
        projectiles.push({
          x: player.x,
          y: player.y - 10,
          vx: Math.cos(angle) * 360,
          vy: Math.sin(angle) * 360,
          radius: 6,
          color: '#38bdf8',
          damage: player.missileDamage,
          life: 2.0
        });
      });
      sound.playShoot();
    }

    // Orbiting Orbs
    if (player.hasOrbital) {
      player.orbitalAngle += dt * 3.5;
    }

    // Frozen Blast pulse
    if (player.hasIcePulse) {
      player.icePulseCooldown -= dt;
      if (player.icePulseCooldown <= 0) {
        player.icePulseCooldown = player.icePulseInterval;
        addSparks(player.x, player.y, 16, '#93c5fd');
        sound.playHit();

        // Damage & pushback all nearby enemies
        enemies.forEach(e => {
          const d = Math.hypot(e.x - player.x, e.y - player.y);
          if (d <= player.icePulseRadius) {
            e.hp -= 20;
            e.flash = 0.2;
            const pushAngle = Math.atan2(e.y - player.y, e.x - player.x);
            e.x += Math.cos(pushAngle) * 45;
            e.y += Math.sin(pushAngle) * 45;
            addFloatingText('-20', e.x, e.y - 10, '#93c5fd');
          }
        });
      }
    }

    // --- Update Projectiles ---
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;

      // Particle trail
      if (Math.random() < 0.4) {
        particles.push({
          x: p.x, y: p.y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          radius: 2,
          color: '#38bdf8',
          alpha: 0.6,
          life: 0.2
        });
      }

      // Check collision with enemies
      let hit = false;
      for (let j = enemies.length - 1; j >= 0; j--) {
        const e = enemies[j];
        const dist = Math.hypot(e.x - p.x, e.y - p.y);
        if (dist < p.radius + e.width / 2) {
          e.hp -= p.damage;
          e.flash = 0.15;
          hit = true;
          sound.playHit();
          addFloatingText(`-${p.damage}`, e.x, e.y - 12, '#facc15');
          addSparks(e.x, e.y, 4, '#38bdf8');
          break;
        }
      }

      if (hit || p.life <= 0 || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
        projectiles.splice(i, 1);
      }
    }

    // --- Spawn Enemies ---
    spawnTimer += dt;
    // Spawn rate scales with time
    const spawnDelay = Math.max(0.35, 1.3 - (gameTime * 0.012));
    if (spawnTimer >= spawnDelay) {
      spawnTimer = 0;
      spawnEnemy();
      // Occasionally spawn mini-swarms
      if (gameTime > 30 && Math.random() < 0.3) {
        spawnEnemy();
      }
    }

    // --- Update Enemies ---
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];

      // Flash timer
      if (e.flash > 0) e.flash -= dt;

      // Move toward player
      const angle = Math.atan2(player.y - e.y, player.x - e.x);
      e.x += Math.cos(angle) * e.speed * dt;
      e.y += Math.sin(angle) * e.speed * dt;

      // Orbitals collision check
      if (player.hasOrbital && player.orbitalCount > 0) {
        const orbRadius = 55;
        for (let o = 0; o < player.orbitalCount; o++) {
          const currentOrbAngle = player.orbitalAngle + (o * (Math.PI * 2 / player.orbitalCount));
          const ox = player.x + Math.cos(currentOrbAngle) * orbRadius;
          const oy = player.y + Math.sin(currentOrbAngle) * orbRadius;
          const distOrb = Math.hypot(e.x - ox, e.y - oy);
          if (distOrb < 16 + e.width / 2) {
            e.hp -= player.orbitalDamage * dt * 4;
            e.flash = 0.1;
            if (Math.random() < 0.1) {
              sound.playHit();
              addFloatingText('-18', e.x, e.y - 10, '#fb923c');
            }
          }
        }
      }

      // Check collision with player
      const distToPlayer = Math.hypot(e.x - player.x, e.y - player.y);
      if (distToPlayer < (e.width / 2 + 16)) {
        if (player.invincibleTime <= 0) {
          player.hp -= e.damage;
          player.invincibleTime = 0.45;
          sound.playHurt();
          addFloatingText(`-${e.damage}`, player.x, player.y - 25, '#ef4444');
          addSparks(player.x, player.y, 8, '#ef4444');

          if (player.hp <= 0) {
            player.hp = 0;
            triggerGameOver();
            return;
          }
        }
      }

      // Enemy Death Check
      if (e.hp <= 0) {
        kills++;
        addSparks(e.x, e.y, 10, e.color);

        // Drop Gem
        gems.push({
          x: e.x,
          y: e.y,
          xp: e.xpValue,
          type: e.type,
          color: e.type === 'ogro' ? '#facc15' : (e.type === 'morcego' ? '#38bdf8' : '#22c55e')
        });

        enemies.splice(i, 1);
      }
    }

    // --- Update XP Gems & Magnet ---
    for (let i = gems.length - 1; i >= 0; i--) {
      const g = gems[i];
      const dist = Math.hypot(g.x - player.x, g.y - player.y);

      // Within magnet radius: attract to player
      if (dist < player.magnetRadius) {
        const pullAngle = Math.atan2(player.y - g.y, player.x - g.x);
        const pullSpeed = 260 + (player.magnetRadius - dist) * 2;
        g.x += Math.cos(pullAngle) * pullSpeed * dt;
        g.y += Math.sin(pullAngle) * pullSpeed * dt;
      }

      // Collect gem
      if (dist < 22) {
        gemsCollected++;
        player.xp += g.xp;
        sound.playGem();
        addFloatingText(`+${g.xp} XP`, player.x, player.y - 15, '#38bdf8');
        gems.splice(i, 1);

        // Check level up
        if (player.xp >= player.nextXp) {
          player.level++;
          player.xp -= player.nextXp;
          player.nextXp = Math.round(player.nextXp * 1.5);
          showLevelUpModal();
          return;
        }
      }
    }

    // --- Update Particles ---
    for (let i = particles.length - 1; i >= 0; i--) {
      const pt = particles[i];
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
      pt.life -= dt;
      pt.alpha = pt.life / 0.5;
      if (pt.life <= 0) particles.splice(i, 1);
    }

    // --- Update Floating Texts ---
    for (let i = floatTexts.length - 1; i >= 0; i--) {
      const ft = floatTexts[i];
      ft.y += ft.vy * dt;
      ft.life -= dt;
      ft.alpha = ft.life / 0.65;
      if (ft.life <= 0) floatTexts.splice(i, 1);
    }

    // --- Update HUD DOM elements ---
    updateHUD();
  }

  function updateHUD() {
    const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
    hpFill.style.width = `${hpPercent}%`;
    hpText.textContent = `${Math.ceil(player.hp)}/${player.maxHp}`;

    const xpPercent = Math.min(100, (player.xp / player.nextXp) * 100);
    xpFill.style.width = `${xpPercent}%`;
    lvlText.textContent = `LVL ${player.level}`;

    const min = Math.floor(gameTime / 60).toString().padStart(2, '0');
    const sec = Math.floor(gameTime % 60).toString().padStart(2, '0');
    timerText.textContent = `${min}:${sec}`;
    killsText.textContent = kills;
    scoreText.textContent = gemsCollected;
  }

  // --- Render Loop ---
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Draw Retro Dungeon Arena Floor Grid
    drawArenaBackground();

    // 2. Draw Gems
    gems.forEach(g => {
      ctx.save();
      ctx.fillStyle = g.color;
      ctx.shadowColor = g.color;
      ctx.shadowBlur = 8;
      // Diamond shape for retro gems
      ctx.beginPath();
      ctx.moveTo(g.x, g.y - 6);
      ctx.lineTo(g.x + 5, g.y);
      ctx.lineTo(g.x, g.y + 6);
      ctx.lineTo(g.x - 5, g.y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });

    // 3. Draw Projectiles
    projectiles.forEach(p => {
      ctx.save();
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 4. Draw Orbitals
    if (player.hasOrbital && player.orbitalCount > 0) {
      const orbRadius = 55;
      for (let o = 0; o < player.orbitalCount; o++) {
        const curAngle = player.orbitalAngle + (o * (Math.PI * 2 / player.orbitalCount));
        const ox = player.x + Math.cos(curAngle) * orbRadius;
        const oy = player.y + Math.sin(curAngle) * orbRadius;
        ctx.save();
        ctx.fillStyle = '#f97316';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(ox, oy, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // 5. Draw Enemies
    enemies.forEach(e => {
      ctx.save();
      ctx.translate(e.x, e.y);

      // Hit Flash Effect
      if (e.flash > 0) {
        ctx.filter = 'brightness(2.5)';
      }

      let spr = assets.slime;
      if (e.type === 'morcego') spr = assets.morcego;
      if (e.type === 'ogro') spr = assets.ogro;

      if (spr && spr.complete && spr.naturalWidth > 0) {
        ctx.drawImage(spr, -e.width / 2, -e.height / 2, e.width, e.height);
      } else {
        // Fallback pixel rectangle
        ctx.fillStyle = e.color;
        ctx.fillRect(-e.width / 2, -e.height / 2, e.width, e.height);
      }

      // Small Enemy Health Bar for Ogres or damaged monsters
      if (e.hp < e.maxHp) {
        const barW = e.width;
        const barH = 4;
        const pct = Math.max(0, e.hp / e.maxHp);
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-barW / 2, -e.height / 2 - 8, barW, barH);
        ctx.fillStyle = e.type === 'ogro' ? '#3b82f6' : '#22c55e';
        ctx.fillRect(-barW / 2, -e.height / 2 - 8, barW * pct, barH);
      }

      ctx.restore();
    });

    // 6. Draw Player (Herói Mago)
    ctx.save();
    ctx.translate(player.x, player.y);

    // Invincibility Blink
    if (player.invincibleTime > 0 && Math.floor(Date.now() / 80) % 2 === 0) {
      ctx.globalAlpha = 0.4;
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 18, 14, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Wizard Walking Sprite
    const currentFrameImg = assets.wizardWalk[player.walkFrame];
    if (currentFrameImg && currentFrameImg.complete && currentFrameImg.naturalWidth > 0) {
      const w = 48;
      const h = 48;
      ctx.drawImage(currentFrameImg, -w / 2, -h / 2, w, h);
    } else {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-12, -20, 24, 40);
    }

    ctx.restore();

    // 7. Draw Particles
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 8. Draw Floating Texts
    floatTexts.forEach(ft => {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.font = 'bold 12px "Silkscreen", monospace';
      ctx.fillStyle = ft.color;
      ctx.shadowColor = '#000';
      ctx.shadowBlur = 4;
      ctx.fillText(ft.text, ft.x - 10, ft.y);
      ctx.restore();
    });

    // 9. Pause Watermark
    if (gameState === STATE.PAUSED) {
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '22px "Press Start 2P", monospace';
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.fillText('JOGO PAUSADO', canvas.width / 2, canvas.height / 2);
      ctx.restore();
    }
  }

  function drawArenaBackground() {
    // Subtle retro stone tile arena
    ctx.fillStyle = '#080d16';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const tileSize = 40;
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
    ctx.lineWidth = 1;

    for (let x = 0; x < canvas.width; x += tileSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y < canvas.height; y += tileSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Subtle arena center runes
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 90, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 160, 0, Math.PI * 2);
    ctx.stroke();
  }

  // --- Main Animation Loop ---
  function loop(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(loop);
  }

  // --- Start & Restart Handlers ---
  function startGame() {
    sound.init();
    player.reset();
    enemies = [];
    projectiles = [];
    gems = [];
    particles = [];
    floatTexts = [];
    gameTime = 0;
    kills = 0;
    gemsCollected = 0;

    startOverlay.classList.add('hidden');
    gameoverOverlay.classList.add('hidden');
    levelupOverlay.classList.add('hidden');

    gameState = STATE.PLAYING;
    lastTime = performance.now();
  }

  startBtn.addEventListener('click', startGame);
  restartBtn.addEventListener('click', startGame);
  pauseBtn.addEventListener('click', togglePause);

  fullscreenBtn.addEventListener('click', () => {
    const cabinet = document.querySelector('.arcade-cabinet');
    if (!document.fullscreenElement) {
      cabinet.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  // Start initial animation frame
  requestAnimationFrame(loop);

})();
