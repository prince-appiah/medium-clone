import { GetStaticProps } from "next";
import { SubmitHandler, useForm } from "react-hook-form";
import PortableText from "react-portable-text";
import { sanityClient, urlFor } from "sanity";
import Header from "components/Header";
import { Post } from "typings";
import { useState } from "react";

export const getStaticPaths = async () => {
  const response = `
    *[_type == 'post'] {
      _id,
      slug {
        current
      }, 
      
    }
    `;

  const posts = await sanityClient.fetch(response);
  const paths = posts.map((post: Post) => ({
    params: { slug: post.slug.current },
  }));
  console.log("🚀 ~ paths", paths);

  return { paths, fallback: "blocking" };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const response = `
    *[_type == 'post' && slug.current == $slug][0] {
      _id,
      _createdAt,
      title,
      slug,
      description,
      mainImage,
      body,
      'comments': *[_type == 'comment' && post._ref == ^._id && approved == true],
      author -> {
        name,
        image
      },
    }
    `;

  const post = await sanityClient.fetch(response, { slug: params?.slug });

  if (!post) {
    return { notFound: true };
  }

  return { props: { post }, revalidate: 60 };
};

interface Props {
  post: Post;
}

interface IForm {
  _id: string;
  name: string;
  email: string;
  comment: string;
}

const Post = ({ post }: Props) => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState } = useForm<IForm>();

  const onSubmit: SubmitHandler<IForm> = async (data) => {
    try {
      setSubmitted(false);
      console.log("🚀 ~ data", data);
      const res = await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify(data),
      });

      console.log("🚀 ~ res", res);

      // await sanityClient.create(res)
    } catch (error) {
      console.log("🚀 ~ error", error);
    }
  };

  return (
    <main className="">
      <Header />
      <img
        className="object-cover w-full h-40"
        src={urlFor(post.mainImage).url()!}
        alt={post.title}
      />

      <article className="max-w-3xl p-5 mx-auto">
        <h1 className="mt-10 mb-3 text-3xl">{post.title}</h1>
        <h2 className="mb-2 text-xl font-light text-gray-500">
          {post.description}
        </h2>
        <div className="flex items-center space-x-2 space-between ">
          <img
            className="w-10 h-10 rounded-full"
            src={urlFor(post.author.image).url()!}
            alt={post.author.name}
          />
          <p className="text-sm font-extralight">
            Post by: <span className="text-green-600">{post.author.name}</span>{" "}
            - Published at {post._createdAt.toLocaleString()}
          </p>
        </div>

        <div className="mt-10">
          <PortableText
            className=""
            serializers={{
              h1: (props: any) => <h1 className="my-5 text-2xl font-bold" />,
              h2: (props: any) => <h2 className="my-5 text-xl font-bold" />,
              li: (props: any) => <li className="mt-4 font-bold list-disc " />,
              link: ({ href, children }: any) => (
                <a className="text-blue-500 hover:underline">{children}</a>
              ),
            }}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
            content={post.body}
          />
        </div>
      </article>

      {/* Comments */}
      <div className="flex flex-col p-10 mx-auto my-10 space-y-2 shadow shadow-yellow-500">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2 " />
        {post.comment &&
          post.comment.map((item) => (
            <div className="" key={item._id}>
              <p className="">
                <span className="text-yellow-500">{item.name}</span>:{" "}
                {item.comment}
              </p>
            </div>
          ))}
      </div>

      {/* Comment Form  */}
      <hr className="max-w-lg mx-auto my-5 border border-yellow-500" />

      {submitted ? (
        <div className="flex max-w-2xl py-10 mx-auto my-10 text-white bg-yellow-500 flex-cols">
          <h3 className="text-3xl font-bold">Thanks for you comment</h3>
          <p className="">
            Your comment will be displayed publicly if the author approves it
          </p>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col max-w-2xl p-5 mx-auto mb-20my-10"
        >
          <input
            {...register("_id")}
            type="hidden"
            name="_id"
            value={post._id}
          />

          <label className="block mb-5" htmlFor="name">
            <span className="text-gray-700">Name:</span>
            <input
              {...register("name", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500"
              name="name"
              type="text"
              placeholder="Your full name here"
            />
          </label>
          <label className="block mb-5" htmlFor="">
            <span className="text-gray-700">Email:</span>
            <input
              {...register("email", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow form-input ring-yellow-500"
              name="email"
              type="email"
              placeholder="Your full name here"
            />
          </label>
          <label className="block mb-5" htmlFor="">
            <span className="text-gray-700">Comment:</span>
            <input
              {...register("comment", { required: true })}
              className="block w-full px-3 py-2 mt-1 border rounded shadow outline-none focus:ring form-textarea ring-yellow-500"
              name="comment"
              type="text"
              placeholder="Your full name here"
            />
          </label>
          {/* <label className='block mb-5' htmlFor="">
        <span className="text-gray-700">Comment:</span>
        <textarea name=""   placeholder="Your full name here" rows={8} />
      </label> */}

          {/* Errors */}
          <div className="flex p-5 flex-cols">
            {formState.errors.name ?? (
              <span className="text-red-500">Name is required</span>
            )}
            {formState.errors.email ?? (
              <span className="text-red-500">Email is required</span>
            )}
            {formState.errors.comment ?? (
              <span className="text-red-500">Comment is required</span>
            )}
          </div>

          {/* Button */}
          <button
            className="px-4 py-2 font-bold text-white bg-yellow-500 rounded cursor-pointer focus:shadow-outline hover:bg-yellow-400 focus:outline-none"
            type="submit"
          >
            Add Comment
          </button>
        </form>
      )}
    </main>
  );
};

export default Post;
