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

    // Condition to check if user is Super Admin or Director
    const matchCondition: any = { Status: "Inventory" };
    if (role !== "Super Admin" && role !== "Directors") {
      matchCondition.Location = location; // Restrict by location if not Super Admin or Director
    }

    // Fetch count of Inventory where status is "Inventory" and location matches
    const result = await containerCollection
      .aggregate([
        { $match: matchCondition },
        {
          $group: {
            _id: "$Status",
            inventoryCount: { $sum: 1 },
          },
        },
      ])
      .toArray();

    const inventoryTotal = result.length > 0 ? result[0].inventoryCount : 0;

    res.status(200).json({ inventoryTotal });
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    res.status(500).json({ success: false, message: "Error fetching inventory data", error });
  }
}
