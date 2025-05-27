import { submitBatch as submitBatchService, pollBatchResults, submissions } from "../libs/submission.js";  // Import from submission service
import { getCustomLanguageId } from "../libs/submission.js";
import { v4 as uuidv4 } from 'uuid';
import { runCode } from "../utils/runCode.js";
import { db } from "../libs/db.js";

export const runProblem = async (req, res) => {
  const { problemId, source_code, language } = req.body;

  // ✅ Validate input
  if (!problemId || !source_code || !language) {
    return res.status(400).json({
      error: "Invalid input. Please provide problemId, source_code, and language.",
    });
  }

  try {
    // ✅ Check if problem exists
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    if (!problem.testcases || problem.testcases.length === 0) {
      return res.status(400).json({ error: "No test cases available for this problem." });
    }

    // ✅ Get language ID (mapped if needed)
    const languageId = getCustomLanguageId(language);
    if (!languageId) {
      return res.status(400).json({ error: `Language ${language} is not supported.` });
    }

    // ✅ Run all test cases at once
    const runResult = await runCode(source_code, languageId, problemId);

    // ✅ Normalize outputs for consistent comparison
    const normalize = (str) => {
      if (str === null || str === undefined) return "";
      return String(str).replace(/\r?\n|\r/g, "").trim();
    };

    const results = runResult.results.map((r) => ({
      input: r.input,
      expected_output: normalize(r.expected_output),
      actual_output: normalize(r.actual_output),
      passed: r.passed,
      error: r.error || null,
    }));

    const allPassed = results.every((test) => test.passed);

    return res.status(200).json({
      success: true,
      message: allPassed ? "All test cases passed." : "Some test cases failed.",
      allPassed,
      results,
    });
  } catch (error) {
    console.error("Error while running problem:", error);
    return res.status(500).json({ error: "Error while running the problem." });
  }
};

export const submitProblem = async (req, res) => {
  const {
    problemId,
    source_code,
    language,
  } = req.body;

  if (!problemId || !source_code || !language) {
    return res.status(400).json({ error: "Invalid input. Please provide problemId, source_code, and language." });
  }

  try {
    // Fetch the problem details
    const problem = await db.problem.findUnique({
      where: { id: problemId },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    const { testcases } = problem;

    if (!testcases || testcases.length === 0) {
      return res.status(400).json({ error: "No test cases available for this problem." });
    }

    // Get the language ID for the user's selected language
    const languageId = getCustomLanguageId(language);

    if (!languageId) {
      return res.status(400).json({ error: `Language ${language} is not supported.` });
    }

    // Run all test cases at once using runCode
    const runResult = await runCode(source_code, languageId, problemId);

    // Check if all test cases passed
    const allPassed = runResult.results.every((test) => test.passed);

    if (!allPassed) {
      return res.status(400).json({
        success: false,
        message: "Some test cases failed.",
        results: runResult.results,
      });
    }

    // Check if the problem is already solved by the user
    const alreadySolved = await db.solvedProblem.findFirst({
      where: {
        userId: req.user.id,
        problemId,
      },
    });

    if (alreadySolved) {
      return res.status(400).json({ error: "Problem already solved by the user." });
    }

    // Start a transaction to update all related tables
    const transaction = await db.$transaction(async (tx) => {
      // Award coins for solving the problem
      const coinsEarned = 10; // Example: 10 coins per problem
      const updatedUser = await tx.user.update({
        where: { id: req.user.id },
        data: {
          coins: { increment: coinsEarned },
          streak: { increment: 1 }, // Increment streak for solving a problem
        },
      });

      // Record the solved problem
      const solvedProblem = await tx.solvedProblem.create({
        data: {
          userId: req.user.id,
          problemId,
        },
      });

      return {
        coinsEarned,
        updatedUser,
        solvedProblem,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Problem solved successfully!",
      coinsEarned: transaction.coinsEarned,
      streak: transaction.updatedUser.streak,
    });
  } catch (error) {
    console.error("Error while submitting problem:", error);
    return res.status(500).json({ error: "Error while submitting the problem." });
  }
};

// Handle batch submission requests
export const submitBatch = async (submissionsArray) => {
    const tokens = submissionsArray.map(({ source_code, language_id, stdin, expected_output }) => {
        if (!source_code || typeof source_code !== "string") {
            const token = uuidv4();
            submissions[token] = {
                status: "Error",
                error: "Source code is undefined, empty, or not a string",
            };
            return token;
        }

        const token = uuidv4();
        submissions[token] = {
            status: "Pending",
        };

        // Schedule execution
        runCode(source_code, language_id, stdin, expected_output).then((result) => {
            submissions[token] = {
                ...result,
                status: "Completed",
            };
        });

        return token;
    });

    return tokens;
};

// Handle retrieving batch results
export const getBatchResults = async (req, res) => {
  try {
    const tokenList = req.query.tokens?.split(",") || [];  // Get tokens from the query parameters

    // Call the service to poll and get the batch results
    const batchResult = await pollBatchResults(tokenList);  // Poll for results using the service

    // Respond with the batch results
    res.json({ submissions: batchResult });  // Send the results back to the client
  } catch (err) {
    console.error("Error during fetching batch results:", err);
    res.status(500).json({ error: "Internal server error while fetching results" });
  }
};
