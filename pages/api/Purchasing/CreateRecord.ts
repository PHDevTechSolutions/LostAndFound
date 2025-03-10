import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to add an account directly in this file
async function addPurchasing({ 
    ReferenceNumber, Location, InvoiceDate, SupplierName, InvoiceNumber, Description, TypeFish, Freezing, Weight, UnitPrice, InvoiceAmount,
    FirstPayment, SecondPayment, ThirdPayment, FinalPayment, Discount, Commission, CableFee, DateApproval, Status, Remarks, Action }: {

  ReferenceNumber: string;
  Location: string;
  InvoiceDate: string;
  SupplierName: string;
  InvoiceNumber: string;
  Description: string;
  TypeFish: string;
  Freezing: string;
  Weight: number;
  UnitPrice: number;
  InvoiceAmount: number;
  FirstPayment: number;
  SecondPayment: number;
  ThirdPayment: number;
  FinalPayment: number;
  Discount: number;
  Commission: number;
  CableFee: number;
  DateApproval: string;
  Status: string;
  Remarks: string;
  Action: string;

}) {
  const db = await connectToDatabase();
  const containerCollection = db.collection("purchasing");

  // Create container data
  const newData = { ReferenceNumber, Location, InvoiceDate, SupplierName, InvoiceNumber, Description, TypeFish, Freezing, Weight, UnitPrice,
                    InvoiceAmount, FirstPayment, SecondPayment, ThirdPayment, FinalPayment, Discount, Commission, CableFee, DateApproval, Status, Remarks, Action, createdAt: new Date() };

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
    const { ReferenceNumber, Location, InvoiceDate, SupplierName, InvoiceNumber, Description, TypeFish, Freezing, Weight, UnitPrice, InvoiceAmount, FirstPayment, SecondPayment,
            ThirdPayment, FinalPayment, Discount, Commission, CableFee, DateApproval, Status, Remarks, Action
     } = req.body;

    // Validate required fields
    if (!ReferenceNumber || !Location) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addPurchasing({ ReferenceNumber, Location, InvoiceDate, SupplierName, InvoiceNumber, Description, TypeFish, Freezing, Weight, UnitPrice, InvoiceAmount,
                                          FirstPayment, SecondPayment, ThirdPayment, FinalPayment, Discount, Commission, CableFee, DateApproval, Status, Remarks, Action
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
