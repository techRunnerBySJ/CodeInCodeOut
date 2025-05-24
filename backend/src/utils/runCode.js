import fs from "fs";
import path from "path";
import { promisify } from "util";
import { exec } from "child_process";

const execAsync = promisify(exec);

export const runCode = async (code, language, input = "") => {
    console.log("Running code:", { code, language, input });

    if (!code || typeof code !== "string") {
        console.error("Invalid code passed to runCode:", code);
        return { stdout: "", stderr: "Code is undefined, empty, or not a string" };
    }

    const fileMap = {
        javascript: "main.cjs",
        python: "main.py",
        java: "Main.java",
    };

    const filename = fileMap[language];
    if (!filename) {
        console.error(`Unsupported language: ${language}`);
        return { stdout: "", stderr: `Unsupported language: ${language}` };
    }

    const __dirname = path.resolve();
    const filepath = path.join(__dirname, "../temp", filename);

    try {
        console.log("Creating temp directory and writing code to file:", filepath);
        fs.mkdirSync(path.join(__dirname, "../temp"), { recursive: true });
        fs.writeFileSync(filepath, code);
    } catch (err) {
        console.error("File system error:", err);
        return { stdout: "", stderr: "File system error: " + err.message };
    }


    const safeInput = input.replace(/"/g, '\\"');
    console.log("Safe input for execution:", safeInput); 

    const commandMap = {
        javascript: `echo "${safeInput}" | node ${filepath}`,
        python: `echo "${safeInput}" | python3 ${filepath}`,
        java: `javac ${filepath} && echo "${safeInput}" | java -cp ${path.join(__dirname, "../temp")} Main`,
    };

    try {
        console.log("Executing command:", commandMap[language]);
        const { stdout, stderr } = await execAsync(commandMap[language], {
            cwd: path.join(__dirname, "../temp"),
            timeout: 5000,
        });
        console.log("Execution completed:", { stdout, stderr });
        return { stdout, stderr: stderr || null };
    } catch (err) {
        console.error("Execution error:", err);
        return { stdout: "", stderr: "Execution error: " + err.message };
    }
};