import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  company: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  message: {
    type: String,
  },
});

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;