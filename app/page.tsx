'use client';
import { trpc } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";
import { LoadingSpinner } from "./_components/loading";

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
    return <div></div>;
  }

  return (
    <div>
      <h1>Welcome {data?.firstName} {data?.lastName}</h1>
      <p>This is a simple example of a Next.js application.</p>
    </div>
  );
}

export default HomePage;
