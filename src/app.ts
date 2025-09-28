import express from 'express';
import dotenv from 'dotenv';

import userController from './api/controllers/userController.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', userController);

export default app;

