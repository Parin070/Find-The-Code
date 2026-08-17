/* ============================================================
   FIND THE CODE — Office Heist Redesign Engine
   Clean Professional Office Aesthetic (Pixel Art)
   ============================================================ */

(function () {
  'use strict';

  // ============================================================
  // 1. CONFIGURATION & CONSTANTS
  // ============================================================
  const ROOM_W = 240;
  const ROOM_H = 180;
  const SPRITE_W = 8;
  const SPRITE_H = 12;
  const PLAYER_SPEED = 75;
  const INTERACT_RANGE = 28;
  const TIMER_THRESHOLD = 90; // 1:30
  const MAX_CONFETTI = 40;

  // Placeholder Discount Codes (easily editable)
  const DISCOUNT_CODE_20 = 'OFFICE20';
  const DISCOUNT_CODE_10 = 'OFFICE10';

  // Correct Room 1 Door Code & Room 2 Riddle Solution
  const ROOM1_DOOR_CODE = '7492';
  const RIDDLE_SOLUTION = 'KEYBOARD';

  // ============================================================
  // 2. PALETTE & COLORS (Warm/Cool Office Theme)
  // ============================================================
  const P = {
    bg:          '#0f172a',
    wallWood:    '#4a3319',
    wallWoodLt:  '#6b4926',
    wallPlaster: '#d8dce2',
    wallPlasterD:'#b0b7c2',
    carpetBlue:  '#2a394a',
    carpetBlueAlt:'#23303f',
    carpetLine:  '#1b2633',
    goldGlow:    '#ffc83b',
    goldGlowDim: '#886714',
    woodDark:    '#3a2612',
    woodMid:     '#5c3d1e',
    woodLight:   '#8c6033',
    metalDark:   '#334155',
    metalLt:     '#64748b',
    metalBright: '#cbd5e1',
    plantGreen:  '#15803d',
    plantPot:    '#b45309',
    screenBlue:  '#1e3a5f',
    redMug:      '#dc2626',
    white:       '#f8fafc',
    skin:        '#e8c8a0',
    hairIntern:  '#1e293b',
    hairWorker:  '#854d0e',
    hairCEO:     '#94a3b8',
    suitCEO:     '#0f172a',
    shirtWorker: '#2563eb',
    shirtIntern: '#0d9488'
  };

  // ============================================================
  // 3. SPRITE DEFINITIONS (Intern, Worker NPC, CEO)
  // ============================================================
  function buildCharFrames(shirtCol, hairCol, pantsCol) {
    var S = 1, H = 2, C = 3, Pn = 4, B = 5, E = 6;
    var pal = [null, P.skin, hairCol, shirtCol, pantsCol, '#0f172a', '#1e293b'];
    var rawDown = [
      [[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[0,1,1,1,1,1,1,0],[0,1,6,1,1,6,1,0],[0,1,1,1,1,1,1,0],[0,0,3,3,3,3,0,0],[0,3,3,3,3,3,3,0],[0,0,3,3,3,3,0,0],[0,0,4,4,4,4,0,0],[0,0,4,0,0,4,0,0],[0,0,4,0,0,4,0,0],[0,0,5,0,0,5,0,0]],
      [[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[0,1,1,1,1,1,1,0],[0,1,6,1,1,6,1,0],[0,1,1,1,1,1,1,0],[0,0,3,3,3,3,0,0],[0,3,3,3,3,3,3,0],[0,0,3,3,3,3,0,0],[0,0,4,4,4,4,0,0],[0,4,4,0,0,0,0,0],[0,4,0,0,0,4,0,0],[0,5,0,0,0,5,0,0]],
      [[0,0,2,2,2,2,0,0],[0,2,2,2,2,2,2,0],[0,1,1,1,1,1,1,0],[0,1,6,1,1,6,1,0],[0,1,1,1,1,1,1,0],[0,0,3,3,3,3,0,0],[0,3,3,3,3,3,3,0],[0,0,3,3,3,3,0,0],[0,0,4,4,4,4,0,0],[0,0,0,0,4,4,0,0],[0,4,0,0,0,4,0,0],[0,5,0,0,0,5,0,0]],
    ];
    return rawDown.map(function(frame) {
      return offscreen(SPRITE_W, SPRITE_H, function(c) {
        for (var y = 0; y < SPRITE_H; y++) {
          for (var x = 0; x < SPRITE_W; x++) {
            var v = frame[y][x];
            if (v !== 0) {
              c.fillStyle = pal[v];
              c.fillRect(x, y, 1, 1);
            }
          }
        }
      });
    });
  }

  // ============================================================
  // 4. ROOM & OBJECT DEFINITIONS
  // ============================================================
  var ROOMS = [
    // --- Room 0: Reception / CEO Entry ---
    {
      name: 'RECEPTION',
      startX: 120, startY: 150,
      walls: [
        { x: 0,   y: 0,   w: ROOM_W, h: 32 },
        { x: 0,   y: 0,   w: 12,     h: ROOM_H },
        { x: 228, y: 0,   w: 12,     h: 72 },
        { x: 228, y: 112, w: 12,     h: ROOM_H - 112 },
      ],
      objects: [
        { id: 'r1_drawer',  x: 24,  y: 38,  w: 36, h: 24, label: 'SEARCH DRAWER', icon: '🗄️' },
        { id: 'r1_books',   x: 74,  y: 36,  w: 36, h: 40, label: 'CHECK BOOKS',  icon: '📚' },
        { id: 'r1_plant',   x: 180, y: 38,  w: 24, h: 32, label: 'CHECK PLANT',  icon: '🪴' },
        { id: 'r1_cabinet', x: 24,  y: 125, w: 32, h: 40, label: 'SEARCH FILING',icon: '📁' },
        { id: 'r1_coat',    x: 184, y: 130, w: 20, h: 36, label: 'INSPECT COAT', icon: '🧥' },
        { id: 'r1_painting',x: 120, y: 36,  w: 36, h: 28, label: 'INSPECT ART',  icon: '🖼️' }
      ],
      doors: [
        { id: 'door_r1', x: 228, y: 72, w: 12, h: 40, targetRoom: 1, entryX: 28, entryY: 92, locked: true }
      ]
    },
    // --- Room 1: Open Office Floor ---
    {
      name: 'OPEN OFFICE',
      startX: 28, startY: 92,
      walls: [
        { x: 0,   y: 0,   w: ROOM_W, h: 32 },
        { x: 0,   y: 0,   w: 12,     h: 72 },
        { x: 0,   y: 112, w: 12,     h: ROOM_H - 112 },
        { x: 228, y: 0,   w: 12,     h: 72 },
        { x: 228, y: 112, w: 12,     h: ROOM_H - 112 },
      ],
      npc: { id: 'worker_npc', x: 120, y: 55, w: 12, h: 16, label: 'TALK TO ALEX', icon: '💬' },
      objects: [
        // 8 Desks placed around room
        { id: 'desk1', x: 24,  y: 40,  w: 36, h: 28, label: 'LOGIN DESK #1', icon: '💻', mug: 'blue' },
        { id: 'desk2', x: 70,  y: 40,  w: 36, h: 28, label: 'LOGIN DESK #2', icon: '💻', mug: 'white' },
        { id: 'desk3', x: 24,  y: 115, w: 36, h: 28, label: 'LOGIN DESK #3', icon: '💻', mug: 'green' },
        { id: 'desk4', x: 70,  y: 115, w: 36, h: 28, label: 'LOGIN DESK #4', icon: '💻', mug: 'yellow' },
        { id: 'desk5', x: 140, y: 40,  w: 36, h: 28, label: 'LOGIN DESK #5', icon: '💻', mug: 'black' },
        { id: 'desk6', x: 184, y: 40,  w: 36, h: 28, label: 'LOGIN DESK #6', icon: '💻', mug: 'red', isTarget: true },
        { id: 'desk7', x: 140, y: 115, w: 36, h: 28, label: 'LOGIN DESK #7', icon: '💻', mug: 'purple' },
        { id: 'desk8', x: 184, y: 115, w: 36, h: 28, label: 'LOGIN DESK #8', icon: '💻', mug: 'orange' }
      ],
      doors: [
        { id: 'door_r2_back', x: 0, y: 72, w: 12, h: 40, targetRoom: 0, entryX: 214, entryY: 92, locked: false },
        { id: 'door_r2_next', x: 228, y: 72, w: 12, h: 40, targetRoom: 2, entryX: 28, entryY: 92, locked: true, requiresKeycard: true }
      ]
    },
    // --- Room 2: CEO Private Suite ---
    {
      name: 'CEO SUITE',
      startX: 28, startY: 92,
      walls: [
        { x: 0,   y: 0,   w: ROOM_W, h: 32 },
        { x: 0,   y: 0,   w: 12,     h: 72 },
        { x: 0,   y: 112, w: 12,     h: ROOM_H - 112 },
        { x: 228, y: 0,   w: 12,     h: ROOM_H }
      ],
      ceo: { id: 'ceo_npc', x: 150, y: 60, w: 12, h: 16, label: 'TALK TO CEO', icon: '👔' },
      objects: [
        { id: 'vault_locker', x: 180, y: 40, w: 40, h: 48, label: 'OPEN VAULT LOCKER', icon: '🔐' }
      ],
      doors: [
        { id: 'door_r3_back', x: 0, y: 72, w: 12, h: 40, targetRoom: 1, entryX: 214, entryY: 92, locked: false }
      ]
    }
  ];

  // ============================================================
  // 5. GAME STATE
  // ============================================================
  var GS = {
    state: 'START', // START | PLAYING | MODAL | TRANSITION | END
    room: 0,
    hasKeycard: false,
    foundDoorCode: false,
    door1Unlocked: false,
    riddleRevealed: false,
    timerStart: 0,
    elapsed: 0,
    finalTime: 0,
    activePrompt: null // 'DOOR_CODE' | 'CEO_PASSWORD' | null
  };

  var player = { x: 120, y: 150, dir: 'down', frame: 0, animT: 0 };
  var nearbyObj = null;
  var doorCooldown = true;
  var cameraX = 0, cameraY = 0;
  var pixelSize = 3;
  var viewW = 0, viewH = 0;

  var trans = { active: false, phase: 0, alpha: 0, timer: 0, targetRoom: 0, entryX: 0, entryY: 0 };
  var shake = { x: 0, y: 0, intensity: 0, duration: 0, timer: 0 };
  var glowT = 0;
  var lastTs = 0;

  // ============================================================
  // 6. CACHES & GRAPHICS
  // ============================================================
  var roomBgCache = [];
  var playerSpriteCache = [];
  var workerSpriteCache = [];
  var ceoSpriteCache = [];
  var objGlowCache = {};

  var canvas, ctx;
  var $timer, $roomLabel, $keycardBadge;
  var $actionBtn, $actionLabel, $actionIcon;
  var $joystick, $joyKnob;
  var $modalOverlay, $modalTitle, $modalText, $modalIcon, $modalClose, $modalSubmit, $modalInput, $modalInputContainer, $modalError;
  var $startScreen, $startBtn;
  var $endScreen, $endTitle, $endTime, $endDiscount, $endCode, $endReplay;
  var $confetti, cctx;
  var $soundToggle;

  var joyTouchId = null;
  var joyCX = 0, joyCY = 0;
  var joyDX = 0, joyDY = 0;
  var joyMaxR = 40;
  var keys = {};

  var audioCtx = null;
  var soundOn = false;

  // ============================================================
  // 7. PRE-RENDERING ART (Pixel Art Office Theme)
  // ============================================================
  function offscreen(w, h, drawFn) {
    var c = document.createElement('canvas');
    c.width = w; c.height = h;
    drawFn(c.getContext('2d'), w, h);
    return c;
  }

  function prerenderRoomBg(ri) {
    return offscreen(ROOM_W, ROOM_H, function (c) {
      // Floor: Carpet tiles
      c.fillStyle = P.carpetBlue;
      c.fillRect(0, 0, ROOM_W, ROOM_H);
      c.fillStyle = P.carpetBlueAlt;
      for (var tx = 0; tx < ROOM_W; tx += 32) {
        for (var ty = 0; ty < ROOM_H; ty += 32) {
          c.fillRect(tx, ty, 16, 16);
          c.fillRect(tx + 16, ty + 16, 16, 16);
        }
      }
      c.fillStyle = P.carpetLine;
      for (var x = 0; x <= ROOM_W; x += 16) c.fillRect(x, 0, 1, ROOM_H);
      for (var y = 0; y <= ROOM_H; y += 16) c.fillRect(0, y, ROOM_W, 1);

      // Walls
      var room = ROOMS[ri];
      for (var i = 0; i < room.walls.length; i++) {
        var w = room.walls[i];
        c.fillStyle = ri === 2 ? P.wallWood : P.wallPlaster;
        c.fillRect(w.x, w.y, w.w, w.h);
        // Baseboard
        c.fillStyle = P.woodDark;
        if (w.h > w.w) c.fillRect(w.x, w.y, w.w, w.h);
        else c.fillRect(w.x, w.y + w.h - 3, w.w, 3);
      }

      // Doors
      for (var d = 0; d < room.doors.length; d++) {
        var door = room.doors[d];
        c.fillStyle = P.bg;
        c.fillRect(door.x, door.y, door.w, door.h);
        c.fillStyle = P.woodLight;
        c.fillRect(door.x, door.y, door.w, 2);
        c.fillRect(door.x, door.y + door.h - 2, door.w, 2);
      }

      // Room specific decor
      if (ri === 0) {
        // Reception Counter
        c.fillStyle = P.woodMid;
        c.fillRect(70, 85, 100, 16);
        c.fillStyle = P.woodLight;
        c.fillRect(70, 85, 100, 3);
      } else if (ri === 1) {
        // Office partition lines
        c.fillStyle = P.metalLt;
        c.fillRect(118, 32, 4, 120);
      } else if (ri === 2) {
        // Executive Rug
        c.fillStyle = '#7f1d1d';
        c.fillRect(60, 60, 120, 80);
        c.fillStyle = P.goldGlow;
        c.fillRect(62, 62, 116, 2); c.fillRect(62, 136, 116, 2);
      }
    });
  }

  // Draw procedural interactive objects with soft warm glow
  function drawObjDrawer(c, w, h) {
    c.fillStyle = P.woodMid; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, 2);
    c.fillStyle = P.metalBright; c.fillRect(w/2 - 4, h/2 - 1, 8, 2);
  }

  function drawObjBooks(c, w, h) {
    c.fillStyle = P.woodDark; c.fillRect(0, 0, w, h);
    var cols = ['#991b1b', '#1e3a8a', '#166534', '#d97706'];
    for (var i = 0; i < 5; i++) {
      c.fillStyle = cols[i % cols.length];
      c.fillRect(4 + i * 6, 6, 4, h - 12);
    }
  }

  function drawObjPlant(c, w, h) {
    c.fillStyle = P.plantPot; c.fillRect(w/2 - 6, h - 10, 12, 10);
    c.fillStyle = P.plantGreen;
    c.beginPath(); c.arc(w/2, h/2 - 4, 10, 0, Math.PI * 2); c.fill();
  }

  function drawObjCabinet(c, w, h) {
    c.fillStyle = P.metalDark; c.fillRect(0, 0, w, h);
    c.fillStyle = P.metalLt; c.fillRect(2, 2, w - 4, h - 4);
    c.fillStyle = P.metalBright; c.fillRect(w/2 - 3, 10, 6, 2); c.fillRect(w/2 - 3, 26, 6, 2);
  }

  function drawObjCoat(c, w, h) {
    c.fillStyle = P.woodDark; c.fillRect(w/2 - 1, 0, 2, h);
    c.fillStyle = '#334155'; c.fillRect(w/2 - 6, 8, 12, 18);
  }

  function drawObjPainting(c, w, h) {
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, h);
    c.fillStyle = P.screenBlue; c.fillRect(3, 3, w - 6, h - 6);
    c.fillStyle = P.white; c.fillRect(8, 8, 8, 6);
  }

  function drawObjDesk(c, w, h, mugCol) {
    c.fillStyle = P.woodMid; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, 2);
    // Monitor
    c.fillStyle = P.metalDark; c.fillRect(8, 4, 20, 14);
    c.fillStyle = P.screenBlue; c.fillRect(10, 6, 16, 10);
    // Keyboard
    c.fillStyle = P.metalLt; c.fillRect(10, 20, 16, 4);
    // Mug
    var mugColors = { red: P.redMug, blue: '#2563eb', white: '#f8fafc', green: '#166534', yellow: '#d97706', black: '#0f172a', purple: '#7c3aed', orange: '#ea580c' };
    c.fillStyle = mugColors[mugCol] || P.metalBright;
    c.fillRect(w - 8, 12, 4, 5);
  }

  function drawObjVault(c, w, h) {
    c.fillStyle = P.metalDark; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(2, 2, w - 4, h - 4);
    c.fillStyle = P.goldGlow; c.fillRect(w/2 - 6, h/2 - 6, 12, 12);
  }

  var OBJ_DRAWS = {
    r1_drawer: drawObjDrawer, r1_books: drawObjBooks, r1_plant: drawObjPlant,
    r1_cabinet: drawObjCabinet, r1_coat: drawObjCoat, r1_painting: drawObjPainting,
    vault_locker: drawObjVault
  };

  function prerenderObj(obj) {
    var pad = 8;
    return offscreen(obj.w + pad * 2, obj.h + pad * 2, function (c) {
      c.shadowColor = P.goldGlow;
      c.shadowBlur = 6;
      c.save();
      c.translate(pad, pad);
      if (obj.id.startsWith('desk')) {
        drawObjDesk(c, obj.w, obj.h, obj.mug);
      } else if (OBJ_DRAWS[obj.id]) {
        OBJ_DRAWS[obj.id](c, obj.w, obj.h);
      }
      c.restore();
      c.shadowBlur = 0;
    });
  }

  function prerenderAll() {
    playerSpriteCache = buildCharFrames(P.shirtIntern, P.hairIntern, '#1e293b');
    workerSpriteCache = buildCharFrames(P.shirtWorker, P.hairWorker, '#334155');
    ceoSpriteCache = buildCharFrames(P.suitCEO, P.hairCEO, '#0f172a');

    for (var ri = 0; ri < ROOMS.length; ri++) {
      roomBgCache.push(prerenderRoomBg(ri));
      var room = ROOMS[ri];
      for (var oi = 0; oi < room.objects.length; oi++) {
        var obj = room.objects[oi];
        objGlowCache[obj.id] = prerenderObj(obj);
      }
    }
  }

  // ============================================================
  // 8. AUDIO & SOUND FX
  // ============================================================
  function initAudio() {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch (e) { audioCtx = null; }
  }

  function playTone(freq, type, gain, dur, t0) {
    if (!audioCtx || !soundOn) return;
    t0 = t0 || audioCtx.currentTime;
    var o = audioCtx.createOscillator();
    var g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(t0); o.stop(t0 + dur);
  }

  function playSound(name) {
    if (!audioCtx || !soundOn) return;
    var t = audioCtx.currentTime;
    if (name === 'interact') playTone(440, 'sine', 0.08, 0.1, t);
    else if (name === 'item') playTone(587, 'triangle', 0.1, 0.2, t);
    else if (name === 'door') playTone(220, 'sawtooth', 0.06, 0.2, t);
    else if (name === 'victory') playTone(523, 'sine', 0.15, 0.3, t);
    else if (name === 'error') playTone(150, 'square', 0.1, 0.2, t);
  }

  // ============================================================
  // 9. CONFETTI SYSTEM
  // ============================================================
  var particles = [];
  function spawnConfetti() {
    particles = [];
    var cx = $confetti.width / 2;
    var cy = $confetti.height * 0.4;
    for (var i = 0; i < MAX_CONFETTI; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 120,
        y: cy + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 7,
        vy: -Math.random() * 6 - 2,
        w: Math.random() * 5 + 2,
        h: Math.random() * 3 + 1,
        color: [P.goldGlow, P.white, P.woodLight, '#10b981'][Math.floor(Math.random() * 4)],
        alpha: 1, rot: Math.random() * Math.PI * 2, rv: (Math.random() - 0.5) * 0.15,
      });
    }
  }

  function tickConfetti(dt) {
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.vy += 160 * dt; p.x += p.vx; p.y += p.vy * dt; p.rot += p.rv; p.alpha -= 0.35 * dt;
      if (p.alpha <= 0 || p.y > $confetti.height + 20) particles.splice(i, 1);
    }
  }

  function drawConfetti() {
    cctx.clearRect(0, 0, $confetti.width, $confetti.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      cctx.save(); cctx.globalAlpha = Math.max(0, p.alpha);
      cctx.fillStyle = p.color; cctx.translate(p.x, p.y);
      cctx.rotate(p.rot); cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      cctx.restore();
    }
  }

  // ============================================================
  // 10. RESIZE & INPUT
  // ============================================================
  function resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    document.documentElement.style.setProperty('--vh', (h * 0.01) + 'px');
    canvas.width = w; canvas.height = h;
    pixelSize = Math.max(2, Math.floor(Math.min(w, h) / 100));
    if (pixelSize > 5) pixelSize = 5;
    viewW = Math.ceil(w / pixelSize);
    viewH = Math.ceil(h / pixelSize);
    var joyRect = $joystick.getBoundingClientRect();
    joyMaxR = joyRect.width * 0.35;
    $confetti.width = w; $confetti.height = h;
  }

  function setupInput() {
    $joystick.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (joyTouchId !== null) return;
      var t = e.changedTouches[0]; joyTouchId = t.identifier;
      var r = $joystick.getBoundingClientRect();
      joyCX = r.left + r.width / 2; joyCY = r.top + r.height / 2;
      updateJoy(t.clientX, t.clientY);
      $joyKnob.classList.add('active');
    }, { passive: false });

    document.addEventListener('touchmove', function (e) {
      if (joyTouchId === null) return;
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          e.preventDefault(); updateJoy(e.changedTouches[i].clientX, e.changedTouches[i].clientY);
        }
      }
    }, { passive: false });

    var endJoy = function (e) {
      for (var i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joyTouchId) {
          joyTouchId = null; joyDX = 0; joyDY = 0;
          $joyKnob.style.transform = 'translate(-50%, -50%)';
          $joyKnob.classList.remove('active');
        }
      }
    };
    document.addEventListener('touchend', endJoy);
    document.addEventListener('touchcancel', endJoy);

    var actHandler = function (e) {
      e.preventDefault();
      if (GS.state === 'PLAYING' && nearbyObj) interact(nearbyObj);
    };
    $actionBtn.addEventListener('touchstart', actHandler, { passive: false });
    $actionBtn.addEventListener('click', actHandler);

    $modalClose.addEventListener('click', closeModal);
    $modalSubmit.addEventListener('click', submitModalInput);

    $modalInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') submitModalInput();
    });

    $startBtn.addEventListener('click', startGame);
    $endReplay.addEventListener('click', function () { location.reload(); });

    $soundToggle.addEventListener('click', function () {
      if (!audioCtx) initAudio();
      soundOn = !soundOn;
      $soundToggle.textContent = soundOn ? '🔊' : '🔇';
    });

    document.addEventListener('keydown', function (e) {
      keys[e.key.toLowerCase()] = true;
      if ((e.key === ' ' || e.key.toLowerCase() === 'e') && GS.state === 'PLAYING' && nearbyObj) interact(nearbyObj);
      if (e.key === 'Escape' && GS.state === 'MODAL') closeModal();
    });
    document.addEventListener('keyup', function (e) { keys[e.key.toLowerCase()] = false; });
  }

  function updateJoy(tx, ty) {
    var dx = tx - joyCX; var dy = ty - joyCY;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var clamped = Math.min(dist, joyMaxR);
    var angle = Math.atan2(dy, dx);
    $joyKnob.style.transform = 'translate(calc(-50% + ' + (Math.cos(angle) * clamped) + 'px), calc(-50% + ' + (Math.sin(angle) * clamped) + 'px))';
    if (dist < 6) { joyDX = 0; joyDY = 0; return; }
    var mag = Math.min(clamped / joyMaxR, 1);
    joyDX = Math.cos(angle) * mag; joyDY = Math.sin(angle) * mag;
  }

  function readKeyboard() {
    if (joyTouchId !== null) return;
    var kx = 0, ky = 0;
    if (keys['arrowleft']  || keys['a']) kx -= 1;
    if (keys['arrowright'] || keys['d']) kx += 1;
    if (keys['arrowup']    || keys['w']) ky -= 1;
    if (keys['arrowdown']  || keys['s']) ky += 1;
    if (kx !== 0 && ky !== 0) { kx /= Math.SQRT2; ky /= Math.SQRT2; }
    joyDX = kx; joyDY = ky;
  }

  // ============================================================
  // 11. GAME LOGIC & STORY FLOW
  // ============================================================
  function startGame() {
    GS.state = 'PLAYING';
    GS.timerStart = Date.now();
    $startScreen.classList.add('hidden');
    if (!audioCtx) initAudio();
    if (soundOn && audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
  }

  function interact(obj) {
    $modalInputContainer.classList.add('hidden');
    $modalSubmit.classList.add('hidden');
    $modalError.classList.add('hidden');
    $modalInput.value = '';
    GS.activePrompt = null;

    // --- Room 1 Objects ---
    if (obj.id === 'r1_drawer') {
      if (!GS.hasKeycard) {
        GS.hasKeycard = true;
        $keycardBadge.classList.remove('locked');
        $keycardBadge.classList.add('unlocked');
        showModal('KEYCARD FOUND!', 'You searched the CEO\'s desk drawer and retrieved the Executive Keycard! This will unlock the CEO Private Suite.', '🪪');
        playSound('item');
      } else {
        showModal('DESK DRAWER', 'Empty drawer. You already retrieved the Executive Keycard.', '🗄️');
        playSound('interact');
      }
    } else if (obj.id === 'r1_books') {
      if (!GS.foundDoorCode) {
        GS.foundDoorCode = true;
        showModal('BOOKSHELF NOTE', 'Tucked inside a leather binder, you find a handwritten note:\n\n"Open Office Door Code: ' + ROOM1_DOOR_CODE + '"', '📜');
        playSound('item');
      } else {
        showModal('BOOKSHELF', 'Row of corporate binders. You already noted down the door code (' + ROOM1_DOOR_CODE + ').', '📚');
        playSound('interact');
      }
    } else if (obj.id === 'r1_plant') {
      showModal('PLANT POT', 'A lush artificial ficus plant. Just soil and decorative stones.', '🪴'); playSound('interact');
    } else if (obj.id === 'r1_cabinet') {
      showModal('FILING CABINET', 'Old client files and invoices. Nothing related to the secret file code.', '📁'); playSound('interact');
    } else if (obj.id === 'r1_coat') {
      showModal('COAT RACK', 'A sharp suit jacket hanging on the rack. Checkbook and mints in the pocket.', '🧥'); playSound('interact');
    } else if (obj.id === 'r1_painting') {
      showModal('WALL PAINTING', 'A landscape painting of the corporate headquarters. Nothing behind the frame.', '🖼️'); playSound('interact');
    }

    // --- Room 1 Door Prompt ---
    else if (obj.id === 'door_r1') {
      if (GS.door1Unlocked) {
        startTransition(ROOMS[0].doors[0]);
      } else {
        GS.activePrompt = 'DOOR_CODE';
        showModal('SECURITY DOOR', 'Door to Open Office Floor is locked. Enter the 4-digit Access Code:', '🔒');
        $modalInputContainer.classList.remove('hidden');
        $modalSubmit.classList.remove('hidden');
        playSound('interact');
      }
    }

    // --- Room 2 NPC & Desks ---
    else if (obj.id === 'worker_npc') {
      showModal('ALEX (OFFICE WORKER)', '"Looking for the target computer? Check Desk #6 on the right side — it\'s the desk with the RED MUG!"', '💬');
      playSound('interact');
    } else if (obj.id.startsWith('desk')) {
      if (obj.isTarget) {
        GS.riddleRevealed = true;
        showModal('CONFIDENTIAL FILE', 'LOGGED IN TO TARGET COMPUTER!\n\nYou open file "SECRET_RIDDLE.TXT":\n\n"I have keys but no locks. I have space but no room. You can enter, but can\'t go outside. What am I?"', '💻');
        playSound('item');
      } else {
        showModal('OFFICE COMPUTER', 'Access Denied: Wrong desk workstation. Belongs to someone else.', '🖥️');
        playSound('interact');
      }
    } else if (obj.id === 'door_r2_next') {
      if (GS.hasKeycard) {
        startTransition(ROOMS[1].doors[1]);
      } else {
        showModal('KEYCARD REQUIRED', 'Access Denied! You need the Executive Keycard from Room 1 to enter the CEO Private Suite.', '🚫');
        playSound('error');
      }
    }

    // --- Room 3 CEO & Vault ---
    else if (obj.id === 'ceo_npc') {
      GS.activePrompt = 'CEO_PASSWORD';
      showModal('CEO CHIEF EXECUTIVE', '"Welcome, Intern! State the answer to the computer riddle as the Security Password to unlock the Vault Locker:"', '👔');
      $modalInputContainer.classList.remove('hidden');
      $modalSubmit.classList.remove('hidden');
      playSound('interact');
    } else if (obj.id === 'vault_locker') {
      GS.activePrompt = 'CEO_PASSWORD';
      showModal('VAULT LOCKER', 'Locked Executive Vault. Enter the Security Password (riddle answer):', '🔐');
      $modalInputContainer.classList.remove('hidden');
      $modalSubmit.classList.remove('hidden');
      playSound('interact');
    }
  }

  function submitModalInput() {
    var inputVal = $modalInput.value.trim().toUpperCase();

    if (GS.activePrompt === 'DOOR_CODE') {
      if (inputVal === ROOM1_DOOR_CODE) {
        GS.door1Unlocked = true;
        closeModal();
        startTransition(ROOMS[0].doors[0]);
      } else {
        $modalError.textContent = 'INCORRECT CODE';
        $modalError.classList.remove('hidden');
        playSound('error');
      }
    } else if (GS.activePrompt === 'CEO_PASSWORD') {
      if (inputVal === RIDDLE_SOLUTION) {
        closeModal();
        finishGame();
      } else {
        $modalError.textContent = 'WRONG PASSWORD';
        $modalError.classList.remove('hidden');
        playSound('error');
      }
    }
  }

  function finishGame() {
    GS.finalTime = (Date.now() - GS.timerStart) / 1000;
    GS.state = 'END';
    var mins = Math.floor(GS.finalTime / 60);
    var secs = Math.floor(GS.finalTime % 60);
    var timeStr = (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
    var under = GS.finalTime <= TIMER_THRESHOLD;

    $endTime.textContent = 'TIME ELAPSED: ' + timeStr;
    $endDiscount.textContent = under ? '20% DISCOUNT UNLOCKED' : '10% DISCOUNT UNLOCKED';
    $endCode.textContent = under ? DISCOUNT_CODE_20 : DISCOUNT_CODE_10;

    $endScreen.classList.remove('hidden');
    spawnConfetti();
    playSound('victory');
  }

  function showModal(title, text, icon) {
    GS.state = 'MODAL';
    $modalTitle.textContent = title;
    $modalText.textContent = text;
    $modalIcon.textContent = icon || '📂';
    $modalOverlay.classList.remove('hidden');
  }

  function closeModal() {
    GS.state = 'PLAYING';
    $modalOverlay.classList.add('hidden');
  }

  function startTransition(door) {
    trans.active = true; trans.phase = 1; trans.alpha = 0; trans.timer = 0;
    trans.targetRoom = door.targetRoom; trans.entryX = door.entryX; trans.entryY = door.entryY;
    GS.state = 'TRANSITION'; doorCooldown = true; playSound('door');
  }

  function updateTransition(dt) {
    if (!trans.active) return;
    trans.timer += dt;
    if (trans.phase === 1) {
      trans.alpha = Math.min(1, trans.timer / 0.3);
      if (trans.timer >= 0.3) {
        GS.room = trans.targetRoom;
        player.x = trans.entryX; player.y = trans.entryY;
        $roomLabel.textContent = ROOMS[GS.room].name;
        trans.phase = 2; trans.timer = 0;
      }
    } else {
      trans.alpha = 1 - Math.min(1, trans.timer / 0.3);
      if (trans.timer >= 0.3) {
        trans.active = false; trans.alpha = 0; GS.state = 'PLAYING';
      }
    }
  }

  // ============================================================
  // 12. UPDATE & COLLISION
  // ============================================================
  function collides(px, py) {
    var room = ROOMS[GS.room];
    var l = px - 3, r = px + 3, t = py - 4, b = py;
    if (l < 0 || r > ROOM_W || t < 0 || b > ROOM_H) return true;
    for (var i = 0; i < room.walls.length; i++) {
      var w = room.walls[i];
      if (r > w.x && l < w.x + w.w && b > w.y && t < w.y + w.h) return true;
    }
    for (var j = 0; j < room.objects.length; j++) {
      var o = room.objects[j];
      if (r > o.x + 2 && l < o.x + o.w - 2 && b > o.y + 2 && t < o.y + o.h - 2) return true;
    }
    return false;
  }

  function update(dt) {
    if (GS.state === 'TRANSITION') { updateTransition(dt); return; }
    if (GS.state !== 'PLAYING') return;

    glowT += dt * 3;
    readKeyboard();

    var speed = PLAYER_SPEED * dt;
    var dx = joyDX * speed, dy = joyDY * speed;
    var nx = player.x + dx; if (!collides(nx, player.y)) player.x = nx;
    var ny = player.y + dy; if (!collides(player.x, ny)) player.y = ny;

    if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
      player.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up');
      player.animT += dt;
      if (player.animT >= 0.15) { player.animT -= 0.15; player.frame = player.frame === 1 ? 2 : 1; }
    } else {
      player.frame = 0; player.animT = 0;
    }

    updateCamera();
    checkProximity();
    checkDoors();

    GS.elapsed = (Date.now() - GS.timerStart) / 1000;
    var m = Math.floor(GS.elapsed / 60);
    var s = Math.floor(GS.elapsed % 60);
    $timer.textContent = (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  }

  function updateCamera() {
    var fx = viewW >= ROOM_W ? -(viewW - ROOM_W) / 2 : Math.max(0, Math.min(player.x - viewW / 2, ROOM_W - viewW));
    var fy = viewH >= ROOM_H ? -(viewH - ROOM_H) / 2 : Math.max(0, Math.min(player.y - viewH / 2, ROOM_H - viewH));
    cameraX += (fx - cameraX) * 0.12; cameraY += (fy - cameraY) * 0.12;
  }

  function checkProximity() {
    var room = ROOMS[GS.room];
    nearbyObj = null;
    var minD = Infinity;

    // Check objects
    for (var i = 0; i < room.objects.length; i++) {
      var o = room.objects[i];
      var d = Math.sqrt(Math.pow(player.x - (o.x + o.w / 2), 2) + Math.pow(player.y - (o.y + o.h / 2), 2));
      if (d < INTERACT_RANGE && d < minD) { nearbyObj = o; minD = d; }
    }
    // Check doors
    for (var j = 0; j < room.doors.length; j++) {
      var dr = room.doors[j];
      var dd = Math.sqrt(Math.pow(player.x - (dr.x + dr.w / 2), 2) + Math.pow(player.y - (dr.y + dr.h / 2), 2));
      if (dd < INTERACT_RANGE && dd < minD) {
        nearbyObj = { id: dr.id, x: dr.x, y: dr.y, w: dr.w, h: dr.h, label: 'ENTER DOOR', icon: '🚪' };
        minD = dd;
      }
    }
    // Check NPCs
    if (room.npc) {
      var nd = Math.sqrt(Math.pow(player.x - room.npc.x, 2) + Math.pow(player.y - room.npc.y, 2));
      if (nd < INTERACT_RANGE && nd < minD) { nearbyObj = room.npc; minD = nd; }
    }
    if (room.ceo) {
      var cd = Math.sqrt(Math.pow(player.x - room.ceo.x, 2) + Math.pow(player.y - room.ceo.y, 2));
      if (cd < INTERACT_RANGE && cd < minD) { nearbyObj = room.ceo; minD = cd; }
    }

    if (nearbyObj) {
      $actionBtn.classList.add('active');
      $actionLabel.textContent = nearbyObj.label || 'ACT';
    } else {
      $actionBtn.classList.remove('active');
      $actionLabel.textContent = 'ACT';
    }
  }

  function checkDoors() {
    if (doorCooldown) { doorCooldown = false; return; }
  }

  // ============================================================
  // 13. RENDERING
  // ============================================================
  function render() {
    ctx.imageSmoothingEnabled = false;
    ctx.fillStyle = P.bg; ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (GS.state === 'START') return;
    if (GS.state === 'END') {
      renderGameFrame();
      if (particles.length > 0) drawConfetti();
      return;
    }

    renderGameFrame();

    if (trans.active && trans.alpha > 0) {
      ctx.fillStyle = P.bg; ctx.globalAlpha = trans.alpha;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
    }
  }

  function renderGameFrame() {
    var ps = pixelSize;
    var ox = -cameraX * ps;
    var oy = -cameraY * ps;

    // Room Background
    var bgc = roomBgCache[GS.room];
    if (bgc) ctx.drawImage(bgc, Math.round(ox), Math.round(oy), ROOM_W * ps, ROOM_H * ps);

    // Objects with soft warm pulse glow
    var room = ROOMS[GS.room];
    var glowAlpha = 0.7 + 0.3 * Math.sin(glowT);

    for (var i = 0; i < room.objects.length; i++) {
      var obj = room.objects[i];
      var gc = objGlowCache[obj.id];
      if (!gc) continue;
      var pad = 8;
      ctx.globalAlpha = (nearbyObj === obj) ? 1 : glowAlpha;
      ctx.drawImage(gc, Math.round((obj.x - pad) * ps + ox), Math.round((obj.y - pad) * ps + oy), gc.width * ps, gc.height * ps);
      ctx.globalAlpha = 1;
    }

    // Draw Worker / CEO NPCs
    if (room.npc && workerSpriteCache[0]) {
      ctx.drawImage(workerSpriteCache[0], Math.round((room.npc.x - 4) * ps + ox), Math.round((room.npc.y - 12) * ps + oy), SPRITE_W * ps, SPRITE_H * ps);
    }
    if (room.ceo && ceoSpriteCache[0]) {
      ctx.drawImage(ceoSpriteCache[0], Math.round((room.ceo.x - 4) * ps + ox), Math.round((room.ceo.y - 12) * ps + oy), SPRITE_W * ps, SPRITE_H * ps);
    }

    // Player
    var frameCanvas = playerSpriteCache[player.frame] || playerSpriteCache[0];
    if (frameCanvas) {
      ctx.drawImage(frameCanvas, Math.round((player.x - SPRITE_W / 2) * ps + ox), Math.round((player.y - SPRITE_H) * ps + oy), SPRITE_W * ps, SPRITE_H * ps);
    }

    // Contextual label above nearby object
    if (nearbyObj && GS.state === 'PLAYING') {
      var lx = Math.round((nearbyObj.x + (nearbyObj.w || 0) / 2) * ps + ox);
      var ly = Math.round(((nearbyObj.y || player.y) - 6) * ps + oy);
      ctx.font = Math.max(8, Math.round(ps * 2.4)) + 'px "Press Start 2P", monospace';
      ctx.textAlign = 'center'; ctx.fillStyle = P.goldGlow;
      ctx.fillText(nearbyObj.label, lx, ly);
    }
  }

  // ============================================================
  // 14. MAIN LOOP & INIT
  // ============================================================
  function gameLoop(ts) {
    var dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;
    update(dt);
    render();
    if (GS.state === 'END' && particles.length > 0) tickConfetti(dt);
    requestAnimationFrame(gameLoop);
  }

  function init() {
    canvas       = document.getElementById('game-canvas');
    ctx          = canvas.getContext('2d');
    $timer       = document.getElementById('timer');
    $roomLabel   = document.getElementById('room-label');
    $keycardBadge = document.getElementById('keycard-badge');
    $actionBtn   = document.getElementById('action-btn');
    $actionLabel = document.getElementById('action-label');
    $actionIcon  = document.getElementById('action-icon');
    $joystick    = document.getElementById('joystick');
    $joyKnob     = document.getElementById('joystick-knob');
    $modalOverlay = document.getElementById('modal-overlay');
    $modalTitle  = document.getElementById('modal-title');
    $modalText   = document.getElementById('modal-text');
    $modalIcon   = document.getElementById('modal-icon');
    $modalClose  = document.getElementById('modal-close');
    $modalSubmit = document.getElementById('modal-submit');
    $modalInput  = document.getElementById('modal-input');
    $modalInputContainer = document.getElementById('modal-input-container');
    $modalError  = document.getElementById('modal-error');
    $startScreen = document.getElementById('start-screen');
    $startBtn    = document.getElementById('start-btn');
    $endScreen   = document.getElementById('end-screen');
    $endTitle    = document.getElementById('end-title');
    $endTime     = document.getElementById('end-time');
    $endDiscount = document.getElementById('end-discount-label');
    $endCode     = document.getElementById('end-code');
    $endReplay   = document.getElementById('end-replay-btn');
    $confetti    = document.getElementById('confetti-canvas');
    cctx         = $confetti.getContext('2d');
    $soundToggle = document.getElementById('sound-toggle');

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 150); });
    resize();

    prerenderAll();
    setupInput();

    lastTs = performance.now();
    requestAnimationFrame(gameLoop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
