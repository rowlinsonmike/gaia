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

export default function NewProject({ close }) {
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: "",
      repo: "",
      path: "",
    },
  });
  const [loading, setLoading] = React.useState(false);
  const submitHandler = ({ name, repo, path }) => {
    setLoading(true);
    let opts = {
      name,
      repo,
      path,
    };
    fetcher("/api/project", {
      method: "post",
      body: JSON.stringify(opts),
    }).then(({ error }) => {
      if (error) toast.error(error);
      toast.success("project created");
      close();
    });
  };

  return (
    <Stack p={3} alignItems="center" spacing={2}>
      <Typography variant="h3">Add Project</Typography>
      <Box component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="Project Name"
              placeholder="Cloud Engineering"
              autoComplete="none"
              autoFocus
              {...field}
            />
          )}
        />
        <Controller
          name="repo"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="CodeCommit Project Name"
              placeholder="codecommit1"
              autoComplete="none"
              autoFocus
              {...field}
            />
          )}
        />
        <Controller
          name="path"
          control={control}
          render={({ field }) => (
            <Input
              margin="normal"
              fullWidth
              label="Repo Path"
              placeholder="leave blank for root"
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
          Add Project
        </LoadingButton>
      </Box>
    </Stack>
  );
}
