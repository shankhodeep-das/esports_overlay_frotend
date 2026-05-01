import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Ensure your backend URL is correct (or use a proxy in package.json)
      const res = await axios.post('https://fxae-backend.onrender.com/auth/signup', formData);

      if (res.status === 200 || res.status === 201) {
        // 1. Update Context so the app knows we are logged in

        // 2. Success Feedback
        alert("Logged In Successfully! 🚀");

        // 3. Redirect to Dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      // This catches the "Email not approved" or "User exists" errors from backend
      alert(err.response?.data?.message || "Signup failed. Try again.");
    }
    
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <button 
                onClick={() => navigate('/')} 
                className="absolute top-8 left-8 text-white flex items-center gap-2 hover:text-green-400 transition-all"
            >
                ← Back to Home
        </button>
      <form onSubmit={handleSubmit} className="bg-[#1a1a1a] p-8 rounded-2xl border border-blue-500/20 w-full max-w-md">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">JOIN THE TEAM</h2>
        
        <input 
          type="email" name="email" placeholder="Email" 
          onChange={handleChange} required
          className="w-full p-3 mb-4 bg-black border border-gray-800 rounded-lg text-white"
        />
        <input 
          type="password" name="password" placeholder="Password" 
          onChange={handleChange} required
          className="w-full p-3 mb-6 bg-black border border-gray-800 rounded-lg text-white"
        />

        <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
          Log in 
        </button>
      </form>
    </div>
  );
};

export default Signup;