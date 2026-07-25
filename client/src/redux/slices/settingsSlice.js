import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  settings: {
    notifications: {
      email: true,
      push: false,
      interviewReminders: true,
      weeklyReports: true,
    },
    privacy: {
      profileVisibility: 'public',
      showInterviewHistory: true,
      showCertificates: true,
    },
    theme: 'dark',
  },
  loading: false,
  error: null,
};

// Get settings
export const getSettings = createAsyncThunk(
  'settings/getSettings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/settings');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get settings');
    }
  }
);

// Update settings
export const updateSettings = createAsyncThunk(
  'settings/updateSettings',
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings', settingsData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  'settings/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/settings/password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update password');
    }
  }
);

// Delete account
export const deleteAccount = createAsyncThunk(
  'settings/deleteAccount',
  async (password, { rejectWithValue }) => {
    try {
      const response = await axios.delete('/api/settings/account', {
        data: { password },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete account');
    }
  }
);

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.settings.theme = action.payload;
      // Persist to localStorage
      localStorage.setItem('theme', action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get settings
      .addCase(getSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = { ...state.settings, ...action.payload };
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTheme, clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
