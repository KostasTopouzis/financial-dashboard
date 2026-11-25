import type { NextAuthConfig } from 'next-auth';
 
export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = nextUrl;
      const isOnDashboard = pathname.startsWith('/dashboard');
      // Only the home and login pages send a signed-in user on to the
      // dashboard. Other routes, such as /seed, must still run for them.
      const isEntryPage = pathname === '/' || pathname === '/login';
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isEntryPage) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    // Auth.js stores the signed-in user's id in the JWT as `token.sub`,
    // but leaves it out of the session object by default. Copy it over so
    // server code can ask "which workspace is this?" via session.user.id.
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;