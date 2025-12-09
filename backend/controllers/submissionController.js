const asyncHandler = require('express-async-handler');
const path = require('path');
const StudentSubmission = require('../models/StudentSubmission');
const Criteria = require('../models/Criteria');

// Helper to build artifact objects from uploaded files
function buildArtifactsFromFiles(files) {
  if (!files || files.length === 0) return [];
  return files.map((f) => {
    const ext = path.extname(f.originalname || '').toLowerCase();
    let type = 'document';
    if (['.jpg', '.jpeg', '.png'].includes(ext)) type = 'image';
    else if (['.mp4', '.mov'].includes(ext)) type = 'video';
    else if (['.ppt', '.pptx'].includes(ext)) type = 'slide';
    else if (['.pdf', '.doc', '.docx', '.xls', '.xlsx'].includes(ext)) type = 'document';
    return { type, name: f.originalname, url: `/uploads/${path.basename(f.path)}` };
  });
}

// @desc Create a new student submission
// @route POST /api/submissions
// @access Private (student)
const createSubmission = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  let {
    criteriaCode,
    title,
    description,
    courseCode,
    semester,
    tags,
    dateFrom,
    dateTo,
    metadata,
    score,
    artifacts: artifactsFromBody,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('title is required');
  }

  let criteria = null;
  if (criteriaCode) {
    criteria = await Criteria.findOne({ code: criteriaCode });
    if (!criteria) {
      res.status(404);
      throw new Error('Criteria not found');
    }
  }

  const uploadArtifacts = buildArtifactsFromFiles(req.files);
  let bodyArtifacts = [];
  try {
    if (artifactsFromBody) {
      const parsed = typeof artifactsFromBody === 'string' ? JSON.parse(artifactsFromBody) : artifactsFromBody;
      if (Array.isArray(parsed)) {
        bodyArtifacts = parsed.filter(a => a && a.type && a.url && a.name);
      }
    }
  } catch (_) {}

  // Normalize metadata to object and capture simple scalar fields like score
  let metaObj = {};
  try {
    if (metadata) metaObj = typeof metadata === 'string' ? JSON.parse(metadata) : metadata;
  } catch (_) {}
  if (score !== undefined && score !== null && score !== '') {
    metaObj.score = isNaN(Number(score)) ? score : Number(score);
  }

  const submission = await StudentSubmission.create({
    student: studentId,
    criteria: criteria ? criteria._id : undefined,
    criteriaCode: criteriaCode || undefined,
    title,
    description,
    courseCode,
    semester,
    tags,
    dateFrom,
    dateTo,
    metadata: metaObj,
    artifacts: [...uploadArtifacts, ...bodyArtifacts],
  });

  res.status(201).json(submission);
});

// @desc Get my submissions (student)
// @route GET /api/submissions/mine
// @access Private (student)
const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await StudentSubmission.find({ student: req.user._id })
    .populate('criteria', 'code name')
    .sort({ createdAt: -1 });
  res.json(submissions);
});

// @desc List submissions by criteria (admin/evaluator)
// @route GET /api/submissions
// @access Private (admin/evaluator)
const listSubmissions = asyncHandler(async (req, res) => {
  const { criteriaCode, status } = req.query;
  const filter = {};
  if (criteriaCode) filter.criteriaCode = criteriaCode;
  if (status) filter.verificationStatus = status;

  const submissions = await StudentSubmission.find(filter)
    .populate('student', 'name email')
    .populate('criteria', 'code name')
    .sort({ createdAt: -1 });
  res.json(submissions);
});

// @desc List submissions for criteria assigned to the logged-in faculty
// @route GET /api/submissions/assigned
// @access Private (faculty)
const listAssignedSubmissions = asyncHandler(async (req, res) => {
  if (!req.user || req.user.role !== 'faculty') {
    res.status(403);
    throw new Error('Forbidden');
  }
  const assigned = Array.isArray(req.user.assignedCriteria) ? req.user.assignedCriteria : [];
  if (assigned.length === 0) return res.json([]);

  const submissions = await StudentSubmission.find({ criteria: { $in: assigned } })
    .populate('student', 'name email')
    .populate('criteria', 'code name')
    .sort({ createdAt: -1 });
  res.json(submissions);
});

// @desc Update submission status (approve/reject)
// @route PUT /api/submissions/:id/status
// @access Private (admin/evaluator)
const updateSubmissionStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, reviewerComment } = req.body;
  if (!['approved', 'rejected', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }
  const sub = await StudentSubmission.findById(id);
  if (!sub) {
    res.status(404);
    throw new Error('Submission not found');
  }
  sub.verificationStatus = status;
  sub.reviewerComment = reviewerComment || '';
  sub.reviewedBy = req.user._id;
  sub.reviewedAt = new Date();
  await sub.save();
  res.json(sub);
});

module.exports = { createSubmission, getMySubmissions, listSubmissions, listAssignedSubmissions, updateSubmissionStatus };
