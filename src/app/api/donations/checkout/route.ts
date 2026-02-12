import { NextResponse } from "next/server";

const defaultBackend = "http://localhost:8080";

export async function POST(request: Request) {
  let payload: { amount?: number; currency?: string; email?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload." }, { status: 400 });
  }

  const amount = Number(payload.amount);
  const currency = typeof payload.currency === "string" ? payload.currency : "inr";
  const email = typeof payload.email === "string" ? payload.email : "";

  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Amount must be a positive number." }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  const backendUrl = process.env.DONATIONS_BACKEND_URL ?? defaultBackend;
  const response = await fetch(`${backendUrl}/api/donations/checkout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, currency, email }),
  });

  const raw = await response.text();
  const contentType = response.headers.get("content-type") ?? "application/json";

  if (!response.ok) {
    return new NextResponse(raw || "Checkout failed.", {
      status: response.status,
      headers: { "Content-Type": contentType },
    });
  }

  let data: { checkoutUrl?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    return NextResponse.json({ error: "Invalid response from backend." }, { status: 502 });
  }

  if (!data.checkoutUrl) {
    return NextResponse.json({ error: "Checkout link missing." }, { status: 502 });
  }

  return NextResponse.json({ checkoutUrl: data.checkoutUrl });
}
