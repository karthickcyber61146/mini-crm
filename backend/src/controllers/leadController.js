import { AppError } from "../lib/errors.js";
import { getPagination } from "../lib/pagination.js";
import { Company } from "../models/Company.js";
import { Lead, LEAD_STATUSES } from "../models/Lead.js";
import { User } from "../models/User.js";

async function validateReferences({ assignedTo, company }) {
  const [user, companyRecord] = await Promise.all([
    User.findById(assignedTo),
    Company.findById(company),
  ]);

  if (!user) {
    throw new AppError(400, "Assigned user not found");
  }

  if (!companyRecord) {
    throw new AppError(400, "Company not found");
  }
}

export async function createLead(req, res) {
  const { name, email, phone, status, assignedTo, company } = req.body;

  if (!name || !email || !phone || !assignedTo || !company) {
    throw new AppError(400, "All lead fields are required");
  }

  await validateReferences({ assignedTo, company });

  const lead = await Lead.create({
    name,
    email,
    phone,
    status: status || "New",
    assignedTo,
    company,
  });

  const populatedLead = await Lead.findById(lead._id)
    .populate("assignedTo", "name email")
    .populate("company", "name industry location");

  res.status(201).json(populatedLead);
}

export async function listLeads(req, res) {
  const { search, status } = req.query;
  const { page, limit, skip } = getPagination(req.query);
  const filter = { deletedAt: null };

  if (status && LEAD_STATUSES.includes(status)) {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { name: new RegExp(search, "i") },
      { email: new RegExp(search, "i") },
      { phone: new RegExp(search, "i") },
    ];
  }

  const [items, total] = await Promise.all([
    Lead.find(filter)
      .populate("assignedTo", "name email")
      .populate("company", "name industry location")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Lead.countDocuments(filter),
  ]);

  res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
}

export async function getLead(req, res) {
  const lead = await Lead.findOne({ _id: req.params.id, deletedAt: null })
    .populate("assignedTo", "name email")
    .populate("company", "name industry location");

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.json(lead);
}

export async function updateLead(req, res) {
  const { name, email, phone, status, assignedTo, company } = req.body;

  const existingLead = await Lead.findOne({ _id: req.params.id, deletedAt: null });

  if (!existingLead) {
    throw new AppError(404, "Lead not found");
  }

  const nextAssignedTo = assignedTo || existingLead.assignedTo;
  const nextCompany = company || existingLead.company;
  await validateReferences({ assignedTo: nextAssignedTo, company: nextCompany });

  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { name, email, phone, status, assignedTo, company },
    { new: true, runValidators: true }
  )
    .populate("assignedTo", "name email")
    .populate("company", "name industry location");

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.json(lead);
}

export async function updateLeadStatus(req, res) {
  const { status } = req.body;

  if (!LEAD_STATUSES.includes(status)) {
    throw new AppError(400, "Invalid lead status");
  }

  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { status },
    { new: true }
  )
    .populate("assignedTo", "name email")
    .populate("company", "name industry location");

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.json(lead);
}

export async function deleteLead(req, res) {
  const lead = await Lead.findOneAndUpdate(
    { _id: req.params.id, deletedAt: null },
    { deletedAt: new Date() },
    { new: true }
  );

  if (!lead) {
    throw new AppError(404, "Lead not found");
  }

  res.json({ message: "Lead deleted" });
}

export async function listLeadOptions(_req, res) {
  const [users, companies, leads] = await Promise.all([
    User.find().select("name email").sort({ name: 1 }),
    Company.find().sort({ name: 1 }),
    Lead.find({ deletedAt: null }).select("name email").sort({ name: 1 }),
  ]);

  res.json({
    statuses: LEAD_STATUSES,
    users,
    companies,
    leads,
  });
}
