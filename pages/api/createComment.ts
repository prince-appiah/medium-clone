// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import sanityClient from "@sanity/client";

type Data = {
  name: string;
};

const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: process.env.NODE_ENV == "production",
  token: process.env.SANITY_API_TOKEN,
};

const client = sanityClient(config);

export default async function addComment(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { _id, name, email, comment } = req.body;

  try {
    const data = await client.create({
      _type: "comment",
      name,
      email,
      comment,
      post: { _type: "reference", _ref: _id },
    });

    return res.status(201).json(data);
  } catch (error) {
    console.log("🚀 ~ error", error);
    return res.status(500).json({ error: "Could not create comment" });
  }
}
