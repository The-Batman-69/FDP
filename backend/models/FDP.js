const mongoose = require('mongoose');

const fdpSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    mode: { type: String, enum: ['online', 'offline', 'hybrid'], required: true },
    resourcePersons: [{ type: String }],
    maxParticipants: { type: Number, required: true, min: 1 },
    bannerImage: { type: String, default: '' },
    brochure: { type: String, default: '' },
    coordinators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
    organizer: { type: String, default: 'FDP Cell' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FDP', fdpSchema);
