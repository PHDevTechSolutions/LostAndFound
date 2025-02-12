import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location, role } = req.query; // Extract role and location from the query

  try {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    const matchCondition: any = { DatePediente: { $gte: yesterday, $lt: today } };
    if (role !== "Super Admin" && role !== "Directors") {
      matchCondition.Location = location; // Restrict by location if not Super Admin or Director
    }

    // Step 1: Try to get yesterday's balance
    let result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" }, // Ensure DatePediente field is treated as Date
            BalanceAmount: { $toDouble: "$BalanceAmount" }, // Convert BalanceAmount to number
          },
        },
        { $match: matchCondition },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$BalanceAmount" }, // Sum of yesterday’s BalanceAmount
          },
        },
      ])
      .toArray();

    // If no data for yesterday, find the latest available previous balance
    if (result.length === 0) {
      const lastAvailableData = await pedienteCollection
        .find({ DatePediente: { $lt: today } }) // Get records before today
        .sort({ DatePediente: -1 }) // Sort descending to get the most recent one
        .limit(1)
        .toArray();

      if (lastAvailableData.length > 0) {
        return res.status(200).json({
          previousBalance: parseFloat(lastAvailableData[0].BalanceAmount) || 0,
          message: `No data for yesterday. Using last available data from ${lastAvailableData[0].DatePediente}.`,
        });
      }

      return res.status(200).json({ previousBalance: 0, message: "No historical data available." });
    }

    res.status(200).json({ previousBalance: result[0].totalBalance });

  } catch (error) {
    console.error("Error fetching pediente data:", error);
    res.status(500).json({ success: false, message: "Error fetching pediente data", error });
  }
}
