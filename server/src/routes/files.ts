import express, { Router } from "express";
import multer from "multer";
import fs from "fs";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const upload_dir = "upload";

if (!fs.existsSync(upload_dir)) {
	fs.mkdirSync(upload_dir, { recursive: true });
}

const storage = multer.diskStorage({
	destination: (_req, _file, cb) => cb(null, upload_dir),
	filename: (_req, file, cb) =>
		cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

router.post(
	"/files/upload",
	requireAdmin, // must be admin (runs first)
	upload.single("file"), // uploads the file
	// i think "file" is req.file (?)
	// 	                      ^
	(req, res) => {
		if (!req.file)
			return res.status(400).json({ message: "Missing file upload." });
		return res.json({ filename: req.file.filename });
	}
);

router.get("/files/list", (_req, res) => {
	const files = fs.readdirSync(upload_dir);
	res.json(files);
});

router.use("/uploads", express.static(upload_dir));

export default router;
