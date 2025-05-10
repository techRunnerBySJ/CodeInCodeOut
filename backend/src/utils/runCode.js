import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

// Core runner function
export const runCode = async (code, language, input = "") => {
    console.log("Running code:", { code, language, input }); // Debug log

    if (!code || typeof code !== "string") {
        console.error("Invalid code passed to runCode:", code); // Error log
        return { stdout: "", stderr: "Code is undefined, empty, or not a string" };
    }

    const fileMap = {
        javascript: "main.cjs",
        python: "main.py",
        java: "Main.java", // Added support for Java
    };

    const filename = fileMap[language];
    if (!filename) {
        console.error(`Unsupported language: ${language}`); // Error log
        return { stdout: "", stderr: `Unsupported language: ${language}` };
    }

    const __dirname = path.resolve(); // Ensure __dirname is resolved correctly
    const filepath = path.join(__dirname, "../temp", filename);

    try {
        console.log("Creating temp directory and writing code to file:", filepath); // Debug log
        fs.mkdirSync(path.join(__dirname, "../temp"), { recursive: true });
        fs.writeFileSync(filepath, code); // Write the code to the file
    } catch (err) {
        console.error("File system error:", err); // Error log
        return { stdout: "", stderr: "File system error: " + err.message };
    }

    // Safely encode input for shell command
    const safeInput = input.replace(/"/g, '\\"');
    console.log("Safe input for execution:", safeInput); // Debug log

    const commandMap = {
        javascript: `echo "${safeInput}" | node ${filepath}`,
        python: `echo "${safeInput}" | python3 ${filepath}`,
        java: `javac ${filepath} && echo "${safeInput}" | java -cp ${path.join(__dirname, "../temp")} Main`, // Java execution
    };

    try {
        console.log("Executing command:", commandMap[language]); // Debug log
        const { stdout, stderr } = await execAsync(commandMap[language], {
            cwd: path.join(__dirname, "../temp"),
            timeout: 5000,
        });
        console.log("Execution completed:", { stdout, stderr }); // Debug log
        return { stdout, stderr: stderr || null };
    } catch (err) {
        console.error("Execution error:", err); // Error log
        return { stdout: "", stderr: "Execution error: " + err.message };
    }
};