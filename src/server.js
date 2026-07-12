import express from 'express';
import 'dotenv/config';
import logger from './middleware/logger.js';
import router from './routes/notesRoutes.js';
import helmet from 'helmet';
import notFoundHandler from './middleware/notFoundHandler.js';
import errorHandler from './middleware/errorHandler.js';
import cors from 'cors';
import connectMongoDB from './db/connectMongoDB.js';

const app = express();

app.use(express.json());
app.use(cors());
app.use(logger);
app.use(helmet());
app.use('/notes', router);
app.use(notFoundHandler);
app.use(errorHandler);

connectMongoDB();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
