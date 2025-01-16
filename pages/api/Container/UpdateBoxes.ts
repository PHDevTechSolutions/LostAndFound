import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../lib/mongodb"; // Adjust your DB connection

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    const { id, Boxes } = req.body;

    if (!id || Boxes === undefined) {
      return res.status(400).json({ message: "ID and Boxes are required." });
    }

    try {
      const { db } = await connectToDatabase();
      const container = await db.collection("containers").findOneAndUpdate(
        { _id: new ObjectId(id) }, // Use your appropriate MongoDB ObjectId type
        {
          $set: { Boxes }
        },
        { returnDocument: "after" }
      );

      if (!container.value) {
        return res.status(404).json({ message: "Container not found." });
      }

      res.status(200).json({ message: "Boxes updated successfully." });
    } catch (error) {
      console.error("Error updating boxes:", error);
      res.status(500).json({ message: "Failed to update boxes." });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}

export default handler;
