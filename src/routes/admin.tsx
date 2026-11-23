import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ADMIN_EMAIL,
  useAdminStore,
  type AdminQuote,
  type AdminSponsor,
} from "@/lib/admin-store";
import type { ContentItem, Product, QuizItem } from "@/data/catalog";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/data/catalog";
import { idr } from "@/lib/format";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Ruang Admin — Pelajar Berkarakter" }] }),
});

type Tab =
  | "ringkas"
  | "konten"
  | "produk"
  | "kuis"
  | "quote"
  | "sponsor";

function AdminPage() {
  const store = useAdminStore();
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("ringkas");

  useEffect(() => {
    void Promise.resolve(useAdminStore.persist.rehydrate()).finally(() => setReady(true));
  }, []);

  const loggedIn = ready && store.isLoggedIn();
  const needsSetup = ready && !store.passwordHash;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const result = needsSetup
        ? await store.setupPassword(password)
        : await store.login(email, password);
      if (!result.ok) setError(result.error);
      else setPassword("");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center text-muted">Memuat Ruang Admin…</div>
    );
  }

  if (!loggedIn) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Ruang Admin</p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-navy">
            {needsSetup ? "Buat kata sandi admin" : "Masuk sebagai admin"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            Akses khusus untuk <strong className="text-ink">{ADMIN_EMAIL}</strong>.
            {needsSetup
              ? " Akun belum disetel — buat kata sandi pertama (minimal 8 karakter)."
              : " Gunakan email admin dan kata sandi Anda."}
          </p>
          <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3">
            <label className="block text-sm font-medium text-ink">
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5"
                autoComplete="username"
                required
              />
            </label>
            <label className="block text-sm font-medium text-ink">
              Kata sandi
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2.5"
                autoComplete={needsSetup ? "new-password" : "current-password"}
                minLength={needsSetup ? 8 : 1}
                required
              />
            </label>
            {error && (
              <p className="rounded-xl bg-coral/10 px-3 py-2 text-sm text-coral" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={busy}
              className="rounded-full bg-navy px-5 py-2.5 font-semibold text-paper hover:bg-teal disabled:opacity-60"
            >
              {busy ? "Memproses…" : needsSetup ? "Simpan kata sandi & masuk" : "Masuk"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            <Link to="/" className="text-teal underline-offset-2 hover:underline">
              Kembali ke beranda
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "ringkas", label: "Ringkas" },
    { id: "konten", label: "Konten" },
    { id: "produk", label: "Produk" },
    { id: "kuis", label: "Kuis" },
    { id: "quote", label: "Kartu / Quote" },
    { id: "sponsor", label: "Sponsor" },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-teal">Ruang Admin</p>
          <h1 className="mt-1 font-serif text-3xl font-bold text-navy">Kelola website</h1>
          <p className="mt-1 text-sm text-muted">
            Masuk sebagai <strong>{ADMIN_EMAIL}</strong>. Perubahan tersimpan di perangkat ini dan
            langsung dipakai halaman publik di browser yang sama.
          </p>
        </div>
        <button
          type="button"
          onClick={() => store.logout()}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-navy hover:bg-soft"
        >
          Keluar
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={
              tab === t.id
                ? "rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper"
                : "rounded-full bg-soft px-4 py-2 text-sm font-semibold text-navy hover:bg-sand"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "ringkas" && <SummaryTab />}
        {tab === "konten" && <ContentsTab />}
        {tab === "produk" && <ProductsTab />}
        {tab === "kuis" && <QuizzesTab />}
        {tab === "quote" && <QuotesTab />}
        {tab === "sponsor" && <SponsorsTab />}
      </div>
    </div>
  );
}

function SummaryTab() {
  const contents = useAdminStore((s) => s.contents);
  const products = useAdminStore((s) => s.products);
  const quizzes = useAdminStore((s) => s.quizzes);
  const quotes = useAdminStore((s) => s.quotes);
  const sponsors = useAdminStore((s) => s.sponsors);
  const reset = useAdminStore((s) => s.resetCatalogFromDefaults);

  const cards = [
    { label: "Konten parenting", n: contents.length },
    { label: "Produk toko", n: products.length },
    { label: "Soal kuis", n: quizzes.length },
    { label: "Quote kartu", n: quotes.length },
    { label: "Sponsor", n: sponsors.length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-line bg-card p-4">
            <p className="text-3xl font-bold text-navy">{c.n}</p>
            <p className="text-sm text-muted">{c.label}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl border border-line bg-card p-5">
        <h2 className="font-serif text-lg font-bold text-navy">Catatan</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted">
          <li>Data admin disimpan di browser (localStorage) — cocok untuk MVP dan demo.</li>
          <li>Bisa dipublikasikan di Grok maupun Vercel/hosting lain; tidak bergantung pada server Grok.</li>
          <li>
            Untuk database bersama banyak perangkat, nanti bisa dihubungkan ke Neon / Postgres.
          </li>
        </ul>
        <button
          type="button"
          onClick={() => {
            if (confirm("Kembalikan semua konten/produk/kuis ke data bawaan?")) reset();
          }}
          className="mt-4 rounded-full border border-coral/40 px-4 py-2 text-sm font-semibold text-coral hover:bg-coral/10"
        >
          Reset ke data bawaan
        </button>
      </div>
    </div>
  );
}

function ContentsTab() {
  const items = useAdminStore((s) => s.contents);
  const upsert = useAdminStore((s) => s.upsertContent);
  const remove = useAdminStore((s) => s.removeContent);
  const emptyContent = (): ContentItem => ({
    id: `c-${Date.now()}`,
    kind: "Artikel",
    title: "",
    theme: "",
    source: "",
    url: "",
    excerpt: "",
  });
  const [draft, setDraft] = useState<ContentItem>(emptyContent());
  const [editIndex, setEditIndex] = useState<number | undefined>();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="space-y-3 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          upsert(draft, editIndex);
          setDraft(emptyContent());
          setEditIndex(undefined);
        }}
      >
        <h2 className="font-serif text-lg font-bold text-navy">
          {editIndex !== undefined ? "Edit konten" : "Tambah konten"}
        </h2>
        <label className="block text-sm font-medium">
          Jenis
          <select
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            value={draft.kind}
            onChange={(e) =>
              setDraft({ ...draft, kind: e.target.value as ContentItem["kind"] })
            }
          >
            <option value="Artikel">Artikel</option>
            <option value="Video">Video</option>
            <option value="Slide IG">Slide IG</option>
          </select>
        </label>
        <Field label="Judul" value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} required />
        <Field label="Tema" value={draft.theme} onChange={(v) => setDraft({ ...draft, theme: v })} />
        <Field label="Sumber" value={draft.source} onChange={(v) => setDraft({ ...draft, source: v })} />
        <Field label="URL" value={draft.url} onChange={(v) => setDraft({ ...draft, url: v })} />
        <label className="block text-sm font-medium">
          Cuplikan
          <textarea
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            rows={3}
            value={draft.excerpt}
            onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
          />
        </label>
        <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper">
          Simpan
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={item.id ?? i} className="flex items-start justify-between gap-2 rounded-xl border border-line bg-card p-3">
            <div>
              <p className="font-semibold text-navy">{item.title}</p>
              <p className="text-xs text-muted">
                {item.kind} · {item.theme} · {item.source}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="text-xs font-semibold text-teal"
                onClick={() => {
                  setDraft(item);
                  setEditIndex(i);
                }}
              >
                Edit
              </button>
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => remove(i)}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProductsTab() {
  const items = useAdminStore((s) => s.products);
  const upsert = useAdminStore((s) => s.upsertProduct);
  const remove = useAdminStore((s) => s.removeProduct);
  const empty: Product = {
    id: "",
    name: "",
    category: "ebook",
    description: "",
    priceIdr: 0,
  };
  const [draft, setDraft] = useState<Product>(empty);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="space-y-3 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.id.trim() || !draft.name.trim()) return;
          upsert({
            ...draft,
            priceIdr: draft.priceIdr === null || Number.isNaN(Number(draft.priceIdr)) ? null : Number(draft.priceIdr),
          });
          setDraft(empty);
        }}
      >
        <h2 className="font-serif text-lg font-bold text-navy">Tambah / perbarui produk</h2>
        <Field label="ID unik (mis. ebook-baru)" value={draft.id} onChange={(v) => setDraft({ ...draft, id: v })} required />
        <Field label="Nama" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} required />
        <label className="block text-sm font-medium">
          Kategori
          <select
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value as Product["category"] })}
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Harga (Rp, kosongkan jika eksternal)"
          value={draft.priceIdr == null ? "" : String(draft.priceIdr)}
          onChange={(v) => setDraft({ ...draft, priceIdr: v === "" ? null : Number(v) })}
        />
        <Field label="Badge" value={draft.badge ?? ""} onChange={(v) => setDraft({ ...draft, badge: v })} />
        <Field label="URL eksternal" value={draft.externalUrl ?? ""} onChange={(v) => setDraft({ ...draft, externalUrl: v })} />
        <label className="block text-sm font-medium">
          Deskripsi
          <textarea
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            rows={3}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
        </label>
        <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper">
          Simpan produk
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-2 rounded-xl border border-line bg-card p-3">
            <div>
              <p className="font-semibold text-navy">{p.name}</p>
              <p className="text-xs text-muted">
                {CATEGORY_LABELS[p.category]} · {p.priceIdr != null ? idr(p.priceIdr) : "Eksternal"}
              </p>
            </div>
            <div className="flex gap-1">
              <button type="button" className="text-xs font-semibold text-teal" onClick={() => setDraft(p)}>
                Edit
              </button>
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => remove(p.id)}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuizzesTab() {
  const items = useAdminStore((s) => s.quizzes);
  const upsert = useAdminStore((s) => s.upsertQuiz);
  const remove = useAdminStore((s) => s.removeQuiz);
  const [draft, setDraft] = useState<QuizItem>({
    question: "",
    options: ["", "", ""],
    answer: 0,
    why: "",
  });
  const [editIndex, setEditIndex] = useState<number | undefined>();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="space-y-3 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          upsert(
            {
              ...draft,
              options: draft.options.map((o) => o.trim()).filter(Boolean),
            },
            editIndex,
          );
          setDraft({ question: "", options: ["", "", ""], answer: 0, why: "" });
          setEditIndex(undefined);
        }}
      >
        <h2 className="font-serif text-lg font-bold text-navy">
          {editIndex !== undefined ? "Edit soal" : "Tambah soal kuis"}
        </h2>
        <label className="block text-sm font-medium">
          Pertanyaan
          <textarea
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            rows={2}
            required
            value={draft.question}
            onChange={(e) => setDraft({ ...draft, question: e.target.value })}
          />
        </label>
        {draft.options.map((opt, i) => (
          <Field
            key={i}
            label={`Opsi ${i + 1}${draft.answer === i ? " (benar)" : ""}`}
            value={opt}
            onChange={(v) => {
              const options = draft.options.slice();
              options[i] = v;
              setDraft({ ...draft, options });
            }}
          />
        ))}
        <label className="block text-sm font-medium">
          Indeks jawaban benar (0–2)
          <input
            type="number"
            min={0}
            max={2}
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            value={draft.answer}
            onChange={(e) => setDraft({ ...draft, answer: Number(e.target.value) })}
          />
        </label>
        <Field label="Penjelasan" value={draft.why} onChange={(v) => setDraft({ ...draft, why: v })} />
        <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper">
          Simpan soal
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((q, i) => (
          <li key={i} className="rounded-xl border border-line bg-card p-3">
            <p className="font-semibold text-navy">{q.question}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="text-xs font-semibold text-teal"
                onClick={() => {
                  setDraft({ ...q, options: [...q.options] });
                  setEditIndex(i);
                }}
              >
                Edit
              </button>
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => remove(i)}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuotesTab() {
  const items = useAdminStore((s) => s.quotes);
  const upsert = useAdminStore((s) => s.upsertQuote);
  const remove = useAdminStore((s) => s.removeQuote);
  const [draft, setDraft] = useState<AdminQuote>({ text: "", source: "" });
  const [editIndex, setEditIndex] = useState<number | undefined>();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="space-y-3 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          upsert(draft, editIndex);
          setDraft({ text: "", source: "" });
          setEditIndex(undefined);
        }}
      >
        <h2 className="font-serif text-lg font-bold text-navy">Quote / kartu parenting</h2>
        <label className="block text-sm font-medium">
          Teks
          <textarea
            className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
            rows={3}
            required
            value={draft.text}
            onChange={(e) => setDraft({ ...draft, text: e.target.value })}
          />
        </label>
        <Field label="Sumber" value={draft.source} onChange={(v) => setDraft({ ...draft, source: v })} />
        <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper">
          Simpan
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((q, i) => (
          <li key={i} className="rounded-xl border border-line bg-card p-3">
            <p className="text-navy">“{q.text}”</p>
            <p className="text-xs text-muted">{q.source}</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className="text-xs font-semibold text-teal"
                onClick={() => {
                  setDraft(q);
                  setEditIndex(i);
                }}
              >
                Edit
              </button>
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => remove(i)}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SponsorsTab() {
  const items = useAdminStore((s) => s.sponsors);
  const upsert = useAdminStore((s) => s.upsertSponsor);
  const remove = useAdminStore((s) => s.removeSponsor);
  const [draft, setDraft] = useState<AdminSponsor>({ name: "", url: "", note: "" });
  const [editIndex, setEditIndex] = useState<number | undefined>();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        className="space-y-3 rounded-2xl border border-line bg-card p-5"
        onSubmit={(e) => {
          e.preventDefault();
          upsert(draft, editIndex);
          setDraft({ name: "", url: "", note: "" });
          setEditIndex(undefined);
        }}
      >
        <h2 className="font-serif text-lg font-bold text-navy">Sponsor / mitra</h2>
        <Field label="Nama" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} required />
        <Field label="URL" value={draft.url} onChange={(v) => setDraft({ ...draft, url: v })} />
        <Field label="Catatan" value={draft.note} onChange={(v) => setDraft({ ...draft, note: v })} />
        <button type="submit" className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-paper">
          Simpan
        </button>
      </form>
      <ul className="space-y-2">
        {items.map((s, i) => (
          <li key={i} className="flex items-start justify-between gap-2 rounded-xl border border-line bg-card p-3">
            <div>
              <p className="font-semibold text-navy">{s.name}</p>
              <p className="text-xs text-muted">{s.note}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                className="text-xs font-semibold text-teal"
                onClick={() => {
                  setDraft(s);
                  setEditIndex(i);
                }}
              >
                Edit
              </button>
              <button type="button" className="text-xs font-semibold text-coral" onClick={() => remove(i)}>
                Hapus
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="block text-sm font-medium text-ink">
      {label}
      <input
        className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
