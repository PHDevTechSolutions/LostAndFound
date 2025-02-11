import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const db = await connectToDatabase();
      const containerCollection = db.collection("container_order");

      // Aggregate total number of BoxSales and total price per Commodity
      const result = await containerCollection.aggregate([
        {
          $addFields: {
            Commodity: { $ifNull: ["$Commodity", ""] }, // Handle empty or null Commodity values
            BoxSales: { $toDouble: "$BoxSales" }, // Convert BoxSales to number (even if it is a string)
            Price: { $toDouble: "$Price" }, // Convert Price to number (even if it is a string)
          },
        },
        {
          $group: {
            _id: "$Commodity", // Group by Commodity
            totalBoxSales: { $sum: "$BoxSales" }, // Sum BoxSales for each Commodity
            totalPrice: { $sum: { $multiply: ["$BoxSales", "$Price"] } }, // Sum total price for each Commodity
          },
        },
        {
          $sort: { totalBoxSales: -1 }, // Sort by totalBoxSales in descending order
        },
        {
          $project: {
            commodityName: "$_id", // Rename _id to commodityName
            totalBoxSales: 1,
            totalPrice: 1,
            _id: 0, // Remove _id from the output
          },
        },
      ]).toArray();

      // Map the results to match the output format you want (Commodity - BoxSales - Price)
      const formattedResult = result.map(item => ({
        commodityName: item.commodityName,
        totalBoxSales: item.totalBoxSales,
        totalPrice: item.totalPrice,
      }));

      console.log("Formatted Box Sales Data by Commodity:", formattedResult); // Debug log for sales data

      // Send the formatted data to the frontend
      res.status(200).json(formattedResult);
    } catch (error) {
      console.error("Error fetching containers:", error);
      res.status(500).json({ success: false, message: "Error fetching containers", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
