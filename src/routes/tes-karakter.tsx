import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, Download, RotateCcw, Share2 } from "lucide-react";
import { useState } from "react";
import { PageHero } from "@/components/shell";
import { CARD_THEMES, renderCard, shareOrDownload } from "@/lib/card";
import {
  QUESTIONS,
  ROLES,
  TYPE_META,
  TYPE_ORDER,
  computeResult,
  guidanceOf,
  metaByName,
  socialGuide,
  type AnswerKey,
  type FamilyRole,
  type SocialName,
  type TestResult,
  type TypeKey,
} from "@/lib/tb40";
import { useFamily } from "@/lib/store";

export const Route = createFileRoute("/tes-karakter")({
  validateSearch: (search: Record<string, unknown>) => ({
    hasil: typeof search.hasil === "string" ? search.hasil : "",
    nama: typeof search.nama === "string" ? search.nama : "",
  }),
  component: TesPage,
});

function keysFromSearch(raw: string): TypeKey[] {
  return raw
    .split(",")
    .map((k) => k.trim())
    .filter((k): k is TypeKey => TYPE_ORDER.includes(k as TypeKey));
}

function resultFromKeys(keys: TypeKey[]): TestResult | null {
  if (keys.length === 0) return null;
  const socials = new Set(keys.map((k) => TYPE_META[k].social));
  const egos = [...new Set(keys.map((k) => TYPE_META[k].ego))];
  const social: SocialName = socials.size > 1 ? "Ambivert" : [...socials][0];
  return {
    keys,
    social,
    socialDesc: social === "Ambivert" ? "Nyaman sendiri maupun bersama orang" : social === "Introvert" ? "Tenaga pulih saat sendirian" : "Tenaga pulih saat bersama orang",
    ego: egos.join(" ke "),
  };
}

