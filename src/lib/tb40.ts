import raw from "@/data/tb40.json";

export type AnswerKey = "i" | "e" | "t" | "s" | "r";
export type TypeKey = "ti" | "te" | "si" | "se" | "ri" | "re";
export type SocialName = "Introvert" | "Ekstrovert" | "Ambivert";

export const TYPE_ORDER: TypeKey[] = ["ti", "te", "si", "se", "ri", "re"];

export const TYPE_META: Record<
  TypeKey,
  {
    name: string;
    ego: "Ego Tinggi" | "Ego Sedang" | "Ego Rendah";
    social: Exclude<SocialName, "Ambivert">;
    chip: string;
    soft: string;
    border: string;
    text: string;
    desc: string;
    tip: string;
  }
> = {
  ti: {
    name: "Bekerja Keras",
    ego: "Ego Tinggi",
    social: "Introvert",
    chip: "bg-tb1 text-ink",
    soft: "bg-tb1/20",
    border: "border-tb1",
    text: "text-forest",
    desc: "Gigih, tangguh, dan ingin hasil terbaik. Tenang dan tidak banyak bicara, tetapi teguh pada tujuan.",
    tip: "Beri target yang jelas dan tantangan bertahap. Hargai usahanya, bukan hanya hasilnya.",
  },
  te: {
    name: "Mempengaruhi",
    ego: "Ego Tinggi",
    social: "Ekstrovert",
    chip: "bg-tb2 text-ink",
    soft: "bg-tb2/20",
    border: "border-tb2",
    text: "text-coral",
    desc: "Berani mengarahkan, memotivasi, dan mewakili orang lain.",
    tip: "Beri peran memimpin, dan latih juga untuk mendengarkan sebelum memutuskan.",
  },
  si: {
    name: "Berpikir",
    ego: "Ego Sedang",
    social: "Introvert",
    chip: "bg-tb3 text-paper",
    soft: "bg-tb3/15",
    border: "border-tb3",
    text: "text-navy",
    desc: "Teliti, jujur, dan suka menimbang sebelum bertindak.",
    tip: "Beri waktu berpikir dan alasan yang jelas. Jangan menganggap diamnya sebagai tanda setuju.",
  },
  se: {
    name: "Bekerjasama",
    ego: "Ego Sedang",
    social: "Ekstrovert",
    chip: "bg-tb4 text-ink",
    soft: "bg-tb4/25",
    border: "border-tb4",
    text: "text-navy",
    desc: "Suka kebersamaan, saling membantu, dan menjaga suasana tetap hangat.",
    tip: "Beri tenggat dan pembagian peran yang jelas. Tanyakan keberatannya, karena ia mudah berkata iya.",
  },
  ri: {
    name: "Berperasaan",
    ego: "Ego Rendah",
    social: "Introvert",
    chip: "bg-tb5 text-paper",
    soft: "bg-tb5/15",
    border: "border-tb5",
    text: "text-navy",
    desc: "Peka, pemalu, sederhana, dan pandai menjaga rahasia.",
    tip: "Ciptakan suasana aman untuk bercerita. Tegur secara pribadi, bukan di depan orang.",
  },
  re: {
    name: "Melayani",
    ego: "Ego Rendah",
    social: "Ekstrovert",
    chip: "bg-tb6 text-ink",
    soft: "bg-tb6/20",
    border: "border-tb6",
    text: "text-navy",
    desc: "Bertanggung jawab, peduli, dan suka membantu orang lain.",
    tip: "Akui kebaikannya secara terbuka, dan jangan biarkan ia terus dibebani.",
  },
};

export const QUESTIONS: { q: string; options: [string, AnswerKey][] }[] = [
  {
    q: "Setelah acara ramai seharian, yang paling membuat saya segar kembali adalah…",
    options: [
      ["Waktu tenang sendirian", "i"],
      ["Mengobrol dan berkumpul dengan teman", "e"],
    ],
  },
  {
    q: "Saat punya masalah, saya biasanya…",
    options: [
      ["Memikirkannya sendiri dulu", "i"],
      ["Langsung bercerita ke orang lain", "e"],
    ],
  },
  {
    q: "Di tempat baru, saya lebih nyaman…",
    options: [
      ["Mengamati dulu dan berkenalan dengan sedikit orang", "i"],
      ["Cepat berbaur dengan banyak orang", "e"],
    ],
  },
  {
    q: "Akhir pekan yang ideal bagi saya…",
    options: [
      ["Di rumah atau tempat yang tenang", "i"],
      ["Keluar dan bertemu banyak orang", "e"],
    ],
  },
  {
    q: "Ketika ada tugas penting, saya mulai dengan…",
    options: [
      ["Langsung bergerak dan mengambil kendali", "t"],
      ["Memikirkan dulu langkah yang paling masuk akal", "s"],
      ["Memastikan semua orang nyaman dan terbantu", "r"],
    ],
  },
  {
    q: "Saat pendapat saya ditolak, saya cenderung…",
    options: [
      ["Berusaha meyakinkan agar pendapat saya dipakai", "t"],
      ["Menimbang apakah alasan mereka masuk akal", "s"],
      ["Merasa tersentuh dan memilih mengalah", "r"],
    ],
  },
  {
    q: "Agar bersemangat, saya paling membutuhkan…",
    options: [
      ["Tantangan dan pengakuan atas hasil kerja", "t"],
      ["Alasan dan penjelasan yang jelas", "s"],
      ["Kehangatan dan rasa dihargai", "r"],
    ],
  },
  {
    q: "Dalam kelompok, peran yang paling sering saya ambil…",
    options: [
      ["Memimpin dan memutuskan", "t"],
      ["Menganalisis dan memberi pertimbangan", "s"],
      ["Mendengarkan dan menjaga suasana", "r"],
    ],
  },
  {
    q: "Ketika orang lain berbuat salah, reaksi pertama saya…",
    options: [
      ["Langsung menegur agar segera diperbaiki", "t"],
      ["Mencari tahu penyebabnya dulu", "s"],
      ["Menjaga perasaannya agar tidak tersinggung", "r"],
    ],
  },
  {
    q: "Keputusan penting biasanya saya ambil berdasarkan…",
    options: [
      ["Kemauan dan keyakinan diri", "t"],
      ["Pertimbangan dan data", "s"],
      ["Perasaan dan kedekatan dengan orang yang terlibat", "r"],
    ],
  },
];

