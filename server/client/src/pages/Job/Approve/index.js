import * as React from "react";
import Input from "components/Input";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import { useForm, Controller } from "react-hook-form";
import { fetcher } from "auth";
import toast from "react-hot-toast";

export default function Approve({ close, id }) {
  const [loading, setLoading] = React.useState(false);
  const submitHandler = () => {
    setLoading(true);
    fetcher(`/api/job?id=${id}`, {
      method: "post",
    }).then(({ error }) => {
      if (error) toast.error(error);
      toast.success("applying job now");
      close();
    });
  };

  return (
    <Stack p={3} alignItems="center" spacing={2}>
      <Typography variant="h5">Run Terraform Apply against Job?</Typography>
      <Box component="form" noValidate>
        <LoadingButton
          fullWidth
          sx={{ mt: 3, color: "#fff", fontWeight: "bold" }}
          size="large"
          color="error"
          type="submit"
          variant="contained"
          onClick={submitHandler}
          loading={loading}
        >
          Apply
        </LoadingButton>
      </Box>
    </Stack>
  );
}
