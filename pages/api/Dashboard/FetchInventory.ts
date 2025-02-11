import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location } = req.query; // Extract the location from the query string

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container");

    // Fetch count of Inventory where status is "Inventory" and location matches
    const result = await containerCollection
      .aggregate([
        {
          $match: {
            Status: "Inventory", // Only match documents where status is "Inventory"
            Location: location, // Match documents based on the location
          },
        },
        {
          $group: {
            _id: "$Status", // Group by status
            inventoryCount: { $sum: 1 }, // Count the number of inventory for each status
          },
        },
      ])
      .toArray();

    // Get the inventory total from the aggregation result (if available)
    const inventoryTotal = result.length > 0 ? result[0].inventoryCount : 0;

    res.status(200).json({ inventoryTotal });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    res.status(500).json({ success: false, message: "Error fetching inventory data", error });
  }
}
