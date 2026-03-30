import { NavSection } from "@/types/dashboard.interface";
import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

// ─────────────────────────────────────────────────────────────────────────────
// Common — visible to all roles
// ─────────────────────────────────────────────────────────────────────────────
export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);
    return [
        {
            title: "Main",
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home", // ✅ String
                    roles: ["MEMBER", "ADMIN"],
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: [ "MEMBER", "ADMIN"],
                },
               
            ],
        },

       
        {
            title: "Settings",
            items: [
                {
                    title: "Change Password",
                    href: "/change-password",
                    icon: "Settings",
                    roles: ["MEMBER", "ADMIN"],
                },
            ],
        },
    ];
};



// ─────────────────────────────────────────────────────────────────────────────
// Admin
// ─────────────────────────────────────────────────────────────────────────────
export const adminNavItems: NavSection[] = [
    {
        title: "Contribution Management",
        items: [

            { title: "Contributions", href: "/admin/dashboard/contribution", icon: "CreditCard", roles: ["ADMIN"] },


        ],
    },
    {
        title: "Users Management",
        items: [

            { title: "Members-Management", href: "/admin/dashboard/users", icon: "User", roles: ["ADMIN"] },


        ],
    },

];
export const memberNavItems: NavSection[] = [
    {

        items: [
            { title: "My Contributions", href: "/dashboard/member/contributions", icon: "Shield", roles: ["MEMBER"] },
            { title: "Events", href: "/admin/dashboard/events", icon: "Calendar", roles: ["MEMBER"] },
            { title: "Expense", href: "/admin/dashboard/expense", icon: "DollarSign", roles: ["MEMBER"] },

        ],
    },

];

// ─────────────────────────────────────────────────────────────────────────────
// Role resolver
// ─────────────────────────────────────────────────────────────────────────────
export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const common = getCommonNavItems(role);
    switch (role) {
        case "ADMIN": return [...common, ...adminNavItems];
        case "MEMBER": return [...common, ...memberNavItems];

        default: return common;
    }
};