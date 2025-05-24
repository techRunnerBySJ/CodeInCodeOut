import { db } from "../libs/db.js";
import {
  getCustomLanguageId,
  pollBatchResults,
  submitBatch
} from "../libs/submission.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficultyLevel,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
    hints,
    discussion, // New field
  } = req.body;

  if (!testcases || testcases.length === 0) {
    return res.status(400).json({ error: "Testcases are missing or invalid" });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      if (!solutionCode) {
        return res.status(400).json({ error: `Solution code for ${language} is missing` });
      }

      console.log(`Processing language: ${language}`);

      const languageId = getCustomLanguageId(language);

      if (!languageId) {
        return res.status(400).json({ error: `Language ${language} is not supported` });
      }

      const submissions = testcases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      console.log(`Submissions for ${language}:`, submissions);

      const submissionResults = await submitBatch(submissions);

      console.log(`Submission Results for ${language}:`, submissionResults);

      const tokens = submissionResults.map((res) => res.token);
      console.log(`Tokens for ${language}:`, tokens);

      const results = await pollBatchResults(tokens);
      console.log(`Results for ${language}:`, results);

      // Check if all results have a status of "Completed"
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        console.log(`Result for testcase ${i + 1} in ${language}:`, result);

        if (result.status !== "Completed") {
          return res.status(400).json({
            error: `Testcase ${i + 1} failed for language ${language}. Status: ${result.status}`,
          });
        }
      }
    }

    // If all test cases pass for all languages, create the problem
    const newProblem = await db.problem.create({
      data: {
        title,
        description,
        difficultyLevel,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        hints,
        discussion, // Save the discussion field
        userId: req.user.id,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Problem Created Successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error while creating problem:", error);
    return res.status(500).json({
      error: "Error While Creating Problem",
    });
  }
};

export const getAllProblems = async (req, res) => {
  try {
    const problems = await db.problem.findMany();

    if (!problems) {
      return res.status(404).json({
        error: "No problems Found",
      });
    }

    res.status(200).json({
      sucess: true,
      message: "Message Fetched Successfully",
      problems,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problems",
    });
  }
};

export const getProblemById = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    return res.status(200).json({
      sucess: true,
      message: "Message Created Successfully",
      problem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Fetching Problem by id",
    });
  }
};

export const updateProblemById = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    difficultyLevel,
    tags,
    examples,
    constraints,
    testcases,
    codeSnippets,
    referenceSolutions,
    hints,
    discussion, // New field
  } = req.body;

  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found." });
    }
    const updatedProblem = await db.problem.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        difficultyLevel,
        tags,
        examples,
        constraints,
        testcases,
        codeSnippets,
        referenceSolutions,
        hints,
        discussion, // Update the discussion field
      },
    });
    return res.status(200).json({
      sucess: true,
      message: "Message Updated Successfully",
      problem: updatedProblem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Error While Updating Problem by id",
    });
  }
};

export const deleteProblem = async (req, res) => {
  const { id } = req.params;

  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
};

export const getAllSolvedProblemsByUser = async (req, res) => {
  try {
    const solvedProblems = await db.solvedProblem.findMany({
      where: {
        userId: req.user.id, // Filters solved problems by the current user
      },
      include: {
        problem: true, // Includes the related problem details
      },
    });

    if (!solvedProblems || solvedProblems.length === 0) {
      return res.status(404).json({ error: "No solved problems found for the user." });
    }

    const problems = solvedProblems.map((solved) => solved.problem);

    return res.status(200).json({
      success: true,
      message: "Solved problems fetched successfully.",
      problems,
    });
  } catch (error) {
    console.error("Error fetching solved problems:", error);
    return res.status(500).json({ error: "Failed to fetch solved problems." });
  }
};

export const deleteProblemById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const problem = await db.problem.findUnique({ where: { id } });

    if (!problem) {
      return res.status(404).json({ error: "Problem Not found" });
    }

    await db.problem.delete({ where: { id } });

    res.status(200).json({
      success: true,
      message: "Problem deleted Successfully",
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      error: "Error While deleting the problem",
    });
  }
}



export const getProblemByDifficulty = async (req, res) => {
  const { difficulty } = req.params;

  try {
    const problems = await db.problem.findMany({
      where: {
        difficultyLevel: difficulty, // Matches the difficulty level
      },
    });

    if (!problems || problems.length === 0) {
      return res.status(404).json({ error: "No problems found with the specified difficulty level." });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully by difficulty level.",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems by difficulty level:", error);
    return res.status(500).json({ error: "Failed to fetch problems by difficulty level." });
  }
};
export const getProblemByTag = async (req, res) => {
  const { tag } = req.params;

  try {
    const problems = await db.problem.findMany({
      where: {
        tags: {
          has: tag, // Checks if the tag exists in the tags array
        },
      },
    });

    if (!problems || problems.length === 0) {
      return res.status(404).json({ error: "No problems found with the specified tag." });
    }

    return res.status(200).json({
      success: true,
      message: "Problems fetched successfully by tag.",
      problems,
    });
  } catch (error) {
    console.error("Error fetching problems by tag:", error);
    return res.status(500).json({ error: "Failed to fetch problems by tag." });
  }
};
