import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero } from "@/components/shell";
import { cn } from "@/lib/cn";
import { PROBLEMS, TYPE_META, TYPE_ORDER } from "@/lib/tb40";

export const Route = createFileRoute("/dampingi")({ component: DampingiPage });

function DampingiPage() {
  const [problemId, setProblemId] = useState(PROBLEMS[0]?.id ?? "");
  const [typeName, setTypeName] = useState(TYPE_META.ti.name);
  const problem = PROBLEMS.find((p) => p.id === problemId) ?? PROBLEMS[0];
  const detail = problem ? problem.byType[typeName as keyof typeof problem.byType] : undefined;

  return (
    <>
      <PageHero
        kicker="Pendampingan"
        title="Atasi masalah sesuai bakat"
        lede="Delapan persoalan yang sering muncul di rumah dan sekolah, dibaca dari kebutuhan di balik perilaku — bukan dari label nakal."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 className="font-serif text-xl font-bold text-navy">Pilih persoalan</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {PROBLEMS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setProblemId(p.id)}
                  className={cn(
                    "w-full rounded-2xl px-4 py-3 text-left font-semibold",
                    p.id === problem?.id ? "bg-navy text-paper" : "bg-card text-navy ring-1 ring-line",
                  )}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-8">
          {problem && (
            <>
              <article className="rounded-3xl border border-line bg-card p-6">
                <h2 className="font-serif text-3xl font-bold text-navy">{problem.name}</h2>
                <p className="mt-3 text-ink/90">{problem.principle}</p>
                <p className="mt-3 text-sm text-muted">{problem.role}</p>
              </article>

              <h3 className="mt-6 font-serif text-xl font-bold text-navy">Sesuaikan dengan kepribadian</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {TYPE_ORDER.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTypeName(TYPE_META[key].name)}
                    className={cn(
                      "h-11 rounded-full px-4 text-sm font-bold",
                      typeName === TYPE_META[key].name ? TYPE_META[key].chip : "bg-card text-navy ring-1 ring-line",
                    )}
                  >
                    {TYPE_META[key].name}
                  </button>
                ))}
              </div>

              {detail && (
                <div className="mt-4 grid gap-4">
                  <Block title="Kebutuhan di balik perilaku" body={detail.need} />
                  <Block title="Salurkan potensinya" body={detail.outlet} />
                  <div className="rounded-3xl bg-soft p-5">
                    <h4 className="font-bold text-forest">Langkah praktis</h4>
                    <ol className="mt-2 list-decimal space-y-1 pl-5 text-forest">
                      {detail.steps.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <blockquote className="rounded-3xl bg-accent p-5 font-serif text-lg text-navy">“{detail.sentence}”</blockquote>
                  <Block title="Sebaiknya dihindari" body={detail.avoid} />
                </div>
              )}

              <aside className="mt-4 rounded-3xl border border-coral/40 bg-card p-5 text-sm">
                <p className="font-bold text-coral">Kapan perlu tenaga profesional</p>
                <p className="mt-2 text-muted">{problem.professional}</p>
                <p className="mt-3">
                  Belum tahu tipenya?{" "}
                  <Link to="/tes-karakter" search={{ hasil: "", nama: "" }} className="font-bold text-teal">
                    Mulai dari tes gratis.
                  </Link>
                </p>
              </aside>
            </>
          )}
        </div>
      </section>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <article className="rounded-3xl border border-line bg-card p-5">
      <h4 className="font-bold text-navy">{title}</h4>
      <p className="mt-2 text-ink/90">{body}</p>
    </article>
  );
}
