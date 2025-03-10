import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineLeft, AiOutlineRight, AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";


interface Post {
  _id: string;
  SpsicNo: string;
  DateArrived: string;
  DateSoldout: string;
  SupplierName: string;
  ContainerNo: string;
  ContainerType: string;
  Commodity: string;
  TotalQuantity: number;
  Boxes: number;
  BoxType: string;
  Size: string;
  Status: string;
  Remaining: number;
  Country: number;
  Freezing: number;
  Location: string; // Add location field to Post
  GrossSales: string;
  AveragePrice: string;
}

const STATUS_COLORS: { [key: string]: string } = {
  Inventory: "bg-blue-300",
  Soldout: "bg-orange-300",
  Available: "bg-green-300",
};

interface ContainerCardsProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  handleStatusUpdate: (postId: string, newStatus: string) => void;
  handleCreateData: (postId: string) => void;
  Role: string;
  Location: string;
}

const ContainerCards: React.FC<ContainerCardsProps> = ({ posts, handleEdit, handleDelete, handleStatusUpdate, handleCreateData, Role, Location, }) => {
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});
  const [statusMenuVisible, setStatusMenuVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: Post) => {
      setUpdatedPosts((prevPosts) => {
        if (prevPosts.find((post) => post._id === newPost._id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    };

  }, []);

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
    setStatusMenuVisible({});
  };

  const toggleStatusMenu = (postId: string) => {
    setStatusMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const updateStatus = (postId: string, newStatus: string) => {
    handleStatusUpdate(postId, newStatus);
    setStatusMenuVisible({});
  };

  const filteredPosts = updatedPosts.filter((post) => {
    if (Role === "Staff") {
      return post.Location === Location;
    }
    // If Role is Admin, they can see all posts regardless of location
    if (Role === "Admin") {
      return post.Location === Location;
    }
    return true;
  });

  // Sort posts by DateArrived in descending order
  const sortedPosts = filteredPosts.sort((a, b) => {
    return new Date(b.DateArrived).getTime() - new Date(a.DateArrived).getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => {
          const cardClasses = STATUS_COLORS[post.Status] || "bg-white border-gray-200";
          return (
            <div key={post._id} className={`relative border-b-2 rounded-md shadow-md p-4 flex flex-col mb-2 ${cardClasses}`}>
              {/* Card Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-800 text-center uppercase">
                  {post.SpsicNo}
                </h3>
                <div className="flex items-center space-x-1">
                  <button onClick={() => toggleMenu(post._id)} className="text-gray-500 hover:text-gray-800">
                    <BsThreeDotsVertical size={12} />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="mt-4 text-xs capitalize flex-grow">
                <p><strong>Arrived:</strong> {post.DateArrived} | <strong>Soldout:</strong> {post.DateSoldout}</p>
                <p><strong>Supplier:</strong> {post.SupplierName} | <strong>{post.Country}</strong></p>
                <p><strong>Container No:</strong> {post.ContainerNo}</p>
                <p><strong>Size:</strong> {post.Size} | <strong>{post.Freezing}</strong> | <strong>{post.BoxType}</strong></p>
                <p><strong>Beginning:</strong> {post.TotalQuantity}</p>
                <p><strong>Sales Box:</strong> {post.TotalQuantity - post.Boxes}</p>
                <p><strong>Remaining:</strong> {post.Boxes}</p>
                {/* Format Total Sales with Peso sign and comma separators */}
                <p className="mt-2"><strong>Total Sales:</strong> ₱{parseFloat(post.GrossSales).toLocaleString()}</p>

                {/* Compute Average Price */}
                <p><strong>Average Price: </strong>
                  {post.TotalQuantity - post.Boxes > 0
                    ? `₱${(parseFloat(post.GrossSales) / (post.TotalQuantity - post.Boxes)).toFixed(2)}`
                    : "0"}
                </p>
              </div>

              {/* Card Footer */}
              
              <div className="border-t border-gray-900 mt-3 pt-2 text-xs flex justify-between items-center">
                <span className="flex items-center gap-1 font-bold">{post.Status} / {post.Location}</span>
              </div>

              {/* Dropdown Menu */}
              {menuVisible[post._id] && (
                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs text-left">
                  <button onClick={() => handleCreateData(post._id)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Create Data</button>
                  <button onClick={() => handleEdit(post)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Edit</button>
                  <button onClick={() => toggleStatusMenu(post._id)} className="w-full px-4 py-2 hover:bg-gray-100 text-left">Change Status</button>
                  {Role !== "Staff" && <button onClick={() => handleDelete(post._id)} className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-left">Delete</button>}
                </div>
              )}

              {/* Status Change Menu */}
              {statusMenuVisible[post._id] && (
                <div className="absolute right-16 top-20 bg-white shadow-lg rounded-lg border w-50 z-20 text-xs">
                  {Object.keys(STATUS_COLORS).map((status) => (
                    <button key={status} onClick={() => updateStatus(post._id, status)} className="w-full flex items-center gap-2 text-left px-4 py-2 hover:bg-gray-100">
                      <span className={`w-3 h-3 rounded-full border border-black ${STATUS_COLORS[status].split(" ")[0]}`}></span>
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })
      ) : (
        <p className="text-center text-xs col-span-full">No records found</p>
      )}
    </div>
  );
};

export default ContainerCards;
