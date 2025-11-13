import express from "express";

const router = express.Router();

router.post("/isauth", (req, res) => {
  return res.json({ authenticated: !!req.session?.userId });
});

export default router;
