
import { getAllMembers } from "@/service/members/member.service";
import { getContributions } from "@/service/contributions/contribution.service";
import ContributionClient from "@/components/modules/contributions/ContributionDialogWrapper";
export const dynamic = "force-dynamic";

export default async function ContributionPage() {
  const [membersRes, contributionsRes] = await Promise.all([
    getAllMembers(),
    getContributions(),
  ]);

  // Extract the actual contributions array from the wrapped response
  const initialContributions = contributionsRes?.data || [];



  return (
    <ContributionClient
      initialMembers={membersRes?.data || []}
      initialContributions={initialContributions}
    />
  );
}