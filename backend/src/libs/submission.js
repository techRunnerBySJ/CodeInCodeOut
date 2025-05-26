import { v4 as uuidv4 } from 'uuid';
import { runCode } from "../utils/runCode.js";  // You need to implement this function for executing code

// In-memory storage for submissions
export const submissions = {};

// Custom language ID mapping
export const getCustomLanguageId = (language) => {
  const languageMap = {
    PYTHON: "python",
    C: "C",
    JAVASCRIPT: "javascript",
  };

  console.log("Mapping language:", language); // Debug log
  return languageMap[language.toUpperCase()] || null;
};

// Submit a batch of code submissions
export const submitBatch = async (submissionsArray) => {
    console.log("Received submissionsArray:", submissionsArray); // Debug log

    const tokens = submissionsArray.map(({ source_code, language_id, stdin, expected_output }) => {
        console.log("Processing submission:", { source_code, language_id, stdin, expected_output }); // Debug log

        const code = source_code; // Map source_code to code
        console.log("Mapped code:", code); // Debug log

        if (!code || typeof code !== "string") {
            console.error("Invalid code:", code); // Error log
            const token = uuidv4();
            submissions[token] = {
                status: "Error",
                error: "Code is undefined, empty, or not a string",
            };
            return { token };
        }

        const token = uuidv4();
        submissions[token] = { status: "Pending" };

        console.log("Running code with token:", token); // Debug log
        runCode(code, language_id, stdin)
            .then((result) => {
                console.log("Execution result for token:", token, result); // Debug log
                submissions[token] = {
                    status: "Completed",
                    stdout: result.stdout,
                    stderr: result.stderr,
                    error: null,
                };
            })
            .catch((error) => {
                console.error("Execution error for token:", token, error); // Error log
                submissions[token] = {
                    status: "Error",
                    error: error.message,
                };
            });

        return { token };
    });

    console.log("Generated tokens:", tokens); // Debug log
    return tokens; // Return the tokens to be sent as the response
};

// Poll batch results until all are finished
export const pollBatchResults = async (tokens) => {
  console.log("Polling results for tokens:", tokens); // Debug log

  while (true) {
    const results = tokens.map((token) => submissions[token]);
    console.log("Current results:", results); // Debug log

    const isAllDone = results.every((r) => r.status !== "Pending");

    if (isAllDone) {
      console.log("All submissions completed:", results); // Debug log
      return results;  // Return the results once all submissions are completed
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));  // 1 second delay before checking again
  }
};