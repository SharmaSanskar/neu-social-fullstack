import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const userId = request.cookies.get("userId")?.value || "";
  const url = request.nextUrl.clone();
  const signupUrl = "/signup";
  const loginUrl = "/login";
  const homeUrl = "/home";

  if (!userId) {
    if (url.pathname !== loginUrl && url.pathname !== signupUrl) {
      url.pathname = loginUrl;
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === loginUrl || url.pathname === signupUrl) {
      url.pathname = homeUrl;
      return NextResponse.redirect(url);
    }
  }
}

export const config = {
  matcher: ["/login", "/signup", "/home", "/find", "/profile/:path*"],
  // matcher: [],
};
