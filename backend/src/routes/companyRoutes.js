import { Router } from "express";
import { createCompany, getCompany, listCompanies } from "../controllers/companyController.js";
import { asyncHandler } from "../lib/asyncHandler.js";

const router = Router();

router.get("/", asyncHandler(listCompanies));
router.get("/:id", asyncHandler(getCompany));
router.post("/", asyncHandler(createCompany));

export default router;
