import { Router } from "express";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminListProducts,
  adminUpdateProduct,
  getProduct,
  listProducts
} from "../controllers/product.controller.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listProducts);
router.get("/:slug", getProduct);

export const adminProductRouter = Router();
adminProductRouter.use(requireAdmin);
adminProductRouter.get("/", adminListProducts);
adminProductRouter.post("/", adminCreateProduct);
adminProductRouter.put("/:id", adminUpdateProduct);
adminProductRouter.delete("/:id", adminDeleteProduct);

export default router;