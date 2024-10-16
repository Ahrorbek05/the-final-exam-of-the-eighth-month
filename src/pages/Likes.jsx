import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Play, Heart, Clock } from 'lucide-react';
import { setCurrentTrack, setIsPlaying, toggleLikeAlbum } from '../features/spotifySlice';

export default function LikedContent() {
  const { likedSongs, likedAlbums } = useSelector((state) => state.spotify);
  const dispatch = useDispatch();

  return (
    <div className="bg-gradient-to-b from-[#535353] to-[#121212] min-h-screen text-white p-8">
      <h1 className="text-4xl font-bold mb-6">Yoqtirgan kontentingiz</h1>
      
      <h2 className="text-2xl font-bold mb-4">Qo'shiqlar</h2>
      <div className="w-full mb-8">
        <table className="w-full table-auto text-gray-200 text-sm">
          <thead>
            <tr className="border-b border-gray-600/40 text-gray-400 select-none">
              <th className="text-left pb-2 w-12">#</th>
              <th className="text-left pb-2">SARLAVHA</th>
              <th className="text-left pb-2">ALBOM</th>
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
                <td className="py-3 w-12">{index + 1}</td>
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
                <td className="text-gray-400 text-right pr-8">{formatDuration(song.duration_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="text-2xl font-bold mb-4">Albomlar</h2>
      <div className="grid grid-cols-5 gap-4">
        {likedAlbums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </div>
    </div>
  );
}

const AlbumCard = ({ album }) => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.spotify);

  const handlePlayPause = (e) => {
    e.stopPropagation();
    if (currentTrack?.id === album.id) {
      dispatch(setIsPlaying(!isPlaying));
    } else {
      dispatch(setCurrentTrack(album));
      dispatch(setIsPlaying(true));
    }
  };

  const handleLike = (e) => {
    e.stopPropagation();
    dispatch(toggleLikeAlbum(album));
  };

  return (
    <div className="bg-[#181818] p-4 rounded-md cursor-pointer hover:bg-[#282828] transition-all duration-200 group">
      <div className="relative mb-4">
        <img src={album.images[0]?.url || `/api/placeholder/160/160`} alt={album.name} className="w-full aspect-square object-cover rounded-md shadow-lg" />
        <button 
          onClick={handlePlayPause} 
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
        onClick={handleLike}
        className="mt-2 text-gray-400 hover:text-white"
      >
        <Heart fill="red" stroke="red" size={20} />
      </button>
    </div>
  );
};

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}
