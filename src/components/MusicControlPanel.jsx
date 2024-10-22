import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setIsPlaying, playNextTrack, playPreviousTrack, setProgress } from '../features/spotifySlice';
import { SkipBack, SkipForward, Play, Pause, Volume2, Volume1, VolumeX } from 'lucide-react';
// import { Slider } from "@/components/ui/slider";

const MusicControlPanel = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, audioSrc } = useSelector((state) => state.spotify);
  const audioRef = useRef(null);
  const [volume, setVolume] = React.useState(50);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);

  useEffect(() => {
    if (currentTrack && currentTrack.preview_url) {
      audioRef.current.src = currentTrack.preview_url;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [currentTrack, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const handlePlayPause = () => {
    dispatch(setIsPlaying(!isPlaying));
  };

  const handleNextTrack = () => {
    dispatch(playNextTrack());
  };

  const handlePreviousTrack = () => {
    dispatch(playPreviousTrack());
  };

  const handleTimeUpdate = () => {
    const progress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setCurrentTime(audioRef.current.currentTime);
    dispatch(setProgress(progress));
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (newValue) => {
    const time = (newValue[0] / 100) * duration;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 50) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-900 to-zinc-800 border-t border-zinc-700">
      <div className="max-w-screen-xl mx-auto px-4 py-3">
        <audio
          ref={audioRef}
          onEnded={handleNextTrack}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        />
        {currentTrack && (
          <div className="flex items-center justify-between gap-4">
            {/* Track Info */}
            <div className="flex items-center min-w-[180px] max-w-[300px]">
              <div className="relative w-14 h-14 rounded-md overflow-hidden">
                <img 
                  src={currentTrack.album.images[0].url} 
                  alt={currentTrack.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="ml-3 overflow-hidden">
                <p className="text-white font-medium truncate">{currentTrack.name}</p>
                <p className="text-zinc-400 text-sm truncate">
                  {currentTrack.artists.map(artist => artist.name).join(', ')}
                </p>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center justify-center gap-6 mb-2">
                <button 
                  onClick={handlePreviousTrack}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <SkipBack size={24} />
                </button>
                <button 
                  onClick={handlePlayPause}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white text-black hover:scale-105 transition"
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button 
                  onClick={handleNextTrack}
                  className="text-zinc-400 hover:text-white transition"
                >
                  <SkipForward size={24} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                {/* <Slider
                  value={[currentTime ? (currentTime / duration) * 100 : 0]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={1}
                  className="w-full"
                /> */}
                <span className="text-xs text-zinc-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-2 min-w-[150px]">
              <button className="text-zinc-400 hover:text-white transition">
                {getVolumeIcon()}
              </button>
              {/* <Slider
                value={[volume]}
                onValueChange={(newValue) => setVolume(newValue[0])}
                max={100}
                step={1}
                className="w-24"
              /> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MusicControlPanel;