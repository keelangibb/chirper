import { UserButton, useUser } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { createSchema } from "~/shared/schemas/posts.schema";
import { api } from "~/utils/api";
import LoadingSpinner from "./LoadingSpinner";
export default function CreatePostWizard() {
  const { user } = useUser();
  const [input, setInput] = useState("");

  if (!user) return null;

  const ctx = api.useContext();

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.posts.getAll.invalidate();
    },
    onError: (e) => {
      const errorMessage = e.data?.zodError?.fieldErrors?.content;
      if (errorMessage?.[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
    },
  });

  return (
    <div className="flex w-full gap-3">
      <UserButton
        afterSignOutUrl="/"
        appearance={{
          elements: {
            userButtonAvatarBox: {
              width: 56,
              height: 56,
            },
          },
        }}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            createPost();
          }
        }}
      />
      {input !== "" && !isPosting && <button onClick={createPost}>Post</button>}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </div>
  );

  function createPost() {
    const result = createSchema.safeParse({ content: input });
    if (result.success) return mutate({ content: input });

    toast.error(
      result.error.issues[0]?.message ??
        "Failed to post! Please try again later."
    );
  }
}
