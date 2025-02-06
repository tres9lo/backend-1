const Doc = require("../models/doc");

const nodemailer = require("nodemailer");

// Helper function for error handling
const handleError = (res, error) => {
  res.status(500).json({ status: "failed", message: error.message });
};

// Post a Found Item
exports.postFoundItem = async (req, res) => {
  try {
    const { type, owner, code, location, user_id } = req.body;
    if (!type || !owner || !code || !location || !user_id) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const imagePath = req.file ? req.file.path : null;

    const newItem = await Doc.create({ type, owner, code, image: imagePath, location, user_id });
    res.status(201).json({ status: "success", message: "Item added successfully", data: newItem });
  } catch (error) {
    handleError(res, error);
  }
};

// Get All Found Items
exports.getFoundItems = async (_, res) => {
  try {
    const items = await Doc.find();
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    handleError(res, error);
  }
};

// Get a Specific Found Item
exports.getFoundItem = async (req, res) => {
  try {
    const item = await Doc.findById(req.params.id);
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });
    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    handleError(res, error);
  }
};

// Update a Found Item
exports.updateFoundItem = async (req, res) => {
  try {
    const item = await Doc.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });
    res.status(200).json({ status: "success", message: "Item updated successfully", data: item });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete a Found Item
exports.deleteFoundItem = async (req, res) => {
  try {
    const item = await Doc.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });
    res.status(200).json({ status: "success", message: "Item deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Post a Lost Item
exports.postLostItem = async (req, res) => {
  try {
    const { type, ownernames, code, location, user_id } = req.body;
    if (!type || !ownernames || !location || !code || !user_id) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const newLostItem = await Doc.create({ type, ownernames, code, location, user_id });
    res.status(201).json({ status: "success", message: "Lost item added successfully", data: newLostItem });
  } catch (error) {
    handleError(res, error);
  }
};

// Get Lost Items by User ID
exports.getLostItems = async (req, res) => {
  try {
    const items = await Doc.find({ user_id: req.params.user_id });
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    handleError(res, error);
  }
};

// Claim & Notify Finder
exports.notifyFinder = async (req, res) => {
  try {
    const { documentId, claimerId, claimerEmail } = req.body;
    const document = await Doc.findById(documentId);

    if (!document) return res.status(404).json({ status: "failed", message: "Document not found" });
    if (document.status === "claimed") return res.status(400).json({ status: "failed", message: "Document already claimed" });
    if (!document.foundByEmail) return res.status(400).json({ status: "failed", message: "No contact for the finder" });

    document.claimerId = claimerId;
    document.status = "claimed";
    await document.save();

    await sendEmailNotification(document.foundByEmail, document, claimerEmail);
    res.json({ status: "success", message: "Claim request sent", document });
  } catch (error) {
    handleError(res, error);
  }
};

// Function to Send Email Notification
const sendEmailNotification = async (finderEmail, document, claimerEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: finderEmail,
    subject: "Someone Claimed a Lost Document",
    text: `Hello,\n\nSomeone is claiming the lost document (${document.type}) with document number: ${document.code}.\n\nContact the claimer at: ${claimerEmail}\n\nRegards, Lost Document System`,
  };

  return transporter.sendMail(mailOptions);
};
