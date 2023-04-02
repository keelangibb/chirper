import { useUser } from "@clerk/nextjs";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { api, type RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][0];

export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  const ctx = api.useContext();
  const { user } = useUser();

  const { mutate: deletePost } = api.posts.delete.useMutation({
    onSuccess() {
      void ctx.posts.getAll.invalidate();
      toast.success("Post deleted!");
    },
    onError() {
      toast.error("Failed to delete post! Please try again later.");
    },
  });

  return (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}s profile image`}
        className="rounded-full"
        height={56}
        width={56}
      />
      <div className="flex grow flex-col">
        <div className="flex gap-1 text-slate-300">
          <Link href={`/@${author.username}`}>
            <span>@{author.username}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">{` • ${dayjs(
              post.createdAt
            ).fromNow()}`}</span>
          </Link>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
      {post.authorId === user?.id && (
        <button
          onClick={() => {
            deletePost({
              postId: post.id,
            });
          }}
        >
          Delete Post
        </button>
      )}
    </div>
  );
}
