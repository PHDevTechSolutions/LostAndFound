import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcrypt";
import { Server } from "socket.io";

// Ensure the MONGODB_URI environment variable is defined
if (!process.env.MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

const uri = process.env.MONGODB_URI;
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient>;

// MongoDB connection handling
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

// Export the promise to be used for database connections
export default clientPromise;

// Connect to the database
export async function connectToDatabase() {
  const client = await clientPromise;
  return client.db("ecoshift"); // Return the 'ecoshift' database
}

// Function to broadcast new posts
let io: Server | null = null;
export function setSocketServer(server: Server) {
  io = server;
}

// Register a new user
export async function registerUser({ name, email, password, }: { name: string; email: string; password: string; }) {
  const db = await connectToDatabase();
  const usersCollection = db.collection("users");

  // Check if the email already exists in the database
  const existingUser = await usersCollection.findOne({ email });
  if (existingUser) {
    return { success: false, message: "Email already in use" };
  }

  // Hash the password before saving it to the database
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the collection
  await usersCollection.insertOne({
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  return { success: true };
}

// Validate user credentials
export async function validateUser({ email, password, }: { email: string; password: string; }) {
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

  return { success: true, user }; // Return the user object along with success status
}

// Insert Post Data to MongoDB
export async function addPost({ title, description, status, link, author, categories, tags, featureImage, }: { 
  title: string; 
  description: string; 
  status: string; 
  link: string; 
  author: string; 
  categories: string; 
  tags: string; 
  featureImage: File | null; 
}) { 
  const db = await connectToDatabase(); 
  const postsCollection = db.collection("posts"); 
  const newPost = { title, description, status, link, author, categories, tags, featureImage, createdAt: new Date(), }; 
  await postsCollection.insertOne(newPost);

  // Broadcast the new post to all clients
  if (io) {
    io.emit("newPost", newPost);
  }

  return { success: true }; 
}

// Update Post Data in MongoDB
export async function updatePost({ id, title, description, status, link, author, categories, tags, featureImage, }: { 
  id: string; 
  title: string; 
  description: string; 
  status: string; 
  link: string; 
  author: string; 
  categories: string; 
  tags: string; 
  featureImage: File | null; 
}) { 
  const db = await connectToDatabase(); 
  const postsCollection = db.collection("posts"); 
  const updatedPost = { title, description, status, link, author, categories, tags, featureImage, updatedAt: new Date(), }; 
  await postsCollection.updateOne({ _id: new ObjectId(id) }, { $set: updatedPost }); 
  return { success: true }; 
}

// Delete Post Data from MongoDB
export async function deletePost(id: string) { 
  const db = await connectToDatabase(); 
  const postsCollection = db.collection("posts"); 
  await postsCollection.deleteOne({ _id: new ObjectId(id) }); 
  return { success: true }; 
}
