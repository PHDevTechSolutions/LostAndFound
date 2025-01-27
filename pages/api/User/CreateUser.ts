import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";
import bcrypt from "bcrypt";

async function AddUser({ Firstname, Lastname, Email, Location, userName, Password, Role,
}: {
  Firstname: string;
  Lastname: string;
  Email: string;
  Location: string;
  userName: string;
  Password: string;
  Role: string;
}) {
  const db = await connectToDatabase();
  const userCollection = db.collection("users");

  // Check if email or username already exists
  const existingUser = await userCollection.findOne({
    $or: [{ Email }, { userName }],
  });
  if (existingUser) {
    throw new Error("Email or username already in use");
  }

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(Password, 10);

  const newUser = {
    Firstname,
    Lastname,
    Email,
    Location,
    userName,
    Password: hashedPassword,
    Role,
    createdAt: new Date(),
  };

  // Insert new user into the database
  await userCollection.insertOne(newUser);

  // Emit event if WebSocket is active
  if (typeof io !== "undefined" && io) {
    io.emit("newUser", newUser);
  }

  return { success: true, message: "User created successfully" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { Firstname, Lastname, Email, Location, userName, Password, Role } =
      req.body;

    // Validate required fields
    if (!Firstname || !Lastname || !Email || !userName || !Password || !Role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    try {
      const result = await AddUser({
        Firstname,
        Lastname,
        Email,
        Location,
        userName,
        Password,
        Role,
      });
      res.status(201).json(result);
    } catch (error: any) {
      console.error("Error:", error.message);
      res.status(400).json({
        success: false,
        message: error.message || "An error occurred while creating the user",
      });
    }
  } else {
    res.status(405).json({
      success: false,
      message: "Method Not Allowed",
    });
  }
}
