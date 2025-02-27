import mongoose from "mongoose";

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number },
  status: { type: String, default: "active" },
});

export default mongoose.model("Contact", ContactSchema);
