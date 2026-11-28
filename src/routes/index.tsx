import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, HeartHandshake, Sprout, type LucideIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CITIES, CONTENTS, PRODUCTS, SPONSORS } from "@/data/catalog";
import { idr } from "@/lib/format";
import { useCart } from "@/lib/store";
import { getBuyers, hitVisitors } from "@/lib/site-store";

export const Route = createFileRoute("/")({ component: Home });

const PRAYERS = [
  ["Subuh", "Fajr"],
  ["Dzuhur", "Dhuhr"],
  ["Ashar", "Asr"],
  ["Maghrib", "Maghrib"],
  ["Isya", "Isha"],
] as const;

function Home() {
  const add = useCart((s) => s.add);
  const ads = PRODUCTS.filter((p) => ["ebook", "buku", "aplikasi"].includes(p.category)).slice(0, 4);
  const [city, setCity] = useState("Jakarta");
  const [times, setTimes] = useState<Record<string, string> | null>(null);
  const [prayerError, setPrayerError] = useState(false);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [buyers, setBuyers] = useState<number | null>(null);

  useEffect(() => {
    void hitVisitors().then(setVisitors);
    void getBuyers().then(setBuyers);
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    setPrayerError(false);
    fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=Indonesia&method=20`,
      { signal: ctrl.signal },
    )
      .then((r) => r.json())
      .then((data) => setTimes(data?.data?.timings ?? null))
      .catch(() => {
        if (!ctrl.signal.aborted) setPrayerError(true);
      });
    return () => ctrl.abort();
  }, [city]);

  const nextLabel = useMemo(() => {
    if (!times) return "";
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    for (const [label, key] of PRAYERS) {
      const [h, m] = (times[key] ?? "00:00").slice(0, 5).split(":").map(Number);
      if (h * 60 + m >= minutes) return label;
    }
    return "Subuh";
  }, [times]);

  return (
    <>
      <section className="islamic-pattern">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 md:grid-cols-2 md:py-16">
          <div className="flex flex-col gap-5">
            <p className="font-serif text-2xl text-forest" lang="ar" dir="rtl">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <h1 className="font-serif text-4xl leading-tight font-bold text-navy md:text-5xl">
              Mendidik dengan Karakter, <span className="text-teal">Bertumbuh</span> dengan{" "}
              <span className="text-gold">Makna</span>
            </h1>
            <p className="max-w-prose text-lg text-muted">
              Kenali dulu karakter anak dan diri Anda, baru berinteraksi. Tes gratis TB-40, peta 40 sifat bakat,
              serta alat pendampingan untuk keluarga dan sekolah.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/tes-karakter"
                search={{ hasil: "", nama: "" }}
                className="inline-flex h-12 items-center rounded-full bg-coral px-6 font-bold text-paper hover:bg-coral/90"
              >
                Mulai Tes Karakter Gratis
              </Link>
              <Link
                to="/keluarga"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-navy px-6 font-bold text-navy hover:bg-navy hover:text-paper"
              >
                Peta Keluarga <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 -rotate-1 rounded-3xl tb-stripe opacity-80" aria-hidden="true" />
            <img
              src="/images/banner-pb.jpeg"
              alt="Ayah membacakan buku untuk anak, pohon ilmu tumbuh dari buku"
              className="relative aspect-video w-full rounded-3xl object-cover shadow-xl"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-sm font-bold tracking-widest text-teal uppercase">Tujuan kami</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-navy">Kontribusi nyata agar pelajar tumbuh berkarakter</h2>
          </div>
          <div className="space-y-4 text-lg text-ink/85 md:col-span-3">
            <p>
              Toko <strong className="text-navy">Pelajar Berkarakter</strong> hadir agar pelajar tumbuh dengan
              akhlak yang mulia sebagaimana teladan Rasulullah ﷺ.
            </p>
            <p>
              Setiap pembelian mendukung konten parenting gratis, program sekolah karakter, dan pendampingan
              keluarga.
            </p>
          </div>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {(
            [
              { Icon: Sprout, color: "bg-teal text-paper", title: "Menumbuhkan", text: "Karakter nabawiyah sejak dini, di rumah dan di sekolah." },
              { Icon: BookOpen, color: "bg-gold text-navy", title: "Mencerahkan", text: "Ilmu parenting dari Al-Quran dan Sunnah." },
              { Icon: HeartHandshake, color: "bg-coral text-paper", title: "Mendampingi", text: "Orang tua dan guru dengan alat ukur TB-40." },
            ] satisfies { Icon: LucideIcon; color: string; title: string; text: string }[]
          ).map(({ Icon, color, title, text }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-line bg-card p-5">
              <span className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <div>
                <h3 className="font-serif text-lg font-bold text-navy">{title}</h3>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="bg-navy text-paper">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["/sifat", "40 Sifat Bakat", "Kamus bakat, profesi, dan jurusan dari modul TB-40."],
            ["/keluarga", "Peta Keluarga", "Titik rawan interaksi antara ayah, ibu, dan anak."],
            ["/dampingi", "Dampingi Masalah", "Tantrum, gawai, sholat, dan kejujuran sesuai tipe."],
            ["/jurnal", "Jurnal Adab", "Kebiasaan harian di perangkat ini, tanpa akun."],
          ].map(([href, title, text]) => (
            <Link key={href} to={href} className="rounded-2xl bg-paper/10 p-5 hover:bg-paper/15">
              <h3 className="font-serif text-xl font-bold text-gold">{title}</h3>
              <p className="mt-2 text-sm text-paper/80">{text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-14 lg:grid-cols-5">
        <div className="rounded-3xl border border-line bg-card p-6 lg:col-span-3">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold tracking-widest text-teal uppercase">Waktu sholat</p>
              <h2 className="font-serif text-2xl font-bold text-navy">Jadwal hari ini</h2>
            </div>
            <label className="text-sm font-semibold text-muted">
              Kota
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 block h-11 rounded-xl border border-line bg-cream px-3 text-ink"
              >
                {CITIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
          </div>
          {prayerError && <p className="mt-4 text-sm text-coral">Jadwal belum bisa dimuat. Periksa koneksi, lalu pilih kota lagi.</p>}
          <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {PRAYERS.map(([label, key]) => (
              <li
                key={key}
                className={`rounded-2xl px-3 py-3 text-center ${nextLabel === label ? "bg-forest text-paper" : "bg-sand text-navy"}`}
              >
                <p className="text-xs font-bold tracking-wide uppercase">{label}</p>
                <p className="font-serif text-xl font-bold">{times ? (times[key] ?? "--:--").slice(0, 5) : "…"}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted">Sumber Aladhan, metode Kemenag RI. Berikutnya: {nextLabel || "…"}.</p>
        </div>
        <ul className="grid grid-cols-2 gap-3 lg:col-span-2">
          {[
            [visitors === null ? "…" : visitors.toLocaleString("id-ID"), "Pengunjung"],
            [buyers === null ? "…" : buyers.toLocaleString("id-ID"), "Pembeli"],
            [String(CONTENTS.length), "Konten parenting"],
            ["6", "Tipe kepribadian TB-40"],
          ].map(([n, label]) => (
            <li key={label} className="flex flex-col justify-center rounded-3xl border border-line bg-card p-5">
              <span className="font-serif text-4xl font-bold text-teal">{n}</span>
              <span className="text-sm font-semibold text-muted">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-4">
        <div className="mb-5 flex items-end justify-between gap-3">
          <h2 className="font-serif text-3xl font-bold text-navy">Artikel & video pekan ini</h2>
          <Link to="/parenting" className="font-semibold text-teal hover:underline">
            Lihat semua
          </Link>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {CONTENTS.slice(0, 6).map((item) => (
            <li key={item.id} className="rounded-2xl border border-line bg-card p-5">
              <p className="text-xs font-bold tracking-wide text-teal uppercase">{item.theme}</p>
              <h3 className="mt-2 font-serif text-xl font-bold text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              <a href={item.url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-sm font-bold text-forest hover:underline">
                Buka di {item.source}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="font-serif text-3xl font-bold text-navy">Pilihan untuk keluarga & sekolah</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ads.map((p) => (
            <li key={p.id} className="flex flex-col rounded-2xl border border-line bg-card p-5">
              <h3 className="font-serif text-lg font-bold text-navy">{p.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted">{p.description}</p>
              <p className="mt-3 font-bold text-forest">{p.priceIdr ? idr(p.priceIdr) : "Mitra"}</p>
              {p.priceIdr && (
                <button
                  type="button"
                  className="mt-3 h-11 rounded-full bg-navy font-bold text-paper"
                  onClick={() => add({ id: p.id, name: p.name, priceIdr: p.priceIdr! })}
                >
                  Masukkan keranjang
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section id="sponsor" className="mx-auto max-w-6xl px-4 pb-8">
        <div className="rounded-3xl border border-gold/50 bg-accent px-5 py-6">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-sm font-bold tracking-widest text-navy uppercase">Mitra</p>
              <h2 className="font-serif text-2xl font-bold text-navy">Yang berjalan bersama</h2>
            </div>
            <Link to="/toko" hash="sponsor" className="font-bold text-forest hover:underline">
              Jadi mitra
            </Link>
          </div>
          <ul className="mt-4 flex flex-wrap gap-2">
            {SPONSORS.map((s) => (
              <li key={s.name}>
                <a href={s.url} className="inline-flex h-11 items-center rounded-full bg-card px-4 text-sm font-bold text-navy ring-1 ring-line">
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
