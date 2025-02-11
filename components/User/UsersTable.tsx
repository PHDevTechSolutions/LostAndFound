import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface UsersTableProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const UsersTable: React.FC<UsersTableProps> = React.memo(({ posts, handleEdit, handleDelete, Role }) => {
  const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: any) => {
      setUpdatedPosts((prevPosts) => {
        if (prevPosts.find((post) => post._id === newPost._id)) return prevPosts;
        return [newPost, ...prevPosts];
      });
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, [posts]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {updatedPosts.length > 0 ? (
        updatedPosts
          .filter(post => !(Role === "Admin" && post.Role === "Super Admin"))
          .map((post) => (
            <div
              key={post._id}
              className={`relative border border-gray-200 rounded-lg shadow-lg p-4 overflow-hidden `}
            >
              {/* Animated Border */}
              <div className="absolute inset-0 border-2 border-transparent rounded-lg animate-border" />
              
              {/* Card Header */}
              <div className="bg-gray-100 p-3 rounded-t-lg flex justify-between items-center">
                <h3 className="text-xs font-semibold text-gray-800 capitalize">{post.Lastname}, {post.Firstname}</h3>
                <Menu as="div" className="relative">
                  <Menu.Button className="text-gray-500 hover:text-gray-800">
                    <BsThreeDotsVertical size={20} />
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg border z-10 text-xs">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleEdit(post)}
                          className={`block w-full text-left px-4 py-2 ${active ? "bg-gray-100" : ""}`}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className={`block w-full text-left px-4 py-2 text-red-500 ${active ? "bg-gray-100" : ""}`}
                        >
                          Delete
                        </button>
                      )}
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>

              {/* Card Body */}
              <div className="p-3 text-xs">
                <p><strong>Email:</strong> {post.Email}</p>
                <p><strong>Location:</strong> {post.Location}</p>
              </div>

              {/* Status Indicator */}
              <div className="bg-gray-100 p-3 rounded-b-lg text-xs text-left font-semibold">
                <p><strong>Role:</strong> {post.Role}</p>
              </div>
            </div>
          ))
      ) : (
        <p className="text-center col-span-full">No records found</p>
      )}
    </div>
  );
});

export default UsersTable;