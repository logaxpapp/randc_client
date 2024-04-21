import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';


const EditUserModal = ({ isOpen, onClose, user }) => {
    // Initialize form data only if user is not null, otherwise initialize with default empty fields
    const [formData, setFormData] = useState({
      firstName: user ? user.firstName : '',
      lastName: user ? user.lastName : '',
      email: user ? user.email : '',
      phone: user ? user.phone : '',
      country: user ? user.country : '',
    });

    useEffect(() => {
        // Update form data whenever the user prop changes
        if (user) {
          setFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            country: user.country,
            role: user.role,
            isAdmin: user.isAdmin,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            client: user.client,
            __v: user.__v,

          });
        }
      }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform update logic
    console.log('Updated User:', formData);
    onClose(); // Close modal after submit
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-2xl">
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <h3 className="text-xl font-semibold mb-8 text-center mt-12 p-4">Update User</h3>
       
        <form onSubmit={handleSubmit} className=' mb-20'>
        <div    className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          </div>
          <div    className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          </div>
          <div    className="grid grid-cols-2 gap-4 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="country">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="role">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
         
            </div>
            <div  className="grid grid-cols-2 gap-4 mb-12">
            <div className="mb-4">

                <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="status">
                  Status
                </label>
                <input
                  id="status"
                  name="status"
                  type="text"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="mb-4">

                <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="client">
                    Client
                    </label>
                    <input
                    id="client"
                    name="client"
                    type="text"
                    value={formData.client}
                    onChange={handleChange}
                    className="shadow appearance-none border bg-green-50 rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
            </div>
            </div>

          <div className="flex  justify-between mx-auto">
            <button
              type="submit"
              className="bg-black hover:bg-gray-700 mx-auto text-white font-bold py-2 px-12 rounded-xl focus:outline-none focus:shadow-outline"
            >
              Update
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
