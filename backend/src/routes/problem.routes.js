import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { createProblem, deleteProblemById, getAllProblems, getAllSolvedProblemsByUser, getProblemByDifficulty, getProblemById, getProblemByTag, getProblemsByCategories, updateProblemById } from '../controllers/problem.controller.js';

const problemRoutes = express.Router();

problemRoutes.post('/create-problem', authMiddleware, isAdmin, createProblem);
problemRoutes.get('/get-problems', authMiddleware, getAllProblems);
problemRoutes.get('/get-problem/:id', authMiddleware, getProblemById);
problemRoutes.put('/update-problem/:id', authMiddleware, isAdmin, updateProblemById);
problemRoutes.delete('/delete-problem/:id', authMiddleware, isAdmin, deleteProblemById);
problemRoutes.get('/get-problem-by-tag/:tag', authMiddleware, getProblemByTag);
problemRoutes.get('/get-problem-by-difficulty/:difficulty', authMiddleware, getProblemByDifficulty);
problemRoutes.get('/get-solved-problems-by-user', authMiddleware, getAllSolvedProblemsByUser);
problemRoutes.get('/get-problems-by-categories', authMiddleware, getProblemsByCategories);

export default problemRoutes;