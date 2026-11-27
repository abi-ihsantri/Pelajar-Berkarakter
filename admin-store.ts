import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CONTENTS,
  PRODUCTS,
  QUIZ,
  QUOTES,
  SPONSORS,
  type ContentItem,
  type Product,
  type QuizItem,
} from "@/data/catalog";

/** Hanya email ini yang boleh masuk Ruang Admin */
export const ADMIN_EMAIL = "pelajarkuberkarakter@gmail.com";

export type AdminQuote = { text: string; source: string };
export type AdminSponsor = { name: string; url: string; note: string };

type AdminState = {
  /** hash kata sandi (sha-256 hex); null = belum disetel */
  passwordHash: string | null;
  /** sesi aktif (email) */
  sessionEmail: string | null;
  sessionExpires: number | null;

  contents: ContentItem[];
  products: Product[];
  quizzes: QuizItem[];
  quotes: AdminQuote[];
  sponsors: AdminSponsor[];

  setupPassword: (password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  login: (email: string, password: string) => Promise<{ ok: true } | { ok: false; error: string }>;
  logout: () => void;
  isLoggedIn: () => boolean;

  setContents: (items: ContentItem[]) => void;
  setProducts: (items: Product[]) => void;
  setQuizzes: (items: QuizItem[]) => void;
  setQuotes: (items: AdminQuote[]) => void;
  setSponsors: (items: AdminSponsor[]) => void;

  upsertContent: (item: ContentItem, index?: number) => void;
  removeContent: (index: number) => void;
  upsertProduct: (item: Product) => void;
  removeProduct: (id: string) => void;
  upsertQuiz: (item: QuizItem, index?: number) => void;
  removeQuiz: (index: number) => void;
  upsertQuote: (item: AdminQuote, index?: number) => void;
  removeQuote: (index: number) => void;
  upsertSponsor: (item: AdminSponsor, index?: number) => void;
  removeSponsor: (index: number) => void;

  resetCatalogFromDefaults: () => void;
};

async function sha256Hex(text: string) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SESSION_DAYS = 7;

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      passwordHash: null,
      sessionEmail: null,
      sessionExpires: null,

      contents: CONTENTS.map((c) => ({ ...c })) as ContentItem[],
      products: PRODUCTS.map((p) => ({ ...p })),
      quizzes: QUIZ.map((q) => ({ ...q, options: [...q.options] })),
      quotes: QUOTES.map((q) => ({ ...q })),
      sponsors: SPONSORS.map((s) => ({ ...s })),

      setupPassword: async (password) => {
        if (password.length < 8) return { ok: false, error: "Kata sandi minimal 8 karakter." };
        const passwordHash = await sha256Hex(password);
        const expires = Date.now() + SESSION_DAYS * 86400000;
        set({
          passwordHash,
          sessionEmail: ADMIN_EMAIL,
          sessionExpires: expires,
        });
        return { ok: true };
      },

      login: async (email, password) => {
        const normalized = email.trim().toLowerCase();
        if (normalized !== ADMIN_EMAIL) {
          return { ok: false, error: "Email ini tidak diizinkan sebagai admin." };
        }
        const { passwordHash } = get();
        if (!passwordHash) {
          return { ok: false, error: "Akun belum disetel. Buat kata sandi terlebih dahulu." };
        }
        const hash = await sha256Hex(password);
        if (hash !== passwordHash) {
          return { ok: false, error: "Kata sandi salah." };
        }
        set({
          sessionEmail: ADMIN_EMAIL,
          sessionExpires: Date.now() + SESSION_DAYS * 86400000,
        });
        return { ok: true };
      },

      logout: () => set({ sessionEmail: null, sessionExpires: null }),

      isLoggedIn: () => {
        const { sessionEmail, sessionExpires } = get();
        if (!sessionEmail || sessionEmail !== ADMIN_EMAIL) return false;
        if (!sessionExpires || sessionExpires < Date.now()) return false;
        return true;
      },

      setContents: (items) => set({ contents: items }),
      setProducts: (items) => set({ products: items }),
      setQuizzes: (items) => set({ quizzes: items }),
      setQuotes: (items) => set({ quotes: items }),
      setSponsors: (items) => set({ sponsors: items }),

      upsertContent: (item, index) => {
        const list = get().contents.slice();
        if (typeof index === "number" && index >= 0 && index < list.length) list[index] = item;
        else list.unshift(item);
        set({ contents: list });
      },
      removeContent: (index) =>
        set({ contents: get().contents.filter((_, i) => i !== index) }),

      upsertProduct: (item) => {
        const list = get().products.slice();
        const i = list.findIndex((p) => p.id === item.id);
        if (i >= 0) list[i] = item;
        else list.push(item);
        set({ products: list });
      },
      removeProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),

      upsertQuiz: (item, index) => {
        const list = get().quizzes.slice();
        if (typeof index === "number" && index >= 0 && index < list.length) list[index] = item;
        else list.push(item);
        set({ quizzes: list });
      },
      removeQuiz: (index) => set({ quizzes: get().quizzes.filter((_, i) => i !== index) }),

      upsertQuote: (item, index) => {
        const list = get().quotes.slice();
        if (typeof index === "number" && index >= 0 && index < list.length) list[index] = item;
        else list.push(item);
        set({ quotes: list });
      },
      removeQuote: (index) => set({ quotes: get().quotes.filter((_, i) => i !== index) }),

      upsertSponsor: (item, index) => {
        const list = get().sponsors.slice();
        if (typeof index === "number" && index >= 0 && index < list.length) list[index] = item;
        else list.push(item);
        set({ sponsors: list });
      },
      removeSponsor: (index) => set({ sponsors: get().sponsors.filter((_, i) => i !== index) }),

      resetCatalogFromDefaults: () =>
        set({
          contents: CONTENTS.map((c) => ({ ...c })),
          products: PRODUCTS.map((p) => ({ ...p })),
          quizzes: QUIZ.map((q) => ({ ...q, options: [...q.options] })),
          quotes: QUOTES.map((q) => ({ ...q })),
          sponsors: SPONSORS.map((s) => ({ ...s })),
        }),
    }),
    {
      name: "pb-admin-v1",
      skipHydration: true,
      partialize: (s) => ({
        passwordHash: s.passwordHash,
        sessionEmail: s.sessionEmail,
        sessionExpires: s.sessionExpires,
        contents: s.contents,
        products: s.products,
        quizzes: s.quizzes,
        quotes: s.quotes,
        sponsors: s.sponsors,
      }),
    },
  ),
);

/** Data katalog yang mengikuti suntingan admin (fallback ke bawaan) */
export function useLiveCatalog() {
  const contents = useAdminStore((s) => s.contents);
  const products = useAdminStore((s) => s.products);
  const quizzes = useAdminStore((s) => s.quizzes);
  const quotes = useAdminStore((s) => s.quotes);
  const sponsors = useAdminStore((s) => s.sponsors);
  return { contents, products, quizzes, quotes, sponsors };
}
