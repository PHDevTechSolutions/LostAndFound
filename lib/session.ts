import { NextApiRequest, NextApiResponse } from "next";
import { serialize, parse } from "cookie";

// Function to destroy session
export async function destroySession(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Set-Cookie", serialize("session", "", { maxAge: -1, path: "/" }));
}

// Function to get session
export async function getSession(req: NextApiRequest) {
  const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
  const session = cookies.session;

  if (!session) {
    return null; // No session found
  }

  // Add more logic here to verify the session if needed

  return session; // Return the session data
}
