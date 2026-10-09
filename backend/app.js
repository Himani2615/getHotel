const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors");

const app = express();

// config
if (process.env.NODE_ENV !== "production") {
	require("dotenv").config({ path: path.resolve(__dirname, "config/config.env") });
}

const dns = require('node:dns/promises');
dns.setServers(['1.1.1.1', '8.8.8.8']);

// Routes import
const userRoute = require("./routes/userRoute");
const hotelRoute = require("./routes/hotelRoute");
const roomRoute = require("./routes/roomRoute");
const bookingRoute = require("./routes/bookingRoute");
const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// cors cofiguration
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:3000")
	.split(",")
	.map((origin) => origin.trim())
	.map((origin) => origin.replace(/\/$/, ""))
	.filter(Boolean);

app.use(cors({
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
			return callback(null, true);
		}

		return callback(new Error("Origin is not allowed by CORS"));
	},
	credentials: true
}));

app.get("/api/v1/health", (req, res) => {
	res.status(200).json({ success: true, database: "connected" });
});

app.use("/api/v1", userRoute);
app.use("/api/v1", hotelRoute);
app.use("/api/v1", roomRoute);
app.use("/api/v1", bookingRoute);

// production build
const frontendBuildPath = path.join(__dirname, "../frontend/build");
if (process.env.NODE_ENV === "production" && fs.existsSync(frontendBuildPath)) {
	app.use(express.static(frontendBuildPath));

	app.get("*", (req, res) => {
		res.sendFile(path.join(frontendBuildPath, "index.html"));
	});
} else {
	app.get("/", (req, res) => {
		res.status(200).json({ success: true, message: "GetHotel API is running" });
	});
}

// error middileware
app.use(errorMiddleware);

module.exports = app;
