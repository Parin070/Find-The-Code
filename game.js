/* ============================================================
   FIND THE CODE — Office Heist Engine
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
  const DISCOUNT_CODE_20 = 'AIWILLTAKEOVER20';
  const DISCOUNT_CODE_10 = 'AIWILLTAKEOVER10';

  // Computer Science / Tech Riddles Pool for Room 2 Target Workstation
  const CS_QUESTIONS = [
    { q: "I have keys but no locks. I have space but no room. You can enter, but can't go outside. What am I?", a: "KEYBOARD" },
    { q: "I translate high-level code into machine instructions all at once before execution. What am I?", a: "COMPILER" },
    { q: "I am a First-In, First-Out (FIFO) linear data structure. What am I?", a: "QUEUE" },
    { q: "I am a First-In, Last-Out (FILO) linear data structure. What am I?", a: "STACK" },
    { q: "I am a software glitch named after a moth found in a Harvard computer relay in 1947. What am I?", a: "BUG" },
    { q: "I am the core process of an operating system that manages memory, CPU, and hardware access. What am I?", a: "KERNEL" }
  ];

  const R1_OBJECT_NAMES = {
    r1_drawer: 'CEO Desk Drawer',
    r1_books: 'Leather Binder Bookshelf',
    r1_plant: 'Decorative Ficus Plant',
    r1_cabinet: 'Filing Cabinet',
    r1_coat: 'Suit Coat Rack',
    r1_painting: 'Corporate Landscape Art'
  };

  // ============================================================
  // 2. PALETTE & COLORS (Warm/Cool Office Theme)
  // ============================================================
  const P = {
    bg: '#0f172a',
    wallWood: '#4a3319',
    wallWoodLt: '#6b4926',
    wallPlaster: '#d8dce2',
    wallPlasterD: '#b0b7c2',
    carpetBlue: '#2a394a',
    carpetBlueAlt: '#23303f',
    carpetLine: '#1b2633',
    rugRed: '#7f1d1d',
    rugRedLt: '#991b1b',
    goldGlow: '#ffc83b',
    goldGlowDim: '#886714',
    woodDark: '#3a2612',
    woodMid: '#5c3d1e',
    woodLight: '#8c6033',
    metalDark: '#334155',
    metalLt: '#64748b',
    metalBright: '#cbd5e1',
    plantGreen: '#15803d',
    plantPot: '#b45309',
    screenBlue: '#1e3a5f',
    redMug: '#dc2626',
    white: '#f8fafc',
    skin: '#e8c8a0',
    hairIntern: '#1e293b',
    hairWorker: '#854d0e',
    hairCEO: '#94a3b8',
    hairRecep: '#b45309',
    suitCEO: '#0f172a',
    shirtWorker: '#2563eb',
    shirtIntern: '#0d9488',
    shirtRecep: '#7c3aed'
  };

  // ============================================================
  // 3. PER-SESSION RANDOMIZATION & SESSION STATE
  // ============================================================
  var sessionData = {
    doorCode: '7492',
    keycardObjId: 'r1_drawer',
    doorCodeObjId: 'r1_books',
    csQuestion: CS_QUESTIONS[0]
  };

  function initSessionRandomization() {
    // Generate random 4-digit code
    sessionData.doorCode = Math.floor(1000 + Math.random() * 9000).toString();

    // Randomize which object holds keycard vs door code note
    var keys = Object.keys(R1_OBJECT_NAMES);
    for (var i = keys.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = keys[i]; keys[i] = keys[j]; keys[j] = temp;
    }
    sessionData.keycardObjId = keys[0];
    sessionData.doorCodeObjId = keys[1];

    // Pick random CS riddle/question
    var qIdx = Math.floor(Math.random() * CS_QUESTIONS.length);
    sessionData.csQuestion = CS_QUESTIONS[qIdx];
  }

  // ============================================================
  // 4. SPRITE BUILDER (Intern, Receptionist, Worker, CEO)
  // ============================================================
  function buildCharFrames(shirtCol, hairCol, pantsCol) {
    var pal = [null, P.skin, hairCol, shirtCol, pantsCol, '#0f172a', '#1e293b'];
    var rawDown = [
      [[0, 0, 2, 2, 2, 2, 0, 0], [0, 2, 2, 2, 2, 2, 2, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 6, 1, 1, 6, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 3, 3, 3, 3, 3, 3, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 0, 4, 4, 4, 4, 0, 0], [0, 0, 4, 0, 0, 4, 0, 0], [0, 0, 4, 0, 0, 4, 0, 0], [0, 0, 5, 0, 0, 5, 0, 0]],
      [[0, 0, 2, 2, 2, 2, 0, 0], [0, 2, 2, 2, 2, 2, 2, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 6, 1, 1, 6, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 3, 3, 3, 3, 3, 3, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 0, 4, 4, 4, 4, 0, 0], [0, 4, 4, 0, 0, 0, 0, 0], [0, 4, 0, 0, 0, 4, 0, 0], [0, 5, 0, 0, 0, 5, 0, 0]],
      [[0, 0, 2, 2, 2, 2, 0, 0], [0, 2, 2, 2, 2, 2, 2, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 1, 6, 1, 1, 6, 1, 0], [0, 1, 1, 1, 1, 1, 1, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 3, 3, 3, 3, 3, 3, 0], [0, 0, 3, 3, 3, 3, 0, 0], [0, 0, 4, 4, 4, 4, 0, 0], [0, 0, 0, 0, 4, 4, 0, 0], [0, 4, 0, 0, 0, 4, 0, 0], [0, 5, 0, 0, 0, 5, 0, 0]],
    ];
    return rawDown.map(function (frame) {
      return offscreen(SPRITE_W, SPRITE_H, function (c) {
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
  // 5. ROOM DEFINITIONS & LAYOUT
  // ============================================================
  var ROOMS = [
    // --- Room 0: Reception ---
    {
      name: 'RECEPTION',
      startX: 120, startY: 155,
      walls: [
        { x: 0, y: 0, w: ROOM_W, h: 32 },
        { x: 0, y: 0, w: 12, h: ROOM_H },
        { x: 228, y: 0, w: 12, h: 72 },
        { x: 228, y: 112, w: 12, h: ROOM_H - 112 },
      ],
      npc: { id: 'receptionist_npc', x: 120, y: 62, w: 12, h: 16, label: 'TALK TO SARAH', icon: '👩‍💼' },
      decorDoors: [
        { id: 'decor_door_utility', x: 0, y: 115, w: 12, h: 36, label: 'UTILITY CLOSET', icon: '🔒' },
        { id: 'decor_door_conf', x: 32, y: 0, w: 32, h: 12, label: 'CONFERENCE ROOM', icon: '🔒' }
      ],
      objects: [
        { id: 'r1_drawer', x: 24, y: 6, w: 36, h: 24, label: 'SEARCH DRAWER', icon: '🗄️' },
        { id: 'r1_books', x: 74, y: 6, w: 36, h: 24, label: 'CHECK BOOKS', icon: '📚' },
        { id: 'r1_plant', x: 184, y: 6, w: 24, h: 26, label: 'CHECK PLANT', icon: '🪴' },
        { id: 'r1_cabinet', x: 24, y: 125, w: 32, h: 40, label: 'SEARCH FILING', icon: '📁' },
        { id: 'r1_coat', x: 184, y: 130, w: 20, h: 36, label: 'INSPECT COAT', icon: '🧥' },
        { id: 'r1_painting', x: 120, y: 4, w: 32, h: 20, label: 'INSPECT ART', icon: '🖼️' }
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
        { x: 0, y: 0, w: ROOM_W, h: 32 },
        { x: 0, y: 0, w: 12, h: 72 },
        { x: 0, y: 112, w: 12, h: ROOM_H - 112 },
        { x: 228, y: 0, w: 12, h: 72 },
        { x: 228, y: 112, w: 12, h: ROOM_H - 112 },
      ],
      npc: { id: 'worker_npc', x: 120, y: 55, w: 12, h: 16, label: 'TALK TO ALEX', icon: '💬' },
      objects: [
        { id: 'desk1', x: 24, y: 40, w: 36, h: 28, label: 'LOGIN DESK #1', icon: '💻', mug: 'blue' },
        { id: 'desk2', x: 70, y: 40, w: 36, h: 28, label: 'LOGIN DESK #2', icon: '💻', mug: 'white' },
        { id: 'desk3', x: 24, y: 115, w: 36, h: 28, label: 'LOGIN DESK #3', icon: '💻', mug: 'green' },
        { id: 'desk4', x: 70, y: 115, w: 36, h: 28, label: 'LOGIN DESK #4', icon: '💻', mug: 'yellow' },
        { id: 'desk5', x: 140, y: 40, w: 36, h: 28, label: 'LOGIN DESK #5', icon: '💻', mug: 'black' },
        { id: 'desk6', x: 184, y: 40, w: 36, h: 28, label: 'LOGIN DESK #6', icon: '💻', mug: 'red', isTarget: true },
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
        { x: 0, y: 0, w: ROOM_W, h: 32 },
        { x: 0, y: 0, w: 12, h: 72 },
        { x: 0, y: 112, w: 12, h: ROOM_H - 112 },
        { x: 228, y: 0, w: 12, h: ROOM_H }
      ],
      ceo: { id: 'ceo_npc', x: 110, y: 44, w: 12, h: 16, label: 'TALK TO CEO', icon: '👔' },
      objects: [
        { id: 'r3_ceo_desk', x: 85, y: 54, w: 50, h: 26, label: 'INSPECT CEO DESK', icon: '💼' },
        { id: 'r3_bookshelf', x: 24, y: 6, w: 40, h: 26, label: 'CHECK CEO LIBRARY', icon: '📚' },
        { id: 'r3_trophies', x: 74, y: 6, w: 36, h: 22, label: 'INSPECT TROPHIES', icon: '🏆' },
        { id: 'r3_plant_l', x: 16, y: 130, w: 20, h: 26, label: 'CHECK PLANT', icon: '🪴' },
        { id: 'r3_plant_r', x: 195, y: 130, w: 20, h: 26, label: 'CHECK PLANT', icon: '🪴' },
        { id: 'vault_locker', x: 180, y: 40, w: 40, h: 48, label: 'OPEN VAULT LOCKER', icon: '🔐' }
      ],
      doors: [
        { id: 'door_r3_back', x: 0, y: 72, w: 12, h: 40, targetRoom: 1, entryX: 214, entryY: 92, locked: false }
      ]
    }
  ];

  // ============================================================
  // 6. GAME STATE
  // ============================================================
  var GS = {
    state: 'START',
    room: 0,
    hasKeycard: false,
    foundDoorCode: false,
    door1Unlocked: false,
    riddleRevealed: false,
    timerStart: 0,
    elapsed: 0,
    finalTime: 0,
    activePrompt: null
  };

  var player = { x: 120, y: 155, dir: 'down', frame: 0, animT: 0 };
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
  // 7. CACHES & GRAPHICS
  // ============================================================
  var roomBgCache = [];
  var playerSpriteCache = [];
  var workerSpriteCache = [];
  var ceoSpriteCache = [];
  var recepSpriteCache = [];
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
  // 8. PRE-RENDERING ART (Pixel Art Office Theme & Decor)
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

      // Room 0 Non-interactable Decor: Center Rug
      if (ri === 0) {
        c.fillStyle = P.rugRed;
        c.fillRect(75, 110, 90, 36);
        c.fillStyle = P.goldGlowDim;
        c.fillRect(75, 110, 90, 1); c.fillRect(75, 145, 90, 1);
      }

      // Walls
      var room = ROOMS[ri];
      for (var i = 0; i < room.walls.length; i++) {
        var w = room.walls[i];
        c.fillStyle = ri === 2 ? P.wallWood : P.wallPlaster;
        c.fillRect(w.x, w.y, w.w, w.h);
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

      // Decorative Inaccessible Doors (Room 0)
      if (ri === 0 && room.decorDoors) {
        for (var dd = 0; dd < room.decorDoors.length; dd++) {
          var ddoor = room.decorDoors[dd];
          c.fillStyle = P.woodDark;
          c.fillRect(ddoor.x, ddoor.y, ddoor.w, ddoor.h);
          c.fillStyle = P.goldGlowDim;
          c.fillRect(ddoor.x + 2, ddoor.y + 2, ddoor.w - 4, 1);
        }
      }

      // Room specific non-interactable visual decor
      if (ri === 0) {
        // Front Desk Counter (higher up, spacious room)
        c.fillStyle = P.woodMid;
        c.fillRect(70, 72, 100, 18);
        c.fillStyle = P.woodLight;
        c.fillRect(70, 72, 100, 3);
        // Reception desk computer & sign pad
        c.fillStyle = P.metalDark; c.fillRect(100, 74, 12, 8);
        c.fillStyle = P.screenBlue; c.fillRect(101, 75, 10, 6);

        // Leather Sofa (lower right)
        c.fillStyle = P.woodDark;
        c.fillRect(175, 140, 40, 20);
        c.fillStyle = P.woodMid;
        c.fillRect(177, 142, 36, 16);
        c.fillStyle = P.woodLight;
        c.fillRect(177, 142, 17, 16); c.fillRect(196, 142, 17, 16);

        // Wall Clock above reception desk
        c.fillStyle = P.white;
        c.beginPath(); c.arc(120, 14, 5, 0, Math.PI * 2); c.fill();
        c.fillStyle = P.metalDark;
        c.fillRect(120, 12, 1, 3); c.fillRect(120, 14, 3, 1);

        // Potted Plant (left corner)
        c.fillStyle = P.plantPot; c.fillRect(16, 85, 10, 10);
        c.fillStyle = P.plantGreen;
        c.beginPath(); c.arc(21, 80, 7, 0, Math.PI * 2); c.fill();

      } else if (ri === 1) {
        // Partition lines
        c.fillStyle = P.metalLt;
        c.fillRect(118, 32, 4, 120);
      } else if (ri === 2) {
        // Executive Rug
        c.fillStyle = P.rugRed;
        c.fillRect(60, 60, 120, 80);
        c.fillStyle = P.goldGlowDim;
        c.fillRect(62, 62, 116, 2); c.fillRect(62, 136, 116, 2);
      }
    });
  }

  // --- Detailed Interactable Object Drawing ---
  function drawObjDrawer(c, w, h) {
    c.fillStyle = P.woodMid; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, 2);
    // Drawer handles & panel lines
    c.fillStyle = P.woodDark; c.fillRect(2, 6, w - 4, 1); c.fillRect(2, 14, w - 4, 1);
    c.fillStyle = P.metalBright; c.fillRect(w / 2 - 4, 9, 8, 2); c.fillRect(w / 2 - 4, 17, 8, 2);
    // Desk lamp & paper stack on top
    c.fillStyle = P.white; c.fillRect(4, 2, 6, 4);
    c.fillStyle = P.goldGlow; c.fillRect(w - 8, 2, 4, 3);
  }

  function drawObjBooks(c, w, h) {
    c.fillStyle = P.woodDark; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodMid; c.fillRect(2, 2, w - 4, h - 4);
    // Detailed book spines
    var cols = ['#991b1b', '#1e3a8a', '#166534', '#d97706', '#7c3aed', '#0284c7'];
    for (var shelf = 0; shelf < 2; shelf++) {
      var sy = 4 + shelf * 18;
      c.fillStyle = P.woodDark; c.fillRect(2, sy + 14, w - 4, 2);
      for (var i = 0; i < 6; i++) {
        c.fillStyle = cols[(shelf * 3 + i) % cols.length];
        c.fillRect(4 + i * 5, sy, 4, 13);
        c.fillStyle = P.goldGlowDim; c.fillRect(5 + i * 5, sy + 3, 2, 2); // spine gold title
      }
    }
  }

  function drawObjPlant(c, w, h) {
    c.fillStyle = P.plantPot; c.fillRect(w / 2 - 7, h - 12, 14, 12);
    c.fillStyle = P.woodDark; c.fillRect(w / 2 - 6, h - 12, 12, 2);
    c.fillStyle = P.plantGreen;
    c.beginPath(); c.arc(w / 2, h / 2 - 4, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#22c55e'; // leaf highlights
    c.beginPath(); c.arc(w / 2 - 3, h / 2 - 6, 5, 0, Math.PI * 2); c.fill();
  }

  function drawObjCabinet(c, w, h) {
    c.fillStyle = P.metalDark; c.fillRect(0, 0, w, h);
    c.fillStyle = P.metalLt; c.fillRect(2, 2, w - 4, h - 4);
    // 3 Filing Drawers with labels & handles
    for (var d = 0; d < 3; d++) {
      var dy = 4 + d * 11;
      c.fillStyle = P.metalDark; c.fillRect(4, dy, w - 8, 10);
      c.fillStyle = P.white; c.fillRect(6, dy + 3, 5, 4); // label card
      c.fillStyle = P.metalBright; c.fillRect(w - 12, dy + 4, 6, 2); // handle
    }
  }

  function drawObjCoat(c, w, h) {
    // Wooden coat rack stand
    c.fillStyle = P.woodDark; c.fillRect(w / 2 - 1, 0, 2, h);
    c.fillRect(w / 2 - 6, h - 3, 12, 3);
    // Trench coat / suit jacket on hanger
    c.fillStyle = '#334155'; c.fillRect(w / 2 - 7, 8, 14, 20);
    c.fillStyle = '#1e293b'; c.fillRect(w / 2 - 5, 10, 10, 18);
    c.fillStyle = P.white; c.fillRect(w / 2 - 2, 10, 4, 4); // shirt collar
  }

  function drawObjPainting(c, w, h) {
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodDark; c.fillRect(2, 2, w - 4, h - 4);
    c.fillStyle = P.screenBlue; c.fillRect(4, 4, w - 8, h - 8);
    // Detailed artwork canvas
    c.fillStyle = P.goldGlow; c.beginPath(); c.arc(12, 12, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = P.plantGreen; c.fillRect(6, 18, w - 12, 4);
  }

  function drawObjDesk(c, w, h, deskIndex, mugCol) {
    c.fillStyle = P.woodMid; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(0, 0, w, 2);

    // Varied Monitor Angles & Clutter per Desk
    c.fillStyle = P.metalDark;
    if (deskIndex % 2 === 0) {
      c.fillRect(4, 3, 14, 12); c.fillRect(20, 3, 14, 12);
      c.fillStyle = P.screenBlue;
      c.fillRect(5, 5, 12, 8); c.fillRect(21, 5, 12, 8);
    } else {
      c.fillRect(8, 4, 20, 13);
      c.fillStyle = P.screenBlue;
      c.fillRect(10, 6, 16, 9);
    }

    c.fillStyle = P.metalLt; c.fillRect(10, 18, 14, 4);
    c.fillStyle = P.white; c.fillRect(26, 19, 2, 3);

    // Desk specific clutter
    if (deskIndex === 0) {
      c.fillStyle = P.white; c.fillRect(2, 6, 5, 6);
    } else if (deskIndex === 1) {
      c.fillStyle = '#ef4444'; c.fillRect(2, 8, 4, 4);
    } else if (deskIndex === 2) {
      c.fillStyle = P.plantPot; c.fillRect(2, 14, 4, 4);
      c.fillStyle = P.plantGreen; c.fillRect(2, 11, 4, 3);
    } else if (deskIndex === 3) {
      c.fillStyle = P.metalLt; c.fillRect(2, 8, 6, 5);
    } else if (deskIndex === 4) {
      c.fillStyle = '#2563eb'; c.fillRect(2, 6, 5, 6);
    } else if (deskIndex === 5) { // Target Desk #6
      c.fillStyle = P.white; c.fillRect(2, 6, 5, 6);
    } else if (deskIndex === 6) {
      c.fillStyle = '#f59e0b'; c.fillRect(2, 8, 4, 4);
    } else if (deskIndex === 7) {
      c.fillStyle = '#3b82f6'; c.fillRect(2, 6, 3, 6);
    }

    // Coffee Mug
    var mugColors = { red: P.redMug, blue: '#2563eb', white: '#f8fafc', green: '#166534', yellow: '#d97706', black: '#0f172a', purple: '#7c3aed', orange: '#ea580c' };
    c.fillStyle = mugColors[mugCol] || P.metalBright;
    c.fillRect(w - 7, 12, 4, 5);
  }

  function drawObjVault(c, w, h) {
    c.fillStyle = P.metalDark; c.fillRect(0, 0, w, h);
    c.fillStyle = P.woodLight; c.fillRect(2, 2, w - 4, h - 4);
    c.fillStyle = P.goldGlow; c.fillRect(w / 2 - 6, h / 2 - 6, 12, 12);
  }

  function drawObjCEODesk(c, w, h) {
    c.fillStyle = '#3a2612'; c.fillRect(0, 0, w, h);
    c.fillStyle = P.goldGlowDim; c.fillRect(0, 0, w, 2); c.fillRect(0, h - 2, w, 2);
    c.fillStyle = P.metalDark; c.fillRect(w / 2 - 10, 4, 20, 12);
    c.fillStyle = P.screenBlue; c.fillRect(w / 2 - 9, 5, 18, 10);
    c.fillStyle = P.goldGlow; c.fillRect(6, 16, 8, 3);
    c.fillStyle = P.white; c.fillRect(w - 12, 14, 6, 4);
  }

  function drawObjTrophies(c, w, h) {
    c.fillStyle = P.woodDark; c.fillRect(0, h - 4, w, 4);
    c.fillStyle = P.woodLight; c.fillRect(0, h - 4, w, 1);
    c.fillStyle = P.goldGlow;
    c.fillRect(4, 4, 6, 8); c.fillRect(5, 12, 4, 4);
    c.fillRect(16, 2, 8, 10); c.fillRect(18, 12, 4, 4);
    c.fillStyle = '#b45309'; c.fillRect(28, 4, 6, 12);
    c.fillStyle = P.goldGlow; c.fillRect(29, 5, 4, 10);
  }

  var OBJ_DRAWS = {
    r1_drawer: drawObjDrawer, r1_books: drawObjBooks, r1_plant: drawObjPlant,
    r1_cabinet: drawObjCabinet, r1_coat: drawObjCoat, r1_painting: drawObjPainting,
    r3_ceo_desk: drawObjCEODesk, r3_bookshelf: drawObjBooks, r3_trophies: drawObjTrophies,
    r3_plant_l: drawObjPlant, r3_plant_r: drawObjPlant,
    vault_locker: drawObjVault
  };

  function prerenderObj(obj) {
    return offscreen(obj.w, obj.h, function (c) {
      if (obj.id.startsWith('desk')) {
        var dIdx = parseInt(obj.id.replace('desk', ''), 10) - 1;
        drawObjDesk(c, obj.w, obj.h, dIdx, obj.mug);
      } else if (OBJ_DRAWS[obj.id]) {
        OBJ_DRAWS[obj.id](c, obj.w, obj.h);
      }
    });
  }

  function prerenderAll() {
    playerSpriteCache = buildCharFrames(P.shirtIntern, P.hairIntern, '#1e293b');
    workerSpriteCache = buildCharFrames(P.shirtWorker, P.hairWorker, '#334155');
    ceoSpriteCache = buildCharFrames(P.suitCEO, P.hairCEO, '#0f172a');
    recepSpriteCache = buildCharFrames(P.shirtRecep, P.hairRecep, '#475569');

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
  // 9. AUDIO & SOUND FX
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
  // 10. CONFETTI SYSTEM
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
  // 11. RESIZE & INPUT
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

    $modalInput.addEventListener('keydown', function (e) {
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
    if (keys['arrowleft'] || keys['a']) kx -= 1;
    if (keys['arrowright'] || keys['d']) kx += 1;
    if (keys['arrowup'] || keys['w']) ky -= 1;
    if (keys['arrowdown'] || keys['s']) ky += 1;
    if (kx !== 0 && ky !== 0) { kx /= Math.SQRT2; ky /= Math.SQRT2; }
    joyDX = kx; joyDY = ky;
  }

  // ============================================================
  // 12. GAME LOGIC & STORY FLOW
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

    // --- Receptionist NPC ---
    if (obj.id === 'receptionist_npc') {
      showModal('SARAH (RECEPTIONIST)', '"Welcome to Corporate HQ! The CEO is expecting someone reliable today... Good luck with your first assignment, new hire!"', '👩‍💼');
      playSound('interact');
    }
    // --- Decor Doors ---
    else if (obj.id === 'decor_door_utility') {
      showModal('UTILITY CLOSET', 'Door is locked. Storage supplies and electrical panels only.', '🔒'); playSound('interact');
    } else if (obj.id === 'decor_door_conf') {
      showModal('CONFERENCE ROOM A', 'Door is locked. Scheduled for an executive presentation later today.', '🔒'); playSound('interact');
    }

    // --- Room 1 Randomized Interactable Objects ---
    else if (obj.id.startsWith('r1_')) {
      var objName = R1_OBJECT_NAMES[obj.id] || 'Object';

      if (obj.id === sessionData.keycardObjId) {
        if (!GS.hasKeycard) {
          GS.hasKeycard = true;
          $keycardBadge.classList.remove('locked');
          $keycardBadge.classList.add('unlocked');
          showModal('KEYCARD FOUND!', 'You thoroughly searched the ' + objName + ' and retrieved the Executive Keycard! This will unlock the CEO Private Suite.', '🪪');
          playSound('item');
        } else {
          showModal(objName.toUpperCase(), 'You already retrieved the Executive Keycard from here.', obj.icon || '🔍');
          playSound('interact');
        }
      } else if (obj.id === sessionData.doorCodeObjId) {
        if (!GS.foundDoorCode) {
          GS.foundDoorCode = true;
          showModal('SECRET NOTE FOUND!', 'Hidden inside the ' + objName + ', you find a handwritten memo:\n\n"Open Office Door Code: ' + sessionData.doorCode + '"', '📜');
          playSound('item');
        } else {
          showModal(objName.toUpperCase(), 'You already noted down the door code (' + sessionData.doorCode + ').', obj.icon || '🔍');
          playSound('interact');
        }
      } else {
        // Flavor responses for empty objects
        var flavors = {
          r1_drawer: 'Old paperclips, sticky notes, and corporate pens. Nothing useful.',
          r1_books: 'Annual financial reports from 2023. Boring spreadsheets.',
          r1_plant: 'Just decorative soil and faux leaves. Clean and dust-free.',
          r1_cabinet: 'Archived tax filings and receipts. Nothing related to access codes.',
          r1_coat: 'A designer suit jacket. Pockets only contain throat lozenges.',
          r1_painting: 'A framed landscape of corporate headquarters. Frame is firmly mounted.'
        };
        showModal(objName.toUpperCase(), flavors[obj.id] || 'Nothing special found here.', obj.icon || '🔍');
        playSound('interact');
      }
    }

    // --- Room 1 Exit Door Prompt ---
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
      showModal('ALEX (OFFICE WORKER)', '"Looking for the target workstation? Check the desk that has a RED MUG sitting on it!"', '💬');
      playSound('interact');
    } else if (obj.id.startsWith('desk')) {
      if (obj.isTarget) {
        GS.riddleRevealed = true;
        showModal('CONFIDENTIAL FILE', 'LOGGED IN TO TARGET WORKSTATION!\n\nYou open "CONFIDENTIAL_RIDDLE.TXT":\n\n"' + sessionData.csQuestion.q + '"', '💻');
        playSound('item');
      } else {
        showModal('OFFICE COMPUTER', 'Access Denied: Workstation belongs to someone else.', '🖥️');
        playSound('interact');
      }
    }

    // --- Room 2 Back & Next Doors ---
    else if (obj.id === 'door_r2_back') {
      startTransition(ROOMS[1].doors[0]);
    } else if (obj.id === 'door_r2_next') {
      if (GS.door2Unlocked || GS.hasKeycard) {
        GS.door2Unlocked = true;
        startTransition(ROOMS[1].doors[1]);
      } else {
        showModal('KEYCARD REQUIRED', 'Access Denied! You need the Executive Keycard from Room 1 to enter the CEO Private Suite.', '🚫');
        playSound('error');
      }
    }

    // --- Room 3 Back Door, CEO Desk, Library, Trophies & Vault ---
    else if (obj.id === 'door_r3_back') {
      startTransition(ROOMS[2].doors[0]);
    } else if (obj.id === 'r3_ceo_desk') {
      showModal('CEO EXECUTIVE DESK', 'Handcrafted mahogany desk with a brass nameplate, encrypted workstation terminal, and gold trim.', '💼');
      playSound('interact');
    } else if (obj.id === 'r3_bookshelf') {
      showModal('CEO EXECUTIVE LIBRARY', 'Leather-bound volumes on global corporate strategy, patent law, and tech innovation.', '📚');
      playSound('interact');
    } else if (obj.id === 'r3_trophies') {
      showModal('TROPHY & AWARD DISPLAY', 'Golden Industry Leader cups, Founder awards, and Tech Excellence plaques from 2020 to 2026.', '🏆');
      playSound('interact');
    } else if (obj.id === 'r3_plant_l' || obj.id === 'r3_plant_r') {
      showModal('EXECUTIVE PLANT', 'Lush office ficus in a polished mahogany planter.', '🪴');
      playSound('interact');
    } else if (obj.id === 'ceo_npc') {
      GS.activePrompt = 'CEO_PASSWORD';
      showModal('CEO CHIEF EXECUTIVE', '"Welcome, Intern! State the answer to the workstation riddle as the Security Password to unlock the Vault Locker:"', '👔');
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
      if (inputVal === sessionData.doorCode) {
        GS.door1Unlocked = true;
        closeModal();
        startTransition(ROOMS[0].doors[0]);
      } else {
        $modalError.textContent = 'INCORRECT CODE';
        $modalError.classList.remove('hidden');
        playSound('error');
      }
    } else if (GS.activePrompt === 'CEO_PASSWORD') {
      if (inputVal === sessionData.csQuestion.a.toUpperCase()) {
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
  // 13. UPDATE & COLLISION
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
    // Check decor doors
    if (room.decorDoors) {
      for (var d2 = 0; d2 < room.decorDoors.length; d2++) {
        var ddr = room.decorDoors[d2];
        var ddd = Math.sqrt(Math.pow(player.x - (ddr.x + ddr.w / 2), 2) + Math.pow(player.y - (ddr.y + ddr.h / 2), 2));
        if (ddd < INTERACT_RANGE && ddd < minD) { nearbyObj = ddr; minD = ddd; }
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
  // 14. RENDERING
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

    // Room Background & Decor
    var bgc = roomBgCache[GS.room];
    if (bgc) ctx.drawImage(bgc, Math.round(ox), Math.round(oy), ROOM_W * ps, ROOM_H * ps);

    // Objects: Solid sprites + faint pulsing border outline
    var room = ROOMS[GS.room];
    var borderAlpha = 0.35 + 0.25 * Math.sin(glowT);

    for (var i = 0; i < room.objects.length; i++) {
      var obj = room.objects[i];
      var gc = objGlowCache[obj.id];
      if (!gc) continue;

      var sx = Math.round(obj.x * ps + ox);
      var sy = Math.round(obj.y * ps + oy);
      var sw = obj.w * ps;
      var sh = obj.h * ps;

      // 1. Draw solid object sprite (no internal blur/opacity distortion)
      ctx.drawImage(gc, sx, sy, sw, sh);

      // 2. Draw faint outer glowing border outline around interactable boundary
      ctx.save();
      ctx.strokeStyle = P.goldGlow;
      ctx.lineWidth = Math.max(1, Math.floor(ps / 2));
      ctx.globalAlpha = (nearbyObj === obj) ? 0.95 : borderAlpha;
      ctx.strokeRect(sx - 1, sy - 1, sw + 2, sh + 2);
      ctx.restore();
    }

    // Draw Receptionist / Worker / CEO NPCs
    if (room.npc) {
      var npcSprite = (room.npc.id === 'receptionist_npc') ? recepSpriteCache[0] : workerSpriteCache[0];
      if (npcSprite) {
        ctx.drawImage(npcSprite, Math.round((room.npc.x - 4) * ps + ox), Math.round((room.npc.y - 12) * ps + oy), SPRITE_W * ps, SPRITE_H * ps);
      }
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
  // 15. MAIN LOOP & INIT
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
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    $timer = document.getElementById('timer');
    $roomLabel = document.getElementById('room-label');
    $keycardBadge = document.getElementById('keycard-badge');
    $actionBtn = document.getElementById('action-btn');
    $actionLabel = document.getElementById('action-label');
    $actionIcon = document.getElementById('action-icon');
    $joystick = document.getElementById('joystick');
    $joyKnob = document.getElementById('joystick-knob');
    $modalOverlay = document.getElementById('modal-overlay');
    $modalTitle = document.getElementById('modal-title');
    $modalText = document.getElementById('modal-text');
    $modalIcon = document.getElementById('modal-icon');
    $modalClose = document.getElementById('modal-close');
    $modalSubmit = document.getElementById('modal-submit');
    $modalInput = document.getElementById('modal-input');
    $modalInputContainer = document.getElementById('modal-input-container');
    $modalError = document.getElementById('modal-error');
    $startScreen = document.getElementById('start-screen');
    $startBtn = document.getElementById('start-btn');
    $endScreen = document.getElementById('end-screen');
    $endTitle = document.getElementById('end-title');
    $endTime = document.getElementById('end-time');
    $endDiscount = document.getElementById('end-discount-label');
    $endCode = document.getElementById('end-code');
    $endReplay = document.getElementById('end-replay-btn');
    $confetti = document.getElementById('confetti-canvas');
    cctx = $confetti.getContext('2d');
    $soundToggle = document.getElementById('sound-toggle');

    window.addEventListener('resize', resize);
    window.addEventListener('orientationchange', function () { setTimeout(resize, 150); });
    resize();

    initSessionRandomization();
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
