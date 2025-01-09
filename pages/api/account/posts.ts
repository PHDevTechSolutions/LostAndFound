import { NextApiRequest, NextApiResponse } from "next";
import { addAccount } from "../../../lib/mongodb"; // Assuming you have a corresponding function for adding accounts

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { companyName, customerName, gender, contactNumber, cityAddress } = req.body;

    try {
      const result = await addAccount({
        companyName,
        customerName,
        gender,
        contactNumber,
        cityAddress,
      });

      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ success: false, message: "Error adding account", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
