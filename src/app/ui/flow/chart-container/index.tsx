import { Button } from "antd";
import Chart from "./chart";
export default async function ChartContainer({
  versionId,
}: {
  versionId: string;
}) {
  return (
    <div>
      <Button>save</Button>
      <Chart />
    </div>
  );
}