function TesPage() {
  const shared = Route.useSearch();
  const sharedKeys = keysFromSearch(shared.hasil);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<AnswerKey[]>([]);
  const [result, setResult] = useState<TestResult | null>(resultFromKeys(sharedKeys));
  const [fromShare] = useState(sharedKeys.length > 0);

  function choose(key: AnswerKey) {
    const next = [...answers.slice(0, step), key];
    setAnswers(next);
    if (step + 1 === QUESTIONS.length) setResult(computeResult(next));
    else setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers([]);
    setResult(null);
  }

  return (
    <>
      <PageHero
        kicker="TB-40 gratis"
        title="Tes karakter singkat"
        lede="Sepuluh pertanyaan, kurang dari dua menit. Hasilnya: introvert atau ekstrovert, tingkat ego, dan kepribadian dominan beserta saran berinteraksi."
      >
        <p className="mt-4 max-w-2xl rounded-2xl bg-card/80 p-4 text-sm text-muted">
          Untuk anak, isi bersama pendamping sesuai kebiasaan sang anak. Ini gambaran kecenderungan, bukan
          diagnosis. Metode digagas Ust. Abdul Kholiq.
        </p>
      </PageHero>

      {result ? (
        <ResultView result={result} presetName={shared.nama} shared={fromShare} onReset={reset} />
      ) : (
        <section className="mx-auto max-w-2xl px-4 py-10">
          <div className="rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8">
            <div className="mb-4 flex items-center justify-between text-sm font-semibold text-muted">
              <span>
                Pertanyaan {step + 1} dari {QUESTIONS.length}
              </span>
              {step > 0 && (
                <button type="button" className="inline-flex items-center gap-1 text-teal" onClick={() => setStep(step - 1)}>
                  <ArrowLeft className="size-4" /> Kembali
                </button>
              )}
            </div>
            <div className="mb-6 h-2 overflow-hidden rounded-full bg-sand" role="progressbar" aria-valuenow={step} aria-valuemax={QUESTIONS.length}>
              <div className="tb-stripe h-full" style={{ width: `${(step / QUESTIONS.length) * 100}%` }} />
            </div>
            <h2 className="font-serif text-2xl font-bold text-navy">{QUESTIONS[step].q}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {QUESTIONS[step].options.map(([label, key]) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={() => choose(key)}
                    className="w-full rounded-2xl border-2 border-line bg-cream px-5 py-4 text-left font-medium hover:border-teal hover:bg-soft"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

function ResultView({
  result,
  presetName,
  shared,
  onReset,
}: {
  result: TestResult;
  presetName: string;
  shared: boolean;
  onReset: () => void;
}) {
  const addMember = useFamily((s) => s.add);
  const [name, setName] = useState(presetName);
  const [role, setRole] = useState<FamilyRole>("Anak");
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");
  const names = result.keys.map((k) => TYPE_META[k].name);
  const primary = TYPE_META[result.keys[0]];
  const guide = guidanceOf(primary.name);
  const social = socialGuide(result.social as SocialName);

  async function cardBlob() {
    return renderCard({
      theme: CARD_THEMES[0],
      eyebrow: "Hasil Tes Karakter TB-40",
      title: names.join(" & "),
      body: `${result.ego || primary.ego} · ${result.social}. ${primary.desc}`,
      signature: name ? `— ${name}` : undefined,
      footer: "Coba gratis di Pelajar Berkarakter",
    });
  }

  const shareText = `${name ? `${name}: ` : ""}Karakter dominan ${names.join(" & ")} (${result.ego || primary.ego}, ${result.social}). Yuk coba tes gratis TB-40.`;

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-10">
      <div className="rounded-3xl bg-navy p-8 text-center text-paper islamic-pattern">
        <p className="text-sm font-bold tracking-widest text-gold uppercase">
          {shared ? "Hasil yang dibagikan" : "Hasil Anda"}
        </p>
        <h2 className="mt-2 font-serif text-4xl font-bold">{names.join(" & ")}</h2>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-paper/15 px-4 py-1.5 text-sm font-semibold">{result.ego || primary.ego}</span>
          <span className="rounded-full bg-paper/15 px-4 py-1.5 text-sm font-semibold">
            {result.social}
            {result.socialDesc && result.socialDesc !== "Dibagikan" ? ` — ${result.socialDesc}` : ""}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {result.keys.map((key) => {
          const meta = TYPE_META[key];
          const g = guidanceOf(meta.name);
          return (
            <li key={key} className={`rounded-2xl border-l-8 bg-card p-5 ${meta.border}`}>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${meta.chip}`}>{meta.name}</span>
              <p className="mt-3 text-ink/90">{g?.trait ?? meta.desc}</p>
              <p className="mt-3 text-sm">
                <strong className="text-forest">Untuk orang tua: </strong>
                {g?.parent.slice(0, 2).join(" ") || meta.tip}
              </p>
              <p className="mt-2 font-serif text-sm italic text-muted">“{g?.sentence || meta.tip}”</p>
            </li>
          );
        })}
      </ul>

      {social && !shared && (
        <div className="rounded-2xl bg-soft p-5 text-forest">
          <h3 className="font-serif text-xl font-bold">{social.name}</h3>
          <p className="mt-1 text-sm">{social.trait}</p>
        </div>
      )}

      <div className="rounded-3xl border border-gold/40 bg-accent p-6">
        <h3 className="font-serif text-xl font-bold text-navy">Simpan ke peta keluarga</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">
            Nama
            <input
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mis. Hanifah"
              className="mt-1 h-11 w-full rounded-xl border border-line bg-card px-3"
            />
          </label>
          <label className="text-sm font-semibold">
            Peran
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as FamilyRole)}
              className="mt-1 h-11 w-full rounded-xl border border-line bg-card px-3"
            >
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            className="h-11 rounded-full bg-forest px-5 font-bold text-paper"
            onClick={() => {
              if (!name.trim()) return;
              addMember({
                name: name.trim(),
                role,
                typeName: primary.name,
                social: result.social,
              });
              setSaved(true);
            }}
          >
            {saved ? "Tersimpan di keluarga" : "Simpan anggota"}
          </button>
          {saved && (
            <Link to="/keluarga" className="inline-flex h-11 items-center rounded-full border border-navy px-5 font-bold text-navy">
              Lihat peta
            </Link>
          )}
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-coral px-5 font-bold text-paper"
            onClick={async () => {
              const blob = await cardBlob();
              const status = await shareOrDownload(blob, "hasil-tb40.png", shareText);
              setNote(status === "downloaded" ? "Gambar diunduh. Unggah ke WhatsApp atau Instagram." : "");
            }}
          >
            <Share2 className="size-4" /> Bagikan kartu
          </button>
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-navy px-5 font-bold text-navy"
            onClick={async () => {
              const blob = await cardBlob();
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "hasil-tb40.png";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            <Download className="size-4" /> Unduh
          </button>
        </div>
        {note && <p className="mt-3 text-sm text-forest">{note}</p>}
        {guide && <p className="mt-3 text-sm text-muted">Peran penting tipe ini: {guide.classroom}</p>}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button type="button" onClick={onReset} className="inline-flex items-center gap-2 font-bold text-teal">
          <RotateCcw className="size-4" /> Ulangi tes
        </button>
        <Link to="/toko" className="font-bold text-navy hover:underline">
          Ingin laporan 40 sifat lengkap?
        </Link>
      </div>
      <p className="text-xs text-muted">
        Tipe yang tampil memakai kepribadian dominan pertama bila hasil seri.{" "}
        {metaByName(primary.name)?.tip}
      </p>
    </section>
  );
}
