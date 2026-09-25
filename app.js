const express = require("express");
const logger = require("./middleware/logger");
const studentRoutes = require("./routes/studentRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(logger);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Student Management API" });
});

// Mount student routes
app.use("/students", studentRoutes);

// 404 Route handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
