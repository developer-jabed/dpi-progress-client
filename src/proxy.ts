import jwt, { JwtPayload } from 'jsonwebtoken';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { getDefaultDashboardRoute, getRouteOwner, isAuthRoute, UserRole } from './lib/auth-utils';
import { getNewAccessToken } from './service/auth/auth.service';
import { deleteCookie, getCookie } from './service/auth/tokenHandlers';
import { getUserInfo } from './service/auth/getUserInfo';

// ─── Bare role-root paths → redirect to default dashboard ────────────────────
const ROLE_ROOT_PATHS = ["/dashboard", "/admin"];

async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const hasTokenRefreshedParam = request.nextUrl.searchParams.has('tokenRefreshed');

    // If coming back after token refresh, remove the param and continue
    if (hasTokenRefreshedParam) {
        const url = request.nextUrl.clone();
        url.searchParams.delete('tokenRefreshed');
        return NextResponse.redirect(url);
    }

    const tokenRefreshResult = await getNewAccessToken();

    // If token was refreshed, redirect to same page to fetch with new token
    if (tokenRefreshResult?.tokenRefreshed) {
        const url = request.nextUrl.clone();
        url.searchParams.set('tokenRefreshed', 'true');
        return NextResponse.redirect(url);
    }

    const accessToken = await getCookie("accessToken") || null;

    let userRole: UserRole | null = null;
    if (accessToken) {
        const verifiedToken: JwtPayload | string = jwt.verify(accessToken, process.env.JWT_SECRET as string);

        if (typeof verifiedToken === "string") {
            await deleteCookie("accessToken");
            await deleteCookie("refreshToken");
            return NextResponse.redirect(new URL('/login', request.url));
        }

        userRole = verifiedToken.role;
    }

    const routerOwner = getRouteOwner(pathname);
    const isAuth = isAuthRoute(pathname);

    // Rule 1: User is logged in and trying to access auth route → default dashboard
    if (accessToken && isAuth) {
        return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
    }

    // Rule 2: Logged-in user — check password change requirement
    if (accessToken) {
        const userInfo = await getUserInfo();

        if (userInfo?.needPasswordChange) {
            if (pathname !== "/reset-password") {
                const resetPasswordUrl = new URL("/reset-password", request.url);
                resetPasswordUrl.searchParams.set("redirect", pathname);
                return NextResponse.redirect(resetPasswordUrl);
            }
            return NextResponse.next();
        }

        if (userInfo && !userInfo.needPasswordChange && pathname === '/reset-password') {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }

    // Rule 3: Open public route → allow through
    if (routerOwner === null) {
        return NextResponse.next();
    }

    // Rule 4: Unauthenticated user on protected route → login
    if (!accessToken) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Rule 5: Common protected route → allow through
    if (routerOwner === "COMMON") {
        return NextResponse.next();
    }

    // Rule 6: Bare role-root paths → redirect to role default dashboard
    // e.g. MEMBER typing /dashboard → /dashboard/member
    // e.g. ADMIN  typing /admin     → /admin/dashboard
    if (ROLE_ROOT_PATHS.includes(pathname)) {
        return NextResponse.redirect(
            new URL(getDefaultDashboardRoute(userRole as UserRole), request.url)
        );
    }

    // Rule 7: Role-based route — wrong role → bounce to own dashboard
    if (routerOwner === "ADMIN" || routerOwner === "MEMBER") {
        if (userRole !== routerOwner) {
            return NextResponse.redirect(new URL(getDefaultDashboardRoute(userRole as UserRole), request.url));
        }
    }

    console.log("pathname:", pathname);
    console.log("routerOwner:", getRouteOwner(pathname));
    console.log("accessToken:", !!accessToken);
    console.log("userRole:", userRole);

    return NextResponse.next();
}

// ─── Export as `middleware` — required by Next.js ─────────────────────────────
export { proxy };

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)',
    ],
};