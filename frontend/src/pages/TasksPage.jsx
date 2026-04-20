import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { api } from "../api/client";
import { useAuth } from "../auth/AuthContext";
import { PageHeader } from "../components/PageHeader";

const initialForm = { title: "", lead: "", assignedTo: "", dueDate: "" };

export function TasksPage() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(initialForm);

  const { data: tasksData } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => (await api.get("/tasks")).data,
  });

  const { data: leadOptions } = useQuery({
    queryKey: ["lead-options"],
    queryFn: async () => (await api.get("/leads/options")).data,
  });

  const createMutation = useMutation({
    mutationFn: async (payload) => api.post("/tasks", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setForm(initialForm);
      setOpen(false);
      setError("");
    },
    onError: (apiError) => setError(apiError.response?.data?.message || "Unable to create task"),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => api.patch(`/tasks/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    onError: (apiError) => setError(apiError.response?.data?.message || "Unable to update task"),
  });

  return (
    <>
      <PageHeader
        title="Tasks"
        action={<Button variant="contained" onClick={() => setOpen(true)}>Add Task</Button>}
      />

      {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Lead</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(tasksData?.items || []).map((task) => {
              const canEdit = task.assignedTo?._id === user?.id;
              return (
                <TableRow key={task._id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.lead?.name}</TableCell>
                  <TableCell>{new Date(task.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{task.status}</TableCell>
                  <TableCell>{task.assignedTo?.name}</TableCell>
                  <TableCell align="right">
                    <TextField
                      select
                      size="small"
                      value={task.status}
                      disabled={!canEdit}
                      onChange={(event) =>
                        statusMutation.mutate({ id: task._id, status: event.target.value })
                      }
                      sx={{ minWidth: 160 }}
                    >
                      {(tasksData?.statuses || []).map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Create Task</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            />
            <TextField
              select
              label="Lead"
              value={form.lead}
              onChange={(event) => setForm((current) => ({ ...current, lead: event.target.value }))}
            >
              {(leadOptions?.leads || []).map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Assigned To"
              value={form.assignedTo}
              onChange={(event) =>
                setForm((current) => ({ ...current, assignedTo: event.target.value }))
              }
            >
              {(leadOptions?.users || []).map((option) => (
                <MenuItem key={option._id} value={option._id}>
                  {option.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              type="date"
              label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={form.dueDate}
              onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
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
