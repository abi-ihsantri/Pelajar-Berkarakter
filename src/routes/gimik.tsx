import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { QUIZ, QUOTES } from "@/data/catalog";
import { useAdminStore } from "@/lib/admin-store";
import { PageHero } from "@/components/shell";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/gimik")({ component: GimikPage });

function GimikPage() {
  useEffect(() => {
    void useAdminStore.persist.rehydrate();
  }, []);
  const quizzes = useAdminStore((s) => s.quizzes);
  const quotes = useAdminStore((s) => s.quotes);
  const list = quizzes.length ? quizzes : QUIZ;
  const quoteList = quotes.length ? quotes : QUOTES;
  const quote = useMemo(() => quoteList[new Date().getDate() % quoteList.length], [quoteList]);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const item = list[Math.min(step, Math.max(list.length - 1, 0))];

  function choose(index: number) {
    if (picked !== null || !item) return;
    setPicked(index);
    if (index === item.answer) setScore((s) => s + 1);
  }

  function next() {
    if (step + 1 >= list.length) setDone(true);
    else {
      setStep(step + 1);
      setPicked(null);
    }
  }

  return (
    <>
      <PageHero
        kicker="Gimik"
        title="Kuis adab singkat"
        lede="Enam soal untuk orang tua dan guru. Bukan nilai rapor — hanya cara mengingat cara berinteraksi."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-5">
        <div className="lg:col-span-3">
          {done ? (
            <div className="rounded-3xl bg-forest p-8 text-paper">
              <p className="text-sm font-bold tracking-widest text-gold uppercase">Selesai</p>
              <h2 className="mt-2 font-serif text-4xl font-bold">{score} dari {list.length} tepat</h2>
              <p className="mt-3 text-paper/85">
                {score >= 5 ? "Anda sudah terbiasa menimbang sebelum bereaksi." : "Ulangi pelan-pelan. Yang penting cara berinteraksi, bukan kecepatan menjawab."}
              </p>
              <button
                type="button"
                className="mt-6 h-12 rounded-full bg-gold px-6 font-bold text-navy"
                onClick={() => {
                  setStep(0);
                  setPicked(null);
                  setScore(0);
                  setDone(false);
                }}
              >
                Ulangi kuis
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-line bg-card p-6">
              <p className="text-sm font-bold text-teal">Soal {step + 1} / {list.length}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-navy">{item.question}</h2>
              <ul className="mt-4 flex flex-col gap-2">
                {item.options.map((option, index) => {
                  const show = picked !== null;
                  const correct = index === item.answer;
                  const chosen = index === picked;
                  return (
                    <li key={option}>
                      <button
                        type="button"
                        onClick={() => choose(index)}
                        className={cn(
                          "w-full rounded-2xl border-2 px-4 py-3 text-left font-medium",
                          !show && "border-line hover:border-teal",
                          show && correct && "border-forest bg-soft",
                          show && chosen && !correct && "border-coral bg-accent",
                          show && !correct && !chosen && "border-line opacity-70",
                        )}
                      >
                        {option}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {picked !== null && (
                <div className="mt-4">
                  <p className="text-sm text-ink">{item.why}</p>
                  <button type="button" className="mt-3 h-11 rounded-full bg-navy px-5 font-bold text-paper" onClick={next}>
                    {step + 1 === list.length ? "Lihat skor" : "Soal berikutnya"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <aside className="rounded-3xl bg-accent p-6 lg:col-span-2">
          <p className="text-sm font-bold tracking-widest text-navy uppercase">Kutipan hari ini</p>
          <blockquote className="mt-3 font-serif text-2xl text-navy">“{quote.text}”</blockquote>
          <p className="mt-3 text-sm font-semibold text-forest">{quote.source}</p>
        </aside>
      </section>
    </>
  );
}
