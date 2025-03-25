import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";

// Function to add an account directly in this file
async function addPurchasing({ 
    ReferenceNumber, Location, DatePurchased, SupplierBrand, ItemPurchased, Type, Quantity, PurchasedAmount }: {

  ReferenceNumber: string;
  Location: string;

  DatePurchased: string;
  SupplierBrand: string;
  ItemPurchased: string;
  Type: string;
  Quantity: string;
  PurchasedAmount: string;

}) {
  const db = await connectToDatabase();
  const containerCollection = db.collection("companyassets");

  // Create container data
  const newData = { ReferenceNumber, Location, DatePurchased, SupplierBrand, ItemPurchased, Type, Quantity, PurchasedAmount, createdAt: new Date() };

  // Insert new container data into the container collection
  await containerCollection.insertOne(newData);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newData", newData);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ReferenceNumber, Location, DatePurchased, SupplierBrand, ItemPurchased, Type, Quantity, PurchasedAmount
     } = req.body;

    // Validate required fields
    if (!ReferenceNumber || !Location) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addPurchasing({ ReferenceNumber, Location, DatePurchased, SupplierBrand, ItemPurchased, Type, Quantity, PurchasedAmount
      });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding container:", error);
      res.status(500).json({ success: false, message: "Error adding container", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
