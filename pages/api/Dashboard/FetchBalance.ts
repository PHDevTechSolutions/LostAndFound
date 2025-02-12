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

    const matchCondition: any = { DatePediente: { $gte: today } };
    if (role !== "Super Admin" && role !== "Directors") {
      matchCondition.Location = location; // Restrict by location if not Super Admin or Director
    }

    // Fetch total GrossSales for today based on DatePediente
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" }, // Ensure DatePediente field is treated as Date
            BalanceAmount: { $toDouble: "$BalanceAmount" }, // Convert GrossSales to number
          },
        },
        { $match: matchCondition },
        {
          $group: {
            _id: null, // Sum the GrossSales
            totalBalanceToday: { $sum: "$BalanceAmount" },
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
