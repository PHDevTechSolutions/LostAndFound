import { NextApiRequest, NextApiResponse } from "next";
import { addPost } from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { title, description, status, link, author, categories, tags, featureImage } = req.body;

    try {
      const result = await addPost({
        title,
        description,
        status,
        link,
        author,
        categories,
        tags,
        featureImage,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error adding post", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
