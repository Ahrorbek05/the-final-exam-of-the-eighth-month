import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Pause, Heart, Clock } from 'lucide-react';
import { setCurrentTrack, setIsPlaying, toggleLike, toggleLikeAlbum } from '../features/spotifySlice';
import MusicControlPanel from '../components/MusicControlPanel';

export default function LikedContent() {
  const { likedSongs, likedAlbums, currentTrack, isPlaying } = useSelector((state) => state.spotify);
  const dispatch = useDispatch();

  const handlePlayPause = (track) => {
    if (currentTrack?.id === track.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    }
  };

  const handleLike = (song) => {
    dispatch(toggleLike(song));
  };

  const handleLikeAlbum = (album) => {
    dispatch(toggleLikeAlbum(album));
  };

  return (
    <div className="bg-gradient-to-b from-[#535353] to-[#121212] min-h-screen text-white p-8 pb-24">
      <h1 className="text-4xl font-bold mb-6">Likes songs</h1>
      
      <h2 className="text-2xl font-bold mb-4">songs</h2>
      <div className="w-full mb-8">
        <table className="w-full table-auto text-gray-200 text-sm">
          <thead>
            <tr className="border-b border-gray-600/40 text-gray-400 select-none">
              <th className="text-left pb-2 w-12">#</th>
              <th className="text-left pb-2">TITLE</th>
              <th className="text-left pb-2">ALBUM</th>
              <th className="text-right pb-2 pr-8">
                <Clock size={16} />
              </th>
            </tr>
          </thead>
          <tbody>
            {likedSongs.map((song, index) => (
              <tr 
                key={song.id} 
                className="hover:bg-white/10 group rounded-md transition-colors"
              >
                <td className="py-3 w-12">
                  <button onClick={() => handlePlayPause(song)} className="invisible group-hover:visible">
                    {currentTrack?.id === song.id && isPlaying ? 
                      <Pause size={16} className="text-[#1ed760]" /> : 
                      <Play size={16} />
                    }
                  </button>
                  <span className={`visible group-hover:invisible ${currentTrack?.id === song.id && isPlaying ? 'text-[#1ed760]' : ''}`}>{index + 1}</span>
                </td>
                <td>
                  <div className="flex items-center gap-3">
                    <img 
                      src={song.album.images[0].url}
                      alt={song.name} 
                      className="w-10 h-10"
                    />
                    <div>
                      <div className="text-white font-normal">{song.name}</div>
                      <div className="text-gray-400">{song.artists.map(a => a.name).join(', ')}</div>
                    </div>
                  </div>
                </td>
                <td className="text-gray-400">{song.album.name}</td>
                <td className="text-gray-400 text-right pr-8">
                  <button onClick={() => handleLike(song)} className="mr-4 invisible group-hover:visible">
                    <Heart size={16} fill="#1ed760" stroke="#1ed760" />
                  </button>
                  {formatDuration(song.duration_ms)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4">ALBUMS</h2>
      <div className="grid grid-cols-5 gap-4">
        {likedAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} handleLikeAlbum={handleLikeAlbum} handlePlayPause={handlePlayPause} />
        ))}
      </div>

      <MusicControlPanel />
    </div>
  );
}

const AlbumCard = ({ album, handleLikeAlbum, handlePlayPause }) => {
  const { currentTrack, isPlaying } = useSelector((state) => state.spotify);

  return (
    <div className="bg-[#181818] p-4 rounded-md cursor-pointer hover:bg-[#282828] transition-all duration-200 group">
      <div className="relative mb-4">
        <img src={album.images[0]?.url || `/api/placeholder/160/160`} alt={album.name} className="w-full aspect-square object-cover rounded-md shadow-lg" />
        <button 
          onClick={() => handlePlayPause(album)} 
          className="absolute bottom-2 right-2 bg-green-500 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
        >
          {currentTrack?.id === album.id && isPlaying ? (
            <Pause fill="black" size={24} />
          ) : (
            <Play fill="black" size={24} />
          )}
        </button>
      </div>
      <h3 className="font-semibold mb-1 truncate">{album.name}</h3>
      <p className="text-sm text-gray-400 truncate">{album.artists.map(a => a.name).join(', ')}</p>
      <button 
        onClick={() => handleLikeAlbum(album)}
        className="mt-2 text-gray-400 hover:text-white"
      >
        <Heart fill="#1ed760" stroke="#1ed760" size={20} />
      </button>
    </div>
  );
};

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
