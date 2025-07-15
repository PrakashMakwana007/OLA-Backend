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
const originaluse = app.use;
// ✅ Serve static files from Vite build
app.use(express.static(path.join(__dirname, '../../../ONL_APP/dist')));

app.use = function (...args) {
  if (typeof args[0] === 'string') {
    console.log('[DEBUG app.use path]:', args[0]);
  }
  return originaluse.apply(this, args);
};

const allowedOrigins = [
  'http://localhost:5173',
  "https://ola-frontend-doo7pc1sg-makwana-prakashs-projects.vercel.app/",
  "https://ola-frontend-git-main-makwana-prakashs-projects.vercel.app/",
  "https://ola-frontend-dun.vercel.app/",
  'https://ola-frontend-dun.vercel.app/'
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

// ✅ API Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/course', courseRouter); 
app.use('/api/v1/quiz', quizRouter);
app.use('/api/v1/enrolment', EnrolmentRouter);

// ✅ Error Handler
app.use(errorHandler);

// ✅ Fallback route for React Router (MUST BE LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../../ONL_APP/dist/index.html'));
});

export default app;
