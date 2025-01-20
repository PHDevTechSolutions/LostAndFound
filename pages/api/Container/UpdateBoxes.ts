import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, Beginning } = req.body;

        if (!id || typeof Beginning !== 'number') {
            return res.status(400).json({ error: 'Invalid data' });
        }

        try {
            const db = await connectToDatabase();
            const collection = db.collection('container');
            const objectId = new ObjectId(id);

            const result = await collection.updateOne(
                { _id: objectId },
                { $set: { Beginning } }
            );

            if (result.modifiedCount === 0) {
                return res.status(404).json({ error: 'Container not found' });
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
