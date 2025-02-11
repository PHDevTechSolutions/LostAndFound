import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  const { location } = req.query; // Extract the location from the query string

  try {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente");

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day

    // Fetch total GrossSales for today based on DatePediente
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" }, // Ensure DatePediente field is treated as Date
            GrossSales: { $toDouble: "$GrossSales" }, // Convert GrossSales to number
          },
        },
        {
          $match: {
            DatePediente: { $gte: today }, // Match records for today or later
            Location: location,
          },
        },
        {
          $group: {
            _id: null, // Sum the GrossSales
            totalGrossSalesToday: { $sum: "$GrossSales" },
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
