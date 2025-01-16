import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb'; // Import ObjectId to handle the ID correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, Boxes } = req.body;

        // Ensure the ID is a valid ObjectId and Boxes is a valid number
        if (!id || typeof Boxes !== 'number') {
            return res.status(400).json({ error: 'Invalid data' });
        }

        try {
            const db = await connectToDatabase();
            const collection = db.collection('container'); // Ensure the collection name is correct

            // Convert string ID to ObjectId (since MongoDB uses ObjectId for its primary keys)
            const objectId = new ObjectId(id);

            // Update the Boxes value for the specific container in the database
            const result = await collection.updateOne(
                { _id: objectId }, // Find by ObjectId
                { $set: { Boxes } } // Set the new value of Boxes
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
