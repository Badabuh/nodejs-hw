import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import { logger } from './middleware/logger.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import helmet from 'helmet';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import { errors } from 'celebrate';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ credentials: true, origin: true }));
app.use(logger);
app.use(helmet());
app.use(authRouter);
app.use(notesRouter);
app.use(userRouter);
app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

await connectMongoDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
