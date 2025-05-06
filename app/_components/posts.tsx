import { trpc } from "@/utils/trpc";
import { LoadingPage } from "./loading";

export default function Posts() {
    const { data, isLoading } = trpc.userPostsRouter.GetAllPosts.useQuery();

    if (isLoading) {
        return <div><LoadingPage /></div>;
    }

    if (!data) {
        return <div>No Posts Found</div>;
    }

    return (
        <div className="h-full overflow-y-auto p-4">
            {data.map(post => (
                <div 
                    key={post.id} 
                    className="m-4 rounded-2xl border border-slate-700 bg-gray-800 p-4 shadow-md transition hover:shadow-lg"
                >
                    <h2 className="text-xl font-semibold text-white">{post.header}</h2>
                    <p className="mt-2 text-sm text-slate-300">{post.description}</p>
                    <div className="flex justify-between mt-4 text-xs text-slate-500">
                        <span className="font-medium">Posted by{post?.userid}</span>
                        <span className="font-medium">Posted on {post.createdat.toLocaleDateString()}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}
