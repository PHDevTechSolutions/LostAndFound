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

    if (location === "Philippines") {
      // No location filter applied, showing data from all locations
      // Do nothing in terms of filtering Location here
    } else if (location && location !== "All") {
      // Apply location filter if specified and not "All"
      matchCondition.Location = location;
    }

    // Check if user is Super Admin or Director
    if (role === "Super Admin" || role === "Directors") {
      // Super Admin and Directors can see all locations if "All" is selected
      if (location && location !== "All" && location !== "Philippines") {
        // Apply location filter if a location other than 'Philippines' is specified
        matchCondition.Location = location;
      }
    } else {
      // For other roles (Admin, Staff, etc.), restrict by location if not "All"
      if (location && location === "All") {
        // Show all locations if "All" is selected for other roles
        // No additional filter is added, so all locations will be included
      } else if (location && location !== "Philippines") {
        // Apply location filter for other roles if a specific location is selected
        matchCondition.Location = location;
      }
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
