const Bookmark = require('../models/Bookmark');
const Question = require('../models/Question');

// @desc    Get all bookmarks
// @route   GET /api/bookmark
// @access  Private
exports.getBookmarks = async (req, res, next) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('question')
      .populate('interview')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookmarks.length,
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create bookmark
// @route   POST /api/bookmark
// @access  Private
exports.createBookmark = async (req, res, next) => {
  try {
    const { questionId, notes, category, difficulty } = req.body;

    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found',
      });
    }

    // Check if already bookmarked
    const existingBookmark = await Bookmark.findOne({
      user: req.user._id,
      question: questionId,
    });

    if (existingBookmark) {
      return res.status(400).json({
        success: false,
        message: 'Question already bookmarked',
      });
    }

    const bookmark = await Bookmark.create({
      user: req.user._id,
      question: questionId,
      questionText: question.question,
      interview: question.interview,
      notes,
      category: category || question.category,
      difficulty: difficulty || question.difficulty,
    });

    res.status(201).json({
      success: true,
      message: 'Bookmark created successfully',
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update bookmark
// @route   PUT /api/bookmark/:id
// @access  Private
exports.updateBookmark = async (req, res, next) => {
  try {
    const { notes } = req.body;

    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    if (notes !== undefined) bookmark.notes = notes;

    await bookmark.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark updated successfully',
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete bookmark
// @route   DELETE /api/bookmark/:id
// @access  Private
exports.deleteBookmark = async (req, res, next) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: 'Bookmark not found',
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Bookmark deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
