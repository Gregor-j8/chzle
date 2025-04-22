'use client';
import { trpc } from "@/utils/trpc";
import { useUser } from "@clerk/nextjs";

function HomePage() {  
  const { user } = useUser();
  if (!user) {
    return <div>Loading...</div>;
  }
  if (!user.username) {
    return <div>Username not found</div>;
  }
  const username: string = user.username
  console.log("username", username);
  const { data, isLoading, error } = trpc.profile.getUserByUsername.useQuery({ username })

  console.log("data", data);
  return (
    <div>
      <h1>Welcome {user.fullName}</h1>
      <p>This is a simple example of a Next.js application.</p>
    </div>
  );
}

export default HomePage;
