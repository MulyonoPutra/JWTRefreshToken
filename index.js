/* eslint-disable linebreak-style */
import express from 'express';
import {config} from 'dotenv';
import dbConnect from './src/utility/DbConnect.js';
import authRouter from './src/routes/AuthRouter.js';
import userRouter from './src/routes/UserRouter.js';

const app = express();

config();
dbConnect();

app.use(express.json());

app.use('/v1', authRouter);
app.use('/v1', userRouter);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
