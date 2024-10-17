import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setAudioPlayer, setIsPlaying } from '../features/spotifySlice';

const Player = () => {
  const dispatch = useDispatch();
  const { currentTrack, isPlaying, audioPlayer } = useSelector(state => state.spotify);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      dispatch(setAudioPlayer(audioRef.current));
    }
  }, [dispatch]);

  useEffect(() => { 
    if (audioPlayer && currentTrack) {
      audioPlayer.src = currentTrack.preview_url;
      if (isPlaying) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    }
  }, [currentTrack, isPlaying, audioPlayer]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioPlayer.pause();
    } else {
      audioPlayer.play();
    }
    dispatch(setIsPlaying(!isPlaying));
  };

  return (
    <div>
      <audio ref={audioRef} />
      <button onClick={handlePlayPause}>{isPlaying ? 'Pauza' : 'Ijro'}</button>
      {currentTrack && <p>Hozir ijro etilmoqda: {currentTrack.name}</p>}
    </div>
  );
};

export default Player;
