export type CardTheme = {
  id: string;
  label: string;
  stops: [string, string];
  text: string;
  accent: string;
};

export const CARD_THEMES: CardTheme[] = [
  { id: "samudra", label: "Samudra", stops: ["#0f4c81", "#0aa5a8"], text: "#ffffff", accent: "#f2b32a" },
  { id: "hutan", label: "Hutan", stops: ["#0e6b58", "#7cc5b4"], text: "#ffffff", accent: "#fdf8ee" },
  { id: "fajar", label: "Fajar", stops: ["#f2b32a", "#f26b5b"], text: "#0f4c81", accent: "#ffffff" },
  { id: "krem", label: "Krem", stops: ["#fdf8ee", "#f5e7c8"], text: "#0e6b58", accent: "#f26b5b" },
  { id: "senja", label: "Senja", stops: ["#7373b9", "#9f85c5"], text: "#ffffff", accent: "#f2b32a" },
  { id: "langit", label: "Langit", stops: ["#5590d2", "#7cc5b4"], text: "#063a2e", accent: "#fdf8ee" },
];

const STRIPE = ["#7cc5b4", "#f08260", "#5590d2", "#e6b946", "#7373b9", "#9f85c5"];

function wrap(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function renderCard(opts: {
  theme: CardTheme;
  eyebrow: string;
  title?: string;
  body: string;
  footer: string;
  signature?: string;
}) {
  const size = 1080;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve(new Blob());
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, opts.theme.stops[0]);
  grad.addColorStop(1, opts.theme.stops[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = opts.theme.text;
  ctx.lineWidth = 2;
  for (let x = 40; x < size; x += 90) {
    for (let y = 40; y < size; y += 90) {
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (Math.PI / 4) * i;
        const r = i % 2 === 0 ? 28 : 12;
        ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }
  ctx.restore();

  ctx.strokeStyle = opts.theme.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, size - 96, size - 96);
  STRIPE.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(48 + i * ((size - 96) / 6), size - 64, (size - 96) / 6, 12);
  });

  ctx.textAlign = "center";
  ctx.fillStyle = opts.theme.accent;
  ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(opts.eyebrow.toUpperCase(), size / 2, 160);

  let y = 280;
  if (opts.title) {
    ctx.fillStyle = opts.theme.text;
    ctx.font = '700 72px Lora, Georgia, serif';
    for (const line of wrap(ctx, opts.title, size - 220)) {
      ctx.fillText(line, size / 2, y);
      y += 84;
    }
    y += 24;
  }
  ctx.fillStyle = opts.theme.text;
  const bodySize = opts.title ? 36 : opts.body.length > 140 ? 46 : 56;
  ctx.font = `${opts.title ? "500" : "italic 600"} ${bodySize}px ${opts.title ? '"Plus Jakarta Sans", sans-serif' : "Lora, Georgia, serif"}`;
  const lines = wrap(ctx, opts.body, size - 240);
  if (!opts.title) y = size / 2 - ((lines.length - 1) * bodySize * 1.35) / 2;
  for (const line of lines) {
    ctx.fillText(line, size / 2, y);
    y += bodySize * 1.35;
  }
  if (opts.signature) {
    ctx.fillStyle = opts.theme.accent;
    ctx.font = '600 32px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(opts.signature, size / 2, size - 200);
  }
  ctx.fillStyle = opts.theme.text;
  ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(opts.footer, size / 2, size - 120);

  return new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? new Blob()), "image/png");
  });
}

export async function shareOrDownload(blob: Blob, filename: string, text: string) {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text });
      return "shared" as const;
    } catch {
      return "cancelled" as const;
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return "downloaded" as const;
}
