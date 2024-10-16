import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Home, Search, Library, PlusSquare, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchAccessToken, fetchChillMix, fetchPopMix, fetchIndieMix, fetchDailyMix, fetchDailyMix2, fetchRockMix } from '../features/spotifySlice';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, chillMix, popMix, indieMix, DailyMix, DailyMix2, RockMix, loading, error } = useSelector(state => state.spotify);

  useEffect(() => {
    if (!accessToken) {
      dispatch(fetchAccessToken());
    } else {
      dispatch(fetchChillMix(accessToken));
      dispatch(fetchPopMix(accessToken));
      dispatch(fetchIndieMix(accessToken));
      dispatch(fetchDailyMix(accessToken));
      dispatch(fetchDailyMix2(accessToken));
      dispatch(fetchRockMix(accessToken));
    }
  }, [dispatch, accessToken]);

  const handleItemClick = (item) => {
    navigate(`/${item.toLowerCase().replace(' ', '-')}`);
  };

  const handlePlaylistClick = (playlist) => {
    navigate(`/playlist/${playlist.id}`);
  };


  const playlists = [...chillMix, ...popMix, ...indieMix, ...DailyMix, ...DailyMix2, ...RockMix];

  return (
    <div className="w-72 h-screen bg-black text-gray-300 p-6 overflow-y-auto">
      <div className="space-y-6">
        <div className="space-y-4">
          <SidebarItem
            icon={<Home />}
            text="Home"
            onClick={() => handleItemClick('')}
          />
          <SidebarItem
            icon={<Search />}
            text="Search"
            onClick={() => handleItemClick('Search')}
          />
          <SidebarItem
            icon={<Library />}
            text="Your Library"
            onClick={() => handleItemClick('Library')}
          />
        </div>

        <div className="space-y-4 pt-6">
          <SidebarItem
            icon={<PlusSquare />}
            text="Create Playlist"
            onClick={() => handleItemClick('Create Playlist')}
          />
          <SidebarItem
            icon={<Heart />}
            text="Liked Songs"
            onClick={() => handleItemClick('Likes')}
          />
        </div>

        <div className="border-t border-gray-700 pt-6">
          {playlists.map((playlist) => (
            <PlaylistItem 
              key={playlist.id} 
              text={playlist.name} 
              onClick={() => handlePlaylistClick(playlist)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, text, onClick }) => (
  <div
    className="flex items-center space-x-4 cursor-pointer hover:text-white"
    onClick={onClick} 
  >
    {icon}
    <span className="font-medium">{text}</span>
  </div>
);

const PlaylistItem = ({ text, onClick }) => (
  <div className="py-1 hover:text-white cursor-pointer" onClick={onClick}>
    <span className="text-sm">{text}</span>
  </div>
);

export default Sidebar;