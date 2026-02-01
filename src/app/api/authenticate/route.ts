import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = body;
  const backendUrl =
    process.env.AUTH_BACKEND_URL || "http://localhost:8080/api/auth/login";

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const upstream = await fetch(backendUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!upstream.ok) {
    let message = "Authentication failed";
    try {
      const data = await upstream.json();
      message = data?.message || message;
    } catch {
      // ignore parse errors
    }
    return NextResponse.json({ message }, { status: upstream.status });
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set({
    name: "authToken",
    value: "authenticated",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60,
    sameSite: "strict",
    path: "/",
  });

  return response;
}
