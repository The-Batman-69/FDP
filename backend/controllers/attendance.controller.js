const ExcelJS = require('exceljs');
const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');

const markAttendance = async (req, res) => {
  const { fdpId, date, sessionName, rows } = req.body;
  const ops = rows.map((row) => ({
    updateOne: {
      filter: {
        fdp: fdpId,
        participant: row.participantId,
        date: new Date(date),
        sessionName
      },
      update: {
        status: row.status,
        markedBy: req.user._id
      },
      upsert: true
    }
  }));

  await Attendance.bulkWrite(ops);
  res.json({ message: 'Attendance saved' });
};

const getAttendance = async (req, res) => {
  const attendance = await Attendance.find({ fdp: req.params.fdpId })
    .populate('participant', 'name email department')
    .sort({ date: -1 });

  const approvedParticipants = await Registration.find({ fdp: req.params.fdpId, status: 'approved' })
    .populate('participant', 'name email department');

  res.json({ attendance, approvedParticipants });
};

const exportAttendance = async (req, res) => {
  const attendance = await Attendance.find({ fdp: req.params.fdpId }).populate('participant', 'name email department');
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Attendance');

  ws.columns = [
    { header: 'Participant', key: 'name', width: 25 },
    { header: 'Email', key: 'email', width: 30 },
    { header: 'Department', key: 'department', width: 20 },
    { header: 'Date', key: 'date', width: 18 },
    { header: 'Session', key: 'sessionName', width: 20 },
    { header: 'Status', key: 'status', width: 12 }
  ];

  attendance.forEach((row) => {
    ws.addRow({
      name: row.participant.name,
      email: row.participant.email,
      department: row.participant.department,
      date: new Date(row.date).toISOString().slice(0, 10),
      sessionName: row.sessionName,
      status: row.status
    });
  });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=attendance.xlsx');
  await wb.xlsx.write(res);
  res.end();
};

module.exports = { markAttendance, getAttendance, exportAttendance };
