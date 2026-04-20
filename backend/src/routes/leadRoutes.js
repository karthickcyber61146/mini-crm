import { Router } from "express";
import {
  createLead,
  deleteLead,
  getLead,
  listLeadOptions,
  listLeads,
  updateLead,
  updateLeadStatus,
} from "../controllers/leadController.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get("/options", asyncHandler(listLeadOptions));
router.get("/", asyncHandler(listLeads));
router.get("/:id", asyncHandler(getLead));
router.post("/", asyncHandler(createLead));
router.put("/:id", asyncHandler(updateLead));
router.patch("/:id/status", asyncHandler(updateLeadStatus));
router.delete("/:id", asyncHandler(deleteLead));

export default router;
