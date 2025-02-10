import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente_balance");

    if (req.method === "GET") {
        try {
            // Fetch the latest balance (sorted by DatePediente in descending order)
            const latestBalance = await pedienteCollection.findOne({}, { sort: { DatePediente: -1 } });

            if (latestBalance) {
                return res.status(200).json({ totalBalance: latestBalance.totalBalance });
            } else {
                return res.status(404).json({ message: "No balance data available." });
            }
        } catch (error) {
            console.error("Error fetching latest balance:", error);
            return res.status(500).json({ message: "Failed to fetch latest balance" });
        }
    }

    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
