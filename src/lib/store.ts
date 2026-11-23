import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FamilyRole, SocialName } from "@/lib/tb40";

export type CartItem = { id: string; name: string; priceIdr: number; qty: number };

type CartState = {
  items: CartItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  add: (item: Omit<CartItem, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      open: false,
      setOpen: (open) => set({ open }),
      add: (item) => {
        const items = get().items.slice();
        const found = items.find((i) => i.id === item.id);
        if (found) found.qty += 1;
        else items.push({ ...item, qty: 1 });
        set({ items, open: true });
      },
      setQty: (id, qty) =>
        set({
          items: get()
            .items.map((i) => (i.id === id ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        }),
      clear: () => set({ items: [] }),
    }),
    { name: "pb-cart", skipHydration: true, partialize: (s) => ({ items: s.items }) },
  ),
);

export type FamilyMember = {
  id: string;
  name: string;
  role: FamilyRole;
  typeName: string;
  social: SocialName;
};

type FamilyState = {
  members: FamilyMember[];
  add: (member: Omit<FamilyMember, "id">) => void;
  remove: (id: string) => void;
};

export const useFamily = create<FamilyState>()(
  persist(
    (set, get) => ({
      members: [],
      add: (member) =>
        set({
          members: [...get().members, { ...member, id: crypto.randomUUID() }],
        }),
      remove: (id) => set({ members: get().members.filter((m) => m.id !== id) }),
    }),
    { name: "pb-family", skipHydration: true },
  ),
);

type JournalState = {
  days: Record<string, string[]>;
  toggle: (date: string, habit: string) => void;
};

export const useJournal = create<JournalState>()(
  persist(
    (set, get) => ({
      days: {},
      toggle: (date, habit) => {
        const current = get().days[date] ?? [];
        const next = current.includes(habit) ? current.filter((h) => h !== habit) : [...current, habit];
        set({ days: { ...get().days, [date]: next } });
      },
    }),
    { name: "pb-journal", skipHydration: true },
  ),
);

export function useHydrateStores() {
  if (typeof window !== "undefined" && !(window as unknown as { __pbHydrated?: boolean }).__pbHydrated) {
    (window as unknown as { __pbHydrated?: boolean }).__pbHydrated = true;
    void useCart.persist.rehydrate();
    void useFamily.persist.rehydrate();
    void useJournal.persist.rehydrate();
  }
}
