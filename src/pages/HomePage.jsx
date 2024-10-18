import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight, Bell, User, Play, Pause, Heart, Loader } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  fetchAccessToken, 
  fetchChillMix, 
  fetchPopMix, 
  fetchIndieMix, 
  fetchDailyMix, 
  fetchDailyMix2, 
  fetchRockMix, 
  setCurrentPlaylist, 
  setCurrentTrack, 
  setIsPlaying,
  toggleLike,
  fetchFeaturedPlaylists,
  toggleLikeAlbum,
  fetchPlaylist
} from '../features/spotifySlice';
import MusicControlPanel from '../components/MusicControlPanel';

const MusicLoader = () => (
  <div className="flex items-center justify-center h-screen bg-black">
    <div className="flex space-x-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="w-3 h-8 bg-green-500 rounded-full animate-pulse"
          style={{ animationDelay: `${i * 0.15}s` }}
        ></div>
      ))}
    </div>
  </div>
);

const HomePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { 
    accessToken, 
    chillMix, 
    popMix, 
    indieMix, 
    DailyMix, 
    DailyMix2, 
    RockMix, 
    loading, 
    error, 
    currentTrack, 
    isPlaying,
    likedSongs,
    featuredPlaylists 
  } = useSelector((state) => state.spotify);
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch(fetchAccessToken());
  }, [dispatch]);

  useEffect(() => {
    if (accessToken) {
      const fetchData = async () => {
        await Promise.all([
          dispatch(fetchChillMix(accessToken)),
          dispatch(fetchPopMix(accessToken)),
          dispatch(fetchIndieMix(accessToken)),
          dispatch(fetchDailyMix(accessToken)),
          dispatch(fetchDailyMix2(accessToken)),
          dispatch(fetchRockMix(accessToken)),
          dispatch(fetchFeaturedPlaylists(accessToken))
        ]);
      };
      fetchData();
    }
  }, [accessToken, dispatch, location.key]);

  useEffect(() => {
    if (isPlaying && currentTrack) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  if (loading) return <MusicLoader />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-gradient-to-b from-indigo-900 to-black text-white p-8 overflow-y-auto h-screen">
      <MainContent 
        chillMix={chillMix} 
        popMix={popMix} 
        indieMix={indieMix} 
        DailyMix={DailyMix} 
        DailyMix2={DailyMix2} 
        RockMix={RockMix} 
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        likedSongs={likedSongs}
      />
      <MusicControlPanel />
      <audio ref={audioRef} src={currentTrack?.preview_url} />
    </div>
  );
};

const MainContent = ({ chillMix, popMix, indieMix, DailyMix, DailyMix2, RockMix }) => (
  <div className="flex-1 overflow-y-auto p-8">
    <TopBar />
    
    <h1 className="text-3xl font-bold mb-6">Good afternoon</h1>
    <div className="grid grid-cols-2 gap-4 mb-8">
      <MixCard title="Chill Mix" playlist={chillMix[0]} />
      <MixCard title="Pop Mix" playlist={popMix[0]} />
      <MixCard title="Indie Mix" playlist={indieMix[0]} />
      <MixCard title="Daily Mix 1" playlist={DailyMix[0]} />
      <MixCard title="Daily Mix 2" playlist={DailyMix2[0]} />
      <MixCard title="Rock Classics" playlist={RockMix[0]} />
    </div>
    <div className=''>
      <PlaylistSection title="Your top mixes" playlists={chillMix.slice(0, 5)} />
      <PlaylistSection title="Made for you" playlists={popMix.slice(0, 5)} />
      <PlaylistSection title="Recently played" playlists={indieMix.slice(0, 5)} />
      <PlaylistSection title="Jump back in" playlists={chillMix.slice(5, 10)} />
      <PlaylistSection title="Uniquely yours" playlists={popMix.slice(5, 10)} />
    </div>
  </div>
);

const TopBar = () => (
  <div className="flex justify-between items-center mb-6">
    <div className="flex space-x-4">
      <button className="bg-black bg-opacity-40 rounded-full p-2"><ChevronLeft size={24} /></button>
      <button className="bg-black bg-opacity-40 rounded-full p-2"><ChevronRight size={24} /></button>
    </div>
    <div className="flex items-center space-x-4">
      <button className="bg-white text-black font-bold py-2 px-4 rounded-full text-sm">UPGRADE</button>
      <button className="bg-black bg-opacity-40 rounded-full p-2"><Bell size={24} /></button>
      <button className="bg-black bg-opacity-40 rounded-full p-2"><User size={24} /></button>
    </div>
  </div>
);

const MixCard = ({ title, playlist }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.spotify);

  const handleClick = () => {
    if (playlist?.id) {
      dispatch(fetchPlaylist({ accessToken, id: playlist.id }))
        .unwrap()
        .then(() => {
          navigate(`/playlist/${playlist.id}`);
        })
        .catch((error) => {
          console.error('Playlist yuklashda xatolik:', error);
        });
    }
  };

  return (
    <div onClick={handleClick} className="bg-white bg-opacity-10 flex items-center rounded-md overflow-hidden cursor-pointer hover:bg-opacity-20 transition-all duration-200">
      <img src={playlist?.images[0]?.url || `/api/placeholder/80/80`} alt={title} className="w-20 h-20 object-cover" />
      <span className="ml-4 font-bold">{playlist?.name || title}</span>
    </div>
  );
};

const PlaylistSection = ({ title, playlists }) => (
  <div>
    <h2 className="text-2xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-5 gap-4">
      {playlists.map((playlist) => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  </div>
);

const PlaylistCard = ({ playlist }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentTrack, isPlaying, likedAlbums, accessToken } = useSelector((state) => state.spotify);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (currentTrack?.id === playlist.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(playlist));
      dispatch(setIsPlaying(true));
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLikeAlbum(playlist));
  };

  const handleClick = () => {
    dispatch(fetchPlaylist({ accessToken, id: playlist.id }));
    navigate(`/playlist/${playlist?.id}`);
  };

  const isLiked = likedAlbums.some(album => album.id === playlist.id);

  return (
    <div onClick={handleClick} className="bg-[#181818] p-4 rounded-md cursor-pointer hover:bg-[#282828] transition-all duration-200 group">
      <div className="relative mb-4">
        <img src={playlist.images[0]?.url || `/api/placeholder/160/160`} alt={playlist.name} className="w-full aspect-square object-cover rounded-md shadow-lg" />
        <button 
          onClick={handlePlayPause} 
          className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
        >
          {currentTrack?.id === playlist.id && isPlaying ? (
            <Pause fill="black" size={24} />
          ) : (
            <Play fill="black" size={24} />
          )}
        </button>
      </div>
      <h3 className="font-semibold mb-1 truncate">{playlist.name}</h3>
      <p className="text-sm text-gray-400 truncate">{playlist.description}</p>
      <button 
        onClick={handleLike}
        className="mt-2 text-gray-400 hover:text-white"
      >
        <Heart fill={isLiked ? "#1ed760" : "none"} stroke={isLiked ? "#1ed760" : "currentColor"} size={20} />
      </button>
    </div>
  );
};

export default HomePage;
