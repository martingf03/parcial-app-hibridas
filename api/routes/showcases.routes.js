import express from "express";
import * as controller from "../controllers/showcases.controllers.js";

const router = express.Router();

router.get("/showcases", controller.findAllShowcases);
router.get("/showcases/:id", controller.findShowcaseById);
router.post("/showcases", controller.addShowcase);
router.delete("/showcases/:id", controller.removeShowcase);

export default router;