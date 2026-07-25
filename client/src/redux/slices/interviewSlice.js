import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  currentInterview: null,
  questions: [],
  currentQuestionIndex: 0,
  answers: [],
  interviewHistory: [],
  currentReport: null,
  loading: false,
  error: null,
};

// Start interview
export const startInterview = createAsyncThunk(
  'interview/startInterview',
  async (interviewData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/interview/start', interviewData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to start interview');
    }
  }
);

// Submit answer
export const submitAnswer = createAsyncThunk(
  'interview/submitAnswer',
  async (answerData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/interview/answer', answerData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to submit answer');
    }
  }
);

// End interview
export const endInterview = createAsyncThunk(
  'interview/endInterview',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/interview/end', { interviewId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to end interview');
    }
  }
);

// Get interview history
export const getInterviewHistory = createAsyncThunk(
  'interview/getInterviewHistory',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/interview/history', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get interview history');
    }
  }
);

// Get interview report
export const getInterviewReport = createAsyncThunk(
  'interview/getInterviewReport',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/interview/report/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get interview report');
    }
  }
);

// Retake interview
export const retakeInterview = createAsyncThunk(
  'interview/retakeInterview',
  async (interviewId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/interview/retake/${interviewId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to retake interview');
    }
  }
);

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload;
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload);
    },
    clearCurrentInterview: (state) => {
      state.currentInterview = null;
      state.questions = [];
      state.currentQuestionIndex = 0;
      state.answers = [];
    },
    clearCurrentReport: (state) => {
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Start Interview
      .addCase(startInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload.data.interview;
        state.questions = action.payload.data.questions;
        state.currentQuestionIndex = 0;
        state.answers = [];
      })
      .addCase(startInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Submit Answer
      .addCase(submitAnswer.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitAnswer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuestionIndex = action.payload.data.currentQuestionIndex;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // End Interview
      .addCase(endInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(endInterview.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(endInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Interview History
      .addCase(getInterviewHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInterviewHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.interviewHistory = action.payload.data;
      })
      .addCase(getInterviewHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Interview Report
      .addCase(getInterviewReport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInterviewReport.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data;
      })
      .addCase(getInterviewReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Retake Interview
      .addCase(retakeInterview.pending, (state) => {
        state.loading = true;
      })
      .addCase(retakeInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInterview = action.payload.data.interview;
        state.questions = action.payload.data.questions;
        state.currentQuestionIndex = 0;
        state.answers = [];
      })
      .addCase(retakeInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentQuestionIndex, addAnswer, clearCurrentInterview, clearCurrentReport } = interviewSlice.actions;
export default interviewSlice.reducer;
