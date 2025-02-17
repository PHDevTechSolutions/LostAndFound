import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function fetchAccounts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container");
    const containerOrderCollection = db.collection("container_order");

    // Fetch data from both collections
    const containerData = await containerCollection.find({}).toArray();
    const containerOrderData = await containerOrderCollection.find({}).toArray();

    // Convert GrossSales to a number for each containerOrderData entry
    const updatedContainerOrderData = containerOrderData.map(order => {
      const grossSalesValue = order.GrossSales;
      const convertedGrossSales = Number(grossSalesValue);
      
      console.log('GrossSales before conversion:', grossSalesValue);
      console.log('GrossSales after conversion:', convertedGrossSales);

      return {
        ...order,
        GrossSales: isNaN(convertedGrossSales) ? 0 : convertedGrossSales, // Ensure GrossSales is a valid number
      };
    });

    // Combine the data as needed
    res.status(200).json({ containerData, containerOrderData: updatedContainerOrderData });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
