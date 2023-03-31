import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingPage } from "./LoadingSpinner";
import PostView from "./PostView";

export default function ProfileFeed(props: { userId: string }) {
  const { userId } = props;
  const { user } = useUser();
  const { data: posts, isLoading } = api.posts.getByUserId.useQuery({
    userId: userId,
  });

  if (isLoading) return <LoadingPage />;
  if (!posts || posts.length === 0) {
    return <div>{user?.username} has not posted</div>;
  }
  return (
    <div className="flex flex-col">
      {posts.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
}
