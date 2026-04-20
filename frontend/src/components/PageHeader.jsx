import { Box, Stack, Typography } from "@mui/material";

export function PageHeader({ title, action }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      alignItems={{ xs: "flex-start", sm: "center" }}
      justifyContent="space-between"
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Typography variant="h4">{title}</Typography>
      {action ? <Box>{action}</Box> : null}
    </Stack>
  );
}
