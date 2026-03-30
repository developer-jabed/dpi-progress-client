export type UserRole = "ADMIN" | "MEMBER";

// ─────────────────────────────────────────────────────────────────────────────
// Route config shape
// ─────────────────────────────────────────────────────────────────────────────
export type RouteConfig = {
    exact: string[];
    patterns: RegExp[];
};

// ─────────────────────────────────────────────────────────────────────────────
// Auth (public) routes
// ─────────────────────────────────────────────────────────────────────────────
export const authRoutes = ["/login"];

// ─────────────────────────────────────────────────────────────────────────────
// Protected route definitions
// ─────────────────────────────────────────────────────────────────────────────
export const commonProtectedRoutes: RouteConfig = {
    exact: ["/my-profile", "/settings", "/change-password"],
    patterns: [],
};

export const adminProtectedRoutes: RouteConfig = {
    exact: ["/admin"],              // ← bare /admin now matched
    patterns: [/^\/admin\//],         // /admin/*
};

export const memberProtectedRoutes: RouteConfig = {
    exact: ["/dashboard"],          // ← bare /dashboard now matched
    patterns: [/^\/dashboard\//],     // /dashboard/*
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
export const isAuthRoute = (pathname: string): boolean =>
    authRoutes.includes(pathname);

export const isRouteMatches = (pathname: string, routes: RouteConfig): boolean =>
    routes.exact.includes(pathname) ||
    routes.patterns.some((pattern) => pattern.test(pathname));

export const getRouteOwner = (
    pathname: string
): UserRole | "COMMON" | null => {
    if (isRouteMatches(pathname, adminProtectedRoutes)) return "ADMIN";
    if (isRouteMatches(pathname, memberProtectedRoutes)) return "MEMBER";
    if (isRouteMatches(pathname, commonProtectedRoutes)) return "COMMON";
    return null;
};

export const getDefaultDashboardRoute = (role: UserRole): string => {
    const routes: Record<UserRole, string> = {
        ADMIN: "/admin/dashboard",
        MEMBER: "/dashboard/member",
    };
    return routes[role] ?? "/";
};

export const isValidRedirectForRole = (redirectPath: string, role: UserRole): boolean => {
    const routeOwner = getRouteOwner(redirectPath);
    if (routeOwner === null || routeOwner === "COMMON") return true;
    return routeOwner === role;
};