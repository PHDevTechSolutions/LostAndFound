import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to add an account directly in this file
async function addUser({ name, email, password }: {
  name: string;
  email: string;
  password: string;
}) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");
  const newUser = { name, email, password, createdAt: new Date(), };
  await usersCollection.insertOne(newUser);

  // Broadcast logic if needed
  if (typeof io !== "undefined" && io) {
    io.emit("newUser", newUser);
  }

  return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    try {
      const result = await addUser({ name, email, password });
      res.status(200).json(result);
    } catch (error) {
      console.error("Error adding account:", error);
      res
        .status(500)
        .json({ success: false, message: "Error adding account", error });
    }
  } else {
    res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }
}
