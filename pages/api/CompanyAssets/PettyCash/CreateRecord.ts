import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";

// Function to add an account directly in this file
async function addPurchasing({ 
    ReferenceNumber, Location, PettyCashDate, Payee, Particular, Amount, Transpo, MealsTranspo, NotarialFee, Misc, ProdSupplies, Advances, TollFee, Parking, Gasoline, Tax, Supplies, Communication, Utilities,
    Repairs, ServiceCharges, Remarks }: {

  ReferenceNumber: string;
  Location: string;

  PettyCashDate: string;
  Payee: string;
  Particular: string;
  Amount: string;
  Transpo: string;
  MealsTranspo: string;
  NotarialFee: string;
  Misc: string;
  ProdSupplies: string;
  Advances: string;
  TollFee: string;
  Parking: string;
  Gasoline: string;
  Tax: string;
  Supplies: string;
  Communication: string;
  Utilities: string;
  Repairs: string;
  ServiceCharges: string;
  Remarks: string;

}) {
  const db = await connectToDatabase();
  const containerCollection = db.collection("replenishment");

  // Create container data
  const newData = { ReferenceNumber, Location, PettyCashDate, Payee, Particular, Amount, Transpo, MealsTranspo, NotarialFee, Misc, ProdSupplies, Advances, TollFee, Parking, Gasoline, Tax, 
    Supplies, Communication, Utilities, Repairs, ServiceCharges, Remarks,
     createdAt: new Date() };

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
    const { ReferenceNumber, Location, PettyCashDate, Payee, Particular, Amount, Transpo, MealsTranspo, NotarialFee, Misc, ProdSupplies, Advances, TollFee, Parking, Gasoline, Tax, 
        Supplies, Communication, Utilities, Repairs, ServiceCharges, Remarks,
     } = req.body;

    // Validate required fields
    if (!ReferenceNumber || !Location) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addPurchasing({ ReferenceNumber, Location, PettyCashDate, Payee, Particular, Amount, Transpo, MealsTranspo, NotarialFee, Misc, ProdSupplies, Advances, TollFee, Parking, Gasoline, Tax, 
        Supplies, Communication, Utilities, Repairs, ServiceCharges, Remarks,
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
