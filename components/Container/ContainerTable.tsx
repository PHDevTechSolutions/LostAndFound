import React, { useEffect, useState, useCallback, useMemo } from "react";
import io from "socket.io-client";
import { Menu } from "@headlessui/react";
import { BsPlusCircle, BsThreeDotsVertical } from "react-icons/bs";

const socket = io("http://localhost:3001");

interface ContainerTableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  handleCreateData: (postId: string) => void;
  Role: string; // Pass the role here
}

interface Post {
  _id: string;
  SpsicNo: string;
  DateArrived: string;
  DateSoldout: string;
  SupplierName: string;
  ContainerNo: string;
  TotalQuantity: number;
  Boxes: number;
  BoxType: string;
  Size: string;
  Status: string;
  Remaining: number;
}

const ContainerTable: React.FC<ContainerTableProps> = React.memo(({ posts, handleEdit, handleDelete, handleCreateData, Role }) => {
  const [updatedPosts, setUpdatedPosts] = useState<Post[]>(posts);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setUpdatedPosts(posts);
  }, [posts]);

  useEffect(() => {
    console.log("Role in ContainerTable:", Role);
  }, [Role]);

  useEffect(() => {
    const newPostListener = (newPost: Post) => {
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
    let totalBeginning = 0;
    let totalSalesBox = 0;
    let totalRemaining = 0;

    const rows = updatedPosts.map((post) => {
      const salesBox = post.TotalQuantity - post.Boxes; // Calculate Sales Box value dynamically
      totalBeginning += post.TotalQuantity || 0; // Sum Beginning
      totalSalesBox += salesBox; // Sum Sales Box
      totalRemaining += post.Boxes || 0; // Sum Remaining

      return (
        <React.Fragment key={post._id}>
          <tr
            className="bg-gray-100 cursor-pointer"
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
            <td className="px-4 py-2 border hidden md:table-cell">{post.BoxType}</td>
            <td className="px-4 py-2 border hidden md:table-cell">{post.Size}</td>
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

                    {/* Conditionally render the Delete button based on the role */}
                    {Role !== "Staff" && (
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
                    )}
                  </div>
                </Menu.Items>
              </Menu>
            </td>
          </tr>
          {expandedRows.has(post._id) && (
            <tr className="bg-gray-100 md:hidden">
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

                  {/* Conditionally render the Delete button based on the role */}
                  {Role !== "Staff" && (
                    <button
                      className="bg-red-700 text-white px-2 py-1 rounded text-xs"
                      onClick={(e) => { e.stopPropagation(); handleDelete(post._id); }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </td>
            </tr>
          )}
        </React.Fragment>
      );
    });

    return { rows, totalBeginning, totalSalesBox, totalRemaining };
  }, [updatedPosts, expandedRows, toggleRow]);

  return (
    <div>
      <table className="min-w-full bg-white border text-xs">
        <thead>
          <tr>
            <th className="w-1/7 text-left border px-4 py-2 whitespace-nowrap">SPSIC No.</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Date Arrived</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Date Soldout</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Supplier</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Container No.</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Beginning</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Sales Box</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Remaining</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Box Type</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Size</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Status</th>
            <th className="w-1/7 text-left border px-4 py-2 hidden md:table-cell whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {memoizedRows.rows.length > 0 ? memoizedRows.rows : (
            <tr>
              <td colSpan={12} className="py-2 px-4 border text-center">No records found</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <td className="border font-bold hidden md:table-cell text-right px-4 py-2" colSpan={5}>Total:</td>
            <td className="border font-bold hidden md:table-cell px-4 py-2">{memoizedRows.totalBeginning.toLocaleString()}</td>
            <td className="border font-bold hidden md:table-cell px-4 py-2">{memoizedRows.totalSalesBox.toLocaleString()}</td>
            <td className="border font-bold hidden md:table-cell px-4 py-2">{memoizedRows.totalRemaining.toLocaleString()}</td>
            <td className="border font-bold hidden md:table-cell px-4 py-2" colSpan={3}></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
});

export default ContainerTable;
