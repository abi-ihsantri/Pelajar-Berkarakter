import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { CATEGORY_LABELS, CATEGORY_ORDER, PRODUCTS, SPONSORS } from "@/data/catalog";
import { useAdminStore } from "@/lib/admin-store";
import { PageHero } from "@/components/shell";
import { idr } from "@/lib/format";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/toko")({ component: TokoPage });

function TokoPage() {
  useEffect(() => {
    void useAdminStore.persist.rehydrate();
  }, []);
  const adminProducts = useAdminStore((s) => s.products);
  const adminSponsors = useAdminStore((s) => s.sponsors);
  const products = adminProducts.length ? adminProducts : PRODUCTS;
  const sponsors = adminSponsors.length ? adminSponsors : SPONSORS;
  const add = useCart((s) => s.add);
  return (
    <>
      <PageHero
        kicker="Etalase"
        title="Toko Pelajar Berkarakter"
        lede="Setiap pembelian adalah kontribusi untuk gerakan pendidikan karakter. Pesanan diteruskan ke admin lewat WhatsApp, lalu pembayaran disepakati di sana."
      >
        <nav aria-label="Etalase" className="mt-5 flex flex-wrap gap-2">
          {CATEGORY_ORDER.map((c) => (
            <a key={c} href={`#${c}`} className="inline-flex h-11 items-center rounded-full bg-card px-4 text-sm font-bold text-navy ring-1 ring-line">
              {CATEGORY_LABELS[c]}
            </a>
          ))}
        </nav>
      </PageHero>
      {CATEGORY_ORDER.map((cat) => {
        const list = products.filter((p) => p.category === cat);
        return (
          <section key={cat} id={cat} className="mx-auto max-w-6xl scroll-mt-24 px-4 py-8">
            <h2 className="font-serif text-2xl font-bold text-navy">{CATEGORY_LABELS[cat]}</h2>
            {cat === "sponsor" && (
              <p className="mt-2 text-sm text-muted">Telah berjalan bersama: {sponsors.map((s) => s.name).join(", ")}.</p>
            )}
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p) => (
                <li key={p.id} className="flex flex-col rounded-3xl border border-line bg-card p-5">
                  {p.badge && <span className="mb-2 w-fit rounded-full bg-gold px-3 py-1 text-xs font-bold text-navy">{p.badge}</span>}
                  <h3 className="font-serif text-xl font-bold text-navy">{p.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted">{p.description}</p>
                  <p className="mt-4 font-bold text-forest">{p.priceIdr ? idr(p.priceIdr) : "Harga di toko mitra"}</p>
                  {p.externalUrl ? (
                    <a href={p.externalUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex h-11 items-center justify-center rounded-full border border-navy font-bold text-navy">
                      Kunjungi toko mitra
                    </a>
                  ) : (
                    <button
                      type="button"
                      className="mt-3 h-11 rounded-full bg-navy font-bold text-paper"
                      onClick={() => p.priceIdr && add({ id: p.id, name: p.name, priceIdr: p.priceIdr })}
                    >
                      Masukkan keranjang
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </>
  );
}
