import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ADAB } from "@/data/catalog";
import { PageHero } from "@/components/shell";
import { todayKey } from "@/lib/format";
import { useJournal } from "@/lib/store";

export const Route = createFileRoute("/jurnal")({ component: JurnalPage });

function shift(key: string, days: number) {
  const [y, m, d] = key.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return todayKey(date);
}

function JurnalPage() {
  const days = useJournal((s) => s.days);
  const toggle = useJournal((s) => s.toggle);
  const [ready, setReady] = useState(false);
  const today = todayKey();
  const checked = days[today] ?? [];

  useEffect(() => {
    void Promise.resolve(useJournal.persist.rehydrate()).then(() => setReady(true));
  }, []);

  const streak = useMemo(() => {
    let n = 0;
    let cursor = checked.length >= 4 ? today : shift(today, -1);
    if (checked.length < 4 && (days[cursor]?.length ?? 0) < 4) return 0;
    while ((days[cursor]?.length ?? 0) >= 4) {
      n += 1;
      cursor = shift(cursor, -1);
    }
    return n;
  }, [days, today, checked.length]);

  const week = Array.from({ length: 7 }, (_, i) => shift(today, i - 6));

  return (
    <>
      <PageHero
        kicker="Kebiasaan"
        title="Jurnal adab harian"
        lede="Tujuh adab sederhana untuk anak atau diri sendiri. Centang hari ini. Riwayat hanya tersimpan di perangkat ini — contoh kecil dari aplikasi jurnal sekolah."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {!ready ? (
            <p className="text-muted">Memuat jurnal…</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {ADAB.map((item) => {
                const on = checked.includes(item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => toggle(today, item.id)}
                      aria-pressed={on}
                      className={`flex w-full items-center gap-4 rounded-2xl border px-4 py-4 text-left ${on ? "border-forest bg-soft" : "border-line bg-card"}`}
                    >
                      <span className={`flex size-11 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-forest bg-forest text-paper" : "border-line text-transparent"}`}>
                        <Check className="size-5" aria-hidden="true" />
                      </span>
                      <span>
                        <span className="block font-bold text-navy">{item.label}</span>
                        <span className="text-sm text-muted">{item.hint}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <aside className="rounded-3xl bg-navy p-6 text-paper">
          <p className="text-sm font-bold tracking-widest text-gold uppercase">Hari ini</p>
          <p className="mt-2 font-serif text-5xl font-bold">{checked.length}<span className="text-2xl text-paper/70">/{ADAB.length}</span></p>
          <p className="mt-4 text-sm text-paper/80">Rentetan hari dengan minimal 4 adab: <strong className="text-gold">{streak} hari</strong>.</p>
          <ul className="mt-5 grid grid-cols-7 gap-1">
            {week.map((key) => {
              const n = days[key]?.length ?? 0;
              return (
                <li key={key} className="text-center">
                  <span className={`mx-auto flex size-8 items-center justify-center rounded-full text-xs font-bold ${n >= 4 ? "bg-gold text-navy" : n > 0 ? "bg-paper/20" : "bg-paper/10 text-paper/50"}`}>
                    {n}
                  </span>
                  <span className="mt-1 block text-[10px] text-paper/60">{key.slice(8)}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </section>
    </>
  );
}
