import apiResponse from '../utils/apiResponse.js';
import apiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Quiz } from '../models/quiz.model.js';
import { QuizResponse } from '../models/qyuzRes.js';

const cratequiz = asyncHandler(async (req, res) => {
    const { courseId, questions } = req.body;
    // console.log("Incoming quiz body:", req.body);

    if (!courseId || !questions || !Array.isArray(questions) || questions.length === 0) {
        throw new apiError(400, "courseId and questions are required");
    }

    const quiz = await Quiz.create({
        course: courseId,
        questions: questions  
    });

    return res.status(200).json(
        new apiResponse(200, quiz, "Quiz created successfully")
    );
});

const getAllquiz = asyncHandler(async (req, res) => {
  const quiz = await Quiz.find().populate({
    path: 'course',
    select: 'title teacherId', 
  });

  return res.status(200).json(
    new apiResponse(200, quiz, 'Quiz fetched successfully')
  );
});

export const submitQuizResponse = asyncHandler(async (req, res) => {
  const { quizId, answers } = req.body;
  const studentId = req.user._id;

  if (!quizId || !answers) {
    throw new apiError(400, "Quiz ID and answers are required");
  }

  const quiz = await Quiz.findById(quizId);
  if (!quiz) {
    throw new apiError(404, "Quiz not found");
  }

  let score = 0;
  const processedAnswers = quiz.questions.map((q, index) => {
    const studentAnswer = answers.find((a) => a.questionIndex === index);
    const isCorrect = studentAnswer?.selectedOption === q.answer;
    if (isCorrect) score++;

    return {
      questionIndex: index,
      selectedOption: studentAnswer?.selectedOption || null,
      correctAnswer: q.answer,
      isCorrect,
    };
  });

  const response = await QuizResponse.create({
    quiz: quizId,
    student: studentId,
    answers: processedAnswers,
    score,
  });

  res.status(200).json(new apiResponse(200, response, "Quiz submitted successfully"));
});


const getquizbyId = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    if (!quizId) {
        throw new apiError(400, 'quizId is required');
    }

    const quiz = await Quiz.findById(quizId).populate('course', 'title');

    if (!quiz) {
        throw new apiError(404, 'Quiz not found');
    }

    return res.status(200).json(
        new apiResponse(200, quiz, 'Quiz fetched successfully')
    );
});

const deleteQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    if (!quizId) {
        throw new apiError(400, 'quizId is required');
    }

    const quiz = await Quiz.findByIdAndDelete(quizId);

    if (!quiz) {
        throw new apiError(404, 'Quiz not found');
    }

    return res.status(200).json(
        new apiResponse(200, quiz, 'Quiz deleted successfully')
    );
});

export {
    cratequiz,
    getAllquiz,
    getquizbyId,
    deleteQuiz
};
