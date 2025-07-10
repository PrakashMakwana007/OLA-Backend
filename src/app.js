import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/coures.route.js'; 
import quizRouter from './routes/quiz.route.js';
import EnrolmentRouter from './routes/enrolment.route.js';
import errorHandler from './middlewares/error.mideel.js';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();


app.use(express.static(path.join(__dirname, '../../../ONL_APP/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../ONL_APP/dist/index.html'));
});

// CORS Setup
const allowedOrigins = [
  'http://localhost:5173',
  'https://ola-frontend-dun.vercel.app',
  "https://ola-frontend-dun.vercel.app/"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("CORS not allowed for this origin"));
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

//  API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter); 
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/enrolment', EnrolmentRouter);

//  Error Handler
app.use(errorHandler);

export default app;
