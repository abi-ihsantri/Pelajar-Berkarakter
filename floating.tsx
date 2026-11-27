import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useSite } from "@/lib/site-store";

/** Tombol melayang: Tes Karakter Gratis (kiri) + Tanya Admin (kanan). */
export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const visitorId = useSite((s) => s.visitorId);
  const thread = useSite((s) => s.threads.find((t) => t.id === s.visitorId));
  const sendChat = useSite((s) => s.sendChat);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    void useSite.persist.rehydrate();
    useSite.getState().ensureVisitor();
  }, []);
  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [thread?.messages.length, open]);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !visitorId) return;
    sendChat("pengunjung", text.trim(), visitorId, name.trim() || undefined);
    setText("");
  }

  return (
    <>
      <Link
        to="/tes-karakter"
        search={{ hasil: "", nama: "" }}
        className="fixed bottom-4 left-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-gold px-5 text-sm font-bold text-navy shadow-lg ring-2 ring-paper hover:bg-coral hover:text-paper"
      >
        <Sparkles className="size-4" aria-hidden="true" />
        Tes Karakter Gratis
      </Link>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-30 inline-flex h-12 items-center gap-2 rounded-full bg-forest px-5 text-sm font-bold text-paper shadow-lg hover:bg-teal"
      >
        {open ? <X className="size-4" /> : <MessageCircle className="size-4" />}
        Tanya Admin
      </button>

      {open && (
        <section
          aria-label="Chat dengan admin"
          className="fixed right-4 bottom-20 z-40 flex h-[26rem] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-cream shadow-2xl"
        >
          <header className="bg-forest px-4 py-3 text-paper">
            <p className="font-serif text-lg font-bold">Tanya Admin</p>
            <p className="text-xs text-paper/80">Admin membalas saat online. Mendesak? Gunakan WhatsApp.</p>
          </header>
          <div className="flex-1 space-y-2 overflow-y-auto p-3">
            {!thread && (
              <p className="rounded-2xl bg-soft p-3 text-sm text-navy">
                Assalamu’alaikum 👋 Tulis pertanyaan Anda tentang tes TB-40, toko, atau parenting.
              </p>
            )}
            {thread?.messages.map((m) => (
              <p
                key={m.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${m.from === "pengunjung" ? "ml-auto bg-navy text-paper" : "bg-card text-ink ring-1 ring-line"}`}
              >
                {m.text}
              </p>
            ))}
            <div ref={end} />
          </div>
          <form onSubmit={submit} className="border-t border-line bg-card p-2">
            {!thread && (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda (opsional)"
                className="mb-2 h-10 w-full rounded-xl border border-line px-3 text-sm"
              />
            )}
            <div className="flex gap-2">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Tulis pesan…"
                className="h-11 min-w-0 flex-1 rounded-xl border border-line px-3 text-sm"
              />
              <button type="submit" aria-label="Kirim" className="flex size-11 items-center justify-center rounded-full bg-coral text-paper">
                <Send className="size-4" />
              </button>
            </div>
          </form>
        </section>
      )}
    </>
  );
}
