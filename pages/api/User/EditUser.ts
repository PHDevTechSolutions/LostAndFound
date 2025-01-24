import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, Firstname, Lastname, Email, Location, UserName, Password, Role  } = req.body;

    try {
        const db = await connectToDatabase();
        const accountCollection = db.collection('users');

        const updatedUser = {
            Firstname, Lastname, Email, Location, UserName, Password, Role, updatedAt: new Date(),
        };

        // Update container data
        await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });

        await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });

        res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
}
