import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import type { RouterOutputs } from "~/utils/api";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][0];
export default function PostView(props: PostWithUser) {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4">
      <Image
        src={author.profileImageUrl}
        alt={`@${author.username}s profile image`}
        className="rounded-full"
        height={56}
        width={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-300">
          <span>{`@${author.username}`}</span>
          <span className="font-thin">{` • ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span className="text-2xl">{post.content}</span>
      </div>
    </div>
  );
}
