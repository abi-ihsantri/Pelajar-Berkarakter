import { useEffect, useState, type FormEvent } from "react";
import { idr } from "@/lib/format";
import { getBuyers, hitVisitors, useSite, type OrderStatus } from "@/lib/site-store";

export function ChatTab() {
  useEffect(() => {
    void useSite.persist.rehydrate();
  }, []);
  const threads = useSite((s) => s.threads);
  const sendChat = useSite((s) => s.sendChat);
  const [active, setActive] = useState<string | null>(null);
  const [text, setText] = useState("");
  const thread = threads.find((t) => t.id === (active ?? threads[0]?.id));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!thread || !text.trim()) return;
    sendChat("admin", text.trim(), thread.id, thread.name);
    setText("");
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <ul className="space-y-2 md:col-span-1">
        {threads.length === 0 && <li className="text-sm text-muted">Belum ada pesan pengunjung.</li>}
        {threads.map((t) => (
          <li key={t.id}>
            <button
              type="button"
              onClick={() => setActive(t.id)}
              className={`w-full rounded-2xl border p-3 text-left text-sm ${thread?.id === t.id ? "border-navy bg-soft" : "border-line bg-card"}`}
            >
              <strong className="text-navy">{t.name}</strong>
              <span className="block truncate text-muted">{t.messages.at(-1)?.text}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="rounded-3xl border border-line bg-card p-4 md:col-span-2">
        {thread ? (
          <>
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {thread.messages.map((m) => (
                <p key={m.id} className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "admin" ? "ml-auto bg-forest text-paper" : "bg-sand text-ink"}`}>
                  {m.text}
                </p>
              ))}
            </div>
            <form onSubmit={submit} className="mt-3 flex gap-2">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Balas pengunjung…" className="h-11 flex-1 rounded-xl border border-line px-3" />
              <button type="submit" className="h-11 rounded-full bg-navy px-5 font-bold text-paper">Kirim</button>
            </form>
          </>
        ) : (
          <p className="text-sm text-muted">Pilih percakapan.</p>
        )}
        <p className="mt-3 text-xs text-muted">
          Catatan: chat tersimpan di peramban ini. Untuk menerima pesan dari perangkat pengunjung lain, hubungkan ke database (lihat README).
        </p>
      </div>
    </div>
  );
}

export function AnalyticsTab() {
  useEffect(() => {
    void useSite.persist.rehydrate();
  }, []);
  const pageViews = useSite((s) => s.pageViews);
  const orders = useSite((s) => s.orders);
  const [visitors, setVisitors] = useState<number | null>(null);
  const [buyers, setBuyers] = useState<number | null>(null);
  useEffect(() => {
    void hitVisitors().then(setVisitors);
    void getBuyers().then(setBuyers);
  }, []);
  const rows = Object.entries(pageViews).sort((a, b) => b[1] - a[1]);
  const max = Math.max(1, ...rows.map((r) => r[1]));
  const revenue = orders.filter((o) => o.status === "dibayar" || o.status === "selesai").reduce((n, o) => n + o.total, 0);
  const stat = (label: string, v: string) => (
    <li className="rounded-2xl border border-line bg-card p-4">
      <span className="block font-serif text-3xl font-bold text-teal">{v}</span>
      <span className="text-sm font-semibold text-muted">{label}</span>
    </li>
  );
  return (
    <div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stat("Total pengunjung (global)", visitors === null ? "…" : visitors.toLocaleString("id-ID"))}
        {stat("Total pembeli (global)", buyers === null ? "…" : buyers.toLocaleString("id-ID"))}
        {stat("Pesanan di perangkat ini", String(orders.length))}
        {stat("Pendapatan terbayar", idr(revenue))}
      </ul>
      <h2 className="mt-6 font-serif text-xl font-bold text-navy">Kunjungan halaman (perangkat ini)</h2>
      <ul className="mt-3 space-y-2">
        {rows.length === 0 && <li className="text-sm text-muted">Belum ada data.</li>}
        {rows.map(([path, n]) => (
          <li key={path} className="text-sm">
            <div className="flex justify-between"><span className="font-semibold text-navy">{path}</span><span>{n}</span></div>
            <div className="mt-1 h-2 rounded-full bg-sand"><div className="h-2 rounded-full bg-teal" style={{ width: `${(n / max) * 100}%` }} /></div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const STATUSES: OrderStatus[] = ["menunggu", "dibayar", "selesai", "batal"];

export function OrdersTab() {
  useEffect(() => {
    void useSite.persist.rehydrate();
  }, []);
  const orders = useSite((s) => s.orders);
  const setStatus = useSite((s) => s.setOrderStatus);
  return (
    <div className="space-y-3">
      {orders.length === 0 && <p className="text-sm text-muted">Belum ada transaksi.</p>}
      {orders.map((o) => (
        <article key={o.id} className="rounded-2xl border border-line bg-card p-4 text-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <strong className="text-navy">{o.id} · {o.name}</strong>
            <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)} className="h-10 rounded-xl border border-line px-2">
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <p className="mt-1 text-muted">{new Date(o.at).toLocaleString("id-ID")} · {o.method === "midtrans" ? "Payment gateway" : "WhatsApp"} · {o.phone || "-"}</p>
          <ul className="mt-2">{o.items.map((i) => <li key={i.id}>{i.name} × {i.qty}</li>)}</ul>
          <p className="mt-2 font-bold text-forest">{idr(o.total)}</p>
        </article>
      ))}
    </div>
  );
}
