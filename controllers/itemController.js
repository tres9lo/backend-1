const dbconfig = require("../db/dbconfig");
const itemModel = require("../models/itemModel");
const LostDocument = require("../models/LostDocument");
const nodemailer = require("nodemailer");


// Post a Found Item
exports.postFoundItem = async (req, res) => {
  try {
    const { type, owner, code, location, user_id } = req.body;
    if (!type || !owner || !code || !location || !user_id) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    let imagePath = req.file ? req.file.path : null;

    const newItem = await itemModel.create({
      type,
      owner,
      code,
      image: imagePath,
      location,
      user_id,
    });

    res.status(201).json({ status: "success", message: "Item added successfully", data: newItem });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Get All Found Items
exports.getFoundItems = async (req, res) => {
  try {
    const items = await itemModel.find();
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Get a Specific Found Item
exports.getFoundItem = async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });

    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Update a Found Item
exports.updateFoundItem = async (req, res) => {
  try {
    const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });

    res.status(200).json({ status: "success", message: "Item updated successfully", data: item });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Delete a Found Item
exports.deleteFoundItem = async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ status: "failed", message: "Item not found" });
    }

    await itemModel.deleteOne({ _id: req.params.id });
    res.status(200).json({ status: "success", message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Post a Lost Item
exports.postLostItem = async (req, res) => {
  try {
    const { type, ownernames, code, location, user_id } = req.body;
    if (!type || !ownernames || !location || !code || !user_id) {
      return res.status(400).json({ status: "failed", message: "All fields are required" });
    }

    const newLostItem = await itemModel.create({
      type,
      ownernames,
      code,
      location,
      user_id,
    });

    res.status(201).json({ status: "success", message: "Item added successfully", data: newLostItem });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Get Lost Items by User ID
exports.getLostItems = async (req, res) => {
  try {
    const items = await itemModel.find({ user_id: req.params.user_id });
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Get a Specific Lost Item
exports.getLostItem = async (req, res) => {
  try {
    const item = await itemModel.findById(req.params.id);
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });

    res.status(200).json({ status: "success", data: item });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Update a Lost Item
exports.updateLostItem = async (req, res) => {
  try {
    const item = await itemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ status: "failed", message: "Item not found" });

    res.status(200).json({ status: "success", message: "Item updated successfully", data: item });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
  }
};

// Claim & Notify Finder
exports.notifyFinder = async (req, res) => {
  try {
    const { documentId, claimerId, claimerEmail } = req.body;

    // Find the lost document
    const document = await LostDocument.findById(documentId);
    if (!document) return res.status(404).json({ status: "failed", message: "Document not found" });

    if (document.status === "claimed")
      return res.status(400).json({ status: "failed", message: "Document already claimed" });

    if (!document.foundByEmail)
      return res.status(400).json({ status: "failed", message: "No contact for the finder" });

    // Update the document status
    document.claimerId = claimerId;
    document.status = "claimed";
    await document.save();

    // Send email to the person who found it
    await sendEmailNotification(document.foundByEmail, document, claimerEmail);

    res.json({ status: "success", message: "Claim request sent", document });
  } catch (error) {
    res.status(500).json({ status: "failed", message: error.message });
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
