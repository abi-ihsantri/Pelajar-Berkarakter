export type Product = {
  id: string;
  name: string;
  category: "tb40" | "aplikasi" | "ebook" | "buku" | "sponsor" | "afiliasi";
  description: string;
  priceIdr: number | null;
  externalUrl?: string;
  badge?: string;
};

export const CATEGORY_LABELS: Record<Product["category"], string> = {
  tb40: "Layanan Tes Karakter TB-40",
  aplikasi: "Aplikasi Pembelajaran Sekolah",
  ebook: "Ebook",
  buku: "Buku",
  sponsor: "Paket Sponsor",
  afiliasi: "Produk Afiliasi",
};

export const CATEGORY_ORDER: Product["category"][] = [
  "tb40",
  "aplikasi",
  "ebook",
  "buku",
  "sponsor",
  "afiliasi",
];

export const PRODUCTS: Product[] = [
  {
    id: "tb40-personal",
    name: "Tes Karakter TB-40 Personal",
    category: "tb40",
    description:
      "Pemetaan lengkap 40 sifat bakat dalam 6 kepribadian, laporan PDF, dan saran pendampingan pribadi.",
    priceIdr: 99000,
    badge: "Paling diminati",
  },
  {
    id: "tb40-keluarga",
    name: "Tes Karakter TB-40 Paket Keluarga",
    category: "tb40",
    description:
      "Tes untuk ayah, ibu, dan hingga 3 anak, lengkap dengan peta titik rawan interaksi keluarga.",
    priceIdr: 349000,
  },
  {
    id: "tb40-sekolah",
    name: "Tes Karakter TB-40 Paket Sekolah",
    category: "tb40",
    description:
      "Pemetaan karakter satu kelas (maks. 30 siswa) dengan rekomendasi pendampingan untuk guru.",
    priceIdr: 1490000,
  },
  {
    id: "app-jurnal",
    name: "Aplikasi Jurnal Adab Harian",
    category: "aplikasi",
    description:
      "Pemantauan adab dan ibadah harian siswa yang terhubung ke wali murid.",
    priceIdr: 249000,
  },
  {
    id: "app-rapor",
    name: "Aplikasi Rapor Karakter Sekolah",
    category: "aplikasi",
    description:
      "Penilaian karakter nabawiyah untuk sekolah, lengkap dengan dasbor guru.",
    priceIdr: 799000,
  },
  {
    id: "ebook-kenali",
    name: "Ebook Kenali Dulu, Baru Berinteraksi",
    category: "ebook",
    description:
      "Memahami 6 tipe kepribadian anak dan cara berkomunikasi yang tepat untuk tiap tipe.",
    priceIdr: 39000,
  },
  {
    id: "ebook-nabawiyah",
    name: "Ebook Pendidikan Karakter Nabawiyah",
    category: "ebook",
    description:
      "Panduan praktis menanamkan karakter ala Rasulullah untuk orang tua dan guru. 180 halaman PDF.",
    priceIdr: 49000,
  },
  {
    id: "buku-ayah",
    name: "Buku Ayah Sang Pendidik Pertama",
    category: "buku",
    description:
      "Peran ayah dalam pendidikan karakter keluarga muslim. Soft cover, 220 halaman.",
    priceIdr: 89000,
  },
  {
    id: "buku-40",
    name: "Buku 40 Sifat Bakat Anak",
    category: "buku",
    description:
      "Penjelasan 40 sifat bakat TB-40 dengan studi kasus dan lembar kerja.",
    priceIdr: 115000,
  },
  {
    id: "sponsor-banner",
    name: "Paket Sponsor Banner Beranda",
    category: "sponsor",
    description:
      "Tampilkan logo dan pesan lembaga Anda di beranda Pelajar Berkarakter selama 30 hari.",
    priceIdr: 500000,
  },
  {
    id: "sponsor-konten",
    name: "Paket Sponsor Konten Parenting",
    category: "sponsor",
    description:
      "Dukung produksi 4 konten parenting dengan penyebutan nama lembaga Anda.",
    priceIdr: 1000000,
  },
  {
    id: "afiliasi-sirah",
    name: "Buku Sirah Nabawiyah untuk Anak",
    category: "afiliasi",
    description: "Rekomendasi buku sirah bergambar dari mitra afiliasi kami.",
    priceIdr: null,
    externalUrl: "https://www.tokopedia.com",
  },
  {
    id: "afiliasi-quran",
    name: "Al-Quran Anak Tajwid Warna",
    category: "afiliasi",
    description: "Produk mitra afiliasi pilihan untuk keluarga. Pembelian melalui toko mitra.",
    priceIdr: null,
    externalUrl: "https://shopee.co.id",
  },
];

