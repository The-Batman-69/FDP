const FDP = require('../models/FDP');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');
const Certificate = require('../models/Certificate');

const adminAnalytics = async (_req, res) => {
  const [totalFDPs, activeFDPs, totalParticipants, certificatesIssued] = await Promise.all([
    FDP.countDocuments(),
    FDP.countDocuments({ status: 'active' }),
    Registration.countDocuments({ status: 'approved' }),
    Certificate.countDocuments()
  ]);

  const participationTrend = await Registration.aggregate([
    { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { month: '$_id', count: 1, _id: 0 } }
  ]);

  const attendancePercentage = await Attendance.aggregate([
    {
      $group: {
        _id: '$fdp',
        present: { $sum: { $cond: [{ $eq: ['$status', 'present'] }, 1, 0] } },
        total: { $sum: 1 }
      }
    },
    {
      $project: {
        fdp: '$_id',
        percentage: {
          $multiply: [{ $divide: ['$present', { $max: ['$total', 1] }] }, 100]
        }
      }
    }
  ]);

  const departmentParticipation = await Registration.aggregate([
    { $match: { status: 'approved' } },
    {
      $lookup: {
        from: 'users',
        localField: 'participant',
        foreignField: '_id',
        as: 'participant'
      }
    },
    { $unwind: '$participant' },
    { $group: { _id: '$participant.department', count: { $sum: 1 } } },
    { $project: { department: { $ifNull: ['$_id', 'Unknown'] }, count: 1, _id: 0 } }
  ]);

  res.json({
    metrics: { totalFDPs, activeFDPs, totalParticipants, certificatesIssued },
    participationTrend,
    attendancePercentage,
    departmentParticipation
  });
};

const facultyAnalytics = async (req, res) => {
  const fdps = await FDP.find({ coordinators: req.user._id });
  const fdpIds = fdps.map((f) => f._id);

  const attendanceStats = await Attendance.aggregate([
    { $match: { fdp: { $in: fdpIds } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  const completionProgress = fdps.map((fdp) => {
    const totalDays = Math.ceil((fdp.endDate - fdp.startDate) / (1000 * 60 * 60 * 24)) + 1;
    const daysCompleted = Math.max(0, Math.ceil((Date.now() - fdp.startDate) / (1000 * 60 * 60 * 24)));
    return {
      fdpId: fdp._id,
      title: fdp.title,
      progress: Math.min(100, Math.round((daysCompleted / Math.max(totalDays, 1)) * 100))
    };
  });

  res.json({ assignedFDPs: fdps, attendanceStats, completionProgress });
};

const participantAnalytics = async (req, res) => {
  const registrations = await Registration.find({ participant: req.user._id }).populate('fdp', 'title startDate endDate');
  const certificates = await Certificate.find({ participant: req.user._id });

  const stats = {
    totalRegistered: registrations.length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    pending: registrations.filter((r) => r.status === 'pending').length,
    certificates: certificates.length
  };

  const timeline = registrations.map((r) => ({
    title: r.fdp?.title || 'FDP',
    status: r.status,
    createdAt: r.createdAt
  }));

  res.json({ stats, timeline });
};

module.exports = { adminAnalytics, facultyAnalytics, participantAnalytics };
