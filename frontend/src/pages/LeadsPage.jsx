import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  IconButton,
  MenuItem,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink, useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

export function LeadsPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const page = Number(searchParams.get("page") || 1);
  const status = searchParams.get("status") || "";

  const { data: options } = useQuery({
    queryKey: ["lead-options"],
    queryFn: async () => (await api.get("/leads/options")).data,
  });

  const { data } = useQuery({
    queryKey: ["leads", page, status, searchParams.get("search") || ""],
    queryFn: async () => {
      const response = await api.get("/leads", {
        params: {
          page,
          status: status || undefined,
          search: searchParams.get("search") || undefined,
        },
      });
      return response.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => api.delete(`/leads/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status: nextStatus }) =>
      api.patch(`/leads/${id}/status`, { status: nextStatus }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["leads"] }),
  });

  const rows = useMemo(() => data?.items || [], [data]);

  function updateParams(next) {
    setSearchParams({
      page: String(next.page ?? page),
      search: next.search ?? searchParams.get("search") ?? "",
      status: next.status ?? status,
    });
  }

  return (
    <>
      <PageHeader
        title="Leads"
        action={
          <Button component={RouterLink} to="/leads/new" variant="contained">
            Add Lead
          </Button>
        }
      />

      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onBlur={() => updateParams({ search, page: 1 })}
            fullWidth
          />
          <TextField
            select
            label="Status"
            value={status}
            onChange={(event) => updateParams({ status: event.target.value, page: 1 })}
            sx={{ minWidth: 220 }}
          >
            <MenuItem value="">All</MenuItem>
            {(options?.statuses || []).map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Assigned To</TableCell>
              <TableCell>Company</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((lead) => (
              <TableRow key={lead._id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell sx={{ minWidth: 180 }}>
                  <TextField
                    select
                    size="small"
                    value={lead.status}
                    onChange={(event) =>
                      statusMutation.mutate({ id: lead._id, status: event.target.value })
                    }
                    fullWidth
                  >
                    {(options?.statuses || []).map((item) => (
                      <MenuItem key={item} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </TextField>
                </TableCell>
                <TableCell>{lead.assignedTo?.name}</TableCell>
                <TableCell>{lead.company?.name}</TableCell>
                <TableCell align="right">
                  <IconButton component={RouterLink} to={`/leads/${lead._id}/edit`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteMutation.mutate(lead._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Stack alignItems="flex-end" sx={{ mt: 2 }}>
        <Pagination
          count={data?.pagination?.totalPages || 1}
          page={page}
          onChange={(_event, value) => updateParams({ page: value })}
          color="primary"
        />
      </Stack>
    </>
  );
}
