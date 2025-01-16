// pages/api/Container/UpdateBoxes.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, Boxes } = req.body;

        try {
            const db = await connectToDatabase();
            const collection = db.collection('container'); // Replace with your collection name
            await collection.updateOne({ _id: id }, { $set: { Boxes } });

            res.status(200).json({ message: 'Boxes updated successfully' });
        } catch (error) {
            console.error('Error updating boxes:', error);
            res.status(500).json({ error: 'Failed to update boxes' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
