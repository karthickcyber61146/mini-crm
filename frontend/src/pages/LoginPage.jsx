import { useState } from "react";
import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(135deg, #dbeafe 0%, #f8fafc 50%, #ccfbf1 100%)",
        p: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 440, p: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          MINI CRM
        </Typography>
        <Typography color="text.secondary" align="center" sx={{ mb: 3 }}>
          Sign in to continue
        </Typography>

        <Stack component="form" spacing={2} onSubmit={handleSubmit}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          <TextField
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
          />
          <TextField
            label="Password"
            type="password"
            required
            value={form.password}
            onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          />
          <Button type="submit" variant="contained" size="large" disabled={loading}>
            Login
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
