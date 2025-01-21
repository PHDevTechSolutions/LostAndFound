
"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface ContainerTableProps {
  posts: any[];
  handleEdit: (post: any) => void;
  handleDelete: (postId: string) => void;
  handleCreateData: (postId: string) => void;
}

const ContainerTable: React.FC<ContainerTableProps> = React.memo(({ posts, handleEdit, handleDelete, handleCreateData }) => {
  const [updatedPosts, setUpdatedPosts] = useState<any[]>(posts);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    const newPostListener = (newPost: any) => {
      setUpdatedPosts((prevPosts) => {
        if (prevPosts.find(post => post._id === newPost._id)) return prevPosts;  // Prevent adding duplicate posts
        return [newPost, ...prevPosts];
      });
    };

    socket.on("newPost", newPostListener);
    return () => {
      socket.off("newPost", newPostListener);
    };
  }, []);

  const toggleRow = useCallback((postId: string) => {
    setExpandedRows(prev => {
      const newExpandedRows = new Set(prev);
      if (newExpandedRows.has(postId)) {
        newExpandedRows.delete(postId);
      } else {
        newExpandedRows.add(postId);
      }
      return newExpandedRows;
    });
  }, []);

  // Memoizing the table rows to prevent unnecessary recomputation
  const memoizedRows = useMemo(() => {
    return updatedPosts.map((post) => {
      const salesBox = post.TotalQuantity - post.Boxes; // Calculate Sales Box value dynamically

      return (
        <React.Fragment key={post._id}>
          <tr
            className="bg-gray-10 cursor-pointer"
            onClick={() => toggleRow(post._id)}
          >
            <td className="px-4 py-2 border">
              <BsPlusCircle className="inline-block mr-2 md:hidden" /> {post.SpsicNo}
            </td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.DateArrived}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.DateSoldout}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.SupplierName}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.ContainerNo}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.TotalQuantity}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{salesBox}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.Boxes}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.GrossSales}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.Status}</td>
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
                            handleCreateData(post._id);
                          }}
                          className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-xs`}
                        >
                          Create Data
                        </button>
                      )}
                    </Menu.Item>

                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                          className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-xs`}
                        >
                          Edit
                        </button>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                          className={`${active ? "bg-gray-100 text-gray-900" : "text-gray-700"
                            } block w-full text-left px-4 py-2 text-xs`}
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
              <td className="px-4 py-2" colSpan={6}>
                <div>
                  <strong>SPSIC No. :</strong> {post.SpsicNo}
                </div>
                <div>
                  <strong>Date Arrived:</strong> {post.DateArrived}
                </div>
                <div>
                  <strong>Date Soldout:</strong> {post.DateSoldout}
                </div>
                <div>
                  <strong>Supplier:</strong> {post.SupplierName}
                </div>
                <div>
                  <strong>Container No. :</strong> {post.ContainerNo}
                </div>
                <div>
                  <strong>Boxes :</strong> {post.Boxes}
                </div>
                <div className="mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateData(post._id);
                    }}
                    className="bg-gray-100 text-gray-900 text-gray-700 block w-full text-left px-4 py-2 text-xs" >
                    Create Data
                  </button>

                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded mr-2 text-xs"
                    onClick={(e) => { e.stopPropagation(); handleEdit(post); }}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-700 text-white px-2 py-1 rounded text-xs"
                    onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });
  }, [updatedPosts, expandedRows, toggleRow, handleCreateData, handleEdit, handleDelete]);

  return (
    <div>
      <table className="min-w-full bg-white border text-xs">
        <thead>
          <tr>
            <th className="w-1/6 text-left border px-4 py-2">SPSIC No.</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Date Arrived</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Date Soldout</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Supplier</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Container No.</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Beginning</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Sales Box</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Remaining</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Total Gross Sales</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Status</th>
            <th className="w-1/6 text-left border px-4 py-2 hidden md:table-cell">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memoizedRows.length > 0 ? memoizedRows : (
            <tr>
              <td colSpan={6} className="py-2 px-4 border text-center">No accounts available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

export default ContainerTable;
