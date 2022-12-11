import * as React from "react";
import Input from "components/Input";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { fetcher } from "auth";
import toast from "react-hot-toast";

export default function ResetPassword({ close }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      password: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const submitHandler = ({ password }) => {
    setLoading(true);
    let opts = {
      password,
    };
    fetcher(`/api/users/reset`, {
      method: "post",
      body: JSON.stringify(opts),
    }).then(({ error }) => {
      if (error) toast.error(error);
      toast.success("password reset");
      close();
    });
  };

  return (
    <Stack p={3} alignItems="center" spacing={2}>
      <Typography variant="h3">Reset Password</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
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
          Reset
        </LoadingButton>
      </Box>
    </Stack>
  );
}
