import mongoose from "mongoose";

// Schema for individual question
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [String],
    required: true
  },
  answer: {
    type: String,
    required: true
  }
});

// Schema for the full quiz
const QuizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' model stores teachers
      required: true
    },
    questions: {
      type: [QuestionSchema],
      required: true
    },
    totalMarks: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Quiz = mongoose.model("Quiz", QuizSchema);
