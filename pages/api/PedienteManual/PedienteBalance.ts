import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente_balance");

    if (req.method === "GET") {
        try {
            const data = await pedienteCollection.find({}).toArray();
            return res.status(200).json(data);
        } catch (error) {
            console.error("Error fetching pediente balance:", error);
            return res.status(500).json({ message: "Failed to fetch data" });
        }
    } 
    
    if (req.method === "POST") {
        try {
            const { DatePediente, addReceivable, lessCollection, totalBalance } = req.body;

            if (!DatePediente || addReceivable == null || lessCollection == null || totalBalance == null) {
                return res.status(400).json({ message: "Missing required fields" });
            }

            const newEntry = { DatePediente, addReceivable, lessCollection, totalBalance };
            await pedienteCollection.insertOne(newEntry);

            return res.status(201).json({ message: "Data saved successfully" });
        } catch (error) {
            console.error("Error saving pediente balance:", error);
            return res.status(500).json({ message: "Failed to save data" });
        }
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
