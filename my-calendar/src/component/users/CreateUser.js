import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const CreateUser = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: ''
    });
    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await dispatch(registerUser({ ...formData})).unwrap();
            toast.success('User created successfully');
            navigate('/dashboard/users');
        } catch (error) {
            toast.error(error.message || 'Failed to create user');
        }
    };
    return (
        <div className="container mx-auto px-4 sm:px-8 max-w-7xl">
            <div className="py-8">
                <div className="flex flex-row mb-1 sm:mb-0 justify-between w-full bg-white p-4 ">
                    <h2 className="text-2xl leading-tight font-bold">Create New User</h2>
                </div>
                <div className="mt-5 md:mt-0 md:col-span-2">
                    <form onSubmit={handleSubmit}>
                        <div className="shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 bg-white sm:p-6">
                                <div className="grid grid-cols-6 gap-6">
                                    {/* Form fields */}
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 ml-2">First Name</label>
                                        <input type="text" name="firstName" id="first_name" autoComplete="given-name"
                                            className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                                            value={formData.firstName} onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 ml-2">Last Name</label>
                                        <input type="text" name="lastName" id="last_name" autoComplete="family-name"
                                            className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                                            value={formData.lastName} onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="email_address" className="block text-sm font-medium text-gray-700 ml-2">Email address</label>
                                        <input type="email" name="email" id="email_address" autoComplete="email"
                                            className="mt-1 p-4 py-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                                            value={formData.email} onChange={handleChange}
                                        />
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-2">Password</label>
                                        <input type="password" name="password" id="password" autoComplete="new-password"
                                            className="mt-1 py-4 p-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300"
                                            value={formData.password} onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                                    Save
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateUser;
