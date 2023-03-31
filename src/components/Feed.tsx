import { api } from "~/utils/api";
import { LoadingPage } from "./LoadingSpinner";
import PostView from "./PostView";

export default function Feed() {
  const { data: posts, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading)
    return (
      <div className="flex grow">
        <LoadingPage />
      </div>
    );
  if (!posts) return <div>Something went wrong</div>;

  return (
    <div className="flex grow flex-col">
      {posts.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
}
