"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

// ─── Raw API shape (what the server actually returns) ─────────────────────────

interface RawMember {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  joinedAt: string;
  user: {
    email: string;
    role: string;
    status: string;
    lastLogin: string | null;
  };
}

// ─── Normalised shape (what the UI consumes) ──────────────────────────────────

export interface Member {
  id: string;           // userId — unique string key
  numericId: number;    // original numeric id if needed
  name: string;         // firstName + lastName
  email: string;        // from user.email
  phone: string | null;
  status: string;      // from user.status
  role: string;        // from user.role
  joinedAt: string;
  avatarUrl?: string;
}

export interface CreateMemberPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;

  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}



function normaliseMember(raw: RawMember): Member {
  return {
    id: raw.userId,
    numericId: raw.id,
    name: `${raw.firstName} ${raw.lastName}`.trim(),
    email: raw.user.email,
    phone: raw.phone ?? null,
    status: raw.user.status,
    role: raw.user.role,
    joinedAt: raw.joinedAt,
  };
}



export async function getAllMembers(): Promise<ApiResponse<Member[]>> {
  try {
    const response = await serverFetch.get("/users/all-members", {
      next: {
        tags: ["members-list", "contribution-members"],
        revalidate: 180,
      },
    });

    const result: ApiResponse<RawMember[]> = await response.json();

    if (!result.success) {
      return { success: false, message: result.message, data: [] };
    }

    return {
      success: true,
      message: result.message,
      data: result.data.map(normaliseMember),
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch members";
    console.error("Get members error:", error);
    return { success: false, message, data: [] };
  }
}

// ─── createMember ─────────────────────────────────────────────────────────────

export async function createMember(
  payload: CreateMemberPayload
): Promise<ApiResponse<Member>> {
  try {
    const response = await serverFetch.post("/users/member", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result: ApiResponse<RawMember> = await response.json();

    if (!result.success) {
      return { success: false, message: result.message, data: null as unknown as Member };
    }

    revalidateTag("members-list", { expire: 0 });
    revalidateTag("contribution-members", { expire: 0 });

    return {
      success: true,
      message: result.message,
      data: normaliseMember(result.data),
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create member";
    console.error("Create member error:", error);
    return { success: false, message, data: null as unknown as Member };
  }
}