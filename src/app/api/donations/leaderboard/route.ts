import { NextResponse } from "next/server";

const defaultBackend = "http://localhost:8080";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitValue = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(limitValue) ? Math.min(Math.max(limitValue, 1), 50) : 6;

  const backendUrl = process.env.DONATIONS_BACKEND_URL ?? defaultBackend;
  const upstream = await fetch(`${backendUrl}/api/donations/leaderboard?limit=${limit}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const raw = await upstream.text();
  const contentType = upstream.headers.get("content-type") ?? "application/json";

  if (!upstream.ok) {
    return new NextResponse(raw || "Leaderboard request failed.", {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  }

  return new NextResponse(raw, {
    status: 200,
    headers: { "Content-Type": contentType },
  });
}
