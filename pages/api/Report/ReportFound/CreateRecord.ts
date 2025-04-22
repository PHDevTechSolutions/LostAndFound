import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";

// Function to add an data directly in this file
async function Add({ 
    ReferenceNumber, Email, DateFound, ItemName, FoundLocation, Message, ItemOwner, ItemFinder, ItemStatus }: {

  ReferenceNumber: string;
  Email: string;
  DateFound: string;
  ItemName: string;
  FoundLocation: string;
  Message: string;
  ItemOwner: string;
  ItemFinder: string;
  ItemStatus: string;

}) {
  const db = await connectToDatabase();
  const DataCollection = db.collection("ReportFound");

  // Create data
  const newData = { ReferenceNumber, Email, DateFound, ItemName, FoundLocation, Message, ItemOwner, ItemFinder, ItemStatus, createdAt: new Date() };

  // Insert new data into the collection
  await DataCollection.insertOne(newData);
  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { ReferenceNumber, Email, DateFound, ItemName, FoundLocation, Message, ItemOwner, ItemFinder, ItemStatus
     } = req.body;

    // Validate required fields
    if (!ReferenceNumber) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await Add({ ReferenceNumber, Email, DateFound, ItemName, FoundLocation, Message, ItemOwner, ItemFinder, ItemStatus
      });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding data:", error);
      res.status(500).json({ success: false, message: "Error adding data", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
