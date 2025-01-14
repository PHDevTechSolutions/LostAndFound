import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await connectToDatabase();
      const containerCollection = db.collection("container_order");
      const containers = await containerCollection.find({}).toArray();
      res.status(200).json(containers);
    } catch (error) {
      console.error("Error fetching containers:", error);
      res.status(500).json({ success: false, message: "Error fetching containers", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
