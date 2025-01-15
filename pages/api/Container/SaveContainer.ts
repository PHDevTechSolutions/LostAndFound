import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to save container data
async function saveContainer({ ContainerNo, Username, Location, BoxType, DateOrder, BuyersName, BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode }: {
  ContainerNo: string;
  Username: string;
  Location: string;
  BoxType: string;
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
  const newData = { ContainerNo, Username, Location, BoxType, DateOrder, BuyersName,BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode, createdAt: new Date() };
  await containerCollection.insertOne(newData);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newData", newData);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ContainerNo, Username, Location, BoxType, DateOrder, BuyersName, BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode } = req.body;

    // Validate required fields
    if (!BoxType || !BuyersName) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await saveContainer({ ContainerNo, Username, Location, BoxType, DateOrder, BuyersName, BoxSales, Price, Remaining, GrossSales, PlaceSales, PaymentMode });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error saving container:", error);
      res.status(500).json({ success: false, message: "Error saving container", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
