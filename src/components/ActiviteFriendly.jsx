import React from 'react';
import { X } from 'lucide-react';

const FriendActivity = () => {
  return (
    <div className="w-72 bg-black text-gray-300 p-4 h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-bold">Friend Activity</h2>
        <button className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>
      
      <p className="text-xs text-gray-400 mb-4">
        Let friends and followers on Spotify see what you're listening to.
      </p>
      
      {[1, 2, 3].map((friend) => (
        <FriendItem key={friend} />
      ))}
      
      <div className="mt-auto pt-4">
        <button className="w-full py-2 px-4 rounded-full border border-gray-400 text-sm font-bold hover:scale-105 transition-transform">
          Settings
        </button>
      </div>
    </div>
  );
};

const FriendItem = () => (
  <div className="flex items-center space-x-2 mb-4">
    <img src="/api/placeholder/40/40" alt="Friend" className="w-10 h-10 rounded-full" />
    <div>
      <p className="text-sm font-semibold">Friend Name</p>
      <p className="text-xs text-gray-400">Song Name • Artist</p>
      <p className="text-xs text-gray-400">Album</p>
    </div>
  </div>
);

export default FriendActivity;