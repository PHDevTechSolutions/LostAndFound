import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../../lib/mongodb';

export default async function Fetch(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const DataCollection = db.collection('ReportItem');

            if (req.query.ReferenceNumber) {
                const ReferenceNumber = decodeURIComponent(req.query.ReferenceNumber as string);
                const dataDetails = await DataCollection.findOne({ ReferenceNumber, ItemStatus: "Lost" });
                if (dataDetails) {
                    res.status(200).json(dataDetails);
                } else {
                    res.status(404).json({ error: 'Reference Number not Lost or not marked as Lost' });
                }
            } else {
                const ReferenceNumbers = await DataCollection
                    .find({ ItemStatus: "Lost" }, { projection: { ReferenceNumber: 1 } })
                    .toArray();
                res.status(200).json(ReferenceNumbers);
            }
        } catch (error) {
            console.error('Error fetching Reference Number:', error);
            res.status(500).json({ error: 'Failed to fetch Reference Number' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
