// import { PageContainer } from "../layout/PageContainer";
// import RewardsHeader  from "../components/rewards/RewardsHeader";
// import { Tabs } from "../components/ui/Tabs";
// import { EarnTab } from "../components/rewards/EarnTab";
// import { RedeemTab } from "../components/rewards/RedeemTab";
// import { useState } from "react";

// export function RewardsPage() {
//   const [activeTab, setActiveTab] = useState<"earn" | "redeem">("earn");

//   return (
//     <PageContainer>
//       <RewardsHeader />

//       <Tabs
//         active={activeTab}
//         onChange={setActiveTab}
//         tabs={[
//           { key: "earn", label: "Earn Points" },
//           { key: "redeem", label: "Redeem Rewards" },
//         ]}
//       />

//       {activeTab === "earn" && <EarnTab />}
//       {activeTab === "redeem" && <RedeemTab />}
//     </PageContainer>
//   );
// }
