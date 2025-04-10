// src/pages/Profile.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUser } from '../contexts/UserContext';

const Profile = () => {
  const { currentUser: authUser, isAuthenticated } = useAuth();
  const { userProfile, getFullName, updateProfile } = useUser();
  const [activeTab, setActiveTab] = useState('account');

  // Use combined data from both contexts
  const user = {
    username: authUser?.username || '',
    email: authUser?.email || '',
    role: authUser?.role || '',
    fullName: getFullName(),
    ...userProfile
  };

  return (

<div className="min-h-screen bg-[#454545] text-white flex items-center justify-center px-4 py-8">
  <div className="w-full max-w-3xl bg-[#525252] shadow-lg rounded-xl p-8">
    {/* Account Information */}
    <section className="mb-10">
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">
        Account Information
      </h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Username</label>
          <input
            type="text"
            value={user.username}
            disabled
            className="mt-1 w-full p-2 rounded border border-gray-600 bg-[#3b3b3b] text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="mt-1 w-full p-2 rounded border border-gray-600 bg-[#3b3b3b] text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300">Role</label>
          <input
            type="text"
            value={user.role?.toLowerCase()}
            disabled
            className="mt-1 w-full p-2 rounded border border-gray-600 bg-[#3b3b3b] text-white"
          />
        </div>
      </form>
    </section>

    {/* Order History */}
    <section>
      <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">
        Order History
      </h2>
      <div className="bg-[#3b3b3b] p-6 rounded border border-gray-600 text-center">
        <p className="text-gray-300">You haven't placed any orders yet.</p>
      </div>
    </section>
  </div>
</div>

  );
};

export default Profile;