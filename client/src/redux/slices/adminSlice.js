import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Get admin stats
export const getAdminStats = createAsyncThunk(
  'admin/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

// Get admin analytics
export const getAdminAnalytics = createAsyncThunk(
  'admin/getAnalytics',
  async (period = 'week', { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch analytics');
    }
  }
);

// Get all users
export const getUsers = createAsyncThunk(
  'admin/getUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/users', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

// Get single user
export const getUser = createAsyncThunk(
  'admin/getUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Update user
export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, ...userData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update user');
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`/api/admin/users/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
    }
  }
);

// Get admin interviews
export const getAdminInterviews = createAsyncThunk(
  'admin/getAdminInterviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/admin/interviews', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch interviews');
    }
  }
);

const initialState = {
  stats: null,
  analytics: null,
  users: [],
  user: null,
  interviews: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    pages: 1,
    total: 0,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Stats
      .addCase(getAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.data;
      })
      .addCase(getAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Analytics
      .addCase(getAdminAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload.data;
      })
      .addCase(getAdminAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Users
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User
      .addCase(getUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update user in the users array
        const index = state.users.findIndex(u => u._id === action.payload.data.id);
        if (index !== -1) {
          state.users[index] = { ...state.users[index], ...action.payload.data };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u._id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Admin Interviews
      .addCase(getAdminInterviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminInterviews.fulfilled, (state, action) => {
        state.loading = false;
        state.interviews = action.payload.data;
        state.pagination = {
          page: action.payload.page,
          pages: action.payload.pages,
          total: action.payload.total,
        };
      })
      .addCase(getAdminInterviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearUser } = adminSlice.actions;
export default adminSlice.reducer;
