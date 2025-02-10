import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    // Fetch the latest balance before today using DatePediente
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" }, // Ensure DatePediente field is treated as Date
            BalanceAmount: { $toDouble: "$BalanceAmount" }, // Convert BalanceAmount to number
          },
        },
        {
          $match: {
            DatePediente: { $lt: today }, // Get records before today using DatePediente
          },
        },
        {
          $group: {
            _id: null, // Get sum of all previous balances and GrossSales
            totalBalance: { $sum: "$BalanceAmount" },
          },
        },
      ])
      .toArray();

    const previousBalance = result.length > 0 ? result[0].totalBalance : 0;

    res.status(200).json({ previousBalance }); // Send both previousBalance and totalGrossSalesToday
  } catch (error) {
    console.error("Error fetching pediente data:", error);
    res.status(500).json({ success: false, message: "Error fetching pediente data", error });
  }
}
