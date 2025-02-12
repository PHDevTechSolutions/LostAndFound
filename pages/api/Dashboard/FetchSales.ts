import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {

    const { location, role } = req.query; // Extract role and location from the query

    try {
      const db = await connectToDatabase();
      const containerCollection = db.collection("container_order");

      const matchCondition: any = {};

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

      // Aggregate GrossSales per DateOrder, filtering by location and converting GrossSales to number if necessary
      const result = await containerCollection.aggregate([
        { $match: matchCondition },
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
