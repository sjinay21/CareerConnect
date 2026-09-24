import express from "express";
import { getComments, addComments } from "../controllers/commentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/addcomments", authMiddleware, addComments);
router.get("/getcomments", authMiddleware, getComments);
// router.put("/updatecomments", authMiddleware, updateComments);
// router.delete("/deletecomments", authMiddleware, deleteComments);

export default router;
