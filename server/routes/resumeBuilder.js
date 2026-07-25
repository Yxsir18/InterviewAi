const express = require('express');
const router = express.Router();
const {
  createResume,
  getResumes,
  getResume,
  updateResume,
  createVersion,
  switchVersion,
  deleteResume,
  generateSummary,
  improveBullets,
  suggestSkills,
  generateProjects,
  improveContent,
  analyzeATS,
  matchJob,
  optimizeForJob,
  setDefaultResume,
  exportPDF,
  exportDOCX,
} = require('../controllers/resumeBuilderController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Resume CRUD
router.route('/')
  .post(createResume)
  .get(getResumes);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

// Version management
router.post('/:id/version', createVersion);
router.put('/:id/version/:version', switchVersion);

// AI features
router.post('/:id/ai/summary', generateSummary);
router.post('/:id/ai/bullets', improveBullets);
router.post('/:id/ai/skills', suggestSkills);
router.post('/:id/ai/projects', generateProjects);
router.post('/:id/ai/improve', improveContent);

// ATS and Job Matching
router.post('/:id/analyze-ats', analyzeATS);
router.post('/:id/match-job', matchJob);
router.post('/:id/optimize-job', optimizeForJob);

// Default Resume
router.put('/:id/set-default', setDefaultResume);

// Export
router.get('/:id/export/pdf', exportPDF);
router.get('/:id/export/docx', exportDOCX);

module.exports = router;
