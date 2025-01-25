import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function removeContainer(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'DELETE') {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    try {
        const { id } = req.query; // Use `req.query` to fetch the ID from the URL

        if (!id) {
            res.status(400).json({ error: 'ID is required' });
            return;
        }

        const db = await connectToDatabase();
        const containerCollection = db.collection('container_order');

        const deleteResult = await containerCollection.deleteOne({ _id: new ObjectId(id as string) });

        if (deleteResult.deletedCount === 1) {
            res.status(200).json({ success: true, message: 'Data deleted successfully' });
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).json({ error: 'Failed to delete data' });
    }
}
