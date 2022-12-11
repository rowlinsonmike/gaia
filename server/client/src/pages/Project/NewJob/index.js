import * as React from "react";
import Input from "components/Input";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { fetcher } from "auth";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function NewJob({ close, id }) {
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const submitHandler = ({ name }) => {
    setLoading(true);
    let opts = {
      name,
    };
    fetcher(`/api/scan/${id}`, {
      method: "post",
      body: JSON.stringify(opts),
    }).then(({ error, id }) => {
      if (error) toast.error(error);
      toast.success("job created");
      navigate(`job/${id}`);
      close();
    });
  };

  return (
    <Stack p={3} alignItems="center" spacing={2}>
      <Typography variant="h3">Add Job</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="Job Name"
              placeholder="Create new service"
              autoComplete="none"
              autoFocus
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
          Add Job
        </LoadingButton>
      </Box>
    </Stack>
  );
}
