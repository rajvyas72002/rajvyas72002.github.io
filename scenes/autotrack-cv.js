// AutoTrack AI: cars roll under a camera, each gets a tracked box and an ID, its plate is read and logged, and the agent sends the report.
// Load after stick.js. Use as <stick-scene scene="autotrack-cv" play="view"></stick-scene>.
(function () {
  const SC = (window.SCENES = window.SCENES || {});
  const R = window.RIG;
  const { C, E, P, mix, legs, fig, inkFill, rr, ln, text, seg, breathe, pulse, lp, sparks, bubble, circle, tickBadge } = R;

  const BOTC = '#3d7bff', BOTD = '#2554b8', BOTF = '#a9c2f5';
  const BOX = '#16a34a', CAR1 = '#ff5f6d', CAR2 = '#ffe600';
  const CAM = [-160, -152];
  const X0 = -128, X1 = 52;
  const B = { x: 68, y: -150, w: 98, h: 96 };
  const RY = (i) => B.y + 38 + i * 16;
  const BOT = 177;
  const CARS = [
    { a: 0.15, b: 2.55, col: CAR1, id: '#7', plate: 'RJ19 4821' },
    { a: 2.25, b: 4.65, col: CAR2, id: '#8', plate: 'RJ22 0317' },
  ];

  function camera(g, rec, cone) {
    ln(g, CAM[0], 0, CAM[0], CAM[1] + 8, 2.4);
    ln(g, CAM[0], CAM[1] + 8, CAM[0] + 12, CAM[1] + 8, 2.2);
    if (cone > 0) {
      g.save();
      g.globalAlpha *= 0.18 * cone;
      g.beginPath();
      g.moveTo(CAM[0] + 30, CAM[1] + 14);
      g.lineTo(-96, 0);
      g.lineTo(-6, 0);
      g.closePath();
      g.fillStyle = C.butter;
      g.fill();
      g.restore();
    }
    g.save();
    g.translate(CAM[0] + 18, CAM[1] + 8);
    g.rotate(0.42);
    rr(g, -12, -8, 30, 15, 3);
    inkFill(g, C.paper, 1.7);
    rr(g, 18, -5, 6, 9, 1.5);
    inkFill(g, '#2b2b2b', 1.3);
    circle(g, -5, -1, 2.2);
    g.fillStyle = rec ? '#e5484d' : '#d6d6d6';
    g.fill();
    g.restore();
  }

  function car(g, x, col, boxK, plateK, id) {
    ln(g, x - 22, 0, x + 22, 0, 0.1);
    rr(g, x - 30, -24, 60, 15, 5);
    inkFill(g, col, 1.6);
    rr(g, x - 17, -36, 30, 13, 5);
    inkFill(g, C.paper, 1.5);
    ln(g, x - 2, -36, x - 2, -24, 1.3);
    for (const wx of [x - 17, x + 17]) {
      circle(g, wx, -7, 6.5);
      inkFill(g, '#2b2b2b', 1.4);
      circle(g, wx, -7, 2.2);
      g.fillStyle = '#d6d6d6';
      g.fill();
    }
    rr(g, x + 21, -20, 10, 6, 1);
    inkFill(g, plateK > 0 ? C.butter : C.paper, 1.1);
    if (boxK > 0) {
      g.save();
      g.globalAlpha *= Math.min(1, boxK * 2);
      const s = 1 + (1 - E.out3(boxK)) * 0.35;
      g.translate(x, -20);
      g.scale(s, s);
      g.setLineDash([5, 4]);
      rr(g, -38, -24, 76, 44, 4);
      g.lineWidth = 2;
      g.strokeStyle = BOX;
      g.stroke();
      g.setLineDash([]);
      rr(g, -38, -38, 34, 14, 3);
      g.fillStyle = BOX;
      g.fill();
      text(g, 'car ' + id, -21, -28, 8.5, '#fff');
      g.restore();
    }
  }

  function board(g, rows, doneK, fade) {
    ln(g, B.x + 20, B.y + B.h, B.x + 10, 0, 2.2);
    ln(g, B.x + B.w - 20, B.y + B.h, B.x + B.w - 10, 0, 2.2);
    rr(g, B.x, B.y, B.w, B.h, 6);
    inkFill(g, C.paper, 1.7);
    ln(g, B.x, B.y + 17, B.x + B.w, B.y + 17, 1.3);
    text(g, 'tracks.log', B.x + 9, B.y + 12, 8.5, C.ink, 'left');
    for (let i = 0; i < 2; i++) {
      const k = rows[i] * fade;
      if (k <= 0) {
        continue;
      }
      g.save();
      g.globalAlpha *= Math.min(1, k * 2);
      rr(g, B.x + 6, RY(i) - 6, B.w - 12, 12, 2);
      g.fillStyle = '#eef4ff';
      g.fill();
      text(g, CARS[i].id, B.x + 11, RY(i) + 3, 8, BOTD, 'left');
      text(g, CARS[i].plate, B.x + 27, RY(i) + 3, 8, C.ink, 'left');
      g.restore();
    }
    tickBadge(g, B.x + B.w - 10, B.y + 9, doneK * fade, 7);
  }

  SC['autotrack-cv'] = {
    dur: 7.2,
    width: 452,
    label: 'Two cars drive under a camera; each gets a tracking box with its own ID, its number plate is read and written to a log, and a robot agent sends the report.',
    draw(g, S) {
      const T = S.on ? S.u * this.dur : -1;
      const t = S.t;
      const rest = P({ hF: [10, -58], hB: [-4, -52] });
      let bpose = breathe(rest, t + 0.7);
      let glow = 0, happy = 0, cone = 0, doneK = 0, fade = 1, sayK = 0;
      const rows = [0, 0];
      const carsNow = [];
      const chips = [];
      if (T < 0) {
        bpose = mix(bpose, P({ hF: [10, -96], head: [7, -116], hB: [-4, -54] }), pulse(t, 6, 2.5, 2));
      } else {
        fade = 1 - seg(T, this.dur - 0.45, this.dur);
        cone = E.soft(seg(T, 0.1, 0.4)) * (1 - E.soft(seg(T, 4.6, 5.0)));
        glow = E.soft(seg(T, 0.6, 0.9)) * (1 - E.soft(seg(T, 6.1, 6.5)));
        CARS.forEach((c, i) => {
          const k = seg(T, c.a, c.b);
          if (k <= 0 || k >= 1) {
            return;
          }
          const x = X0 + (X1 - X0) * E.sm(k);
          const vis = Math.min(1, k * 8, (1 - k) * 8);
          const boxK = seg(k, 0.28, 0.42) * (1 - seg(k, 0.88, 1));
          const plateK = seg(k, 0.42, 0.5) * (1 - seg(k, 0.9, 1));
          carsNow.push({ x, col: c.col, boxK, plateK, id: c.id, vis });
          const fk = seg(k, 0.5, 0.78);
          if (fk > 0 && fk < 1) {
            chips.push({ from: [x + 26, -24], to: [B.x + 50, RY(i)], k: fk });
          }
          rows[i] = seg(k, 0.76, 0.86);
        });
        CARS.forEach((c, i) => {
          if (T >= c.b) {
            rows[i] = 1;
          }
        });
        // the agent logs each plate as it lands, then sends the report
        const w0 = (i) => {
          const at = CARS[i].a + (CARS[i].b - CARS[i].a) * 0.76;
          return E.soft(seg(T, at - 0.25, at)) * (1 - E.soft(seg(T, at + 0.35, at + 0.6)));
        };
        const write = Math.max(w0(0), w0(1));
        bpose = mix(bpose, P({ hF: lp([B.x + B.w - 3, (T > 3 ? RY(1) : RY(0)) + 2], BOT, 0, -1), hB: [-4, -54], head: [9, -114], chest: [3, -90] }), write);
        const cheer = E.back(seg(T, 5.0, 5.4)) * (1 - E.soft(seg(T, 5.95, 6.3)));
        bpose = mix(bpose, P({ hF: [14, -132], hB: [-10, -130], head: [3, -118] }), cheer);
        doneK = seg(T, 4.85, 5.15);
        happy = seg(T, 4.9, 5.0) * (1 - seg(T, 6.2, 6.3));
        sayK = seg(T, 5.4, 5.6) * (1 - seg(T, 6.4, 6.6));
      }
      bpose = legs(bpose, 0, 0, { arms: false });

      camera(g, T >= 0 && Math.floor(t * 2.5) % 2 === 0, cone);
      board(g, rows, doneK, fade);
      for (const c of carsNow) {
        g.save();
        g.globalAlpha *= c.vis;
        car(g, c.x, c.col, c.boxK, c.plateK, c.id);
        g.restore();
      }
      const blink = pulse(t, 4.1, 0.8, 0.15) > 0.5;
      fig(g, bpose, BOT, 0, { sx: -1, ink: BOTC, far: BOTF, bot: { col: BOTC, dark: BOTD, glow, blink, happy: happy > 0.5 } });
      for (const ch of chips) {
        const p = R.arcPt(ch.from, ch.to, 46, E.soft(ch.k));
        rr(g, p[0] - 11, p[1] - 4, 22, 8, 1.5);
        inkFill(g, C.butter, 1.2);
      }
      text(g, 'camera', CAM[0], 16, 9, C.muted);
      text(g, 'autotrack', BOT, 16, 9, BOTD);
      bubble(g, BOT - 16, -160, 'report sent', sayK, { tail: 14, size: 8.5 });
      sparks(g, B.x + B.w - 10, B.y + 9, T >= 0 ? seg(T, 4.9, 5.5) : 0, 14, 6, BOX);
    },
  };
})();
