import Head from "next/head";

import Header from "components/Header";
import Hero from "components/Hero";

import { sanityClient, urlFor } from "../sanity";
import { Post } from "typings";
import Link from "next/link";

interface Props {
  posts: Post[];
}

export default function Home({ posts }: Props) {
  console.log("🚀 ~ posts", posts);

  return (
    <div className="mx-auto max-w-7xl">
      <Head>
        <title>Medium Clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />
      <Hero />
      {/* Posts */}
      <main className="grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 lg:grid-cols-3 md:gap-6 md:p-6">
        {posts.map((post) => (
          <Link href={`/posts/${post.slug.current}`} key={post._id}>
            <div className="overflow-hidden border rounded-lg cursor-pointer group">
              <img
                className="object-cover w-full transition-transform duration-200 ease-in-out group-hover:scale-105 h-60"
                src={urlFor(post.mainImage).url()!}
                alt={post.title}
              />
              <div className="flex justify-between p-5 bg-white">
                <div>
                  <p className="text-lg font-bold">{post.title}</p>
                  <p className="text-xs">
                    {post.description} by {post.author.name}
                  </p>
                </div>
                <img
                  className="w-12 h-12 rounded-full"
                  src={urlFor(post.author.image).url()!}
                  alt={post.author.name}
                />
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}

export const getServerSideProps = async () => {
  const response = `
  *[_type == 'post'] {
    _id,
    title,
    description,
    slug,
    mainImage,
    author -> {
      name,
    image
    },
  }
  `;

  const posts = await sanityClient.fetch(response);

  return { props: { posts } };
};
