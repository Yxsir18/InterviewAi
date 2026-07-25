const mongoose = require('mongoose');

const codingInterviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  language: {
    type: String,
    enum: ['javascript', 'typescript', 'python', 'java', 'cpp', 'go', 'rust', 'csharp', 'php', 'ruby'],
    required: true,
  },
  timeLimit: {
    type: Number, // in minutes
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'abandoned'],
    default: 'pending',
  },
  problem: {
    title: String,
    description: String,
    examples: [{
      input: String,
      output: String,
      explanation: String,
    }],
    constraints: [String],
    starterCode: {
      javascript: String,
      python: String,
      java: String,
      cpp: String,
    },
  },
  submissions: [{
    code: String,
    language: String,
    timestamp: {
      type: Date,
      default: Date.now,
    },
    executionTime: Number, // in milliseconds
    memoryUsage: Number, // in MB
    status: {
      type: String,
      enum: ['pending', 'running', 'success', 'error', 'timeout', 'memory_limit_exceeded'],
      default: 'pending',
    },
    output: String,
    error: String,
    testCasesPassed: Number,
    totalTestCases: Number,
  }],
  currentSubmission: {
    code: String,
    language: String,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  timeTaken: {
    type: Number, // in seconds
  },
  review: {
    overallScore: Number,
    correctness: Number,
    readability: Number,
    timeComplexity: Number,
    spaceComplexity: Number,
    bestPractices: Number,
    feedback: String,
    strengths: [String],
    weaknesses: [String],
    improvementSuggestions: [String],
    complexityAnalysis: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp
codingInterviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Calculate total time
codingInterviewSchema.methods.calculateTimeTaken = function () {
  if (this.startTime && this.endTime) {
    this.timeTaken = Math.floor((this.endTime - this.startTime) / 1000);
  }
};

// Add submission
codingInterviewSchema.methods.addSubmission = function(submissionData) {
  try {
    console.log('Adding submission with data:', {
      codeLength: submissionData.code?.length,
      language: submissionData.language,
      executionTime: submissionData.executionTime,
      status: submissionData.status,
      testCasesPassed: submissionData.testCasesPassed,
      totalTestCases: submissionData.totalTestCases,
    });

    this.submissions.push({
      ...submissionData,
      timestamp: new Date(),
    });
    this.currentSubmission = {
      code: submissionData.code,
      language: submissionData.language,
    };
    return this.save();
  } catch (error) {
    console.error('Error in addSubmission method:', error);
    throw error;
  }
};

// Get latest submission
codingInterviewSchema.methods.getLatestSubmission = function() {
  return this.submissions[this.submissions.length - 1];
};

module.exports = mongoose.model('CodingInterview', codingInterviewSchema);
