const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const { createCriteria, assignCriteriaToFaculty, getCriterias, getMyCriterias, bulkUpsertCriteria, assignByNames, getCriteriaWithAssignments } = require('../controllers/criteriaController');

const router = express.Router();

router.route('/').post(protect, admin, createCriteria).get(protect, admin, getCriterias);
router.route('/assign').put(protect, admin, assignCriteriaToFaculty);
router.route('/bulk-upsert').post(protect, admin, bulkUpsertCriteria);
router.route('/assign-by-names').put(protect, admin, assignByNames);
router.route('/with-assignments').get(protect, admin, getCriteriaWithAssignments);
router.route('/mine').get(protect, getMyCriterias);

module.exports = router;
