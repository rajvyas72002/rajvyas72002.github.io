// RCA System: a server rack floods the desk with alerts, the agent sorts them into one incident plus noise, and points at the server that caused it.
// Load after stick.js. Use as <stick-scene scene="rca-incident" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, walkSeg, fig, inkFill, rr, ln, text, seg, breathe, pulse, lp, sparks, bubble, circle, pill, arrow, hash } = R;

  const BOTC = '#3d7bff', BOTD = '#2554b8', BOTF = '#a9c2f5';
  const RED = '#ff5f6d', RED_INK = '#b4232f', GREEN = '#22c55e';
  const RACK = { x: -196, y: -150, w: 62, uh: 40 };
  const UNITS = ['api', 'db', 'cache'];
  const UY = (i) => RACK.y + 8 + i * (RACK.uh + 6);
  const BAD = 1;
  const DESK = { x0: -46, x1: 54, y: -50 };
  const BOT = 176, NEAR = 82;
  const N = 7;
  const SRC = [1, 1, 0, 1, 1, 2, 1];
  const PILE = Array.from({ length: N }, (_, i) => [DESK.x0 + 26 + (hash(i * 3.1) - 0.5) * 34, DESK.y - 6 - i * 5.2, (hash(i * 7.7) - 0.5) * 0.7]);
  const STACK_A = [DESK.x0 + 26, DESK.y - 6];
  const STACK_B = [DESK.x1 - 20, DESK.y - 6];
  const noise = (i) => i === 5;

  function rack(g, badK, ringK, t) {
    rr(g, RACK.x, RACK.y, RACK.w, RACK.y * -1, 5);
    inkFill(g, '#f3eee6', 1.7);
    for (let i = 0; i < 3; i++) {
      const y = UY(i);
      rr(g, RACK.x + 6, y, RACK.w - 12, RACK.uh, 4);
      inkFill(g, C.paper, 1.5);
      text(g, UNITS[i], RACK.x + 14, y + 15, 8.5, C.ink, 'left');
      ln(g, RACK.x + 14, y + 25, RACK.x + 36, y + 25, 1.6, '#cfcfcf');
      ln(g, RACK.x + 14, y + 31, RACK.x + 30, y + 31, 1.6, '#cfcfcf');
      const bad = i === BAD && badK > 0;
      circle(g, RACK.x + RACK.w - 14, y + 12, 3.4);
      g.fillStyle = bad && Math.floor(t * 4) % 2 === 0 ? RED : GREEN;
      g.fill();
      g.lineWidth = 1.2;
      g.strokeStyle = C.ink;
      g.stroke();
    }
    if (badK > 0) {
      for (let j = 0; j < 3; j++) {
        const k = (t * 0.6 + j / 3) % 1;
        g.save();
        g.globalAlpha *= badK * (1 - k) * 0.7;
        circle(g, RACK.x + RACK.w - 6 + k * 14, UY(BAD) + 4 - k * 26, 4 + k * 5);
        g.fillStyle = '#bdbdbd';
        g.fill();
        g.restore();
      }
    }
    if (ringK > 0) {
      g.save();
      g.globalAlpha *= Math.min(1, ringK * 2);
      rr(g, RACK.x + 1, UY(BAD) - 5, RACK.w - 2, RACK.uh + 10, 6);
      g.lineWidth = 3;
      g.strokeStyle = C.amber || '#e0a100';
      g.stroke();
      g.restore();
    }
  }

  function desk(g) {
    ln(g, DESK.x0 + 10, DESK.y + 4, DESK.x0 + 6, 0, 2.2);
    ln(g, DESK.x1 - 10, DESK.y + 4, DESK.x1 - 6, 0, 2.2);
    rr(g, DESK.x0, DESK.y, DESK.x1 - DESK.x0, 6, 2);
    inkFill(g, C.wood, 1.5);
  }

  function card(g, x, y, rot, k, dim) {
    g.save();
    g.translate(x, y);
    g.rotate(rot);
    g.globalAlpha *= k * (dim ? 0.55 : 1);
    rr(g, -12, -6, 24, 12, 2.5);
    inkFill(g, dim ? '#f1f1f1' : '#ffebe9', 1.3, dim ? '#9a9a9a' : RED_INK);
    text(g, '!', -6, 4, 9, dim ? '#9a9a9a' : RED_INK);
    ln(g, -1, 0, 8, 0, 1.6, dim ? '#c8c8c8' : '#e7a3a3');
    g.restore();
  }

  SC['rca-incident'] = {
    dur: 7.6,
    width: 420,
    label: 'A server rack floods a desk with alerts; a robot agent sorts them into one incident and one bit of noise, then points at the database server as the likely root cause.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      let bx = BOT, bgait = { ph: 0, amp: 0 };
      let bpose = breathe(P({ hF: [10, -58], hB: [-4, -52] }), t + 0.4);
      let badK = 0, ringK = 0, glow = 0, happy = 0, hmmK = 0, sayK = 0, pillK = 0, arrowK = 0, fade = 1, sortK = 0;
      const flyK = new Array(N).fill(0);
      if (T < 0) {
        bpose = mix(bpose, P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] }), pulse(t, 6.2, 2.4, 2));
      } else {
        fade = 1 - seg(T, this.dur - 0.45, this.dur);
        badK = E.soft(seg(T, 0.05, 0.3)) * (1 - E.soft(seg(T, 6.6, 7.0)));
        for (let i = 0; i < N; i++) {
          flyK[i] = seg(T, 0.25 + i * 0.2, 0.75 + i * 0.2);
        }
        glow = E.soft(seg(T, 1.6, 1.9)) * (1 - E.soft(seg(T, 6.2, 6.6)));
        hmmK = seg(T, 1.75, 1.95) * (1 - seg(T, 2.35, 2.5));
        const think = E.soft(seg(T, 1.7, 1.95)) * (1 - E.soft(seg(T, 2.25, 2.5)));
        bpose = mix(bpose, P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] }), think);
        const w1 = walkSeg(T, 2.45, 3.05, BOT, NEAR);
        const w2 = walkSeg(T, 6.25, 6.9, NEAR, BOT);
        const ws = T < 6.25 ? w1 : w2;
        bx = ws.x;
        bgait = ws.dir * -1 < 0 ? { ph: -ws.ph, amp: ws.amp, stride: ws.stride } : ws;
        const sweep = E.soft(seg(T, 3.0, 3.3)) * (1 - E.soft(seg(T, 4.0, 4.3)));
        const swing = Math.sin(seg(T, 3.25, 4.0) * Math.PI * 2) * 5;
        bpose = mix(bpose, P({ hF: lp([DESK.x1 - 4 + swing, DESK.y - 14], bx, 0, -1), hB: [-4, -54], head: [9, -113], chest: [4, -89] }), sweep);
        sortK = E.soft(seg(T, 3.3, 4.0));
        pillK = seg(T, 4.0, 4.3) * fade;
        const point = E.soft(seg(T, 4.35, 4.65)) * (1 - E.soft(seg(T, 5.8, 6.1)));
        bpose = mix(bpose, P({ hF: [40, -102], hB: [-4, -54], head: [10, -116] }), point);
        arrowK = seg(T, 4.55, 5.05) * fade;
        ringK = seg(T, 4.95, 5.15) * fade;
        sayK = seg(T, 5.15, 5.35) * (1 - seg(T, 6.15, 6.35));
        happy = seg(T, 5.1, 5.2) * (1 - seg(T, 6.2, 6.3));
      }
      bpose = legs(bpose, bgait.ph, bgait.amp, { arms: false, stride: bgait.stride });

      rack(g, badK, ringK, t);
      desk(g);
      let a = 0, b = 0;
      for (let i = 0; i < N; i++) {
        if (flyK[i] <= 0) {
          continue;
        }
        const from = [RACK.x + RACK.w - 4, UY(SRC[i]) + 14];
        const pile = PILE[i];
        let p = flyK[i] < 1 ? R.arcPt(from, pile, 60, E.soft(flyK[i])) : pile;
        let rot = pile[2];
        if (sortK > 0) {
          const dst = noise(i) ? [STACK_B[0], STACK_B[1] - b * 5] : [STACK_A[0], STACK_A[1] - a * 5];
          p = [p[0] + (dst[0] - p[0]) * sortK, p[1] + (dst[1] - p[1]) * sortK];
          rot = rot * (1 - sortK);
        }
        if (noise(i)) {
          b++;
        } else {
          a++;
        }
        card(g, p[0], p[1], rot, Math.min(1, flyK[i] * 4) * fade, noise(i) && sortK > 0.5);
      }
      if (pillK > 0) {
        g.save();
        g.globalAlpha *= Math.min(1, pillK * 2);
        pill(g, STACK_A[0], DESK.y - 52, '1 incident', '#ffebe9', RED_INK, 8.5);
        pill(g, STACK_B[0], DESK.y - 26, 'noise', '#f1f1f1', '#6b6b6b', 8.5);
        g.restore();
      }
      if (arrowK > 0) {
        arrow(g, [[STACK_A[0] - 36, DESK.y - 52], [-96, UY(BAD) - 2], [RACK.x + RACK.w + 8, UY(BAD) + 14]], { k: E.soft(arrowK), col: C.ink, lw: 2 });
      }
      const blink = pulse(t, 4.4, 2.1, 0.15) > 0.5;
      fig(g, bpose, bx, 0, { sx: -1, ink: BOTC, far: BOTF, bot: { col: BOTC, dark: BOTD, glow, blink, happy: happy > 0.5 } });
      if (ringK > 0) {
        g.save();
        g.globalAlpha *= Math.min(1, ringK * 2);
        pill(g, RACK.x + RACK.w / 2 + 6, RACK.y - 12 + 4, 'root cause', C.butter, C.ink, 8.5);
        g.restore();
      }
      text(g, 'servers', RACK.x + RACK.w / 2, 16, 9, C.muted);
      text(g, 'rca agent', bx, 16, 9, BOTD);
      bubble(g, BOT - 10, -136, 'hmm…', hmmK, { tail: 6, size: 8.5 });
      bubble(g, NEAR + 28, -160, "it's the db", sayK, { tail: -22, size: 8.5 });
      sparks(g, RACK.x + RACK.w / 2, UY(BAD) + 20, T >= 0 ? seg(T, 4.95, 5.5) : 0, 18, 7, C.amber || '#e0a100');
    },
  };
})();
