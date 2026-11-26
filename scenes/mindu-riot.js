// MINDU RIOT: a live stream rolls out as a film strip, the hype meter spikes on one moment, the agent snips it,
// it becomes a vertical clip and goes out to Shorts, Reels and Facebook Reels, and the views roll in.
// Load after stick.js. Use as <stick-scene scene="mindu-riot" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, fig, inkFill, rr, ln, text, seg, breathe, pulse, lp, sparks, bubble, circle, pill, floatText, hash } = R;

  const OR = '#ff6a00', ORD = '#b34a00', ORF = '#ffc08f', NEON = '#e8ff2a', LIVE = '#e5484d';
  const TV = { x: -206, y: -150, w: 92, h: 62 };
  const STRIP = { x0: -112, x1: 46, y: -64, h: 18 };
  const FW = 16, GAP = 22;
  const HOT_AT = 20;
  const BOT = 74;
  const OUT = [
    { label: 'shorts', y: -146 },
    { label: 'reels', y: -116 },
    { label: 'fb reels', y: -86 },
  ];
  const OX = 168;

  function tv(g, t, on) {
    ln(g, TV.x + 26, TV.y + TV.h, TV.x + 18, 0, 2.2);
    ln(g, TV.x + TV.w - 26, TV.y + TV.h, TV.x + TV.w - 18, 0, 2.2);
    rr(g, TV.x, TV.y, TV.w, TV.h, 6);
    inkFill(g, '#1c1c1c', 1.8);
    rr(g, TV.x + 6, TV.y + 6, 26, 12, 3);
    g.fillStyle = on && Math.floor(t * 2) % 2 ? '#a3282c' : LIVE;
    g.fill();
    text(g, 'LIVE', TV.x + 19, TV.y + 15, 7.5, '#fff');
    for (let i = 0; i < 3; i++) {
      const w = 30 + ((i * 17 + Math.floor(t * 3)) % 5) * 7;
      ln(g, TV.x + 10, TV.y + 30 + i * 9, TV.x + 10 + w, TV.y + 30 + i * 9, 2.2, i === 1 ? '#5b5b5b' : '#3d3d3d');
    }
    circle(g, TV.x + TV.w - 16, TV.y + 40, 9);
    inkFill(g, OR, 1.4);
  }

  function frame(g, x, hot, hype) {
    rr(g, x - FW / 2, STRIP.y + 3, FW, STRIP.h - 6, 2);
    inkFill(g, hot ? NEON : '#f3eee6', 1.2);
    const h = 6 + hype * 26;
    rr(g, x - 3, STRIP.y - 6 - h, 6, h, 2);
    g.fillStyle = hot ? OR : '#d9cfc2';
    g.fill();
  }

  function strip(g, scroll, hotK, liftK) {
    ln(g, STRIP.x0 + 10, STRIP.y + STRIP.h, STRIP.x0 + 6, 0, 2);
    ln(g, STRIP.x1 - 10, STRIP.y + STRIP.h, STRIP.x1 - 6, 0, 2);
    rr(g, STRIP.x0, STRIP.y, STRIP.x1 - STRIP.x0, STRIP.h, 3);
    inkFill(g, '#2b2b2b', 1.6);
    for (let x = STRIP.x0 + 6; x < STRIP.x1 - 4; x += 8) {
      ln(g, x, STRIP.y + 1.5, x + 3, STRIP.y + 1.5, 1.4, '#777');
      ln(g, x, STRIP.y + STRIP.h - 1.5, x + 3, STRIP.y + STRIP.h - 1.5, 1.4, '#777');
    }
    g.save();
    g.beginPath();
    g.rect(STRIP.x0 + 2, STRIP.y - 40, STRIP.x1 - STRIP.x0 - 4, 60);
    g.clip();
    for (let i = -2; i < 12; i++) {
      const x = HOT_AT - 5 * GAP + i * GAP + scroll;
      if (x < STRIP.x0 - 10 || x > STRIP.x1 + 10) {
        continue;
      }
      const isHot = i === 5;
      if (isHot && liftK > 0) {
        continue;
      }
      const hype = isHot ? 0.25 + 0.75 * hotK : 0.1 + 0.25 * hash(i * 5.3);
      frame(g, x, isHot && hotK > 0.5, hype);
    }
    g.restore();
  }

  function phone(g, x, y, k, rot, scale) {
    if (k <= 0) {
      return;
    }
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.scale(scale, scale);
    g.globalAlpha *= Math.min(1, k * 3);
    rr(g, -11, -19, 22, 38, 4);
    inkFill(g, '#1c1c1c', 1.5);
    rr(g, -8, -15, 16, 26, 2);
    g.fillStyle = NEON;
    g.fill();
    rr(g, -6, -2, 12, 5, 1.5);
    g.fillStyle = '#fff';
    g.fill();
    g.restore();
  }

  function scissors(g, hx, hy, open, k) {
    if (k <= 0) {
      return;
    }
    g.save();
    g.globalAlpha *= Math.min(1, k * 3);
    g.translate(hx, hy);
    const a = 0.12 + open * 0.42;
    for (const s of [-1, 1]) {
      g.save();
      g.rotate(Math.PI + s * a);
      ln(g, 0, 0, 24, 0, 2.6, C.ink);
      g.restore();
      g.save();
      g.rotate(s * a * 0.6);
      circle(g, 7, s * 4, 3.6);
      inkFill(g, OR, 1.3);
      g.restore();
    }
    g.restore();
  }

  SC['mindu-riot'] = {
    dur: 7.4,
    width: 430,
    label: 'A live stream rolls out as a film strip, a hype meter spikes on one moment, a robot agent snips it out, it turns into a vertical clip and goes out to Shorts, Reels and Facebook Reels, and the views roll in.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let bpose = breathe(P({ hF: [10, -58], hB: [-4, -52] }), t + 0.9);
      let scroll = 0, hotK = 0, liftK = 0, morphK = 0, sciK = 0, openK = 1, glow = 0, happy = 0, wowK = 0, fade = 1;
      const fly = [0, 0, 0], land = [0, 0, 0], views = [0, 0, 0];
      if (T < 0) {
        scroll = (t * 6) % GAP;
        bpose = mix(bpose, P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] }), pulse(t, 6, 2.2, 2));
      } else {
        fade = 1 - seg(T, this.dur - 0.45, this.dur);
        scroll = 110 * E.soft(seg(T, 0, 1.9)) - 110;
        hotK = E.back(seg(T, 1.6, 2.0)) * (1 - seg(T, this.dur - 0.45, this.dur));
        wowK = seg(T, 1.85, 2.05) * (1 - seg(T, 2.6, 2.8));
        glow = E.soft(seg(T, 1.9, 2.2)) * (1 - E.soft(seg(T, 6.2, 6.6)));
        const look = E.soft(seg(T, 1.9, 2.2)) * (1 - E.soft(seg(T, 2.3, 2.5)));
        bpose = mix(bpose, P({ hF: [10, -96], head: [9, -113], hB: [-4, -54] }), look);
        const reach = E.soft(seg(T, 2.4, 2.75)) * (1 - E.soft(seg(T, 3.3, 3.6)));
        bpose = mix(bpose, P({ hF: lp([HOT_AT + 14, STRIP.y + 4], BOT, 0, -1), hB: [-4, -54], head: [9, -113], chest: [4, -89] }), reach);
        sciK = reach;
        openK = 1 - E.in(seg(T, 2.85, 3.0)) + E.soft(seg(T, 3.0, 3.3));
        liftK = seg(T, 3.0, 3.1) * fade;
        morphK = seg(T, 3.05, 3.7);
        for (let i = 0; i < 3; i++) {
          fly[i] = seg(T, 3.8 + i * 0.25, 4.4 + i * 0.25);
          land[i] = seg(T, 4.35 + i * 0.25, 4.6 + i * 0.25) * fade;
          views[i] = seg(T, 4.6 + i * 0.25, 5.6 + i * 0.25);
        }
        const cheer = E.back(seg(T, 4.9, 5.3)) * (1 - E.soft(seg(T, 5.9, 6.3)));
        bpose = mix(bpose, P({ hF: [14, -132], hB: [-10, -130], head: [3, -118] }), cheer);
        happy = seg(T, 4.9, 5.0) * (1 - seg(T, 6.2, 6.3));
      }
      bpose = legs(bpose, 0, 0, { arms: false });

      tv(g, t, T >= 0);
      strip(g, scroll, hotK, liftK);
      for (let i = 0; i < 3; i++) {
        g.save();
        g.globalAlpha *= 0.35 + 0.65 * land[i];
        pill(g, OX, OUT[i].y, OUT[i].label, land[i] > 0.5 ? NEON : '#fff', C.ink, 8.5);
        g.restore();
      }
      const blink = pulse(t, 4.6, 1.4, 0.15) > 0.5;
      const J = fig(g, bpose, BOT, 0, { sx: -1, ink: OR, far: ORF, bot: { col: OR, dark: ORD, glow, blink, happy: happy > 0.5 } });
      if (J && J.w && J.w.handF) {
        scissors(g, J.w.handF[0], J.w.handF[1], Math.max(0, Math.min(1, openK)), sciK);
        R.frontArm(g, J);
      }
      if (liftK > 0 && morphK < 1) {
        const p = R.arcPt([HOT_AT, STRIP.y + STRIP.h / 2], [30, -134], 20, E.soft(morphK));
        g.save();
        g.globalAlpha *= fade;
        if (morphK < 0.5) {
          rr(g, p[0] - FW / 2, p[1] - 6, FW, 12, 2);
          inkFill(g, NEON, 1.3);
        } else {
          phone(g, p[0], p[1], 1, 0, 0.6 + 0.4 * seg(morphK, 0.5, 1));
        }
        g.restore();
      }
      if (morphK >= 1 && fly[0] <= 0) {
        phone(g, 30, -134, fade, 0, 1);
      }
      for (let i = 0; i < 3; i++) {
        if (fly[i] > 0 && fly[i] < 1) {
          const p = R.arcPt([30, -134], [OX - 40, OUT[i].y], 34, E.soft(fly[i]));
          phone(g, p[0], p[1], 1, 0.4 * Math.sin(fly[i] * Math.PI), 0.75);
        }
        if (land[i] > 0) {
          phone(g, OX - 40, OUT[i].y, land[i], 0, 0.62);
        }
        if (views[i] > 0 && views[i] < 1) {
          floatText(g, '+views', OX + 36, OUT[i].y - 2, views[i], ORD);
        }
      }
      text(g, 'live stream', TV.x + TV.w / 2, 16, 9, C.muted);
      text(g, 'mindu riot', BOT, 16, 9, ORD);
      bubble(g, -44, -128, 'wild moment!', wowK, { tail: 34, size: 8.5 });
      sparks(g, HOT_AT, STRIP.y - 20, T >= 0 ? seg(T, 1.7, 2.3) : 0, 14, 6, OR);
    },
  };
})();
