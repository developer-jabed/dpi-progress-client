
import { UserRole } from "@/lib/auth-utils";


export interface UserInfo {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: "ACTIVE" | "DELETED" | "BLOCKED";
    lastLogin: Date | null;

    createdAt: string;
    updatedAt: string;
}