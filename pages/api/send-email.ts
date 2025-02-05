import type { NextApiRequest, NextApiResponse } from "next";
import mailjet from "node-mailjet";

const mailjetClient = mailjet.apiConnect(
    process.env.MAILJET_API_KEY!,
    process.env.MAILJET_SECRET_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const { addReceivable, lessCollection, totalBalance, dateToday } = req.body;

        const emailData = {
            Messages: [
                {
                    From: {
                        Email: "phdevtechsolutions@gmail.com",
                        Name: "Your Business",
                    },
                    To: [
                        {
                            Email: "nebrilbabyrosec@gmail.com",
                            Name: "Recipient Name",
                        },
                    ],
                    Subject: "JJV Venture Sources Inc, Storage Pendiente",
                    TextPart: `Form Data:
                    - Add Receivable: ${addReceivable}
                    - Less Collection: ${lessCollection}
                    - Total Balance: ${totalBalance}
                    - Date Today: ${dateToday}
                    `,
                },
            ],
        };

        const request = await mailjetClient.post("send", { version: "v3.1" }).request(emailData);

        res.status(200).json({ message: "Email sent successfully!" });
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).json({ message: "Failed to send email." });
    }
}
