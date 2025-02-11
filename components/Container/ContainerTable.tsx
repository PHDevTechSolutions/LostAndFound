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
}

const ContainerCards: React.FC<ContainerCardsProps> = ({ posts, handleEdit, handleDelete, handleCreateData, Role }) => {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {updatedPosts.length > 0 ? (
        updatedPosts.map((post) => {
          // Determine card color and animation class based on status
          const cardClasses =
            post.Status === "Inventory"
              ? "bg-blue-500 border-blue-500"
              : post.Status === "Soldout"
              ? "bg-orange-500 border-orange-500"
              : "bg-white border-gray-200";
  
          return (
            <div
              key={post._id}
              className={`relative ${cardClasses} border rounded-lg shadow-md p-4 transition-all duration-500 ease-in-out`}
            >
              {/* Card Header */}
              <div className="bg-gray-100 p-3 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-800">
                  SPSIC No.{post.SpsicNo}
                </h3>
                <button
                  onClick={() => toggleMenu(post._id)}
                  className="text-gray-500 hover:text-gray-800"
                >
                  <BsThreeDotsVertical size={20} />
                </button>
              </div>
  
              {/* Card Body */}
              <div className="p-3 text-sm">
                <p>
                  <strong>Arrived:</strong> {post.DateArrived} /{" "}
                  <strong>Soldout:</strong> {post.DateSoldout}
                </p>
                <p>
                  <strong>Supplier:</strong> {post.SupplierName}
                </p>
                <p>
                  <strong>Container No.:</strong> {post.ContainerNo}
                </p>
                <p>
                  <strong>Commodity</strong> {post.Commodity}
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
                <p>
                  <strong>Box Type:</strong> {post.BoxType}
                </p>
                <p>
                  <strong>Size:</strong> {post.Size}
                </p>
              </div>
  
              {/* Card Footer */}
              <div className="bg-gray-100 p-3 rounded-b-lg flex justify-between items-center text-xs">
                <p>
                  <strong>Status:</strong> {post.Status}
                </p>
              </div>
  
              {/* Dropdown Menu */}
              {menuVisible[post._id] && (
                <div className="absolute right-4 top-12 bg-white shadow-lg rounded-lg border w-32 z-10 text-xs">
                  <button
                    onClick={() => handleCreateData(post._id)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Create Data
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Edit
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
        <p className="text-center col-span-full">No records found</p>
      )}
    </div>
  );  
};

export default ContainerCards;
