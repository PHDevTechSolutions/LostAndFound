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

  // Update BoxSales and GrossSales when BoxSales field changes
  const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sales = parseInt(e.target.value) || 0;
    const price = parseFloat(Price) || 0;
    const currentBoxes = parseInt(Boxes) || 0;

    // Prevent sales from exceeding available boxes
    if (sales > currentBoxes) {
      toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
      setBoxSales(currentBoxes.toString());
      return;
    }

    const remainingBoxes = currentBoxes - sales;
    setBoxSales(sales.toString());
    setGrossSales((sales * price).toFixed(2)); // Set the gross sales correctly
    setBoxes(remainingBoxes.toString()); // Update boxes locally (not in database yet)
  };

  // Handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ContainerNo) {
      toast.error("Container No is required", { autoClose: 1000 });
      return;
    }

    // Determine the URL and method for API call based on whether it's an update or create
    const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
    const method = editData ? "PUT" : "POST";

    // Send data to the backend for creating or updating container
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
        Boxes,  // Remaining Boxes after BoxSales
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

      // Update Boxes in database only after form submission
      const remainingBoxes = parseInt(Boxes) - parseInt(BoxSales); // Update the boxes in the database
      const responseBoxes = await fetch('/api/Container/UpdateBoxes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post._id, Boxes: remainingBoxes }),
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

  // Reset form after submission
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
