import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import { PageLayout } from "~/components/PageLayout";
import { api } from "~/utils/api";
import CreatePostWizard from "../components/CreatePostWizard";
import Feed from "../components/Feed";

const Home: NextPage = () => {
  const { isLoaded: userLoaded, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  // Return null if the user or posts haven't loaded yet, since user tends to load faster than posts
  if (!userLoaded) return <div />;

  return (
    <PageLayout>
      <div className="flex border-b border-slate-400 p-4">
        {isSignedIn ? <CreatePostWizard /> : <SignInButton />}
      </div>
      <Feed />
    </PageLayout>
  );
};

export default Home;
