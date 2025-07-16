import { PageLayout } from "@/components/page-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { LoadingDataTable } from "@/components/data-table/loading-data-table";

export function PageEntityLoading() {
  return (
    <>
      <Skeleton className="h-8 w-40 mb-2" />
      <PageLayout
        title=""
        actions={
          <Button disabled className="pointer-events-none">
            <Skeleton className="h-5 w-24" />
          </Button>
        }
      >
        <div className="h-[calc(100vh-var(--header-height)-10rem)]">
          <LoadingDataTable />
        </div>
      </PageLayout>
    </>
  );
} 