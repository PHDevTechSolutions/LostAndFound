import { useState } from 'react';
import toast from 'react-toastify';

const CreateDataForm = ({ editData, fetchData, resetForm, post }) => {
    const [ContainerNo, setContainerNo] = useState(editData ? editData.ContainerNo : '');
    const [Username, setUsername] = useState(editData ? editData.Username : '');
    const [Location, setLocation] = useState(editData ? editData.Location : '');
    const [BoxType, setBoxType] = useState(editData ? editData.BoxType : '');
    const [DateOrder, setDateOrder] = useState(editData ? editData.DateOrder : '');
    const [BuyersName, setBuyersName] = useState(editData ? editData.BuyersName : '');
    const [BoxSales, setBoxSales] = useState(editData ? editData.BoxSales : '');
    const [Price, setPrice] = useState(editData ? editData.Price : '');
    const [Boxes, setBoxes] = useState(editData ? editData.Boxes : '0');
    const [GrossSales, setGrossSales] = useState(editData ? editData.GrossSales : '');
    const [PlaceSales, setPlaceSales] = useState(editData ? editData.PlaceSales : '');
    const [PaymentMode, setPaymentMode] = useState(editData ? editData.PaymentMode : '');

    // Handle change in box sales and update gross sales and available boxes (no immediate DB update)
    const handleBoxSalesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sales = parseInt(e.target.value) || 0;
        const price = parseFloat(Price) || 0;
        const currentBoxes = parseInt(Boxes) || 0;

        if (sales > currentBoxes) {
            toast.error("Box sales cannot exceed available boxes.", { autoClose: 1000 });
            setBoxSales(currentBoxes.toString());
            return;
        }

        const remainingBoxes = currentBoxes - sales;
        setBoxSales(sales.toString());
        setGrossSales((sales * price).toFixed(2)); // Ensure proper formatting
        setBoxes(remainingBoxes.toString()); // Update state, not DB yet
    };

    // Handle form submission and update database
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!ContainerNo) {
            toast.error("Container No is required", { autoClose: 1000 });
            return;
        }

        const url = editData ? `/api/Container/UpdateContainer` : `/api/Container/SaveContainer`;
        const method = editData ? "PUT" : "POST";

        // Perform the API request to save the form data
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
                    fetchData();
                    resetForm();
                },
            });

            // Update the box count in the database (only after form is saved)
            const responseBoxes = await fetch('/api/Container/UpdateBoxes', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: post._id, Boxes: parseInt(Boxes) }),
            });

            if (responseBoxes.ok) {
                toast.success('Boxes updated in database', { autoClose: 1000 });
                fetchData(); // Re-fetch data to reflect updates
            } else {
                const errorData = await responseBoxes.json();
                toast.error(`Failed to update boxes: ${errorData.message || ''}`, { autoClose: 1000 });
            }
        } else {
            toast.error(editData ? "Failed to update data" : "Failed to add data", { autoClose: 1000 });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Container No:</label>
                <input
                    type="text"
                    value={ContainerNo}
                    onChange={(e) => setContainerNo(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={Username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Location:</label>
                <input
                    type="text"
                    value={Location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Box Type:</label>
                <input
                    type="text"
                    value={BoxType}
                    onChange={(e) => setBoxType(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Date of Order:</label>
                <input
                    type="date"
                    value={DateOrder}
                    onChange={(e) => setDateOrder(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Buyer's Name:</label>
                <input
                    type="text"
                    value={BuyersName}
                    onChange={(e) => setBuyersName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Box Sales:</label>
                <input
                    type="number"
                    value={BoxSales}
                    onChange={handleBoxSalesChange}
                    min="0"
                    required
                />
            </div>

            <div>
                <label>Price:</label>
                <input
                    type="number"
                    value={Price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Remaining Boxes:</label>
                <input
                    type="number"
                    value={Boxes}
                    readOnly
                />
            </div>

            <div>
                <label>Gross Sales:</label>
                <input
                    type="number"
                    value={GrossSales}
                    readOnly
                />
            </div>

            <div>
                <label>Place of Sales:</label>
                <input
                    type="text"
                    value={PlaceSales}
                    onChange={(e) => setPlaceSales(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Payment Mode:</label>
                <input
                    type="text"
                    value={PaymentMode}
                    onChange={(e) => setPaymentMode(e.target.value)}
                    required
                />
            </div>

            <button type="submit">
                {editData ? 'Save Changes' : 'Save Data'}
            </button>
        </form>
    );
};

export default CreateDataForm;
