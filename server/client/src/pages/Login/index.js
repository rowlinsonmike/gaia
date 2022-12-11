import * as React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Input from "components/Input";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import Container from "@mui/material/Container";
import { useForm, Controller } from "react-hook-form";
import { fetcher, login } from "auth";
import toast from "react-hot-toast";
import { ReactComponent as LogoSvg } from "assets/logo.svg";
import LoginBg from "assets/login-bg.svg";
import { NAME } from "constants";
export default function Login() {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const submitHandler = ({ username, password }) => {
    setLoading(true);
    let opts = {
      username,
      password,
    };
    fetcher("/api/login", {
      method: "post",
      body: JSON.stringify(opts),
    })
      .then((token) => {
        if (token.access_token) {
          login(token);
          setTimeout(() => {
            setLoading(false);
          }, 100);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        toast.error("Failed Login Attempt");
        setLoading(false);
      });
  };

  return (
    <Container
      sx={{
        backgroundImage: `url(${LoginBg})`,
        backgroundSize: "cover",
        height: "100vh",
        width: "100vw !important",
        maxWidth: "100vw !important",
        overflow: "hidden",
        transformOrigin: "top",
      }}
      component="main"
    >
      <CssBaseline />
      <Stack
        sx={{ height: "100%" }}
        alignItems="center"
        justifyContent="center"
      >
        <Card
          sx={{
            width: "500px",
            background: "hsla(0,0%,1%,0.76)",
          }}
          variant="outlined"
        >
          <Stack p={3} alignItems="center" spacing={2}>
            <LogoSvg height="200" width="200" />
            <Typography variant="h3">{NAME}</Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(submitHandler)}
            >
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <Input
                    margin="normal"
                    fullWidth
                    label="User Name"
                    autoComplete="none"
                    autoFocus
                    {...field}
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    margin="normal"
                    fullWidth
                    label="Password"
                    type="password"
                    autoComplete="none"
                    {...field}
                  />
                )}
              />
              <LoadingButton
                fullWidth
                sx={{ mt: 3, color: "#fff", fontWeight: "bold" }}
                size="large"
                color="secondary"
                type="submit"
                variant="contained"
                loading={loading}
              >
                Login
              </LoadingButton>
            </Box>
          </Stack>
        </Card>
      </Stack>
    </Container>
  );
}
