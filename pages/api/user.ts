//pages/api/user.ts

import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const db = await connectToDatabase();
    const userId = req.query.id as string;
    
    try {
      const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });

      if (user) {
        res.status(200).json({ name: user.name, email: user.email });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Invalid user ID format" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
