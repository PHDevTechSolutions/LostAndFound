import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location, role } = req.query; // Extract role and location from the query

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container");

    const matchCondition: any = { Status: "Soldout" };
    if (role !== "Super Admin" && role !== "Directors") {
      matchCondition.Location = location; // Restrict by location if not Super Admin or Director
    }

    // Fetch count of Inventory where status is "Inventory"
    const result = await containerCollection
      .aggregate([
        { $match: matchCondition },
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
