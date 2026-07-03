import { Router } from "express";
import {
  adminCreateCertificate,
  adminDeleteCertificate,
  adminListCertificates,
  adminUpdateCertificate,
  listCertificates
} from "../controllers/certificate.controller.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const router = Router();

router.get("/", listCertificates);

export const adminCertificateRouter = Router();
adminCertificateRouter.use(requireAdmin);
adminCertificateRouter.get("/", adminListCertificates);
adminCertificateRouter.post("/", adminCreateCertificate);
adminCertificateRouter.put("/:id", adminUpdateCertificate);
adminCertificateRouter.delete("/:id", adminDeleteCertificate);

export default router;