import mongoose from "mongoose";

const enrolmentSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    enrolDate: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

export const Enrolment = mongoose.model("Enrolment", enrolmentSchema);
