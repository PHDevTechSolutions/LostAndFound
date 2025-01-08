import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function editPost(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
        return;
    }

    const { id, title, description, status, link, author, categories, tags, featureImage } = req.body;

    try {
        const db = await connectToDatabase();
        const postsCollection = db.collection('posts');

        const updatedPost = {
            title,
            description,
            status,
            link,
            author,
            categories,
            tags,
            featureImage,
            updatedAt: new Date(),
        };

        await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPost });
        res.status(200).json({ success: true, message: 'Post updated successfully' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
}
