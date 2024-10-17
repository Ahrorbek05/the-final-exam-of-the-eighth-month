import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const CLIENT_ID = '69413d5b9145425f98d6b51ae8c5ad13';
const CLIENT_SECRET = '4cb9962877f9402785a83163ca9ae05c';

const basicAuth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);

export const fetchAccessToken = createAsyncThunk('spotify/fetchAccessToken', async () => {
  const response = await axios.post('https://accounts.spotify.com/api/token', 
    'grant_type=client_credentials', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
    }
  );
  return response.data.access_token;
});
  

export const fetchLikedSongs = createAsyncThunk('spotify/fetchLikedSongs', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.items;
});

export const fetchChillMix = createAsyncThunk('spotify/fetchChillMix', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFHOzuVTgTizF/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchPopMix = createAsyncThunk('spotify/fetchPopMix', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFQ00XGBls6ym/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchIndieMix = createAsyncThunk('spotify/fetchIndieMix', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchDailyMix = createAsyncThunk('spotify/fetchDailyMix', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchDailyMix2 = createAsyncThunk('spotify/fetchDailyMix2', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchRockMix = createAsyncThunk('spotify/fetchRockMix', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFLVaM30PMBm4/playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data.playlists.items;
});

export const fetchPlaylist = createAsyncThunk(
  'spotify/fetchPlaylist',
  async ({ accessToken, id }, { rejectWithValue }) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error('Playlist olishda xatolik yuz berdi');
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeaturedPlaylists = createAsyncThunk('spotify/fetchFeaturedPlaylists', async (accessToken) => {
  const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      limit: 20,
      country: 'UZ', 
    },
  });
  return response.data.playlists.items;
});

const loadLikedSongsFromStorage = () => {
  const storedLikedSongs = localStorage.getItem('likedSongs');
  return storedLikedSongs ? JSON.parse(storedLikedSongs) : [];
};

const initialState = {
  chillMix: [],
  popMix: [],
  indieMix: [],
  DailyMix: [],
  DailyMix2: [],
  RockMix: [],
  playlist: {},
  accessToken: null,
  loading: false,
  error: null,
  currentPlaylist: null,
  currentTrack: null,
  isPlaying: false,
  likedSongs: loadLikedSongsFromStorage(),
  featuredPlaylists: [],
  audioPlayer: null,
  likedAlbums: [],
  shuffle: false,
  repeat: false,
  volume: 50,
  progress: 0,
};

export const setCurrentPlaylist = createAsyncThunk(
  'spotify/setCurrentPlaylist',
  async (playlist) => {
    return playlist;
  }
);

export const togglePlay = createAsyncThunk(
  'spotify/togglePlay',
  async (_, { getState }) => {
    const { isPlaying } = getState().spotify;
    return !isPlaying;
  }
);

export const toggleLike = createAsyncThunk(
  'spotify/toggleLike',
  async (song, { getState }) => {
    const { likedSongs } = getState().spotify;

    const isLiked = likedSongs.some(s => s.id === song.id);
    const updatedLikedSongs = isLiked 
      ? likedSongs.filter(s => s.id !== song.id) 
      : [...likedSongs, song];

    // Save to localStorage
    localStorage.setItem('likedSongs', JSON.stringify(updatedLikedSongs));

    return updatedLikedSongs;
  }
);

export const playTrack = createAsyncThunk(
  'spotify/playTrack',
  async (track, { dispatch, getState }) => {
    const { accessToken } = getState().spotify;
    try {
      await axios.put(
        `https://api.spotify.com/v1/me/player/play`,
        { uris: [track.uri] },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      dispatch(setCurrentTrack(track));
      dispatch(setIsPlaying(true));
    } catch (error) {
      console.error('Qo\'shiqni ijro etishda xatolik:', error);
      throw error;
    }
  }
);

export const playNextTrack = createAsyncThunk(
  'spotify/playNextTrack',
  async (_, { getState, dispatch }) => {
    const { currentTrack, currentPlaylist } = getState().spotify;
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
      if (currentIndex < currentPlaylist.length - 1) {
        const nextTrack = currentPlaylist[currentIndex + 1];
        dispatch(setCurrentTrack(nextTrack));
        dispatch(setIsPlaying(true));
      }
    }
  }
);

export const playPreviousTrack = createAsyncThunk(
  'spotify/playPreviousTrack',
  async (_, { getState, dispatch }) => {
    const { currentTrack, currentPlaylist } = getState().spotify;
    if (currentPlaylist && currentTrack) {
      const currentIndex = currentPlaylist.findIndex(track => track.id === currentTrack.id);
      if (currentIndex > 0) {
        const previousTrack = currentPlaylist[currentIndex - 1];
        dispatch(setCurrentTrack(previousTrack));
        dispatch(setIsPlaying(true));
      }
    }
  }
);

const spotifySlice = createSlice({
  name: 'spotify',
  initialState,
  reducers: {
    setCurrentTrack: (state, action) => {
      state.currentTrack = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setAudioPlayer: (state, action) => {
      state.audioPlayer = action.payload;
    },
    toggleLikeAlbum: (state, action) => {
      const album = action.payload;
      const index = state.likedAlbums.findIndex(a => a.id === album.id);
      if (index !== -1) {
        state.likedAlbums.splice(index, 1);
      } else {
        state.likedAlbums.push(album);
      }
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      state.repeat = !state.repeat;
    },
    setPlaylist: (state, action) => {
      state.playlist = action.payload;
    },
    resetCurrentPlaylist: (state) => {
      state.currentPlaylist = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAccessToken.fulfilled, (state, action) => {
        state.accessToken = action.payload;
        state.loading = false;
      })
      .addCase(fetchAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPlaylist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPlaylist.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchChillMix.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChillMix.fulfilled, (state, action) => {
        state.chillMix = action.payload;
        state.loading = false;
      })
      .addCase(fetchChillMix.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchPopMix.fulfilled, (state, action) => {
        state.popMix = action.payload;
      })
      .addCase(fetchIndieMix.fulfilled, (state, action) => {
        state.indieMix = action.payload;
      })
      .addCase(fetchDailyMix.fulfilled, (state, action) => {
        state.DailyMix = action.payload;
      })
      .addCase(fetchDailyMix2.fulfilled, (state, action) => {
        state.DailyMix2 = action.payload;
      })
      .addCase(fetchRockMix.fulfilled, (state, action) => {
        state.RockMix = action.payload;
      })
      .addCase(setCurrentPlaylist.fulfilled, (state, action) => {
        state.currentPlaylist = action.payload;
      })
      .addCase(togglePlay.fulfilled, (state, action) => {
        state.isPlaying = action.payload;
      })
      .addCase(toggleLike.fulfilled, (state, action) => {
        state.likedSongs = action.payload;
      })
      .addCase(fetchFeaturedPlaylists.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedPlaylists.fulfilled, (state, action) => {
        state.featuredPlaylists = action.payload;
        state.loading = false;
      })
      .addCase(fetchFeaturedPlaylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(setCurrentTrack, (state, action) => {
        state.currentTrack = action.payload;
        state.isPlaying = true;
      });
  },
});

export const { 
  setCurrentTrack,
  setIsPlaying,
  setAudioPlayer,
  toggleLikeAlbum,
  setVolume,
  setProgress,
  toggleRepeat,
  toggleShuffle,
  setPlaylist,
  resetCurrentPlaylist,
} = spotifySlice.actions;

export default spotifySlice.reducer;
