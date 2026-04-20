import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

const initialForm = { name: "", industry: "", location: "" };

export function CompaniesPage() {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { data } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => (await api.get("/companies")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post("/companies", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setForm(initialForm);
      setOpen(false);
    },
  });

  return (
    <>
      <PageHeader
        title="Companies"
        action={<Button variant="contained" onClick={() => setOpen(true)}>Add Company</Button>}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Company Name</TableCell>
              <TableCell>Industry</TableCell>
              <TableCell>Location</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(data || []).map((company) => (
              <TableRow
                key={company._id}
                hover
                component={RouterLink}
                to={`/companies/${company._id}`}
                sx={{ textDecoration: "none" }}
              >
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{company.location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Company</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Company Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            />
            <TextField
              label="Industry"
              value={form.industry}
              onChange={(event) =>
                setForm((current) => ({ ...current, industry: event.target.value }))
              }
            />
            <TextField
              label="Location"
              value={form.location}
              onChange={(event) =>
                setForm((current) => ({ ...current, location: event.target.value }))
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => createMutation.mutate(form)}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