const EGO_LABEL = { t: "Ego Tinggi", s: "Ego Sedang", r: "Ego Rendah" } as const;

export type TestResult = {
  keys: TypeKey[];
  social: SocialName;
  socialDesc: string;
  ego: string;
};

export function computeResult(answers: AnswerKey[]): TestResult {
  const count = { i: 0, e: 0, t: 0, s: 0, r: 0 };
  answers.forEach((a) => {
    count[a] += 1;
  });
  const socialKeys: ("i" | "e")[] =
    count.i > count.e ? ["i"] : count.e > count.i ? ["e"] : ["i", "e"];
  const max = Math.max(count.t, count.s, count.r);
  const egos = (["t", "s", "r"] as const).filter((k) => count[k] === max);
  const keys: TypeKey[] = [];
  egos.forEach((g) => {
    socialKeys.forEach((x) => keys.push(`${g}${x}` as TypeKey));
  });
  const isAmbi = socialKeys.length === 2;
  return {
    keys,
    social: isAmbi ? "Ambivert" : socialKeys[0] === "i" ? "Introvert" : "Ekstrovert",
    socialDesc: isAmbi
      ? "Nyaman sendiri maupun bersama banyak orang"
      : socialKeys[0] === "i"
        ? "Tenaga pulih saat sendirian"
        : "Tenaga pulih saat bersama orang",
    ego: egos.map((k) => EGO_LABEL[k]).join(" ke "),
  };
}

export function canonType(name: string) {
  const found = TYPE_ORDER.find((k) => TYPE_META[k].name.toLowerCase() === name.trim().toLowerCase());
  return found ? TYPE_META[found].name : name.trim();
}

export function metaByName(name: string) {
  const key = TYPE_ORDER.find((k) => TYPE_META[k].name.toLowerCase() === name.trim().toLowerCase());
  return key ? { key, ...TYPE_META[key] } : null;
}

export const TRAITS = raw.traits.map((t) => ({
  ...t,
  type: t.type as TypeKey,
}));

export function traitsOf(type: TypeKey) {
  return TRAITS.filter((t) => t.type === type);
}

export function guidanceOf(name: string) {
  return raw.types.find((t) => t.name.toLowerCase() === name.trim().toLowerCase()) ?? null;
}

export function socialGuide(name: SocialName) {
  return raw.social.find((s) => s.name === name) ?? null;
}

export function pairAdvice(from: string, to: string) {
  const a = canonType(from);
  const b = canonType(to);
  return raw.pairs.find((p) => p.from === a && p.to === b) ?? null;
}

const EGO_RANK = { "Ego Tinggi": 0, "Ego Sedang": 1, "Ego Rendah": 2 } as const;

export function egoAdvice(a: string, b: string) {
  const left = EGO_RANK[a as keyof typeof EGO_RANK];
  const right = EGO_RANK[b as keyof typeof EGO_RANK];
  if (left === undefined || right === undefined) return null;
  const [from, to] = left <= right ? [a, b] : [b, a];
  return raw.ego.find((e) => e.from === from && e.to === to) ?? null;
}

export function frictionOf(from: string, to: string) {
  const a = canonType(from);
  const b = canonType(to);
  return (
    raw.friction.find((f) => f.from === a && f.to === b) ??
    raw.friction.find((f) => f.from === b && f.to === a) ??
    null
  );
}

export function roleOf(name: string) {
  const n = canonType(name);
  return raw.roles.find((r) => r.name === n)?.role ?? "";
}

export const PROBLEMS = raw.problems;

export const ROLES = ["Ayah", "Ibu", "Anak", "Guru", "Lainnya"] as const;
export type FamilyRole = (typeof ROLES)[number];
