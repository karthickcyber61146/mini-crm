import { AppError } from "../lib/errors.js";
import { Company } from "../models/Company.js";
import { Lead } from "../models/Lead.js";

export async function createCompany(req, res) {
  const { name, industry, location } = req.body;

  if (!name || !industry || !location) {
    throw new AppError(400, "All company fields are required");
  }

  const company = await Company.create({ name, industry, location });
  res.status(201).json(company);
}

export async function listCompanies(_req, res) {
  const companies = await Company.find().sort({ createdAt: -1 });
  res.json(companies);
}

export async function getCompany(req, res) {
  const company = await Company.findById(req.params.id);

  if (!company) {
    throw new AppError(404, "Company not found");
  }

  const leads = await Lead.find({ company: company._id, deletedAt: null })
    .populate("assignedTo", "name email")
    .sort({ createdAt: -1 });

  res.json({ company, leads });
}
