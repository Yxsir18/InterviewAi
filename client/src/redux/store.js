import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import interviewReducer from './slices/interviewSlice';
import profileReducer from './slices/profileSlice';
import adminReducer from './slices/adminSlice';
import settingsReducer from './slices/settingsSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    interview: interviewReducer,
    profile: profileReducer,
    admin: adminReducer,
    settings: settingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export default store;
