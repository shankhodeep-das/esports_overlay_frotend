import React, { useState } from 'react';
import { requestAccess } from '../api/authService';
import { useNavigate } from 'react-router-dom';

const RequestAccess = () => {
    const navigate = useNavigate();
    // Local state for the form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '' // Optional: Include if you want them to set a password now
    });

    // State for UI feedback
    const [status, setStatus] = useState({ type: '', message: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await requestAccess(formData);
            setStatus({ 
                type: 'success', 
                message: response.message || "Request sent! Please wait for admin approval." 
            });
            // Clear form on success
            setFormData({ name: '', email: '', password: '' });
        } catch (error) {
            setStatus({ 
                type: 'error', 
                message: error.response?.data?.message || "Something went wrong. Try again." 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4">
            <button 
                onClick={() => navigate('/')} 
                className="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-green-400 transition-all"
            >
                ← Back to Home
            </button>
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-white">Join Management</h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Submit your details to request access to the tournament portal.
                    </p>
                </div>

                <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Alpha"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="alpha@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="block w-full px-4 py-3 mt-1 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-blue-500 focus:border-blue-500"
                            placeholder="xxxxxxxx"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3 px-4 font-bold text-white rounded-lg transition duration-200 ${
                            loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Sending...' : 'Request Access'}
                    </button>
                </form>

                {status.message && (
                    <div className={`mt-4 p-3 rounded-lg text-center text-sm font-medium ${
                        status.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                    }`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RequestAccess;