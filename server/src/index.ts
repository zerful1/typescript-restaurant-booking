import express from "express";
import session from "express-session";
import chalk from "chalk";
import { initializeDatabase } from "./database/index.js";

// Routes
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import passwordRouter from "./routes/password.js";
import bookingRouter from "./routes/booking.js";

const app = express();
const PORT = 5000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: "SuperSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

app.use("/api", authRouter);
app.use("/api", userRouter);
app.use("/api", passwordRouter);
app.use("/api", bookingRouter);

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(PORT, () => {
      console.log(chalk.cyan(`Server running on http://localhost:${PORT}`));
    });
  } catch (error) {
    console.error(chalk.red("Failed to start server:"), error);
    process.exit(1);
  }
}

startServer();
