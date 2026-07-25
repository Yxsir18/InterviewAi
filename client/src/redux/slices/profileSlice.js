import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  profile: null,
  resumes: [],
  bookmarks: [],
  notes: [],
  loading: false,
  error: null,
};

// Get profile
export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get profile');
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/profile', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profile');
    }
  }
);

// Upload avatar
export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/profile/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update auth user with new avatar
      const { setUser } = await import('./authSlice');
      dispatch(setUser({ avatar: response.data.data.avatar }));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload avatar');
    }
  }
);

// Get resumes
export const getResumes = createAsyncThunk(
  'profile/getResumes',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/resume');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get resumes');
    }
  }
);

// Upload resume
export const uploadResume = createAsyncThunk(
  'profile/uploadResume',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to upload resume');
    }
  }
);

// Delete resume
export const deleteResume = createAsyncThunk(
  'profile/deleteResume',
  async (resumeId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/resume/${resumeId}`);
      return resumeId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete resume');
    }
  }
);

// Get bookmarks
export const getBookmarks = createAsyncThunk(
  'profile/getBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/bookmark');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get bookmarks');
    }
  }
);

// Create bookmark
export const createBookmark = createAsyncThunk(
  'profile/createBookmark',
  async (bookmarkData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/bookmark', bookmarkData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bookmark');
    }
  }
);

// Delete bookmark
export const deleteBookmark = createAsyncThunk(
  'profile/deleteBookmark',
  async (bookmarkId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/bookmark/${bookmarkId}`);
      return bookmarkId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bookmark');
    }
  }
);

// Get notes
export const getNotes = createAsyncThunk(
  'profile/getNotes',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/notes', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get notes');
    }
  }
);

// Create note
export const createNote = createAsyncThunk(
  'profile/createNote',
  async (noteData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/notes', noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create note');
    }
  }
);

// Update note
export const updateNote = createAsyncThunk(
  'profile/updateNote',
  async ({ noteId, noteData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/notes/${noteId}`, noteData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update note');
    }
  }
);

// Delete note
export const deleteNote = createAsyncThunk(
  'profile/deleteNote',
  async (noteId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/notes/${noteId}`);
      return noteId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete note');
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Avatar
      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadAvatar.fulfilled, (state, action) => {
        state.loading = false;
        if (state.profile) {
          state.profile.user.avatar = action.payload.data.avatar;
        }
      })
      .addCase(uploadAvatar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Resumes
      .addCase(getResumes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.data;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Upload Resume
      .addCase(uploadResume.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.push(action.payload.data);
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Resume
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.resumes = state.resumes.filter((resume) => resume._id !== action.payload);
      })
      // Get Bookmarks
      .addCase(getBookmarks.pending, (state) => {
        state.loading = true;
      })
      .addCase(getBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload.data;
      })
      .addCase(getBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Bookmark
      .addCase(createBookmark.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBookmark.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks.push(action.payload.data);
      })
      .addCase(createBookmark.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Bookmark
      .addCase(deleteBookmark.fulfilled, (state, action) => {
        state.bookmarks = state.bookmarks.filter((bookmark) => bookmark._id !== action.payload);
      })
      // Get Notes
      .addCase(getNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload.data;
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Note
      .addCase(createNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.loading = false;
        state.notes.push(action.payload.data);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Note
      .addCase(updateNote.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.notes.findIndex((note) => note._id === action.payload.data._id);
        if (index !== -1) {
          state.notes[index] = action.payload.data;
        }
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Note
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter((note) => note._id !== action.payload);
      });
  },
});

export const { clearError } = profileSlice.actions;
export default profileSlice.reducer;
