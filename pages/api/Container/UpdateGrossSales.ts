import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';

export default async function updateGrossSales(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  const { referenceNumber, grossSales } = req.body;

  if (!referenceNumber || grossSales === undefined) {
    res.status(400).json({ success: false, message: 'Reference number and gross sales are required' });
    return;
  }

  try {
    const db = await connectToDatabase();
    const containerCollection = db.collection('container');
    const activityLogsCollection = db.collection('ActivityLogs');

    // Find the container by ReferenceNumber and update its GrossSales field
    const updatedContainer = await containerCollection.updateOne(
      { ReferenceNumber: referenceNumber },  // Match by ReferenceNumber
      { $set: { GrossSales: grossSales, updatedAt: new Date() } }  // Update the GrossSales
    );

    if (updatedContainer.modifiedCount === 0) {
      res.status(404).json({ success: false, message: 'Container not found' });
      return;
    }

    // Create an activity log for this update
    const activityLog = {
      message: `Updated Gross Sales for ReferenceNumber: ${referenceNumber}`,
      referenceNumber,
      createdAt: new Date(),
    };

    await activityLogsCollection.insertOne(activityLog);

    res.status(200).json({ success: true, message: 'Gross Sales updated successfully' });
  } catch (error) {
    console.error('Error updating Gross Sales:', error);
    res.status(500).json({ success: false, message: 'Error updating Gross Sales' });
  }
}
