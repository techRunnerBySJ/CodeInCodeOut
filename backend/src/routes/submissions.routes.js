import express from "express";
import { submitBatch, getBatchResults, runProblem, submitProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

// Define the route to submit a batch of code
submissionRoutes.post("/batch", submitBatch);

// Define the route to get results of a batch submission
submissionRoutes.get("/batch", getBatchResults);

submissionRoutes.post("/run", runProblem);

submissionRoutes.post("/submit", submitProblem);

export default submissionRoutes;
