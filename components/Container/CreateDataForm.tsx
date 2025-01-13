import React from "react";

interface CreateDataFormProps {
    post: any;
    onCancel: () => void;
}

const CreateDataForm: React.FC<CreateDataFormProps> = ({ post, onCancel }) => {
    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-sm font-semibold text-center text-gray-700 mb-6">
                        Container Van No. {post?.ContainerNo}
                    </h2>
                    <form>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="Vendor">Date</label>
                            <input type="date" id="Vendor" className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SPSIC No">Buyer's Name</label>
                            <input type="text" id="SpsicNo" className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SPSIC No">Box Sales</label>
                            <input type="number" id="SpsicNo" className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                        <div className="mb-4">
                            <label className="block text-xs font-bold mb-2" htmlFor="SPSIC No">Price</label>
                            <input type="number" id="SpsicNo" className="w-full px-3 py-2 border rounded text-xs" required />
                        </div>
                    </form>
                    <div className="flex justify-between">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-sm text-white bg-gray-400 hover:bg-gray-500 px-4 py-2 rounded-md focus:outline-none"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md focus:outline-none"
                        >
                            Save
                        </button>
                    </div>
                </div>
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-lg font-bold mb-2">Card 2 Title</h2>
                    <p className="text-sm text-gray-700">This is the content of the second card. You can add more details here.</p>
                </div>
            </div>
        </div>
    );
};

export default CreateDataForm;
