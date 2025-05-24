import express from "express"
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import submissionRoutes from "./routes/submissions.routes.js";
import cors from 'cors';


const app = express();
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000", // Default to localhost if not set
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Type", "Authorization"]

}));

app.get("/", (req, res) => {
    res.send("Welcome to Code In Code Out !!!");
});

app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/problems", problemRoutes)
app.use("/api/v1/submissions", submissionRoutes)



app.listen(process.env.PORT , () => {
    console.log("Server is running on port 8080");
});