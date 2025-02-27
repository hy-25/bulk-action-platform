import mongoose from "mongoose";

const BulkActionSchema = new mongoose.Schema({
  entity: { type: String, required: true }, // "Contact"
  action: { type: String, required: true }, // "Update"
  status: { type: String, default: "Pending" }, // Pending, In Progress, Completed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("BulkAction", BulkActionSchema);
