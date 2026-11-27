import { Link, createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { PageHero } from "@/components/shell";
import { idr, waLink } from "@/lib/format";
import { useCart } from "@/lib/store";
import { createPayment } from "@/lib/payment";
import { useSite } from "@/lib/site-store";

declare global {
  interface Window {
    snap?: { pay: (token: string, cb: Record<string, () => void>) => void };
  }
}

function loadSnap(clientKey: string, production: boolean) {
  return new Promise<void>((resolve, reject) => {
    if (window.snap) return resolve();
    const el = document.createElement("script");
    el.src = `https://app${production ? "" : ".sandbox"}.midtrans.com/snap/snap.js`;
    el.dataset.clientKey = clientKey;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error("snap.js gagal dimuat"));
    document.head.appendChild(el);
  });
}

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

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  function waFallback(order: SavedOrder) {
    const lines = items.map((i) => `• ${i.name} × ${i.qty} = ${idr(i.priceIdr * i.qty)}`).join("\n");
    const text = `Assalamu'alaikum, saya ${name.trim()} ingin memesan di Pelajar Berkarakter.\nNo. pesanan: ${order.id}\nHP: ${phone || "-"}\n\n${lines}\nTotal: ${idr(total)}\nCatatan: ${note || "-"}`;
    window.open(waLink(text), "_blank", "noopener,noreferrer");
  }

  function record(order: SavedOrder, method: "midtrans" | "whatsapp", status: "menunggu" | "dibayar") {
    void useSite.persist.rehydrate();
    useSite.getState().addOrder({
      id: order.id,
      at: order.at,
      name: order.name,
      phone,
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.qty, priceIdr: i.priceIdr })),
      total,
      method,
      status,
    });
    const prev = readOrders();
    localStorage.setItem("pb-orders", JSON.stringify([order, ...prev].slice(0, 8)));
    void fetch("https://api.counterapi.dev/v1/pelajarberkarakter/buyers/up").catch(() => undefined);
    clear();
    setDone(order);
  }

  async function submit(e: FormEvent, mode: "pay" | "wa" = "pay") {
    e.preventDefault();
    if (!name.trim() || items.length === 0) return;
    setErr("");
    const order: SavedOrder = {
      id: "PB" + crypto.randomUUID().slice(0, 8).toUpperCase(),
      at: new Date().toISOString(),
      name: name.trim(),
      total,
    };
    if (mode === "wa") {
      waFallback(order);
      record(order, "whatsapp", "menunggu");
      return;
    }
    setBusy(true);
    try {
      const r = await createPayment({
        data: { orderId: order.id, name: order.name, phone, items: items.map((i) => ({ id: i.id, qty: i.qty })) },
      });
      if (!r.ok) {
        setErr(
          r.reason === "not-configured"
            ? "Pembayaran online belum aktif. Gunakan tombol WhatsApp untuk memesan."
            : `Pembayaran online gagal (${r.message}). Anda bisa memesan lewat WhatsApp.`,
        );
        return;
      }
      await loadSnap(r.clientKey, r.production);
      window.snap?.pay(r.token, {
        onSuccess: () => record(order, "midtrans", "dibayar"),
        onPending: () => record(order, "midtrans", "menunggu"),
        onError: () => setErr("Pembayaran gagal. Silakan coba lagi."),
        onClose: () => undefined,
      });
    } catch {
      setErr("Tidak bisa terhubung ke payment gateway. Coba lagi atau pesan lewat WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <>
        <PageHero kicker="Pesanan" title="Pesanan tercatat" lede={`Nomor pesanan ${done.id}. Simpan nomor ini bila perlu bertanya ke admin.`} />
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
      <PageHero kicker="Checkout" title="Kirim pesanan" lede="Isi data Anda, lalu bayar online lewat Midtrans atau kirim pesanan ke admin via WhatsApp." />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-5">
        <form onSubmit={(e) => void submit(e, "pay")} className="rounded-3xl border border-line bg-card p-6 lg:col-span-3">
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
          {err && <p role="alert" className="mt-4 text-sm text-coral">{err}</p>}
          <button type="submit" disabled={items.length === 0 || busy} className="mt-5 h-12 w-full rounded-full bg-coral font-bold text-paper disabled:opacity-50">
            {busy ? "Memproses…" : "Bayar online (QRIS, VA, e-wallet)"}
          </button>
          <button type="button" disabled={items.length === 0 || !name.trim()} onClick={(e) => void submit(e as unknown as FormEvent, "wa")} className="mt-3 h-12 w-full rounded-full border border-navy font-bold text-navy disabled:opacity-50">
            Pesan lewat WhatsApp
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
