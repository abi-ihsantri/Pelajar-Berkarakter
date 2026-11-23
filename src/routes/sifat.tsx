import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHero } from "@/components/shell";
import { sentence } from "@/lib/format";
import { cn } from "@/lib/cn";
import { TRAITS, TYPE_META, TYPE_ORDER, guidanceOf, traitsOf, type TypeKey } from "@/lib/tb40";

export const Route = createFileRoute("/sifat")({ component: SifatPage });

function SifatPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeKey | "all">("all");
  const [open, setOpen] = useState<string | null>(null);

  const list = useMemo(() => {
    const base = type === "all" ? TRAITS : traitsOf(type);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((t) =>
      [t.name, t.definition, t.profession, t.major].join(" ").toLowerCase().includes(q),
    );
  }, [query, type]);

  return (
    <>
      <PageHero
        kicker="Modul sifat"
        title="Empat puluh sifat bakat"
        lede="Kamus dari modul TB-40: definisi, contoh profesi, dan jurusan yang selaras. Setiap sifat melekat pada salah satu dari enam kepribadian."
      />
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari sifat, profesi, atau jurusan"
            className="h-12 flex-1 rounded-full border border-line bg-card px-5"
            aria-label="Cari sifat bakat"
          />
          <p className="text-sm font-semibold text-muted">{list.length} sifat</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Filter active={type === "all"} onClick={() => setType("all")} label="Semua" />
          {TYPE_ORDER.map((key) => (
            <Filter key={key} active={type === key} onClick={() => setType(key)} label={TYPE_META[key].name} chip={TYPE_META[key].chip} />
          ))}
        </div>

        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {list.map((trait) => {
            const meta = TYPE_META[trait.type];
            const expanded = open === trait.slug;
            const guide = guidanceOf(meta.name);
            return (
              <li key={trait.slug} className={cn("rounded-2xl border bg-card p-5", expanded ? meta.border : "border-line")}>
                <button type="button" className="w-full text-left" onClick={() => setOpen(expanded ? null : trait.slug)} aria-expanded={expanded}>
                  <span className={cn("inline-flex rounded-full px-3 py-1 text-xs font-bold", meta.chip)}>{meta.name}</span>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-navy">{trait.name}</h2>
                  <p className="mt-2 text-sm text-ink/85">{sentence(trait.definition)}</p>
                </button>
                {expanded && (
                  <div className="mt-4 space-y-3 border-t border-line pt-4 text-sm">
                    <p>
                      <strong className="text-navy">Profesi yang selaras. </strong>
                      {trait.profession}
                    </p>
                    <p>
                      <strong className="text-navy">Jurusan studi. </strong>
                      {trait.major}
                    </p>
                    {guide && (
                      <p className="rounded-xl bg-sand p-3 text-ink">
                        <strong>Cara mendampingi tipe {meta.name}: </strong>
                        {guide.parent[0]}
                      </p>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {list.length === 0 && <p className="mt-8 text-muted">Tidak ada sifat yang cocok. Coba kata lain.</p>}
      </section>
    </>
  );
}

function Filter({ active, onClick, label, chip }: { active: boolean; onClick: () => void; label: string; chip?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 rounded-full px-4 text-sm font-bold",
        active ? chip ?? "bg-navy text-paper" : "bg-card text-navy ring-1 ring-line",
      )}
    >
      {label}
    </button>
  );
}
