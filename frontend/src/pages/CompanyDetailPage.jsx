import { useQuery } from "@tanstack/react-query";
import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

export function CompanyDetailPage() {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => (await api.get(`/companies/${id}`)).data,
  });

  return (
    <>
      <PageHeader title="Company Details" />
      <Stack spacing={3}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            {data?.company?.name}
          </Typography>
          <Typography>Industry: {data?.company?.industry}</Typography>
          <Typography>Location: {data?.company?.location}</Typography>
        </Paper>

        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Associated Leads
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Assigned To</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(data?.leads || []).map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>{lead.name}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.status}</TableCell>
                  <TableCell>{lead.assignedTo?.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Stack>
    </>
  );
}
