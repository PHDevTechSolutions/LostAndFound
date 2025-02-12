import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

// Function to add an account directly in this file
async function CreatePediente({ DatePediente, BuyersName, DateOrder, PlaceSales, ContainerNo, Commodity, Size, BoxSales, Price, GrossSales, PaymentMode, PayAmount, BalanceAmount, Status, Location }: {
    DatePediente: string;
    BuyersName: string;
    DateOrder: string;
    PlaceSales: string;
    ContainerNo: string;
    Commodity: string;
    Size: string;
    BoxSales: string;
    Price: string;
    GrossSales: string;
    PaymentMode: string;
    PayAmount: string;
    BalanceAmount: string;
    Status: string;

    Location: string;
}) {
    const db = await connectToDatabase();
    const containerCollection = db.collection("pediente");

    // Create container data
    const newData = { DatePediente, BuyersName, DateOrder, PlaceSales, ContainerNo, Commodity, Size, BoxSales, Price, GrossSales, PaymentMode, PayAmount, BalanceAmount, Status, Location, createdAt: new Date() };

    // Insert new container data into the container collection
    await containerCollection.insertOne(newData);

    // Broadcast logic if needed
    if (typeof io !== "undefined" && io) {
        io.emit("newData", newData);
    }

    return { success: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { DatePediente, BuyersName, DateOrder, PlaceSales, ContainerNo, Commodity, Size, BoxSales, Price, GrossSales, PaymentMode, PayAmount, BalanceAmount, Status, Location } = req.body;

        // Validate required fields
        if (!BuyersName || !DatePediente) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        try {
            const result = await CreatePediente({ DatePediente, BuyersName, DateOrder, PlaceSales, ContainerNo, Commodity, Size, BoxSales, Price, GrossSales, PaymentMode, PayAmount, BalanceAmount, Status, Location });
            res.status(200).json(result);
        } catch (error) {
            console.error("Error adding container:", error);
            res.status(500).json({ success: false, message: "Error adding container", error });
        }
    } else {
        res.status(405).json({ success: false, message: "Method not allowed" });
    }
}
