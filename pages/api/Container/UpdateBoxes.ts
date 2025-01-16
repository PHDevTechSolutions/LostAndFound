import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function updateBoxes(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, BoxesSold } = req.body;

    if (!id || typeof BoxesSold !== 'number') {
        res.status(400).json({ error: 'Invalid request data' });
        return;
    }

    try {
        const db = await connectToDatabase();
        const containerCollection = db.collection('container');

        // Fetch the existing container data
        const container = await containerCollection.findOne({ _id: new ObjectId(id) });

        if (!container) {
            res.status(404).json({ error: 'Container not found' });
            return;
        }

        const currentBoxes = container.Boxes || 0;

        if (BoxesSold > currentBoxes) {
            res.status(400).json({ error: 'Boxes sold exceeds available boxes' });
            return;
        }

        // Update the Boxes count
        const updatedBoxes = currentBoxes - BoxesSold;
        await containerCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: { Boxes: updatedBoxes, updatedAt: new Date() } }
        );

        res.status(200).json({
            success: true,
            message: 'Boxes updated successfully',
            updatedBoxes,
        });
    } catch (error) {
        console.error('Error updating Boxes:', error);
        res.status(500).json({ error: 'Failed to update Boxes' });
    }
}
