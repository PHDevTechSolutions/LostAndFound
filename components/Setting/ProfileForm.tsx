import React from "react";

type ProfileFormProps = {
  userDetails: {
    id: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    Location: string;
    Role: string;
  };
  handleSubmit: (e: React.FormEvent) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const ProfileForm: React.FC<ProfileFormProps> = ({
  userDetails,
  handleSubmit,
  handleChange,
  handleSelectChange,
}) => {
  // Determine which roles should be available in the dropdown
  const availableRoles = ["Super Admin", "Admin", "Directors", "Staff"];
  const filteredRoles = availableRoles.filter((role) => role === userDetails.Role);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="Firstname"
          className="block text-xs font-medium text-gray-700"
        >
          First Name
        </label>
        <input
          type="text"
          id="Firstname"
          name="Firstname"
          value={userDetails.Firstname}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
        />
      </div>
      <div>
        <label htmlFor="Lastname" className="block text-xs font-medium text-gray-700">
          Last Name
        </label>
        <input
          type="text"
          id="Lastname"
          name="Lastname"
          value={userDetails.Lastname}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
        />
      </div>
      <div>
        <label htmlFor="Email" className="block text-xs font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="Email"
          name="Email"
          value={userDetails.Email}
          onChange={handleChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs"
        />
      </div>
      <div>
        <label htmlFor="Location" className="block text-xs font-medium text-gray-700">
          Location
        </label>
        <select
          id="Location"
          name="Location"
          value={userDetails.Location}
          onChange={handleSelectChange}
          className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
        >
          <option value="">Select Location</option>
          <option value="Navotas">Navotas</option>
          <option value="Sambat">Sambat</option>
          <option value="Minalin">Minalin</option>
        </select>
      </div>
      {/* Show role dropdown only if the role is not Admin or Staff */}
      {userDetails.Role !== "Admin" && userDetails.Role !== "Staff" && (
        <div>
          <label htmlFor="Role" className="block text-xs font-medium text-gray-700">
            Role
          </label>
          <select
            id="Role"
            name="Role"
            value={userDetails.Role}
            onChange={handleSelectChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md text-xs capitalize"
          >
            <option value="">Select Role</option>
            {filteredRoles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      )}
      <button
        type="submit"
        className="bg-blue-600 text-white text-xs px-4 py-2 rounded mr-2"
      >
        Save Changes
      </button>
    </form>
  );
};

export default ProfileForm;
