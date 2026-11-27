import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ChatMessage = { id: string; from: "pengunjung" | "admin"; text: string; at: string };
export type ChatThread = { id: string; name: string; messages: ChatMessage[]; updatedAt: string };

export type OrderStatus = "menunggu" | "dibayar" | "selesai" | "batal";
export type Order = {
  id: string;
  at: string;
  name: string;
  phone: string;
  items: { id: string; name: string; qty: number; priceIdr: number }[];
  total: number;
  method: "midtrans" | "whatsapp";
  status: OrderStatus;
};

type SiteState = {
  visitorId: string;
  threads: ChatThread[];
  orders: Order[];
  pageViews: Record<string, number>;
  ensureVisitor: () => void;
  trackView: (path: string) => void;
  sendChat: (from: ChatMessage["from"], text: string, threadId?: string, name?: string) => string;
  addOrder: (o: Order) => void;
  setOrderStatus: (id: string, status: OrderStatus) => void;
};

const uid = () => crypto.randomUUID().slice(0, 8);

export const useSite = create<SiteState>()(
  persist(
    (set, get) => ({
      visitorId: "",
      threads: [],
      orders: [],
      pageViews: {},
      ensureVisitor: () => {
        if (!get().visitorId) set({ visitorId: uid() });
      },
      trackView: (path) =>
        set({ pageViews: { ...get().pageViews, [path]: (get().pageViews[path] ?? 0) + 1 } }),
      sendChat: (from, text, threadId, name) => {
        const id = threadId ?? get().visitorId ?? uid();
        const now = new Date().toISOString();
        const msg: ChatMessage = { id: uid(), from, text, at: now };
        const threads = get().threads.slice();
        const i = threads.findIndex((t) => t.id === id);
        if (i >= 0) threads[i] = { ...threads[i], messages: [...threads[i].messages, msg], updatedAt: now };
        else threads.unshift({ id, name: name || "Pengunjung", messages: [msg], updatedAt: now });
        set({ threads });
        return id;
      },
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
      setOrderStatus: (id, status) =>
        set({ orders: get().orders.map((o) => (o.id === id ? { ...o, status } : o)) }),
    }),
    { name: "pb-site-v1", skipHydration: true },
  ),
);

const NS = "pelajarberkarakter";

/** Penghitung pengunjung global (counterapi.dev). Gagal → null. */
export async function hitVisitors(): Promise<number | null> {
  try {
    const seen = sessionStorage.getItem("pb-counted") === "1";
    const url = `https://api.counterapi.dev/v1/${NS}/visits/${seen ? "" : "up"}`;
    const r = await fetch(url);
    const j = (await r.json()) as { count?: number };
    sessionStorage.setItem("pb-counted", "1");
    return typeof j.count === "number" ? j.count : null;
  } catch {
    return null;
  }
}

export async function getBuyers(): Promise<number | null> {
  try {
    const r = await fetch(`https://api.counterapi.dev/v1/${NS}/buyers/`);
    const j = (await r.json()) as { count?: number };
    return typeof j.count === "number" ? j.count : 0;
  } catch {
    return null;
  }
}
