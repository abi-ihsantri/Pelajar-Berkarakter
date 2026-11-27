import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { CONTENTS, THEMES } from "@/data/catalog";
import { useAdminStore } from "@/lib/admin-store";
import { PageHero } from "@/components/shell";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/parenting")({ component: ParentingPage });

function ParentingPage() {
  useEffect(() => {
    void useAdminStore.persist.rehydrate();
  }, []);
  const adminContents = useAdminStore((s) => s.contents);
  const source = adminContents.length ? adminContents : CONTENTS;
  const [theme, setTheme] = useState<string>("Semua");
  const [kind, setKind] = useState<string>("Semua");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return source.filter((item) => {
      if (theme !== "Semua" && item.theme !== theme) return false;
      if (kind !== "Semua" && item.kind !== kind) return false;
      if (q.trim() && !`${item.title} ${item.excerpt}`.toLowerCase().includes(q.trim().toLowerCase())) return false;
      return true;
    });
  }, [theme, kind, q, source]);

  return (
    <>
      <PageHero
        kicker="Bacaan & tontonan"
        title="Parenting nabawiyah"
        lede="Enam belas konten pilihan: adab, peran ayah, kepribadian anak, dan cara mendampingi di era gawai."
      />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari judul atau topik"
            aria-label="Cari konten"
            className="h-12 flex-1 rounded-full border border-line bg-card px-5"
          />
          <select value={kind} onChange={(e) => setKind(e.target.value)} className="h-12 rounded-full border border-line bg-card px-4 font-semibold" aria-label="Jenis">
            {["Semua", "Artikel", "Video", "Slide IG"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Semua", ...THEMES].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={cn(
                "h-11 rounded-full px-4 text-sm font-bold",
                theme === t ? "bg-forest text-paper" : "bg-card text-navy ring-1 ring-line",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold text-muted">{list.length} konten</p>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {list.map((item) => (
            <li key={item.id} className="flex flex-col rounded-3xl border border-line bg-card p-5">
              <div className="flex flex-wrap gap-2 text-xs font-bold tracking-wide uppercase">
                <span className="rounded-full bg-soft px-3 py-1 text-forest">{item.kind}</span>
                <span className="rounded-full bg-sand px-3 py-1 text-navy">{item.theme}</span>
              </div>
              <h2 className="mt-3 font-serif text-2xl font-bold text-navy">{item.title}</h2>
              <p className="mt-2 flex-1 text-muted">{item.excerpt}</p>
              <a href={item.url} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 items-center font-bold text-teal">
                Buka di {item.source}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
