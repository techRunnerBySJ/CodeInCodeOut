import express from "express";
import { submitBatch, getBatchResults, runProblem, submitProblem } from "../controllers/submission.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const submissionRoutes = express.Router();

// Define the route to submit a batch of code
submissionRoutes.post("/batch", submitBatch);

// Define the route to get results of a batch submission
submissionRoutes.get("/batch", getBatchResults);

submissionRoutes.post("/run", runProblem);

submissionRoutes.post("/submit", authMiddleware, submitProblem);

export default submissionRoutes;
