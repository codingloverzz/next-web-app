import Chart from "./chart";
import { fetchFlowInfoById } from "@/app/lib/server-action/flow";
export default async function ChartContainer({
  versionId,
}: {
  versionId: string;
}) {
  const res = await fetchFlowInfoById(versionId);
  return (
    <div className="flex-grow">
      <Chart flowInfo={res} />
    </div>
  );
}
