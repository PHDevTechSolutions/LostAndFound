import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/mongodb";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    // Validate user credentials
    const result = await validateUser({ email, password });

    if (result.success) {
      // Set a session cookie
      res.setHeader("Set-Cookie", serialize("session", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      }));
      
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: result.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
