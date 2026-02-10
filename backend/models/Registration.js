const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fdp: { type: mongoose.Schema.Types.ObjectId, ref: 'FDP', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    documents: [{ type: String }]
  },
  { timestamps: true }
);

registrationSchema.index({ participant: 1, fdp: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
