import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../../lib/mongodb";

export default async function fetchAccounts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection("container_order");

    // Aggregation query to join container_order with container by ReferenceNumber
    const data = await containerCollection.aggregate([
      {
        $lookup: {
          from: "container", // The name of the collection to join with
          localField: "ReferenceNumber", // Field from container_order
          foreignField: "ReferenceNumber", // Field from container
          as: "containerDetails", // Alias for the resulting array of matched documents
        },
      },
      {
        $unwind: { path: "$containerDetails", preserveNullAndEmptyArrays: true }, // Flatten the array if a match exists
      },
      {
        $project: {
          ReferenceNumber: 1,
          ContainerNo: 1,
          Commodity: 1,
          Size: 1,
          Freezing: 1,
          GrossSales: 1,
          DateOrder: 1,
          Location: 1,
          createdAt: 1,
          PaymentMode: 1,
          Price: 1,
          Country: "$containerDetails.Country", // Extract the 'Country' field from the containerDetails
          BoxType: "$containerDetails.BoxType", // Extract the 'Boxes' field from the containerDetails
          Boxes: "$containerDetails.Boxes",
        },
      },
    ]).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
}
