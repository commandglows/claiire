import { clerkClient, clerkMiddleware, createRouteMatcher } from '@clerk/astro/server';
import { defineMiddleware } from 'astro:middleware';

import { getDefaultMemberAccess, resolveMemberAccess } from './lib/auth/member-access';
import { getMemberSession, getPublicFallbackPath } from './lib/auth/session';

function hasClerkKeys() {
  return Boolean(import.meta.env.CLERK_SECRET_KEY && import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY);
}

const isMemberRoute = createRouteMatcher(['/membres(.*)']);
const isAccountRoute = createRouteMatcher(['/compte(.*)']);
const isMemberAccessApiRoute = createRouteMatcher(['/api/member-access(.*)']);
const isClerkProtectedRoute = createRouteMatcher([
  '/membres(.*)',
  '/compte(.*)',
  '/api/member-access(.*)',
]);
const isMemberAwareRoute = createRouteMatcher([
  '/membres(.*)',
  '/compte(.*)',
  '/api/member-access(.*)',
]);

function isMemberFormationPath(pathname: string) {
  return pathname === '/membres/formations' || pathname.startsWith('/membres/formations/');
}

const cookieOnlyMiddleware = defineMiddleware(async (context, next) => {
  const pathname = context.url.pathname;

  if (isMemberFormationPath(pathname)) {
    return next();
  }

  const memberSession = getMemberSession(context.cookies);
  const shouldResolveMemberAccess = isMemberAwareRoute(context.request);

  context.locals.memberSession = memberSession;
  context.locals.memberAccess = shouldResolveMemberAccess
    ? await resolveMemberAccess({
        cookies: context.cookies,
        userId: memberSession.userId,
        email: memberSession.email,
      })
    : getDefaultMemberAccess();

  if (!pathname.startsWith('/membres')) {
    return next();
  }

  if (context.locals.memberAccess.isPremium) {
    return next();
  }

  return context.redirect(getPublicFallbackPath(pathname), 302);
});

const clerkProtectedMiddleware = clerkMiddleware(async (auth, context, next) => {
  if (isMemberFormationPath(context.url.pathname)) {
    return next();
  }

  const authState = auth();
  const memberSession = getMemberSession(context.cookies, {
    userId: authState.userId ?? null,
  });
  const shouldResolveMemberAccess = isMemberAwareRoute(context.request);
  let clerkPrivateMetadata: unknown;

  if (shouldResolveMemberAccess && authState.userId) {
    const user = await clerkClient(context).users.getUser(authState.userId);
    clerkPrivateMetadata = user.privateMetadata;
  }

  context.locals.memberSession = memberSession;
  context.locals.memberAccess = shouldResolveMemberAccess
    ? await resolveMemberAccess({
        cookies: context.cookies,
        userId: authState.userId ?? null,
        email: memberSession.email,
        clerkPrivateMetadata,
      })
    : getDefaultMemberAccess();

  if (!isClerkProtectedRoute(context.request)) {
    return next();
  }

  if (!authState.userId) {
    if (isMemberAccessApiRoute(context.request)) {
      return new Response(
        JSON.stringify({
          error: 'unauthorized',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json; charset=utf-8',
          },
        },
      );
    }

    const redirectTarget = new URL('/connexion/', context.url);
    redirectTarget.searchParams.set('redirect_url', context.url.pathname);
    return context.redirect(redirectTarget.toString(), 302);
  }

  if (isAccountRoute(context.request) || isMemberAccessApiRoute(context.request)) {
    return next();
  }

  if (isMemberRoute(context.request) && context.locals.memberAccess.isPremium) {
    return next();
  }

  return context.redirect(getPublicFallbackPath(context.url.pathname), 302);
});

export const onRequest = hasClerkKeys() ? clerkProtectedMiddleware : cookieOnlyMiddleware;
