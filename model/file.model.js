import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    filepath: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.models.File || mongoose.model("File", fileSchema);
export default File;
