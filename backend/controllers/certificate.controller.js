const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Certificate = require('../models/Certificate');
const FDP = require('../models/FDP');
const User = require('../models/User');
const { generateCertificatePDF } = require('../utils/pdfGenerator');
const { sendEmail } = require('../utils/email');

const generateCertificate = async (req, res) => {
  const { fdpId, participantId } = req.body;

  const existing = await Certificate.findOne({ fdp: fdpId, participant: participantId });
  if (existing) return res.json({ certificate: existing });

  const fdp = await FDP.findById(fdpId);
  const participant = await User.findById(participantId);
  if (!fdp || !participant) return res.status(404).json({ message: 'FDP or participant not found' });

  const certificateId = `FDP-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;
  const pdfPath = await generateCertificatePDF({
    participantName: participant.name,
    fdpTitle: fdp.title,
    dates: `${fdp.startDate.toDateString()} - ${fdp.endDate.toDateString()}`,
    organizer: fdp.organizer,
    certificateId
  });

  const certificate = await Certificate.create({
    certificateId,
    participant: participant._id,
    fdp: fdp._id,
    generatedDate: new Date(),
    pdfPath
  });

  await sendEmail({
    to: participant.email,
    subject: `Certificate Issued - ${fdp.title}`,
    html: `<p>Dear ${participant.name}, your certificate is attached.</p>`,
    attachments: [{ filename: path.basename(pdfPath), path: pdfPath }]
  });

  return res.status(201).json({ certificate });
};

const myCertificates = async (req, res) => {
  const certificates = await Certificate.find({ participant: req.user._id }).populate('fdp', 'title startDate endDate');
  return res.json({ certificates });
};

const downloadCertificate = async (req, res) => {
  const cert = await Certificate.findById(req.params.id);
  if (!cert) return res.status(404).json({ message: 'Certificate not found' });

  if (req.user.role === 'participant' && String(cert.participant) !== String(req.user._id)) {
    return res.status(403).json({ message: 'Forbidden: cannot download another participant certificate' });
  }

  return res.download(cert.pdfPath);
};

module.exports = { generateCertificate, myCertificates, downloadCertificate };
