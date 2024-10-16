import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const FriendActivity = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

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
      
      {loading ? (
        <SkeletonFriendList />
      ) : (
        [1, 2, 3].map((friend) => (
          <FriendItem key={friend} />
        ))
      )}
      
      <div className="mt-auto pt-4">
        <button className="w-full py-2 px-4 rounded-full border border-gray-400 text-sm font-bold hover:scale-105 transition-transform">
          Settings
        </button>
      </div>
    </div>
  );
};

const SkeletonFriendList = () => (
  <>
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center space-x-2 mb-4">
        <div className="w-10 h-10 rounded-full bg-gray-700 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-1/2 mb-1 animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse" />
        </div>
      </div>
    ))}
  </>
);

const FriendItem = () => (
  <div className="flex items-center space-x-2 mb-4">
    <img src="https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png" alt="Friend" className="w-10 h-10 rounded-full" />
    <div>
      <p className="text-sm font-semibold">Friend Name</p>
      <p className="text-xs text-gray-400">Song Name • Artist</p>
      <p className="text-xs text-gray-400">Album</p>
    </div>
  </div>
);

export default FriendActivity;
