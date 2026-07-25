import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Load user from localStorage
const loadUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem('user');
    const storedAuth = localStorage.getItem('isAuthenticated');
    const storedVerified = localStorage.getItem('isEmailVerified');
    return {
      user: storedUser ? JSON.parse(storedUser) : null,
      isAuthenticated: storedAuth === 'true',
      isEmailVerified: storedVerified === 'true',
    };
  } catch (error) {
    return {
      user: null,
      isAuthenticated: false,
      isEmailVerified: false,
    };
  }
};

const initialState = {
  user: loadUserFromStorage().user,
  isAuthenticated: loadUserFromStorage().isAuthenticated,
  loading: false,
  error: null,
  isEmailVerified: loadUserFromStorage().isEmailVerified,
};

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/login', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post('/api/auth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/auth/me');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user');
    }
  }
);

// Verify email
export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Email verification failed');
    }
  }
);

// Forgot password
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send reset email');
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, otp, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/auth/reset-password', { email, otp, password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed');
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await axios.put('/api/auth/update-password', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Password update failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify({ ...state.user, ...action.payload }));
      localStorage.setItem('isAuthenticated', 'true');
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isEmailVerified = false;
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('isEmailVerified');
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.data.user.isEmailVerified;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isEmailVerified', action.payload.data.user.isEmailVerified);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.data.user.isEmailVerified;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isEmailVerified', action.payload.data.user.isEmailVerified);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isEmailVerified = false;
        localStorage.removeItem('user');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isEmailVerified');
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Me
      .addCase(getMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.isEmailVerified = action.payload.data.user.isEmailVerified;
        localStorage.setItem('user', JSON.stringify(action.payload.data.user));
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('isEmailVerified', action.payload.data.user.isEmailVerified);
      })
      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
        state.isEmailVerified = true;
        localStorage.setItem('isEmailVerified', 'true');
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
