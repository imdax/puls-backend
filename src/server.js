const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS CONFIG ---------------- */
app.use(
    cors({
        origin: "http://localhost:5173", // Vite default
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

/* IMPORTANT: handle preflight - Handled by global cors middleware */
// app.options("(.*)", cors());

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());

/* ---------------- TEST ROUTE ---------------- */
app.get("/", (req, res) => {
    res.json({ message: "Pulse Employment API running" });
});

/* ---------------- ROUTES ---------------- */
app.use("/api/professions", require("./routes/professionRoutes"));
app.use("/api", require("./routes/userRoutes"));
app.use("/api/assessment", require("./routes/assessmentRoutes"));

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);

