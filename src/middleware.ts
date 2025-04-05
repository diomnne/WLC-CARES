import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

//If Hello then it is disabled for auth 
const isProtectedRoute = createRouteMatcher(["/Hello"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    const authObject = await auth(); // ✅ Wait for auth to resolve
    if (!authObject.userId) {
      return authObject.redirectToSignIn(); // ✅ Ensure redirect works
    }
  }
});
  
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ], // ✅ Apply middleware to localhost:3000
};