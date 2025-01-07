import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Please add your MongoDB URI to your environment variables");
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClient) {
    client = new MongoClient(uri);
    global._mongoClient = client;
  } else {
    client = global._mongoClient;
  }
  clientPromise = client.connect();
} else {
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("ecoshift");
}

// Validate user credentials
export async function validateUser({ email, password }: { email: string, password: string }) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Find the user by email
  const user = await usersCollection.findOne({ email });
  if (!user) {
    return { success: false, message: "Invalid email or password" };
  }

  // Compare the provided password with the stored hashed password
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return { success: false, message: "Invalid email or password" };
  }

  return { success: true };
}
