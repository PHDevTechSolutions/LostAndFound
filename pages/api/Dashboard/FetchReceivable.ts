import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location, role } = req.query; // Extract role and location from the query

  try {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("container_order");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    // Define the base match condition for the date range
    const matchCondition: any = {
      createdAt: { $gte: today },
      PaymentMode: "PDC", // Add condition to filter by PaymentMode "PDC"
    };

    // Apply location filter based on role and location
    if (location === "Philippines") {
      // No location filter applied, showing data from all locations
    } else if (location && location !== "All") {
      // Apply location filter if specified and not "All"
      matchCondition.Location = location;
    }

    // Check if user is Super Admin or Director
    if (role === "Super Admin" || role === "Directors") {
      // Super Admin and Directors can see all locations if "All" is selected
      if (location && location !== "All" && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter
      }
    } else {
      // For other roles (Admin, Staff, etc.), restrict by location if not "All"
      if (location && location === "All") {
        // Show all locations if "All" is selected for other roles
      } else if (location && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter
      }
    }

    // Fetch total GrossSales for today with PaymentMode "PDC"
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            createdAt: { $toDate: "$createdAt" }, // Ensure createdAt field is treated as Date
            GrossSales: { $toDouble: "$GrossSales" }, // Convert GrossSales to number
          },
        },
        { $match: matchCondition }, // Match records based on the condition
        {
          $group: {
            _id: null, // Group all records to calculate the sum
            totalGrossSalesToday: { $sum: "$GrossSales" }, // Sum of GrossSales
          },
        },
      ])
      .toArray();

    const grossSalesToday = result.length > 0 ? result[0].totalGrossSalesToday : 0;

    res.status(200).json({ totalGrossSalesToday: grossSalesToday });
  } catch (error) {
    console.error("Error fetching receivable data:", error);
    res.status(500).json({ success: false, message: "Error fetching receivable data", error });
  }
}
