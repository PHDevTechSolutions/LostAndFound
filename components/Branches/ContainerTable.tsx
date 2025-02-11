import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface ContainerCardsProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  handleCreateData: (postId: string) => void;
  Role: string;
  Location: string;
}

interface Post {
  _id: string;
  SpsicNo: string;
  DateArrived: string;
  DateSoldout: string;
  SupplierName: string;
  ContainerNo: string;
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
}

const ContainerCards: React.FC<ContainerCardsProps> = ({ posts, handleEdit, handleDelete, handleCreateData, Role, Location }) => {
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
  const [menuVisible, setMenuVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: Post) => {
      setUpdatedPosts((prevPosts) => {
        if (prevPosts.find(post => post._id === newPost._id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, []);

  const toggleMenu = (postId: string) => {
    setMenuVisible((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Filter posts based on location and role
  const filteredPosts = updatedPosts.filter((post) => {
    // If Role is Staff, they can only see posts with the same location
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => {
          // Determine card color and animation class based on status
          const cardClasses =
            post.Status === "Inventory"
              ? "bg-blue-300 border-blue-500"
              : post.Status === "Soldout"
                ? "bg-orange-300 border-orange-500"
                : "bg-white border-gray-200";

          return (
            <div
              key={post._id}
              className={`relative ${cardClasses} border rounded-xl shadow-md p-4 transition-all duration-500 ease-in-out`}
            >
              {/* Card Header */}
              <div className="bg-gray-100 p-3 shadow-lg rounded-lg flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-800 text-center">
                  {post.SpsicNo}
                </h3>
                <button
                  onClick={() => toggleMenu(post._id)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <BsThreeDotsVertical size={20} />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-3 text-xs capitalize">
                <p>
                  <strong>Arrived:</strong> {post.DateArrived} |{" "}
                  <strong>Soldout:</strong> {post.DateSoldout}
                </p>
                <p className="mb-2">
                  <strong>Supplier:</strong> {post.SupplierName} |{" "}
                  <strong>{post.Country}</strong> 
                </p>
                <p>
                  <strong>Container No:</strong> {post.ContainerNo} | <strong>{post.Location}</strong>
                </p>
                <p>
                  <strong>Commodity:</strong> {post.Commodity}
                </p>
                <p className="mb-2">
                  <strong>Size:</strong> {post.Size} | {""} <strong>{post.Freezing}</strong> | {""} <strong>{post.BoxType}</strong> 
                </p>
                <p>
                  <strong>Beginning:</strong> {post.TotalQuantity}
                </p>
                <p>
                  <strong>Sales Box:</strong> {post.TotalQuantity - post.Boxes}
                </p>
                <p>
                  <strong>Remaining:</strong> {post.Boxes}
                </p>
              </div>

              {/* Card Footer */}

              <div className="bg-gray-100 p-3 shadow-lg rounded-b-lg text-center text-xs" >
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${((post.TotalQuantity - post.Boxes) / post.TotalQuantity) * 100}%`,
                    backgroundColor: post.Status === "Soldout" ? "#F97316" : post.Status === "Inventory" ? "#3B82F6" : "#D1D5DB",
                    transition: "width 0.5s ease-in-out", // Animation for smooth transition
                  }}
                ></div>
                <p className="font-bold mt-1">{post.Status}</p>
              </div>


              {/* Dropdown Menu */}
              {menuVisible[post._id] && (
                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                  <button
                    onClick={() => handleCreateData(post._id)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    View Data
                  </button>
                  {Role !== "Staff" && (
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Delete
                    </button>
                  )}
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
