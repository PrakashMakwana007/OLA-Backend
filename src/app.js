import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.route.js';
import courseRouter from './routes/coures.route.js'; 
import quizRouter from './routes/quiz.route.js';
import  EnrolmentRouter  from './routes/enrolment.route.js';
import errorHandler from './middlewares/error.mideel.js';
import path from 'path';
const app = express(); 

app.use(cors({
  origin: [
    'http://localhost:5173',//local
    'https://ola-frontend-dun.vercel.app'// vercel app
  ],
  credentials: true
}));

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter); 
app.use('/api/v1/quiz' ,quizRouter )
app.use('/api/v1/enrolment',EnrolmentRouter)


app.use(errorHandler)
export default app;