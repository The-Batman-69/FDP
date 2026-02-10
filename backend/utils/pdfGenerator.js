const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');

const generateCertificatePDF = async ({ participantName, fdpTitle, dates, organizer, certificateId }) => {
  const fileName = `${certificateId}.pdf`;
  const outputDir = path.join(__dirname, '..', 'uploads', 'certificates');
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, fileName);

  const qrDataUrl = await QRCode.toDataURL(`CERT:${certificateId}`);
  const qrBase64 = qrDataUrl.replace(/^data:image\/png;base64,/, '');
  const qrBuffer = Buffer.from(qrBase64, 'base64');

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ layout: 'landscape', size: 'A4', margin: 40 });
    const stream = fs.createWriteStream(outputPath);

    doc.pipe(stream);
    doc.rect(30, 30, 780, 535).lineWidth(3).stroke('#1f2937');
    doc.fontSize(34).fillColor('#1e3a8a').text('Certificate of Completion', { align: 'center' });
    doc.moveDown(1);
    doc.fontSize(18).fillColor('#111827').text('This is to certify that', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(30).fillColor('#0f172a').text(participantName, { align: 'center', underline: true });
    doc.moveDown(0.8);
    doc.fontSize(18).text(`has successfully completed the FDP titled`, { align: 'center' });
    doc.fontSize(24).fillColor('#1d4ed8').text(fdpTitle, { align: 'center' });
    doc.moveDown(0.6);
    doc.fontSize(16).fillColor('#111827').text(`Conducted on ${dates} by ${organizer}`, { align: 'center' });
    doc.moveDown(0.6);
    doc.fontSize(12).fillColor('#374151').text(`Certificate ID: ${certificateId}`, { align: 'center' });
    doc.image(qrBuffer, 680, 420, { width: 110, height: 110 });
    doc.end();

    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
};

module.exports = { generateCertificatePDF };
