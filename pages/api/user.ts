import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await connectToDatabase();
    const user = await db.collection("users").findOne({ email: req.query.email });

    if (user) {
      res.status(200).json({ name: user.name, email: user.email });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
