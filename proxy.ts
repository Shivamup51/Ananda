import { NextRequest, NextResponse } from "next/server";

type SessionUser = {
  role?: string | null;
};

type SessionResponse = {
  user?: SessionUser | null;
} | null;

async function getSessionFromAuth(request: NextRequest): Promise<SessionResponse> {
  try {
    const sessionUrl = new URL("/api/auth/get-session", request.url);
    const response = await fetch(sessionUrl, {
      headers: {
        cookie: request.headers.get("cookie") ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) return null;
    const data = (await response.json()) as SessionResponse;
    return data ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSessionFromAuth(request);
  const role = session?.user?.role?.toUpperCase() ?? null;

  const isAdminRoute = pathname.startsWith("/admin");
  const isLoginRoute = pathname.startsWith("/login");

  if (isAdminRoute) {
    if (!session?.user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (isLoginRoute && session?.user) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const middleware = proxy;

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
