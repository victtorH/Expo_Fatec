/**
 * Utilitários de "traço à mão" — puramente visuais.
 *
 * Tudo aqui é determinístico (gerador pseudo-aleatório com semente), de modo que
 * os desenhos não "tremem" a cada renderização e nunca alteram a topologia
 * lógica do circuito: os vértices de início/fim de cada fio são preservados.
 */

export interface Pt {
  x: number;
  y: number;
}

/** Hash simples de string -> inteiro de 32 bits. */
export function hashSeed(input: string | number): number {
  const str = String(input);
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Gerador pseudo-aleatório determinístico (mulberry32). */
export function makeRng(seed: string | number): () => number {
  let a = hashSeed(seed) || 1;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fmt = (n: number) => Math.round(n * 100) / 100;

/**
 * Perturba levemente todas as coordenadas de um path em comandos ABSOLUTOS
 * (M, L, C, Q, Z). Usado para dar uma segunda "passada de lápis" aos símbolos.
 */
export function jitterPath(d: string, seed: string | number, amp = 1): string {
  const rng = makeRng(seed);
  const tokens = d.match(/[MLCQZmlcqz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const out: string[] = [];
  for (const tk of tokens) {
    if (/^[MLCQZmlcqz]$/.test(tk)) {
      out.push(tk);
    } else {
      out.push(String(fmt(parseFloat(tk) + (rng() - 0.5) * 2 * amp)));
    }
  }
  return out.join(' ');
}

/** Caminho de círculo aproximado por 4 curvas de Bézier (para jitter posterior). */
export function circlePath(cx: number, cy: number, r: number): string {
  const k = 0.5523 * r;
  return [
    `M ${cx - r} ${cy}`,
    `C ${cx - r} ${cy - k} ${cx - k} ${cy - r} ${cx} ${cy - r}`,
    `C ${cx + k} ${cy - r} ${cx + r} ${cy - k} ${cx + r} ${cy}`,
    `C ${cx + r} ${cy + k} ${cx + k} ${cy + r} ${cx} ${cy + r}`,
    `C ${cx - k} ${cy + r} ${cx - r} ${cy + k} ${cx - r} ${cy}`,
    'Z',
  ].join(' ');
}

/** Converte uma sequência de pontos numa curva suave (Catmull-Rom -> Bézier). */
function smoothThrough(points: Pt[], moveTo: boolean): string {
  if (points.length < 2) return '';
  const p = points;
  let d = moveTo ? `M ${fmt(p[0].x)} ${fmt(p[0].y)}` : '';
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${fmt(c1x)} ${fmt(c1y)} ${fmt(c2x)} ${fmt(c2y)} ${fmt(p2.x)} ${fmt(p2.y)}`;
  }
  return d;
}

/** Extrai os vértices de um path simples "M x y L x y L ...". */
export function parsePolylinePath(path: string): Pt[] {
  const nums = path.match(/-?\d*\.?\d+/g)?.map(Number) ?? [];
  const pts: Pt[] = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
  return pts;
}

interface WireOpts {
  /** Amplitude do tremor perpendicular (px do viewBox). */
  amp?: number;
  /** Raio de arredondamento das quinas. */
  radius?: number;
  /** Espaçamento aproximado entre pontos de tremor. */
  step?: number;
  /** Índices de vértices que devem permanecer em quina viva (junções). */
  sharp?: Set<number>;
  /** Deslocamento máximo dos extremos (0 = extremos exatos). */
  endSlack?: number;
}

/**
 * Gera um traço de lápis a partir de uma polilinha ortogonal.
 * Os extremos permanecem (quase) exatos para preservar a topologia.
 */
export function wirePath(points: Pt[], seed: string | number, opts: WireOpts = {}): string {
  const { amp = 1.3, radius = 9, step = 46, sharp = new Set<number>(), endSlack = 0 } = opts;
  if (points.length < 2) return '';
  const rng = makeRng(seed);
  const n = points.length;

  // Vértices de extremidade com folga opcional (usada só na 2ª passada).
  const verts: Pt[] = points.map((p, i) =>
    (i === 0 || i === n - 1) && endSlack > 0
      ? { x: p.x + (rng() - 0.5) * 2 * endSlack, y: p.y + (rng() - 0.5) * 2 * endSlack }
      : { ...p }
  );

  // Raio efetivo de arredondamento em cada vértice interno.
  const r: number[] = verts.map((v, i) => {
    if (i === 0 || i === n - 1 || sharp.has(i) || radius <= 0) return 0;
    const a = verts[i - 1];
    const b = verts[i + 1];
    const lenIn = Math.hypot(v.x - a.x, v.y - a.y);
    const lenOut = Math.hypot(b.x - v.x, b.y - v.y);
    // quinas de ~180° (colineares) não precisam de arredondamento
    const cross = (v.x - a.x) * (b.y - v.y) - (v.y - a.y) * (b.x - v.x);
    if (Math.abs(cross) < 1e-3) return 0;
    return Math.min(radius, lenIn / 2.2, lenOut / 2.2);
  });

  let d = '';
  for (let i = 0; i < n - 1; i++) {
    const A = verts[i];
    const B = verts[i + 1];
    const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const ux = (B.x - A.x) / len;
    const uy = (B.y - A.y) / len;
    const nx = -uy;
    const ny = ux;
    const start: Pt = { x: A.x + ux * r[i], y: A.y + uy * r[i] };
    const end: Pt = { x: B.x - ux * r[i + 1], y: B.y - uy * r[i + 1] };
    const segLen = Math.hypot(end.x - start.x, end.y - start.y);
    const count = Math.max(1, Math.round(segLen / step));
    const pts: Pt[] = [start];
    for (let k = 1; k < count; k++) {
      const t = k / count;
      const off = (rng() - 0.5) * 2 * amp;
      pts.push({
        x: start.x + (end.x - start.x) * t + nx * off,
        y: start.y + (end.y - start.y) * t + ny * off,
      });
    }
    pts.push(end);

    if (i === 0) {
      d += smoothThrough(pts, true);
    } else {
      d += smoothThrough(pts, false);
    }
    // arredonda a quina entre este segmento e o próximo
    if (i + 1 < n - 1 && r[i + 1] > 0) {
      const C = verts[i + 1];
      const nxt = verts[i + 2];
      const len2 = Math.hypot(nxt.x - C.x, nxt.y - C.y) || 1;
      const after: Pt = {
        x: C.x + ((nxt.x - C.x) / len2) * r[i + 1],
        y: C.y + ((nxt.y - C.y) / len2) * r[i + 1],
      };
      d += ` Q ${fmt(C.x)} ${fmt(C.y)} ${fmt(after.x)} ${fmt(after.y)}`;
    } else if (i + 1 < n - 1) {
      // quina viva: linha até o vértice
      d += ` L ${fmt(verts[i + 1].x)} ${fmt(verts[i + 1].y)}`;
    }
  }
  return d;
}

/** Pontos de um retângulo "desenhado à mão" (contorno fechado). */
function roughRectPoints(w: number, h: number, seed: string | number, amp: number): Pt[] {
  const rng = makeRng(seed);
  const pts: Pt[] = [];
  const edge = (ax: number, ay: number, bx: number, by: number) => {
    const len = Math.hypot(bx - ax, by - ay);
    const count = Math.max(2, Math.round(len / 38));
    const ux = (bx - ax) / len;
    const uy = (by - ay) / len;
    for (let k = 0; k < count; k++) {
      const t = k / count;
      const off = (rng() - 0.5) * 2 * amp;
      pts.push({ x: ax + (bx - ax) * t - uy * off, y: ay + (by - ay) * t + ux * off });
    }
  };
  const m = amp * 1.2;
  edge(m, m, w - m, m);
  edge(w - m, m, w - m, h - m);
  edge(w - m, h - m, m, h - m);
  edge(m, h - m, m, m);
  return pts;
}

export interface RoughRect {
  /** Contorno fechado (para preenchimento e 1ª passada). */
  fill: string;
  /** Contorno aberto com leve sobra, como uma 2ª passada de lápis. */
  second: string;
}

/** Retângulo irregular para etiquetas, bilhetes e botões desenhados à mão. */
export function roughRect(w: number, h: number, seed: string | number, amp = 1.6): RoughRect {
  const a = roughRectPoints(w, h, `${seed}-a`, amp);
  const b = roughRectPoints(w, h, `${seed}-b`, amp * 1.15);
  // 1ª passada: curva fechada
  const closed = [...a, a[0], a[1]];
  const fillD = smoothThrough(closed, true) + ' Z';
  // 2ª passada: aberta, com sobra no canto superior esquerdo
  const open = [...b, b[0], { x: b[1].x + 4, y: b[1].y - 1.2 }];
  return { fill: fillD, second: smoothThrough(open, true) };
}

/** Pontos que são vértices compartilhados por 2+ fios (junções do circuito). */
export function findJunctions(paths: string[]): Pt[] {
  const count = new Map<string, { pt: Pt; wires: Set<number> }>();
  paths.forEach((p, wi) => {
    parsePolylinePath(p).forEach((pt) => {
      const key = `${Math.round(pt.x)},${Math.round(pt.y)}`;
      const entry = count.get(key) ?? { pt, wires: new Set<number>() };
      entry.wires.add(wi);
      count.set(key, entry);
    });
  });
  return [...count.values()].filter((e) => e.wires.size >= 2).map((e) => e.pt);
}
