import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Link from "next/link";
import type { RouterOutputs } from "~/utils/api";
import ProfileImage from "./ProfileImage";

dayjs.extend(relativeTime);

type PostWithUser = RouterOutputs["posts"]["getAll"][0];

export default function PostView({ post, author }: PostWithUser) {
  return (
    <div className="flex gap-3 border-b border-slate-400 p-4">
      <ProfileImage user={author} />
      <div className="flex flex-col">
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
    </div>
  );
}
