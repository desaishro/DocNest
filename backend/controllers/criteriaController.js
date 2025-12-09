const asyncHandler = require('express-async-handler');
const Criteria = require('../models/Criteria');
const User = require('../models/User');

// @desc    Create new criteria
// @route   POST /api/criteria
// @access  Private/Admin
const createCriteria = asyncHandler(async (req, res) => {
  const { code, name, description } = req.body;

  if (!code || !name) {
    res.status(400);
    throw new Error('Both code and name are required');
  }

  const criteriaExists = await Criteria.findOne({ $or: [{ code }, { name }] });

  if (criteriaExists) {
    res.status(400);
    throw new Error('Criteria with the same code or name already exists');
  }

  const criteria = await Criteria.create({
    code,
    name,
    description,
  });

  if (criteria) {
    res.status(201).json(criteria);
  } else {
    res.status(400);
    throw new Error('Invalid criteria data');
  }
});

// @desc    Get all criteria
// @route   GET /api/criteria
// @access  Private/Admin
const getCriterias = asyncHandler(async (req, res) => {
  const criterias = await Criteria.find({});
  res.json(criterias);
});

// @desc    Get criteria assigned to the logged-in faculty
// @route   GET /api/criteria/mine
// @access  Private/Faculty
const getMyCriterias = asyncHandler(async (req, res) => {
  const user = req.user;
  if (!user) {
    res.status(401);
    throw new Error('Not authorized');
  }
  if (!Array.isArray(user.assignedCriteria) || user.assignedCriteria.length === 0) {
    return res.json([]);
  }
  const criterias = await Criteria.find({ _id: { $in: user.assignedCriteria } });
  res.json(criterias);
});

// @desc    Assign criteria to faculty
// @route   PUT /api/criteria/assign
// @access  Private/Admin
const assignCriteriaToFaculty = asyncHandler(async (req, res) => {
  const { facultyId, criteriaId } = req.body;

  const faculty = await User.findById(facultyId);
  const criteria = await Criteria.findById(criteriaId);

  if (!faculty || faculty.role !== 'faculty') {
    res.status(404);
    throw new Error('Faculty not found');
  }

  if (!criteria) {
    res.status(404);
    throw new Error('Criteria not found');
  }

  // Assuming faculty model has a 'assignedCriteria' array field
  // For simplicity, let's add a new field to the User model called assignedCriteria
  if (!faculty.assignedCriteria) {
    faculty.assignedCriteria = [];
  }

  if (faculty.assignedCriteria.includes(criteriaId)) {
    res.status(400);
    throw new Error('Criteria already assigned to this faculty');
  }

  faculty.assignedCriteria.push(criteriaId);
  await faculty.save();

  res.json({ message: 'Criteria assigned to faculty successfully' });
});

// @desc    Bulk upsert criteria list (e.g., P.1..P.28)
// @route   POST /api/criteria/bulk-upsert
// @access  Private/Admin
const bulkUpsertCriteria = asyncHandler(async (req, res) => {
  const { items } = req.body; // [{ code, name, description }]
  if (!Array.isArray(items) || items.length === 0) {
    res.status(400);
    throw new Error('items array is required');
  }

  const ops = items.map((it) => ({
    updateOne: {
      filter: { code: it.code },
      update: { $set: { code: it.code, name: it.name, description: it.description || '' } },
      upsert: true,
    },
  }));

  const result = await Criteria.bulkWrite(ops, { ordered: false });
  res.json({ message: 'Bulk upsert completed', result });
});

// @desc    Assign criteria by criteria code to multiple faculty by names
// @route   PUT /api/criteria/assign-by-names
// @access  Private/Admin
const assignByNames = asyncHandler(async (req, res) => {
  const { criteriaCode, facultyNames } = req.body; // names must match User.name
  if (!criteriaCode || !Array.isArray(facultyNames)) {
    res.status(400);
    throw new Error('criteriaCode and facultyNames[] are required');
  }

  const criteria = await Criteria.findOne({ code: criteriaCode });
  if (!criteria) {
    res.status(404);
    throw new Error('Criteria not found');
  }

  const faculties = await User.find({ name: { $in: facultyNames }, role: 'faculty' });
  const foundNames = new Set(faculties.map((f) => f.name));
  const missing = facultyNames.filter((n) => !foundNames.has(n));

  for (const f of faculties) {
    if (!Array.isArray(f.assignedCriteria)) f.assignedCriteria = [];
    const already = f.assignedCriteria.some((id) => id.toString() === criteria._id.toString());
    if (!already) {
      f.assignedCriteria.push(criteria._id);
      await f.save();
    }
  }

  res.json({ message: 'Assignments processed', assignedCount: faculties.length, missing });
});

// @desc    Get criteria with assigned faculty
// @route   GET /api/criteria/with-assignments
// @access  Private/Admin
const getCriteriaWithAssignments = asyncHandler(async (req, res) => {
  const criterias = await Criteria.find({}).lean();
  const users = await User.find({ role: 'faculty' }).select('name email assignedCriteria').lean();

  const byId = new Map(criterias.map((c) => [c._id.toString(), { ...c, faculty: [] }]));
  for (const u of users) {
    if (Array.isArray(u.assignedCriteria)) {
      for (const cid of u.assignedCriteria) {
        const bucket = byId.get(cid.toString());
        if (bucket) {
          bucket.faculty.push({ _id: u._id, name: u.name, email: u.email });
        }
      }
    }
  }

  res.json(Array.from(byId.values()));
});

module.exports = { createCriteria, assignCriteriaToFaculty, getCriterias, getMyCriterias, bulkUpsertCriteria, assignByNames, getCriteriaWithAssignments };
