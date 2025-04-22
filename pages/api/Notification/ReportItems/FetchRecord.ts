import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../lib/mongodb';

export default async function Fetch(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { email } = req.query;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ error: "Email is required as a query parameter." });
  }

  try {
    const db = await connectToDatabase();
    const DataCollection = db.collection('ReportItem');

    const data = await DataCollection.find({ Email: email }).toArray();

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
