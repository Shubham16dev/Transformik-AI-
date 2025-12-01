import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function BlogLoading() {
  return (
    <div className="space-y-6">
      {/* Hero Section Skeleton */}
      <section className="relative bg-[#181828] text-white py-16 w-screen -ml-[50vw] left-1/2 overflow-hidden">
        <div className="relative w-full mx-auto text-center space-y-6 px-6">
          <Skeleton className="h-8 w-48 mx-auto bg-white/10" />
          <Skeleton className="h-12 w-1/2 mx-auto bg-white/10" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto bg-white/10" />
        </div>
      </section>

      <div className="space-y-6">
        {/* Sort Select Skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Blogs Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="rounded-xl border p-4 flex flex-col md:flex-row gap-4"
            >
              <Skeleton className="w-full md:w-1/3 h-32 rounded-lg" />
              <div className="flex-grow space-y-3">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-8 w-24 mt-2" />
              </div>
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
