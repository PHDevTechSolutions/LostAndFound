import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to add an account directly in this file
async function addAccount({ companyName, customerName, gender, contactNumber, cityAddress, }: {
  companyName: string;
  customerName: string;
  gender: string;
  contactNumber: string;
  cityAddress: string;
}) {
  const db = await connectToDatabase();
  const accountsCollection = db.collection("accounts");
  const newAccount = { companyName, customerName, gender, contactNumber, cityAddress, createdAt: new Date(), };
  await accountsCollection.insertOne(newAccount);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newAccount", newAccount);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { companyName, customerName, gender, contactNumber, cityAddress } = req.body;

    // Validate required fields
    if (!companyName || !customerName) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addAccount({ companyName, customerName, gender, contactNumber, cityAddress, });
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
