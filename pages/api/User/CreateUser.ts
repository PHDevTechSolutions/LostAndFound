import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

async function AddUser({ UserName, }: {
    UserName: string;

}) {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");
    const newUser = {UserName, createdAt: new Date (), };
    await userCollection.insertOne(newUser);

    if (typeof io !== "undefined" && io) {
        io.emit("newUser", newUser);
    } 

    return { success: true};

}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === "POST") {
        const {UserName} = req.body;

        if (!UserName){
            return res 
            .status(400)
            .json({ success: false, message: "Missing Fields"});
        }

        try {
            const result = await AddUser({ UserName});
            res.status(200).json(result);
        } catch (error) {
            console.error("Error", error);
            res.status(500).json({ success: false, message: "Error", error});
            
        } 
    } else {
        res.status(405).json({ success: false, message: "Not Allowed!"});
    }
}