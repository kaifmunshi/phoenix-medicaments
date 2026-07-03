import { Router } from "express";
import {
  adminCreateCategory,
  adminDeleteCategory,
  adminListCategories,
  adminUpdateCategory,
  listCategories
} from "../controllers/category.controller.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listCategories);

export const adminCategoryRouter = Router();
adminCategoryRouter.use(requireAdmin);
adminCategoryRouter.get("/", adminListCategories);
adminCategoryRouter.post("/", adminCreateCategory);
adminCategoryRouter.put("/:id", adminUpdateCategory);
adminCategoryRouter.delete("/:id", adminDeleteCategory);

export default router;