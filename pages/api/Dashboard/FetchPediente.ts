import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const db = await connectToDatabase();
    const pedienteCollection = db.collection("pediente");

    const { location, role, month, year } = req.query;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1); // Get yesterday's date

    let dateFilter: any = {};

    if (month !== "All" && year !== "All") {
      const startDate = new Date(`${year}-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      dateFilter.DatePediente = { $gte: startDate, $lt: endDate };
    } else if (year !== "All") {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${parseInt(year as string) + 1}-01-01`);

      dateFilter.DatePediente = { $gte: startDate, $lt: endDate };
    } else if (month !== "All") {
      const startDate = new Date(`2000-${month}-01`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      dateFilter.DatePediente = { $gte: startDate, $lt: endDate };
    } else {
      dateFilter.DatePediente = { $gte: yesterday, $lt: today }; // Default filter (kahapon)
    }

    const matchCondition: any = { ...dateFilter };

    if (location === "Philippines") {
      // No location filter applied, showing data from all locations
      // Do nothing in terms of filtering Location here
    } else if (location && location !== "All") {
      // Apply location filter if specified and not "All"
      matchCondition.Location = location;
    }

    // Check if user is Super Admin or Director
    if (role === "Super Admin" || role === "Directors") {
      // Super Admin and Directors can see all locations if "All" is selected
      if (location && location !== "All" && location !== "Philippines") {
        // Apply location filter if a location other than 'Philippines' is specified
        matchCondition.Location = location;
      }
    } else {
      // For other roles (Admin, Staff, etc.), restrict by location if not "All"
      if (location && location === "All") {
        // Show all locations if "All" is selected for other roles
        // No additional filter is added, so all locations will be included
      } else if (location && location !== "Philippines") {
        // Apply location filter for other roles if a specific location is selected
        matchCondition.Location = location;
      }
    }

    let result = await pedienteCollection
      .aggregate([
        {
          $addFields: {
            DatePediente: { $toDate: "$DatePediente" },
            BalanceAmount: { $toDouble: "$BalanceAmount" },
          },
        },
        { $match: matchCondition },
        {
          $group: {
            _id: null,
            totalBalance: { $sum: "$BalanceAmount" },
          },
        },
      ])
      .toArray();

    if (result.length === 0) {
      const lastAvailableData = await pedienteCollection
        .find({ DatePediente: { $lt: today } })
        .sort({ DatePediente: -1 })
        .limit(1)
        .toArray();

      if (lastAvailableData.length > 0) {
        return res.status(200).json({
          previousBalance: parseFloat(lastAvailableData[0].BalanceAmount) || 0,
          message: `No data for yesterday. Using last available data from ${lastAvailableData[0].DatePediente}.`,
        });
      }

      return res.status(200).json({ previousBalance: 0, message: "No historical data available." });
    }

    res.status(200).json({ previousBalance: result[0].totalBalance });

  } catch (error) {
    console.error("Error fetching pediente data:", error);
    res.status(500).json({ success: false, message: "Error fetching pediente data", error });
  }
}
