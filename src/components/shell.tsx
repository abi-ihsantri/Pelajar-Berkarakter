import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { CATEGORY_LABELS, type Product } from "@/data/catalog";
import { cn } from "@/lib/cn";
import { idr } from "@/lib/format";
import { useCart, useFamily, useJournal } from "@/lib/store";

const NAV = [
  { href: "/", label: "Beranda" },
  { href: "/tes-karakter", label: "Tes Gratis" },
  { href: "/sifat", label: "40 Sifat" },
  { href: "/keluarga", label: "Keluarga" },
  { href: "/parenting", label: "Parenting" },
  { href: "/toko", label: "Toko" },
] as const;

const MORE = [
  { href: "/dampingi", label: "Dampingi Masalah" },
  { href: "/jurnal", label: "Jurnal Adab" },
  { href: "/kartu", label: "Kartu Parenting" },
  { href: "/gimik", label: "Kuis & Kutipan" },
  { href: "/admin", label: "Ruang Admin" },
] as const;

function active(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { items, open, setOpen, setQty } = useCart();
  const [menu, setMenu] = useState(false);
  const [tools, setTools] = useState(false);
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = items.reduce((n, i) => n + i.qty * i.priceIdr, 0);

  useEffect(() => {
    void useCart.persist.rehydrate();
    void useFamily.persist.rehydrate();
    void useJournal.persist.rehydrate();
  }, []);

  useEffect(() => {
    setMenu(false);
    setTools(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-cream/90 backdrop-blur">
        <div className="tb-stripe h-1 w-full" aria-hidden="true" />
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/images/logo-pb.jpeg"
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover ring-2 ring-gold/50"
            />
            <span className="flex flex-col leading-tight">
              <span className="font-serif text-lg font-bold text-navy">Pelajar</span>
              <span className="-mt-0.5 text-sm font-bold tracking-wide text-teal">Berkarakter</span>
            </span>
          </Link>

          <nav aria-label="Menu utama" className="hidden items-center gap-1 xl:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                aria-current={active(pathname, item.href) ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold",
                  active(pathname, item.href) ? "bg-navy text-paper" : "text-ink/80 hover:bg-soft hover:text-forest",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="relative">
              <button
                type="button"
                className="rounded-full px-3 py-2 text-sm font-semibold text-ink/80 hover:bg-soft"
                aria-expanded={tools}
                onClick={() => setTools((v) => !v)}
              >
                Alat
              </button>
              {tools && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-line bg-card p-2 shadow-lg">
                  {MORE.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-navy hover:bg-sand"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative flex size-11 items-center justify-center rounded-full bg-soft text-forest hover:bg-teal hover:text-paper"
              aria-label={`Buka keranjang, ${count} item`}
            >
              <ShoppingBag className="size-5" aria-hidden="true" />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-coral text-xs font-bold text-paper">
                  {count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="flex size-11 items-center justify-center rounded-full bg-navy text-paper xl:hidden"
              aria-expanded={menu}
              aria-label={menu ? "Tutup menu" : "Buka menu"}
              onClick={() => setMenu((v) => !v)}
            >
              {menu ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {menu && (
          <nav aria-label="Menu seluler" className="border-t border-line bg-cream xl:hidden">
            <ul className="mx-auto flex max-w-6xl flex-col px-3 py-2">
              {[...NAV, ...MORE].map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className="block rounded-xl px-3 py-3 font-semibold text-navy hover:bg-soft"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main className="min-h-[70vh]">{children}</main>

      <footer className="mt-16 bg-navy text-paper">
        <div className="tb-stripe h-1.5" aria-hidden="true" />
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3">
              <img src="/images/logo-pb.jpeg" alt="" className="size-12 rounded-full object-cover" />
              <p className="font-serif text-xl font-bold">Pelajar Berkarakter</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-paper/80">
              Mendidik dengan karakter, bertumbuh dengan makna. Metode TB-40 digagas Ust. Abdul Kholiq untuk
              mengenali fitrah bakat sebelum berinteraksi.
            </p>
          </div>
          <div>
            <p className="mb-3 font-semibold text-gold">Jelajahi</p>
            <ul className="flex flex-col gap-2 text-sm text-paper/85">
              {[...NAV.slice(1), ...MORE].map((l) => (
                <li key={l.href}>
                  <Link to={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 font-semibold text-gold">Ikuti</p>
            <ul className="flex flex-wrap gap-2">
              {[
                ["Instagram", "https://instagram.com"],
                ["YouTube", "https://youtube.com"],
                ["WhatsApp", "https://wa.me/6287771245600"],
              ].map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-11 items-center rounded-full border border-paper/25 px-4 text-sm hover:border-gold hover:text-gold"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 font-serif text-sm italic text-paper/75">
              “Muliakanlah anak-anakmu dan perbaikilah adab mereka.” — HR. Ibnu Majah
            </p>
          </div>
        </div>
        <p className="border-t border-paper/10 py-4 text-center text-xs text-paper/60">
          © {new Date().getFullYear()} Pelajar Berkarakter. Hasil tes adalah gambaran kecenderungan, bukan diagnosis.
        </p>
      </footer>

      <a
        href="https://wa.me/6287771245600"
        target="_blank"
        rel="noreferrer"
        className="fixed right-4 bottom-4 z-30 inline-flex h-12 items-center rounded-full bg-forest px-5 text-sm font-bold text-paper shadow-lg hover:bg-teal"
      >
        Tanya WhatsApp
      </a>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40" role="presentation" onClick={() => setOpen(false)}>
          <aside
            role="dialog"
            aria-label="Keranjang"
            className="flex h-full w-full max-w-md flex-col bg-cream shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="font-serif text-2xl text-navy">Keranjang</h2>
              <button type="button" className="flex size-11 items-center justify-center rounded-full bg-sand" onClick={() => setOpen(false)} aria-label="Tutup keranjang">
                <X className="size-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <p className="text-muted">Keranjang masih kosong. Lihat etalase di toko.</p>
              ) : (
                <ul className="flex flex-col gap-4">
                  {items.map((item) => (
                    <li key={item.id} className="rounded-2xl border border-line bg-card p-4">
                      <p className="font-semibold text-navy">{item.name}</p>
                      <p className="text-sm text-muted">{idr(item.priceIdr)}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button type="button" className="flex size-11 items-center justify-center rounded-full bg-sand" aria-label="Kurangi" onClick={() => setQty(item.id, item.qty - 1)}>
                          <Minus className="size-4" />
                        </button>
                        <span className="w-8 text-center font-bold">{item.qty}</span>
                        <button type="button" className="flex size-11 items-center justify-center rounded-full bg-sand" aria-label="Tambah" onClick={() => setQty(item.id, item.qty + 1)}>
                          <Plus className="size-4" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="border-t border-line p-5">
              <p className="flex justify-between font-semibold text-navy">
                <span>Total</span>
                <span>{idr(total)}</span>
              </p>
              <Link
                to="/checkout"
                onClick={() => setOpen(false)}
                className={cn(
                  "mt-4 flex h-12 items-center justify-center rounded-full bg-coral font-bold text-paper",
                  items.length === 0 && "pointer-events-none opacity-50",
                )}
              >
                Lanjut pesan
              </Link>
              <p className="mt-2 text-center text-xs text-muted">Pesanan dikirim ke admin lewat WhatsApp.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

export function PageHero({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string;
  title: string;
  lede?: string;
  children?: ReactNode;
}) {
  return (
    <section className="islamic-pattern border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <p className="text-sm font-bold tracking-widest text-teal uppercase">{kicker}</p>
        <h1 className="mt-2 max-w-3xl font-serif text-3xl font-bold text-navy md:text-5xl">{title}</h1>
        {lede && <p className="mt-3 max-w-2xl text-lg text-muted">{lede}</p>}
        {children}
      </div>
    </section>
  );
}

export function productCategory(p: Product) {
  return CATEGORY_LABELS[p.category];
}
