import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface UsersTableProps {
  posts: any[];  // Make sure your posts contain 'Role' field
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  Role: string;  // Role can be null
}

const UsersTable: React.FC<UsersTableProps> = React.memo(({ posts, handleEdit, handleDelete, Role }) => {
  const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    console.log("Role in UsersTable:", Role); // Debugging the Role
  }, [Role]);

  useEffect(() => {
    // Debugging posts data to ensure it contains expected fields
    console.log("Posts data:", posts);
    
    const newPostListener = (newPost: any) => {
      console.log("Received new post:", newPost); // Debugging socket data
      setUpdatedPosts((prevPosts) => {
        if (prevPosts.find((post) => post._id === newPost._id)) return prevPosts; // Prevent duplicate posts
        return [newPost, ...prevPosts];
      });
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, [posts]);

  const toggleRow = useCallback((postId: string) => {
    setExpandedRows((prev) => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(postId)) {
        newExpandedRows.delete(postId);
      } else {
        newExpandedRows.add(postId);
      }
      return newExpandedRows;
    });
  }, []);

  // Filter posts based on the Role
  const filteredPosts = useMemo(() => {
    console.log("Filtered posts based on Role:", Role); // Debugging filtering logic
    if (Role === "Admin") {
      return updatedPosts.filter((post) => post.Role === "Staff");
    }
    if (Role === "Super Admin") {
      return updatedPosts.filter((post) => post.Role === "Staff" || post.Role === "Admin");
    }
    return [];
  }, [updatedPosts, Role]);

  // Debugging filtered posts
  useEffect(() => {
    console.log("Filtered Posts Length:", filteredPosts.length);
  }, [filteredPosts]);

  // Memoize rows to avoid unnecessary re-renders
  const memoizedRows = useMemo(() => {
    return filteredPosts.map((post) => (
      <React.Fragment key={post._id}>
        <tr className="bg-gray-10 cursor-pointer" onClick={() => toggleRow(post._id)}>
          <td className="px-4 py-2 border capitalize">
            <BsPlusCircle className="inline-block mr-2 md:hidden" /> {post.Lastname}, {post.Firstname}
          </td>
          <td className="px-4 py-2 border hidden md:table-cell">{post.Location}</td>
          <td className="px-4 py-2 border hidden md:table-cell">{post.Email}</td>
          <td className="px-4 py-2 border hidden md:table-cell">{post.Role}</td>
          <td className="px-4 py-2 border hidden md:table-cell">
            <Menu as="div" className="relative inline-block text-left">
              <div>
                <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-2 py-1 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none">
                  <BsThreeDotsVertical />
                </Menu.Button>
              </div>
              <Menu.Items className="origin-top-right absolute right-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-xs`}
                      >
                        Edit
                      </button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post._id);
                        }}
                        className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"} block w-full text-left px-4 py-2 text-xs`}
                      >
                        Delete
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Menu>
          </td>
        </tr>
        {expandedRows.has(post._id) && (
          <tr className="bg-gray-10 md:hidden">
            <td className="px-4 py-2" colSpan={5}>
              <div>
                <strong>Fullname:</strong> {post.Lastname}, {post.Firstname}
              </div>
              <div>
                <strong>Location:</strong> {post.Location}
              </div>
              <div>
                <strong>Email:</strong> {post.Email}
              </div>
              <div>
                <strong>Role:</strong> {post.Role}
              </div>
              <div className="mt-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-700 text-white px-2 py-1 rounded text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post._id);
                  }}
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ));
  }, [filteredPosts, expandedRows, toggleRow, handleEdit, handleDelete]);

  return (
    <div>
      <table className="min-w-full bg-white border text-xs">
        <thead>
          <tr>
            <th className="w-1/7 text-left border px-4 py-2 whitespace-nowrap">Fullname</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Location</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Email</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Role</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memoizedRows.length > 0 ? memoizedRows : (
            <tr>
              <td colSpan={5} className="py-2 px-4 border text-center">No accounts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default UsersTable;
