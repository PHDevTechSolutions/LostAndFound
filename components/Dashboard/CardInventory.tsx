import React from "react";
import { FaBoxes } from "react-icons/fa";

interface CardInventoryProps {
  inventoryCount: number;
}

const CardInventory: React.FC<CardInventoryProps> = ({ inventoryCount }) => {
  return (
    <div className="bg-gradient-to-r from-green-400 to-blue-500 shadow-md rounded-lg p-4 flex items-center">
      <FaBoxes className="text-white text-4xl mr-4" />
      <div>
        <h2 className="text-lg font-bold text-white mb-2">{inventoryCount}</h2>
        <p className="text-sm text-white">Number of Containers in Inventory</p>
      </div>
    </div>
  );
};

export default CardInventory;
