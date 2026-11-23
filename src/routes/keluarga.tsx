import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHero } from "@/components/shell";
import { useFamily } from "@/lib/store";
import {
  ROLES,
  TYPE_META,
  TYPE_ORDER,
  egoAdvice,
  frictionOf,
  metaByName,
  pairAdvice,
  roleOf,
  type FamilyRole,
  type SocialName,
} from "@/lib/tb40";

export const Route = createFileRoute("/keluarga")({ component: KeluargaPage });

function KeluargaPage() {
  const members = useFamily((s) => s.members);
  const add = useFamily((s) => s.add);
  const remove = useFamily((s) => s.remove);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState<FamilyRole>("Anak");
  const [typeName, setTypeName] = useState(TYPE_META.ti.name);
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");

  useEffect(() => {
    void Promise.resolve(useFamily.persist.rehydrate()).then(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!left && members[0]) setLeft(members[0].id);
    if (!right && members[1]) setRight(members[1].id);
  }, [members, left, right]);

  const a = members.find((m) => m.id === left);
  const b = members.find((m) => m.id === right);
  const advice = a && b ? pairAdvice(a.typeName, b.typeName) : null;
  const reverse = a && b ? pairAdvice(b.typeName, a.typeName) : null;
  const ego = a && b ? egoAdvice(metaByName(a.typeName)?.ego ?? "", metaByName(b.typeName)?.ego ?? "") : null;
  const friction = a && b ? frictionOf(a.typeName, b.typeName) : null;

  const counts = useMemo(() => {
    return TYPE_ORDER.map((key) => ({
      key,
      n: members.filter((m) => m.typeName === TYPE_META[key].name).length,
    }));
  }, [members]);
  const max = Math.max(1, ...counts.map((c) => c.n));

  return (
    <>
      <PageHero
        kicker="Interaksi"
        title="Peta karakter keluarga"
        lede="Simpan hasil tes tiap anggota, lalu lihat cara mereka saling berinteraksi: saran, contoh kalimat, keseimbangan ego, dan titik rawan salah paham."
      />
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-5">
        <form
          className="rounded-3xl border border-line bg-card p-5 lg:col-span-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            const meta = metaByName(typeName);
            add({
              name: name.trim(),
              role,
              typeName: meta?.name ?? typeName,
              social: (meta?.social ?? "Introvert") as SocialName,
            });
            setName("");
          }}
        >
          <h2 className="font-serif text-2xl font-bold text-navy">Tambah anggota</h2>
          <label className="mt-4 block text-sm font-semibold">
            Nama
            <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line px-3" required />
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Peran
            <select value={role} onChange={(e) => setRole(e.target.value as FamilyRole)} className="mt-1 h-11 w-full rounded-xl border border-line px-3">
              {ROLES.map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </label>
          <label className="mt-3 block text-sm font-semibold">
            Kepribadian dominan
            <select value={typeName} onChange={(e) => setTypeName(e.target.value)} className="mt-1 h-11 w-full rounded-xl border border-line px-3">
              {TYPE_ORDER.map((k) => (
                <option key={k}>{TYPE_META[k].name}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="mt-4 h-12 w-full rounded-full bg-coral font-bold text-paper">
            Simpan di perangkat ini
          </button>
          <p className="mt-3 text-xs text-muted">
            Belum ada hasil? <Link to="/tes-karakter" search={{ hasil: "", nama: "" }} className="font-bold text-teal">Ikuti tes gratis</Link> lalu simpan dari halaman hasil.
          </p>
        </form>

        <div className="lg:col-span-3">
          {!ready ? (
            <p className="text-muted">Memuat peta…</p>
          ) : members.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-line bg-sand/60 p-8">
              <h2 className="font-serif text-2xl font-bold text-navy">Belum ada anggota</h2>
              <p className="mt-2 text-muted">Tambahkan ayah, ibu, dan anak. Data hanya tersimpan di peramban ini.</p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {members.map((m) => {
                const meta = metaByName(m.typeName);
                return (
                  <li key={m.id} className={`rounded-2xl border-l-8 bg-card p-4 ${meta?.border ?? "border-line"}`}>
                    <p className="text-xs font-bold tracking-wide text-teal uppercase">{m.role}</p>
                    <h3 className="font-serif text-xl font-bold text-navy">{m.name}</h3>
                    <p className="text-sm">{m.typeName} · {m.social}</p>
                    <p className="mt-1 text-xs text-muted">{roleOf(m.typeName)}</p>
                    <button type="button" className="mt-2 text-sm font-bold text-coral" onClick={() => remove(m.id)}>
                      Hapus
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {members.length > 0 && (
            <div className="mt-5 rounded-3xl bg-navy p-5 text-paper">
              <h3 className="font-serif text-xl font-bold">Komposisi</h3>
              <ul className="mt-4 space-y-2">
                {counts.map((c) => (
                  <li key={c.key} className="grid grid-cols-[8rem_1fr_auto] items-center gap-3 text-sm">
                    <span>{TYPE_META[c.key].name}</span>
                    <span className="h-2 overflow-hidden rounded-full bg-paper/20">
                      <span className={`block h-full ${TYPE_META[c.key].chip.split(" ")[0]}`} style={{ width: `${(c.n / max) * 100}%` }} />
                    </span>
                    <span>{c.n}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {members.length >= 2 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="font-serif text-3xl font-bold text-navy">Cara mereka berinteraksi</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <SelectMember label="Dari sudut" value={left} onChange={setLeft} options={members} />
            <SelectMember label="Kepada" value={right} onChange={setRight} options={members} />
          </div>
          {a && b && a.id !== b.id && (
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <article className="rounded-3xl border border-line bg-card p-5">
                <h3 className="font-serif text-xl font-bold text-navy">
                  {a.name} saat bersama {b.name}
                </h3>
                <p className="mt-2 text-ink/90">{advice?.advice}</p>
                {advice?.example && <p className="mt-3 font-serif italic text-forest">“{advice.example}”</p>}
              </article>
              <article className="rounded-3xl border border-line bg-card p-5">
                <h3 className="font-serif text-xl font-bold text-navy">Arah sebaliknya</h3>
                <p className="mt-2 text-ink/90">{reverse?.advice}</p>
                {reverse?.example && <p className="mt-3 font-serif italic text-forest">“{reverse.example}”</p>}
              </article>
              {ego && (
                <article className="rounded-3xl bg-soft p-5 text-forest lg:col-span-2">
                  <h3 className="font-serif text-xl font-bold">Keseimbangan ego</h3>
                  <p className="mt-2">{ego.advice}</p>
                </article>
              )}
              {friction && (
                <article className="rounded-3xl bg-accent p-5 lg:col-span-2">
                  <p className="text-xs font-bold tracking-wide text-navy uppercase">Titik rawan · {friction.level}</p>
                  <h3 className="font-serif text-xl font-bold text-navy">{friction.kind}</h3>
                  <p className="mt-2">{friction.situation}</p>
                  <p className="mt-2 font-semibold text-forest">Penawar: {friction.remedy}</p>
                </article>
              )}
            </div>
          )}
        </section>
      )}
    </>
  );
}

function SelectMember({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { id: string; name: string; role: string }[];
}) {
  return (
    <label className="text-sm font-semibold text-navy">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 h-12 w-full rounded-xl border border-line bg-card px-3">
        {options.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} · {m.role}
          </option>
        ))}
      </select>
    </label>
  );
}
