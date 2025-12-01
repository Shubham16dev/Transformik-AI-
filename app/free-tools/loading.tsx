import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function FreeToolsLoading() {
  return (
    <div className="space-y-6">
      {/* Hero Section Skeleton */}
      <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2 overflow-hidden">
        <div className="relative w-full mx-auto text-center space-y-6 px-6">
          <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
          <Skeleton className="h-12 w-2/3 mx-auto bg-white/10" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/10" />
        </div>
      </section>

      <div className="space-y-8">
        {/* Filters Skeleton */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Skeleton className="h-10 w-full md:w-1/3" />
          <Skeleton className="h-10 w-full md:w-1/4" />
          <Skeleton className="h-10 w-full md:w-1/4" />
        </div>

        {/* Tools Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <Card
              key={i}
              className="rounded-xl border p-4 flex flex-col space-y-4"
            >
              <div className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-lg flex-shrink-0" />
                <div className="flex-grow space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                </div>
              </div>
              <Skeleton className="h-8 w-24" />
            </Card>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex justify-center gap-2 mt-6">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  );
}
