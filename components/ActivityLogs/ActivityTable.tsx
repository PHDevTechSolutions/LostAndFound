import React from "react";
import { AiOutlineClockCircle } from "react-icons/ai"; // Clock icon from react-icons

interface ContainerTableProps {
  posts: any[];
}

const ActivityTable: React.FC<ContainerTableProps> = ({ posts }) => {
  return (
    <div className="space-y-4">
      {posts.length > 0 ? (
        posts.map((post) => (
          <div
            key={post._id}
            className="p-4 bg-white rounded-lg border border-gray-200 flex flex-col space-y-4"
          >
            {/* Card Header with Date */}
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="flex items-center text-xs text-gray-500">
                <AiOutlineClockCircle className="mr-2" />
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
            </div>

            {/* Card Body with Post Details */}
            <div className="text-xs capitalize font-semibold text-gray-700 space-y-2">
              <div>Username: {post.userName}</div>
              <div>Location: {post.Location}</div>
              {post.Price && <div>Price: {post.Price}</div>}
              {post.GrossSales && <div>Gross Sales: {post.GrossSales}</div>}
              <div>Message: {post.message}</div>
            </div>

            {/* Card Footer with Container No */}
            <div className="text-xs text-gray-700 mt-4 border-t pt-2">
              <div>Container No: {post.ContainerNo}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-500">No data available</div>
      )}
    </div>
  );
};

export default ActivityTable;
