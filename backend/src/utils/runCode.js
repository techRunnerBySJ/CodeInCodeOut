// runCode.js
import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";
import { db } from "../libs/db.js";

const execAsync = promisify(exec);

const normalize = (val) => {
  try {
    return JSON.stringify(JSON.parse(val));
  } catch {
    return JSON.stringify(val).replace(/\s+/g, "");
  }
};

const compareOutputs = (expected, actual) => {
  return normalize(expected) === normalize(actual);
};

const extractFunctionName = (code, language) => {
  if (language === "javascript") {
    const match = code.match(/function\s+(\w+)\s*\(/);
    return match ? match[1] : null;
  } else if (language === "python") {
    const match = code.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : null;
  } else if (language === "c") {
    const match = code.match(/\b[\w\s\*]+?\s+(\w+)\s*\([^)]*\)\s*\{/);
    console.log("Extracted C function name:", match ? match[1] : null);
    return match ? match[1] : null;
  }
  return null;
};

export const runCode = async (code, language, problemId) => {
  const problem = await db.problem.findUnique({ where: { id: problemId } });
  if (!problem) return { success: false, message: "Problem not found" };

  const testcases = problem.testcases || [];
  if (testcases.length === 0) return { success: false, message: "No test cases found" };

  const functionName = extractFunctionName(code, language);
  if (!functionName) return { success: false, message: "Function name not found in code" };

  const fileMap = {
    javascript: "main.cjs",
    python: "main.py",
    c: "main.c",
  };
  const filename = fileMap[language];
  const filepath = path.join("/tmp", filename);

  const wrapCode = (code, lang) => {
    const testCode = {
      javascript: `
${code}

try {
  const inputArg = process.argv[2];
  const parsedInput = JSON.parse(inputArg);
  const result = ${functionName}(...parsedInput);
  console.log(JSON.stringify(result));
} catch (err) {
  console.error("Execution Error:", err.message);
}
`,
      python: `
${code}

import sys, json
try:
  parsed_input = json.loads(sys.argv[1])
  result = ${functionName}(*parsed_input)
  print(json.dumps(result))
except Exception as e:
  print("Execution Error:", str(e), file=sys.stderr)
`,
      c: `#include <stdio.h>
#include <stdlib.h>

${code}

int main(int argc, char* argv[]) {
  if (argc < 2) {
    printf("Missing input\n");
    return 1;
  }
  int input = atoi(argv[1]);
  printf("%s", ${functionName}(input));
  return 0;
}`
    };
    return testCode[lang];
  };

  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, wrapCode(code, language));
  console.log("WRAPPED CODE:\n", fs.readFileSync(filepath, "utf-8"));

  const commandMap = {
    javascript: (input) => `node ${filepath} '${input.startsWith("[") ? input : `[${input}]`}'`,
    python: (input) => `python3 ${filepath} '${input.startsWith("[") ? input : `[${input}]`}'`,
    c: (input) => `gcc ${filepath} -o /tmp/main && /tmp/main ${input.replace(/\[|\]|"/g, '')}`,
  };

  const results = [];
  for (const testCase of testcases) {
    const { input, output: expectedOutput } = testCase;
    try {
      const command = commandMap[language](input);
      console.log("COMMAND:", command);
      const { stdout, stderr } = await execAsync(command, {
        cwd: path.dirname(filepath),
        timeout: 5000,
      });

      console.log(">>> RAW STDOUT START <<<\n", stdout, "\n>>> RAW STDOUT END <<<");
      console.log("STDERR:", stderr);

      const actualOutput = stdout
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .pop() || "";

      const passed = compareOutputs(expectedOutput, actualOutput);

      results.push({
        input,
        expected_output: expectedOutput,
        actual_output: actualOutput,
        passed,
        error: stderr || null,
      });
    } catch (err) {
      results.push({
        input,
        expected_output: expectedOutput,
        actual_output: "",
        passed: false,
        error: err.message,
      });
    }
  }

  const allPassed = results.every((r) => r.passed);
  return {
    success: true,
    message: allPassed ? "All test cases passed." : "Some test cases failed.",
    allPassed,
    results,
  };
};
