import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function getContainer(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'Container ID is required' });
    return;
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection('container');
    const container = await containerCollection.findOne({ _id: new ObjectId(id as string) });

    if (!container) {
      res.status(404).json({ error: 'Container not found' });
      return;
    }

    res.status(200).json(container);
  } catch (error) {
    console.error('Error fetching container:', error);
    res.status(500).json({ error: 'Failed to fetch container data' });
  }
}
