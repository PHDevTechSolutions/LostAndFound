import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function fetchAccounts(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    try {
        const db = await connectToDatabase();
        const containerCollection = db.collection("container_order");

        // You can add optional query parameters here (e.g., for filtering by date or location)
        const data = await containerCollection.find({}).toArray();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error fetching container data:', error);
        return res.status(500).json({ error: 'Failed to fetch data' });
    }
}
