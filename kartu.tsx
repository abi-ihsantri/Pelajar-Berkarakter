import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { QUOTES } from "@/data/catalog";
import { useAdminStore } from "@/lib/admin-store";
import { PageHero } from "@/components/shell";
import { CARD_THEMES, renderCard, shareOrDownload } from "@/lib/card";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/kartu")({ component: KartuPage });

function KartuPage() {
  useEffect(() => {
    void useAdminStore.persist.rehydrate();
  }, []);
  const adminQuotes = useAdminStore((s) => s.quotes);
  const quoteList = adminQuotes.length ? adminQuotes : QUOTES;
  const [themeId, setThemeId] = useState(CARD_THEMES[0].id);
  const [title, setTitle] = useState("Untuk ayah dan bunda");
  const [body, setBody] = useState(quoteList[0]?.text ?? QUOTES[0].text);
  const [signature, setSignature] = useState("Pelajar Berkarakter");
  const [status, setStatus] = useState("");
  const theme = CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[0];

  async function make(download: boolean) {
    const blob = await renderCard({
      theme,
      eyebrow: "Kartu Parenting",
      title: title.trim() || undefined,
      body: body.trim() || "Kenali dulu, baru berinteraksi.",
      signature: signature.trim() ? `— ${signature.trim()}` : undefined,
      footer: "Pelajar Berkarakter",
    });
    if (download) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "kartu-parenting.png";
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Gambar diunduh.");
      return;
    }
    const result = await shareOrDownload(blob, "kartu-parenting.png", body);
    setStatus(result === "downloaded" ? "Perangkat ini mengunduh gambar sebagai ganti berbagi." : "");
  }

  return (
    <>
      <PageHero
        kicker="Berbagi"
        title="Kartu parenting"
        lede="Susun kalimat pendek, pilih warna, lalu unduh gambar persegi untuk status atau grup keluarga."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-2">
        <div className="rounded-3xl border border-line bg-card p-6">
          <label className="block text-sm font-semibold">
            Judul
            <input value={title} onChange={(e) => setTitle(e.target.value.slice(0, 60))} className="mt-1 h-12 w-full rounded-xl border border-line px-3" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Isi
            <textarea value={body} onChange={(e) => setBody(e.target.value.slice(0, 220))} rows={5} className="mt-1 w-full rounded-xl border border-line px-3 py-2" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Tanda tangan
            <input value={signature} onChange={(e) => setSignature(e.target.value.slice(0, 40))} className="mt-1 h-12 w-full rounded-xl border border-line px-3" />
          </label>
          <p className="mt-4 text-sm font-semibold">Warna</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {CARD_THEMES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id)}
                className={cn("h-11 rounded-full px-4 text-sm font-bold ring-2", themeId === t.id ? "ring-navy" : "ring-transparent")}
                style={{ background: `linear-gradient(135deg, ${t.stops[0]}, ${t.stops[1]})`, color: t.text }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {QUOTES.map((q) => (
              <button key={q.text} type="button" className="rounded-full bg-sand px-3 py-2 text-left text-xs font-semibold text-navy" onClick={() => setBody(q.text)}>
                {q.source}
              </button>
            ))}
          </div>
          <div className="mt-5 flex gap-2">
            <button type="button" className="h-12 flex-1 rounded-full bg-coral font-bold text-paper" onClick={() => void make(false)}>
              Bagikan
            </button>
            <button type="button" className="h-12 flex-1 rounded-full border border-navy font-bold text-navy" onClick={() => void make(true)}>
              Unduh
            </button>
          </div>
          {status && <p className="mt-3 text-sm text-forest">{status}</p>}
        </div>
        <div className="overflow-hidden rounded-3xl border border-line shadow-sm" style={{ background: `linear-gradient(135deg, ${theme.stops[0]}, ${theme.stops[1]})`, color: theme.text }}>
          <div className="flex min-h-80 flex-col items-center justify-center px-8 py-12 text-center">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: theme.accent }}>Kartu Parenting</p>
            <h2 className="mt-4 font-serif text-3xl font-bold">{title}</h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed">{body}</p>
            {signature && <p className="mt-6 text-sm font-semibold" style={{ color: theme.accent }}>— {signature}</p>}
          </div>
          <div className="tb-stripe h-2" />
        </div>
      </section>
    </>
  );
}
