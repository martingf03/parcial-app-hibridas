import express from "express";
import * as controller from "../controllers/showcases.controllers.js";

const router = express.Router();

router.get("/", controller.showHomepage);
router.get("/section/:category", controller.showCategoryPage);
router.get("/deleted", controller.showDeletedPage);
router.get("/showcases/:id/url", controller.openShowcaseUrlPage);
router.use(controller.showNotFoundPage);

export default router;

