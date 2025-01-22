import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function editAccount(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, Vendor, SpsicNo, DateArrived, DateSoldout, SupplierName, ContainerNo, Country, Boxes, TotalQuantity, TotalGrossSales, Commodity, Size, Freezing, Status, BoxType, Remarks, username, location } = req.body;

    try {
        const db = await connectToDatabase();
        const containerCollection = db.collection('container');
        const activityLogsCollection = db.collection('ActivityLogs');

        const updatedAccount = {
            Vendor, SpsicNo, DateArrived, DateSoldout, SupplierName, ContainerNo, Country, Boxes, TotalQuantity, TotalGrossSales, Commodity, Size, Freezing, Status, BoxType, Remarks, updatedAt: new Date(),
        };

        // Update container data
        await containerCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedAccount });

        // Activity log format
        const activityLog = {
            username: username, 
            location: location, 
            SpsicNo: SpsicNo,
            message: `${username} Has Updated Container Number: ${ContainerNo}`,
            ContainerNo: ContainerNo,
            Boxes: Boxes,
            createdAt: new Date(),
        };

        // Insert activity log into ActivityLogs collection
        await activityLogsCollection.insertOne(activityLog);

        res.status(200).json({ success: true, message: 'Data updated successfully' });
    } catch (error) {
        console.error('Error updating Data:', error);
        res.status(500).json({ error: 'Failed to update Data' });
    }
}
