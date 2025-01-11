import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent, tsmAcknowledgeDate, tsaAcknowledgeDate } = req.body;

    try {
        const db = await connectToDatabase();
        const accountCollection = db.collection('monitoring');

        const updatedAccount = { companyName, customerName, gender, contactNumber, cityAddress, channel, wrapUp, source, customerType, customerStatus, cStatus, orderNumber, amount, qtySold, salesManager, salesAgent, tsmAcknowledgeDate, tsaAcknowledgeDate,
            updatedAt: new Date(),
        };

        await accountCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });
        res.status(200).json({ success: true, message: 'Account updated successfully' });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Failed to update account' });
    }
}
