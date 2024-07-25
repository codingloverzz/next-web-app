import VersionList from "@/app/ui/flow/version-list";
import ChartContainer from "@/app/ui/flow/chart-container";
import { Suspense } from "react";
import { CardSkeleton } from "@/app/ui/skeletons";
export default async function page({
  searchParams,
}: {
  searchParams: { version?: string };
}) {
  const versionId = searchParams.version;
  return (
    <div className="flex h-[100%]">
      <VersionList />
      {versionId && (
        <Suspense fallback={<CardSkeleton />}>
          <ChartContainer versionId={versionId} />
        </Suspense>
      )}
    </div>
  );
}
