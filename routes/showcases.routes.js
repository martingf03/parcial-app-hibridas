import express from "express";
import * as controller from "../controllers/showcases.controllers.js";

const router = express.Router();

router.get("/", controller.showHomepage);
router.get("/section/:category", controller.showCategoryPage);

export default router;

