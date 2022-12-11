import React from "react";
import { Button, Stack, IconButton, Icon, Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Modal from "components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import { fetcher } from "auth";
import NewJob from "./NewJob";
export default function Project() {
  const { id } = useParams();
  const [project, setProject] = React.useState({});
  const [edit, setEdit] = React.useState(false);
  const openEdit = () => setEdit(true);
  const closeEdit = () => setEdit(false);
  const navigate = useNavigate();
  const fetchProject = () => {
    fetcher(`/api/project/${id}`).then((data) => setProject(data || {}));
  };
  const goToJob = (id) => () => navigate(`job/${id}`);
  React.useEffect(() => {
    fetchProject();
  }, []);
  const deleteProject = (id) => () => {
    fetcher(`/api/project/${id}`, { method: "delete" }).then(({ error }) => {
      if (error) return;
      navigate("/projects");
    });
  };
  return (
    <Stack alignItems="start" spacing={2}>
      <Modal
        {...{
          width: 500,
          forceOpen: edit,
          onClose: () => {
            closeEdit();
            fetchProject();
          },
        }}
      >
        {({ handleClose }) => <NewJob id={id} close={handleClose} />}
      </Modal>
      <Typography variant="h4" mb={2}>
        {project?.project?.name}
      </Typography>
      <Stack sx={{ width: "100%" }} direction="row" spacing={2}>
        <Button onClick={openEdit} variant="contained" color="secondary">
          Add Job
        </Button>
        <Button onClick={fetchProject} variant="contained">
          Refresh
        </Button>
        <IconButton
          onClick={deleteProject(id)}
          color="error"
          sx={{ marginLeft: "auto !important" }}
        >
          <Icon color="error">clear</Icon>
        </IconButton>
      </Stack>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Creation Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {project?.jobs?.map((row) => (
              <TableRow
                key={row.name}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell>{row.create}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell align="center">
                  <IconButton onClick={goToJob(row.pk)}>
                    <Icon>arrow_forward</Icon>
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
