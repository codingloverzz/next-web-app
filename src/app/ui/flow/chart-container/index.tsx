import { Button } from "antd";
import Chart from "./chart";
import {
  fetchFlowInfoById,
  updateFlowInfo,
} from "@/app/lib/server-action/flow";
export default async function ChartContainer({
  versionId,
}: {
  versionId: string;
}) {
  const res = await fetchFlowInfoById(versionId);
  return (
    <div>
      <Chart flowInfo={res} />
    </div>
  );
}
