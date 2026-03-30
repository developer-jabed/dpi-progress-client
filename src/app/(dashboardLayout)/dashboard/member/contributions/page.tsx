// app/(dashboard)/my-contributions/page.tsx

import MyContributionClient from "@/components/modules/myContributions/MyContributionClient";
import { myContribution } from "@/service/contributions/contribution.service";
export const dynamic = "force-dynamic";

export default async function MyContributionPage() {
  const data = await myContribution();


  return (
    <MyContributionClient initialData={data?.data || {}} />
  );
}