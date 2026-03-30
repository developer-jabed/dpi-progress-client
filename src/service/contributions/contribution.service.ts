/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function createContribution(
  _prevState: any,
  formData: FormData | Record<string, any>
) {
  let payload: Record<string, any>;

  // Handle both FormData and plain object (from dialog)
  if (formData instanceof FormData) {
    payload = {
      memberId: Number(formData.get("memberId")),
      userId: formData.get("userId") as string,
      type: (formData.get("type") as string) || "Donation",
      amount: Number(formData.get("amount")) || 30,
      month: String(formData.get("month")),
      year: Number(formData.get("year")),
      reason: (formData.get("reason") as string)?.trim() || null,
      donateBy: (formData.get("donateBy") as string)?.trim() || null,
      donatepersonNUmber: (formData.get("donatepersonNUmber") as string)?.trim() || null,
    };
  } else {
    // Plain object from React state
    payload = {
      memberId: Number(formData.memberId),
      userId: formData.userId as string,
      type: formData.type || "Donation",
      amount: Number(formData.amount) || 30,
      month: String(formData.month),
      year: Number(formData.year),
      reason: formData.reason?.trim() || null,
      donateBy: formData.donateBy?.trim() || null,
      donatepersonNUmber: formData.donatepersonNUmber?.trim() || null,
    };
  }
  

  // Basic validation
  if (!payload.memberId || !payload.type || !payload.amount) {
    return {
      success: false,
      message: "Member, type, and amount are required fields.",
    };
  }

  console.log(payload)

  try {
    const response = await serverFetch.post("/contributions", {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (result.success) {
      // Revalidate all related cached data
      revalidateTag("contributions-list", { expire: 0 });
      revalidateTag("dashboard-balance", { expire: 0 });
      revalidateTag("monthly-report", { expire: 0 });
      // You can add more tags as your app grows
    }

    return result;
  } catch (error: any) {
    console.error("Create contribution error:", error);

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message || "Internal server error"
          : "Failed to create contribution. Please try again.",
    };
  }
}

/**
 * Get all contributions with optional query params
 */
export async function getContributions(queryString = "") {
  try {
    const url = queryString ? `/contributions?${queryString}` : "/contributions";

    const response = await serverFetch.get(url, {
      next: {
        tags: ["contributions-list"],
        revalidate: 60, // 1 minute cache (adjust as needed)
      },
    });

    return await response.json();
  } catch (error: any) {
    console.error("Get contributions error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch contributions",
      data: [],
    };
  }
}


export async function myContribution(queryString = "") {
  try {
    const url = queryString
      ? `/contributions/my-contributions?${queryString}`
      : "/contributions/my-contributions";

    const response = await serverFetch.get(url, {
      next: {
        tags: ["my-contributions"],
        revalidate: 60,
      },
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get my contributions error:", error);

    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch contributions",
      data: [],
    };
  }
}

/**
 * Get single contribution by ID
 */
export async function getContributionById(id: string) {
  if (!id) {
    return {
      success: false,
      message: "Contribution ID is required",
    };
  }

  try {
    const response = await serverFetch.get(`/contributions/${id}`, {
      next: {
        tags: [`contribution-${id}`, "contributions-list"],
        revalidate: 300, // 5 minutes
      },
    });

    return await response.json();
  } catch (error: any) {
    console.error(`Get contribution ${id} error:`, error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch contribution details",
    };
  }
}

/**
 * Get monthly contribution report
 */
export async function getContributionMonthlyReport(month: number, year: number) {
  if (!month || !year) {
    return {
      success: false,
      message: "Month and year are required",
    };
  }

  try {
    const response = await serverFetch.get(
      `/contributions/report?month=${month}&year=${year}`,
      {
        next: {
          tags: ["monthly-report", `report-${month}-${year}`],
          revalidate: 300, // 5 minutes for reports
        },
      }
    );

    return await response.json();
  } catch (error: any) {
    console.error("Monthly report error:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch monthly report",
    };
  }
}