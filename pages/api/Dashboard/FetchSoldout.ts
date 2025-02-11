import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container");

    // Fetch count of Inventory where status is "Inventory"
    const result = await containerCollection
      .aggregate([
        {
          $match: {
            Status: "Soldout", // Only match documents where status is "Inventory"
          },
        },
        {
          $group: {
            _id: "$Status", // Group by status
            SoldoutCount: { $sum: 1 }, // Count the number of inventory for each status
          },
        },
      ])
      .toArray();

    // Get the inventory total from the aggregation result (if available)
    const SoldoutTotal = result.length > 0 ? result[0].SoldoutCount : 0;

    res.status(200).json({ SoldoutTotal });
  } catch (error) {
    console.error("Error fetching soldout data:", error);
    res.status(500).json({ success: false, message: "Error fetching soldout data", error });
  }
}
