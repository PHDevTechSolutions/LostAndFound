import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await connectToDatabase();
      const containerCollection = db.collection("container_order");

      // Aggregate GrossSales per DateOrder, converting GrossSales to number if necessary
      const result = await containerCollection.aggregate([
        {
          $addFields: {
            GrossSales: { $toDouble: "$GrossSales" }, // Convert to number if it's stored as a string
          },
        },
        {
          $group: {
            _id: "$DateOrder", // Group by DateOrder
            totalGrossSales: { $sum: "$GrossSales" }, // Sum GrossSales per day
          },
        },
        {
          $sort: { _id: 1 }, // Sort by DateOrder
        },
      ]).toArray();

      console.log("Aggregated Sales Data:", result); // Debug log for sales data
      res.status(200).json(result);
    } catch (error) {
      console.error("Error fetching containers:", error);
      res.status(500).json({ success: false, message: "Error fetching containers", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
