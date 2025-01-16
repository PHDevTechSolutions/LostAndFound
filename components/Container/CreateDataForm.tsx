import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CreateDataFormProps {
  post: any;
  onCancel: () => void;
}

const CreateDataForm: React.FC<CreateDataFormProps> = ({ post, onCancel }) => {
  const [ContainerNo, setContainerNo] = useState(post?.ContainerNo || "");
  const [Username, setUsername] = useState("");
  const [Location, setLocation] = useState("");
  const [BoxType, setBoxType] = useState("");
  const [DateOrder, setDateOrder] = useState("");
  const [BuyersName, setBuyersName] = useState("");
  const [BoxSales, setBoxSales] = useState("");
  const [Price, setPrice] = useState("");
  const [Boxes, setBoxes] = useState(post?.Boxes || "");
  const [GrossSales, setGrossSales] = useState("");
  const [PlaceSales, setPlaceSales] = useState("");
  const [PaymentMode, setPaymentMode] = useState("");
  const [editData, setEditData] = useState<any>(null);

  // Update GrossSales when BoxSales changes
  const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sales = parseInt(e.target.value) || 0;
    const price = parseFloat(Price) || 0;
    const currentBoxes = parseInt(Boxes) || 0;

    if (sales > currentBoxes) {
      toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
      setBoxSales(currentBoxes.toString());
      return;
    }

    setBoxSales(sales.toString());
    setGrossSales((sales * price).toFixed(2)); // Ensure proper formatting
  };

  // Handle form submission for both create and update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ContainerNo) {
      toast.error("Container No is required", { autoClose: 1000 });
      return;
    }

    const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ContainerNo,
        Username,
        Location,
        BoxType,
        DateOrder,
        BuyersName,
        BoxSales,
        Price,
        Boxes,
        GrossSales,
        PlaceSales,
        PaymentMode,
        id: editData ? editData._id : undefined,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Data updated successfully" : "Data added successfully", {
        autoClose: 1000,
        onClose: () => {
          resetForm();
        },
      });

      // Now update the boxes in the database only after the form is saved
      const responseBoxes = await fetch('/api/Container/UpdateBoxes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post._id, Boxes: parseInt(Boxes) }),
      });

      if (responseBoxes.ok) {
        toast.success('Boxes updated in database', { autoClose: 1000 });
      } else {
        const errorData = await responseBoxes.json();
        toast.error(`Failed to update boxes: ${errorData.message || ''}`, { autoClose: 1000 });
      }
    } else {
      toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
    }
  };

  const resetForm = () => {
    setContainerNo(post?.ContainerNo || "");
    setUsername("");
    setLocation("");
    setBoxType("");
    setDateOrder("");
    setBuyersName("");
    setBoxSales("");
    setPrice("");
    setBoxes("");
    setGrossSales("");
    setPlaceSales("");
    setPaymentMode("");
    setEditData(null);
  };

  useEffect(() => {
    if (post) {
      setContainerNo(post.ContainerNo);
      setBoxes(post.Boxes);
    }
  }, [post]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Container No:</label>
        <input
          type="text"
          value={ContainerNo}
          onChange={(e) => setContainerNo(e.target.value)}
        />
      </div>
      <div>
        <label>Box Sales:</label>
        <input
          type="number"
          value={BoxSales}
          onChange={handleBoxSalesChange}
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          value={Price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div>
        <label>Boxes Available:</label>
        <input
          type="number"
          value={Boxes}
          disabled
        />
      </div>
      <div>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
};

export default CreateDataForm;
