import express from "express"
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submissions.routes.js";


const app = express();
dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Code In Code Out !!!");
});

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/submissions", submissionRoutes)



app.listen(process.env.PORT , () => {
    console.log("Server is running on port 8080");
});