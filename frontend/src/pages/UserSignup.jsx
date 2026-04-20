import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const UserSignup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();
    const { backendUrl } = useContext(ShopContext);
    const { setToken } = useContext(AuthContext);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(backendUrl + '/api/user/register', { name, email, password });
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem('token', response.data.token);
                toast.success("Account created successfully!");
                navigate('/');
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh] px-4 sm:px-6 py-10 sm:py-0">
            <form onSubmit={onSubmitHandler} className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)]">
                <div className="text-center mb-8">
                    <div className='inline-flex gap-2 items-center mb-5 '>
                        <p className='text-2xl sm:text-3xl text-gray-600'>Create <span className='text-gray-900 font-medium'>Account</span></p>
                    </div>
                    <p className="text-gray-400 text-sm">Join us today. Please enter your details.</p>
                </div>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                            type="text"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="Enter your name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="Enter your email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                            placeholder="Create a password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button className="w-full bg-black text-white font-medium py-3 rounded-lg mt-4 hover:bg-gray-800 transition-colors duration-300 active:scale-[0.98]">
                        Sign Up
                    </button>
                </div>

                <p className="text-center text-gray-600 text-sm mt-8">
                    Already have an account? <Link to="/userlogin" className="text-black font-semibold hover:underline">Sign in</Link>
                </p>
            </form>
        </div>
    );
};

export default UserSignup;