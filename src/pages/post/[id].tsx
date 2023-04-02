import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { PageLayout } from "~/components/PageLayout";
import PostView from "~/components/PostView";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";

const SinglePostPage: NextPage<{ postId: string }> = ({ postId }) => {
  const { data: post } = api.posts.getByPostId.useQuery({ postId: postId });
  if (!post) return <div>404</div>;

  return (
    <>
      <Head>
        <title>Post</title>
      </Head>
      <PageLayout>
        <PostView {...post} />
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();

  const postId = context.params?.id;

  if (typeof postId !== "string") throw new Error("no postId");

  await ssg.posts.getByPostId.prefetch({ postId: postId });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      postId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default SinglePostPage;
