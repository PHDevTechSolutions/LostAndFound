import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../lib/mongodb';

export default async function fetchCompanies(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const db = await connectToDatabase();
            const accountsCollection = db.collection('container_order');

            if (req.query.BuyersName) {
                const BuyersName = decodeURIComponent(req.query.BuyersName as string);
                const companyDetails = await accountsCollection.findOne({ 
                    BuyersName,
                    PaymentMode: 'PDC'  // Only fetch data where paymentMode is 'PDC'
                });
                if (companyDetails) {
                    res.status(200).json(companyDetails);
                } else {
                    res.status(404).json({ error: 'Company not found or no PDC payment mode found' });
                }
            } else {
                // Fetch all records where paymentMode is 'PDC'
                const companies = await accountsCollection.find({ 
                    PaymentMode: 'PDC'  // Only fetch records with paymentMode 'PDC'
                }, { 
                    projection: { 
                        BuyersName: 1, 
                        ContainerNo: 1, 
                        DateOrder: 1, 
                        Size: 1, 
                        GrossSales: 1 
                    }
                }).toArray();
                res.status(200).json(companies);
            }
        } catch (error) {
            console.error('Error fetching companies:', error);
            res.status(500).json({ error: 'Failed to fetch companies' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
