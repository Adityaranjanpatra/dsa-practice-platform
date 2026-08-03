const express = require("express");
const app = express();
const connectDB = require("./config/db");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user.route");
const problemRouter = require("./routes/problem.route");
const redisClient = require("./config/redis");
const SubmitRouter = require("./routes/submission.route");
const adminRouter = require("./routes/admin.route");
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

  

app.use(express.json());
app.use(cookieParser());



app.use("/user", userRouter);
app.use("/admin",adminRouter);
app.use("/problems", problemRouter);
app.use("/submissions", SubmitRouter);

const initializeConnection = async () => {
  try {
    await Promise.all([connectDB(), redisClient.connect()]);
    console.log("All connections are initialized");

    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.log("Error initializing connections:", err);
  }
};

initializeConnection();


