import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         enum: ["INFT", "CMPN", "EXCS", "EXTC", "BIOM"],
         required: [true, "Department name is required"],
         unique: true,
      },

      hodUserId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: [true, "HOD is required for the department"],
      },
   },
   { timestamps: true }
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
