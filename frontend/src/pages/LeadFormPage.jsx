import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

const defaultForm = {
  name: "",
  email: "",
  phone: "",
  status: "New",
  assignedTo: "",
  company: "",
};

export function LeadFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form, setForm] = useState(defaultForm);

  const { data: options } = useQuery({
    queryKey: ["lead-options"],
    queryFn: async () => (await api.get("/leads/options")).data,
  });

  const { data: lead } = useQuery({
    queryKey: ["lead", id],
    enabled: Boolean(id),
    queryFn: async () => (await api.get(`/leads/${id}`)).data,
  });

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        assignedTo: lead.assignedTo?._id || "",
        company: lead.company?._id || "",
      });
    }
  }, [lead]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (id) {
        return api.put(`/leads/${id}`, payload);
      }
      return api.post("/leads", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      navigate("/leads");
    },
  });

  function handleChange(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <>
      <PageHeader title={id ? "Edit Lead" : "Add Lead"} />
      <Paper sx={{ p: 3, maxWidth: 760 }}>
        <Stack spacing={2}>
          <TextField
            label="Name"
            value={form.name}
            onChange={(event) => handleChange("name", event.target.value)}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(event) => handleChange("email", event.target.value)}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(event) => handleChange("phone", event.target.value)}
          />
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(event) => handleChange("status", event.target.value)}
          >
            {(options?.statuses || []).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Assigned To"
            value={form.assignedTo}
            onChange={(event) => handleChange("assignedTo", event.target.value)}
          >
            {(options?.users || []).map((user) => (
              <MenuItem key={user._id} value={user._id}>
                {user.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Company"
            value={form.company}
            onChange={(event) => handleChange("company", event.target.value)}
          >
            {(options?.companies || []).map((company) => (
              <MenuItem key={company._id} value={company._id}>
                {company.name}
              </MenuItem>
            ))}
          </TextField>
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={() => mutation.mutate(form)}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => navigate("/leads")}>
              Cancel
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </>
  );
}
