// Vault: you ask a question, the agent finds the exact line in your document, checks the quote and stamps it verified
// (every second play: the evidence isn't there, so it refuses instead of guessing).
// Load after stick.js. Use as <stick-scene scene="vault-rag" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, walkSeg, fig, inkFill, rr, ln, text, seg, breathe, pulse, lp, sparks, bubble, words, circle } = R;

  const BOTC = '#3d7bff', BOTD = '#2554b8', BOTF = '#a9c2f5';
  const OK = '#dafbe1', OK_INK = '#1a7f37', NO = '#ffebe9', NO_INK = '#cf222e';
  const B = { x: -62, y: -150, w: 124, h: 100 };
  const LY = (i) => B.y + 32 + i * 12;
  const HIT = 2;
  const STAMP = [B.x + B.w / 2 - 6, B.y + B.h - 19];
  const HOME = -170;
  const BOT = 158, NEAR = 88;

  function board(g, hiK, stampK, refuse, fadeK) {
    ln(g, B.x + 22, B.y + B.h, B.x + 10, 0, 2.2);
    ln(g, B.x + B.w - 22, B.y + B.h, B.x + B.w - 10, 0, 2.2);
    rr(g, B.x, B.y, B.w, B.h, 6);
    inkFill(g, C.paper, 1.7);
    ln(g, B.x, B.y + 17, B.x + B.w, B.y + 17, 1.3);
    text(g, 'lease.pdf', B.x + 10, B.y + 12, 8.5, C.ink, 'left');
    text(g, 'p.4', B.x + B.w - 10, B.y + 12, 8.5, C.muted, 'right');
    for (let i = 0; i < 4; i++) {
      const y = LY(i);
      if (i === HIT && hiK > 0) {
        rr(g, B.x + 5, y - 5, (B.w - 10) * E.out3(hiK), 10, 2);
        g.fillStyle = C.butter;
        g.fill();
      }
      words(g, B.x + 12 + (i % 2) * 6, y, 84 + ((i * 29) % 18), i * 7 + 3, i === HIT && hiK > 0.5 ? '#9a7a12' : '#cfcfcf', 2);
    }
    if (stampK > 0) {
      const z = 1 + (1 - E.out3(stampK)) * 0.9;
      g.save();
      g.translate(STAMP[0], STAMP[1]);
      g.rotate(-0.16);
      g.scale(z, z);
      g.globalAlpha *= seg(stampK, 0, 0.3) * fadeK;
      const w = refuse ? 84 : 70;
      rr(g, -w / 2, -11, w, 22, 5);
      inkFill(g, refuse ? 'rgba(255,235,233,0.95)' : 'rgba(218,251,225,0.95)', 1.8, refuse ? NO_INK : OK_INK);
      text(g, refuse ? 'no evidence' : 'verified', 0, 4, 10.5, refuse ? NO_INK : OK_INK);
      g.restore();
    }
  }

  function lens(g, hx, hy, k) {
    if (k <= 0) {
      return;
    }
    g.save();
    g.globalAlpha *= Math.min(1, k * 3);
    const cx = hx - 9, cy = hy - 9;
    ln(g, hx, hy, cx + 5, cy + 5, 3, C.wood);
    circle(g, cx, cy, 8);
    inkFill(g, 'rgba(230,240,255,0.55)', 1.8);
    g.restore();
  }

  SC['vault-rag'] = {
    dur: 7.4,
    width: 410,
    label: 'A person asks a question about a document, a robot agent finds the exact line, checks the quote and stamps it verified; on the next play the answer is not in the document, so the agent stamps no evidence instead of guessing.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const refuse = S.n % 2 === 1;
      let x = HOME, gait = { ph: 0, amp: 0 };
      let pose = breathe(P({ hF: [12, -60], hB: [-4, -52] }), t);
      let bx = BOT, bgait = { ph: 0, amp: 0 };
      const botRest = P({ hF: [10, -58], hB: [-4, -52] });
      let bpose = breathe(botRest, t + 1.3);
      let fadeK = 1, askK = 0, hmmK = 0, ansK = 0, hiK = 0, stampK = 0, lensK = 0, glow = 0, happy = 0;
      const chin = P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] });
      if (T < 0) {
        pose = mix(pose, chin, pulse(t, 6, 2, 2.2));
        bpose = mix(bpose, P({ hF: [10, -58], hB: [-4, -52], head: [3, -119] }), pulse(t, 5.2, 3.4, 1.2));
      } else {
        const fade = 1 - seg(T, this.dur - 0.45, this.dur);
        fadeK = fade;
        // you: ask, wait, react
        const ask = E.soft(seg(T, 0.1, 0.4)) * (1 - E.soft(seg(T, 1.3, 1.6)));
        const wait = E.soft(seg(T, 1.5, 1.8)) * (1 - E.soft(seg(T, 4.5, 4.8)));
        const react = refuse
          ? E.soft(seg(T, 4.7, 5.0)) * (1 - E.soft(seg(T, 5.9, 6.3)))
          : E.back(seg(T, 4.7, 5.1)) * (1 - E.soft(seg(T, 5.6, 5.95)));
        pose = mix(pose, P({ hF: [34, -104], hB: [-4, -54], head: [9, -116] }), ask);
        pose = mix(pose, chin, wait);
        pose = mix(pose, refuse ? P({ hF: [22, -86], hB: [-2, -64], head: [6, -116] }) : P({ hF: [14, -132], hB: [-10, -130], head: [3, -118] }), react);
        askK = seg(T, 0.25, 0.45) * (1 - seg(T, 1.45, 1.65));

        // agent: think, walk to the page, search with the lens, answer, walk back
        hmmK = seg(T, 1.5, 1.7) * (1 - seg(T, 2.15, 2.3));
        const think = E.soft(seg(T, 1.45, 1.7)) * (1 - E.soft(seg(T, 2.05, 2.3)));
        bpose = mix(bpose, P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] }), think);
        const w1 = walkSeg(T, 2.3, 2.9, BOT, NEAR);
        const w2 = walkSeg(T, 5.7, 6.35, NEAR, BOT);
        const ws = T < 5.7 ? w1 : w2;
        bx = ws.x;
        bgait = ws.dir * -1 < 0 ? { ph: -ws.ph, amp: ws.amp, stride: ws.stride } : ws;
        const scanY = refuse ? LY(0) + (LY(3) - LY(0)) * E.soft(seg(T, 3.15, 4.15)) : LY(HIT);
        const reach = E.soft(seg(T, 2.85, 3.15)) * (1 - E.soft(seg(T, 4.35, 4.65)));
        const aim = lp([B.x + B.w - 16 + 9, scanY + 9], bx, 0, -1);
        bpose = mix(bpose, P({ hF: aim, hB: [-4, -54], head: [9, -114], chest: [3, -90] }), reach);
        lensK = reach;
        hiK = refuse ? 0 : seg(T, 3.4, 3.9) * fade;
        stampK = seg(T, 4.05, 4.2);
        ansK = seg(T, 4.5, 4.7) * (1 - seg(T, 5.55, 5.75));
        glow = E.soft(seg(T, 1.5, 1.7)) * (1 - E.soft(seg(T, 5.5, 5.9)));
        happy = refuse ? 0 : seg(T, 4.4, 4.5) * (1 - seg(T, 5.6, 5.7));
      }
      pose = legs(pose, gait.ph, gait.amp, { arms: false, stride: gait.stride });
      bpose = legs(bpose, bgait.ph, bgait.amp, { arms: false, stride: bgait.stride });

      board(g, hiK, stampK, refuse, fadeK);
      const blink = pulse(t, 4.3, 1.2, 0.15) > 0.5;
      const J = fig(g, bpose, bx, 0, { sx: -1, ink: BOTC, far: BOTF, bot: { col: BOTC, dark: BOTD, glow, blink, happy: happy > 0.5 } });
      if (J && J.w && J.w.handF) {
        lens(g, J.w.handF[0], J.w.handF[1], lensK);
        R.frontArm(g, J);
      }
      fig(g, pose, x, 0, { wave: S.wave, wt: S.wt });
      text(g, 'you', HOME, 16, 9, C.muted);
      text(g, 'vault', bx, 16, 9, BOTD);

      bubble(g, HOME + 14, -134, refuse ? 'refund policy?' : 'notice period?', askK, { tail: -8, size: 8.5 });
      bubble(g, BOT - 8, -134, 'hmm…', hmmK, { tail: 4, size: 8.5 });
      bubble(g, NEAR + 46, -134, refuse ? 'not in your docs' : '30 days · p.4', ansK, { tail: -40, size: 8.5 });
      sparks(g, STAMP[0], STAMP[1] - 12, refuse ? 0 : seg(T, 4.15, 4.75), 16, 6, OK_INK);
    },
  };
})();
