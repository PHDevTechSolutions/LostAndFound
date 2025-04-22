import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import cloudinary from 'cloudinary';

// Set up Cloudinary configuration
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function Edit(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, ReferenceNumber, Email, DateLost, ItemName, ItemQuantity, ItemCategories, ItemDescription, ItemOwner, ContactNumber, RoomSection, Department, ItemStatus, ItemProgress, ItemImage } = req.body;

    try {
        const db = await connectToDatabase();
        const DataCollection = db.collection('ReportItem');

        // Create the update data object
        const UpdateData: any = {
            ReferenceNumber,
            Email,
            DateLost,
            ItemName,
            ItemQuantity,
            ItemCategories,
            ItemDescription,
            ItemOwner,
            ContactNumber,
            RoomSection,
            Department,
            ItemStatus,
            ItemProgress,
            updatedAt: new Date(),
        };

        // If a new image is provided, upload it to Cloudinary and update the ItemImage field
        if (ItemImage && ItemImage !== '') {
            // Upload the new image to Cloudinary
            const result = await cloudinary.v2.uploader.upload(ItemImage, {
                folder: 'lost-items',
            });

            // Update the ItemImage field with the new image URL
            UpdateData.ItemImage = result.secure_url;
        }

        // Update the document in MongoDB
        await DataCollection.updateOne({ _id: new ObjectId(id) }, { $set: UpdateData });

        res.status(200).json({ success: true, message: 'Report Item Updated Successfully' });
    } catch (error) {
        console.error('Error updating Data:', error);
        res.status(500).json({ error: 'Failed to update Data' });
    }
}
