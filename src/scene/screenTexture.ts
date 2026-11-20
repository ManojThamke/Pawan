/**
 * Paints ORIGINAL, illustrative laptop-screen mockups for each project onto a 2D canvas.
 * These are typographic/diagram visuals — not screenshots of the real projects.
 */
import type { Project } from '../data/portfolio';

const C = {
  bg: '#3a231a',
  bg2: '#4a2d21',
  cream: '#f6e6d6',
  peach: '#f2d1b5',
  sand: '#e8b68e',
  terra: '#c46b3a',
  amber: '#f0a35e',
  dim: 'rgba(246,230,214,0.45)',
  faint: 'rgba(246,230,214,0.12)',
};

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function chrome(ctx: CanvasRenderingContext2D, W: number, H: number, label: string) {
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, C.bg2);
  g.addColorStop(1, C.bg);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = C.faint;
  ctx.fillRect(0, 0, W, 44);
  [C.terra, C.sand, C.peach].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(28 + i * 22, 22, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.fillStyle = C.dim;
  ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(label, 110, 28);
}

function nids(ctx: CanvasRenderingContext2D, W: number, H: number) {
  chrome(ctx, W, H, 'nids / flow-classifier');
  // network graph
  const nodes: [number, number][] = [];
  let s = 7;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < 22; i++) nodes.push([60 + rnd() * 470, 90 + rnd() * 300]);
  ctx.strokeStyle = 'rgba(242,209,181,0.22)';
  ctx.lineWidth = 1.5;
  nodes.forEach((a, i) =>
    nodes.slice(i + 1).forEach((b) => {
      if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 120) {
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }
    }),
  );
  nodes.forEach(([x, y], i) => {
    ctx.fillStyle = i % 6 === 0 ? C.terra : i % 3 === 0 ? C.amber : C.peach;
    ctx.beginPath();
    ctx.arc(x, y, i % 6 === 0 ? 9 : 5, 0, Math.PI * 2);
    ctx.fill();
    if (i % 6 === 0) {
      ctx.strokeStyle = 'rgba(196,107,58,0.5)';
      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  // class bars
  ctx.fillStyle = C.cream;
  ctx.font = '700 22px Fraunces, serif';
  ctx.fillText('Attack categories', 590, 100);
  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = C.dim;
  ctx.fillText('14 CLASSES · CICIDS2018', 590, 124);
  for (let i = 0; i < 9; i++) {
    const w = 60 + ((i * 53) % 180);
    ctx.fillStyle = C.faint;
    rr(ctx, 590, 146 + i * 26, 300, 14, 7);
    ctx.fill();
    ctx.fillStyle = i === 0 ? C.terra : i < 3 ? C.amber : C.sand;
    rr(ctx, 590, 146 + i * 26, w, 14, 7);
    ctx.fill();
  }
  // footer
  ctx.fillStyle = C.cream;
  ctx.font = '600 italic 46px Fraunces, serif';
  ctx.fillText('Intrusion Detection', 60, 470);
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = C.dim;
  ctx.fillText('ILLUSTRATIVE MOCKUP', 60, 510);
}

function sales(ctx: CanvasRenderingContext2D, W: number, H: number) {
  chrome(ctx, W, H, 'sales-dashboard.html · synthetic data');
  const labels = ['ORDERS', 'CUSTOMERS', 'RFM SEGMENTS', 'COHORTS'];
  labels.forEach((l, i) => {
    const x = 50 + i * 222;
    ctx.fillStyle = C.faint;
    rr(ctx, x, 70, 200, 90, 14);
    ctx.fill();
    ctx.fillStyle = C.dim;
    ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(l, x + 18, 98);
    ctx.fillStyle = i === 0 ? C.amber : C.cream;
    ctx.fillRect(x + 18, 116, 60 + i * 18, 18);
  });
  // line chart
  ctx.fillStyle = C.faint;
  rr(ctx, 50, 182, 560, 260, 16);
  ctx.fill();
  ctx.strokeStyle = C.amber;
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i <= 24; i++) {
    const x = 74 + i * 21.5;
    const y = 380 - (Math.sin(i / 2.2) * 40 + i * 4 + (i % 12 > 8 ? 50 : 0));
    i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
  }
  ctx.stroke();
  // bars / donut
  ctx.fillStyle = C.faint;
  rr(ctx, 630, 182, 270, 260, 16);
  ctx.fill();
  const segs = [0.32, 0.24, 0.18, 0.14, 0.12];
  const cols = [C.terra, C.amber, C.sand, C.peach, C.cream];
  let a = -Math.PI / 2;
  segs.forEach((p, i) => {
    ctx.strokeStyle = cols[i];
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.arc(765, 312, 72, a, a + p * Math.PI * 2 - 0.04);
    ctx.stroke();
    a += p * Math.PI * 2;
  });
  ctx.fillStyle = C.cream;
  ctx.font = '600 italic 40px Fraunces, serif';
  ctx.fillText('Sales & Customers', 50, 500);
}

function caption(ctx: CanvasRenderingContext2D, W: number, H: number) {
  chrome(ctx, W, H, 'streamlit · caption generator');
  // abstract "image" drop zone with geometric scene
  ctx.fillStyle = C.faint;
  rr(ctx, 60, 76, 420, 300, 18);
  ctx.fill();
  ctx.save();
  rr(ctx, 76, 92, 388, 268, 12);
  ctx.clip();
  const g = ctx.createLinearGradient(0, 92, 0, 360);
  g.addColorStop(0, '#f0b58a');
  g.addColorStop(1, '#c46b3a');
  ctx.fillStyle = g;
  ctx.fillRect(76, 92, 388, 268);
  ctx.fillStyle = C.cream;
  ctx.beginPath();
  ctx.arc(330, 170, 34, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7a3f24';
  ctx.beginPath();
  ctx.moveTo(76, 360);
  ctx.lineTo(190, 220);
  ctx.lineTo(280, 300);
  ctx.lineTo(360, 240);
  ctx.lineTo(464, 360);
  ctx.fill();
  ctx.restore();
  // pipeline
  const steps = ['Image', 'ResNet50', 'LSTM', 'Caption'];
  steps.forEach((s, i) => {
    const y = 96 + i * 72;
    ctx.fillStyle = i === 3 ? C.terra : C.faint;
    rr(ctx, 540, y, 340, 52, 26);
    ctx.fill();
    ctx.fillStyle = C.cream;
    ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(s, 566, y + 33);
    if (i < 3) {
      ctx.fillStyle = C.dim;
      ctx.fillText('↓', 704, y + 66);
    }
  });
  ctx.fillStyle = C.cream;
  ctx.font = '600 italic 40px Fraunces, serif';
  ctx.fillText('Image → Words', 60, 460);
  ctx.font = '600 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = C.dim;
  ctx.fillText('ILLUSTRATIVE MOCKUP · NOT A SCREENSHOT', 60, 500);
}

export function paintScreen(canvas: HTMLCanvasElement, visual: Project['visual']) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const W = canvas.width;
  const H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  if (visual === 'nids') nids(ctx, W, H);
  else if (visual === 'sales') sales(ctx, W, H);
  else caption(ctx, W, H);
}
