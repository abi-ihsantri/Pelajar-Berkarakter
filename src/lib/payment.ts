import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  orderId: z.string().min(4).max(40),
  name: z.string().min(1).max(80),
  phone: z.string().max(30).default(""),
  items: z.array(z.object({ id: z.string(), qty: z.number().int().min(1).max(50) })).min(1).max(30),
});

export type PaymentResult =
  | { ok: true; token: string; clientKey: string; production: boolean }
  | { ok: false; reason: "not-configured" | "unknown-item" | "gateway-error"; message: string };

/**
 * Membuat transaksi Midtrans Snap. Harga dihitung ulang di server dari katalog
 * bawaan, sehingga pembeli tidak bisa mengubah harga lewat peramban.
 * Env: MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY, MIDTRANS_IS_PRODUCTION=true|false
 */
export const createPayment = createServerFn({ method: "POST" })
  .validator(input)
  .handler(async ({ data }): Promise<PaymentResult> => {
    const serverKey = process.env.MIDTRANS_SERVER_KEY?.trim();
    const clientKey = process.env.MIDTRANS_CLIENT_KEY?.trim();
    if (!serverKey || !clientKey) {
      return { ok: false, reason: "not-configured", message: "Payment gateway belum dikonfigurasi." };
    }
    const { PRODUCTS } = await import("@/data/catalog");
    const details: { id: string; price: number; quantity: number; name: string }[] = [];
    for (const it of data.items) {
      const p = PRODUCTS.find((x) => x.id === it.id);
      if (!p || !p.priceIdr) {
        return { ok: false, reason: "unknown-item", message: `Produk ${it.id} tidak ada di katalog server.` };
      }
      details.push({ id: p.id, price: p.priceIdr, quantity: it.qty, name: p.name.slice(0, 50) });
    }
    const gross = details.reduce((n, d) => n + d.price * d.quantity, 0);
    const production = process.env.MIDTRANS_IS_PRODUCTION === "true";
    const base = production ? "https://app.midtrans.com" : "https://app.sandbox.midtrans.com";
    const res = await fetch(`${base}/snap/v1/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`,
      },
      body: JSON.stringify({
        transaction_details: { order_id: data.orderId, gross_amount: gross },
        item_details: details,
        customer_details: { first_name: data.name, phone: data.phone },
      }),
    });
    const json = (await res.json().catch(() => ({}))) as { token?: string; error_messages?: string[] };
    if (!res.ok || !json.token) {
      return { ok: false, reason: "gateway-error", message: json.error_messages?.join(", ") ?? `HTTP ${res.status}` };
    }
    return { ok: true, token: json.token, clientKey, production };
  });
