import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/shell";
import { idr, waLink } from "@/lib/format";
import { useCart } from "@/lib/store";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

type SavedOrder = { id: string; at: string; name: string; total: number };

function readOrders(): SavedOrder[] {
  try {
    return JSON.parse(localStorage.getItem("pb-orders") ?? "[]") as SavedOrder[];
  } catch {
    return [];
  }
}

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [done, setDone] = useState<SavedOrder | null>(null);
  const total = items.reduce((n, i) => n + i.priceIdr * i.qty, 0);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || items.length === 0) return;
    const lines = items.map((i) => `• ${i.name} × ${i.qty} = ${idr(i.priceIdr * i.qty)}`).join("\n");
    const text = `Assalamu'alaikum, saya ${name.trim()} ingin memesan di Pelajar Berkarakter.\nHP: ${phone || "-"}\n\n${lines}\nTotal: ${idr(total)}\nCatatan: ${note || "-"}`;
    const order: SavedOrder = {
      id: crypto.randomUUID().slice(0, 8).toUpperCase(),
      at: new Date().toISOString(),
      name: name.trim(),
      total,
    };
    const prev = readOrders();
    localStorage.setItem("pb-orders", JSON.stringify([order, ...prev].slice(0, 8)));
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    clear();
    setDone(order);
  }

  if (done) {
    return (
      <>
        <PageHero kicker="Pesanan" title="Pesan WhatsApp sudah disiapkan" lede={`Nomor pesanan ${done.id} tersimpan di perangkat ini. Selesaikan pembayaran bersama admin.`} />
        <div className="mx-auto max-w-xl px-4 py-8">
          <Link to="/toko" className="inline-flex h-12 items-center rounded-full bg-navy px-6 font-bold text-paper">
            Kembali ke toko
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero kicker="Checkout" title="Kirim pesanan" lede="Isi nama Anda. Kami membuka WhatsApp dengan rincian pesanan yang sudah tersusun." />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-5">
        <form onSubmit={submit} className="rounded-3xl border border-line bg-card p-6 lg:col-span-3">
          <label className="block text-sm font-semibold">
            Nama
            <input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-line px-3" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            WhatsApp
            <input value={phone} onChange={(e) => setPhone(e.target.value)} inputMode="tel" className="mt-1 h-12 w-full rounded-xl border border-line px-3" placeholder="08…" />
          </label>
          <label className="mt-4 block text-sm font-semibold">
            Catatan
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={4} className="mt-1 w-full rounded-xl border border-line px-3 py-2" placeholder="Untuk siapa tes ini, alamat sekolah, atau permintaan lain" />
          </label>
          <button type="submit" disabled={items.length === 0} className="mt-5 h-12 w-full rounded-full bg-coral font-bold text-paper disabled:opacity-50">
            Buka WhatsApp
          </button>
        </form>
        <aside className="rounded-3xl bg-sand p-6 lg:col-span-2">
          <h2 className="font-serif text-2xl font-bold text-navy">Ringkasan</h2>
          {items.length === 0 ? (
            <p className="mt-3 text-muted">
              Keranjang kosong. <Link to="/toko" className="font-bold text-teal">Pilih produk</Link>
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span>{i.name} × {i.qty}</span>
                  <span className="font-semibold">{idr(i.priceIdr * i.qty)}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 flex justify-between border-t border-line pt-3 font-bold text-navy">
            <span>Total</span>
            <span>{idr(total)}</span>
          </p>
        </aside>
      </section>
    </>
  );
}
