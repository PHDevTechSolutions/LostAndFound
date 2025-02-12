import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const { location, role } = req.query; // Extract role and location from the query

  if (req.method === "GET") {
    try {
      const db = await connectToDatabase();
      const containerCollection = db.collection("container_order");

      const { month, year } = req.query;

      const today = new Date().toISOString().split('T')[0];

      let dateFilter = {};

      if (month !== "All" && year !== "All") {
        // Construct a date range for the selected month and year
        const startDate = new Date(`${year}-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Set the end date to the next month

        dateFilter = {
          DateOrder: {
            $gte: startDate.toISOString(),
            $lt: endDate.toISOString(),
          },
        };
      } else if (year !== "All") {
        // If only year is selected, filter by year
        const yearInt = parseInt(year as string); // Ensure year is a number
        const startDate = new Date(`${yearInt}-01-01`);
        const endDate = new Date(`${yearInt + 1}-01-01`);

        dateFilter = {
          DateOrder: {
            $gte: startDate.toISOString(),
            $lt: endDate.toISOString(),
          },
        };
      } else if (month !== "All") {
        // If only month is selected, filter by month across all years
        const startDate = new Date(`2000-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1); // Set the end date to the next month

        dateFilter = {
          DateOrder: {
            $gte: startDate.toISOString(),
            $lt: endDate.toISOString(),
          },
        };
      } else {
        // Default to today if no filters are applied
        dateFilter = {
          DateOrder: today, // Filter by today's date
        };
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

      // Aggregate total number of BoxSales and total price per Commodity
      const result = await containerCollection.aggregate([
        {
          $addFields: {
            Commodity: { $ifNull: ["$Commodity", ""] }, // Handle empty or null Commodity values
            BoxSales: { $toDouble: "$BoxSales" }, // Convert BoxSales to number (even if it is a string)
            Price: { $toDouble: "$Price" }, // Convert Price to number (even if it is a string)
          },
        },
        { $match: matchCondition },
        {
          $group: {
            _id: "$Commodity", // Group by Commodity
            totalBoxSales: { $sum: "$BoxSales" }, // Sum BoxSales for each Commodity
            totalPrice: { $sum: { $multiply: ["$BoxSales", "$Price"] } }, // Sum total price for each Commodity
          },
        },
        {
          $sort: { totalBoxSales: -1 }, // Sort by totalBoxSales in descending order
        },
        {
          $project: {
            commodityName: "$_id", // Rename _id to commodityName
            totalBoxSales: 1,
            totalPrice: 1,
            _id: 0, // Remove _id from the output
          },
        },
      ]).toArray();

      // Map the results to match the output format you want (Commodity - BoxSales - Price)
      const formattedResult = result.map(item => ({
        commodityName: item.commodityName,
        totalBoxSales: item.totalBoxSales,
        totalPrice: item.totalPrice,
      }));

      console.log("Formatted Box Sales Data by Commodity:", formattedResult); // Debug log for sales data

      // Send the formatted data to the frontend
      res.status(200).json(formattedResult);
    } catch (error) {
      console.error("Error fetching containers:", error);
      res.status(500).json({ success: false, message: "Error fetching containers", error });
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
