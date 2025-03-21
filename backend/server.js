const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const taskRoutes = require("./routes/taskRoutes");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/tasks", taskRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error
    res.status(500).json({ message: "Internal Server Error" });
  });

if (process.env.NODE_ENV !== "test") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }

module.exports = app;