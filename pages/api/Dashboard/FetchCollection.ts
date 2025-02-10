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

    // Fetch total GrossSales for today based on DatePediente
    const result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" }, // Ensure DatePediente field is treated as Date
            PayAmount: { $ifNull: [{ $toDouble: { $cond: { if: { $eq: ["$PayAmount", ""] }, then: 0, else: "$PayAmount" } } }, 0] }, // Provide a default value of 0 if PayAmount is null or empty
          },
        },
        {
          $match: {
            DatePediente: { $gte: today }, // Match records for today or later
          },
        },
        {
          $group: {
            _id: null, // Sum the GrossSales
            totalCollectionToday: { $sum: "$PayAmount" },
          },
        },
      ])
      .toArray();

    const CollectionToday = result.length > 0 ? result[0].totalCollectionToday : 0;

    res.status(200).json({ totalCollectionToday: CollectionToday });
  } catch (error) {
    console.error("Error fetching receivable data:", error);
    res.status(500).json({ success: false, message: "Error fetching receivable data", error });
  }
}
