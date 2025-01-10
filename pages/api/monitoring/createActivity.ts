import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to add an account directly in this file
async function addMonitoring({ companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent }: {
  companyName: string;
  customerName: string;
  gender: string;
  contactNumber: string;
  cityAddress: string;
  channel: string;
  wrapUp: string;
  source: string;
  customerType: string;
  customerStatus: string;
  cStatus: string;
  orderNumber: string;
  amount: string;
  qtySold: string;
  salesManager: string;
  salesAgent: string;
}) {
  const db = await connectToDatabase();
  const accountsCollection = db.collection("monitoring");
  const newMonitoring = { companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent, createdAt: new Date(), };
  await accountsCollection.insertOne(newMonitoring);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newMonitoring", newMonitoring);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent } = req.body;

    // Validate required fields
    if (!companyName || !customerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addMonitoring({ companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding account:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding account", error });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
