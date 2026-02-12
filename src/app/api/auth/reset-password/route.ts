import { NextResponse } from "next/server";

const defaultBaseUrl = "http://localhost:8080/api/auth";

export async function POST(request: Request) {
  let payload: { token?: string; newPassword?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const { token, newPassword } = payload;
  if (!token || !newPassword) {
    return NextResponse.json(
      { message: "Token and new password are required." },
      { status: 400 },
    );
  }

  const baseUrl = process.env.AUTH_BACKEND_BASE_URL ?? defaultBaseUrl;
  const upstream = await fetch(`${baseUrl}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  const raw = await upstream.text();
  let data: any = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    // ignore parse errors
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { message: data?.message || "Reset failed." },
      { status: upstream.status },
    );
  }

  return NextResponse.json(data);
}
