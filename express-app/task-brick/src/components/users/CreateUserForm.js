import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '../../features/user/userSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateUserForm = () => {
    const tenantId = useSelector((state) => state.auth.user.tenantId);
    const dispatch = useDispatch();

    const [userData, setUserData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: '',
        tenantId: tenantId,
    });

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createUser({ tenantId, userData }));
        toast.success('User created successfully!');
        setUserData({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            role: '',
            tenantId: tenantId,
        });
    };

    return (
        <div className="max-w-xl mx-auto p-6 mt-20 bg-white shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Create New User</h2>
            <form onSubmit={handleSubmit}>
                <div className="w-full ">
                    <label htmlFor="firstName" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">First Name:</label>
                    <textarea
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
                <div className="w-full">
                    <label htmlFor="lastName" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Last Name:</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-6 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-6 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-6 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="role" className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">Role:</label>
                    <select
                        id="role"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-50 rounded py-6 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
                    >
                        <option value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                        <option value="Developer">Developer</option>
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Create User</button>
            </form>
        </div>
    );
};

export default CreateUserForm;
