'use client';
import { trpc } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "./_components/loading";
import Posts from "./_components/posts";

function HomePage() {  
  const { user } = useUser();
  
  const username: string = user?.username ?? "";
  const { data, isLoading } = trpc.profile.getUserByUsername.useQuery({ username }, {
    enabled: !!user?.username,
  })

  if (isLoading) {
    return <div><LoadingSpinner/></div>;
  }
  if (!data) {
    return <div><LoadingSpinner/></div>;
  }

  return (
    <div className="h-screen overflow-hidden">
      <main className="overflow-none flex h-screen justify-center bg-gray-900">
        <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl">
            <Posts />
        </div>
    </main>
    </div>
  );
}

export default HomePage;
