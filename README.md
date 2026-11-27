# Pelajar Berkarakter

Website parenting, tes karakter TB-40, toko, dan **Ruang Admin**.

## Ruang Admin
- Alamat: `/admin`
- Email khusus: `pelajarkuberkarakter@gmail.com`
- Login pertama kali: buat kata sandi (minimal 8 karakter)

## Deploy ke Vercel
1. Upload **isi folder ini** (bukan file zip utuh) ke GitHub
2. Import repo di Vercel
3. Install Command: `npm install`
4. Build Command: `npm run build`
5. Deploy

Pastikan di root repo terlihat `package.json` dan folder `src/`.

## Payment gateway (Midtrans)
Atur di Vercel → Settings → Environment Variables:
- `MIDTRANS_SERVER_KEY`, `MIDTRANS_CLIENT_KEY`
- `MIDTRANS_IS_PRODUCTION` = `true` (live) atau `false` (sandbox)

Tanpa variabel ini checkout otomatis memakai jalur WhatsApp.

## Catatan data
Chat, pesanan, dan konten admin masih tersimpan di peramban (localStorage). Penghitung pengunjung/pembeli memakai counterapi.dev.
Untuk chat & transaksi lintas perangkat, hubungkan ke Postgres/Neon.
