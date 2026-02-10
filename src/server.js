const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
    "http://localhost:5173", // Vite local
    "http://localhost:5000", // Backend local
    // Add your Render/Production frontend URL here once you have it, e.g.:
    // "https://your-frontend-app.onrender.com"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps or curl requests)
            if (!origin) return callback(null, true);

            // In development, you might want to allow all, but for safety lets check list
            // Or just allow all for now if you are debugging functionality:
            // return callback(null, true); 

            if (allowedOrigins.indexOf(origin) === -1) {
                // Option: Allow all for debugging "Access-Control-Allow-Origin" issues
                // return callback(null, true); 

                // Strict Check:
                // var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                // return callback(new Error(msg), false);

                // Permissive for this user's stage:
                return callback(null, true);
            }
            return callback(null, true);
        },
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

/* ---------------- COMPANY & JOB ROUTES ---------------- */
app.use("/api/company", require("./routes/company.routes"));
app.use("/api/jobs", require("./routes/job.routes"));

/* ---------------- SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);

