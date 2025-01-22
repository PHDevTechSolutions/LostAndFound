import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

async function AddUser({ Firstname, Lastname, Email, Location, UserName, Password, Role }: {
    Firstname: string;
    Lastname: string;
    Email: string;
    Location: string;
    UserName: string;
    Password: string;
    Role: string;

}) {
    const db = await connectToDatabase();
    const userCollection = db.collection("users");
    const newUser = { Firstname, Lastname, Email, Location, UserName, Password, Role, createdAt: new Date (), };
    await userCollection.insertOne(newUser);

    if (typeof io !== "undefined" && io) {
        io.emit("newUser", newUser);
    } 

    return { success: true};

}

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    if (req.method === "POST") {
        const {Firstname, Lastname, Email, Location, UserName, Password, Role} = req.body;

        if (!UserName || !Password){
            return res 
            .status(400)
            .json({ success: false, message: "Missing Fields"});
        }

        try {
            const result = await AddUser({Firstname, Lastname, Email, Location, UserName, Password, Role});
            res.status(200).json(result);
        } catch (error) {
            console.error("Error", error);
            res.status(500).json({ success: false, message: "Error", error});
            
        } 
    } else {
        res.status(405).json({ success: false, message: "Not Allowed!"});
    }
}