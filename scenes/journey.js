// Journey: a badminton player smashes a shuttle, it lands on a laptop as code, he sits in and types,
// and a robot (AI) walks out to meet him. Timeline on top: 2021 badminton -> 2024 python -> 2026 AI.
// Load after stick.js. Use as <stick-scene scene="journey" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, walkSeg, fig, inkFill, rr, ln, text, seg, breathe, pulse, lp, sparks, bubble, circle } = R;

  const BOTC = '#3d7bff', BOTD = '#2554b8', BOTF = '#a9c2f5';
  const HOME = -196, DESKX = -12;
  const DESK = { x0: -6, x1: 74, y: -50 };
  const KEYS = [6, 34];
  const RB0 = 236, RB1 = 112;
  const TL = { y: -183, xs: [-190, 8, 150], labels: ['2021 · badminton', '2024 · python', '2026 · AI engineer'] };

  function timeline(g, k) {
    ln(g, TL.xs[0], TL.y, TL.xs[2], TL.y, 1.6, '#d6d6d6');
    if (k > 0) {
      const x = TL.xs[0] + (TL.xs[2] - TL.xs[0]) * k;
      ln(g, TL.xs[0], TL.y, x, TL.y, 2.4, C.ink);
    }
    for (let i = 0; i < 3; i++) {
      const on = k >= i / 2 - 0.001;
      circle(g, TL.xs[i], TL.y, 4.5);
      inkFill(g, on ? C.butter : C.paper, 1.5);
      text(g, TL.labels[i], TL.xs[i], TL.y + 13, 8.5, on ? C.ink : C.muted);
    }
  }

  function desk(g, typing, t) {
    ln(g, DESK.x0 + 8, DESK.y + 4, DESK.x0 + 4, 0, 2.2);
    ln(g, DESK.x1 - 8, DESK.y + 4, DESK.x1 - 4, 0, 2.2);
    rr(g, DESK.x0, DESK.y, DESK.x1 - DESK.x0, 6, 2);
    inkFill(g, C.wood, 1.5);
    rr(g, KEYS[0], -55, KEYS[1] - KEYS[0], 5, 1.5);
    inkFill(g, '#e9e9e9', 1.3);
    g.save();
    g.translate(KEYS[1], -55);
    g.rotate(-1.86);
    rr(g, 0, -4, 36, 4, 1.5);
    inkFill(g, '#2b2b2b', 1.3);
    g.restore();
    rr(g, DESK.x1 - 18, -66, 11, 16, 2);
    inkFill(g, C.paper, 1.3);
    if (typing > 0) {
      for (let i = 0; i < 3; i++) {
        const k = (t * 2.2 + i / 3) % 1;
        g.save();
        g.globalAlpha *= typing * (1 - k);
        text(g, ['{', '}', 'py'][i], 14 + i * 9, -70 - k * 24, 9, BOTD);
        g.restore();
      }
    }
  }

  function racket(g, hand, ang, k) {
    if (k <= 0) {
      return;
    }
    g.save();
    g.globalAlpha *= k;
    g.translate(hand[0], hand[1]);
    g.rotate(ang);
    ln(g, 0, 0, 0, -16, 2.2, C.wood);
    g.beginPath();
    g.ellipse(0, -24, 6, 9, 0, 0, Math.PI * 2);
    g.fillStyle = 'rgba(255,255,255,0.7)';
    g.fill();
    g.lineWidth = 1.8;
    g.strokeStyle = C.ink;
    g.stroke();
    ln(g, -4, -24, 4, -24, 0.8, '#9a9a9a');
    ln(g, 0, -31, 0, -17, 0.8, '#9a9a9a');
    g.restore();
  }

  function shuttle(g, x, y, ang) {
    g.save();
    g.translate(x, y);
    g.rotate(ang);
    g.beginPath();
    g.moveTo(0, -1);
    g.lineTo(9, -5);
    g.lineTo(9, 5);
    g.lineTo(0, 1);
    g.closePath();
    g.fillStyle = '#fff';
    g.fill();
    g.lineWidth = 1.3;
    g.strokeStyle = C.ink;
    g.stroke();
    circle(g, -1, 0, 2.6);
    inkFill(g, C.butter, 1.2);
    g.restore();
  }

  SC['journey'] = {
    dur: 8.2,
    width: 480,
    label: 'A badminton player smashes a shuttle; it lands on a laptop as code, he walks over and types, and a robot standing for AI walks in to meet him while a timeline moves from 2021 badminton to 2024 Python to 2026 AI engineer.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const restP = P({ hF: [16, -76], hB: [-4, -52] });
      let x = HOME, gait = { ph: 0, amp: 0 };
      let pose = breathe(restP, t);
      let rk = 1, rAng = 0.35, shut = null, typing = 0, tlK = 0, glyph = 0;
      let rbx = RB0, rbg = { ph: 0, amp: 0 }, rbA = 0, rbHappy = 0;
      let rpose = breathe(P({ hF: [10, -58], hB: [-4, -52] }), t + 0.5);
      let sayK = 0, homeA = 0, walkerA = 1;
      if (T < 0) {
        pose = mix(pose, P({ hF: [18, -96], hB: [-4, -52], head: [6, -117] }), pulse(t, 5.8, 2.2, 1.6));
        rAng = 0.35 - 0.6 * pulse(t, 5.8, 2.2, 1.6);
      } else {
        const fade = 1 - seg(T, this.dur - 0.6, this.dur);
        // smash
        const wind = E.soft(seg(T, 0.15, 0.55)) * (1 - E.soft(seg(T, 0.6, 0.88)));
        const hit = E.soft(seg(T, 0.6, 0.88)) * (1 - E.soft(seg(T, 1.05, 1.4)));
        pose = mix(pose, P({ hF: [-4, -126], hB: [-3, -56], head: [4, -117], chest: [-2, -90] }), wind);
        pose = mix(pose, P({ hF: [34, -108], hB: [-3, -56], head: [10, -114], chest: [5, -88] }), hit);
        rAng = 0.35 - 1.5 * wind + 1.1 * hit;
        const fk = seg(T, 0.7, 1.9);
        if (fk > 0 && fk < 1) {
          const p = R.arcPt([HOME + 40, -122], [22, -64], 26, E.sm(fk));
          shut = { x: p[0], y: p[1], a: 0.4 + fk * 2.6 };
        }
        glyph = seg(T, 1.85, 2.1) * (1 - seg(T, 2.9, 3.1));
        // walk to the desk, put the racket down
        const ws = walkSeg(T, 2.0, 3.0, HOME, DESKX);
        x = ws.x;
        gait = ws;
        rk = 1 - seg(T, 2.1, 2.5);
        tlK = 0.5 * E.soft(seg(T, 2.0, 3.0)) + 0.5 * E.soft(seg(T, 4.6, 5.6));
        const typeP = (bob) => P({ hF: lp([KEYS[0] + 10, -56 + bob], x, 0, 1), hB: lp([KEYS[0] + 4, -56 - bob], x, 0, 1), head: [9, -114], chest: [4, -89] });
        const tk = E.soft(seg(T, 3.0, 3.3)) * (1 - E.soft(seg(T, 4.7, 5.0)));
        const bob = Math.sin(t * 22) * 2.2 * tk;
        pose = mix(pose, typeP(bob), tk);
        typing = tk;
        // the robot walks in
        rbA = seg(T, 4.0, 4.4);
        const rw = walkSeg(T, 4.2, 5.4, RB0, RB1);
        rbx = rw.x;
        rbg = rw;
        const cheer = E.back(seg(T, 5.6, 6.0)) * (1 - E.soft(seg(T, 6.8, 7.2)));
        pose = mix(pose, P({ hF: [14, -132], hB: [-10, -130], head: [3, -118] }), cheer);
        rpose = mix(rpose, P({ hF: [14, -132], hB: [-10, -130], head: [3, -118] }), cheer);
        rbHappy = seg(T, 5.6, 5.7) * (1 - seg(T, 7.0, 7.1));
        sayK = seg(T, 5.8, 6.0) * (1 - seg(T, 7.0, 7.2));
        // hand back to the start: the walker fades out, the player fades back in at home
        walkerA = fade;
        homeA = 1 - fade;
        rbA *= fade;
        tlK *= fade;
      }
      pose = legs(pose, gait.ph, gait.amp, { arms: false, stride: gait.stride });
      rpose = legs(rpose, rbg.ph, rbg.amp, { arms: false, stride: rbg.stride });

      timeline(g, tlK);
      desk(g, typing, t);
      // glyph where the shuttle landed
      if (glyph > 0) {
        g.save();
        g.globalAlpha *= glyph;
        text(g, '{ }', 22, -64 - glyph * 6, 11, BOTD);
        g.restore();
      }
      if (rbA > 0.02) {
        const blink = pulse(t, 4.2, 1.6, 0.15) > 0.5;
        fig(g, rpose, rbx, 0, { sx: -1, ink: BOTC, far: BOTF, alpha: rbA, bot: { col: BOTC, dark: BOTD, glow: 1, blink, happy: rbHappy > 0.5 } });
      }
      const J = walkerA > 0.02 ? fig(g, pose, x, 0, { wave: S.wave, wt: S.wt, alpha: walkerA }) : null;
      if (J && J.w && J.w.handF && rk > 0) {
        g.save();
        g.globalAlpha *= walkerA;
        racket(g, J.w.handF, rAng, rk);
        g.restore();
        R.frontArm(g, J);
      }
      if (homeA > 0 && walkerA > 0.02) {
        const H = fig(g, breathe(restP, t), HOME, 0, { alpha: homeA });
        if (H && H.w && H.w.handF) {
          g.save();
          g.globalAlpha *= homeA;
          racket(g, H.w.handF, 0.35, 1);
          g.restore();
        }
      }
      if (walkerA <= 0.02) {
        const H2 = fig(g, breathe(restP, t), HOME, 0, {});
        if (H2 && H2.w && H2.w.handF) {
          racket(g, H2.w.handF, 0.35, 1);
        }
      }
      if (shut) {
        shuttle(g, shut.x, shut.y, shut.a);
      }
      text(g, 'raj', T >= 0 && T > 2.0 && walkerA > 0.5 ? x : HOME, 16, 9, C.muted);
      if (rbA > 0.3) {
        text(g, 'AI', rbx, 16, 9, BOTD);
      }
      bubble(g, 40, -136, 'AI engineer!', sayK, { tail: -26, size: 8.5 });
      sparks(g, HOME + 40, -126, T >= 0 ? seg(T, 0.66, 1.1) : 0, 12, 6);
    },
  };
})();
