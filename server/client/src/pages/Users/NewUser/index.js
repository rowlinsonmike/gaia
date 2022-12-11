import * as React from "react";
import Input from "components/Input";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { fetcher } from "auth";
import toast from "react-hot-toast";

export default function NewUser({ close }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      username: "",
      first: "",
      last: "",
      password: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const submitHandler = ({ username, first, last, password }) => {
    setLoading(true);
    let opts = {
      username,
      first,
      last,
      password,
    };
    fetcher("/api/users", {
      method: "post",
      body: JSON.stringify(opts),
    }).then(({ error }) => {
      if (error) toast.error(error);
      toast.success("user created");
      close();
    });
  };

  return (
    <Stack p={3} alignItems="center" spacing={2}>
      <Typography variant="h3">New User</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
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
          name="first"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="First Name"
              autoComplete="none"
              {...field}
            />
          )}
        />
        <Controller
          name="last"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="Last Name"
              autoComplete="none"
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
          Add User
        </LoadingButton>
      </Box>
    </Stack>
  );
}
