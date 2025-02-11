import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container_order");

    // Get today's date in the format YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];

    // Aggregate GrossSales per DateOrder, filtering by PaymentMode and today's date
    const result = await containerCollection.aggregate([
      {
        $match: {
          PaymentMode: "Cash", // Filter by PaymentMode: "Cash"
          DateOrder: today, // Filter by today's date in YYYY-MM-DD format
        },
      },
      {
        $addFields: {
          GrossSales: { $toDouble: "$GrossSales" }, // Convert GrossSales to a double (number)
        },
      },
      {
        $group: {
          _id: null, // No grouping by DateOrder, just sum the GrossSales
          totalGrossSalesToday: { $sum: "$GrossSales" }, // Sum GrossSales for today
        },
      },
    ]).toArray();

    // If there are results, get the total GrossSales for today; otherwise, set it to 0
    const totalGrossSalesToday = result.length > 0 ? result[0].totalGrossSalesToday : 0;

    res.status(200).json({ totalGrossSalesToday });
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ success: false, message: "Error fetching sales data", error });
  }
}
