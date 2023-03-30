import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { api } from "~/utils/api";
import CreatePostWizard from "../components/CreatePostWizard";
import Feed from "../components/Feed";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  // Return null if the user or posts haven't loaded yet, since user tends to load faster than posts
  if (!userLoaded) return null;

  return (
    <>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl ">
          <div className="flex justify-center border-b border-slate-400 p-4">
            {isSignedIn ? <CreatePostWizard /> : <SignInButton />}
          </div>
          <Feed />
        </div>
      </main>
    </>
  );
};

export default Home;
