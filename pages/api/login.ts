//pages/api/login.ts

import { NextApiRequest, NextApiResponse } from "next";
import { validateUser } from "@/lib/mongodb";
import { serialize } from "cookie";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { Email, Password } = req.body;

    // Validate user credentials
    const result = await validateUser({ Email, Password });

    if (result.success && result.user) {
      const userId = result.user._id.toString();

      // Set a session cookie
      res.setHeader("Set-Cookie", serialize("session", userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24, // 1 day
        path: "/",
      }));

      res.status(200).json({ message: "Login successful", userId });
    } else {
      res.status(401).json({ message: result.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
