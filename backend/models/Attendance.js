const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    fdp: { type: mongoose.Schema.Types.ObjectId, ref: 'FDP', required: true },
    participant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    sessionName: { type: String, required: true },
    status: { type: String, enum: ['present', 'absent'], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  { timestamps: true }
);

attendanceSchema.index({ fdp: 1, participant: 1, date: 1, sessionName: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
