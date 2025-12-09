const mongoose = require('mongoose');

const CriteriaSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const Criteria = mongoose.model('Criteria', CriteriaSchema);

module.exports = Criteria;
