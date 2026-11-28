import { Pause, Play, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { QUOTES } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { TYPE_META, TYPE_ORDER, type TypeKey } from "@/lib/tb40";

/* ---------- TTS parenting ---------- */
const TIPS = [
  "Anak belajar adab dari apa yang ia lihat, bukan dari apa yang kita ucapkan. Mulailah dari keteladanan di rumah.",
  "Sebelum menasihati, kenali dulu karakter anak. Cara berinteraksi yang tepat membuat nasihat lebih mudah diterima.",
  "Sapa anak dengan lembut, tatap matanya, lalu dengarkan sampai selesai sebelum memberi arahan.",
  "Pujilah usahanya, bukan hanya hasilnya. Anak yang dihargai prosesnya akan tumbuh tangguh.",
];

export function TtsPanel() {
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;
  const texts = useMemo(() => [...TIPS, ...QUOTES.map((q) => `${q.text}. ${q.source}`)], []);
  const [text, setText] = useState(texts[0]);
  const [rate, setRate] = useState(0.95);
  const [state, setState] = useState<"idle" | "play" | "pause">("idle");
  const ref = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => () => {
    if (supported) window.speechSynthesis.cancel();
  }, [supported]);

  function play() {
    if (!supported || !text.trim()) return;
    if (state === "pause") {
      window.speechSynthesis.resume();
      setState("play");
      return;
    }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "id-ID";
    u.rate = rate;
    const v = window.speechSynthesis.getVoices().find((x) => x.lang.toLowerCase().startsWith("id"));
    if (v) u.voice = v;
    u.onend = () => setState("idle");
    u.onerror = () => setState("idle");
    ref.current = u;
    window.speechSynthesis.speak(u);
    setState("play");
  }
  function pause() {
    window.speechSynthesis.pause();
    setState("pause");
  }
  function stop() {
    window.speechSynthesis.cancel();
    setState("idle");
  }

  return (
    <div className="rounded-3xl border border-line bg-card p-6">
      <p className="text-sm font-bold tracking-widest text-teal uppercase">Dengarkan parenting</p>
      <h2 className="mt-1 font-serif text-2xl font-bold text-navy">Text-to-Speech</h2>
      {!supported ? (
        <p className="mt-3 text-sm text-coral">Peramban ini belum mendukung suara. Coba Chrome atau Edge.</p>
      ) : (
        <>
          <label className="mt-4 block text-sm font-semibold">
            Pilih bacaan
            <select
              value={texts.includes(text) ? text : ""}
              onChange={(e) => {
                stop();
                setText(e.target.value);
              }}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-cream px-3"
            >
              {!texts.includes(text) && <option value="">Teks sendiri</option>}
              {texts.map((t) => (
                <option key={t} value={t}>
                  {t.slice(0, 70)}…
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Atau tulis sendiri
            <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Kecepatan: {rate.toFixed(2)}×
            <input type="range" min={0.6} max={1.4} step={0.05} value={rate} onChange={(e) => setRate(Number(e.target.value))} className="mt-1 w-full" />
          </label>
          <div className="mt-4 flex gap-2">
            {state === "play" ? (
              <button type="button" onClick={pause} className="inline-flex h-11 items-center gap-2 rounded-full bg-gold px-5 font-bold text-navy">
                <Pause className="size-4" /> Jeda
              </button>
            ) : (
              <button type="button" onClick={play} className="inline-flex h-11 items-center gap-2 rounded-full bg-forest px-5 font-bold text-paper">
                <Play className="size-4" /> {state === "pause" ? "Lanjut" : "Putar"}
              </button>
            )}
            <button type="button" onClick={stop} className="inline-flex h-11 items-center gap-2 rounded-full bg-sand px-5 font-bold text-navy">
              <Square className="size-4" /> Berhenti
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Tebak Karakter TB-40 ---------- */
const EGOS = ["Ego Tinggi", "Ego Sedang", "Ego Rendah"] as const;
const SOCIALS = ["Introvert", "Ekstrovert"] as const;

export function GuessGame() {
  const [order, setOrder] = useState<TypeKey[]>(() => [...TYPE_ORDER]);
  const [round, setRound] = useState(0);
  const [ego, setEgo] = useState<string | null>(null);
  const [social, setSocial] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [checked, setChecked] = useState(false);
  const done = round >= order.length;
  const key = order[Math.min(round, order.length - 1)];
  const meta = TYPE_META[key];
  const exact = ego === meta.ego && social === meta.social;

  function shuffle() {
    setOrder([...TYPE_ORDER].sort(() => Math.random() - 0.5));
    setRound(0);
    setEgo(null);
    setSocial(null);
    setScore(0);
    setChecked(false);
  }
  function check() {
    if (!ego || !social) return;
    setChecked(true);
    if (exact) setScore((s) => s + 1);
  }
  function next() {
    setRound((r) => r + 1);
    setEgo(null);
    setSocial(null);
    setChecked(false);
  }

  const pill = (active: boolean, right: boolean | null) =>
    cn(
      "h-11 rounded-full border-2 px-4 text-sm font-bold",
      right === true && "border-forest bg-soft text-forest",
      right === false && "border-coral bg-accent text-navy",
      right === null && (active ? "border-navy bg-navy text-paper" : "border-line hover:border-teal"),
    );

  return (
    <div className="rounded-3xl border border-line bg-card p-6">
      <p className="text-sm font-bold tracking-widest text-teal uppercase">Tebak karakter</p>
      <h2 className="mt-1 font-serif text-2xl font-bold text-navy">Siapa kepribadiannya?</h2>
      <p className="mt-1 text-sm text-muted">3 tingkat ego × 2 sosialitas = 6 tipe kepribadian TB-40.</p>
      {done ? (
        <div className="mt-4 rounded-2xl bg-forest p-5 text-paper">
          <p className="font-serif text-3xl font-bold">{score} dari {order.length} tepat</p>
          <button type="button" onClick={shuffle} className="mt-4 h-11 rounded-full bg-gold px-5 font-bold text-navy">
            Main lagi
          </button>
        </div>
      ) : (
        <>
          <p className="mt-4 rounded-2xl bg-sand p-4 font-serif text-lg text-navy">
            “{meta.desc}”
          </p>
          <p className="mt-4 text-sm font-semibold">Tingkat ego</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {EGOS.map((o) => (
              <button key={o} type="button" disabled={checked} onClick={() => setEgo(o)} className={pill(ego === o, checked ? (o === meta.ego ? true : ego === o ? false : null) : null)}>
                {o}
              </button>
            ))}
          </div>
          <p className="mt-4 text-sm font-semibold">Sosialitas</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {SOCIALS.map((o) => (
              <button key={o} type="button" disabled={checked} onClick={() => setSocial(o)} className={pill(social === o, checked ? (o === meta.social ? true : social === o ? false : null) : null)}>
                {o}
              </button>
            ))}
          </div>
          {checked ? (
            <div className="mt-4">
              <p className="text-sm">
                {exact ? "Tepat! " : "Belum tepat. "}Jawabannya: <strong>{meta.name}</strong> ({meta.ego}, {meta.social}).
              </p>
              <button type="button" onClick={next} className="mt-3 h-11 rounded-full bg-navy px-5 font-bold text-paper">
                {round + 1 === order.length ? "Lihat skor" : "Berikutnya"}
              </button>
            </div>
          ) : (
            <button type="button" onClick={check} disabled={!ego || !social} className="mt-4 h-11 rounded-full bg-coral px-5 font-bold text-paper disabled:opacity-50">
              Periksa jawaban
            </button>
          )}
          <p className="mt-3 text-xs text-muted">Soal {round + 1} / {order.length}</p>
        </>
      )}
    </div>
  );
}
