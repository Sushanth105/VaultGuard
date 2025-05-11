
export { auth as middleware } from "@/auth"

// This is the critical part - explicitly set to use Node.js runtime
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|_next/data|favicon.ico).*)"],
  runtime: "nodejs"
};