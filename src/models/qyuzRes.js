import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema({
  questionIndex: Number,
  selectedOption: String,
  correctAnswer: String,
  isCorrect: Boolean,
});

const QuizResponseSchema = new mongoose.Schema({
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [AnswerSchema],
  score: {
    type: Number,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

export const QuizResponse = mongoose.model('QuizResponse', QuizResponseSchema);
