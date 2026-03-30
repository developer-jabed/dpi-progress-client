// src/types/contribution.ts

export interface Member {
  id: number;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Contribution {
  id: string;
  memberId: number;
  userId: string;
  amount: number;
  month: string;
  year: number | string;
  type: string | undefined;                    // Make it required string (not optional)
  reason?: string | null;
  donateBy?: string | null;
  donatepersonNUmber?: string | null;
  paidAt?: string;
  createdAt?: string;
  member: Member;
  totalDonatedByThisMember?: number;
}