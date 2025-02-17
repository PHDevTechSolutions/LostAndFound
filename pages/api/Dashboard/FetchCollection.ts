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

    const matchCondition: any = {
      createdAt: { $gte: today }, // Filter by today's date
      PaymentMode: "PDC", // Only sum records with PaymentMode "PDC"
    };

    // Location-based filtering
    if (location === "Philippines") {
      // No location filter applied, showing data from all locations
    } else if (location && location !== "All") {
      // Apply location filter if specified and not "All"
      matchCondition.Location = location;
    }

    // Role-based location filtering
    if (role === "Super Admin" || role === "Directors") {
      if (location && location !== "All" && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter if not Philippines
      }
    } else {
      if (location && location === "All") {
        // Show all locations if "All" is selected for other roles
      } else if (location && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter for other roles
      }
    }

    // Fetch total PayAmount for today where PaymentMode is "PDC"
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            createdAt: { $toDate: "$createdAt" }, // Ensure createdAt field is treated as Date
            PayAmount: {
              $ifNull: [
                { $toDouble: { $cond: { if: { $eq: ["$PayAmount", ""] }, then: 0, else: "$PayAmount" } } },
                0,
              ], // Ensure PayAmount is treated as number, default to 0 if empty
            },
          },
        },
        { $match: matchCondition }, // Apply match condition (date, location, and PaymentMode)
        {
          $group: {
            _id: null, // Group all records to calculate the sum
            totalCollectionToday: { $sum: "$PayAmount" }, // Sum of PayAmount
          },
        },
      ])
      .toArray();

    const totalCollectionToday = result.length > 0 ? result[0].totalCollectionToday : 0;

    res.status(200).json({ totalCollectionToday });
  } catch (error) {
    console.error("Error fetching receivable data:", error);
    res.status(500).json({ success: false, message: "Error fetching receivable data", error });
  }
}
