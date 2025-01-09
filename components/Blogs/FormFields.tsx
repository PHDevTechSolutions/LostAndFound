import React from "react";

interface FormFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  link: string;
  setLink: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  categories: string;
  setCategories: (value: string) => void;
  tags: string;
  setTags: (value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  editPost?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  status,
  setStatus,
  link,
  setLink,
  author,
  setAuthor,
  categories,
  setCategories,
  tags,
  setTags,
  handleFileChange,
  editPost
}) => {
  const statusOptions = [
    { value: "draft", label: "Draft" },
    { value: "pending", label: "Pending" },
    { value: "private", label: "Private" },
    { value: "schedule", label: "Schedule" },
    { value: "publish", label: "Publish" },
    { value: "password_protected", label: "Password Protected" },
    { value: "sticky", label: "Sticky" },
  ];

  return (
    <>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="title">Title</label>
        <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="description">Description</label>
        <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" rows={4}></textarea>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="status">Status</label>
        <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
          <option value="">Select status</option>
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="link">Link</label>
        <input type="text" id="link" value={link} onChange={(e) => setLink(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" readOnly={!editPost}/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="author">Author</label>
        <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" disabled/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="categories">Categories</label>
        <input type="text" id="categories" value={categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="tags">Tags</label>
        <input type="text" id="tags" value={tags} onChange={(e) => setTags(e.target.value)} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
      <div className="mb-4">
        <label className="block text-xs font-bold mb-2" htmlFor="featureImage">Feature Image</label>
        <input type="file" id="featureImage" onChange={handleFileChange} className="w-full px-3 py-2 border rounded text-xs"/>
      </div>
    </>
  );
};

export default FormFields;
