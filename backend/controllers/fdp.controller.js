const FDP = require('../models/FDP');
const Registration = require('../models/Registration');
const { sendEmail } = require('../utils/email');

const createFDP = async (req, res) => {
  try {
    const data = {
      ...req.body,
      resourcePersons: req.body.resourcePersons || [],
      coordinators: req.body.coordinators || []
    };
    if (req.files?.bannerImage?.[0]) data.bannerImage = `/uploads/${req.files.bannerImage[0].filename}`;
    if (req.files?.brochure?.[0]) data.brochure = `/uploads/${req.files.brochure[0].filename}`;

    const fdp = await FDP.create(data);
    return res.status(201).json({ fdp });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const listFDPs = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const fdps = await FDP.find(filter).populate('coordinators', 'name email').sort({ createdAt: -1 });
  res.json({ fdps });
};

const getFDPById = async (req, res) => {
  const fdp = await FDP.findById(req.params.id).populate('coordinators', 'name email');
  if (!fdp) return res.status(404).json({ message: 'FDP not found' });
  return res.json({ fdp });
};

const updateFDP = async (req, res) => {
  const fdp = await FDP.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!fdp) return res.status(404).json({ message: 'FDP not found' });
  return res.json({ fdp });
};

const registerForFDP = async (req, res) => {
  try {
    const fdp = await FDP.findById(req.params.id);
    if (!fdp) return res.status(404).json({ message: 'FDP not found' });

    const approvedCount = await Registration.countDocuments({ fdp: fdp._id, status: 'approved' });
    if (approvedCount >= fdp.maxParticipants) {
      return res.status(400).json({ message: 'FDP participant limit reached' });
    }

    const status = process.env.AUTO_APPROVE_REGISTRATIONS === 'true' ? 'approved' : 'pending';
    const registration = await Registration.create({
      participant: req.user._id,
      fdp: fdp._id,
      status,
      documents: req.files?.map((f) => `/uploads/${f.filename}`) || []
    });

    if (status === 'approved') {
      await FDP.findByIdAndUpdate(fdp._id, { $addToSet: { participants: req.user._id } });
    }

    await sendEmail({
      to: req.user.email,
      subject: `FDP Registration ${status === 'approved' ? 'Approved' : 'Received'}: ${fdp.title}`,
      html: `<p>Dear ${req.user.name}, your registration for <strong>${fdp.title}</strong> is <b>${status}</b>.</p>`
    });

    return res.status(201).json({ registration });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Already registered' });
    return res.status(500).json({ message: error.message });
  }
};

const listRegistrations = async (req, res) => {
  const registrations = await Registration.find({ fdp: req.params.id })
    .populate('participant', 'name email department designation')
    .sort({ createdAt: -1 });
  return res.json({ registrations });
};

const reviewRegistration = async (req, res) => {
  const { status } = req.body;
  const registration = await Registration.findById(req.params.registrationId).populate('participant', 'email name');
  if (!registration) return res.status(404).json({ message: 'Registration not found' });

  registration.status = status;
  await registration.save();

  if (status === 'approved') {
    await FDP.findByIdAndUpdate(registration.fdp, { $addToSet: { participants: registration.participant._id } });
  }

  await sendEmail({
    to: registration.participant.email,
    subject: `FDP Registration ${status}`,
    html: `<p>Hello ${registration.participant.name}, your FDP registration is now <b>${status}</b>.</p>`
  });

  return res.json({ registration });
};

module.exports = {
  createFDP,
  listFDPs,
  getFDPById,
  updateFDP,
  registerForFDP,
  listRegistrations,
  reviewRegistration
};
