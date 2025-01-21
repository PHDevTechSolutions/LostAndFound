import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to save container data
async function saveContainer({
  ContainerNo, Size, Username, Location, DateOrder, BuyersName,
  BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode
}: {
  ContainerNo: string;
  Size: string;
  Username: string;
  Location: string;
  DateOrder: string;
  BuyersName: string;
  BoxSales: string;
  Price: string;
  Remaining: string;
  GrossSales: string;
  PlaceSales: string;
  PaymentMode: string;
}) {
  const db = await connectToDatabase();
  const containerCollection = db.collection("container_order");

  // Check if a container with the same ContainerNo exists
  const existingContainer = await containerCollection.findOne({ ContainerNo });

  if (existingContainer) {
    // Compare the existing data with the new data
    if (
      existingContainer.Size === Size &&
      existingContainer.Username === Username &&
      existingContainer.Location === Location &&
      existingContainer.DateOrder === DateOrder &&
      existingContainer.BuyersName === BuyersName &&
      existingContainer.BoxSales === BoxSales &&
      existingContainer.Price === Price &&
      existingContainer.Remaining === Remaining &&
      existingContainer.GrossSales === GrossSales &&
      existingContainer.PlaceSales === PlaceSales &&
      existingContainer.PaymentMode === PaymentMode
    ) {
      return { success: false, message: "Duplicate entry with the same data." }; // Reject exact duplicates
    }
  }

  // Proceed with inserting new data if it's not a duplicate
  const newData = {
    ContainerNo,
    Size,
    Username,
    Location,
    DateOrder,
    BuyersName,
    BoxSales,
    Price,
    Remaining,
    GrossSales,
    PlaceSales,
    PaymentMode,
    createdAt: new Date(),
  };

  await containerCollection.insertOne(newData);

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ContainerNo, Size, Username, Location, DateOrder, BuyersName, BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode } = req.body;

    // Validate required fields
    if (!Size || !BuyersName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await saveContainer({
        ContainerNo, Size, Username, Location, DateOrder, BuyersName, 
        BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode
      });

      if (!result.success) {
        return res.status(400).json(result); // Respond with error message if duplicate entry is detected
      }

      res.status(200).json(result); // Respond with success message
    } catch (error) {
      console.error("Error saving container:", error);
      res.status(500).json({ success: false, message: "Error saving container", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
