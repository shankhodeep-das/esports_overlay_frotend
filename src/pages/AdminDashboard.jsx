import React, { useEffect, useState } from 'react';
import { fetchPendingMembers, updateMemberStatus } from '../api/adminService';
import UserRow from '../components/Admin/UserRow';

const AdminDashboard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const result = await fetchPendingMembers();
            console.log("DEBUG - What is result?", result);

        // THE FIX: Use 'pending_members' as shown in your console screenshot
            if (result && result.pending_members) {
                console.log("Success! Found 4 members.");
                setRequests(result.pending_members);
            } else {
                console.error("Key 'pending_members' not found in response", result);
                setRequests([]);
            }
        } catch (error) {
            console.error("Failed to load members", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAction = async (id, action) => {
        try {
            await updateMemberStatus(id, action);
            // Refresh list after action
            loadData();
        } catch (error) {
            console.error("Action Error:", error.response?.data);
            alert("Action failed: " + (error.response?.data?.message || "Something went wrong"));
        }
    };

    if (loading) return <div className="p-10 text-white text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-3xl font-bold mb-6">Management Requests</h1>
            <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <h1 className='p-3 text-right'>Total Requests: {requests.length}</h1>
                <table className="w-full text-left">
                    <thead className="bg-gray-700 uppercase text-xs text-gray-400">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Email</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests && requests.length > 0 ? (
                            requests.map((user, index) => (
                                 <UserRow key={user._id} user={user} onAction={handleAction} />
                            )) // Fixed: Added the closing parenthesis here
                        ) : (
                            <tr>
                                <td colSpan="3" className="p-10 text-center text-gray-500">
                                    No pending requests.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;