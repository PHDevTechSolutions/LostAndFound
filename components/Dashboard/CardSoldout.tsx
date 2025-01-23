import React from "react";
import { FaCheckCircle, FaPlus } from "react-icons/fa";

interface CardSoldoutProps {
  soldOutCount: number;
  isSoldOutCardOpen: boolean;
  setIsSoldOutCardOpen: (isOpen: boolean) => void;
}

const CardSoldout: React.FC<CardSoldoutProps> = ({
  soldOutCount,
  isSoldOutCardOpen,
  setIsSoldOutCardOpen,
}) => {
  return (
    <div className="bg-gradient-to-r from-red-500 to-yellow-500 shadow-md rounded-lg p-4 flex items-center justify-between">
      <div className="flex items-center">
        <FaCheckCircle className="text-white text-4xl mr-4" />
        <div>
          <h2 className="text-lg font-bold text-white mb-2">{soldOutCount}</h2>
          <p className="text-sm text-white">Number of Containers Sold Out</p>
        </div>
      </div>
      <button
        className="text-white text-2xl"
        onClick={() => setIsSoldOutCardOpen(!isSoldOutCardOpen)} // Toggle the collapsible card
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default CardSoldout;
