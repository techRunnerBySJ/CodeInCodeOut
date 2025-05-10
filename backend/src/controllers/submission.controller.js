import { submitBatch as submitBatchService, pollBatchResults } from "../libs/submission.js";  // Import from submission service

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
