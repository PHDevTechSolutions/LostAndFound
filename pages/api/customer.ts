import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function fetchCompanies(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const customerCollection = db.collection('container_order');

            if (req.query.BuyersName) {
                const BuyersName = decodeURIComponent(req.query.BuyersName as string);
                const customerDetails = await customerCollection.findOne({ 
                    BuyersName,         // Existing BuyersName filter
                    PaymentMode: 'PDC'  // Only fetch data where paymentMode is 'PDC'
                });
                if (customerDetails) {
                    res.status(200).json(customerDetails);
                } else {
                    res.status(404).json({ error: 'Customer not found or no PDC payment mode found' });
                }
            } else {
                // Fetch all records where paymentMode is 'PDC' and filter by Location if provided
                const query: any = { PaymentMode: 'PDC' };
                if (Location) {
                    query.Location = Location;  // Add location filter to query if provided
                }

                const customers = await customerCollection.find(query, { 
                    projection: { 
                        BuyersName: 1, 
                        ContainerNo: 1, 
                        DateOrder: 1, 
                        Size: 1, 
                        GrossSales: 1 
                    }
                }).toArray();

                res.status(200).json(customers);
            }
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).json({ error: 'Failed to fetch customers' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
