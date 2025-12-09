const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const { createSubmission, getMySubmissions, listSubmissions, listAssignedSubmissions, updateSubmissionStatus } = require('../controllers/submissionController');

const router = express.Router();

// Student creates a submission with multiple files under field name 'files'
router.post('/', protect, upload.array('files', 10), createSubmission);

// Student views own submissions
router.get('/mine', protect, getMySubmissions);

// Admin lists submissions (optionally filter by criteriaCode/status)
router.get('/', protect, admin, listSubmissions);

// Admin updates status
router.put('/:id/status', protect, admin, updateSubmissionStatus);

// Faculty: list submissions for their assigned criteria
router.get('/assigned', protect, listAssignedSubmissions);

module.exports = router;
