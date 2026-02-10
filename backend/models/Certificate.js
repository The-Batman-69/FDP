const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    certificateId: { type: String, required: true, unique: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fdp: { type: mongoose.Schema.Types.ObjectId, ref: 'FDP', required: true },
    generatedDate: { type: Date, default: Date.now },
    pdfPath: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Certificate', certificateSchema);
