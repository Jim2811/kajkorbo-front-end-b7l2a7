import { NextResponse } from "next/server";

const backendUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

const credentialsByRole = {
  admin: {
    email: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
  },
  owner: {
    email: process.env.DEMO_OWNER_EMAIL,
    password: process.env.DEMO_OWNER_PASSWORD,
  },
  member: {
    email: process.env.DEMO_MEMBER_EMAIL,
    password: process.env.DEMO_MEMBER_PASSWORD,
  },
} as const;

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { role?: keyof typeof credentialsByRole } | null;
  const role = body?.role;
  const credentials = role ? credentialsByRole[role] : undefined;

  if (
    !credentials ||
    !credentials.email ||
    !credentials.password
  ) {
    return NextResponse.json(
      { message: "This demo role is not configured on the server." },
      { status: 503 },
    );
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "The authentication service is unavailable." },
      { status: 502 },
    );
  }

  const responseBody = await backendResponse.text();
  const response = new NextResponse(responseBody, {
    status: backendResponse.status,
    headers: {
      "Content-Type": backendResponse.headers.get("content-type") ?? "application/json",
    },
  });
  const setCookies = backendResponse.headers.getSetCookie();

  for (const cookie of setCookies) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}
