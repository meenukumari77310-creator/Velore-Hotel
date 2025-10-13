// controllers/contactController.js
import ContactMessage from "../../models/contactMessage.js";
import { sendMail } from "../../config/sendMail.js";

export const contact = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const htmlContent = `
    <h3>New Contact Form Submission</h3>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Message:</strong><br>${message}</p>
  `;

  try {
    await sendMail({
      to: process.env.EMAIL,
      subject: "New Contact Message from Website",
      html: htmlContent,
    });

    await ContactMessage.create({ name, email, message });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message." });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const replyToMessage = async (req, res) => {
  const { id } = req.params;
  const { replyMessage } = req.body;

  try {
    const message = await ContactMessage.findById(id);
    if (!message) return res.status(404).json({ error: "Message not found" });

    // Send reply
    await sendMail({
      to: message.email,
      subject: "Reply from Restaurant",
      html: `<p>${replyMessage}</p>`,
    });

    message.replied = true;
    message.replyMessage = replyMessage;
    message.repliedAt = new Date();
    await message.save();

    res.status(200).json({ message: "Reply sent successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to send reply" });
  }
};

export const deleteMessage = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await ContactMessage.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete message" });
  }
};
