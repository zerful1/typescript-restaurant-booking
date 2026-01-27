import "dotenv/config";
import express from "express";
import session from "express-session";
import chalk from "chalk";
import { initializeDatabase } from "./database/index.js";

// Routes
import authRoute from "./routes/auth.js";
import userRoute from "./routes/user.js";
import passwordRoute from "./routes/password.js";
import bookingRoute from "./routes/booking.js";
import adminRoute from "./routes/admin.js";
import menuRoute from "./routes/menu.js";
import stripeRoute from "./routes/stripe.js";
import filesRoute from "./routes/files.js";

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

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", passwordRoute);
app.use("/api", bookingRoute);
app.use("/api", adminRoute);
app.use("/api", menuRoute);
app.use("/api", stripeRoute);
app.use("/api", filesRoute);

async function startServer() {
	try {
		await initializeDatabase();

		app.listen(PORT, () => {
			console.log(
				chalk.cyan(`Server running on http://localhost:${PORT}`)
			);
		});
	} catch (error) {
		console.error(chalk.red("Failed to start server:"), error);
		process.exit(1);
	}
}

startServer();
