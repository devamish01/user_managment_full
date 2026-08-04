import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorMiddleware, notFoundMiddleware } from '@/shared/middlewares/index.js';
import routes from '@/routes/index.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/v1", routes);
app.set("etag", false);
app.use(notFoundMiddleware);
app.use(errorMiddleware);
export default app; 