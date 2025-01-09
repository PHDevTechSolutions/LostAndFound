import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from '../../../lib/mongodb';

export default async function fetchPosts(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
    return;
  }

  try {
    const db = await connectToDatabase();
    const postsCollection = db.collection('posts');
    const posts = await postsCollection.find({}).toArray();
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}
