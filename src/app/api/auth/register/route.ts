import { NextResponse } from "next/server";

const defaultBaseUrl = "http://localhost:8080/api/auth";

export async function POST(request: Request) {
  let payload: { name?: string; email?: string; password?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload." }, { status: 400 });
  }

  const { name, email, password } = payload;

  if (!name || !email || !password) {
    return NextResponse.json(
      { message: "Name, email, and password are required." },
      { status: 400 },
    );
  }

  const baseUrl = process.env.AUTH_BACKEND_BASE_URL ?? defaultBaseUrl;
  const upstream = await fetch(`${baseUrl}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
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
      { message: data?.message || "Registration failed." },
      { status: upstream.status },
    );
  }

  return NextResponse.json({ success: true, ...data });
}
