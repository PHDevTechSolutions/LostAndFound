import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, Boxes } = req.body;

        if (!id || Boxes === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        try {
            const db = await connectToDatabase();
            const collection = db.collection('container'); // Make sure your collection name is correct

            const result = await collection.updateOne(
                { _id: id },
                { $set: { Boxes } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Container not found or no changes made' });
            }

            res.status(200).json({ message: 'Boxes updated successfully' });
        } catch (error) {
            console.error('Error updating boxes:', error);
            res.status(500).json({ error: 'Failed to update boxes' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