export type ContentItem = {
  id: string;
  kind: "Slide IG" | "Video" | "Artikel";
  title: string;
  theme: string;
  source: string;
  url: string;
  excerpt: string;
};

export const THEMES = [
  "Parenting Digital",
  "Mengenal Kepribadian",
  "Adab & Akhlak",
  "Peran Ayah",
  "Keteladanan Nabi",
  "Sekolah Karakter",
] as const;

export const CONTENTS: ContentItem[] = [
  {
    id: "c1",
    kind: "Slide IG",
    title: "Tanda Anak Butuh Didengar",
    theme: "Parenting Digital",
    source: "Instagram",
    url: "https://instagram.com",
    excerpt: "Kenali sinyal anak yang ingin bercerita namun ragu.",
  },
  {
    id: "c2",
    kind: "Slide IG",
    title: "Jangan Bandingkan Anakmu",
    theme: "Mengenal Kepribadian",
    source: "Instagram",
    url: "https://instagram.com",
    excerpt: "Setiap anak punya 40 sifat bakat dengan kadar yang berbeda.",
  },
  {
    id: "c3",
    kind: "Slide IG",
    title: "Rutinitas Pagi ala Keluarga Muslim",
    theme: "Adab & Akhlak",
    source: "Instagram",
    url: "https://instagram.com",
    excerpt: "Mulai hari dengan subuh berjamaah, doa, dan sarapan bersama.",
  },
  {
    id: "c4",
    kind: "Slide IG",
    title: "5 Kalimat Ajaib untuk Anak Berperasaan",
    theme: "Mengenal Kepribadian",
    source: "Instagram",
    url: "https://instagram.com",
    excerpt: "Kalimat yang membuat anak peka merasa aman bercerita.",
  },
  {
    id: "c5",
    kind: "Video",
    title: "Ayah Hebat, Anak Berkarakter",
    theme: "Peran Ayah",
    source: "YouTube",
    url: "https://www.youtube.com/results?search_query=peran+ayah+pendidikan+anak+islam",
    excerpt: "Kisah inspiratif para ayah dalam mendampingi tumbuh kembang anak.",
  },
  {
    id: "c6",
    kind: "Video",
    title: "Adab Murid kepada Guru",
    theme: "Adab & Akhlak",
    source: "Yufid",
    url: "https://yufid.tv",
    excerpt: "Video singkat tentang adab penuntut ilmu dari para ulama.",
  },
  {
    id: "c7",
    kind: "Video",
    title: "Tips Komunikasi dengan Anak Ego Tinggi",
    theme: "Mengenal Kepribadian",
    source: "YouTube",
    url: "https://www.youtube.com/results?search_query=komunikasi+anak+karakter",
    excerpt: "Cara menghadapi anak yang berkemauan keras tanpa mematahkan semangatnya.",
  },
  {
    id: "c8",
    kind: "Video",
    title: "Kajian: Mendidik Anak dengan Cinta",
    theme: "Keteladanan Nabi",
    source: "YouTube",
    url: "https://www.youtube.com/results?search_query=mendidik+anak+cara+rasulullah",
    excerpt: "Kajian parenting nabawiyah tentang kasih sayang dalam mendidik.",
  },
  {
    id: "c9",
    kind: "Artikel",
    title: "Mendampingi Anak di Era Gawai",
    theme: "Parenting Digital",
    source: "Sekolah Karakter",
    url: "https://sekolahkarakter.com",
    excerpt: "Aturan screen time yang disepakati bersama lebih efektif daripada larangan sepihak.",
  },
  {
    id: "c10",
    kind: "Artikel",
    title: "Menumbuhkan Kejujuran Sejak Dini",
    theme: "Adab & Akhlak",
    source: "Yufid",
    url: "https://yufid.com",
    excerpt: "Kejujuran tumbuh dari rasa aman. Anak jujur ketika ia tidak takut dihukum berlebihan.",
  },
  {
    id: "c11",
    kind: "Artikel",
    title: "Mengenali Anak Introvert dan Ekstrovert",
    theme: "Mengenal Kepribadian",
    source: "Karakter Nabawiyah",
    url: "https://karakternabawiyah.com",
    excerpt: "Setiap anak punya cara memulihkan energi yang berbeda. Kenali dulu, baru berinteraksi.",
  },
  {
    id: "c12",
    kind: "Artikel",
    title: "Kitab Klasik Tarbiyatul Aulad",
    theme: "Keteladanan Nabi",
    source: "Archive.org",
    url: "https://archive.org/search?query=tarbiyatul+aulad",
    excerpt: "Rujukan klasik pendidikan anak dalam Islam yang dapat dibaca secara daring.",
  },
  {
    id: "c13",
    kind: "Artikel",
    title: "Peran Ayah dalam Pendidikan Anak Menurut Al-Quran",
    theme: "Peran Ayah",
    source: "SOTABH",
    url: "https://sotabh.com",
    excerpt: "Dialog Luqman dan anaknya menjadi teladan komunikasi ayah yang penuh hikmah.",
  },
  {
    id: "c14",
    kind: "Artikel",
    title: "Membangun Sekolah yang Menumbuhkan Karakter",
    theme: "Sekolah Karakter",
    source: "Sekolah Karakter",
    url: "https://sekolahkarakter.com",
    excerpt: "Karakter tidak cukup diajarkan, ia harus dibiasakan dalam budaya sekolah sehari-hari.",
  },
  {
    id: "c15",
    kind: "Artikel",
    title: "Adab Sebelum Ilmu: Fondasi Pendidikan Karakter",
    theme: "Adab & Akhlak",
    source: "Yufid",
    url: "https://yufid.com",
    excerpt: "Para ulama salaf mengajarkan adab bertahun-tahun sebelum ilmu. Mengapa urutan ini penting?",
  },
  {
    id: "c16",
    kind: "Artikel",
    title: "Meneladani Cara Rasulullah Mendidik Anak",
    theme: "Keteladanan Nabi",
    source: "Karakter Nabawiyah",
    url: "https://karakternabawiyah.com",
    excerpt: "Rasulullah mendidik dengan kasih sayang, keteladanan, dan dialog yang menghargai anak.",
  },
];

