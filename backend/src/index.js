import express from "express"
import dotenv from 'dotenv';
import authRoutes from "./routes/auth.routes.js";


const app = express();
dotenv.config();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Welcome to Code In Code Out !!!");
});

app.use("/api/v1/auth", authRoutes)



app.listen(process.env.PORT , () => {
    console.log("Server is running on port 8080");
});