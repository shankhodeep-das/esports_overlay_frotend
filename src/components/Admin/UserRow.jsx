import React from 'react';

// Ensure you are destructuring { user, onAction } in the arguments
const UserRow = ({ user, onAction }) => {
    // If user is undefined, don't render anything to avoid a crash
    if (!user) return null;

    return (
        <tr className="border-b border-gray-700 hover:bg-gray-800 transition">
            <td className="p-4 text-white font-medium">
                {/* Check your console: is it 'user.name' or 'user.username'? */}
                {user.name || "No Name"} 
            </td>
            <td className="p-4 text-gray-400">
                {user.email || "No Email"}
            </td>
            <td className="p-4 text-right">
                <button 
                    onClick={() => onAction(user._id, 'APPROVED')}
                    className="bg-green-600 hover:bg-green-300 text-white px-3 py-1 rounded mr-2 text-sm transition-transform active:scale-95"
                >
                    Approve
                </button>
                <button 
                    onClick={() => onAction(user._id, 'REJECTED')}
                    className="bg-red-600 hover:bg-red-300 text-white px-3 py-1 rounded text-sm transition-transform active:scale-95"
                >
                    Reject
                </button>
            </td>
        </tr>
    );
};

export default UserRow;