export const SPONSORS = [
  { name: "Karakter Nabawiyah", url: "https://karakternabawiyah.com", note: "Rujukan karakter" },
  { name: "Sekolah Karakter", url: "https://sekolahkarakter.com", note: "Budaya sekolah" },
  { name: "Yufid Network", url: "https://yufid.com", note: "Konten ilmu" },
  { name: "Tes Karakter TB-40", url: "/tes-karakter", note: "Alat ukur bakat" },
];

export const QUOTES = [
  {
    text: "Muliakanlah anak-anakmu dan perbaikilah adab mereka.",
    source: "HR. Ibnu Majah",
  },
  {
    text: "Sebaik-baik kalian adalah yang paling baik akhlaknya.",
    source: "HR. Bukhari",
  },
  {
    text: "Kenali dulu, baru berinteraksi.",
    source: "Pelajar Berkarakter",
  },
  {
    text: "Adab sebelum ilmu. Karakter dibiasakan, bukan hanya diajarkan.",
    source: "Catatan parenting",
  },
];

export type QuizItem = {
  question: string;
  options: string[];
  answer: number;
  why: string;
};

export const QUIZ: QuizItem[] = [
  {
    question: "Anak introvert selesai dari acara ramai. Yang paling menolong adalah…",
    options: [
      "Langsung mengajak main bersama banyak teman lagi",
      "Memberi waktu tenang sebelum diajak bicara",
      "Menegur karena ia tampak pendiam",
    ],
    answer: 1,
    why: "Tenaganya pulih saat sendiri. Waktu tenang membuatnya siap berinteraksi lagi.",
  },
  {
    question: "Anak bertipe Bekerja Keras gagal di satu tugas. Kalimat yang lebih tepat…",
    options: [
      "“Kok cuma segini? Temanmu sudah selesai.”",
      "“Terima kasih sudah berusaha. Bagian mana yang ingin kamu perbaiki dulu?”",
      "“Sudah, biar Ibu saja yang mengerjakan.”",
    ],
    answer: 1,
    why: "Ia butuh penghargaan atas usaha dan target berikutnya yang jelas, bukan perbandingan.",
  },
  {
    question: "Anak Melayani selalu mengalah. Yang perlu dijaga orang tua…",
    options: [
      "Menambah tugas karena ia tidak pernah protes",
      "Menanyakan kebutuhannya sendiri dan membagi beban",
      "Memuji di depan kelas lalu memberinya tugas teman",
    ],
    answer: 1,
    why: "Kebaikannya mudah dimanfaatkan. Akui, lalu pastikan ia tidak terus dibebani.",
  },
  {
    question: "Menghadapi tantrum, langkah pertama yang lebih aman…",
    options: [
      "Menceramahi panjang lebar saat emosi masih tinggi",
      "Menjaga keselamatan, menenangkan diri, lalu bicara setelah reda",
      "Menghukum dengan mengucilkan seharian",
    ],
    answer: 1,
    why: "Tantrum adalah luapan emosi yang belum teratur, bukan saat yang tepat untuk ceramah.",
  },
  {
    question: "Screen time lebih efektif diatur dengan…",
    options: [
      "Larangan mendadak tanpa pengganti kegiatan",
      "Kesepakatan waktu, tempat, dan kegiatan pengganti",
      "Membandingkan dengan anak yang tidak pegang gawai",
    ],
    answer: 1,
    why: "Kesepakatan bersama dan kegiatan pengganti lebih kuat daripada larangan sepihak.",
  },
  {
    question: "Anak Berpikir diam saat ditanya. Tafsiran yang lebih adil…",
    options: [
      "Diam berarti setuju atau tidak paham",
      "Ia sedang menimbang dan butuh waktu sebelum menjawab",
      "Ia menantang orang tua",
    ],
    answer: 1,
    why: "Jangan menganggap diam sebagai tanda setuju. Beri waktu dan alasan yang jelas.",
  },
];

export const ADAB = [
  { id: "subuh", label: "Sholat tepat waktu", hint: "Tidak menunda, mulai dari subuh" },
  { id: "quran", label: "Membaca Al-Quran", hint: "Meski beberapa ayat" },
  { id: "jujur", label: "Berkata jujur", hint: "Mengakui kesalahan tanpa ditutupi" },
  { id: "bantu", label: "Membantu keluarga", hint: "Satu pekerjaan rumah tanpa diminta" },
  { id: "lisan", label: "Menjaga lisan", hint: "Tidak mengejek atau berkata kasar" },
  { id: "rapi", label: "Merapikan tempat sendiri", hint: "Tempat tidur, tas, atau meja belajar" },
  { id: "doa", label: "Doa sebelum tidur", hint: "Mengakhiri hari dengan syukur" },
];

export const CITIES = [
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Yogyakarta",
  "Semarang",
  "Medan",
  "Palembang",
  "Makassar",
  "Denpasar",
  "Pontianak",
];
