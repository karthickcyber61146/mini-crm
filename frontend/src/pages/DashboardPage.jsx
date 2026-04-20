import { useQuery } from "@tanstack/react-query";
import Grid from "@mui/material/Grid2";
import { Paper, Typography } from "@mui/material";
import { api } from "../api/client";
import { PageHeader } from "../components/PageHeader";

const cardOrder = [
  { key: "totalLeads", label: "Total Leads" },
  { key: "qualifiedLeads", label: "Qualified Leads" },
  { key: "tasksDueToday", label: "Tasks Due Today" },
  { key: "completedTasks", label: "Completed Tasks" },
];

export function DashboardPage() {
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await api.get("/dashboard");
      return response.data;
    },
  });

  return (
    <>
      <PageHeader title="Dashboard" />
      <Grid container spacing={3}>
        {cardOrder.map((card) => (
          <Grid size={{ xs: 12, md: 6 }} key={card.key}>
            <Paper sx={{ p: 3 }}>
              <Typography color="text.secondary" sx={{ mb: 1 }}>
                {card.label}
              </Typography>
              <Typography variant="h4">{data?.[card.key] ?? 0}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
}
