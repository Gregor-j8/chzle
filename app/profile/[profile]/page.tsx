'use client'
import { LoadingPage } from '@/app/_components/loading';
import { trpc } from '@/utils/trpc';
// import { UserProfile } from '@clerk/nextjs'
// import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { useParams } from 'next/navigation';

export default function ProfilePage() {
    const { profile } = useParams() 
    const { data, isLoading } = trpc.profile.getUserByUsername.useQuery({username: profile?.toString() || ''})
console.log(data)
if (!isLoading && !data) {
  return (<div><LoadingPage/></div>)
}
    console.log(data)
  return (
    <>
    <div>
    <h1>{data?.username}</h1>



    </div>
      {/* <SignedIn>
        <UserProfile />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut> */}
    </>
  );
}
