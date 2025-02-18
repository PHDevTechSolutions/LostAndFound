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

    // Get current date and set to start of day (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today (midnight)

    // Get end of day (11:59:59 PM)
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999); // End of today (end of day)

    // Define the match condition for the date range
    const matchCondition: any = {
      DateOrder: { $gte: today, $lte: endOfDay }, // Match records within today's date range
      PaymentMode: "PDC", // Filter for "PDC" PaymentMode
    };

    // Location filter logic
    if (location === "Philippines") {
      // No location filter applied, showing data from all locations
    } else if (location && location !== "All") {
      matchCondition.Location = location; // Apply location filter if specified
    }

    // Role-based location filtering
    if (role === "Super Admin" || role === "Directors") {
      if (location && location !== "All" && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter for Super Admin and Directors
      }
    } else {
      if (location && location === "All") {
        // No additional filter added for "All"
      } else if (location && location !== "Philippines") {
        matchCondition.Location = location; // Apply location filter for other roles
      }
    }

    // Fetch total BalanceAmount for today based on createdAt and PaymentMode
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DateOrder: { $toDate: "$DateOrder" }, // Ensure createdAt field is treated as Date
            BalanceAmount: { $toDouble: "$BalanceAmount" }, // Convert BalanceAmount to number
          },
        },
        { $match: matchCondition }, // Apply match condition (date, location, and PaymentMode)
        {
          $group: {
            _id: null, // Group all records to calculate the sum
            totalBalanceToday: { $sum: "$BalanceAmount" }, // Sum of BalanceAmount
          },
        },
      ])
      .toArray();

    const BalanceToday = result.length > 0 ? result[0].totalBalanceToday : 0;

    res.status(200).json({ totalBalanceToday: BalanceToday });
  } catch (error) {
    console.error("Error fetching receivable data:", error);
    res.status(500).json({ success: false, message: "Error fetching receivable data", error });
  }
}
